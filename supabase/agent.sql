-- Kodjitsu sohbet asistani semasi (belgeleme kopyasi)
-- !!! NVIDIA anahtari BURADA YOK ve repoya asla yazilmaz (repo public).
--     Anahtar: Supabase -> Edge Functions -> Secrets -> NVIDIA_API_KEY
--     Edge function: supabase/functions/sohbet/index.ts  (verify_jwt = false;
--     korumalar fonksiyonun icinde: origin listesi, acik/kapali kapisi,
--     IP basina ve site geneli gunluk limit, girdi sinirlari)

create table if not exists public.agent_config (
  id            smallint primary key default 1 check (id = 1),
  enabled       boolean not null default false,
  bot_name      text not null default 'Kodjitsu Asistan' check (char_length(bot_name) between 2 and 40),
  greeting      text not null default '' check (char_length(greeting) <= 400),
  placeholder   text not null default 'Sorunuzu yazın…' check (char_length(placeholder) <= 80),
  system_prompt text not null default '' check (char_length(system_prompt) <= 12000),
  model         text not null default 'nvidia/nemotron-3-super-120b-a12b' check (char_length(model) between 3 and 80),
  temperature   numeric(3,2) not null default 0.60 check (temperature between 0 and 2),
  max_tokens    integer not null default 600 check (max_tokens between 64 and 4096),
  history_limit integer not null default 8 check (history_limit between 2 and 30),
  daily_limit   integer not null default 40 check (daily_limit between 1 and 500),
  total_limit   integer not null default 600 check (total_limit between 10 and 20000),
  updated_at    timestamptz not null default now()
);
alter table public.agent_config enable row level security;
drop policy if exists agent_config_admin_all on public.agent_config;
create policy agent_config_admin_all on public.agent_config
  for all to authenticated
  using (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid)
  with check (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid);
insert into public.agent_config (id) values (1) on conflict (id) do nothing;

-- Sistem promptu ziyaretciye HIC gonderilmez: edge function 'config'
-- eyleminde yalniz enabled/bot_name/greeting/placeholder doner.

create table if not exists public.chat_log (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sid        text check (sid is null or char_length(sid) <= 64),
  ip_hash    text check (ip_hash is null or char_length(ip_hash) <= 64),  -- ham IP saklanmaz
  role       text not null check (role in ('user','assistant')),
  content    text not null check (char_length(content) <= 8000),
  model      text check (model is null or char_length(model) <= 80)
);
create index if not exists chat_log_zaman on public.chat_log (created_at desc);
create index if not exists chat_log_ip on public.chat_log (ip_hash, created_at desc);
alter table public.chat_log enable row level security;
drop policy if exists chat_log_admin_read on public.chat_log;
create policy chat_log_admin_read on public.chat_log
  for select to authenticated
  using (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid);
drop policy if exists chat_log_admin_delete on public.chat_log;
create policy chat_log_admin_delete on public.chat_log
  for delete to authenticated
  using (auth.uid() = 'ad314a17-1411-4700-a001-1a2b3c4d5e6f'::uuid);
