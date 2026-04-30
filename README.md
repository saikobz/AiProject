# Team Knowledge Hub

Full-stack portfolio project scaffold for a document knowledge base with AI summary and Q&A.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Supabase SSR helpers
- Gemini API via `@google/genai`
- Zod for validation

## What is included

- Landing page tailored to the portfolio concept
- App routes for `dashboard`, `documents`, `login`, `signup`, `admin`, and `settings`
- Mock document data so the UI is useful before database wiring is complete
- Supabase client utilities for browser, server, and middleware usage
- Gemini route handlers for summary and document Q&A
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

- UI shell and route structure
- Mock dashboard and document views
- Supabase SSR helper setup and auth server actions
- Gemini utility and route handlers
- Validation schemas
- Initial SQL migration with RLS and role-aware policies

Planned next:

- Database schema and migrations
- Document CRUD with persistence
- Search and filters backed by Postgres
- AI output persistence
- Role-based access control

## Main routes

- `/` overview and setup state
- `/dashboard` metrics and recent activity preview
- `/documents` list page
- `/documents/new` create form scaffold
- `/documents/[id]` detail page
- `/documents/[id]/edit` edit form scaffold
- `/login` sign-in scaffold
- `/signup` sign-up scaffold
- `/admin` admin overview scaffold
- `/settings` profile and API setup notes

## API routes

- `POST /api/ai/summarize`
- `POST /api/ai/ask`

Both routes currently expect JSON payloads and require `GEMINI_API_KEY`.

## Database schema

The initial schema is included in:

- [supabase/migrations/202604300001_initial_schema.sql](./supabase/migrations/202604300001_initial_schema.sql)

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
- Replace mock data with real database queries
- Add auth protection and role checks

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
