-- Lon Suite 4.0 Supabase schema
-- Compatible with the current frontend, which still uses a local/mock auth user.

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

create table if not exists public.assets (
  id text primary key,
  owner_id text not null references public.profiles(id) on delete cascade,
  title text not null,
  type text not null check (type in ('image', 'pdf', 'video', 'document')),
  tags text[] not null default '{}',
  content text,
  thumbnail text,
  description text,
  attachments jsonb not null default '[]'::jsonb,
  summary text,
  scientific_context text,
  evidence_level text check (evidence_level is null or evidence_level in ('Alto', 'Moderado', 'Baixo')),
  publication_year text,
  key_findings text,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id text primary key,
  owner_id text not null references public.profiles(id) on delete cascade,
  owner_name text,
  title text not null,
  description text,
  blocks jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  status text not null default 'em_andamento' check (status in ('em_andamento', 'completo', 'arquivado')),
  visibility text not null default 'private' check (visibility in ('private', 'shared', 'public')),
  shared_with text[] not null default '{}',
  access_count integer not null default 0,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  owner_id text references public.profiles(id) on delete set null,
  feature text not null,
  prompt_tokens integer,
  response_tokens integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

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

insert into public.profiles (id, name, email, role)
values ('user-demo-001', 'Dr. Demo Longecta', 'demo@longecta.com', 'admin')
on conflict (id) do update
set name = excluded.name,
    email = excluded.email,
    role = excluded.role;

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
