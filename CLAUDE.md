# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio website for Vandan Patel (live at [vandanpatel.me](https://vandanpatel.me)), built with Vite + React 18 + TypeScript + Tailwind CSS 3. Deployed on Vercel with continuous deployment from GitHub.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build (output: dist/)
npm run lint       # ESLint (flat config, eslint.config.js)
npm run preview    # Preview production build locally
```

There are no tests.

## Architecture

- **`src/App.tsx`** — tiny router switch (`src/lib/router.ts`, History API, no react-router): `/` renders the one-page portfolio (`Home`); `/blog` and `/blog/:id` lazy-load `src/pages/Blog.tsx` (code-split, with DOMPurify); anything else renders `NotFound`.
- **`src/content/portfolio.ts`** — all portfolio content (jobs, projects, profile, `RESUME_URL` = `/resume`, `navSections`). Edit content here, not in JSX. Section ids must match `navSections` for scroll-spy (`data-nav-section`).
- **`src/components/*`** — one component per section plus `Nav`, `Footer`, `primitives.tsx` (`Shell`, `SectionHeading`, buttons) and `Link.tsx` (client-side nav link). Section links use `goToSection()` so they work from blog pages (routes to `/#id`).
- **`src/index.css`** — band system: `.band-paper` / `.band-mist` / `.band-slate` each redeclare the same CSS variables (`--bg`, `--text`, `--accent`, …); components never hardcode colours. Also `.reveal` scroll reveals, blog `.post-body` prose, `.skeleton`, and preview animations (`.preview-word`, `.preview-in`). Fonts: Geist, Geist Mono, Instrument Serif (`.font-editorial`).

### External services (Google Apps Script)
- **Contact form** — `src/lib/contact.ts` POSTs to `VITE_CONTACT_ENDPOINT` (source in `apps-script/`).
- **Blog** — `src/lib/blog.ts` GETs a separate public Apps Script deployment (`VITE_BLOG_ENDPOINT`, hardcoded default): `?api=posts` → `{title, description, posts:[{id,title,date}]}`, `?api=post&id=` → `{post:{…, html}}`. Posts are written in Google Docs. The index has no excerpts, so the blog list fetches each post in the background to build previews (and caches them, so opening a post is instant). Post HTML is sanitized with DOMPurify before rendering.
- `vercel.json` rewrites `/blog/*` and `/resume` to `index.html` for deep links, and `/resume.pdf` to `/api/resume`.

- **Résumé** — `/resume` (`src/pages/Resume.tsx`, lazy, pdf.js legacy build) shows the newest PDF in a Drive folder. A third Apps Script deployment serves it as base64 chunks (`?action=latest`, `?action=chunk&version=&index=`). `api/resume.ts` is a Vercel Function that stitches the chunks into a real PDF (`RESUME_ENDPOINT`, hardcoded default): `?meta=1` (CDN 60s), `?v=VERSION` (immutable), bare / `/resume.pdf` (newest, CDN 60s); a superseded version answers 409. `vite.config.ts` mounts the same function under `npm run dev`. To update the résumé, upload a newer PDF to the Drive folder — no code change.
