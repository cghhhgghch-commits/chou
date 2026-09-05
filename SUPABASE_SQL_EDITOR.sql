-- Run this entire script in Supabase SQL Editor.
-- It is safe to run more than once.

-- Conversation attachments
alter table public.conversation_messages add column if not exists attachment_url text;
alter table public.conversation_messages add column if not exists attachment_name text;
alter table public.conversation_messages add column if not exists attachment_type text;

-- Storage bucket used by property images and conversation attachments
insert into storage.buckets (id, name, public)
values ('listing-media', 'listing-media', true)
on conflict (id) do update set public = true;

drop policy if exists "listing_media_upload_authenticated" on storage.objects;
create policy "listing_media_upload_authenticated"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'listing-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "listing_media_public_read" on storage.objects;
create policy "listing_media_public_read"
on storage.objects
for select
using (bucket_id = 'listing-media');

drop policy if exists "listing_media_delete_owner" on storage.objects;
create policy "listing_media_delete_owner"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'listing-media'
  and owner_id = (select auth.uid()::text)
);

-- Device tokens used by the real push notification function
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

drop policy if exists "fcm_tokens_select_own" on public.fcm_tokens;
create policy "fcm_tokens_select_own"
on public.fcm_tokens for select
using (auth.uid() = user_id);

drop policy if exists "fcm_tokens_insert_own" on public.fcm_tokens;
create policy "fcm_tokens_insert_own"
on public.fcm_tokens for insert
with check (auth.uid() = user_id);

drop policy if exists "fcm_tokens_update_own" on public.fcm_tokens;
create policy "fcm_tokens_update_own"
on public.fcm_tokens for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "fcm_tokens_delete_own" on public.fcm_tokens;
create policy "fcm_tokens_delete_own"
on public.fcm_tokens for delete
using (auth.uid() = user_id);

-- Ensure conversation rows and messages are protected
alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;

drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own"
on public.conversations for select
using (auth.uid() = any(participants));

drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own"
on public.conversations for insert
with check (auth.uid() = any(participants));

drop policy if exists "conversations_update_own" on public.conversations;
create policy "conversations_update_own"
on public.conversations for update
using (auth.uid() = any(participants));

drop policy if exists "messages_select_own" on public.conversation_messages;
create policy "messages_select_own"
on public.conversation_messages for select
using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and auth.uid() = any(c.participants)
  )
);

drop policy if exists "messages_insert_own" on public.conversation_messages;
create policy "messages_insert_own"
on public.conversation_messages for insert
with check (auth.uid() = sender_id);
