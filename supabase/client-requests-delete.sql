drop policy if exists "client_requests_admin_delete" on public.client_requests;
create policy "client_requests_admin_delete"
  on public.client_requests
  for delete
  to authenticated
  using (public.is_admin_user());

revoke delete on public.client_requests from anon, public;
grant delete on public.client_requests to authenticated;

notify pgrst, 'reload schema';
