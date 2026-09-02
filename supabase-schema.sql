-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  phone_number text,
  avatar_url text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Listings table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text,
  description text,
  price numeric default 0,
  price_in_usd numeric,
  price_period text,
  city_id text,
  area_id text,
  type text default 'sale',
  category text default 'houses',
  property_type text,
  ownership_type text,
  finishing text,
  floor text,
  total_floors text,
  bedrooms integer default 0,
  bathrooms integer default 0,
  salons text,
  area numeric,
  land_area numeric,
  furnishing text,
  has_solar_power boolean default false,
  has_water_well boolean default false,
  has_elevator boolean default false,
  has_generator boolean default false,
  amenities jsonb default '[]'::jsonb,
  images jsonb default '[]'::jsonb,
  videos jsonb default '[]'::jsonb,
  is_verified boolean default false,
  is_featured boolean default false,
  status text default 'active',
  advertiser_type text default 'owner',
  advertiser_name text,
  phone text,
  whatsapp text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Favorites table
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, listing_id)
);

-- Conversations table
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  participants uuid[] default '{}',
  listing_id uuid references public.listings(id) on delete set null,
  listing_title text default 'إعلان',
  listing_image text default '',
  last_message text default '',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Conversation messages table
create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_name text,
  text text,
  created_at timestamptz default now()
);

-- Pending listing submissions for the admin review queue
create table if not exists public.whatsapp_leads (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  status text default 'pending',
  parsed_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

insert into storage.buckets (id, name, public)
values ('listing-media', 'listing-media', true)
on conflict (id) do update set public = true;

-- Admins table
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text,
  role text default 'super_admin',
  is_admin boolean default true,
  permissions jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- FCM tokens table for real push notifications
create table if not exists public.fcm_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  device_id text not null,
  token text not null,
  platform text default 'android',
  app_version text default 'unknown',
  user_agent text default 'unknown',
  is_active boolean default true,
  last_seen_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, device_id)
);

create or replace function public.admin_delete_listing(
  p_listing_id uuid,
  p_admin_email text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted boolean;
  deleted_count integer;
begin
  if not exists (
    select 1 from public.admins
    where lower(email) = lower(p_admin_email)
    and is_admin = true
  ) then
    raise exception 'admin permission denied';
  end if;

  delete from public.listings where id = p_listing_id;
  get diagnostics deleted_count = row_count;
  deleted := deleted_count > 0;
  return deleted;
end;
$$;

grant execute on function public.admin_delete_listing(uuid, text) to anon, authenticated;

-- RLS policies
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.admins enable row level security;
alter table public.fcm_tokens enable row level security;
alter table public.whatsapp_leads enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

create policy "listings_select_public" on public.listings
for select using (true);
create policy "listings_insert_own" on public.listings
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "listings_update_own" on public.listings
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "listings_delete_own" on public.listings
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "favorites_select_own" on public.favorites
for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites
for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites
for delete using (auth.uid() = user_id);

create policy "conversations_select_own" on public.conversations
for select using (auth.uid() = any(participants));
create policy "conversations_insert_own" on public.conversations
for insert with check (auth.uid() = any(participants));
create policy "conversations_update_own" on public.conversations
for update using (auth.uid() = any(participants));

create policy "messages_select_own" on public.conversation_messages
for select using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and auth.uid() = any(c.participants)
  )
);
create policy "messages_insert_own" on public.conversation_messages
for insert with check (auth.uid() = sender_id);

create policy "admins_select_any" on public.admins
for select using (true);
create policy "admins_manage_admins" on public.admins
for all using (true) with check (true);

create policy "users_manage_own_fcm_tokens"
on public.fcm_tokens
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "whatsapp_leads_insert_authenticated"
on public.whatsapp_leads
for insert
to authenticated
with check (true);

create policy "whatsapp_leads_admin_read"
on public.whatsapp_leads
for select
using (true);

create policy "whatsapp_leads_admin_update"
on public.whatsapp_leads
for update
using (true)
with check (true);

create policy "listing_media_upload_authenticated"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'listing-media' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "listing_media_public_read"
on storage.objects
for select
using (bucket_id = 'listing-media');

create policy "listing_media_delete_owner"
on storage.objects
for delete
to authenticated
using (bucket_id = 'listing-media' and owner_id = (select auth.uid()::text));

-- Helpful indexes
create index if not exists listings_created_at_idx on public.listings(created_at desc);
create index if not exists listings_city_idx on public.listings(city_id);
create index if not exists favorites_user_idx on public.favorites(user_id);
create index if not exists conversations_participants_idx on public.conversations using gin(participants);
create index if not exists fcm_tokens_user_active_idx on public.fcm_tokens(user_id, is_active);
