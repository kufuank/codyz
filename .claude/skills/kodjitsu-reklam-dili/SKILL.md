---
name: kodjitsu-reklam-dili
description: Kodjitsu için Instagram reklam ve organik içerik metni yazar veya mevcut metni denetler. Türkçe reklam registerinde, yapay zekâ yazdığı anlaşılmayan, veliye hitap eden metin üretir. Reklam metni, reels senaryosu, carousel, story, bio, SSS cevabı, satış mesajı yazarken veya bir metnin "AI gibi" olup olmadığını kontrol ederken kullan.
---

# Kodjitsu reklam dili

Kodjitsu'nun Instagram metinlerini yazar ve denetler. Amaç tek cümlede: **veli okuduğunda
bunu bir insanın yazdığını düşünsün, bir kurumun değil.**

## Önce oku

Metin yazmadan önce bu dosyaları oku — kaynak burada:
- **`MARKA_DILI.md`** — sözlük ve yasak kelimeler. **Her şeyden önce bu.**
- `EGITIM_KATALOGU.md` — programlar, sezonlar, fiyatlar, sertifika
- `PAZAR_ARASTIRMASI.md` §5 — veli segmentleri, tetikleyiciler, 10 itiraz
- `RAKIP_ANALIZI.md` §5 — savunulabilir boşluk, beş taahhüt, battlecard

Bilmediğin bir rakam kullanma. Fiyat, ders sayısı, grup büyüklüğü, tarih — hepsi
`EGITIM_KATALOGU.md` ve `FIYATLANDIRMA.md`'den gelir. Uydurma.

## Marka dili — 22 Ağustos 2026 kararı

Uzak doğu felsefesi **şirket kültürü** olarak kaldı, **müşteri dili olmaktan çıktı.**
Çocuk kuşak toplamıyor, bir **meslek kimliği** kuruyor.

| Kullanma | Kullan |
|---|---|
| usta | **mentor** |
| kuşak, beyaz/mor kuşak | **sezon** (1., 2., 3.) |
| şaheser | **portfolyo işi** |
| demo günü | **Gösterim Günü** |
| dönem | **sezon** (12 hafta) |
| idman | **haftalık iş** |
| kod-fu, dojo, lonca, "su gibi ol" | — kaldırıldı |
| Kodjitsu Club | **Kodjitsu Stüdyo** |

Programlar rol adıyla anılır: **Yönetmen · Tasarımcı · İçerik Üreticisi · Yazılımcı ·
Oyun Yapımcısı · AI Geliştirici · AI Girişimci.** "Kurs" değil "program", "seviye" değil "sezon".

Ana hat: **"Araç değişir, iş kalır."**

---

## 1 · Türkçe reklam registerinde AI kokusu

### Hangi skill ne zaman

Makinede `turkce-humanizer` skill'i de kurulu (`~/.claude/skills/turkce-humanizer`).
İkisi farklı iş yapar, karıştırma:

| İş | Hangi skill |
|---|---|
| Reklam metni, caption, reels overlay, story, bio, satış mesajı | **Bu skill** |
| Site metni, veli SSS, blog yazısı, sözleşme özeti, e-posta, uzun açıklama | `turkce-humanizer` |

`turkce-humanizer`'ın beş mutlak yasağı (uzun çizgi, noktalı virgül, **eksiltili cümle**,
**bağlaçla başlayan cümle**, karşıtlık bağlacı öncesi virgül) düzyazı için doğrudur ama
**reklam metnini bozar** — reklam tam olarak eksiltili cümleyle ve "Ama" ile başlayan
cümleyle yaşar. Reklam metnini ona sokma.

### Reklamda AI kokusu nereden gelir

Reklamda eksiltili cümle serbesttir, "Ama" ile cümle başlatmak serbesttir, tek kelimelik
satır serbesttir. Koku **başka yerlerden** gelir:

### Yasak kelimeler ve kalıplar

