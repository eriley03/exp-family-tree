# eXp Family Tree — agent guide

This file is the source of truth for coding agents working in this repository, including Claude Code and Cursor. [AGENTS.md](./AGENTS.md) points here.

## How to change this repo

`main` is protected. It is the live site on Vercel. Never commit to `main` and never push to `main`.

For every change:

1. Start from an up-to-date `main` and create a new branch. Name it `name/short-description`, for example `elizabeth/event-copy` or `brian/join-form-note`. One branch per change.
2. Keep the change small and focused. One purpose per pull request.
3. Run `npm run lint` and `npm run build` before opening the pull request. Both need to pass.
4. Open a pull request into `main` for review. Do not merge it yourself unless Elizabeth or Brian asked you to.
5. Never commit secrets. That includes `.env`, `.env.local`, service-role keys, and database passwords. `.env.example` is the only env file that belongs in git, and it stays filled with placeholders.

Supabase schema changes are new files in `supabase/migrations` only. Do not edit a migration that has already been applied. Create the next file with the Supabase CLI:

```bash
npx supabase migration new short_name
```

## Stack

- Next.js App Router, TypeScript, and Tailwind CSS
- Supabase Auth, Postgres, and Storage through `@supabase/ssr`
- Hosted on Vercel, deployed from GitHub when `main` changes
- Not Lovable

The app must build when the Supabase env vars are missing. Pages explain that data is not saved yet instead of crashing.

## Folder structure

- `app/` — routes, layouts, and server actions
- `components/` — shared UI
- `lib/` — Supabase clients, auth, validation, time helpers
- `supabase/migrations/` — SQL for tables, row-level security, and storage buckets
- `proxy.ts` — refreshes the Supabase session and sends signed-out visitors away from member pages
- `.env.example` — the env vars the app reads

## Key commands

```bash
npm install
npm run dev
npm run lint
npm run build
npx supabase migration new short_name
```

Local setup, applying migrations, Vercel env vars, and promoting an admin are in [README.md](./README.md).

## Auth and data rules

- Use `@supabase/ssr` with the `getAll` and `setAll` cookie methods. Do not use `@supabase/auth-helpers-nextjs`, and do not use the old `get` / `set` / `remove` cookie methods.
- Do not authorize anyone from `user_metadata` or `app_metadata` in the JWT. Admin is `profiles.role`, checked in Postgres.
- Do not add the Supabase service-role key to the Next.js app.
- Phone numbers live in `profile_private`, not on the directory row.
- Do not invent facts, statistics, testimonials, compensation numbers, or photos about eXp or Family Tree. Mark unfinished copy with the placeholder treatment already used on the site.
