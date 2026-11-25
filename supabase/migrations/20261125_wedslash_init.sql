-- Strictly prefixed for Wedslash in shared multi-tenant pvnpll Supabase project.
-- Does not alter, touch, or expose any sibling application objects.

create or replace function public.wedslash_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.wedslash_invitations (
  id bigint generated always as identity primary key,
  slug text not null unique check (char_length(slug) between 2 and 80 and slug ~ '^[a-z0-9-]+$'),
  template_id text not null check (char_length(template_id) between 2 and 80),
  config jsonb not null check (jsonb_typeof(config) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wedslash_invitations_updated_idx
  on public.wedslash_invitations (updated_at desc);

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'wedslash_invitations_updated_tg'
  ) then
    create trigger wedslash_invitations_updated_tg
      before update on public.wedslash_invitations
      for each row execute function public.wedslash_set_updated_at();
  end if;
end $$;

create table if not exists public.wedslash_rsvps (
  id bigint generated always as identity primary key,
  invite_slug text not null check (char_length(invite_slug) between 2 and 80),
  guest_name text not null check (char_length(btrim(guest_name)) between 1 and 160),
  guest_key text not null check (char_length(guest_key) between 1 and 160),
  guest_group text not null default 'Guest',
  status text not null check (status in ('yes', 'no', 'later')),
  guest_count integer not null default 1 check (guest_count between 0 and 50),
  children text not null default '',
  drinks text[] not null default '{}',
  diet text not null default '',
  song text not null default '',
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wedslash_rsvps_slug_key_uniq unique (invite_slug, guest_key)
);

create index if not exists wedslash_rsvps_slug_updated_idx
  on public.wedslash_rsvps (invite_slug, updated_at desc);

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'wedslash_rsvps_updated_tg'
  ) then
    create trigger wedslash_rsvps_updated_tg
      before update on public.wedslash_rsvps
      for each row execute function public.wedslash_set_updated_at();
  end if;
end $$;

alter table public.wedslash_invitations enable row level security;
alter table public.wedslash_rsvps enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.wedslash_invitations to anon, authenticated;
grant select, insert, update, delete on public.wedslash_rsvps to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'wedslash_invitations' and policyname = 'wedslash_invitations_select_policy'
  ) then
    create policy wedslash_invitations_select_policy
      on public.wedslash_invitations
      for select
      to anon, authenticated
      using (char_length(slug) >= 2);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'wedslash_invitations' and policyname = 'wedslash_invitations_insert_policy'
  ) then
    create policy wedslash_invitations_insert_policy
      on public.wedslash_invitations
      for insert
      to anon, authenticated
      with check (
        char_length(slug) between 2 and 80
        and slug ~ '^[a-z0-9-]+$'
        and jsonb_typeof(config) = 'object'
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'wedslash_invitations' and policyname = 'wedslash_invitations_update_policy'
  ) then
    create policy wedslash_invitations_update_policy
      on public.wedslash_invitations
      for update
      to anon, authenticated
      using (char_length(slug) >= 2)
      with check (
        char_length(slug) between 2 and 80
        and slug ~ '^[a-z0-9-]+$'
        and jsonb_typeof(config) = 'object'
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'wedslash_rsvps' and policyname = 'wedslash_rsvps_select_policy'
  ) then
    create policy wedslash_rsvps_select_policy
      on public.wedslash_rsvps
      for select
      to anon, authenticated
      using (char_length(invite_slug) >= 2);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'wedslash_rsvps' and policyname = 'wedslash_rsvps_insert_policy'
  ) then
    create policy wedslash_rsvps_insert_policy
      on public.wedslash_rsvps
      for insert
      to anon, authenticated
      with check (
        char_length(invite_slug) between 2 and 80
        and char_length(btrim(guest_name)) >= 1
        and char_length(guest_key) >= 1
        and status in ('yes', 'no', 'later')
        and guest_count between 0 and 50
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'wedslash_rsvps' and policyname = 'wedslash_rsvps_update_policy'
  ) then
    create policy wedslash_rsvps_update_policy
      on public.wedslash_rsvps
      for update
      to anon, authenticated
      using (char_length(invite_slug) >= 2)
      with check (
        char_length(invite_slug) between 2 and 80
        and char_length(btrim(guest_name)) >= 1
        and char_length(guest_key) >= 1
        and status in ('yes', 'no', 'later')
        and guest_count between 0 and 50
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'wedslash_rsvps' and policyname = 'wedslash_rsvps_delete_policy'
  ) then
    create policy wedslash_rsvps_delete_policy
      on public.wedslash_rsvps
      for delete
      to anon, authenticated
      using (char_length(invite_slug) >= 2);
  end if;
end $$;
