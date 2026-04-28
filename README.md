# Next.js Starter

Next.js 16 + React 19 + Tailwind v4 + shadcn (radix-maia). Validated env, typed proxy, and the standard set of route conventions wired up.

## Stack

- **Next.js 16** App Router (`proxy.ts`, `forbidden.tsx`, `unauthorized.tsx`)
- **React 19**, **TypeScript** (strict)
- **Tailwind v4** with shadcn `radix-maia` style
- **`@t3-oss/env-nextjs`** + **Zod 4** for build-time env validation

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in values
pnpm dev
```

Open <http://localhost:3000>.

## Scripts

| Command            | What it does                              |
| ------------------ | ----------------------------------------- |
| `pnpm dev`         | Dev server                                |
| `pnpm build`       | Production build (validates env)          |
| `pnpm start`       | Run the production build                  |
| `pnpm lint`        | ESLint                                    |
| `pnpm typecheck`   | `tsc --noEmit`                            |

## Environment variables

Schemas live in [`src/env/`](./src/env), split by side:

- [`src/env/server.ts`](./src/env/server.ts) — server-only vars. t3-env throws at runtime if a client component reads it.
- [`src/env/client.ts`](./src/env/client.ts) — `NEXT_PUBLIC_*` vars, safe everywhere.

Both are imported in [`next.config.ts`](./next.config.ts) so the build fails on any malformed value. Set `SKIP_ENV_VALIDATION=1` to bypass (Docker, lint-only CI).

| Var                     | Side    | Required | Notes                                          |
| ----------------------- | ------- | -------- | ---------------------------------------------- |
| `NODE_ENV`              | server  | auto     | `development` / `test` / `production`          |
| `API_BASE_URL`          | server  | optional | Upstream API for server-side `fetch`           |
| `API_SECRET`            | server  | optional | Bearer token forwarded server-side             |
| `NEXT_PUBLIC_APP_URL`   | client  | optional | Defaults to `http://localhost:3000`            |
| `NEXT_PUBLIC_APP_NAME`  | client  | optional | Defaults to `Next Starter`                     |

Use it like:

```ts
// Server code (route handlers, Server Components, Server Actions)
import { env } from "@/env/server";

await fetch(`${env.API_BASE_URL}/users`, {
  headers: { Authorization: `Bearer ${env.API_SECRET}` },
});

// Client code or shared metadata
import { env } from "@/env/client";

console.log(env.NEXT_PUBLIC_APP_URL);
```

## Proxy (`src/proxy.ts`)

Replaces the legacy `middleware.ts` (Next.js 16 renamed it). It runs before the cache and:

- Generates an `x-request-id` and forwards it to the request headers + response
- Sets baseline security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
- Skips static assets via the matcher

Add auth gating, rewrites, or redirects there as needed. Note: `runtime` config is **not** allowed in `proxy.ts` — it always runs on Node.js.

## Route conventions wired up

| File                              | Purpose                                  |
| --------------------------------- | ---------------------------------------- |
| `src/app/loading.tsx`             | Root suspense fallback                   |
| `src/app/error.tsx`               | Client error boundary (`unstable_retry`) |
| `src/app/not-found.tsx`           | 404 page                                 |
| `src/app/forbidden.tsx`           | 403 page (calls `forbidden()`)           |
| `src/app/unauthorized.tsx`        | 401 page (calls `unauthorized()`)        |
| `src/app/robots.ts`               | `/robots.txt`                            |
| `src/app/sitemap.ts`              | `/sitemap.xml`                           |
| `src/app/api/health/route.ts`     | Liveness probe at `GET /api/health`      |

`forbidden.tsx` and `unauthorized.tsx` require `experimental.authInterrupts: true`, already enabled in [`next.config.ts`](./next.config.ts).

## Project layout

```
src/
├── app/                # App Router routes & file conventions
│   └── api/health/     # Liveness probe
├── components/ui/      # shadcn components (added via `pnpm dlx shadcn@latest add ...`)
├── lib/utils.ts        # cn() helper
├── env/
│   ├── server.ts       # Server-only env schema
│   └── client.ts       # NEXT_PUBLIC_* env schema
└── proxy.ts            # Next.js 16 proxy (formerly middleware)
```
