create table if not exists public.client_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 80),
  city text not null check (char_length(trim(city)) between 1 and 80),
  area text not null default '' check (char_length(area) <= 100),
  bedrooms integer check (bedrooms between 0 and 30),
  budget numeric(14, 2) not null check (budget > 0),
  currency text not null check (currency in ('SYP', 'USD')),
  phone text not null check (phone ~ '^9639[0-9]{8}$'),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists client_requests_status_created_at_idx
  on public.client_requests (status, created_at desc);

alter table public.client_requests enable row level security;

drop policy if exists "client_requests_insert_pending" on public.client_requests;
create policy "client_requests_insert_pending"
  on public.client_requests
  for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "client_requests_read_approved" on public.client_requests;

drop policy if exists "client_requests_admin_read_all" on public.client_requests;
create policy "client_requests_admin_read_all"
  on public.client_requests
  for select
  to authenticated
  using (public.is_admin_user());

drop policy if exists "client_requests_admin_update" on public.client_requests;
create policy "client_requests_admin_update"
  on public.client_requests
  for update
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

create or replace view public.approved_client_requests
  with (security_barrier = true)
as
  select id, title, city, area, bedrooms, budget, currency, created_at
  from public.client_requests
  where status = 'approved';

revoke select on public.client_requests from anon, public;
grant select on public.client_requests to authenticated;
grant select on public.approved_client_requests to anon, authenticated;
grant insert on public.client_requests to anon, authenticated;
grant update on public.client_requests to authenticated;

notify pgrst, 'reload schema';
