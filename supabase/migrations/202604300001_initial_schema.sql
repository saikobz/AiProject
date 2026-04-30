create extension if not exists pgcrypto;

create schema if not exists private;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'member');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'document_status') then
    create type public.document_status as enum ('draft', 'published');
  end if;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'member',
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null unique,
  content text not null,
  category text not null,
  status public.document_status not null default 'draft',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.document_tags (
  document_id uuid not null references public.documents (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (document_id, tag_id)
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  document_id uuid references public.documents (id) on delete cascade,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at
before update on public.documents
for each row
execute function public.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.tags enable row level security;
alter table public.document_tags enable row level security;
alter table public.activity_logs enable row level security;
alter table public.ai_conversations enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles select self or admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or private.is_admin());

create policy "profiles update self or admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or private.is_admin())
with check (id = auth.uid() or private.is_admin());

create policy "documents select authenticated"
on public.documents
for select
to authenticated
using (true);

create policy "documents insert own"
on public.documents
for insert
to authenticated
with check (author_id = auth.uid() or private.is_admin());

create policy "documents update own or admin"
on public.documents
for update
to authenticated
using (author_id = auth.uid() or private.is_admin())
with check (author_id = auth.uid() or private.is_admin());

create policy "documents delete own or admin"
on public.documents
for delete
to authenticated
using (author_id = auth.uid() or private.is_admin());

create policy "tags select authenticated"
on public.tags
for select
to authenticated
using (true);

create policy "tags manage admin"
on public.tags
for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "document_tags select authenticated"
on public.document_tags
for select
to authenticated
using (true);

create policy "document_tags manage own or admin"
on public.document_tags
for all
to authenticated
using (
  exists (
    select 1
    from public.documents
    where documents.id = document_tags.document_id
      and (documents.author_id = auth.uid() or private.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.documents
    where documents.id = document_tags.document_id
      and (documents.author_id = auth.uid() or private.is_admin())
  )
);

create policy "activity select self or admin"
on public.activity_logs
for select
to authenticated
using (user_id = auth.uid() or private.is_admin());

create policy "activity insert self or admin"
on public.activity_logs
for insert
to authenticated
with check (user_id = auth.uid() or private.is_admin());

create policy "ai conversations select self or admin"
on public.ai_conversations
for select
to authenticated
using (user_id = auth.uid() or private.is_admin());

create policy "ai conversations insert self or admin"
on public.ai_conversations
for insert
to authenticated
with check (user_id = auth.uid() or private.is_admin());
