create table if not exists public.fcm_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null,
  token text not null,
  platform text not null default 'android',
  app_version text default 'unknown',
  user_agent text default '',
  is_active boolean not null default true,
  last_seen_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, device_id)
);

alter table public.fcm_tokens enable row level security;

create index if not exists fcm_tokens_user_idx on public.fcm_tokens(user_id);
create index if not exists fcm_tokens_active_idx on public.fcm_tokens(is_active);

create policy "fcm_tokens_select_own"
on public.fcm_tokens
for select
using (auth.uid() = user_id);

create policy "fcm_tokens_insert_own"
on public.fcm_tokens
for insert
with check (auth.uid() = user_id);

create policy "fcm_tokens_update_own"
on public.fcm_tokens
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "fcm_tokens_delete_own"
on public.fcm_tokens
for delete
using (auth.uid() = user_id);
