// Kodjitsu — sohbet asistanı (tüm sayfalarda)
//
// Widget kendi stilini ve işaretlemesini sayfaya kendisi yerleştirir; her sayfaya
// tek satırla eklenir:
//
//   <script src="/assets/js/asistan.js" defer></script>
//
// Model anahtarı istemcide YOK: Supabase edge function 'sohbet' vekillik eder.
// Sistem promptu, karşılama metni ve açık/kapalı durumu sunucuda (agent_config)
// tutulur; asistan kapalıyken buton hiç görünmez.

/* ---------- yerleştirme ---------- */
(() => {
  "use strict";
  if (document.getElementById('sbAc')) return;   // iki kez yüklenirse çoğaltmasın

  // Renk/ölçü değişkenleri ana sayfada :root'tan gelir; diğer sayfalarda yedeği kullanılır.
  const STIL = `
:where(.sb,.sb-ac){--gut:clamp(20px,5vw,56px);--ink:#0F0F0F;--ink-2:#5B5B5B;
  --mercan:#FF5A2D;--ease:cubic-bezier(.22,.61,.36,1)}
.sb-ac{position:fixed;z-index:7;right:var(--gut);bottom:128px;width:52px;height:52px;border-radius:99px;
  border:none;cursor:pointer;display:none;place-items:center;color:#fff;background:var(--mercan);
  box-shadow:0 12px 30px -10px rgba(255,90,45,.75);transition:transform .2s var(--ease)}
.sb-ac.var{display:grid}
.sb-ac:hover{transform:translateY(-2px)}
.sb-ac:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.sb-ac .kapali{display:none}
.sb-ac.acikken .acik-ikon{display:none}
.sb-ac.acikken .kapali{display:block}

.sb{position:fixed;z-index:21;right:var(--gut);bottom:24px;width:min(380px,calc(100vw - 32px));
  height:min(560px,calc(100svh - 48px));background:#fff;border-radius:20px;display:flex;flex-direction:column;
  overflow:hidden;border:1px solid rgba(15,15,15,.08);box-shadow:0 30px 80px -20px rgba(15,15,15,.42);
  opacity:0;transform:translateY(14px) scale(.98);pointer-events:none;
  transition:opacity .25s var(--ease),transform .25s var(--ease)}
.sb.acik{opacity:1;transform:none;pointer-events:auto}
.sb-ust{display:flex;align-items:center;gap:.6rem;padding:13px 14px;border-bottom:1px solid rgba(15,15,15,.08)}
.sb-ust .yz{width:30px;height:30px;border-radius:99px;background:var(--mercan);color:#fff;display:grid;
  place-items:center;font-family:'Sora';font-weight:800;font-size:.85rem;flex:none}
.sb-ust b{font-family:'Sora';font-size:.94rem;flex:1;letter-spacing:-.01em}
.sb-kapat{width:30px;height:30px;border-radius:99px;border:none;cursor:pointer;background:rgba(15,15,15,.06);
  color:var(--ink);display:grid;place-items:center;flex:none}
.sb-kapat:hover{background:rgba(15,15,15,.12)}
.sb-akis{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:.6rem;overscroll-behavior:contain}
.sb-m{max-width:86%;padding:.62em .88em;border-radius:14px;font-size:.9rem;line-height:1.5;
  white-space:pre-wrap;overflow-wrap:anywhere}
.sb-m.bot{background:rgba(15,15,15,.055);border-bottom-left-radius:5px;align-self:flex-start}
.sb-m.ben{background:var(--ink);color:#fff;border-bottom-right-radius:5px;align-self:flex-end}
.sb-m.hata{background:rgba(255,90,45,.10);border:1px solid rgba(255,90,45,.32);color:#B23A17;align-self:flex-start}
.sb-yaz{align-self:flex-start;display:flex;gap:4px;padding:.85em .9em;border-radius:14px;
  border-bottom-left-radius:5px;background:rgba(15,15,15,.055)}
.sb-yaz i{width:6px;height:6px;border-radius:99px;background:rgba(15,15,15,.38);animation:sbNabiz 1.2s infinite}
.sb-yaz i:nth-child(2){animation-delay:.15s}
.sb-yaz i:nth-child(3){animation-delay:.3s}
@keyframes sbNabiz{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
.sb-alt{display:flex;gap:.5rem;padding:11px 12px 6px}
.sb-alt textarea{flex:1;resize:none;font:inherit;font-family:'Inter',sans-serif;font-size:.9rem;line-height:1.4;
  max-height:96px;color:var(--ink);background:#fff;border:1.5px solid rgba(15,15,15,.16);border-radius:12px;
  padding:.55em .8em;outline:none;transition:border-color .2s}
.sb-alt textarea:focus{border-color:var(--mercan)}
.sb-gonder{flex:none;width:40px;height:40px;align-self:flex-end;border-radius:12px;border:none;cursor:pointer;
  background:var(--mercan);color:#fff;display:grid;place-items:center;transition:opacity .2s}
.sb-gonder:disabled{opacity:.4;cursor:default}
.sb-not{margin:0;padding:0 14px 11px;font-size:.68rem;line-height:1.4;color:var(--ink-2);text-align:center}
.sb-not a{color:var(--ink-2)}
@media (max-width:860px){
  .sb-ac{right:14px;bottom:56px;width:46px;height:46px}
  .sb{right:0;left:0;bottom:0;width:100%;height:86svh;border-radius:20px 20px 0 0}
}
`;

  const MARKUP = `
<button class="sb-ac" id="sbAc" aria-label="Sohbeti aç" aria-expanded="false">
  <svg class="acik-ikon" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.6a8 8 0 0 1-8.6 8 9.6 9.6 0 0 1-3.9-.8L3.5 20.5l1.7-4.4a8 8 0 0 1 6.7-12.5 8 8 0 0 1 8.6 8z"/></svg>
  <svg class="kapali" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
</button>

<div class="sb" id="sb" role="dialog" aria-modal="true" aria-label="Kodjitsu asistanı">
  <div class="sb-ust">
    <span class="yz">k</span>
    <b id="sbAd">Kodjitsu Asistan</b>
    <button class="sb-kapat" id="sbKapat" type="button" aria-label="Kapat">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
    </button>
  </div>
  <div class="sb-akis" id="sbAkis" aria-live="polite"></div>
  <form class="sb-alt" id="sbForm">
    <textarea id="sbGirdi" rows="1" maxlength="1000" placeholder="Sorunuzu yazın…" aria-label="Mesajınız"></textarea>
    <button class="sb-gonder" id="sbGonder" type="submit" aria-label="Gönder">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
    </button>
  </form>
  <p class="sb-not">Yapay zekâ asistanı, hata yapabilir. Kesin bilgi için <a href="/kayit/">kayıt formunu</a> bırakın.</p>
</div>
`;

  const stil = document.createElement('style');
  stil.id = 'sbStil';
  stil.textContent = STIL;
  document.head.appendChild(stil);

  const kap = document.createElement('template');
  kap.innerHTML = MARKUP;
  document.body.appendChild(kap.content);
})();

