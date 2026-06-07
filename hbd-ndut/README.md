# 🎂 Happy Birthday, Ndut!

A birthday wishes website for Ndut — friends can leave messages, memories, and photos that float as cute shapes on a birthday board.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with two menu cards |
| `/board` | Floating birthday wish cards (circle, cloud, heart ⭐, star, duck 🐥) |
| `/msg` | Form to submit a wish, memory, and photos |

---

## Setup (one-time, ~10 minutes)

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New project**, give it a name (e.g. `hbd-ndut`)
3. Wait for it to finish provisioning

### 2. Run the database schema

1. In your Supabase project, go to **SQL Editor**
2. Open the file `supabase-schema.sql` from this project
3. Paste the entire contents and click **Run**

This creates:
- A `wishes` table with RLS policies (public read + insert)
- A `wish-photos` storage bucket (public read + upload)

### 3. Get your Supabase credentials

In your Supabase project: **Settings → API**

Copy:
- **Project URL** → looks like `https://xxxxxxxxxxxx.supabase.co`
- **anon / public key** → long JWT string

### 4. Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. In **Environment Variables**, add:

```
NEXT_PUBLIC_SUPABASE_URL     = https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

4. Set the project name to `hbd-ndut` so the URL becomes `hbd-ndut.vercel.app`
5. Click **Deploy** — done! 🎉

---

## Local development

```bash
# 1. Copy the env template
cp .env.local.example .env.local

# 2. Fill in your Supabase credentials in .env.local

# 3. Install dependencies
npm install

# 4. Run locally
npm run dev
# → open http://localhost:3000
```

---

## How wishes are stored

Each wish is a row in the `wishes` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Auto-generated |
| `name` | text | Sender's name |
| `message` | text | Birthday wish |
| `memory` | text | Optional favorite memory |
| `photo_urls` | text[] | Array of Supabase Storage URLs |
| `shape` | text | circle / cloud / heart / star / duck |
| `color` | text | Pastel hex color |
| `pos_x` | float | X position on board (%) |
| `pos_y` | float | Y position on board (%) |
| `created_at` | timestamptz | Auto |

Photos are uploaded to the `wish-photos` Storage bucket before the wish row is saved.

---

## Tech stack

- **Next.js 14** (App Router) — framework
- **Supabase** — Postgres database + file storage
- **Vercel** — hosting
- **TypeScript** — type safety
- No UI library, no extra dependencies — pure CSS with Georgia + Helvetica typography

---

*Made with 💚 for Ndut*
