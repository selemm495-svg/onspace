# Notes

- Next.js 16 frontend + PostgreSQL backend; no external API keys required.
- Run with `docker compose -f docker-compose.base44.yml up -d` (node:22, pnpm, `next dev` on port 3000).
- PostgreSQL 16 runs as a compose service (user/db/pass: onspace). DATABASE_URL is set in compose environment.
- pnpm 12 reads settings from `pnpm-workspace.yaml`, not the `pnpm` field in package.json. `allowBuilds: msw: true` approves msw's postinstall (run `pnpm approve-builds msw --yes` if lockfile changes).
- `next.config.mjs` sets `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` so the preview origin can load dev assets.
- Database auto-initializes on first API call via `lib/db.ts` `initDb()` — creates tables and seeds testimonials/community projects.
- API routes: `/api/projects` (GET/POST), `/api/newsletter` (POST), `/api/testimonials` (GET), `/api/community` (GET).
- Pages: `/` (home), `/agentic-app-builder`, `/ai-website-builder`, `/ios-app-builder`, `/pricing`, `/blog`, `/changelog`.
- Verify: `curl -sf http://localhost:3000/api/testimonials` should return JSON array.
