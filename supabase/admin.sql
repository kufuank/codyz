-- Kodjitsu /admin paneli semasi (belgeleme kopyasi)
-- !!! Admin sifresi bu dosyada YOKTUR ve repoya asla yazilmaz (repo public).
--     Gercek kullanici canli projede olusturuldu; sifre degistirmek icin:
--     Supabase Studio -> Authentication -> admin@kodjitsu.com -> Reset password.
-- Admin UID: ad314a17-1411-4700-a001-1a2b3c4d5e6f
-- Giris: /admin sayfasi "admin" kullanici adini admin@kodjitsu.com'a cevirir.

-- Admin kullanicisi Studio 'Add user' ile ya da SQL ile olusturulur
-- (auth.users + auth.identities; encrypted_password = crypt('<SIFRE>', gen_salt('bf'))).
-- Trigger'in actigi ogrenci profili admin icin silinir.

-- admin okuma politikalari
drop policy if exists leads_admin_select on public.leads;
create policy leads_admin_select on public.leads
  for select to authenticated
  using (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid);

drop policy if exists registrations_admin_select on public.registrations;
create policy registrations_admin_select on public.registrations
  for select to authenticated
  using (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid);

-- veli tablosu (admin paneli profil formu yazar/okur)
create table if not exists public.guardians (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  name       text not null check (char_length(btrim(name)) between 2 and 120),
  phone      text not null check (char_length(btrim(phone)) between 10 and 24),
  email      text check (email is null or (position('@' in email) > 1 and char_length(email) <= 254))
);
alter table public.guardians enable row level security;
drop policy if exists guardians_admin_all on public.guardians;
create policy guardians_admin_all on public.guardians
  for all to authenticated
  using (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid)
  with check (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid);

-- canli ziyaretci nabzi: ziyaretci 40 sn'de bir upsert atar,
-- admin son 75 sn'de gorulenleri sayar. PII yok.
create table if not exists public.site_presence (
  sid       text primary key check (char_length(sid) between 8 and 64),
  page      text check (page is null or char_length(page) <= 80),
  last_seen timestamptz not null default now()
);
alter table public.site_presence enable row level security;
drop policy if exists presence_anon_insert on public.site_presence;
create policy presence_anon_insert on public.site_presence
  for insert to anon, authenticated with check (true);
drop policy if exists presence_anon_update on public.site_presence;
create policy presence_anon_update on public.site_presence
  for update to anon, authenticated using (true) with check (true);
drop policy if exists presence_admin_select on public.site_presence;
create policy presence_admin_select on public.site_presence
  for select to authenticated
  using (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid);
drop policy if exists presence_admin_delete on public.site_presence;
create policy presence_admin_delete on public.site_presence
  for delete to authenticated
  using (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid);

-- last_seen'i sunucu saati belirler
create or replace function public.touch_presence() returns trigger
language plpgsql
set search_path = ''
as $$
begin new.last_seen := now(); return new; end $$;
drop trigger if exists site_presence_touch on public.site_presence;
create trigger site_presence_touch before insert or update on public.site_presence
  for each row execute function public.touch_presence();
