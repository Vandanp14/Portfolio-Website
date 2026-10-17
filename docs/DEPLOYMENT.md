# Deployment — read before shipping anything

Instructions for agents (Claude Code, Codex, Cursor, …) and humans. The site
auto-deploys from GitHub; **`main` is production**.

## How it's wired

| Piece | Setting |
|---|---|
| GitHub repo | `Vandanp14/Portfolio-Website` |
| Vercel project | `portfolio-bolt` (team `vandans-projects-170548b9`), Git-connected |
| Production branch | `main` — every push/merge to `main` deploys **vandanpatel.me** within ~1 min |
| Other branches | each push gets a **preview** deploy (`portfolio-bolt-<hash>-….vercel.app`) |
| Primary domain | `vandanpatel.me` (apex). `www.vandanpatel.me` 308-redirects to it |
| Build | Vercel preset Vite, `npm run build` → `dist/` (postbuild writes `dist/404.html`) |
| Functions | `api/*.ts` (Node). `api/_lib/` = shared helpers, not deployed as functions |

## Default workflow (always)

1. **Start a new branch** off an up-to-date `main`. Never commit directly to `main`.
   ```bash
   git checkout main && git pull
   git checkout -b <type>/<short-name>     # e.g. feat/blog-tags, fix/nav-contrast, docs/deploy
   ```
2. Make the change. Before committing, all must pass:
   ```bash
   npm run lint
   npx tsc -p tsconfig.app.json --noEmit && npx tsc -p tsconfig.node.json --noEmit
   npm run build
   ```
3. Commit, push the branch, and open a PR into `main`:
   ```bash
   git push -u origin <branch>
   gh pr create --base main
   ```
   The push creates a preview deploy — check it (see below) and note results in the PR.
4. **Merge only when the user says so.** Merging = production deploy.
   ```bash
   gh pr merge <number> --merge
   ```
5. After merge, smoke-test production (below). Delete the branch when done.

Do **not** use `vercel --prod` / `vercel deploy --prod` — it bypasses Git and
review. Use the CLI only to inspect (`vercel ls`, `vercel inspect <url>`) or to
roll back (below).

## Checking a preview

Previews sit behind Vercel Authentication (a plain `curl` gets `302` to SSO).
Get a bypass token and send it as a header — never paste it into commits, PRs
or logs:

```bash
vercel curl / --deployment <preview-url> -- -sI      # generates a bypass token if needed
# or with the project's token:
curl -H "x-vercel-protection-bypass: $TOKEN" <preview-url>/api/health
```

In a browser: open `<preview-url>/?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=$TOKEN` once.
Expected preview-only console noise: CSP blocks `vercel.live` (toolbar) and the
manifest redirect through SSO. Neither happens in production.

## Production smoke test

```bash
B=https://vandanpatel.me
for p in / /blog /resume /nope /sitemap.xml /rss.xml /api/health "/api/blog?api=posts" "/api/resume?meta=1" "/api/og?v=1"; do
  curl -s -o /dev/null -w "%{http_code}  $p\n" "$B$p"
done
```
Expect `200` everywhere except `/nope` → `404`. Also confirm the
`content-security-policy` header is present (`curl -sI $B/`) and, for contact
changes, `npm run check:contact` (never sends a real message).

The **uptime workflow** (`.github/workflows/uptime.yml`) runs the same kind of
checks every 15 min; run it on demand with `gh workflow run uptime.yml`.

## Rolling back

Fastest: promote the previous good production deployment.
```bash
vercel ls                       # find the last good Production deployment URL
vercel promote <deployment-url>
```
Then fix forward with a revert PR (`git revert <merge-sha>` on a new branch) so
`main` matches what's live.

## Rules that are easy to break

- **Domain is apex.** Canonicals, sitemap, OG URLs and the uptime check all use
  `https://vandanpatel.me`. Don't flip the Vercel domain redirect without also
  changing `ORIGIN` in `api/_lib/site.ts`, `SITE_ORIGIN` in `src/lib/seo.ts`
  and the URLs in `index.html`.
- **CSP** lives in `vercel.json`. A new third-party script/API/font origin
  must be added there, or it's silently blocked in production. No inline
  scripts — put them in `public/boot.js` or a module.
- **Server code never trusts `Host` / `X-Forwarded-Host`** to build fetch
  URLs (see `shellOrigin()` in `api/page.ts`).
- **OG image cache is immutable.** Changing the card design means bumping
  `v=` in `ogImageUrl()` (`api/_lib/site.ts`) and in `index.html`.
- **`design/classic`** is a frozen alternate design: never merge `main` into it;
  cherry-pick shared fixes only. It does not deploy.
- Secrets/env vars: manage with `vercel env` (never commit `.env*`). The Apps
  Script endpoints have hardcoded public defaults; env vars override them.
