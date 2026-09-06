// Kodjitsu sohbet asistani — NVIDIA (OpenAI uyumlu) vekili.
// Model anahtari YALNIZ burada: NVIDIA_API_KEY_KJ (yedek: NVIDIA_API_KEY).
// Istemci anahtari hic gormez; ayarlar agent_config tablosundan okunur.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const NVIDIA_UC = "https://integrate.api.nvidia.com/v1/chat/completions";
const IZINLI = ["https://kodjitsu.com", "https://www.kodjitsu.com"];
const ADMIN_UID = "ad314a17-1411-4700-a001-1a2b3c4d5e6f";
const yerelMi = (o: string) => /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o);

/* Akil yurutme (reasoning) modelleri dusunce izini bazen cevabin icine
   koyuyor. Uc katmanli savunma:
   (1) sistem promptuna kapatma talimati,
   (2) istekte chat_template_kwargs.thinking = false,
   (3) gelen metinde <think> bloklarini ve Turkce olmayan dusunce
       paragraflarini kirp. */
const DUSUNME_KAPALI = [
  "",
  "BICIM KURALI: Dusunme adimlarini, plan yapmani ya da kendi kendine muhakemeni",
  "ASLA yazma. <think> gibi etiketler kullanma. Dogrudan kullaniciya soyleyecegin",
  "cevabi yaz ve her zaman Turkce yaz.",
].join("\n");

const TURKCE = /[çğıöşüÇĞİÖŞÜ]/;
const DUSUNCE_BASI = /^\s*(okay|alright|first|so|let me|the user|i need|i should|we need|hmm)\b/i;

function dusunceyiAt(ham: string) {
  let m = ham
    .replace(/<(think|thinking|reasoning|scratchpad)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?(think|thinking|reasoning|scratchpad)[^>]*>/gi, "")
    .trim();
  /* Bastaki paragraf Turkce degil ve dusunce agziyla basliyorsa dusunce izidir;
     ilk Turkce paragraftan itibari cevaptir. */
  const p = m.split(/\n\s*\n/);
  if (p.length > 1) {
    let i = 0;
    while (i < p.length - 1 && !TURKCE.test(p[i]) && DUSUNCE_BASI.test(p[i])) i++;
    if (i > 0) m = p.slice(i).join("\n\n").trim();
  }
  return m;
}

function basliklar(origin: string) {
  const izinli = IZINLI.includes(origin) || yerelMi(origin);
  return {
    "Access-Control-Allow-Origin": izinli ? origin : IZINLI[0],
    "Access-Control-Allow-Headers": "content-type, x-admin-token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
  };
}
const cevap = (govde: unknown, durum: number, origin: string) =>
  new Response(JSON.stringify(govde), { status: durum, headers: basliklar(origin) });

