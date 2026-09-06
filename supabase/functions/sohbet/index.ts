// Kodjitsu sohbet asistani — NVIDIA (OpenAI uyumlu) vekili.
// Model anahtari YALNIZ burada: NVIDIA_API_KEY gizli degiskeni.
// Istemci anahtari hic gormez; ayarlar agent_config tablosundan okunur.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const NVIDIA_UC = "https://integrate.api.nvidia.com/v1/chat/completions";
const IZINLI = ["https://kodjitsu.com", "https://www.kodjitsu.com"];
const yerelMi = (o: string) => /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o);

function basliklar(origin: string) {
  const izinli = IZINLI.includes(origin) || yerelMi(origin);
  return {
    "Access-Control-Allow-Origin": izinli ? origin : IZINLI[0],
    "Access-Control-Allow-Headers": "content-type",
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

    // --- sohbet ---
    if (ayar.enabled !== true) return cevap({ hata: "kapali" }, 503, origin);
    const anahtar = Deno.env.get("NVIDIA_API_KEY");
    if (!anahtar) return cevap({ hata: "anahtar-yok" }, 503, origin);

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

    // gunluk sinirlar: once bu ziyaretci, sonra site geneli
    if (ipHash) {
      const r = await db(`chat_log?select=id&role=eq.user&ip_hash=eq.${ipHash}&created_at=gt.${gunBasi}&limit=${ayar.daily_limit}`);
      if (((await r.json()) as unknown[]).length >= ayar.daily_limit) return cevap({ hata: "gunluk-sinir" }, 429, origin);
    }
    const t = await db(`chat_log?select=id&role=eq.user&created_at=gt.${gunBasi}&limit=${ayar.total_limit}`);
    if (((await t.json()) as unknown[]).length >= ayar.total_limit) return cevap({ hata: "site-sinir" }, 429, origin);

    // --- modele sor ---
    const kes = new AbortController();
    const zamanlayici = setTimeout(() => kes.abort(), 45000);
    let yanit: Response;
    try {
      yanit = await fetch(NVIDIA_UC, {
        method: "POST",
        signal: kes.signal,
        headers: { Authorization: `Bearer ${anahtar}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          model: ayar.model,
          messages: [{ role: "system", content: ayar.system_prompt }, ...temiz],
          temperature: Number(ayar.temperature),
          max_tokens: ayar.max_tokens,
          stream: false,
        }),
      });
    } finally {
      clearTimeout(zamanlayici);
    }

    if (!yanit.ok) {
      const detay = (await yanit.text()).slice(0, 400);
      console.error("nvidia hatasi", yanit.status, detay);
      return cevap({ hata: "model", durum: yanit.status, detay }, 502, origin);
    }
    const sonuc = await yanit.json();
    const mesaj = sonuc?.choices?.[0]?.message;
    const metin = (mesaj?.content ?? "").trim();
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
