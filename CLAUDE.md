# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio website for Vandan Patel (live at [vandanpatel.me](https://vandanpatel.me)), built with Vite + React 18 + TypeScript + Tailwind CSS 3. Deployed on Vercel with continuous deployment from GitHub.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build (output: dist/) + postbuild copies index.html → 404.html
npm run lint       # ESLint (flat config, eslint.config.js)
npm run preview    # Preview production build locally
```

There are no tests.

## Shipping (read `docs/DEPLOYMENT.md`)

`main` is production: Vercel auto-deploys every push/merge to `main` to vandanpatel.me; other branches get preview deploys. **Always work on a new branch** (`feat/…`, `fix/…`, `docs/…`) off fresh `main`, pass lint + typecheck + build, push, open a PR into `main`, check the preview, and merge only when the user says so. Never commit to `main` directly and never `vercel --prod`.

## Architecture

- **`src/App.tsx`** — tiny router switch (`src/lib/router.ts`, History API, no react-router). `/` is `Home` (a short intro plus `PageRows`, a plain list linking every page); `/work`, `/experience`, `/about`, `/contact` are `SectionPage`s; `/work/:id` is `ProjectDetail` for one featured project (unknown id renders `NotFound`); `/blog`, `/blog/:id` and `/resume` lazy-load (`src/lib/prefetch.ts`, warmed on link hover/focus); anything else renders `NotFound`. Legacy `/#work`-style links are rewritten to `/work` before first render.
- **`src/lib/routes.ts`** — the page registry (`pages`: id, path, label, description) in index order. Server-side titles/descriptions for section pages live in `SECTION_PAGES` (`api/_lib/site.ts`), and per-project ones in `PROJECT_PAGES` in the same file. Keep `PROJECT_PAGES` in sync with `featuredProjects`, and `SECTION_PAGES` with `pages`.
- **`src/content/portfolio.ts`** — all portfolio content (profile, `featuredProjects`, `otherProjects`, experience, education, skills, recognition, leadership). Edit content here, not in JSX. The source of truth for facts is `~/Desktop/ATS_Resume_Tailor_Agent/master.json`; keep the two in sync. Site copy is plain first-person student voice: no marketing words, no em dashes in prose.
- **`src/components/*`** — one component per page plus `Nav`, `Footer`, `PageRows`, `ProjectDetail`, `NotFound`, `ErrorBoundary`, `ThemeToggle`, `primitives.tsx` (`Shell`, `Wide`, `PageTitle`, `SectionTitle`, `Meta`, `TextLink`, `Picture`, buttons) and `Link.tsx` (client-side nav link).
- **`src/index.css`** — one neutral token set (`--bg`, `--text`, `--text-2`, `--line`, `--surface`, `--signal`, `--content`, `--wide`, …) on `:root`, redeclared under `:root[data-theme='dark']`. Components use the tokens, never hardcoded colours. There are no colour bands, no scroll-reveal engine and no motion components; pages swap without transitions.

### External services (Google Apps Script)
- **Contact form** — `src/lib/contact.ts` POSTs to `VITE_CONTACT_ENDPOINT` (source in `apps-script/`).
- **Blog** — `src/lib/blog.ts` GETs a separate public Apps Script deployment (`VITE_BLOG_ENDPOINT`, hardcoded default): `?api=posts` → `{title, description, posts:[{id,title,date}]}`, `?api=post&id=` → `{post:{…, html}}`. Posts are written in Google Docs. The index has no excerpts, so the blog list fetches each post in the background to build previews (and caches them, so opening a post is instant). Post HTML is sanitized with DOMPurify before rendering.
- **Blog proxy** — the browser reads the blog through `api/blog.ts` (same query shape, CDN-cached 5 min + SWR), not Apps Script directly. `src/lib/blog.ts` adds a sessionStorage layer (10 min TTL).
- **Per-route HTML** — `vercel.json` rewrites `/work`, `/work/:id`, `/experience`, `/about`, `/contact`, `/blog`, `/blog/:id` and `/resume` to `api/page.ts`, which takes the deployment's `index.html` and injects route-specific title/description/canonical/OG/Twitter + JSON-LD (unknown post or project → 404 + noindex). `src/lib/seo.ts` (`usePageMeta`, `useJsonLd`) keeps the same tags right after client-side navigation.
- **OG images** — `api/og.ts` (`@vercel/og` 0.11.x; 1.x breaks in Node ESM) renders the 1200×630 card: bare = home, `?title=&date=&min=` = post. URLs carry `v=` and are cached immutable — bump `v` (in `api/_lib/site.ts` and the two `og:image` tags in `index.html`) when the design changes.
- **Feeds** — `/sitemap.xml` → `api/sitemap.ts`, `/rss.xml` → `api/rss.ts`; `/api/health` for uptime. Shared server helpers live in `api/_lib/` (underscore = not a function; imports use `.js` endings for Node ESM). `vite.config.ts` `devApi()` serves every `api/*.ts` under `npm run dev`.
- **Security headers + CSP** in `vercel.json`. No inline scripts allowed: theme init and GA4 live in `public/boot.js` (render-blocking). Adding a third-party origin means updating the CSP.
- **Uptime** — `.github/workflows/uptime.yml` checks key URLs every 15 min; a failed run emails the repo owner.
- **Theme** — light by default; `src/lib/theme.ts` + `ThemeToggle` (in the nav) set `<html data-theme>` and persist to localStorage. Dark overrides live under `:root[data-theme='dark']` in `index.css`.
- **Images** — `vite-imagetools` (9.x for Vite 5): import with `?w=…&format=avif;webp;jpg&as=picture` and render via `<Picture>` in `primitives.tsx`.
- **Perf** — `@vercel/speed-insights` injected in `main.tsx` (enable Speed Insights in the Vercel project).

- **Résumé** — `/resume` (`src/pages/Resume.tsx`, lazy, pdf.js legacy build) shows the newest PDF in a Drive folder. A third Apps Script deployment serves it as base64 chunks (`?action=latest`, `?action=chunk&version=&index=`). `api/resume.ts` is a Vercel Function that stitches the chunks into a real PDF (`RESUME_ENDPOINT`, hardcoded default): `?meta=1` (CDN 60s), `?v=VERSION` (immutable), bare / `/resume.pdf` (newest, CDN 60s); a superseded version answers 409. `vite.config.ts` mounts the same function under `npm run dev`. To update the résumé, upload a newer PDF to the Drive folder — no code change.
