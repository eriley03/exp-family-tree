# eXp Family Tree

The first version of the eXp Family Tree website. It explains the community, collects interest from agents who may join eXp Realty, and gives members a directory, a calendar, and a resource library. Elizabeth Riley and Brian Copland can manage events, resources, and join-form leads once their accounts are marked admin.

Family Tree was co-founded by Elizabeth Riley (Austin, Texas). Brian Copland is building it with her. The idea: every eXp agent wins together, regardless of upline.

This app is meant to deploy on Vercel from GitHub. Supabase is the backend. It is not a Lovable project.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase Auth, Postgres, and Storage via `@supabase/ssr`
- Row-level security in `supabase/migrations`

The site builds and renders without real Supabase keys. Forms and member pages explain that nothing is saved until the project is connected.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). With the placeholder env values, you can click through every page. Sign-in, the join form, and admin saves start working after the steps below.

## 1. Create a Supabase project

Create a project at [supabase.com/dashboard](https://supabase.com/dashboard). In **Project Settings → Data API**, copy the project URL and the anon key (or the publishable key, if that is what the dashboard shows).

Put them in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-OR-PUBLISHABLE-KEY
```

Do not put the service-role key in this app or in `NEXT_PUBLIC_` variables.

## 2. Run the migration

In the Supabase **SQL Editor**, open `supabase/migrations/20261111215107_init_family_tree.sql`, paste the whole file, and run it.

Or, with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
npx supabase link --project-ref YOUR-PROJECT-REF
npx supabase db push
```

The migration creates:

| Object | Purpose |
| --- | --- |
| `profiles` | Member name, bio, location, directory visibility, and `role` (`member` or `admin`) |
| `profile_private` | Phone number, readable by that member and admins |
| `join_leads` | Interest form submissions |
| `events` | Calls, trainings, and gatherings |
| `resources` | Member library links and file records |
| Storage bucket `resources` | Private files, up to 20 MB |
| Storage bucket `avatars` | Public profile photos, up to 5 MB |

Row-level security is on for every table. Published events are public. The directory, resources, and drafts require a signed-in member. Leads, unpublished events, and library edits require an admin. A database trigger keeps members from promoting themselves.

Leave the `private` schema out of the Data API exposed schemas list.

## 3. Auth URLs

In Supabase, go to **Authentication → URL Configuration**.

- Site URL: `http://localhost:3000` while developing, then the production URL
- Redirect URLs:
  - `http://localhost:3000/**`
  - `https://YOUR-VERCEL-DOMAIN/**`

Email + password and magic links both work. New password signups use Supabase email confirmation when that setting is on (it is on by default). The link returns to `/auth/callback`.

## 4. Make a user an admin

There is no admin switch in the website, so a member cannot promote themselves.

1. Sign up on `/signup` with Elizabeth’s or Brian’s email and confirm the email if Supabase asks.
2. In the Supabase **SQL Editor**, run:

```sql
update public.profiles
set role = 'admin'
where email = 'person@example.com';
```

3. Sign out and sign back in, then open `/admin`.

Repeat for the other organizer. Admins can add events, upload resources, and read join requests. Promoting another admin is still this SQL statement.

## 5. Deploy on Vercel

Import the GitHub repository into Vercel. Framework preset: Next.js. Do not set an install or build override.

Add the same env vars in **Project Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (optional; the production origin, such as `https://familytree.example.com`)

Redeploy after saving them. Add that production URL to the Supabase redirect list from step 3.

`main` is the live branch. Change it through a pull request. See [CLAUDE.md](./CLAUDE.md) for how agents should branch and review.

## Scripts

```bash
npm run dev    # local site
npm run lint   # eslint
npm run build  # production build
```

## What still needs a human

- Real mission copy for how joining through Family Tree works, including anything an agent should know before changing brokerages. Do not add compensation numbers until that copy is approved.
- Photos of Elizabeth and Brian, and any agent stories they have permission to publish.
- A short bio for Brian, written by him.
- The first two admin promotions (SQL above).
- A custom domain, if you want one, after the Vercel project exists.
- Supabase Auth email templates, if the default wording is not what you want to send.
