# Marka Geçişi — Codyz → Kodjitsu

**Tarih:** 18 Ağustos 2026 · **Karar:** proje adı **Kodjitsu**.

## Neden "Kodjitsu" (D ile)
Üretilmiş tüm kreatif varlıklarda başlık **"Kodjitsu Eğitimi"** olarak basılı: 6 kurs kapağı (kare + 9:16 + 16:9)
ve 13 video klip. "Kotjitsu" (T ile) yazımı bu varlıkların tamamının yeniden üretilmesini gerektirirdi;
kullanıcı onayıyla D'li yazımda karar kılındı.

## Kod tarafında yapılanlar
- Tüm `Codyz` / `codyz` / `CODYZ` geçişleri → `Kodjitsu` / `kodjitsu` / `KODJITSU`
- Wordmark işaretlemesi: `Cody<span class="z">z</span>` → `Kod<span class="z">jitsu</span>` (vurgu rengi "jitsu" hecesinde)
- `claude proje bundle/CODYZ_PROJE_TALIMATI.md` → `KODJITSU_PROJE_TALIMATI.md`
- E-posta placeholder'ları marka-nötr hâle getirildi (`ornek@eposta.com`) — alan adı kararı beklediği için

## Varlık envanteri
| Varlık | Konum | Not |
|---|---|---|
| Kurs kapakları (kare, orijinal) | `Desktop\kodjitsu\*.png` | Higgsfield çıktısı |
| Kurs kapakları 9:16 | `assets/kurslar/*-9x16.png` | reels/story |
| Kurs kapakları 16:9 | `assets/kurslar/*-16x9.png` | web + video poster |
| Reels klipleri (9:16, 7 adet) | `Desktop\kodjitsu\reels\` | repoya alınmadı (reklam kurgusu için) |
| Hero klipleri (16:9, 6 adet) | `assets/video/*.mp4` | sitede scroll reel'i |

**Üretim künyesi:** kapaklar GPT Image 2 (`gpt_image_2`), videolar Kling 3.0 (`kling3_0`, std, sessiz).
Toplam harcama: 9:16 seti 24 + 7 reels klibi 42 + 16:9 seti 24 + 6 wide klip 36 = **126 kredi**.

## Açık kararlar
- [ ] **Alan adı:** `codyz.club` elde; Kodjitsu için yeni alan adı alınacak mı? (site içi domain referansları nötrlendi)
- [ ] **Instagram kullanıcı adı:** `@kodjitsu` müsaitliği doğrulanmalı (footer linki bu adı gösteriyor)
- [ ] **Logo:** wordmark "Kodjitsu" için `assets/logo/` altındaki taslaklar yeniden çizilmeli (şu an eski harf kurgusu)
- [ ] Supabase Auth Site URL / Redirect URL'leri yeni alan adına göre güncellenecek
