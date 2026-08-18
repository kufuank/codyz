# Kodjitsu Reels Reklamı — Storyboard v1

> Kaynak: `C:\Users\Renee\Desktop\kodjitsu\*_9x16.png` (Higgsfield / GPT Image 2 ile 9:16'ya genişletildi)
> Hedef: Instagram Reels · 1080×1920 · ~24 sn · müzik odaklı, VO yok
> Üretim zinciri: Higgsfield MCP → Kling 3.0 image-to-video (her sahne kendi kapağından başlar) → kurgu (CapCut/Premiere)

## Genel kurallar
- Her klip ilgili 9:16 kapağın **birebir karesinden** başlar (start_image = Higgsfield job ID).
- Metinler (başlık, rozet, "Ustanı Bul") **sabit kalır** — prompt'larda "all text perfectly static, no warping" zorunlu.
- Hareket dili: karakterlerde hafif idle (nefes, kumaş/saç salınımı) + sahne props'larının animasyonu + yavaş sinematik push-in (~%5).
- Geçişler: beat-synced smash cut + 2 kare beyaz flaş (kurguda). Müzik: taiko + trap hibrit, ~132 BPM.
- Her sahne 4 sn üretilir, kurguda ~3.5 sn kullanılır (baş/son kırpma payı).

## Sahne akışı

| # | Zaman | Sahne | Hareket özeti | Overlay (kurguda) |
|---|-------|-------|----------------|--------------------|
| 1 | 0.0–3.5 | **PYTHON** (hook, gece) | Fenerler titreşir, kiraz yaprakları süzülür, sarı+mavi yılanlar kıvrılıp baş kaldırır | "Kod dojosuna hoş geldin 🥋" |
| 2 | 3.5–7.0 | **ROBLOX** | Ateş enerjisi nabız gibi parlar, bloklar/platformlar zıplar, blok figürler hoplar | — |
| 3 | 7.0–10.5 | **UNITY** | Su girdabı enerji döner, piksel sprite'lar zıplar, oyun penceresi parıldar | — |
| 4 | 10.5–14.0 | **BLENDER** | Turuncu enerji şeritleri akar, donut & Suzanne yavaşça yörüngede döner, node panelleri parıldar | — |
| 5 | 14.0–17.5 | **C#** | Mor/macenta enerji döner, # ve .NET altıgenleri yukarı süzülür, parşömenler dalgalanır | — |
| 6 | 17.5–21.0 | **MATEMATİK** | Altın/mavi sayı çemberleri döner, π ve ∞ nabız atar, abaküs taneleri kayar | — |
| 7 | 21.0–24.0 | **KAPANIŞ** (Python karesi devam) | Kamera butona yaklaşır, "Ustanı Bul" butonu kalp atışı gibi parlar, ışıltılar butona toplanır | "İlk ders ücretsiz → profildeki link" |

## Kling 3.0 prompt'ları (üretime hazır)

Ortak son ek (her prompt'un sonuna eklenir):
> Characters hold their martial-arts stance with subtle idle motion (breathing, cloth and hair flutter). All text, badges and the button remain perfectly static, no warping or morphing. Slow cinematic push-in. Keep the 2D cartoon illustration style exactly.

1. **Python** — `Night dojo comes alive: paper lanterns flicker and gently sway, cherry blossom petals drift down, the yellow and blue glowing snakes slowly coil and raise their heads, code scrolls shimmer with soft light.` *(start_image job: 37c1b89a-fa41-4520-a398-fd344c371fc8)*
2. **Roblox** — `The boy's fire energy flares in rhythmic pulses, smoke wisps swirl around the girl's fists, colorful game blocks and grass platforms bob up and down, blocky figures hop playfully.` *(6722efa9-a13c-4aa7-a0b5-41fec568ba51)*
3. **Unity** — `Water-swirl energy rotates around both kids, pixel sprites blink and hop across floating platforms, the video player window glints, game controllers float gently.` *(ddc26bd7-68ba-4cbc-b468-c3093d608949)*
4. **Blender** — `Orange energy ribbons flow around the kids, donuts and 3D primitives orbit slowly, the grey monkey head sculpture rotates, node-editor panels glow and tick.` *(0f54c928-962c-430a-bcf8-229ac14aa6a1)*
5. **C#** — `Magenta and purple energy swirls rotate, floating # symbols and .NET hexagons drift upward, hanging calligraphy scrolls sway softly, the code editor panel glints.` *(fc70c57d-332f-4780-a4ed-75ba3ce67507)*
6. **Matematik** — `Golden and blue magic circles of numbers rotate around each kid, the π and infinity symbols pulse with light, abacus beads slide, chalk formulas shimmer on the scrolls.` *(b19dd5f1-9ec5-4081-a43a-83b0aa1a9080)*
7. **Kapanış** — Python karesinden: `Slow dolly toward the bottom button while sparkles gather around it; the green pill button glows and pulses softly like a heartbeat; lanterns keep flickering.` *(37c1b89a-fa41-4520-a398-fd344c371fc8)*

## Üretim — TAMAMLANDI (2026-08-14)
- Model: **Kling 3.0** (`kling3_0`) · mode `std` · 4 sn · 9:16 · ses kapalı · 7 klip · 6 kredi/klip = **42 kredi**
- Çıktı çözünürlüğü: **720×1280** (std mod). Kurguda 1080×1920'ye upscale edilecek; daha keskin master isteniyorsa aynı prompt'lar `mode: "pro"` ile tekrarlanabilir.
- Klipler: `C:\Users\Renee\Desktop\kodjitsu\reels\` → `1_python.mp4`, `2_roblox.mp4`, `3_unity.mp4`, `4_blender.mp4`, `5_csharp.mp4`, `6_matematik.mp4`, `7_kapanis.mp4`

### Kurgu adımları (CapCut / Premiere — elle)
1. Klipleri yukarıdaki sıraya diz, her birini ~3.5 sn'ye kırp (baş/son 0.25 sn at).
2. Geçiş: beat üstünde smash cut + 2 kare beyaz flaş.
3. Müzik: taiko + trap hibrit, ~132 BPM; geçişlerde whoosh SFX.
4. Overlay metinler: 0.3 sn'de "Kod dojosuna hoş geldin 🥋", 21. sn'de "İlk ders ücretsiz → profildeki link".
5. Her klipte %3 dijital zoom drift; kapak karesi (cover) Python sahnesi.
6. Export: 1080×1920, 30 fps, H.264, ≤30 sn.

---

## Wide (16:9) sürüm — site hero reel'i · 18 Ağustos 2026
Aynı 6 paket, web için yeniden üretildi: kare kapaklar önce 16:9'a genişletildi (GPT Image 2, 4 kredi/görsel),
sonra bu wide kapaklardan 5 sn'lik klipler üretildi (Kling 3.0 std, sessiz, 6 kredi/klip) — toplam **60 kredi**.

| Sıra | Paket | Repo yolu | Poster |
|---|---|---|---|
| 1 | Roblox & Lua | `assets/video/roblox.mp4` | `assets/kurslar/roblox-16x9.webp` |
| 2 | Python | `assets/video/python.mp4` | `assets/kurslar/python-16x9.webp` |
| 3 | Unity | `assets/video/unity.mp4` | `assets/kurslar/unity-16x9.webp` |
| 4 | Blender | `assets/video/blender.mp4` | `assets/kurslar/blender-16x9.webp` |
| 5 | C# & .NET | `assets/video/csharp.mp4` | `assets/kurslar/csharp-16x9.webp` |
| 6 | Kodlayarak Matematik | `assets/video/matematik.mp4` | `assets/kurslar/matematik-16x9.webp` |

Sitede kullanım: `index.html` → `.reel` bölümü. Scroll ilerlemesi segmentlere bölünür,
segment içi konum videonun `currentTime` değerine yazılır (ileri/geri sarma). Ayrıntı: README.

> Not: klipler 1280×720 (std mod). Daha keskin master gerekirse aynı prompt'lar `mode: "pro"` ile tekrarlanır.
