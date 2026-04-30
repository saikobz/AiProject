# Team Knowledge Hub

Full-stack portfolio project for a document knowledge base with Supabase auth, document CRUD, dashboard metrics, and Gemini-powered summary/Q&A.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Supabase SSR helpers
- Gemini API via `@google/genai`
- Zod for validation

## What is included

- App routes for `dashboard`, `documents`, `login`, `signup`, `admin`, and `settings`
- Supabase SSR auth with protected app routes
- Supabase-backed document CRUD with tags, slug URLs, search, filters, and activity logs
- Dashboard metrics from live Supabase data
- Gemini summary and Q&A actions that persist results to Supabase
- Loading and error states for App Router pages
- Validation schemas for documents and AI prompts
- Project roadmap in [portfolio-fullstack-roadmap.md](./portfolio-fullstack-roadmap.md)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Copy environment variables

```bash
copy .env.example .env.local
```

3. Fill in your values in `.env.local`

4. Start the dev server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GEMINI_API_KEY=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` follows the current Supabase docs for SSR setups.
- `NEXT_PUBLIC_SITE_URL` is used for auth redirect URLs after email confirmation.
- `GEMINI_API_KEY` is read server-side by the Gemini helper and API routes.

## Project structure

```txt
src/
  app/
    admin/
    api/ai/
    dashboard/
    documents/
    login/
    settings/
    signup/
  components/
  features/
    dashboard/
    documents/
  lib/
    ai/
    supabase/
    utils/
    validations/
  types/
```

## Current scaffold status

Implemented now:

- Production-oriented UI shell and route structure
- Supabase-backed dashboard and document views
- Supabase SSR helper setup and auth server actions
- Gemini utility, retry/fallback handling, and persisted AI actions
- Validation schemas
- SQL migrations with RLS and role-aware policies

Planned next:

- Add automated tests for auth and document actions
- Add richer admin role management
- Add semantic search with embeddings

## Main routes

- `/` overview and setup state
- `/dashboard` live metrics, quick actions, recent documents, and activity
- `/documents` searchable document list
- `/documents/new` create document form
- `/documents/[id]` detail page with AI summary and Q&A
- `/documents/[id]/edit` edit/delete document form
- `/login` sign-in
- `/signup` sign-up
- `/admin` admin overview
- `/settings` profile and API setup notes

## API routes

- `POST /api/ai/summarize`
- `POST /api/ai/ask`

Both routes currently expect JSON payloads and require `GEMINI_API_KEY`.

## Database schema

The initial schema is included in:

- [supabase/migrations/202604300001_initial_schema.sql](./supabase/migrations/202604300001_initial_schema.sql)
- [supabase/migrations/202604300002_fix_tag_rls.sql](./supabase/migrations/202604300002_fix_tag_rls.sql)

It creates:

- `profiles`
- `documents`
- `tags`
- `document_tags`
- `activity_logs`
- `ai_conversations`

with RLS policies and a trigger that creates `profiles` rows for new users.

## Deployment

Recommended:

- Vercel for app hosting
- Supabase for database, auth, and storage

Before deploying:

- Add all environment variables in Vercel
- Apply Supabase migrations in order
- Configure Supabase Auth redirect URLs
- Confirm Gemini free-tier limits are acceptable for your demo traffic

## Useful commands

```bash
npm run dev
npm run lint
npm run build
```

## References

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Supabase Next.js SSR guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
- [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/quickstart)
