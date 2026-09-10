// Kurs landing sayfalarını onaylı Python düzeninden üretir. Build adımı gerekmez.
//
// Kaynak sayfa: kurslar/python/index.html — düzen ve bileşenler oradan gelir.
// İçerik: scripts/kurslar-veri.js (kartlarla ortak tek kaynak).
// Çalıştır: node scripts/course-pages.js
const fs = require('node:fs');
const path = require('node:path');
const { kurslar, sayfalik } = require('./kurslar-veri.js');
const root = path.join(__dirname, '..');
const courses = sayfalik();

// Kaynakta onceki uretimden kalan kurs gezinmesi varsa cikarilir; sonda yeniden eklenir.
const source = fs.readFileSync(path.join(root, 'kurslar/python/index.html'), 'utf8')
  .replace(/<nav class="course-links"[\s\S]*?<\/nav>/, '');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Sayfa slug'i kurs slug'indan farkli olabilir (tasarim -> grafik-tasarim)
const yol = c => c.sayfaSlug || c.slug;
const navigation = `<nav class="course-links" aria-label="Diğer kurslar">${kurslar.map(c => [yol(c), c.name]).map(([slug, name]) => `<a href="/kurslar/${slug}/">${name}</a>`).join('')}</nav>`;


// Kategori sayfasında basamak listesi; alt kurs sayfasında üst kategoriye dönüş
const altKurslarBlok = c => {
  if (c.ustKategori) {
    const ust = kurslar.find(k => k.slug === c.ustKategori);
    return ust ? `<p class="ustkategori"><a href="/kurslar/${ust.slug}/">↑ ${ust.name} kategorisi</a></p>` : '';
  }
  if (!c.altKurslar) return '';
  return `<section class="altkurslar wrap section"><p class="eyebrow">BASAMAKLAR</p><h2>Yaşına uygun olandan başlar.</h2>`
    + `<p class="section-intro">${c.name} kategorisi altındaki dersler. Yaş bir başlangıç noktası; seviye, çocuğun ilgisi ve deneyimiyle birlikte belirlenir.</p><div class="altkurs-grid">`
    + c.altKurslar.map(([ad, kunye, aciklama, slug]) => {
        const govde = `<span class="altkurs-kunye">${escape(kunye)}</span><h3>${escape(ad)}</h3><p>${escape(aciklama)}</p>`;
        return slug
          ? `<a class="altkurs" href="/kurslar/${slug}/">${govde}<span class="altkurs-git">Ayrıntılı bilgi →</span></a>`
          : `<article class="altkurs">${govde}</article>`;
      }).join('')
    + `</div></section>`;
};

// Künye: yaş / seviye / ders adedi / süre + araçlar
const kunyeBlok = c => `<section class="kunye wrap" aria-label="Kurs künyesi"><dl>`
  + c.olgular.map(([e, d]) => `<div><dt>${escape(e)}</dt><dd>${escape(d)}</dd></div>`).join('')
  + `</dl><p class="kunye-araclar"><span>Araçlar</span>${escape(c.araclar)}</p></section>`;

// Dönem sonunda: kazanımlar
const kazanimBlok = c => `<section class="outcomes section wrap"><p class="eyebrow">DÖNEM SONUNDA</p><h2>Elinde ne kalır?</h2><div class="outcome-grid">`
  + c.kazanim.map(([b, a]) => `<article><h3>${escape(b)}</h3><p>${escape(a)}</p></article>`).join('')
  + `</div></section>`;

// Proje kartlarında yer almayan üretimler etiket olarak eklenir
const uretirBlok = c => {
  const kartta = c.sayfa.projects.map(([, baslik]) => baslik.toLocaleLowerCase('tr-TR'));
  const kalan = c.uretir.filter(u => !kartta.some(b => u.toLocaleLowerCase('tr-TR').includes(b) || b.includes(u.toLocaleLowerCase('tr-TR'))));
  if (!kalan.length) return '';
  return `<ul class="uretir-cips"><li>Ayrıca:</li>${kalan.map(u => `<li>${escape(u)}</li>`).join('')}</ul>`;
};

