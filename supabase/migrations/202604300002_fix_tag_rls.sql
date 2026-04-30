alter table public.tags enable row level security;
alter table public.document_tags enable row level security;

drop policy if exists "tags select authenticated" on public.tags;
drop policy if exists "tags insert authenticated" on public.tags;
drop policy if exists "tags update admin" on public.tags;
drop policy if exists "tags delete admin" on public.tags;
drop policy if exists "tags manage admin" on public.tags;

create policy "tags select authenticated"
on public.tags
for select
to authenticated
using (true);

create policy "tags insert authenticated"
on public.tags
for insert
to authenticated
with check (true);

create policy "tags update admin"
on public.tags
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "tags delete admin"
on public.tags
for delete
to authenticated
using (private.is_admin());

drop policy if exists "document_tags select authenticated" on public.document_tags;
drop policy if exists "document_tags manage own or admin" on public.document_tags;

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
