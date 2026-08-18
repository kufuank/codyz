# Kodjitsu — Online AI & Kodlama Okulu

> **Marka notu:** Proje Ağustos 2026'da **Codyz → Kodjitsu** olarak yeniden adlandırıldı.
> Ad, tüm görsel/video varlıklardaki "Kodjitsu Eğitimi" başlığıyla hizalıdır. Ayrıntı: [MARKA_GECISI.md](MARKA_GECISI.md)

Statik site + öğrenci paneli MVP. Build adımı yok; saf HTML/CSS/JS + Supabase.

## Yapı
- `index.html` — landing. Hero, **scroll ile sarılan video reel'i**: 6 eğitim paketi sırayla tanıtılır
- `dashboard.html` — panel tasarım mockup'ı (statik önizleme)
- `app/` — **çalışan MVP**
  - `index.html` — giriş / kayıt
  - `panel.html` + `panel.css` — veriye bağlı öğrenci paneli
  - `config.js` — Supabase istemcisi (publishable key; RLS korumalı)
- `assets/` — sumi-e marka görselleri
  - `assets/kurslar/` — kurs kapakları: `*-9x16.webp` (reels/story), `*-16x9.webp` (web + video poster)
  - `assets/video/` — hero reel'inin 16:9 klipleri (Kling 3.0, sessiz, ~5 sn)
- `scripts/serve.js` — yerel statik sunucu (video `Range` desteğiyle; scrub için gerekli)

## Hero reel'i nasıl çalışır
`index.html` içindeki `.reel` bölümü 6 segmentlik uzun bir scroll alanıdır (`--seg` × 6 + 1 ekran):

1. Scroll ilerlemesi 0–1 aralığına indirgenir, 6'ya bölünür → aktif paket indeksi + segment içi konum.
2. Aktif pakete ait video görünür olur; segment içi konum videonun `currentTime`'ına yazılır → **scroll ileri/geri sarar**.
3. Metin paneli, ilerleme çizgileri ve `01/06` sayacı aynı indeksle güncellenir.
4. **Mobil / dokunmatik / `prefers-reduced-motion`**: scrub kapanır, aktif klip sessiz döngüde oynar (poster görseli her zaman ilk kare olarak yüklüdür).
5. Sekme gizliyken `requestAnimationFrame` durduğu için bekleyen kare id ile izlenir; sayfa görünür olunca ölçüm sıfırlanır.

Videolar `Range` istekleriyle sarıldığı için yayın ortamı **206 Partial Content** desteklemelidir (Netlify/Cloudflare/Pages varsayılan olarak destekler).

## Eğitim paketleri
- **Kodlama:** Roblox & Lua · Python · Unity · Blender · C# & .NET · Kodlayarak Matematik
- **Çocuklar için AI (yeni):** Görsel AI · İşitsel AI · Agentic AI → [AI_DERS_PAKETLERI.md](AI_DERS_PAKETLERI.md)

## Pazarlama
Şu an odak **Instagram**: sayfa kurulumu, içerik takvimi ve reklam planı → [INSTAGRAM_PLANI.md](INSTAGRAM_PLANI.md)
Reels kurgu planı → [REELS_STORYBOARD.md](REELS_STORYBOARD.md) · Görsel üretim promptları → [HIGGSFIELD_PROMPTLARI.md](HIGGSFIELD_PROMPTLARI.md)

## Backend (Supabase)
Tablolar: `profiles`, `tasks`; view: `leaderboard`. Kayıtta trigger otomatik profil + 4 idman kurar. Tüm tablolarda RLS açık.

## Yerel çalıştırma
```bash
node scripts/serve.js
```
`http://localhost:5180` → landing · `http://localhost:5180/app/` → giriş ekranı

## Deploy (ücretsiz)
Saf statik olduğu için herhangi bir statik host'a gider (GitHub Pages / Netlify / Cloudflare Pages). Giriş ekranı: `/app/`.

> Not: Sürtünmesiz kayıt için Supabase → Authentication → Email → "Confirm email" kapatılmalı.
> Özel alan adına geçince Supabase Auth → Site URL + Redirect URLs güncellenmeli (alan adı kararı bekliyor, bkz. MARKA_GECISI.md).