| Yasak | Neden | Yerine |
|---|---|---|
| "-mektedir / -maktadır" | Rapor dili, hiçbir veli böyle konuşmaz | "-iyor" |
| "sadece X değil, aynı zamanda Y" | En bilinen LLM retoriği | Tek şey söyle |
| "eşsiz", "benzersiz", "mükemmel deneyim" | İçi boş övgü | Somut şey söyle |
| "keşfedin", "dönüştürün", "güçlendirin" | Şişirilmiş emir kipi | "bak", "dene", "gel" |
| "geleceğe yatırım" | En eski eğitim klişesi | Ne olacağını tarif et |
| "çağı yakalayın", "geride kalmasın" | Korku klişesi, herkes kullanıyor | Somut kaygıya değin |
| Üçlü sıfat listesi ("hızlı, güvenli ve etkili") | LLM'in en sevdiği ritim | İki, ya da bir |
| "Peki ya siz?" / "Peki nasıl?" | Sahte soru | Soruyu sorma, cevabı yaz |
| "Unutmayın:" ile kapanış | Öğretmen tonu | Kapanışı CTA yap |
| Her satır başında emoji | Kurumsal sosyal medya kokusu | Postta en fazla 2 emoji |
| "Sevgili veliler," | Bülten dili | Doğrudan konuş |
| Uzun çizgi (—) | Türkçe reklamda kimse kullanmıyor | Nokta veya virgül |

### Yapısal kokular

- **Bütün cümleler aynı uzunlukta.** Gerçek insan 3 kelimeden 15 kelimeye gider, sonra 4'e döner.
- **Her paragraf aynı kalıpta başlıyor.** Değiştir.
- **Rakam yok.** İnsan somut konuşur: "6 kişilik grup", "cumartesi 10.00", "12 hafta".
- **İtiraz karşılanmamış.** Reklam sadece övüyorsa reklamdır. İnsan karşı tarafın ne düşündüğünü bilir.
- **Hiç eksik bırakılmamış.** İnsan her şeyi söylemez, bir şeyi merak bırakır.

### İzin verilenler (düzyazı humanizer'ının yasakladığı ama reklamda doğru olanlar)

- Eksiltili cümle: "Mentoru değişmez. Hiç."
- Bağlaçla başlayan cümle: "Ama çocuk ekranı bırakmıyor."
- Tek kelimelik satır: "Bitiriyorlar."
- Konuşma bağlaçları: "işte", "zaten", "aslında", "hani", "yani"
- Devrik cümle: "Fiyatı sitede yazıyor, aramanıza gerek yok."

---

## 2 · Kime yazıyoruz

**Karar veren veli, kullanan çocuk.** 1 Kasım 2026'dan sonra 15 yaş altı Instagram'da olmayacak
(7578 sayılı Kanun). Yani **bütün reklam metni veliye yazılır.** Çocuk dili yalnızca
çocuğun ürettiği şeyi gösterirken kullanılır.

Ayrıca: **çocuğu doğrudan satın almaya yönlendirmek hukuken yasak.** "Anneni ikna et",
"hemen kaydol" gibi çocuğa yönelik CTA yazma.

### Beş segment, beş farklı giriş

| Segment | İlk cümle nereye dokunur | Kaçın |
|---|---|---|
| **Ekran Süresi Savaşçısı** | Günlük kavga. "Yine mi Roblox" | Ekranı kötüleme — çocuğu savunuyormuş gibi ol |
| **Kaygılı Yatırımcı** | "İşe yarayacak mı, yoksa moda mı" | Gelecek korkusu satma; çıktıyı göster |
| **Hamleci Ebeveyn** | "Benim kaçırdığımı kaçırmasın" | Acındırma |
| **Başarı Odaklı** | Zaman: "haftada 1 saat" | Okul başarısı vaat etme |
| **Sosyalleşme Arayan** | Grup, akran, Gösterim Günü | "Arkadaş edinir" garantisi verme |

---

## 3 · Kanca formülleri

İlk satır 125 karakterde kesilir. Kanca oraya sığmalı.
Aşağıdakiler Kodjitsu'nun araştırmasından türetildi — genel formül listesi değil.

**1 · Sahne kancası.** Velinin evinde geçen bir anı tarif et.
> "Saat 21.00. 'Beş dakika daha' diyeli kırk dakika oldu."

**2 · İtiraf kancası.** Rakibin yaptığını söylemediği şeyi söyle.
> "Deneme dersinden sonra sizi kimse aramayacak."

**3 · Rakam kancası.** Tek, somut, doğrulanabilir rakam.
> "6 kişilik grup. Mentoru 12 hafta boyunca değişmiyor."

**4 · Ters kanca.** Beklenenin tersini söyle.
> "Çocuğunuzun ekran süresini azaltmayacağız."

**5 · Çıktı kancası.** 12 hafta sonra elinde ne olacak.
> "Şubat'ta elinde kendi yaptığı bir oyun olacak."

**6 · İtiraz kancası.** Velinin kafasındaki soruyu onun ağzından sor.
> "'AI kod yazıyor, bu iş bitmedi mi' diyorsanız haklısınız. Yarısında."

