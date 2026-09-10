// Kodjitsu — kurs kartları ve ders detay sayfaları
//
// Her kurs 2 sayfa: 1) kapak kartı  2) ders detayı.
// Çıktılar:
//   assets/kartlar/<slug>.png                 → kapak (Instagram 4:5, 1080x1350)
//   assets/kartlar/<slug>-detay.png           → ders detayı
//   assets/kartlar/Kodjitsu-Kurs-Katalogu.pdf → hepsi tek dosyada
//
// Kullanım: node scripts/kurs-kartlari.js
//
// KAYNAK VE DOĞRULUK NOTU
// Yaş / ders sayısı / süre / program bilgileri "Kurslarımız" dokümanından alındı.
// Doküman Kodland kaynaklı olduğu için metinler birebir kopyalanmadı; olgular
// (yaş, ders adedi, araçlar, proje türleri) korunarak Kodjitsu diliyle yeniden yazıldı.
// Dokümanda ayrıntısı olmayan kurslar (FunTech, Soft Skills) `taslak: true` ile
// işaretlidir — içerik onaylanmadan basılmamalı. Python ve Matematik içeriği
// sitedeki kendi kurs sayfalarımızdan gelir.

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const root = path.join(__dirname, '..');
// Bagimliliklar proje disinda da kurulu olabiliyor; sirayla aranir.
const yukle = ad => {
  const yerler = [ad, path.join(os.homedir(), 'node_modules', ad), path.join(root, 'node_modules', ad)];
  for (const y of yerler) { try { return require(y); } catch { /* sonrakini dene */ } }
  throw new Error(`${ad} bulunamadi. Kurmak icin: npm i ${ad}`);
};
const puppeteer = yukle('puppeteer-core');
const sharp = yukle('sharp');

const out = path.join(root, 'assets', 'kartlar');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].find(p => fs.existsSync(p));

const FONTLAR = fs.readFileSync(path.join(root, 'assets', 'fonts', 'kart-fontlari.css'), 'utf8');

