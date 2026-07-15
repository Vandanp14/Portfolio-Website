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

The entire site lives in two files — there is no components/ directory despite what the README suggests:

- **`src/App.tsx`** (~700 lines) — the whole application. Structure, top to bottom:
  - Content data as module-level constants (`contactCards`, `coursework`, `experience`, etc.). To update portfolio content (jobs, skills, projects, contact info), edit these arrays — not the JSX.
  - Small helper components (`LinkedInHoverPreview`, `FanaticsHoverBadge`).
  - `App` component: scroll-spy nav (tracks active section on scroll), a custom animated cursor implemented with `requestAnimationFrame` + mouse event listeners, and one `<section>` per nav entry (`about`, `education`, `experience`, `skills`, `projects`). Section ids must match the `navigationSections` array for scroll-spy and nav links to work.

- **`src/index.css`** — Tailwind directives plus all custom styling: light "liquid glass" theme via CSS variables on `:root`, layered radial-gradient page background, ambient orbs, and the custom cursor classes (`.cursor-orb`, `.cursor-core`). Fonts: Manrope for body, Sora for headings (`.display-font`).

The resume is not stored in the repo — it's linked as a public Google Drive URL in `App.tsx` (the "View Resume" button), so it can be updated without redeploying.
