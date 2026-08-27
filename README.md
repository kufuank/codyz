# Kodjitsu — Online AI & Kodlama Okulu

> **Marka notu:** Proje Ağustos 2026'da **Codyz → Kodjitsu** olarak yeniden adlandırıldı.
> Ayrıntı: [MARKA_GECISI.md](MARKA_GECISI.md)

**Canlı:** https://kodjitsu.com
GitHub Pages, `main` dalının kökünden yayınlanıyor. HTTPS zorunlu, sertifika otomatik yenileniyor.
Alan adı repodaki `CNAME` dosyasıyla bağlı — **o dosya silinirse site düşer.**

Statik site. Build adımı yok; saf HTML/CSS/JS + Supabase.

## Yapı

| Dosya | Ne |
|---|---|
| `index.html` | **Ana sayfa.** Scroll ile sürülen tek video hero'su, 6 durak |
| `eski-site.html` | Önceki koyu temalı site. Arşiv, bağlantı verilmiyor |
| `dashboard.html` | Panel tasarım mockup'ı (statik) |
| `app/` | Çalışan MVP: giriş/kayıt + veriye bağlı öğrenci paneli (Supabase) |
| `assets/sahne/rail/` | Hero videosu, mobil kopyası ve poster karesi |
| `scripts/serve.js` | Yerel statik sunucu — video `Range` desteğiyle, scrub için şart |

## Hero nasıl çalışır

Arka planda **elle kurgulanmış tek bir 28 saniyelik video** var. Her 4. saniye bir **durak**:

| sn | Durak |
|---|---|
| 0–4 | Açılış — Kodjitsu nedir |
| 8 | Oyun dersleri — Roblox · Minecraft · Unity |
| 12 | Yazılım — Python · C# |
| 16 | Tasarım — Blender · Meshy.ai |
| 20 | Kodla Matematik |
| 24–28 | İçerik Üretici Okulu |

Motor iki parçadan ibaret: bir eşleme fonksiyonu ve bir `lerp`.

1. Scroll yüksekliği segmentlere bölünür (`SEG` tablosu): açılış taraması, ardından her durak için
   *geçiş* + *plato*, sonda final taraması. Toplam **995vh**.
2. Segment içi oran videonun `currentTime`'ına yazılır. **Dünyayı yalnız scroll sürer** —
   `performance.now()` ya da herhangi bir saat terimi yok. Scroll durunca video da durur.
3. Kartlar aynı vh ekseninden türeyen pencerelerle girer/çıkar; masaüstünde yandan gelip ufka
   çekilir, mobilde aşağıdan gelip yukarı süzülür.

**Videonun anahtar kare sıklığı kritik.** Kaynak dosyada 28 saniyede yalnızca 23 anahtar kare vardı;
scroll'da rastgele bir saniyeye atlarken tarayıcı takılıyordu. Yayındaki kopya `-g 12` ile yeniden
kodlandı (saniyede 2 anahtar kare). Videoyu değiştirirsen aynı şekilde kodla:

```bash
ffmpeg -i kaynak.mp4 -an -vf scale=1440:-2 -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 26 -g 12 -keyint_min 12 -sc_threshold 0 -movflags +faststart hero-28.mp4
```

Videolar `Range` istekleriyle sarıldığı için yayın ortamı **206 Partial Content** desteklemelidir
(GitHub Pages / Netlify / Cloudflare destekliyor).

## Mobil

860px altında ekran ikiye bölünür: üstte sabit video bandı (52svh, alçak ekranlarda 44svh),
altta beyaz metin paneli. 16:9 videoyu dar ekrana `cover` ile doldurmak kompozisyonu kırpıyordu;
bant yüksekliği sabitlenip `object-position` ile karakterler kadrajda tutuluyor.

Dar ekrana ayrı ve hafif kopya servis edilir (**3,7 MB**; masaüstü 8,0 MB). Kaynak viewport'a göre
JS ile seçilir, geçişte bulunulan saniye korunur.

> ⚠️ **iOS Safari'de scroll ile video tarama henüz gerçek cihazda test edilmedi.** Takılırsa
> çözüm hazır: mobilde taramayı bırakıp durak durak sabit karelere düşmek.

## Eğitim paketleri

**Kodlama:** Roblox · Minecraft · Unity · Python · C# · Kodlayarak Matematik
**AI:** İçerik Üretici Okulu (AI destekli kurgu/video/sinema)

## Backend (Supabase)

Tablolar: `profiles`, `tasks`; view: `leaderboard`. Kayıtta trigger otomatik profil + 4 görev kurar.
Tüm tablolarda RLS açık.

> Alan adı bağlandı: Supabase → Authentication → **Site URL ve Redirect URLs `https://kodjitsu.com`
> olarak güncellenmeli.** Sürtünmesiz kayıt için "Confirm email" kapalı tutuluyor.

## Yerel çalıştırma

```bash
node scripts/serve.js
```

`http://localhost:5180` → ana sayfa · `http://localhost:5180/app/` → giriş ekranı
