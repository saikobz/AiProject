drop policy if exists "documents select authenticated" on public.documents;
drop policy if exists "activity select self or admin" on public.activity_logs;
drop policy if exists "ai conversations select self or admin" on public.ai_conversations;

create policy "documents select published or own or admin"
on public.documents
for select
to authenticated
using (
  status = 'published'::public.document_status
  or author_id = auth.uid()
  or private.is_admin()
);

create policy "activity select authenticated"
on public.activity_logs
for select
to authenticated
using (true);

create policy "ai conversations select authenticated"
on public.ai_conversations
for select
to authenticated
using (true);
