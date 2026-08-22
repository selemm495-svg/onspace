# Notes

- Next.js 16 frontend only; no database or external API keys required.
- Run with `docker compose -f docker-compose.base44.yml up -d` (node:22, pnpm, `next dev` on port 3000).
- `pnpm install` exits non-zero on `ERR_PNPM_IGNORED_BUILDS` (msw postinstall); compose uses `--config.dangerouslyAllowAllBuilds=true`.
- `next.config.mjs` sets `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` so the preview origin can load dev assets.
- Verify: `curl -sf -H "Host: x.example.com" http://localhost:3000/`.
