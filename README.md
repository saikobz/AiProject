# Team Knowledge Hub

Full-stack portfolio project for a bilingual team knowledge base with Supabase auth, document CRUD, dashboard metrics, and Gemini-powered document summary/Q&A.

The app is designed to look and behave like an internal SaaS tool: protected workspace routes, live database-backed data, persistent AI results, responsive command-center UI, and Thai/English route-based localization.

## Why This Project Matters

This project demonstrates practical full-stack engineering, not only UI scaffolding. It combines authentication, database design, row-level security, server actions, API routes, validation, AI integration, responsive product UI, and deployment-ready configuration in one coherent business use case.

It is suitable for a portfolio because it shows how a real team might manage internal documentation, search knowledge, summarize long content, and ask AI questions from trusted document context.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Postgres, RLS, and SSR helpers
- Gemini API via `@google/genai`
- Zod validation
- Vercel-ready deployment model

## Implemented Features

- Route-based i18n with `/th` and `/en`
- Default `/` redirect to `/th`
- Thai and English UI for navigation, pages, forms, messages, empty states, loading states, and errors
- Supabase SSR authentication with protected workspace routes
- Document CRUD backed by Supabase
- Slug-based document URLs
- Tags, categories, search, and filters
- Activity logs for document and AI actions
- Dashboard metrics from live Supabase data
- Gemini AI summary persisted to `documents.summary`
- Gemini document Q&A persisted to `ai_conversations`
- Command-center responsive UI with mobile top-chip navigation and desktop sidebar
- Server-side validation for documents and AI prompts
- Loading/error pages for App Router routes

## Screenshots

Screenshots are not committed yet.

Suggested portfolio screenshots:

- Landing page in Thai and English
- Dashboard desktop view
- Documents list with search/filter
- Document detail with AI summary and Q&A
- Mobile login or mobile landing view

## Architecture Overview

```txt
src/
  app/
    [locale]/
      admin/
      dashboard/
      documents/
      login/
      settings/
      signup/
    api/ai/
    auth/
  components/
  features/
    dashboard/
    documents/
  lib/
    ai/
    i18n/
    supabase/
    utils/
    validations/
  types/
supabase/
  migrations/
```

Key architecture decisions:

- UI pages live under `src/app/[locale]` so `/th/...` and `/en/...` share the same implementation.
- API routes and auth callbacks stay outside `[locale]` because they do not render localized UI.
- Server Components read `params.locale` and load dictionary text from `src/lib/i18n`.
- Server Actions receive a hidden `locale` field so redirects return to the same language.
- User-generated document data is shown as stored and is not automatically translated.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/th` |
| `/th` / `/en` | Public landing page |
| `/th/login` / `/en/login` | Sign in |
| `/th/signup` / `/en/signup` | Sign up |
| `/th/dashboard` / `/en/dashboard` | Live metrics, quick actions, recent documents, activity |
| `/th/documents` / `/en/documents` | Searchable document list |
| `/th/documents/new` / `/en/documents/new` | Create document |
| `/th/documents/[id]` / `/en/documents/[id]` | Document detail with AI summary and Q&A |
| `/th/documents/[id]/edit` / `/en/documents/[id]/edit` | Edit/delete document |
| `/th/admin` / `/en/admin` | Admin overview placeholder |
| `/th/settings` / `/en/settings` | Environment and future settings notes |

## API Routes

- `POST /api/ai/summarize`
- `POST /api/ai/ask`

Both routes expect JSON payloads and require `GEMINI_API_KEY`.

AI functionality is also available through server actions on the document detail page. Those actions persist summary and Q&A results to Supabase so dashboard metrics and document history reflect real usage.

## Database Schema

Migrations are stored in:

- [supabase/migrations/202604300001_initial_schema.sql](./supabase/migrations/202604300001_initial_schema.sql)
- [supabase/migrations/202604300002_fix_tag_rls.sql](./supabase/migrations/202604300002_fix_tag_rls.sql)

Main tables:

- `profiles`
- `documents`
- `tags`
- `document_tags`
- `activity_logs`
- `ai_conversations`

The schema includes RLS policies and a trigger that creates a `profiles` row for new authenticated users.

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Copy environment variables

```bash
copy .env.example .env.local
```

3. Fill in `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GEMINI_API_KEY=
```

4. Apply Supabase migrations in order

```txt
202604300001_initial_schema.sql
202604300002_fix_tag_rls.sql
```

5. Start the development server

```bash
npm run dev
```

6. Open the app

```txt
http://localhost:3000
```

The root route redirects to `/th` by default.

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase publishable key |
| `NEXT_PUBLIC_SITE_URL` | Base URL used for auth callback redirects |
| `GEMINI_API_KEY` | Server-side Gemini API key |

## Deployment Checklist

Recommended hosting:

- Vercel for the Next.js app
- Supabase for database and auth

Before deploying:

- Add all environment variables to Vercel
- Apply Supabase migrations in order
- Configure Supabase Auth redirect URLs for local and production domains
- Set `NEXT_PUBLIC_SITE_URL` to the production URL
- Confirm Gemini free-tier limits are acceptable for demo traffic
- Run `npm run lint` and `npm run build`

## Production Readiness

Already included:

- Route protection through Supabase session checks
- RLS-backed database schema
- Server-side validation with Zod
- Locale-aware redirects for auth and server actions
- Persisted AI outputs to reduce repeated API usage
- Loading, error, empty, success, and failure states
- Responsive UI for mobile and desktop

Recommended next improvements:

- Add automated tests for validations and server actions
- Add GitHub Actions CI for `lint` and `build`
- Add real admin role management
- Add semantic search with embeddings
- Add document version history or favorites
- Add committed screenshots or a short demo GIF for portfolio presentation

## Portfolio Talking Points

- Built a realistic internal knowledge management app from database schema to UI.
- Used Supabase Auth, Postgres, RLS, and SSR helpers for a production-style auth/data layer.
- Implemented server actions for CRUD and AI workflows with locale-preserving redirects.
- Integrated Gemini for document summary and Q&A while persisting outputs for reuse.
- Designed a bilingual responsive command-center interface suitable for desktop and mobile.

## Project Roadmap

The original planning document is available at:

- [portfolio-fullstack-roadmap.md](./portfolio-fullstack-roadmap.md)

## References

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Supabase Next.js SSR guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
- [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/quickstart)