// Kurs verisi tek kaynaktan gelir; sayfa üreteci de aynı dosyayı kullanır.
const { kartlik } = require('./kurslar-veri.js');
const kartlar = kartlik().map(k => ({
  slug: k.slug,
  acc: k.kartAcc || k.acc,
  eyebrow: k.eyebrow,
  title: k.name,
  sub: k.sub,
  taslak: k.taslak,
  art: k.art,
  desc: k.kart.desc,
  detayGiris: k.kart.detayGiris,
  olgular: k.olgular,
  araclar: k.araclar,
  ogrenir: k.ogrenir,
  uretir: k.uretir,
  kazanim: k.kazanim
}));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ORTAK = `<style>${FONTLAR}
  *{margin:0;padding:0;box-sizing:border-box}
  .sayfa{width:1080px;height:1350px;background:#fff;font-family:'Inter',sans-serif;color:#0F0F0F;
         display:flex;flex-direction:column;overflow:hidden}
  .ust{display:flex;align-items:center;justify-content:space-between}
  .mark{font-family:'Sora';font-weight:800;font-size:38px;letter-spacing:-.035em}
  .mark i{font-style:normal;color:#FF5A2D}
  .rozet{font-family:'Sora';font-weight:700;font-size:16px;letter-spacing:.16em;text-transform:uppercase;
         color:#fff;background:var(--acc);border-radius:99px;padding:9px 20px}
  .eyebrow{font-family:'Sora';font-weight:700;font-size:19px;letter-spacing:.18em;text-transform:uppercase;
           color:var(--acc);display:flex;align-items:center;gap:14px}
  .eyebrow::before{content:"";width:34px;height:3px;border-radius:3px;background:var(--acc)}
  .alt{display:flex;align-items:center;justify-content:space-between;padding-top:22px;
       border-top:3px solid var(--acc);font-family:'Sora';font-weight:600;font-size:19px;color:#5B5B5B}
  .alt b{color:#0F0F0F;font-weight:700}

  /* ---- kapak ---- */
  .kapak{padding:60px 66px 54px}
  .kapak .gorsel{flex:1;display:flex;align-items:center;justify-content:center;margin:8px -18px 0;min-height:0}
  .kapak .gorsel img{max-width:100%;max-height:100%;object-fit:contain}
  .kapak h1{font-family:'Sora';font-weight:800;font-size:80px;letter-spacing:-.035em;line-height:.98;margin-top:12px}
  .kapak h1 span{color:#8A8A8A;font-size:40px;letter-spacing:-.02em;display:inline-block;margin-left:14px;vertical-align:middle}
  .kapak .desc{font-size:26px;line-height:1.4;color:#5B5B5B;margin-top:14px;max-width:40ch;letter-spacing:-.01em}
  .kapak .olgular{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:24px}
  .kapak .olgular div{border:1.7px solid rgba(15,15,15,.14);border-radius:16px;padding:13px 14px}
  .kapak .olgular b{font-family:'Sora';font-weight:800;font-size:21px;display:block;letter-spacing:-.02em;line-height:1.15}
  .kapak .olgular span{font-family:'Sora';font-weight:600;font-size:14px;color:#8A8A8A;letter-spacing:.06em;
                       text-transform:uppercase;display:block;margin-top:5px}
  .kapak .araclar{margin-top:16px;font-size:19px;color:#5B5B5B;line-height:1.4}
  .kapak .araclar span{font-family:'Sora';font-weight:700;color:var(--acc);font-size:14px;letter-spacing:.12em;
                       text-transform:uppercase;margin-right:10px}
  .kapak .alt{margin-top:20px}

  /* ---- ders detayı ---- */
  .detay{padding:56px 66px 50px}
  .detay .d-bas{margin-top:30px}
  .detay h2{font-family:'Sora';font-weight:800;font-size:62px;letter-spacing:-.035em;line-height:1;margin-top:12px}
  .detay h2 em{font-style:normal;color:#8A8A8A;font-size:32px}
  .detay .d-giris{font-size:24px;line-height:1.42;color:#5B5B5B;margin-top:12px;max-width:46ch}
  .detay .d-golge{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:22px;
                  background:#FAFAF8;border-radius:18px;padding:16px 20px}
  .detay .d-golge span{font-family:'Sora';font-weight:600;font-size:13px;color:#8A8A8A;letter-spacing:.08em;
                       text-transform:uppercase;display:block}
  .detay .d-golge b{font-family:'Sora';font-weight:800;font-size:20px;letter-spacing:-.02em;display:block;margin-top:3px}
  .detay .d-bolum{margin-top:26px}
  .detay h3{font-family:'Sora';font-weight:700;font-size:16px;letter-spacing:.16em;text-transform:uppercase;
            color:var(--acc);margin-bottom:14px}
  .detay .d-liste{display:grid;gap:13px}
  .detay .d-sat{display:flex;gap:15px;align-items:flex-start}
  .detay .d-sat i{font-family:'Sora';font-style:normal;font-weight:800;font-size:15px;color:var(--acc);
                  border:2px solid var(--acc);border-radius:50%;width:32px;height:32px;flex:0 0 32px;
                  display:flex;align-items:center;justify-content:center;margin-top:2px}
  .detay .d-sat b{font-family:'Sora';font-weight:700;font-size:22px;letter-spacing:-.015em;display:block}
  .detay .d-sat p{font-size:19px;line-height:1.38;color:#5B5B5B;margin-top:2px}
  .detay .d-ikili{display:grid;grid-template-columns:1fr 1.2fr;gap:34px}
  .detay .nasil{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:auto;padding-top:26px}
  .detay .nasil div{border-top:2px solid var(--acc);padding-top:12px}
  .detay .nasil b{font-family:'Sora';font-weight:700;font-size:18px;display:block;letter-spacing:-.01em}
  .detay .nasil span{font-size:16px;color:#5B5B5B;display:block;margin-top:3px;line-height:1.3}
  .detay .d-cip{list-style:none;display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start}
  .detay .d-cip li{font-family:'Sora';font-weight:600;font-size:17px;border:1.7px solid rgba(15,15,15,.15);
                   border-radius:99px;padding:8px 15px}
  .detay .d-kaz{display:grid;gap:11px}
  .detay .d-kaz b{font-family:'Sora';font-weight:700;font-size:19px;display:block}
  .detay .d-kaz p{font-size:17px;line-height:1.36;color:#5B5B5B;margin-top:2px}
  .detay .alt{margin-top:20px;font-size:17px}

  /* ---- yatay kart (16:9, 2560x1440) — iki sayfanın bilgisi tek karede ---- */
  .yatay{width:2560px;height:1440px;padding:86px 96px 76px;display:flex;flex-direction:column}
  .yatay .mark{font-size:60px}
  .yatay .rozet{font-size:24px;padding:13px 30px}
  .yatay .eyebrow{font-size:27px;gap:18px}
  .yatay .eyebrow::before{width:48px;height:4px}
  .yatay .y-govde{display:grid;grid-template-columns:1.04fr 1fr;gap:84px;flex:1;min-height:0;margin-top:34px}
  .yatay .y-sol{display:flex;flex-direction:column;min-height:0}
  .yatay h1{font-family:'Sora';font-weight:800;font-size:118px;letter-spacing:-.035em;line-height:.96;margin-top:18px}
  .yatay h1 span{color:#8A8A8A;font-size:56px;letter-spacing:-.02em;display:inline-block;margin-left:20px;vertical-align:middle}
  .yatay .desc{font-size:36px;line-height:1.4;color:#5B5B5B;margin-top:20px;letter-spacing:-.01em}
  .yatay .gorsel{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;margin:14px 0 6px}
  .yatay .gorsel img{max-width:100%;max-height:100%;object-fit:contain}
  .yatay .olgular{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .yatay .olgular div{border:2px solid rgba(15,15,15,.14);border-radius:20px;padding:16px 18px}
  .yatay .olgular b{font-family:'Sora';font-weight:800;font-size:29px;display:block;letter-spacing:-.02em;line-height:1.12}
  .yatay .olgular span{font-family:'Sora';font-weight:600;font-size:18px;color:#8A8A8A;letter-spacing:.06em;
                       text-transform:uppercase;display:block;margin-top:6px}
  .yatay .araclar{margin-top:18px;font-size:27px;color:#5B5B5B;line-height:1.35}
  .yatay .araclar span{font-family:'Sora';font-weight:700;color:var(--acc);font-size:19px;letter-spacing:.12em;
                       text-transform:uppercase;margin-right:14px}
  .yatay .y-sag{display:flex;flex-direction:column;min-height:0}
  .yatay h3{font-family:'Sora';font-weight:700;font-size:22px;letter-spacing:.16em;text-transform:uppercase;
            color:var(--acc);margin-bottom:20px}
  .yatay .d-liste{display:grid;gap:20px}
  .yatay .d-sat{display:flex;gap:20px;align-items:flex-start}
  .yatay .d-sat i{font-family:'Sora';font-style:normal;font-weight:800;font-size:21px;color:var(--acc);
                  border:3px solid var(--acc);border-radius:50%;width:46px;height:46px;flex:0 0 46px;
                  display:flex;align-items:center;justify-content:center;margin-top:2px}
  .yatay .d-sat b{font-family:'Sora';font-weight:700;font-size:32px;letter-spacing:-.015em;display:block}
  .yatay .d-sat p{font-size:26px;line-height:1.36;color:#5B5B5B;margin-top:4px}
  .yatay .y-ikili{display:grid;grid-template-columns:1fr 1.1fr;gap:44px;margin-top:38px}
  .yatay .d-cip{list-style:none;display:flex;flex-wrap:wrap;gap:11px;align-content:flex-start}
  .yatay .d-cip li{font-family:'Sora';font-weight:600;font-size:24px;border:2px solid rgba(15,15,15,.15);
                   border-radius:99px;padding:11px 21px}
  .yatay .d-kaz{display:grid;gap:16px}
  .yatay .d-kaz b{font-family:'Sora';font-weight:700;font-size:27px;display:block}
  .yatay .d-kaz p{font-size:24px;line-height:1.34;color:#5B5B5B;margin-top:3px}
  .yatay .nasil{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:40px}
  .yatay .nasil div{border-top:3px solid var(--acc);padding-top:16px}
  .yatay .nasil b{font-family:'Sora';font-weight:700;font-size:26px;display:block;letter-spacing:-.01em}
  .yatay .nasil span{font-size:22px;color:#5B5B5B;display:block;margin-top:4px;line-height:1.3}
  .yatay .alt{margin-top:30px;padding-top:26px;font-size:25px;border-top-width:4px}
</style>`;


