// Generate static course pages from the approved Python layout. No runtime build required.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const courses = [
  {
    slug: 'roblox', name: 'Roblox', color: '#b84025', wash: '#fff5f1',
    title: 'Kendi oyununu<br><em>sen kur.</em>',
    intro: 'Sevdiği oyunların nasıl yapıldığını keşfetsin. Roblox Studio ile kendi parkurunu tasarlasın, kurallarını belirlesin ve oynanabilir bir dünyaya dönüştürsün.',
    audience: 'Roblox oynamayı seven, haritaların nasıl kurulduğunu merak eden ve kendi oyun fikirlerini denemek isteyen çocuklar için.',
    projectTitle: 'Bir fikir, oynanabilir bir dünya.',
    programTitle: 'Bir bloktan<br>bir oyun dünyasına.',
    closing: 'İlk oyununu<br>birlikte planlayalım.',
    alt: 'Kodjitsu karakterleri bilgisayarda blok karakterli bir engel parkuru tasarlıyor',
    projects: [['↗', 'Engel parkuru', 'Platformların yerini ve aralarındaki mesafeyi ayarlayarak oyuncunun geçebileceği bir parkur tasarlar.'], ['★', 'Puan toplama oyunu', 'Toplanan nesneleri puana dönüştüren kurallar kurar; oyuncuya bir hedef verir.'], ['⌂', 'Kendi oyun haritası', 'Başlangıç noktası, yollar ve keşif alanlarıyla bir harita oluşturur; oynayarak düzenler.']],
    topics: [['Roblox Studio ile tanışma', 'Sahne içinde gezinme, nesne ekleme, taşıma, ölçekleme ve bir oyun alanı oluşturma.'], ['Oyun alanını tasarlama', 'Platformlar, engeller, başlangıç noktaları ve oyuncunun izleyeceği yolu düzenleme.'], ['Kodla kurallar belirleme', 'Luau ile değişkenleri, koşulları ve olayları tanıma; nesnelere basit davranışlar ekleme.'], ['Oynama, test etme, geliştirme', 'Parkuru deneyerek sorunları bulma, zorluk seviyesini ayarlama ve oyun fikrini geliştirme.']],
    faq: ['Roblox oynamak ile bu dersin farkı ne?', 'Dersin odağı Roblox Studio ile oyun üretmektir. Öğrenci bir haritanın nasıl kurulduğunu, oyun kurallarının nasıl yazıldığını ve kendi çalışmasını nasıl test edeceğini keşfeder.'],
    demo: ['Parkur tasarımı', 'Oyuncunun hedefi', 'Başlangıç → Platformlar → Bitiş', 'Hedefi göster', 'Parkuru tamamla, bitiş bayrağına ulaş.']
  },
  {
    slug: 'minecraft', name: 'Minecraft', color: '#297447', wash: '#f1f8f3',
    title: 'Bir dünya düşün.<br><em>Blok blok kur.</em>',
    intro: 'Sevdiği bloklardan yola çıkarak planlamayı ve kodlama mantığını keşfetsin. Bir yapı tasarlasın, adımlarını sıralasın ve kendi çözümünü denesin.',
    audience: 'Minecraft’ta yapılar kurmayı seven, aynı işi daha kolay yapmanın yollarını arayan ve kendi dünyasını tasarlamak isteyen çocuklar için.',
    projectTitle: 'Her yapının arkasında bir plan var.',
    programTitle: 'Bir adımdan<br>bir yapıya.',
    closing: 'İlk dünyasını<br>birlikte planlayalım.',
    alt: 'Kodjitsu karakterleri bloklardan ev ve ağaçlar oluşturuyor',
    projects: [['⌂', 'Planlı bir yerleşim', 'Evleri, yolları ve ortak alanları önceden düşünerek bir yerleşim tasarlar.'], ['↻', 'Tekrarlanan yapılar', 'Bir duvarı ya da yolu oluşturan tekrarları fark eder; işi adımlara ayırmayı öğrenir.'], ['→', 'Yön bulma görevi', 'Bir başlangıç ve hedef belirler; aradaki yolu yönler ve sıralı komutlarla tarif eder.']],
    topics: [['Yapıyı planlama', 'Bir fikir için gerekli parçaları belirleme, ölçüleri düşünme ve yapılacak işleri sıralama.'], ['Komutlar ve yönler', 'Bir hedefe ulaşmak için hareketleri küçük adımlara ayırma ve sırasını kontrol etme.'], ['Tekrarları keşfetme', 'Benzer yapı parçalarını fark ederek döngü ve algoritma mantığıyla tanışma.'], ['Tasarla ve dene', 'Kendi yapı projesini geliştirme, eksikleri fark etme ve çözümünü yeniden düzenleme.']],
    faq: ['Hangi Minecraft sürümü gerekiyor?', 'Ders için kullanılacak sürüm ve hesap gereksinimleri kayıt sürecinde netleştirilir. Yeni bir lisans satın almadan önce bizimle görüşebilirsiniz.'],
    demo: ['Yapı planı', 'Bir yolu tarif et', 'İlerle → İlerle → Sağa dön', 'Adımları say', '3 komut: iki ilerleme, bir dönüş.']
  },
  {
    slug: 'unity', name: 'Unity', color: '#956000', wash: '#fff9ed',
    title: 'Hayalindeki oyun,<br><em>senin sahnen.</em>',
    intro: 'Bir karakter, bir dünya, kendi koyduğu kurallar. Unity ile çocuğunuz oyun fikrini sahneye taşısın; hareket, etkileşim ve kodu bir araya getirsin.',
    audience: 'Oyun geliştirmeye ilgi duyan, kendi 2B veya 3B dünyasını kurmak isteyen ve kodla etkileşim tasarlamayı merak eden öğrenciler için.',
    projectTitle: 'Sahneyi kur. Oyunu dene.',
    programTitle: 'Bir sahneden<br>oynanabilir bir oyuna.',
    closing: 'İlk oyun sahnesini<br>birlikte planlayalım.',
    alt: 'Kodjitsu karakterleri robotlu üç boyutlu bir oyun sahnesini tasarlıyor',
    projects: [['↗', 'Bir platform oyunu', 'Hareket eden bir karakter, aşılacak engeller ve ulaşılacak bir hedef tasarlar.'], ['◇', 'Keşif sahnesi', 'Kamera, ışık ve nesnelerle gezilebilir bir alan kurar; sahnenin nasıl göründüğünü test eder.'], ['★', 'Nesne toplama görevi', 'Oyuncunun topladığı nesneleri sayan, hedefe ulaşıldığında geri bildirim veren bir mekanik üzerinde çalışır.']],
    topics: [['Unity editörü ile tanışma', 'Sahne, nesneler ve bileşenleri tanıma; basit bir oyun alanı kurma.'], ['Hareket ve etkileşim', 'Karakter kontrolü, çarpışmalar ve fizik davranışlarını küçük örneklerle keşfetme.'], ['C# ile oyun mantığı', 'Değişkenler, koşullar ve fonksiyonlarla oyun içindeki davranışları düzenleme.'], ['Oyunu bir araya getirme', 'Hedef ve geri bildirim ekleme, oynayarak hata bulma ve projenin akışını iyileştirme.']],
    faq: ['Önceden kodlama bilmek gerekiyor mu?', 'Başlangıç noktası öğrencinin deneyimine göre değerlendirilir. Daha önce kod yazdıysa bunu kayıt sırasında paylaşabilirsiniz; konu akışı uygun seviyeden planlanır.'],
    demo: ['Oyun mekaniği', 'Toplanan nesneler', '3 yıldız + 1 yıldız', 'Puanı hesapla', 'Toplam: 4 yıldız.']
  },
  {
    slug: 'matematik', name: 'Matematik', color: '#18765b', wash: '#f0f8f5',
    title: 'Matematiği<br><em>görerek keşfet.</em>',
    intro: 'Bir şeklin nasıl değiştiğini, bir örüntünün nasıl büyüdüğünü görsün. Sayıları, mantığı ve kodlamayı küçük denemelerle bir araya getirsin.',
    audience: 'Matematikteki kavramları somut örneklerle anlamak isteyen, şekilleri ve örüntüleri merak eden çocuklar için. Konular öğrencinin sınıfına ve ihtiyacına göre değerlendirilir.',
    projectTitle: 'Bir soruya farklı yollardan bak.',
    programTitle: 'Bir örnekten<br>bir çözüm yoluna.',
    closing: 'Öğrenme planını<br>birlikte oluşturalım.',
    alt: 'Kodjitsu karakterleri geometrik parçalar ve denge terazisiyle matematiği keşfediyor',
    projects: [['△ □', 'Şekillerle tasarım', 'Şekilleri birleştirir, ölçülerini değiştirir; alan ve çevre arasındaki farkı örneklerle keşfeder.'], ['2 4 6', 'Örüntü atölyesi', 'Bir sayı dizisinin kuralını bulur, sonraki adımı tahmin eder ve kendi örüntüsünü kurar.'], ['↔', 'Çözümünü karşılaştır', 'Bir problemi farklı adımlarla çözmeyi dener; hangi yöntemin neden işe yaradığını anlatır.']],
    topics: [['Sayılar ve ilişkiler', 'Öğrencinin seviyesine uygun işlemler, karşılaştırmalar ve günlük hayattan problemler.'], ['Geometriyi görme', 'Şekiller, ölçüler, simetri ve uzamsal düşünmeyi görsel örneklerle keşfetme.'], ['Mantık ve örüntüler', 'Kuralları bulma, tahmin etme ve bir çözümü sıralı adımlarla açıklama.'], ['Kodla somutlaştırma', 'Uygun seviyede küçük görsel uygulamalarla matematiksel ilişkileri deneme ve sonuçları karşılaştırma.']],
    faq: ['Hangi sınıf düzeyine uygun?', 'Konu ve seviye seçimi öğrencinin sınıfı, mevcut bilgisi ve ihtiyaçlarıyla birlikte değerlendirilir. Ön kayıt formunda yaşını paylaşarak uygun ders planı için iletişim kurabilirsiniz.'],
    demo: ['Şekilleri keşfet', 'Dikdörtgenin alanı', 'Kısa kenar: 3 · Uzun kenar: 4', 'Alanı bul', '3 × 4 = 12 birimkare.']
  },
  {
    slug: 'grafik-tasarim', name: 'Grafik Tasarım', color: '#7135bc', wash: '#f7f2fc',
    title: 'Fikrini<br><em>görünür kıl.</em>',
    intro: 'Bir afiş, bir oyun kapağı, kendi tasarladığı bir karakter. Çocuğunuz renkleri, yazıları ve şekilleri bir araya getirerek kendi görsel dilini keşfetsin.',
    audience: 'Çizmeyi, görsellerle anlatmayı ve kendi tasarımlarını üretmeyi seven çocuklar için. Dijital araçlarla tanışmak isteyenler de önceki çalışmalarını geliştirmek isteyenler de deneyimini paylaşabilir.',
    projectTitle: 'Anlatacak bir fikri, gösterecek bir işi olsun.',
    programTitle: 'Bir eskizden<br>bir tasarıma.',
    closing: 'İlk tasarımını<br>birlikte planlayalım.',
    alt: 'Kodjitsu karakterleri çizim tableti ve bilgisayarla afiş tasarlıyor',
    projects: [['Aa', 'Bir etkinlik afişi', 'Başlığı, görseli ve bilgileri düzenler; izleyicinin ilk neyi görmesini istediğine karar verir.'], ['◐', 'Kendi oyun kapağı', 'Bir oyun fikrini renk, şekil ve karakter seçimiyle tek bir görselde anlatmayı dener.'], ['▧', 'Çalışma seçkisi', 'Ürettiği tasarımları seçer, düzenler ve nasıl geliştirdiğini anlatan bir seçki oluşturur.']],
    topics: [['Görsel dili keşfetme', 'Renk, biçim, boşluk ve denge üzerine örnekleri inceleme; tasarım kararlarını konuşma.'], ['Dijital araçlarla çalışma', 'Şekiller, katmanlar ve temel çizim araçlarıyla bir kompozisyon oluşturma.'], ['Yazı ve görseli düzenleme', 'Yazı boyutu, okunabilirlik ve görsel hiyerarşiyle mesajı anlaşılır hale getirme.'], ['Tasarlama ve geliştirme', 'Bir afiş ya da kapak fikrini hazırlama, geri bildirimle düzenleme ve çalışmalarını sunma.']],
    faq: ['Çizim tableti almak gerekiyor mu?', 'Gerekli ekipman ve kullanılacak uygulamalar ders planına göre netleştirilir. Yeni bir cihaz ya da yazılım satın almadan önce bizimle görüşebilirsiniz.'],
    demo: ['Afiş tasarımı', 'Görsel hiyerarşi', 'Başlık → Görsel → Ayrıntılar', 'Okuma sırasını gör', 'Önce başlık dikkat çeker; görsel destekler, ayrıntılar tamamlar.']
  }
];
const source = fs.readFileSync(path.join(root, 'kurslar/python/index.html'), 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const navigation = `<nav class="course-links" aria-label="Diğer kurslar">${[['python','Python'], ...courses.map(c => [c.slug,c.name])].map(([slug,name]) => `<a href="/kurslar/${slug}/">${name}</a>`).join('')}</nav>`;
for (const c of courses) {
  let html = source.replaceAll('https://kodjitsu.com/kurslar/python/', `https://kodjitsu.com/kurslar/${c.slug}/`)
    .replaceAll('/assets/landing/python-hero.jpg', `/assets/landing/${c.slug}-hero.jpg`)
    .replaceAll('/kayit/?kurs=Python', `/kayit/?kurs=${encodeURIComponent(c.name)}`)
    .replaceAll('PYTHON KURSU', `${c.name.toLocaleUpperCase('tr-TR')} KURSU`)
    .replaceAll('Python', c.name)
    .replace('<body>', `<body style="--blue:${c.color};--wash:${c.wash}">`)
    .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${c.title}</h1>`)
    .replace(/<p class="intro">[\s\S]*?<\/p>/, `<p class="intro">${c.intro}</p>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(c.intro)}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${c.name} Kursu | Kodjitsu">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escape(c.intro)}">`)
    .replace(/alt="Birlikte bilgisayarda[^"]*"/, `alt="${c.alt}"`)
    .replace(/<div class="code-card">[\s\S]*?<small>Etkileşimli çıktı örneği<\/small><\/div>/,
      `<div class="code-card"><div class="code-bar"><span>${c.demo[0]}</span><span>${c.name.toLocaleUpperCase('tr-TR')}</span></div><h3 class="demo-title">${c.demo[1]}</h3><p>${c.demo[2]}</p><div class="run-row"><button id="run" type="button" data-result="${escape(c.demo[4])}">${c.demo[3]} ▷</button><output id="code-output" aria-live="polite">Birlikte keşfedelim.</output></div><small>Küçük bir ders örneği</small></div>`)
    .replace(/(<section class="audience[\s\S]*?<div><p>)[\s\S]*?(<\/p><p>Kurs ve seviye)/, `$1${c.audience}$2`)
    .replace(/<section class="projects section">[\s\S]*?<\/section>/,
      `<section class="projects section"><div class="wrap"><p class="eyebrow">ÖRNEK ÇALIŞMALAR</p><h2>${c.projectTitle}</h2><p class="section-intro">${c.name} dersinde yapılabilecek örnek çalışmalar. Projelerin kapsamı öğrencinin seviyesine ve seçilen ders paketine göre belirlenir.</p><div class="project-grid">${c.projects.map(([icon,title,body])=>`<article><span class="project-icon">${icon}</span><h3>${title}</h3><p>${body}</p></article>`).join('')}</div></div></section>`)
    .replace('Bir satırdan<br>bir programa.', c.programTitle)
    .replace(/<div class="curriculum">[\s\S]*?<\/div>/, `<div class="curriculum">${c.topics.map(([title,body], i)=>`<details${i===0?' open':''}><summary>${title}</summary><p>${body}</p></details>`).join('')}</div>`)
    .replace(/(<section class="section wrap faq">[\s\S]*?<h2>Başlamadan önce.<\/h2>)/, `$1<details><summary>${c.faq[0]}</summary><p>${c.faq[1]}</p></details>`)
    .replace('İlk programı<br>birlikte planlayalım.', c.closing)
    .replace('Online kodlama dersleri', 'Online dersler')
    .replace('</main>', `${navigation}</main>`);
  fs.mkdirSync(path.join(root, 'kurslar', c.slug), {recursive:true});
  fs.writeFileSync(path.join(root, 'kurslar', c.slug, 'index.html'), html);
}
console.log(`Generated ${courses.length} static course pages.`);
