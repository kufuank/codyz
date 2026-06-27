# Codyz — Online AI & Kodlama Okulu

Statik site + öğrenci paneli MVP. Build adımı yok; saf HTML/CSS/JS + Supabase.

## Yapı
- `index.html` — landing (v1, yenilenecek)
- `dashboard.html` — panel tasarım mockup'ı (statik önizleme)
- `app/` — **çalışan MVP**
  - `index.html` — giriş / kayıt
  - `panel.html` + `panel.css` — veriye bağlı öğrenci paneli
  - `config.js` — Supabase istemcisi (publishable key; RLS korumalı)
- `assets/` — Higgsfield ile üretilen sumi-e görseller

## Backend (Supabase)
Tablolar: `profiles`, `tasks`; view: `leaderboard`. Kayıtta trigger otomatik profil + 4 idman kurar. Tüm tablolarda RLS açık.

## Yerel çalıştırma
```bash
python -m http.server 5173
# http://localhost:5173/app/  → giriş ekranı
```

## Deploy (ücretsiz)
Saf statik olduğu için herhangi bir statik host'a gider (GitHub Pages / Netlify / Cloudflare Pages). Giriş ekranı: `/app/`.

> Not: Sürtünmesiz kayıt için Supabase → Authentication → Email → "Confirm email" kapatılmalı.
> Özel alan adına (codyz.club) geçince Supabase Auth → Site URL + Redirect URLs güncellenmeli.