// 1. sayfa — kapak kartı
const kapak = k => `<div class="sayfa kapak" style="--acc:${k.acc}">
  <div class="ust"><div class="mark">kod<i>jitsu</i></div><div class="rozet">Kurs</div></div>
  <div class="gorsel"><img src="${k.artUri}" alt=""></div>
  <div class="eyebrow">${esc(k.eyebrow)}</div>
  <h1>${esc(k.title)}${k.sub ? `<span>${esc(k.sub)}</span>` : ''}</h1>
  <p class="desc">${esc(k.desc)}</p>
  <div class="olgular">${k.olgular.map(([e, d]) => `<div><b>${esc(d)}</b><span>${esc(e)}</span></div>`).join('')}</div>
  <div class="araclar"><span>Araçlar</span>${esc(k.araclar)}</div>
  <div class="alt"><span>Online canlı ders · küçük grup · dönem sonu Gösterim Günü</span><b>kodjitsu.com</b></div>
</div>`;

// 2. sayfa — ders detayı
const detay = k => `<div class="sayfa detay" style="--acc:${k.acc}">
  <div class="ust"><div class="mark">kod<i>jitsu</i></div><div class="rozet">Ders detayı</div></div>
  <div class="d-bas">
    <div class="eyebrow">${esc(k.eyebrow)}</div>
    <h2>${esc(k.title)}${k.sub ? ` <em>${esc(k.sub)}</em>` : ''}</h2>
    <p class="d-giris">${esc(k.detayGiris)}</p>
  </div>
  <div class="d-golge">${k.olgular.map(([e, d]) => `<div><span>${esc(e)}</span><b>${esc(d)}</b></div>`).join('')}</div>
  <div class="d-bolum">
    <h3>Derste ne öğrenir</h3>
    <div class="d-liste">${k.ogrenir.map(([b, a], i) => `<div class="d-sat"><i>${i + 1}</i><div><b>${esc(b)}</b><p>${esc(a)}</p></div></div>`).join('')}</div>
  </div>
  <div class="d-ikili">
    <div class="d-bolum"><h3>Neler üretir</h3>
      <ul class="d-cip">${k.uretir.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div>
    <div class="d-bolum"><h3>Dönem sonunda</h3>
      <div class="d-kaz">${k.kazanim.map(([b, a]) => `<div><b>${esc(b)}</b><p>${esc(a)}</p></div>`).join('')}</div></div>
  </div>
  <div class="nasil"><div><b>Canlı ders</b><span>Haftada bir saat, mentorla</span></div><div><b>Sabit mentor</b><span>Paket boyunca değişmez</span></div><div><b>AI ile Düşünmek</b><span>Her derste 10 dakika</span></div><div><b>Gösterim Günü</b><span>Dönem sonu, aile davetli</span></div></div>
  <div class="alt"><span>14 kişilik 500 TL · 6 kişilik 800 TL · birebir 1.100 TL &nbsp;·&nbsp; paketler 8–128 ders</span><b>kodjitsu.com</b></div>
</div>`;