for (const c of courses) {
  const s = c.sayfa;
  const ad = c.name;
  let html = source
    .replaceAll('https://kodjitsu.com/kurslar/python/', `https://kodjitsu.com/kurslar/${yol(c)}/`)
    .replaceAll('/assets/landing/python-hero.jpg', `/assets/landing/${c.art}`)
    .replaceAll('/kayit/?kurs=Python', `/kayit/?kurs=${encodeURIComponent(ad)}`)
    .replaceAll('PYTHON KURSU', `${ad.toLocaleUpperCase('tr-TR')} KURSU`)
    .replaceAll('Python', ad)
    .replace('<body>', `<body style="--blue:${c.acc};--wash:${c.wash}">`)
    .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${s.title}</h1>`)
    .replace(/<p class="intro">[\s\S]*?<\/p>/, `<p class="intro">${s.intro}</p>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(s.intro)}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${ad} Kursu | Kodjitsu">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escape(s.intro)}">`)
    .replace(/alt="Birlikte bilgisayarda[^"]*"/, `alt="${s.alt}"`)
    .replace(/<section class="kunye wrap"[\s\S]*?<\/section>/, kunyeBlok(c))
    .replace(/<section class="outcomes section wrap">[\s\S]*?<\/section>/, kazanimBlok(c))
    .replace('<!--URETIR-->', uretirBlok(c))
    .replace('<!--ALTKURSLAR-->', altKurslarBlok(c))
    .replace(/<div class="code-card">[\s\S]*?<small>[^<]*<\/small><\/div>/,
      `<div class="code-card"><div class="code-bar"><span>${s.demo[0]}</span><span>${ad.toLocaleUpperCase('tr-TR')}</span></div><h3 class="demo-title">${s.demo[1]}</h3><p>${s.demo[2]}</p><div class="run-row"><button id="run" type="button" data-result="${escape(s.demo[4])}">${s.demo[3]} ▷</button><output id="code-output" aria-live="polite">Birlikte keşfedelim.</output></div><small>Küçük bir ders örneği</small></div>`)
    .replace(/(<section class="audience[\s\S]*?<div><p>)[\s\S]*?(<\/p><p>Kurs ve seviye)/, `$1${s.audience}$2`)
    .replace(/<section class="projects section">[\s\S]*?<\/section>/,
      `<section class="projects section"><div class="wrap"><p class="eyebrow">ÖRNEK ÇALIŞMALAR</p><h2>${s.projectTitle}</h2><p class="section-intro">${ad} dersinde yapılabilecek örnek çalışmalar. Projelerin kapsamı öğrencinin seviyesine ve seçilen ders paketine göre belirlenir.</p><div class="project-grid">${s.projects.map(([icon, title, body]) => `<article><span class="project-icon">${icon}</span><h3>${title}</h3><p>${body}</p></article>`).join('')}</div>${uretirBlok(c)}</div></section>`)
    .replace('Bir satırdan<br>bir programa.', s.programTitle)
    .replace(/<div class="curriculum">[\s\S]*?<\/div>/, `<div class="curriculum">${c.ogrenir.map(([title, body], i) => `<details${i === 0 ? ' open' : ''}><summary>${title}</summary><p>${body}</p></details>`).join('')}</div>`)
    .replace(/(<section class="section wrap faq">[\s\S]*?<h2>Başlamadan önce.<\/h2>)/, `$1<details><summary>${s.faq[0]}</summary><p>${s.faq[1]}</p></details>`)
    .replace('İlk programı<br>birlikte planlayalım.', s.closing)
    .replace('Online kodlama dersleri', 'Online dersler')
    .replace('</main>', `${navigation}</main>`);

  fs.mkdirSync(path.join(root, 'kurslar', yol(c)), { recursive: true });
  fs.writeFileSync(path.join(root, 'kurslar', yol(c), 'index.html'), html);
}

// Kaynak sayfaya (python) da diğer kurslara giden gezinme eklenir
const pySrc = path.join(root, 'kurslar/python/index.html');
let py = fs.readFileSync(pySrc, 'utf8');
py = py.replace(/<nav class="course-links"[\s\S]*?<\/nav>/, '').replace('</main>', `${navigation}</main>`);
fs.writeFileSync(pySrc, py);

console.log(`${courses.length} kurs sayfası üretildi + python kaynak sayfası güncellendi.`);
const taslak = courses.filter(c => c.taslak).map(c => c.name);
if (taslak.length) console.log(`UYARI — içeriği onay bekleyen kurslar: ${taslak.join(', ')}`);
