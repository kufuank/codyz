-- Kodjitsu · /kayit sayfasi tam on-kayit formu semasi
-- Guvenlik modeli leads ile ayni: RLS acik, yalniz INSERT politikasi;
-- kayitlari okumak icin Supabase Studio (service role).

create table if not exists public.registrations (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  student_first_name text not null check (char_length(btrim(student_first_name)) between 2 and 60),
  student_last_name  text not null check (char_length(btrim(student_last_name)) between 2 and 60),
  student_age        smallint not null check (student_age between 5 and 18),
  student_gender     text check (student_gender is null or student_gender in ('Kız','Erkek')),
  student_phone      text check (student_phone is null or char_length(btrim(student_phone)) between 10 and 24),
  parent_name        text not null check (char_length(btrim(parent_name)) between 2 and 120),
  parent_phone       text not null check (char_length(btrim(parent_phone)) between 10 and 24),
  city               text not null check (char_length(btrim(city)) between 2 and 60),
  email              text not null check (position('@' in email) > 1 and char_length(email) <= 254),
  -- 31 Agu revizesi: interest zorunlu ilgi alani (Yazilim/Tasarim/Matematik),
  -- programs artik istege bagli kurs listesi (Python, Roblox, ...)
  interest           text check (interest is null or char_length(interest) <= 30),
  programs           text[] check (programs is null or array_length(programs, 1) between 1 and 10),
  days               text[] not null check (array_length(days, 1) between 1 and 7),
  hours              text[] not null check (array_length(hours, 1) between 1 and 6),
  source             text check (source is null or char_length(source) <= 60)
);

alter table public.registrations enable row level security;

drop policy if exists registrations_anon_insert on public.registrations;
create policy registrations_anon_insert on public.registrations
  for insert to anon, authenticated
  with check (true);