// Yatay kart — kapak + detay bilgisinin tamamı tek 16:9 karede
const yatay = k => `<div class="sayfa yatay" style="--acc:${k.acc}">
  <div class="ust"><div class="mark">kod<i>jitsu</i></div><div class="rozet">${esc(k.eyebrow)}</div></div>
  <div class="y-govde">
    <div class="y-sol">
      <div class="eyebrow">Kodjitsu eğitim paketi</div>
      <h1>${esc(k.title)}${k.sub ? `<span>${esc(k.sub)}</span>` : ''}</h1>
      <p class="desc">${esc(k.desc)}</p>
      <div class="gorsel"><img src="${k.artUri}" alt=""></div>
      <div class="olgular">${k.olgular.map(([e, d]) => `<div><b>${esc(d)}</b><span>${esc(e)}</span></div>`).join('')}</div>
      <div class="araclar"><span>Araçlar</span>${esc(k.araclar)}</div>
    </div>
    <div class="y-sag">
      <h3>Derste ne öğrenir</h3>
      <div class="d-liste">${k.ogrenir.map(([b, a], i) => `<div class="d-sat"><i>${i + 1}</i><div><b>${esc(b)}</b><p>${esc(a)}</p></div></div>`).join('')}</div>
      <div class="y-ikili">
        <div><h3>Neler üretir</h3><ul class="d-cip">${k.uretir.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div>
        <div><h3>Dönem sonunda</h3><div class="d-kaz">${k.kazanim.map(([b, a]) => `<div><b>${esc(b)}</b><p>${esc(a)}</p></div>`).join('')}</div></div>
      </div>
      <div class="nasil">
        <div><b>Canlı ders</b><span>Haftada bir saat, mentorla</span></div>
        <div><b>Sabit mentor</b><span>Paket boyunca değişmez</span></div>
        <div><b>AI ile Düşünmek</b><span>Her derste 10 dakika</span></div>
        <div><b>Gösterim Günü</b><span>Dönem sonu, aile davetli</span></div>
      </div>
      <div class="alt"><span>14 kişilik 500 TL · 6 kişilik 800 TL · birebir 1.100 TL &nbsp;·&nbsp; paketler 8–128 ders</span><b>kodjitsu.com</b></div>
    </div>
  </div>
</div>`;

