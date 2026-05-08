-- Lon Suite 4.0 Supabase schema for the existing crm project.
-- This migration preserves existing crm tables and adds the fields required by the app.

create schema if not exists extensions;
create extension if not exists pgcrypto;
create extension if not exists vector with schema extensions;

create table if not exists public.profiles (
  id text primary key,
  auth_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text unique not null,
  role text not null default 'user',
  specialty text,
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
alter table public.assets add column if not exists embedding extensions.vector(1536);
alter table public.assets add column if not exists embedding_model text;
alter table public.assets add column if not exists embedding_status text not null default 'pending';
alter table public.assets add column if not exists embedding_updated_at timestamptz;
alter table public.assets add column if not exists thumbnail_format text;
alter table public.assets add column if not exists thumbnail_status text not null default 'pending';
alter table public.assets add column if not exists thumbnail_updated_at timestamptz;

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

create table if not exists public.asset_processing_jobs (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null references public.assets(id) on delete cascade,
  owner_id text not null references public.profiles(id) on delete cascade,
  job_type text not null check (job_type in ('embedding', 'thumbnail')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts integer not null default 0,
  error_message text,
  available_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (asset_id, job_type)
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
create index if not exists assets_embedding_hnsw_idx on public.assets using hnsw (embedding extensions.vector_cosine_ops) where embedding is not null;
create index if not exists cases_owner_created_idx on public.cases (owner_id, created_at desc);
create index if not exists cases_tags_idx on public.cases using gin (tags);
create index if not exists ai_usage_owner_created_idx on public.ai_usage_events (owner_id, created_at desc);
create index if not exists asset_processing_jobs_status_idx on public.asset_processing_jobs (status, available_at);
create index if not exists asset_processing_jobs_owner_created_idx on public.asset_processing_jobs (owner_id, created_at desc);

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

drop trigger if exists asset_processing_jobs_set_updated_at on public.asset_processing_jobs;
create trigger asset_processing_jobs_set_updated_at
before update on public.asset_processing_jobs
for each row execute function public.set_updated_at();

create or replace function public.enqueue_asset_processing_jobs()
returns trigger
language plpgsql
as $$
begin
  insert into public.asset_processing_jobs (asset_id, owner_id, job_type)
  values
    (new.id, new.owner_id, 'embedding'),
    (new.id, new.owner_id, 'thumbnail')
  on conflict (asset_id, job_type) do update
  set status = 'pending',
      attempts = 0,
      error_message = null,
      available_at = now(),
      completed_at = null,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists assets_enqueue_processing_jobs on public.assets;
create trigger assets_enqueue_processing_jobs
after insert or update of title, description, summary, scientific_context, tags, content, thumbnail, attachments
on public.assets
for each row execute function public.enqueue_asset_processing_jobs();

alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.cases enable row level security;
alter table public.ai_usage_events enable row level security;
alter table public.asset_processing_jobs enable row level security;

grant usage on schema public to anon, authenticated;
revoke all on public.profiles from anon;
revoke all on public.assets from anon;
revoke all on public.cases from anon;
revoke all on public.ai_usage_events from anon;
revoke all on public.asset_processing_jobs from anon;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.assets to authenticated;
grant select, insert, update, delete on public.cases to authenticated;
grant select, insert on public.ai_usage_events to authenticated;
grant select on public.asset_processing_jobs to authenticated;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid()::text or auth_user_id = auth.uid());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid()::text or auth_user_id = auth.uid());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid()::text or auth_user_id = auth.uid())
with check (id = auth.uid()::text or auth_user_id = auth.uid());

drop policy if exists "Users can manage own assets" on public.assets;
create policy "Users can manage own assets"
on public.assets for all
to authenticated
using (owner_id = auth.uid()::text)
with check (owner_id = auth.uid()::text);

drop policy if exists "Users can manage own cases" on public.cases;
create policy "Users can manage own cases"
on public.cases for all
to authenticated
using (owner_id = auth.uid()::text)
with check (owner_id = auth.uid()::text);

drop policy if exists "Users can read own ai usage" on public.ai_usage_events;
create policy "Users can read own ai usage"
on public.ai_usage_events for select
to authenticated
using (owner_id = auth.uid()::text);

drop policy if exists "Users can insert own ai usage" on public.ai_usage_events;
create policy "Users can insert own ai usage"
on public.ai_usage_events for insert
to authenticated
with check (owner_id = auth.uid()::text);

drop policy if exists "Users can read own asset processing jobs" on public.asset_processing_jobs;
create policy "Users can read own asset processing jobs"
on public.asset_processing_jobs for select
to authenticated
using (owner_id = auth.uid()::text);

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