/* ---------- davranış ---------- */
(() => {
  "use strict";
  /* Sohbet asistani — istemcide model anahtari YOK.
     Supabase edge function 'sohbet' vekillik eder; sistem promptu
     ve ayarlar sunucuda kalir. Widget yalniz asistan aciksa gorunur. */
  const UC = 'https://vbkjkpkogccspccecase.supabase.co/functions/v1/sohbet';
  const $ = (id) => document.getElementById(id);
  const ac = $('sbAc'), panel = $('sb'), akis = $('sbAkis'), girdi = $('sbGirdi'), gonderBtn = $('sbGonder');

  const HATA = {
    'kapali':       'Asistan şu an kapalı. Sorularınız için kayıt formunu bırakabilirsiniz.',
    'anahtar-yok':  'Asistan şu an yanıt veremiyor. Kayıt formunu bırakırsanız size dönelim.',
    'gunluk-sinir': 'Bugünlük soru hakkınız doldu. Yarın yine bekleriz; acelesi varsa kayıt formunu bırakın.',
    'site-sinir':   'Asistan şu an çok yoğun. Biraz sonra tekrar deneyin.',
    'model':        'Şu an bağlanamadım. Birazdan tekrar deneyin.',
    'bos-yanit':    'Bir şey ters gitti. Sorunuzu bir daha yazar mısınız?',
    'sunucu':       'Şu an bağlanamadım. Birazdan tekrar deneyin.'
  };

  const sid = (() => {
    try {
      let s = sessionStorage.getItem('kj-sohbet');
      if (!s) { s = (crypto.randomUUID ? crypto.randomUUID() : 's' + Date.now() + Math.random().toString(36).slice(2, 10)); sessionStorage.setItem('kj-sohbet', s); }
      return s;
    } catch (e) { return 's' + Date.now(); }
  })();

  let gecmis = [], mesgul = false, karsilama = '', acildi = false;

  /* model bazen markdown yaziyor: yildizlar duz metin olarak gorunmesin.
     Once HTML kacisi, sonra yalniz kalin/italik — enjeksiyon yolu yok. */
  const kacir = (s) => s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const bicimle = (s) => kacir(s)
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>')
    .replace(/^\s*[-*]\s+/gm, '• ');

  const ekle = (metin, tur) => {
    const d = document.createElement('div');
    d.className = 'sb-m ' + tur;
    if (tur === 'bot') d.innerHTML = bicimle(metin); else d.textContent = metin;
    akis.appendChild(d);
    akis.scrollTop = akis.scrollHeight;
    return d;
  };
  const yaziyor = () => {
    const d = document.createElement('div');
    d.className = 'sb-yaz';
    d.innerHTML = '<i></i><i></i><i></i>';
    akis.appendChild(d); akis.scrollTop = akis.scrollHeight;
    return d;
  };

  /* asistan acik mi? kapaliysa buton hic gorunmez */
  fetch(UC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'config' }) })
    .then(r => r.json())
    .then(c => {
      if (!c || c.enabled !== true) return;
      $('sbAd').textContent = c.bot_name || 'Kodjitsu Asistan';
      girdi.placeholder = c.placeholder || 'Sorunuzu yazın…';
      karsilama = c.greeting || '';
      ac.classList.add('var');
    })
    .catch(() => {});

  const kilitle = (kilit) => {
    document.body.classList.toggle('perde-acik', kilit);
    document.documentElement.style.overflow = kilit ? 'hidden' : '';
  };
  const acKapa = (acilsin) => {
    panel.classList.toggle('acik', acilsin);
    ac.classList.toggle('acikken', acilsin);
    ac.setAttribute('aria-expanded', String(acilsin));
    kilitle(acilsin);
    if (acilsin) {
      if (!acildi) { acildi = true; if (karsilama) ekle(karsilama, 'bot'); }
      if (!matchMedia('(max-width:860px)').matches) setTimeout(() => girdi.focus(), 120);
    }
  };
  ac.addEventListener('click', () => acKapa(!panel.classList.contains('acik')));
  $('sbKapat').addEventListener('click', () => acKapa(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('acik')) acKapa(false); });

  girdi.addEventListener('input', () => { girdi.style.height = 'auto'; girdi.style.height = Math.min(96, girdi.scrollHeight) + 'px'; });
  girdi.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('sbForm').requestSubmit(); }
  });

  $('sbForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const metin = girdi.value.trim();
    if (!metin || mesgul) return;
    mesgul = true; gonderBtn.disabled = true;
    girdi.value = ''; girdi.style.height = 'auto';
    ekle(metin, 'ben');
    gecmis.push({ role: 'user', content: metin });
    const bekleme = yaziyor();
    try {
      const kes = new AbortController();
      const zaman = setTimeout(() => kes.abort(), 50000);
      const r = await fetch(UC, {
        method: 'POST', signal: kes.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', sid, messages: gecmis.slice(-12) })
      });
      clearTimeout(zaman);
      const veri = await r.json().catch(() => ({}));
      bekleme.remove();
      if (r.ok && veri.reply) {
        ekle(veri.reply, 'bot');
        gecmis.push({ role: 'assistant', content: veri.reply });
      } else {
        ekle(HATA[veri.hata] || HATA.sunucu, 'hata');
      }
    } catch (err) {
      bekleme.remove();
      ekle(HATA.sunucu, 'hata');
    } finally {
      mesgul = false; gonderBtn.disabled = false;
      akis.scrollTop = akis.scrollHeight;
    }
  });
})();