async function sha(metin: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(metin));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  if (req.method === "OPTIONS") return new Response("ok", { headers: basliklar(origin) });
  if (req.method !== "POST") return cevap({ hata: "yontem" }, 405, origin);

  const SUPA = Deno.env.get("SUPABASE_URL")!;
  const SRV = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const db = (yol: string, init: RequestInit = {}) =>
    fetch(`${SUPA}/rest/v1/${yol}`, {
      ...init,
      headers: { apikey: SRV, Authorization: `Bearer ${SRV}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    });

  try {
    const govde = await req.json().catch(() => ({}));
    const eylem = govde.action === "chat" ? "chat" : "config";

    const ayarRes = await db("agent_config?id=eq.1&select=*");
    const ayar = (await ayarRes.json())[0];
    if (!ayar) return cevap({ hata: "ayar-yok" }, 500, origin);

    // --- ayarlarin herkese acik kismi (sistem promptu ASLA gonderilmez) ---
    if (eylem === "config") {
      return cevap({
        enabled: ayar.enabled === true,
        bot_name: ayar.bot_name,
        greeting: ayar.greeting,
        placeholder: ayar.placeholder,
      }, 200, origin);
    }

    /* Yonetici mi? /admin panelindeki test kendi oturum jetonunu yollar.
       Dogrulanirsa asistan kapaliyken de deneme yapilabilir ve gunluk
       sinirlar isletilmez. */
    let yonetici = false;
    const jeton = req.headers.get("x-admin-token");
    if (jeton) {
      const u = await fetch(`${SUPA}/auth/v1/user`, {
        headers: { apikey: SRV, Authorization: `Bearer ${jeton}` },
      }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      yonetici = u?.id === ADMIN_UID;
    }

    // --- sohbet ---
    if (ayar.enabled !== true && !yonetici) return cevap({ hata: "kapali" }, 503, origin);

    // yapistirirken kacan bosluk/tirnak 401 sebebi olur: kirp
    const anahtarHam = Deno.env.get("NVIDIA_API_KEY_KJ") ?? Deno.env.get("NVIDIA_API_KEY") ?? "";
    const anahtar = anahtarHam.trim().replace(/^["']|["']$/g, "");
    if (!anahtar) return cevap({ hata: "anahtar-yok" }, 503, origin);
    const bicimTamam = anahtar.startsWith("nvapi-") && anahtar.length > 40;
    if (!bicimTamam) console.warn("anahtar bicimi supheli", JSON.stringify({ uzunluk: anahtar.length }));

    const gelen = Array.isArray(govde.messages) ? govde.messages : [];
    const temiz = gelen
      .filter((m: { role?: string; content?: unknown }) =>
        (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-Math.max(2, Math.min(30, ayar.history_limit)))
      .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    if (!temiz.length || temiz[temiz.length - 1].role !== "user") return cevap({ hata: "bos" }, 400, origin);

    const sid = typeof govde.sid === "string" ? govde.sid.slice(0, 64) : null;
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
    const ipHash = ip ? await sha(ip + SRV) : null;
    const gunBasi = new Date(Date.now() - 864e5).toISOString();

    // gunluk sinirlar: once bu ziyaretci, sonra site geneli (yonetici testi haric)
    if (!yonetici) {
      if (ipHash) {
        const r = await db(`chat_log?select=id&role=eq.user&ip_hash=eq.${ipHash}&created_at=gt.${gunBasi}&limit=${ayar.daily_limit}`);
        if (((await r.json()) as unknown[]).length >= ayar.daily_limit) return cevap({ hata: "gunluk-sinir" }, 429, origin);
      }
      const t = await db(`chat_log?select=id&role=eq.user&created_at=gt.${gunBasi}&limit=${ayar.total_limit}`);
      if (((await t.json()) as unknown[]).length >= ayar.total_limit) return cevap({ hata: "site-sinir" }, 429, origin);
    }

    // --- modele sor ---
    const temelGovde = {
      model: ayar.model,
      messages: [{ role: "system", content: ayar.system_prompt + DUSUNME_KAPALI }, ...temiz],
      temperature: Number(ayar.temperature),
      max_tokens: ayar.max_tokens,
      stream: false,
    };
    const kes = new AbortController();
    const zamanlayici = setTimeout(() => kes.abort(), 45000);
    const sor = (g: unknown) =>
      fetch(NVIDIA_UC, {
        method: "POST",
        signal: kes.signal,
        headers: { Authorization: `Bearer ${anahtar}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(g),
      });
    let yanit: Response;
    try {
      // once dusunme kapali iste; model bu parametreyi bilmiyorsa parametresiz tekrarla
      yanit = await sor({ ...temelGovde, chat_template_kwargs: { thinking: false } });
      if (yanit.status === 400) {
        console.warn("chat_template_kwargs reddedildi, parametresiz tekrar");
        yanit = await sor(temelGovde);
      }
    } finally {
      clearTimeout(zamanlayici);
    }

    if (!yanit.ok) {
      const detay = (await yanit.text()).slice(0, 400);
      console.error("nvidia hatasi", yanit.status, detay);
      const ipucu = yanit.status === 401
        ? (bicimTamam ? "Anahtar reddedildi, NVIDIA tarafinda gecerli mi bakin."
                      : "Gizli degiskendeki deger anahtar gibi durmuyor: nvapi- ile baslamali.")
        : yanit.status === 404 ? "Model adi bulunamadi. Model alanini kontrol edin."
        : "";
      return cevap({ hata: "model", durum: yanit.status, detay, ipucu }, 502, origin);
    }
    const sonuc = await yanit.json();
    const mesaj = sonuc?.choices?.[0]?.message;
    const metin = dusunceyiAt(mesaj?.content ?? "");
    if (!metin) return cevap({ hata: "bos-yanit" }, 502, origin);

    // kayit (admin panelinden okunur)
    await db("chat_log", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([
        { sid, ip_hash: ipHash, role: "user", content: temiz[temiz.length - 1].content, model: ayar.model },
        { sid, ip_hash: ipHash, role: "assistant", content: metin.slice(0, 8000), model: ayar.model },
      ]),
    }).catch(() => {});

    return cevap({ reply: metin }, 200, origin);
  } catch (e) {
    console.error("sohbet hatasi", e);
    return cevap({ hata: "sunucu" }, 500, origin);
  }
});
