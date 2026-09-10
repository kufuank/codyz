// Kodjitsu — kurs verisi (tek kaynak)
//
// Hem paylaşılabilir kartlar (scripts/kurs-kartlari.js) hem de kurs landing
// sayfaları (scripts/course-pages.js) bu dosyadan beslenir. Bir kursun bilgisini
// burada değiştirmek üç çıktıyı birden günceller: kapak kartı, ders detay kartı,
// yatay kart ve kurslar/<slug>/ sayfası.
//
// KAYNAK NOTU
// Yaş / ders adedi / süre / program bilgileri "Kurslarımız" dokümanından alındı.
// Doküman Kodland kaynaklı olduğu için metinler kopyalanmadı; olgular korunup
// Kodjitsu diliyle yeniden yazıldı. Dokümanda ayrıntısı olmayan kurslar
// `taslak: true` ile işaretlidir — içerik onaylanmadan yayına alınmamalı.
//
// Alanlar:
//   kart.*   → kart ve detay sayfası içeriği
//   sayfa.*  → kurslar/<slug>/index.html içeriği
//   olgular  → [etiket, değer] · her iki çıktıda da künye olarak görünür

const kurslar = [
  {
    slug: 'tasarim', name: 'Tasarım', acc: '#7C3AED', wash: '#f7f2fc',
    eyebrow: 'Kategori · Tasarım', art: 'grafik-tasarim-hero.jpg', kategori: true,
    olgular: [['Yaş', '7–16'], ['Seviye', 'Başlangıç → Orta'], ['Kurs', '32–40 ders'], ['Ders', '60–90 dk']],
    araclar: 'Krita · Wick Editor · TinkerCAD · Figma · Photopea · Behance',
    kart: {
      desc: 'Çizer, tasarlar, animasyona döker, 3B model kurar. Yaşına uygun seviyeden başlar; her dönem portföyüne yeni bir iş ekler.',
      detayGiris: 'Tasarım tek bir kurs değil, yaşa göre ilerleyen bir yol. Çocuk hangi basamaktan başlarsa başlasın, dönem sonunda elinde gösterebileceği işler olur.'
    },
    ogrenir: [
      ['7–9 yaş · Anime ve karakter', 'Çizimin temelleri, karakter yaratma ve kendi anime figürünü tasarlama.'],
      ['10–12 yaş · Dijital Yaratıcılık', 'Grafik tasarım, çizgi roman, animasyon ve 3B modellemeyle ilk dijital projeler. 40 ders · 60 dk.'],
      ['11–12 yaş · Fantastik Dünyalar', 'İllüstrasyon, animasyon ve 3B modelleme programlarıyla kendi dünyasını kurar. 32 ders · 60 dk.'],
      ['13+ · Grafik Tasarım', 'Kompozisyon, renk teorisi ve font eşleştirme; logo, afiş ve kurumsal kimlik çalışmaları. 40 ders · grup dersi 90 dk.']
    ],
    uretir: ['Kendi karakteri ve çizgi romanı', 'Afiş, poster ve logo', 'Kısa animasyon', '3B model ve sahne', 'Sosyal medya tasarımları', 'Dijital portföy'],
    kazanim: [
      ['Fikirden işe', 'Kafasındaki fikri eskizden bitmiş tasarıma taşımayı öğrenir.'],
      ['Portföy', 'Çalışmaları dağınık dosyalar değil, gösterilebilir bir seçki hâline gelir.'],
      ['Meslek fikri', 'Tasarımın gerçek bir meslek olduğunu ve hangi alanlara açıldığını görür.']
    ],
    altKurslar: [
      ['Anime ve karakter', '7–9 yaş', 'Çizim temelleri, karakter yaratma ve kendi anime figürü.', null],
      ['Dijital Yaratıcılık', '10–12 yaş · 40 ders', 'Grafik tasarım, çizgi roman, animasyon ve 3B modellemeyle ilk projeler.', null],
      ['Fantastik Dünyalar', '11–12 yaş · 32 ders', 'İllüstrasyon, animasyon ve 3B modellemeyle kendi dünyasını kurar.', null],
      ['Grafik Tasarım', '13+ · 40 ders', 'Kompozisyon, renk teorisi, logo ve kurumsal kimlik; Behance portföyü.', 'grafik-tasarim']
    ],
    sayfa: {
      title: 'Tasarımın<br><em>hangi kapısı?</em>',
      intro: "Tasarım, Kodjitsu'da tek bir ders değil; yaşa göre ilerleyen bir yol. Çocuğunuz uygun basamaktan başlar, her dönem portföyüne yeni bir iş ekler.",
      audience: 'Çizmeyi, görsellerle anlatmayı ve kendi tasarımlarını üretmeyi seven çocuklar için. Yaşına göre anime, dijital yaratıcılık, fantastik dünyalar ya da grafik tasarım basamağından başlanır.',
      projectTitle: 'Hangi basamakta ne üretir?',
      programTitle: 'Yaşa göre<br>dört basamak.',
      closing: 'Uygun basamağı<br>birlikte seçelim.',
      alt: 'Kodjitsu karakterleri çizim tableti ve bilgisayarla afiş tasarlıyor',
      projects: [
        ['Aa', 'Bir etkinlik afişi', 'Başlığı, görseli ve bilgileri düzenler; izleyicinin ilk neyi görmesini istediğine karar verir.'],
        ['◐', 'Kendi oyun kapağı', 'Bir oyun fikrini renk, şekil ve karakter seçimiyle tek bir görselde anlatmayı dener.'],
        ['▧', 'Çalışma seçkisi', 'Ürettiği tasarımları seçer, düzenler ve nasıl geliştirdiğini anlatan bir seçki oluşturur.']
      ],
      faq: ['Hangi basamaktan başlamalı?', 'Yaş bir başlangıç noktası; asıl belirleyici çocuğun ilgisi ve önceki deneyimi. Kayıt sırasında ikisini de değerlendirip uygun basamağı birlikte seçiyoruz.'],
      demo: ['Afiş tasarımı', 'Görsel hiyerarşi', 'Başlık → Görsel → Ayrıntılar', 'Okuma sırasını gör', 'Önce başlık dikkat çeker; görsel destekler, ayrıntılar tamamlar.']
    }
  },
  {
    // Tasarım kategorisi altındaki kurs; kart setinde ayrıca yer almaz.
    slug: 'grafik-tasarim', name: 'Grafik Tasarım', acc: '#7C3AED', wash: '#f7f2fc', kartsiz: true,
    eyebrow: 'Kurs · Tasarım', art: 'grafik-tasarim-hero.jpg', ustKategori: 'tasarim',
    olgular: [['Yaş', '13+'], ['Seviye', 'Orta'], ['Kurs', '40 ders'], ['Ders', 'Grup 90 dk']],
    araclar: 'Figma · Photopea · Behance',
    ogrenir: [
      ['Tasarımın temelleri', 'Kompozisyon, renk teorisi ve font eşleştirme; bir tasarımın neden işlediğini çözümleme.'],
      ['Profesyonel araçlar', 'Figma ve Photopea ile katmanlı çalışma, düzen kurma ve dışa aktarma.'],
      ['Marka ve kimlik', 'Logo tasarımı, tutarlı kurumsal kimlik ve dünya markalarının stratejilerini inceleme.'],
      ['Portföy kurma', "Sosyal medya tasarımları ve gerçek brief'lerle çalışıp işleri Behance'te toplama."]
    ],
    uretir: ['Logo ve marka kimliği', 'Afiş ve poster', 'Sosyal medya tasarımları', 'Animasyonlu tasarım', 'Behance portföyü'],
    kazanim: [
      ['Sektör araçları', 'Profesyonellerin kullandığı programlarda rahat çalışır.'],
      ['Gerçek portföy', "Behance'te yayınlanmış, gösterilebilir bir iş seçkisi çıkar."],
      ['Marka gözü', 'Gördüğü her tasarımı çözümleyebilecek bir bakış kazanır.']
    ],
    sayfa: {
      title: 'Fikrini<br><em>görünür kıl.</em>',
      intro: "Afişten logoya, sosyal medya tasarımından kurumsal kimliğe. Figma ve Photopea ile çalışır, işlerini Behance'te bir portföyde toplar.",
      audience: 'Tasarıma ciddi ilgi duyan, dijital araçlarla profesyonel işler üretmek ve portföy kurmak isteyen 13 yaş ve üzeri öğrenciler için.',
      projectTitle: 'Gerçek brief, gerçek çıktı.',
      programTitle: 'Bir eskizden<br>bir kimliğe.',
      closing: 'İlk tasarımını<br>birlikte planlayalım.',
      alt: 'Kodjitsu karakterleri çizim tableti ve bilgisayarla afiş tasarlıyor',
      projects: [
        ['◐', 'Logo ve marka kimliği', 'Bir marka için logo, renk paleti ve yazı ailesi seçerek tutarlı bir kimlik kurar.'],
        ['Aa', 'Etkinlik afişi', 'Başlığı, görseli ve bilgileri düzenler; izleyicinin ilk neyi görmesi gerektiğine karar verir.'],
        ['▧', 'Behance portföyü', 'Ürettiği işleri seçer, sunum düzenine sokar ve yayımlanabilir bir seçki hâline getirir.']
      ],
      faq: ['Çizim tableti almak gerekiyor mu?', 'Gerekmiyor. Ders Figma ve Photopea gibi tarayıcıdan çalışan uygulamalarla yürür; fare ile de üretilebilir. Yeni bir cihaz almadan önce bizimle görüşebilirsiniz.'],
      demo: ['Afiş tasarımı', 'Görsel hiyerarşi', 'Başlık → Görsel → Ayrıntılar', 'Okuma sırasını gör', 'Önce başlık dikkat çeker; görsel destekler, ayrıntılar tamamlar.']
    }
  },
  {
    slug: 'funtech', name: 'FunTech', acc: '#FF5A2D', wash: '#fff5f1', taslak: true,
    eyebrow: 'Kurs · Başlangıç', art: 'funtech-hero.jpg', baslangic: true,
    olgular: [['Yaş', 'Görüşmede'], ['Seviye', 'Başlangıç'], ['Kurs', '8–128 ders paketi'], ['Ders', '60 dk']],
    araclar: 'Dijital araçlarla ilk adımlar',
    kart: {
      desc: 'Teknolojiyle ilk tanışma. Bilgisayarı güvenle kullanmayı, bir fikri adım adım kurmayı ve dijital araçlarla üretmeyi öğrenir.',
      detayGiris: 'Kodlamadan önceki basamak: çocuğun bilgisayarla arasını iyi yapan, ekranı üretmek için de açmasını sağlayan giriş kursu.'
    },
    ogrenir: [
      ['Bilgisayarla rahat çalışma', 'Dosya, klasör, klavye ve fareyle pratik kazanma; ekranda kaybolmama.'],
      ['Adım adım düşünme', 'Bir işi küçük adımlara bölme ve sırasını doğru kurma alışkanlığı.'],
      ['Dijital araçlarla üretme', 'Basit tasarım, sunum ve blok tabanlı denemelerle ilk üretimler.'],
      ['Güvenli internet', 'Nerede ne paylaşılır, neye güvenilir; temel dijital güvenlik farkındalığı.']
    ],
    uretir: ['İlk dijital tasarımı', 'Küçük bir sunum', 'Blok kodlamayla ilk denemeler'],
    kazanim: [
      ['Özgüven', 'Bilgisayar başında ne yaptığını bilerek oturur.'],
      ['Hazırlık', 'Roblox, Minecraft ve Python gibi kurslara sağlam bir zeminle geçer.'],
      ['Alışkanlık', 'Ekranı yalnızca tüketmek için değil, üretmek için de açar.']
    ],
    sayfa: {
      title: 'İlk adım<br><em>burada atılır.</em>',
      intro: 'Bilgisayarı tanısın, bir fikri adım adım kurmayı öğrensin ve ilk dijital işini üretsin. Kodlama kurslarından önceki hazırlık basamağı.',
      audience: 'Teknolojiyle yeni tanışan, bilgisayar başında ne yapacağını henüz bilmeyen ya da kodlamaya başlamadan önce sağlam bir zemin isteyen çocuklar için.',
      projectTitle: 'İlk işini kendi eliyle üretsin.',
      programTitle: 'İlk tıklamadan<br>ilk üretime.',
      closing: 'İlk adımı<br>birlikte atalım.',
      alt: 'Kodjitsu karakterleri düşük bir masada dizüstü bilgisayar ve tabletle çalışıyor',
      projects: [
        ['▤', 'İlk dijital tasarımı', 'Şekiller ve renklerle basit bir görsel hazırlar; bilgisayarda üretmenin ne demek olduğunu görür.'],
        ['▶', 'Küçük bir sunum', 'Anlatmak istediği bir konuyu birkaç sayfaya böler ve sırayla anlatmayı dener.'],
        ['◧', 'Blok kodlama denemesi', 'Hazır bloklarla küçük bir hareket dizisi kurar; komut sırasının önemini fark eder.']
      ],
      faq: ['Hiç bilgisayar kullanmamış olması sorun olur mu?', 'Hayır. Bu kurs tam olarak o noktadan başlar; dosya, klavye ve fare kullanımından itibaren ilerler. Evde bilgisayar deneyimi olmayan öğrenciler için uygundur.'],
      demo: ['İlk adımlar', 'Adımları sıraya koy', 'Aç → Seç → Kaydet', 'Sırayı kontrol et', 'Doğru sıra: önce aç, sonra seç, en son kaydet.']
    }
  },
  {
    slug: 'roblox', name: 'Roblox', acc: '#FF5A2D', wash: '#fff5f1',
    eyebrow: 'Kurs · Oyun', art: 'roblox-hero.jpg',
    olgular: [['Yaş', '8–13'], ['Seviye', 'Başlangıç'], ['Kurs', '40 ders'], ['Ders', '50–60 dk']],
    araclar: 'Roblox Studio · Lua',
    kart: {
      desc: 'Oynadığı oyunun içinde kod yazar. Roblox Studio ile kendi haritasını kurar, Lua ile kurallarını yazar, oyununu yayınlar.',
      detayGiris: 'Amaç net: çocuğu "Roblox oynayan" olmaktan çıkarıp "Roblox yapan" hâline getirmek. Sevdiği oyunun içinden girip programlamayla tanışır.'
    },
    ogrenir: [
      ['Roblox Studio ve 3B sahne', 'Arayüzü tanıma, 3B kamerayla çalışma, nesne ekleme ve özelliklerini değiştirme.'],
      ['Seviye tasarımı', 'Arazi, ışıklandırma, nesne fiziği (çarpışma, kütle, sabitleme) ve görsel efektler.'],
      ['Lua ile programlama', 'Değişkenler, koşullar (if/else), döngüler ve fonksiyonlarla oyun kuralları yazma.'],
      ['Arayüz ve yayınlama', 'Ekran arayüzleri (sayaç, zamanlayıcı), rozetler, Game Pass ve projeyi yayına alma.']
    ],
    uretir: ['Obby — engel parkuru', 'Sihirli macera (NPC\'li)', '2D platform oyunu', 'Yarış simülatörü', 'Tycoon — iş simülatörü', 'Bitirme projesi'],
    kazanim: [
      ['Bakış değişir', 'Oyun oynarken tuzağın nasıl çalıştığını, oyuncunun neden bağlandığını fark eder.'],
      ['Profesyonel araç', 'Gerçek bir geliştirme ortamında rahat çalışır; "zor yazılım" çekingenliği kalmaz.'],
      ['Ekonomi kavrayışı', 'Tycoon projesiyle sanal ekonomiyi ve geliştiricilerin nasıl kazandığını görür.']
    ],
    sayfa: {
      title: 'Kendi oyununu<br><em>sen kur.</em>',
      intro: 'Sevdiği oyunların nasıl yapıldığını keşfetsin. Roblox Studio ile kendi parkurunu tasarlasın, kurallarını Lua ile yazsın ve oynanabilir bir dünyaya dönüştürsün.',
      audience: 'Roblox oynamayı seven, haritaların nasıl kurulduğunu merak eden ve kendi oyun fikirlerini denemek isteyen 8–13 yaş çocuklar için.',
      projectTitle: 'Bir fikir, oynanabilir bir dünya.',
      programTitle: 'Bir bloktan<br>bir oyun dünyasına.',
      closing: 'İlk oyununu<br>birlikte planlayalım.',
      alt: 'Kodjitsu karakterleri bilgisayarda blok karakterli bir engel parkuru tasarlıyor',
      projects: [
        ['↗', 'Obby — engel parkuru', 'Işınlanma noktaları, tuzaklar ve hızlandırıcılarla oyuncunun geçmeye çalışacağı bir parkur kurar.'],
        ['★', 'Tycoon — iş simülatörü', 'Kendi ekonomisi, otomatik konveyörleri ve oyun içi mağazası olan büyük ölçekli bir oyun geliştirir.'],
        ['⌂', 'Yarış simülatörü', 'Araç fiziği, engeller ve liderlik tablosu kurar; oynayarak dengeyi ayarlar.']
      ],
      faq: ['Roblox oynamak ile bu dersin farkı ne?', 'Dersin odağı Roblox Studio ile oyun üretmektir. Öğrenci bir haritanın nasıl kurulduğunu, oyun kurallarının Lua ile nasıl yazıldığını ve projesini nasıl yayınlayacağını öğrenir.'],
      demo: ['Parkur tasarımı', 'Oyuncunun hedefi', 'Başlangıç → Platformlar → Bitiş', 'Hedefi göster', 'Parkuru tamamla, bitiş bayrağına ulaş.']
    }
  },
  {
    slug: 'minecraft', name: 'Minecraft', acc: '#297447', wash: '#f1f8f3',
    eyebrow: 'Kurs · Oyun', art: 'minecraft-hero.jpg', kartAcc: '#12B76A',
    olgular: [['Yaş', '8–9'], ['Seviye', 'Başlangıç'], ['Kurs', '40 ders'], ['Ders', '60 dk']],
    araclar: 'Minecraft Education · MakeCode',
    kart: {
      desc: 'Blok blok kurarken planlamayı öğrenir. Redstone ile otomasyon, MakeCode ile blok tabanlı programlama ve mühendislik düşüncesi.',
      detayGiris: 'Minecraft\'ı tanıyan da yeni başlayan da aynı yerden girer: oyunu tasarım, mekanik ve mühendislik gözüyle görmek.'
    },
    ogrenir: [
      ['Minecraft Education ortamı', 'Ortamı yönetme, üretim tarifleri, mob etkileşimleri ve yapı kurallarını kavrama.'],
      ['Redstone ile otomasyon', 'Devreler kurarak süreçleri otomatikleştirme; çiftlik, tuzak ve mekanizma tasarımı.'],
      ['MakeCode ile programlama', 'Blok tabanlı kodla Agent\'ı yönetme ve oyun dünyasıyla kod üzerinden etkileşim.'],
      ['Algoritmik düşünme', 'Koşullar, döngüler ve değişkenlerle birbirini takip eden eylemler kurma.']
    ],
    uretir: ['Otomatik çiftlik', 'Kontrol edilebilir mekanizmalar', 'Planlı yerleşim', 'Agent görevleri', 'Kendi tuzak sistemi'],
    kazanim: [
      ['Plan alışkanlığı', 'Yapmadan önce düşünmeyi; işi adımlara bölmeyi öğrenir.'],
      ['İlk gerçek programı', 'Basit komutlardan başlayıp oyun içi görevleri otomatikleştirir.'],
      ['Takım çalışması', 'Birlikte inşa ederek sorumluluk paylaşmayı ve geri bildirim vermeyi dener.']
    ],
    sayfa: {
      title: 'Bir dünya düşün.<br><em>Blok blok kur.</em>',
      intro: 'Sevdiği bloklardan yola çıkarak planlamayı ve kodlama mantığını keşfetsin. Redstone ile otomasyon kursun, MakeCode ile ilk programını yazsın.',
      audience: 'Minecraft\'ta yapılar kurmayı seven, aynı işi daha kolay yapmanın yollarını arayan 8–9 yaş çocuklar için.',
      projectTitle: 'Her yapının arkasında bir plan var.',
      programTitle: 'Bir adımdan<br>bir yapıya.',
      closing: 'İlk dünyasını<br>birlikte planlayalım.',
      alt: 'Kodjitsu karakterleri bloklardan ev ve ağaçlar oluşturuyor',
      projects: [
        ['⌂', 'Otomatik çiftlik', 'Redstone devreleriyle kendi kendine çalışan bir üretim sistemi kurar.'],
        ['↻', 'Kontrol edilebilir mekanizma', 'Kapılar, tuzaklar ve asansörler gibi tetiklenen sistemler tasarlar.'],
        ['→', 'Agent görevleri', 'MakeCode ile Agent\'a sıralı komutlar vererek işleri otomatikleştirir.']
      ],
      faq: ['Hangi Minecraft sürümü gerekiyor?', 'Derste Minecraft Education sürümü kullanılır. Gerekli hesap ve kurulum kayıt sürecinde netleştirilir; yeni bir lisans satın almadan önce bizimle görüşebilirsiniz.'],
      demo: ['Yapı planı', 'Bir yolu tarif et', 'İlerle → İlerle → Sağa dön', 'Adımları say', '3 komut: iki ilerleme, bir dönüş.']
    }
  },
  {
    slug: 'python', name: 'Python', acc: '#2B6CFF', wash: '#f2f6ff', sub: 'Level 1',
    eyebrow: 'Kurs · Yazılım', art: 'python-hero.jpg', kaynakSayfa: true,
    olgular: [['Seviye', 'Level 1'], ['Ön koşul', 'Gerekmez'], ['Kurs', '8–128 ders paketi'], ['Ders', '60 dk']],
    araclar: 'Python',
    kart: {
      desc: 'Bloklardan gerçek koda geçiş. Değişken, koşul, döngü ve fonksiyonlarla kendi programlarını yazar; her konu bir projeyle biter.',
      detayGiris: 'Metin tabanlı programlamaya ilk ciddi adım. Yazdığı her satırın sonucunu görür, hatasını kendi bulur, çözümü kendi kurar.'
    },
    ogrenir: [
      ['Python ile tanışma', 'Kodun nasıl çalıştığını anlama, ekrana yazdırma, değişkenler ve temel veri türleri.'],
      ['Programın karar vermesi', 'Kullanıcıdan bilgi alma, karşılaştırmalar ve koşullarla farklı durumlara cevap verme.'],
      ['Tekrarlar ve veriler', 'Döngülerle tekrar eden işleri düzenleme, listelerle birden fazla bilgiyi kullanma.'],
      ['Parçaları birleştirme', 'Fonksiyonlarla kodu düzenleme, hata bulma ve küçük bir uygulama üzerinde çalışma.']
    ],
    uretir: ['Sayı tahmin oyunu', 'Kendi hesaplayıcısı', 'Bilgi yarışması uygulaması'],
    kazanim: [
      ['Gerçek programlama', 'Blok kodlamanın ötesine geçer; profesyonellerin kullandığı dille çalışır.'],
      ['Hatayla barışma', 'Hatanın başarısızlık değil, sürecin parçası olduğunu deneyerek öğrenir.'],
      ['Geniş kapı', 'Python veri, yapay zekâ ve otomasyonun ortak dili; ileride nereye giderse gitsin işine yarar.']
    ],
    sayfa: {
      title: 'Kendi fikrini<br><em>kodla.</em>',
      intro: 'Bir oyun, bir hesaplayıcı, küçük bir uygulama. Python ile çocuğunuzun fikri, adım adım çalışan bir programa dönüşsün.',
      audience: 'Oyunların nasıl yapıldığını soran, kendi uygulamasını yapmak isteyen veya blok kodlamayı aşıp gerçek koda geçmek isteyen öğrenciler için.',
      projectTitle: 'Yazdığını çalışırken görsün.',
      programTitle: 'Bir satırdan<br>bir programa.',
      closing: 'İlk programı<br>birlikte planlayalım.',
      alt: 'Birlikte bilgisayarda çalışan Kodjitsu karakterleri ve Python simgeleri',
      projects: [
        ['? → 7', 'Sayı tahmin oyunu', 'Oyuncunun tahminini kontrol eden, ipucu veren bir oyun. Koşullar ve döngüler somut bir karşılık bulur.'],
        ['+ − × ÷', 'Kendi hesaplayıcısı', 'Girilen sayıları işleyen küçük bir araç. Değişkenleri, kullanıcı girdisini ve işlemleri bir araya getirir.'],
        ['[ fikir, kod ]', 'Bir bilgi yarışması', 'Soruları saklayan, cevapları karşılaştıran ve puan tutan bir uygulama. Listeler ve fonksiyonlarla tanışır.']
      ],
      faq: ['Önceden kodlama bilmesi gerekiyor mu?', 'Gerekmiyor. Level 1 sıfırdan başlar; blok kodlama deneyimi varsa akış ona göre planlanır. Kayıt sırasında önceki deneyimini paylaşabilirsiniz.'],
      demo: ['ilk_programim.py', 'İlk satırın', 'fikir = "Benim ilk oyunum"', 'Örneği çalıştır', 'Benim ilk oyunum']
    }
  },
  {
    slug: 'softskill', name: 'Soft Skills', acc: '#B07500', wash: '#fff9ed', taslak: true,
    eyebrow: 'Kurs · Beceri', art: 'softskill-hero.jpg', baslangic: true, kartAcc: '#FFB020',
    olgular: [['Yaş', 'Görüşmede'], ['Seviye', 'Seviye 2–4'], ['Kurs', '8–128 ders paketi'], ['Ders', '60 dk']],
    araclar: 'Sunum ve takım çalışması atölyeleri',
    kart: {
      desc: 'Fikrini anlatmayı, dinlemeyi ve takımla çalışmayı öğrenir. Sunum yapar, geri bildirim verir ve alır; kendini ifade eder.',
      detayGiris: 'Teknik beceri tek başına yetmiyor. Çocuk ne yaptığını anlatamıyorsa ürettiği iş görünmez kalıyor; bu kurs o boşluğu kapatır.'
    },
    ogrenir: [
      ['Kendini ifade etme', 'Bir fikri açık, sıralı ve dinleyene göre anlatabilme.'],
      ['Dinleme ve geri bildirim', 'Anlamak için dinleme; yapıcı geri bildirim verme ve alma.'],
      ['Takımla çalışma', 'Rol paylaşımı, sorumluluk alma ve anlaşmazlığı çözerek ilerleme.'],
      ['Sunum yapma', 'Hazırlık, göz teması, tempo ve heyecanı yönetme; soruları karşılama.']
    ],
    uretir: ['Kısa sunumlar', 'Takım projesi', 'Geri bildirim atölyesi çıktıları'],
    kazanim: [
      ['Görünür olma', 'Yaptığı işi anlatabildiği için emeği karşılık bulur.'],
      ['Okulda ve sonrasında', 'Sunum, arkadaş ilişkileri ve ileride mülakatlar; hepsi aynı beceri.'],
      ['Özgüven', 'Söz almaktan çekinmeyen, fikrini savunabilen bir çocuk.']
    ],
    sayfa: {
      title: 'Fikri var.<br><em>Anlatmayı da öğrensin.</em>',
      intro: 'Ürettiği işi anlatabilsin, dinlemeyi bilsin, takımda çalışsın. Teknik beceriyi görünür kılan tarafı burada gelişir.',
      audience: 'Söz almaktan çekinen, fikrini anlatmakta zorlanan ya da takım çalışmasında ilerlemek isteyen çocuklar için. Diğer kurslarla birlikte alınabilir.',
      projectTitle: 'Anlatabildiği iş, iki kat değerli.',
      programTitle: 'Bir cümleden<br>bir sunuma.',
      closing: 'İlk sunumunu<br>birlikte hazırlayalım.',
      alt: 'Kodjitsu karakterlerinden biri küçük bir tahta başında sunum yapıyor, diğeri dinliyor',
      projects: [
        ['◔', 'Kısa sunum', 'Seçtiği bir konuyu üç adımda anlatır; girişi, ortası ve sonucu olan bir akış kurar.'],
        ['◎', 'Takım projesi', 'Rol paylaşımı yaparak ortak bir işi tamamlar; kimin neyi üstlendiğini birlikte planlar.'],
        ['↔', 'Geri bildirim atölyesi', 'Arkadaşının işine yapıcı geri bildirim verir, kendi işine gelen geri bildirimi değerlendirir.']
      ],
      faq: ['Bu kurs tek başına mı alınır?', 'Tek başına alınabilir; ancak çoğu öğrenci bir teknik kursla birlikte ilerlemeyi tercih ediyor. Ürettiği projeyi anlatmak, becerinin pekişmesi için doğal bir zemin oluşturuyor.'],
      demo: ['Sunum kurgusu', 'Üç adımda anlat', 'Giriş → Ne yaptım → Sonuç', 'Akışı gör', 'Önce merak uyandır, sonra işi göster, en son ne öğrendiğini söyle.']
    }
  },
  {
    slug: 'matematik', name: 'Matematik', acc: '#18765b', wash: '#f0f8f5',
    eyebrow: 'Kurs · Matematik', art: 'matematik-hero.jpg',
    olgular: [['Seviye', 'Sınıfa göre'], ['Ön koşul', 'Gerekmez'], ['Kurs', '8–128 ders paketi'], ['Ders', '60 dk']],
    araclar: 'Görsel araçlar · kod destekli anlatım',
    kart: {
      desc: 'Matematiği görerek keşfeder. Şekilleri, örüntüleri ve sayı ilişkilerini kodla somutlaştırır; konular sınıfına göre planlanır.',
      detayGiris: 'Denklem soyut kaldığı sürece sıkıcıdır. Burada her konu ekranda görünür hâle gelir; çocuk anlamadığı yeri gözüyle görür.'
    },
    ogrenir: [
      ['Sayılar ve ilişkiler', 'Seviyesine uygun işlemler, karşılaştırmalar ve günlük hayattan problemler.'],
      ['Geometriyi görme', 'Şekiller, ölçüler, simetri ve uzamsal düşünmeyi görsel örneklerle keşfetme.'],
      ['Mantık ve örüntüler', 'Kuralı bulma, tahmin etme ve bir çözümü sıralı adımlarla açıklama.'],
      ['Kodla somutlaştırma', 'Küçük görsel uygulamalarla matematiksel ilişkileri deneme ve karşılaştırma.']
    ],
    uretir: ['Şekillerle tasarım', 'Örüntü atölyesi', 'Çözüm karşılaştırma çalışması'],
    kazanim: [
      ['Korku kırılır', 'Matematik ezberlenen değil, denenip görülen bir şey hâline gelir.'],
      ['Okula yansır', 'Sınıf müfredatına paralel ilerlediği için karnesinde de karşılığı olur.'],
      ['Çözme alışkanlığı', 'Bir problemi farklı yollardan denemeyi ve anlatmayı öğrenir.']
    ],
    sayfa: {
      title: 'Matematiği<br><em>görerek keşfet.</em>',
      intro: 'Bir şeklin nasıl değiştiğini, bir örüntünün nasıl büyüdüğünü görsün. Sayıları, mantığı ve kodlamayı küçük denemelerle bir araya getirsin.',
      audience: 'Matematikteki kavramları somut örneklerle anlamak isteyen, şekilleri ve örüntüleri merak eden çocuklar için. Konular öğrencinin sınıfına ve ihtiyacına göre belirlenir.',
      projectTitle: 'Bir soruya farklı yollardan bak.',
      programTitle: 'Bir örnekten<br>bir çözüm yoluna.',
      closing: 'Öğrenme planını<br>birlikte oluşturalım.',
      alt: 'Kodjitsu karakterleri geometrik parçalar ve denge terazisiyle matematiği keşfediyor',
      projects: [
        ['△ □', 'Şekillerle tasarım', 'Şekilleri birleştirir, ölçülerini değiştirir; alan ve çevre arasındaki farkı örneklerle keşfeder.'],
        ['2 4 6', 'Örüntü atölyesi', 'Bir sayı dizisinin kuralını bulur, sonraki adımı tahmin eder ve kendi örüntüsünü kurar.'],
        ['↔', 'Çözümünü karşılaştır', 'Bir problemi farklı adımlarla çözmeyi dener; hangi yöntemin neden işe yaradığını anlatır.']
      ],
      faq: ['Hangi sınıf düzeyine uygun?', 'Konu ve seviye seçimi öğrencinin sınıfı, mevcut bilgisi ve ihtiyaçlarıyla birlikte değerlendirilir. Ön kayıt formunda yaşını paylaşarak uygun ders planı için iletişim kurabilirsiniz.'],
      demo: ['Şekilleri keşfet', 'Dikdörtgenin alanı', 'Kısa kenar: 3 · Uzun kenar: 4', 'Alanı bul', '3 × 4 = 12 birimkare.']
    }
  },
  {
    // Unity kart setinde yok; sayfası ve ana sayfa durağı korunuyor.
    slug: 'unity', name: 'Unity', acc: '#956000', wash: '#fff9ed', kartsiz: true,
    eyebrow: 'Kurs · Oyun Geliştirme', art: 'unity-hero.jpg',
    olgular: [['Seviye', 'Orta'], ['Ön koşul', 'Kodlama deneyimi'], ['Kurs', '8–128 ders paketi'], ['Ders', '60 dk']],
    araclar: 'Unity · C#',
    ogrenir: [
      ['Unity editörü ile tanışma', 'Sahne, nesneler ve bileşenleri tanıma; basit bir oyun alanı kurma.'],
      ['Hareket ve etkileşim', 'Karakter kontrolü, çarpışmalar ve fizik davranışlarını küçük örneklerle keşfetme.'],
      ['C# ile oyun mantığı', 'Değişkenler, koşullar ve fonksiyonlarla oyun içindeki davranışları düzenleme.'],
      ['Oyunu bir araya getirme', 'Hedef ve geri bildirim ekleme, oynayarak hata bulma ve projenin akışını iyileştirme.']
    ],
    uretir: ['Platform oyunu', 'Keşif sahnesi', 'Nesne toplama mekaniği'],
    kazanim: [
      ['Motor deneyimi', 'Profesyonel bir oyun motorunda proje kurmayı ve yürütmeyi öğrenir.'],
      ['Kod ve tasarım', 'Kodun oyun tasarımıyla nasıl birleştiğini uygulayarak görür.'],
      ['Bitmiş oyun', 'Dönem sonunda çalıştırılabilir bir oyun dosyası çıkar.']
    ],
    sayfa: {
      title: 'Hayalindeki oyun,<br><em>senin sahnen.</em>',
      intro: 'Bir karakter, bir dünya, kendi koyduğu kurallar. Unity ile çocuğunuz oyun fikrini sahneye taşısın; hareket, etkileşim ve kodu bir araya getirsin.',
      audience: 'Oyun geliştirmeye ilgi duyan, kendi 2B veya 3B dünyasını kurmak isteyen ve kodla etkileşim tasarlamayı merak eden öğrenciler için.',
      projectTitle: 'Sahneyi kur. Oyunu dene.',
      programTitle: 'Bir sahneden<br>oynanabilir bir oyuna.',
      closing: 'İlk oyun sahnesini<br>birlikte planlayalım.',
      alt: 'Kodjitsu karakterleri robotlu üç boyutlu bir oyun sahnesini tasarlıyor',
      projects: [
        ['↗', 'Bir platform oyunu', 'Hareket eden bir karakter, aşılacak engeller ve ulaşılacak bir hedef tasarlar.'],
        ['◇', 'Keşif sahnesi', 'Kamera, ışık ve nesnelerle gezilebilir bir alan kurar; sahnenin nasıl göründüğünü test eder.'],
        ['★', 'Nesne toplama görevi', 'Oyuncunun topladığı nesneleri sayan, hedefe ulaşıldığında geri bildirim veren bir mekanik üzerinde çalışır.']
      ],
      faq: ['Önceden kodlama bilmek gerekiyor mu?', 'Başlangıç noktası öğrencinin deneyimine göre değerlendirilir. Daha önce kod yazdıysa bunu kayıt sırasında paylaşabilirsiniz; konu akışı uygun seviyeden planlanır.'],
      demo: ['Oyun mekaniği', 'Toplanan nesneler', '3 yıldız + 1 yıldız', 'Puanı hesapla', 'Toplam: 4 yıldız.']
    }
  }
];

module.exports = {
  kurslar,
  // Kart üretiminde kullanılanlar (Unity'nin kartı yok)
  kartlik: () => kurslar.filter(k => !k.kartsiz),
  // Sayfa üretiminde kullanılanlar (python kaynak sayfa olduğu için ayrı tutulur)
  sayfalik: () => kurslar.filter(k => !k.kaynakSayfa),
  bul: slug => kurslar.find(k => k.slug === slug)
};
