# Notes

- Next.js 16 frontend + PostgreSQL backend; no external API keys required.
- Run with `docker compose -f docker-compose.base44.yml up -d` (node:22, pnpm, `next dev` on port 3000).
- PostgreSQL 16 runs as a compose service (user/db/pass: onspace). DATABASE_URL is set in compose environment.
- pnpm 12 reads settings from `pnpm-workspace.yaml`, not the `pnpm` field in package.json. `allowBuilds: msw: true` approves msw's postinstall (run `pnpm approve-builds msw --yes` if lockfile changes).
- `next.config.mjs` sets `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` so the preview origin can load dev assets.
- Database auto-initializes on first API call via `lib/db.ts` `initDb()` — creates all tables (users, plans, subscriptions, sessions, follows, activity, privacy, permissions, audit_logs, profile_views) and seeds plans/testimonials/community.
- `pgcrypto` extension is enabled for `gen_random_uuid()`.
- First registered user becomes `superadmin` with Team plan and 50,000 credits.

## Auth System
- Session-based auth using httpOnly cookies (`onspace_session` token).
- Password hashing via Node `crypto.scryptSync`.
- API routes: `/api/auth/register` (POST), `/api/auth/login` (POST), `/api/auth/logout` (POST), `/api/auth/me` (GET), `/api/auth/check-username` (GET).
- `lib/auth.ts` — `getCurrentUser()`, session management, validation helpers, activity/audit logging.
- `lib/rbac.ts` — `hasPermission()`, `hasRole()`, permission grant/revoke. Roles: user, admin, superadmin.

## User & Profile System
- Profile page at `/u/[username]` — public profile with tabs (overview, projects, activity), follow/unfollow, stats.
- Settings page at `/settings` — tabs: account, profile, avatar/cover upload, privacy, billing.
- Admin dashboard at `/admin` — user management, plans, audit logs (admin/superadmin only).
- Login at `/login`, Register at `/register`.
- User menu dropdown in navbar (components/user-menu.tsx) — shows avatar, plan, credits, links to profile/settings/admin.
- AuthProvider wraps the app (components/auth-provider.tsx) — provides `useAuth()` hook.

## API Routes
- `/api/profile` (GET/PUT) — own profile data and update.
- `/api/privacy` (PUT) — update privacy settings per field.
- `/api/users` (GET) — public profile by username (respects privacy settings).
- `/api/users/follow` (POST) — follow/unfollow.
- `/api/plans` (GET) — list active plans.
- `/api/upload` (POST) — avatar/cover upload to `public/uploads/`.
- `/api/admin/users` (GET) — admin user list with search/filter.
- `/api/admin/users/[id]` (GET/PATCH/DELETE) — admin user detail and management.
- `/api/admin/plans` (GET/POST/PUT) — plan management.
- `/api/admin/audit` (GET) — audit log viewer.
- Existing: `/api/projects` (GET/POST), `/api/newsletter` (POST), `/api/testimonials` (GET), `/api/community` (GET).

## Data Libraries
- `lib/countries.ts` — all countries with Arabic names, sorted alphabetically, with dial codes.
- `lib/timezones.ts` — timezone list with Arabic labels.
- `lib/professions.ts` — user types/professions in Arabic.
- `lib/plans.ts` — plan definitions and seed data.

## Verify
- `curl -sf http://localhost:3000/api/auth/me` should return `{"user":null}` when not logged in.
- `curl -sf http://localhost:3000/api/plans` should return JSON array of 3 plans.
- Register a user, then `curl -sf http://localhost:3000/api/auth/me` with the session cookie should return the user object.
