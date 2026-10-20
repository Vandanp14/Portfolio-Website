# Specialist review — specimen rebuild

Date: 20 Oct 2026 · Reviewed at 1440, 1024, 768, 390, 360
Inputs: `docs/design-brief.md`, `docs/research/ai-bigtech-recon.md`,
`docs/craft-audit.md`, and the shipped pages.

Three lenses, each asked the same question: **does this read as one deliberate
product, or as a portfolio with a theme applied?**

---

## 1. Art direction and brand

**Verdict: pass.** The site has a single organising idea — a printed specimen
catalogue — and it survives every route. The bone paper, ink text and one cobalt
signal are used consistently; the runtime band gives the work a second ground
without inventing a dark theme.

What holds:
- The serif/sans/mono hierarchy is doing real work: claims, reading, metadata.
  It is not decorative typography swapped in for a template.
- Hairlines, square reading surfaces and the registration mark carry the
  "specimen" idea better than shadows or cards would.
- The specimen card is the only object on the home page. That restraint is why
  the page has a focal point.
- The footer closes the set: three columns of plain links, a colophon line, then
  the wordmark and the single permitted gradient. The gradient is an ending, not
  wallpaper.
- Empty space is used as pacing. After tightening, the bands hand off instead of
  leaving dead rooms.

What was corrected during review:
- The wordmark mark read as a checkbox at 14 px. Replaced with a registration
  frame crossed by hairlines.
- The typographic plate for screenshot-less work was a wall of beige with one
  line of text. It now carries a headline, the game list as a wrapped metadata
  line, and the metrics — evidence rather than a hole.
- The home page had two competing closes (contact and footer) with a 200 px gap.
  They now read as one runtime close.
- Contact intro repeated the email shown at display size 200 px below. It now
  offers LinkedIn/GitHub, so the page has one call to action.

Residual risk: the paper strip of the sticky nav over the runtime band is a hard
edge. It is intentional (the catalogue frame stays paper), but it is the one
place where a reviewer might ask for a band-aware nav. Changing it would cost the
consistent anchor, so it stays.

---

## 2. Front-end engineering

**Verdict: pass.** The system is simpler than the surface suggests: two bands,
one token set, shared primitives, route-level code splitting.

What holds:
- Every colour is read from a band-scoped variable. No component hardcodes a
  hex, which is why adding the runtime band did not require a second stylesheet.
- Grid placement is centralised after the `span` + `start` bug; the failure mode
  (a one-track column that silently right-aligns) is documented in the CSS.
- `Picture` serves WebP with a JPEG fallback and explicit dimensions; no layout
  shift from the screenshots.
- Blog and résumé routes are lazy; pdf.js and its worker never load on the home
  page. DOMPurify sanitises post HTML with a hook that hardens external links.
- Deep links compute the header offset in JS instead of trusting
  `scrollIntoView`; the measured landing is stable.
- The build is clean: `tsc --noEmit`, ESLint and `vite build` pass.

What was corrected:
- Position utilities, catalogue placement, dated lists, duplicate copy, and the
  blog post body's first-child margin.
- OG card palette and title were stale; the function now uses the runtime ground,
  chalk type, accent link and a registration mark, and the cache version was
  bumped to `v2` in both the function and the static head.

Residual risk: the résumé route is 551 kB because pdf.js is bundled whole. It is
lazy and only reachable from `/resume`, so the cost is paid by the one visitor who
needs it. Splitting further would add complexity for no measured win.

---

## 3. Accessibility and performance

**Verdict: pass with one manual-testing caveat.**

What holds:
- Contrast is measured, not assumed: every small-text pair clears 4.5:1; the two
  banned pairs are documented and unused.
- Focus is visible on every control, including the mobile menu trigger and the
  menu's close button.
- The mobile menu is a real dialog: `aria-modal`, focus moved in, Tab trapped,
  Escape closes, focus returned, background scroll locked.
- Reduced motion removes reveals and transitions; nothing is left invisible.
- Landmarks and headings are correct: skip link, one `main`, one `h1` per route.
- The type scale is fluid with `clamp()`; at 360 px the hero still holds three
  lines without overflow.

Residual risk: no VoiceOver/NVDA pass on hardware, and no iOS Safari run. The
accessible names and roles are present in the tree; the next step is a manual
screen-reader read of the home and work pages, plus a real-device check of the
sticky bands.

## Round 2 — live content pass

The site was then served through `vercel dev` with the real blog, résumé and OG
functions and audited with axe-core at 1440 and 390 px. Result: zero violations
on every route, including a real post. The pass also surfaced and fixed:

- date-only values rendering a day early in the Americas,
- an `<aside>` nested in `<main>` and a `<dl>` with invalid children,
- empty smart-chip anchors and `h1 → h3` heading jumps in converted Google Docs,
- long reference URLs overflowing a post at 390 px,
- OG titles displaying literal `+` signs,
- the blog’s document title and description drifting to the Apps Script index’s
  generic “My Daily Blog” copy,
- `vercel dev` returning 503 for route meta because `VERCEL_URL` has no scheme.

The loading skeleton was also replaced with ruled placeholder bars so a slow Apps
Script cold start no longer prints “Loading” three times.

---

## Recommended next (not blocking)

1. Manual screen-reader pass on `/` and `/work` (VoiceOver, Safari).
2. Real-device check at 390 px for the sticky nav/paper edge.
3. Regenerate the résumé PDF itself in the site’s typography; the site now
   presents it well, but the embedded one-page PDF is still the older layout.
4. Revisit whether the project screenshots can be served at two widths if the
   work page's LCP becomes a concern on slow connections.

None of these change the design decisions. The rebuild is complete against the
brief.
