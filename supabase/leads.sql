-- Kodjitsu · basvuru formu (leads) semasi
-- Ana sayfadaki form anon anahtar ile REST uzerinden INSERT atar.
-- Guvenlik modeli: RLS acik, yalniz INSERT politikasi var; anon/authenticated
-- SELECT/UPDATE/DELETE yapamaz. Kayitlari okumak icin Supabase Studio
-- (service role) kullanilir.

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  parent_name text not null check (char_length(btrim(parent_name)) between 2 and 120),
  phone       text not null check (char_length(btrim(phone)) between 10 and 24),
  email       text check (email is null or (position('@' in email) > 1 and char_length(email) <= 254)),
  child_age   smallint check (child_age between 5 and 18),
  program     text check (program is null or char_length(program) <= 60),
  intent      text check (intent is null or char_length(intent) <= 30),
  source      text check (source is null or char_length(source) <= 60)
);

alter table public.leads enable row level security;

drop policy if exists leads_anon_insert on public.leads;
create policy leads_anon_insert on public.leads
  for insert to anon, authenticated
  with check (true);