**Kullanılmayacak kanca tipleri:** "Biliyor muydunuz?", "3 şey", "Herkesin kaçırdığı",
"Bunu yapmayın", aciliyet baskısı ("son 3 kontenjan" — rakibin en çok şikayet aldığı taktik).

---

## 4 · Ne söyleyebiliriz, ne söyleyemeyiz

Beş taahhüt — bunlar reklamın omurgası, çünkü rakip bunları veremiyor:

1. Mentoru sezon boyunca değişmez
2. Deneme dersinde satış konuşması yok
3. Fiyat sitede yazıyor
4. Cayma kesintisiz
5. Mentorun adı, yüzü, özgeçmişi açık

**Söylenmeyecekler (hukuki):**
- "%100 başarı", "garantili", "en iyi", "Türkiye'nin 1 numaralı"
- "MEB onaylı" — onay alınmadıkça
- Doğrulanmamış istatistik (6,4 saat ekran süresi rakamı birincil kaynağa inilmeden reklamda kullanılmaz)
- Rakibi isimle kötüleme. Kendi taahhüdünü söyle, karşılaştırmayı veli yapsın.

---

## 5 · Format kuralları

**Reels metni:** İlk 3 saniyede hareket. Overlay 3 kelimeyi geçmez. Tek mesaj.
Alt %15 ve üst %12 boş (arayüz kapatıyor). ğ ş İ ı karakterleri kontrol edilir.

**Carousel:** Kapak kancası, 3–5 kare, son kare CTA. Araştırma notu: 1–5K takipçi bandında
**carousel Reels'ten daha çok görüntülenme alıyor** — Reels yeni kişiye ulaştırır, carousel ikna eder.
Yani kanıt ve fiyat carousel'e, kanca Reels'e.

**Caption:** İlk satır kanca. Sonra boş satır. 2–4 kısa paragraf. Son satır tek CTA.
Hashtag en fazla 5, caption sonunda.

**Story:** Tek soru veya tek görsel. Anket ve soru kutusu itiraz toplamak için kullanılır.

---

## 6 · Yazdıktan sonra kendini denetle

Metni teslim etmeden önce bunları geç:

- [ ] İçinde yasak kelime listesinden bir şey var mı?
- [ ] Cümle uzunlukları değişiyor mu, yoksa hepsi aynı mı?
- [ ] En az bir somut rakam veya isim var mı?
- [ ] Bir itiraza değiyor mu?
- [ ] Üçlü liste var mı? (varsa ikiye indir)
- [ ] Emoji sayısı 2'yi geçiyor mu?
- [ ] Çocuğa satın alma çağrısı yapıyor mu? (yapıyorsa sil)
- [ ] Doğrulanmamış rakam var mı?
- [ ] Yüksek sesle okununca insan gibi mi duruyor, sunum gibi mi?
- [ ] "Bunu bir marka mı yazdı, bir insan mı" — dürüst cevap ne?

Son kontrol: metni bir cümleyle özetle. Özet metinden daha iyiyse metni at, özeti yaz.

---

## 7 · Örnekler

**Kötü (AI kokuyor):**
> 🚀 Çocuğunuzun geleceğine yatırım yapın! Kodjitsu'da sadece kodlama öğretmiyor, aynı zamanda
> yapay zekâ çağına hazırlıyoruz. Eşsiz müfredatımız, deneyimli eğitmenlerimiz ve modern
> yaklaşımımızla çocuğunuz teknolojiyi keşfedecek. 💻✨ Hemen kaydolun! 🎯

Neden kötü: emoji enflasyonu, "sadece X değil aynı zamanda", üçlü liste, "eşsiz",
"geleceğe yatırım", "keşfedecek", tek somut şey yok, hiçbir itiraza değmiyor.

**İyi:**
> Saat 21.00. "Beş dakika daha" diyeli kırk dakika oldu.
>
> Biz o kırk dakikayı almıyoruz. Yönünü değiştiriyoruz.
>
> Çocuk Roblox'ta oynamayı biliyor zaten. Biz oyunu yapmayı öğretiyoruz. 6 kişilik grup,
> haftada bir saat, mentoru 12 hafta boyunca değişmiyor.
>
> Şubat'ta elinde kendi yaptığı bir oyun olacak.
>
> Fiyat sitede yazıyor. Deneme dersinden sonra kimse sizi aramayacak.

Neden iyi: sahne kancası, cümle uzunlukları değişiyor, dört somut rakam, iki itiraza değiyor
(ekran süresi + satış baskısı), emoji yok, klişe yok, bir şey merak bırakıyor.