const belge = (icerik, en = 1080, boy = 1350) => `<!doctype html><html lang="tr"><head><meta charset="utf-8">${ORTAK}
<style>@page{size:${en}px ${boy}px;margin:0}.sayfa{break-after:page}.sayfa:last-child{break-after:auto}</style>
</head><body>${icerik}</body></html>`;

(async () => {
  if (!CHROME) throw new Error('Chrome/Edge bulunamadı — basım için gerekli.');
  fs.mkdirSync(out, { recursive: true });
  for (const k of kartlar) {
    k.artUri = 'data:image/jpeg;base64,' +
      fs.readFileSync(path.join(root, 'assets', 'landing', k.art)).toString('base64');
  }

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });

  for (const k of kartlar) {
    for (const [ek, html] of [['', kapak(k)], ['-detay', detay(k)]]) {
      await page.setContent(belge(html), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 } });
      await sharp(png).resize(1080, 1350).png({ compressionLevel: 9, palette: true, quality: 92 })
        .toFile(path.join(out, `${k.slug}${ek}.png`));
      console.log(`✓ ${k.slug}${ek}.png`);
    }
  }

  // Yatay kartlar — 16:9, 2560x1440 (2K). Tek karede kapak + detay bilgisi.
  const yOut = path.join(out, 'yatay');
  fs.mkdirSync(yOut, { recursive: true });
  await page.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });
  // Icerigi yogun kurslarda (ornegin Tasarim) sag sutun tasabiliyor; zoom ile sigdiriyoruz.
  const sigdir = () => page.evaluate(() => {
    const sut = document.querySelector('.y-sag');
    if (!sut) return 1;
    for (let z = 1; z >= 0.82; z -= 0.02) {
      sut.style.zoom = String(z);
      if (sut.scrollHeight <= sut.clientHeight + 1) return z;
    }
    return 0.82;
  });

  for (const k of kartlar) {
    await page.setContent(belge(yatay(k), 2560, 1440), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const z = await sigdir();
    if (z < 1) console.log(`  · ${k.slug}: sağ sütun %${Math.round(z * 100)} ölçekle sığdırıldı`);
    const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 2560, height: 1440 } });
    await sharp(png).png({ compressionLevel: 9, palette: true, quality: 92 })
      .toFile(path.join(yOut, `${k.slug}-yatay.png`));
    console.log(`✓ yatay/${k.slug}-yatay.png`);
  }
  await page.setContent(belge(kartlar.map(yatay).join(''), 2560, 1440), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    for (const sut of document.querySelectorAll('.y-sag')) {
      for (let z = 1; z >= 0.82; z -= 0.02) {
        sut.style.zoom = String(z);
        if (sut.scrollHeight <= sut.clientHeight + 1) break;
      }
    }
  });
  await page.pdf({
    path: path.join(yOut, 'Kodjitsu-Kurs-Katalogu-Yatay.pdf'),
    width: '2560px', height: '1440px', printBackground: true, preferCSSPageSize: true
  });
  console.log('✓ yatay/Kodjitsu-Kurs-Katalogu-Yatay.pdf');
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });

  // Katalog: her kurs kapak + detay, tek PDF
  await page.setContent(belge(kartlar.map(k => kapak(k) + detay(k)).join('')), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(out, 'Kodjitsu-Kurs-Katalogu.pdf'),
    width: '1080px', height: '1350px', printBackground: true, preferCSSPageSize: true
  });
  console.log('✓ Kodjitsu-Kurs-Katalogu.pdf');

  await browser.close();
  const taslak = kartlar.filter(k => k.taslak).map(k => k.title);
  console.log(`\n${kartlar.length} kurs · ${kartlar.length * 2} sayfa → assets/kartlar/`);
  if (taslak.length) console.log(`UYARI — dokümanda ayrıntısı olmayan, onay bekleyen kurslar: ${taslak.join(', ')}`);
})();
