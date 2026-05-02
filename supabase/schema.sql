-- Lon Suite 4.0 Supabase schema for the existing crm project.
-- This migration preserves existing crm tables and adds the fields required by the app.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id text primary key,
  auth_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text unique not null,
  role text not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assets alter column id type text using id::text;
alter table public.cases alter column id type text using id::text;

alter table public.assets add column if not exists owner_id text;
alter table public.assets add column if not exists thumbnail text;
alter table public.assets add column if not exists description text;
alter table public.assets add column if not exists attachments jsonb not null default '[]'::jsonb;
alter table public.assets add column if not exists is_deleted boolean not null default false;
alter table public.assets add column if not exists updated_at timestamptz not null default now();

alter table public.cases add column if not exists owner_id text;
alter table public.cases add column if not exists owner_name text;
alter table public.cases add column if not exists blocks jsonb not null default '[]'::jsonb;
alter table public.cases add column if not exists tags text[] not null default '{}';
alter table public.cases add column if not exists visibility text not null default 'private';
alter table public.cases add column if not exists shared_with text[] not null default '{}';
alter table public.cases add column if not exists access_count integer not null default 0;
alter table public.cases add column if not exists is_deleted boolean not null default false;
alter table public.cases add column if not exists deleted_at timestamptz;

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  owner_id text references public.profiles(id) on delete set null,
  feature text not null,
  prompt_tokens integer,
  response_tokens integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

update public.assets
set owner_id = coalesce(owner_id, 'user-demo-001'),
    thumbnail = coalesce(thumbnail, thumbnail_url, file_url),
    is_deleted = coalesce(is_deleted, deleted_at is not null);

update public.cases
set owner_id = coalesce(owner_id, 'user-demo-001'),
    tags = coalesce(tags, '{}'),
    status = coalesce(status, 'em_andamento');

alter table public.assets alter column owner_id set not null;
alter table public.cases alter column owner_id set not null;

insert into public.profiles (id, name, email, role)
values ('user-demo-001', 'Dr. Demo Lon Suite', 'demo@lonsuite.com.br', 'admin')
on conflict (id) do update
set name = excluded.name,
    email = excluded.email,
    role = excluded.role;

create index if not exists assets_owner_created_idx on public.assets (owner_id, created_at desc);
create index if not exists assets_tags_idx on public.assets using gin (tags);
create index if not exists cases_owner_created_idx on public.cases (owner_id, created_at desc);
create index if not exists cases_tags_idx on public.cases using gin (tags);
create index if not exists ai_usage_owner_created_idx on public.ai_usage_events (owner_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists assets_set_updated_at on public.assets;
create trigger assets_set_updated_at
before update on public.assets
for each row execute function public.set_updated_at();

drop trigger if exists cases_set_updated_at on public.cases;
create trigger cases_set_updated_at
before update on public.cases
for each row execute function public.set_updated_at();

alter table public.profiles disable row level security;
alter table public.assets disable row level security;
alter table public.cases disable row level security;
alter table public.ai_usage_events disable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.assets to anon, authenticated;
grant select, insert, update, delete on public.cases to anon, authenticated;
grant select, insert on public.ai_usage_events to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values ('assets-storage', 'assets-storage', true, 52428800)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Public read assets-storage" on storage.objects;
create policy "Public read assets-storage"
on storage.objects for select
using (bucket_id = 'assets-storage');

drop policy if exists "Public insert assets-storage" on storage.objects;
create policy "Public insert assets-storage"
on storage.objects for insert
with check (bucket_id = 'assets-storage');

drop policy if exists "Public update assets-storage" on storage.objects;
create policy "Public update assets-storage"
on storage.objects for update
using (bucket_id = 'assets-storage')
with check (bucket_id = 'assets-storage');

drop policy if exists "Public delete assets-storage" on storage.objects;
create policy "Public delete assets-storage"
on storage.objects for delete
using (bucket_id = 'assets-storage');
