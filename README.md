# LinkedIn Clone – Simple Social Media Website

A full-stack internship assignment that recreates the core flows of LinkedIn: sign up, sign in, publish updates, and consume a unified professional feed. The frontend is a Vite + React + TypeScript app that talks directly to Supabase for authentication, database access, and asset storage, letting you demonstrate production-ready patterns across the stack.

---

## Features
- **Email-based onboarding** powered by Supabase Auth with session persistence, guarded routes, and zod-powered validation.
- **Public feed** that streams posts from every user, ordered by `created_at`, and displays author metadata pulled from the `profiles` table.
- **Rich composer** that lets authenticated users publish text posts, preview uploads, and push assets to the `post-images` storage bucket.
- **Profile surface + logout** badge in the navigation bar so users can always see (and manage) their authenticated state.
- **Responsive, accessible UI** built with Tailwind CSS, shadcn/ui primitives, Lucide icons, and Sonner toasts for feedback loops.

## Live Demo
Visit the production deployment at [linkspace-five.vercel.app](https://linkspace-five.vercel.app/).

## Tech Stack
| Layer | Tools |
|-------|-------|
| Frontend | Vite, React 18, TypeScript, React Router, TanStack Query |
| UI | Tailwind CSS, shadcn/ui, Lucide Icons, Sonner |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Tooling | ESLint (flat config), PostCSS, Tailwind CLI |

## Architecture Highlights
- **Supabase-first data layer:** `supabase/` contains SQL migrations that provision `profiles`, `posts`, RLS policies, and the public storage bucket used for post images.
- **Typed client:** `src/integrations/supabase/client.ts` exports a typed Supabase client (generated types live in `src/integrations/supabase/types.ts`) so queries stay type-safe.
- **Route-driven UX:** `src/App.tsx` wires landing (`/`), auth (`/auth`), and feed (`/feed`) routes via React Router with a catch-all `NotFound`.
- **Composable UI:** Shared primitives in `src/components/` (e.g., `CreatePost`, `PostCard`, `Navbar`) keep business logic isolated from page shells under `src/pages/`.

## Getting Started
### 1. Prerequisites
- Node.js 18+ and npm 10+
- Supabase project (cloud) or the Supabase CLI (`npm install -g supabase`) for local development

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file at the project root (do not commit secrets) and supply your Supabase credentials:

```bash
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon-key>"
VITE_SUPABASE_PROJECT_ID="<project-ref>" # optional, handy for CLI helpers
```

> The frontend only needs the anonymous (public) key. Keep the service role key server-side only.

### 4. Provision the database & storage
If you are linking to a **new** Supabase project, run the migrations found in `supabase/migrations/`:

```bash
supabase login                      # once per machine
supabase link --project-ref <ref>   # points the CLI at your project
supabase db push                    # applies tables, policies, storage bucket
```

The first migration creates `profiles`, `posts`, and a trigger that seeds a profile on every signup. The second migration provisions the public `post-images` bucket plus storage policies for uploads and deletes.

### 5. Run the app
```bash
npm run dev
```
Visit `http://localhost:5173`, create an account, and start posting.

## Available Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Starts Vite in development mode with HMR. |
| `npm run build` | Produces a production-ready bundle. |
| `npm run build:dev` | Builds using the `development` mode (useful for debugging bundle output). |
| `npm run preview` | Serves the production build locally (great sanity check before deploying). |
| `npm run lint` | Runs ESLint across the project using the flat config. |

## Database Schema
| Table/Bucket | Key Columns & Purpose |
|--------------|----------------------|
| `profiles` | `id` (PK, matches `auth.users.id`), `full_name`, `email`, `avatar_url`, `bio`, `created_at`. RLS lets anyone read and users manage their own record. |
| `posts` | `id`, `user_id` (FK → `auth.users.id`), `content`, `image_url`, `created_at`. RLS allows everyone to read; creators can insert/update/delete their own posts. |
| `storage.post-images` | Public bucket that stores optional post images. Policies allow authenticated uploads and deletions scoped to the author’s folder. |

## Project Structure
```
.
├─ public/                     # Static assets served by Vite
├─ src/
│  ├─ components/              # Shared UI blocks (Navbar, CreatePost, PostCard, etc.)
│  ├─ components/ui/           # shadcn/ui primitives
│  ├─ pages/                   # Route-level screens (Landing, Auth, Feed, NotFound)
│  ├─ integrations/supabase/   # Generated Supabase client + types
│  ├─ hooks/, lib/             # Reusable helpers (e.g., className utilities)
│  └─ main.tsx                 # React entry point
├─ supabase/                   # Migrations + CLI config
├─ package.json
└─ tailwind.config.ts
```

## Key User Flows
- **Authentication (`src/pages/Auth.tsx`):** Zod validates both forms, Supabase Auth handles signups/logins, and route guards redirect authenticated users straight to `/feed`.
- **Feed (`src/pages/Feed.tsx`):** After auth, the page fetches the user profile plus all posts (most recent first). Profile lookups hydrate each card with author names/avatars.
- **Create Post (`src/components/CreatePost.tsx`):** Handles text input, drag-free file selection, client-side previews, size checks, upload to Supabase Storage, and PostgREST inserts.
- **Navigation (`src/components/Navbar.tsx`):** Shows the signed-in user and exposes a dropdown logout that clears the Supabase session before redirecting.

## Assignment Coverage & Next Steps
| Requirement | Status |
|-------------|--------|
| User registration & login | ✅ Implemented with Supabase Auth + guarded routes |
| Create & view posts | ✅ Text + optional image posts, global feed sorted by newest |
| Show user identity in UI | ✅ Navbar avatar + dropdown, feed author chips |
| Bonus: image uploads | ✅ Stored in `post-images` bucket with previews |
| Bonus: likes/comments/profile editing | 🚧 Not implemented yet |

**Potential enhancements**
1. Add optimistic likes/comments using new tables with Supabase Row Level Security.
2. Allow users to edit/delete their own posts via `supabase.from("posts").update/delete`.
3. Introduce dedicated profile pages with editable bios, avatars, and post history.
4. Replace sequential profile fetches with a PostgREST `select` join (`posts (*, profiles (*))`) for fewer network trips.

## Troubleshooting
- **“Invalid login credentials”** – Ensure you verified the Supabase email (if confirmation emails are enabled) or disable confirmations in Auth Settings during local development.
- **CORS/URL errors** – Double-check `VITE_SUPABASE_URL` matches the project ref exactly (including `https://` and `.supabase.co`).
- **Storage policy failures** – Make sure the `post-images` bucket exists; re-run `supabase db push` if needed so the policy migration applies.

---

