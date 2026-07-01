@AGENTS.md

# roohaha — project guide

Personal portfolio site for Andrew V. Townsend. Next.js 16 App Router, deployed on Vercel Hobby. The stack is intentionally minimal.

## Key stack facts

| Thing | Detail |
|---|---|
| Next.js | 16.2.4 — **read `node_modules/next/dist/docs/` before writing any Next-specific code** |
| React | 19.2.4 |
| Auth | next-auth **5.0.0-beta.31** — pinned exact, do not widen to `^5` |
| Content storage | Vercel Edge Config (keys: `reading`, `playing`) |
| Logging | pino via `logger.ts` — use in `.ts` files; `no-console` is enforced there |
| Styling | Tailwind v4 + inline styles (no CSS modules, no styled-components) |
| Env validation | zod via `app/lib/validate-env.ts` |
| Pre-push hook | runs `npm run lint` — ESLint must pass before any push |

## Next.js 16 differences that will bite you

- **`proxy.ts` not `middleware.ts`** — Next 16 renamed the middleware file. The auth gate lives in `proxy.ts`.
- Caching directives may have moved. Check `node_modules/next/dist/docs/01-app/03-api-reference/` before using `revalidatePath`, `revalidateTag`, `unstable_cache`, or export constants like `revalidate`/`dynamic`.
- Server Action signatures, error shapes, and form wiring may differ from your training data.

## Architecture

### Content (reading/playing lists)

- **Prod**: Vercel Edge Config, read via `@vercel/edge-config`, cached with `unstable_cache` under tag `"content"`.
- **Local dev**: falls back to `content/reading.json` + `content/playing.json` when `EDGE_CONFIG` is unset.
- **Admin save**: PATCH to Vercel REST API → `revalidateTag("content", "max")` + `revalidatePath("/")`. Edge Config propagates globally within ~10 s.
- The `content/*.json` files are a seed/dev fallback only; they are not the live source of truth in production.

### Admin

- Route: `/admin` (protected), `/admin/signin` (GitHub OAuth landing).
- **Production + localhost only.** Preview deployments return 404 for `/admin` — a single GitHub OAuth App callback URL can't cover all preview URLs.
- Auth: GitHub OAuth, JWT sessions (no DB), allowlist via `ADMIN_EMAILS` env var.
- Defense-in-depth: middleware gate (`proxy.ts`) *and* `auth()` re-check inside the Server Action (`app/admin/actions.ts`).
- Edge Config payload is capped at ~6 KB in the Server Action before the PATCH is sent.
- **Known limitation — homepage shows stale data on first visit after save.** The homepage is a statically pre-rendered Full Route Cache entry on Vercel's CDN. `revalidatePath` uses ISR stale-while-revalidate semantics: the first request after an admin save still gets the old cached HTML while Next.js regenerates in the background. A second page load will show fresh data. Individual project pages are not affected (they are dynamic and always fetch live). Fixing this properly would require making `<ProjectsCard>` a dynamic hole via `<Suspense>`, which complicates the `<Nav>` visibility flag that also depends on projects data.

### Env vars

Pull locally with `vercel env pull .env.local`.

| Var | Purpose |
|---|---|
| `RESEND_API_KEY` | Contact form sends via Resend |
| `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` | Contact form addresses |
| `AUTH_SECRET` | Auth.js JWT signing (`openssl rand -base64 32`) |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth App credentials |
| `AUTH_TRUST_HOST=true` | Lets Auth.js derive host from `VERCEL_URL` — **do not set `AUTH_URL`** |
| `ADMIN_EMAILS` | Comma-separated allowlist, e.g. `andrewvtownsend@gmail.com` |
| `EDGE_CONFIG` | Connection string injected by Vercel when Edge Config is attached |
| `VERCEL_API_TOKEN` | Personal token for Edge Config writes — account-wide blast radius, rotate periodically |
| `VERCEL_TEAM_ID` | Only needed if project moves to a team account |

Home page works locally without any env vars (falls back to JSON files). Admin requires all auth vars.

## ESLint conventions (enforced as errors)

- `@typescript-eslint/no-explicit-any` — no `any`
- `@typescript-eslint/no-non-null-assertion` — no `!` assertions
- `@typescript-eslint/consistent-type-imports` — use inline `type` imports (`import { type Foo }`)
- `no-console` warning in `.ts` files — use `logger` from `logger.ts` instead
- `no-return-await` — don't `return await` (just `return`)
- `eqeqeq` — always `===`
- `object-shorthand` — `{ foo }` not `{ foo: foo }`
- `@typescript-eslint/no-floating-promises` — every Promise must be awaited or explicitly handled
