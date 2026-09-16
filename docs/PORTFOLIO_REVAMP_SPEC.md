# Portfolio Revamp Specification — Vandan Patel

**Purpose:** a complete, deterministic design and implementation brief for rebuilding the portfolio as a calm, premium editorial experience. This document is intentionally explicit: a weaker implementation model should be able to follow it in order without making visual decisions of its own.

**Product:** personal portfolio for a systems/backend-oriented software engineer and computer-science student.

**Primary outcome:** within one minute, a recruiter or hiring manager understands who Vandan is, what he is good at, where he has contributed, and why his work is credible. Within three minutes, they can inspect proof in the selected projects and find a direct way to contact him.

**Mode:** Editorial Premium. This is a portfolio, not a dashboard, developer documentation site, résumé PDF, or generic SaaS landing page.

## 1. Non-negotiable design decision

Use a **warm editorial paper system with a single oxblood accent**. The current design already points in this direction through the Fraunces/Manrope pairing and the red collectible card. Commit to it consistently; remove every competing visual language.

The visual metaphor is **a well-edited field journal with a single collectible object**, not “a website with effects.” It should feel measured, human, technically credible, and specific to someone entering the engineering profession.

### Brand personality

- **Precise:** hierarchy is unambiguous; labels, dates, and technologies are easy to scan.
- **Grounded:** use real outcomes, companies, course work, and project evidence; no inflated claims.
- **Curious:** hobbies and interests give the person dimension without becoming decoration.
- **Collectible:** one trading-card-inspired object is a personal signature, used only in the hero and optional project previews.
- **Quietly ambitious:** Fanatics Collectibles and systems work are visible proof points, not loud marketing claims.

### Explicitly do not do

- Do not use dark mode, blue/purple gradients, neon, global glassmorphism, floating blobs, or AI imagery.
- Do not make every section a rounded card or every heading include an icon.
- Do not use rainbow category colors. Oxblood is the only brand accent.
- Do not show a custom cursor, animated ambient blooms, moving grids, or an animated background. They distract from reading and make the palette feel inconsistent.
- Do not turn the experience section into an expandable accordion, the projects section into a dense card grid, or hobbies into a large “fun facts” panel.
- Do not include skill proficiency bars, logos used only as decoration, generic claims such as “passionate about innovation,” or filler paragraphs.
- Do not use a carousel that advances itself. Horizontal movement must stay under user control.

## 2. Audience and jobs to be done

| Visitor | First question | Design response |
| --- | --- | --- |
| Hiring manager | “Is this person relevant and credible?” | Hero states focus; proof strip and selected work surface outcomes immediately. |
| Technical interviewer | “What has this person actually built?” | Project cards give role, problem, implementation, metric, stack, and links/screenshots. |
| Recruiter | “Where is he now and how do I contact him?” | Current/incoming role, concise timeline, resume CTA, and contact remain easy to reach. |
| Peer or collaborator | “What else is he interested in?” | A small personal section makes interests visible after professional proof. |

### Narrative order

1. **Introduce the person** — name, specialty, present direction, two clear actions.
2. **Establish credibility** — a concise proof strip and selected project work.
3. **Show trajectory** — experience and education in a clean chronological system.
4. **Show range** — tools, technical strengths, hobbies/interests.
5. **Make contact frictionless** — direct email, resume, LinkedIn, GitHub.

Projects move ahead of the full experience timeline because proof of work is the most persuasive content for this audience. Experience still receives a significant, calm timeline later on.

## 3. Information architecture

Use one page with anchor navigation. Replace the current six-item nav with:

`Work` · `Experience` · `About` · `Resume ↗`

The wordmark/name at left returns to the top. On desktop, the navigation is fixed and has a solid warm-paper background with a bottom divider—not frosted glass. On mobile, use a normal menu button and a full-width, solid menu surface.

| Order | Section | Anchor | Purpose |
| --- | --- | --- | --- |
| 0 | Header | — | Orientation and persistent résumé access. |
| 1 | Hero | `#top` | Identity, focus, current direction, primary CTAs, personal card. |
| 2 | Proof strip | `#proof` | Fast evidence: role, education, project impact, location/availability. |
| 3 | Selected work carousel | `#work` | The visual center of the portfolio and home for project screenshots. |
| 4 | Experience timeline | `#experience` | Professional trajectory and quantified contributions. |
| 5 | Education + strengths | `#about` | Coursework, focus areas, technical toolkit—compact and readable. |
| 6 | Beyond the terminal | `#interests` | Hobbies/interests with a short statement of their connection to the person. |
| 7 | Closing contact | `#contact` | Email, links, resume, footer. |

## 4. Content inventory and editorial rules

Keep the factual content currently in `src/App.tsx`, but edit it into page-first content rather than copying résumé bullets verbatim.

### Hero copy (use exactly until updated)

**Eyebrow:** `Software engineer · systems & backend`

**Headline:** `I build reliable systems with a product-minded edge.`

**Supporting copy:** `Vandan Patel is a computer science student at SUNY Oswego focused on systems programming, backend engineering, and thoughtful interfaces that stay fast under pressure.`

**Status line:** `Joining Fanatics Collectibles · New York City · Summer 2026`

**Primary CTA:** `View selected work` → `#work`

**Secondary CTA:** `Download résumé` → existing public résumé URL; opens a new tab.

Do not use “Explore work.” The CTA label should tell visitors exactly what happens.

### Proof strip

Place directly below the hero. It is a single divider-bounded row on desktop and a 2 × 2 grid on mobile. No cards.

| Label | Value |
| --- | --- |
| Next role | Fanatics Collectibles · Summer 2026 |
| Current study | B.S. Computer Science · SUNY Oswego |
| Measurable impact | 40% faster institutional reporting |
| Based in | Oswego, NY · open to opportunities |

### Project content model

Every project must use this shape. Do not render a project without the minimum fields.

```ts
type Project = {
  id: string;
  number: string;                 // “01”, “02”, etc.
  title: string;
  oneLine: string;                // 10–18 words, outcome first
  category: 'Systems' | 'Full stack' | 'Automation' | 'Algorithms';
  year?: string;
  stack: string[];                // maximum 4 visible tags
  cover: { src: string; alt: string } | null;
  problem: string;                // 1–2 sentences
  contribution: string[];         // exactly 2–3 concise bullets
  result: string | null;          // only if factual and defensible
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
};
```

Feature the following in this order:

1. **High-Performance Multi-Threaded HTTP Server** — systems — `Concurrent HTTP serving with custom thread-pool request handling.`
2. **Full-Stack Transit Analytics Tracker** — full stack — `Live transit data with a cached backend serving 7,000+ users.`
3. **TA Grading & Testing Automation** — automation — `A grading workflow reduced from three hours to fifteen minutes.`
4. **Event RSVP Management Platform** — full stack — `Cloud-synced RSVP validation for 500+ concurrent entries.`

Place the remaining three (Turing Machine Simulator, Logic Inference Engine, Light-Up Puzzle Solver) in a compact “More experiments” list below the carousel. Each list item has title, one-line description, and stack; it does not need a screenshot.

### Screenshot briefing

The user will add project screenshots later. Build the exact empty state now so screenshot insertion does not redesign the page.

- Store images as `src/assets/projects/<project-id>/cover.webp` (or `.png` only where transparency matters).
- Maintain a 16:10 aspect ratio for all project covers; crop through `object-fit: cover` rather than changing component geometry.
- Prefer screenshots that show the project doing its primary job: working UI, meaningful data, terminal/session output, or a clear system diagram. Avoid code-editor-only screenshots.
- Give every image a factual alt text, such as `Transit Analytics Tracker dashboard showing live route performance and arrival data`.
- If no cover exists, render an **intentional neutral placeholder**: warm-grey surface, project number, category label, and a small stack line. Never use an empty broken image frame or stock imagery.
- Do not add text overlays on screenshots. Keep the caption below so the image stays inspectable.
- Optimize covers to WebP/AVIF, target under 250 KB each, and load only the active/adjacent slides eagerly. Other slides use `loading="lazy"`.

### Experience editorial format

Keep reverse chronology. Turn each entry into: role/company title, period/location metadata, and a maximum of two achievements. Retain quantified results. For the upcoming Fanatics role, write only factual context; do not invent responsibilities.

### Hobbies and interests (required new content)

Use a short three-item editorial row, not a list of skills or colorful cards. The exact content needs confirmation from Vandan before publishing. Build the component with the following placeholders:

| Index | Label | Prompt for final content |
| --- | --- | --- |
| 01 | Collecting & culture | What do you collect, watch, follow, or study outside work? |
| 02 | Making & learning | What do you make or learn for enjoyment? |
| 03 | Outside the screen | What sport, place, community, or routine matters to you? |

Each entry gets a 1–2 sentence answer. The only acceptable purpose is to make the person more memorable; do not force a professional lesson out of every hobby.

## 5. Visual system: exact tokens

Implement these values in `src/index.css` as CSS custom properties. Use them everywhere. Do not introduce arbitrary colors in JSX except image content.

```css
:root {
  color-scheme: light;
  --canvas: #F6F3EE;
  --surface: #FFFCF7;
  --surface-raised: #FFFFFF;
  --surface-muted: #EEEAE2;
  --ink: #1D1B19;
  --ink-soft: #5F5A53;
  --ink-faint: #8B847A;
  --line: rgba(29, 27, 25, 0.14);
  --line-strong: rgba(29, 27, 25, 0.24);
  --accent: #9B1C31;
  --accent-hover: #7E1528;
  --accent-soft: #F3E1E4;
  --focus: #9B1C31;
  --shadow-soft: 0 1px 2px rgba(29, 27, 25, 0.04), 0 14px 34px rgba(29, 27, 25, 0.08);
  --shadow-card: 0 1px 1px rgba(29, 27, 25, 0.05), 0 8px 24px rgba(29, 27, 25, 0.07);

  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Manrope', 'Segoe UI', system-ui, sans-serif;
  --font-mono: ui-monospace, 'SFMono-Regular', Consolas, monospace;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  --content: 1200px;
  --gutter: clamp(20px, 4vw, 48px);
  --section-space: clamp(88px, 12vw, 160px);

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-micro: 140ms;
  --duration-ui: 200ms;
  --duration-reveal: 560ms;
}
```

### Token usage rules

- The page canvas is `--canvas`; sections do not alternate colors simply for variety.
- Use `--surface` only for project slides, the collectible card, and the mobile navigation panel. Use dividers before introducing a container.
- Oxblood means action, current status, key index, or keyboard/focus state. It does not color whole sections, large headings, or body copy.
- Text contrast: body copy always uses `--ink-soft` or darker; no faint text below 16px except all-caps metadata labels at 12px with high enough contrast.
- Do not create a dark theme in this revamp. A polished single-mode portfolio is better than an unmaintained dual theme.

### Typography rules

| Role | Typeface | Desktop | Mobile | Rules |
| --- | --- | --- | --- | --- |
| Hero headline | Fraunces | clamp(56px, 8vw, 104px) | 52–64px | line-height .91; tracking -.045em; maximum 3 lines |
| Section title | Fraunces | 48–60px | 38–44px | line-height .98; tracking -.035em |
| Project title | Fraunces | 32–40px | 28–32px | line-height 1.0 |
| Body | Manrope | 16–18px | 16px | line-height 1.65; max 66 characters per line |
| Metadata | mono | 11–12px | 11px | uppercase; tracking .12em; use sparingly |
| Button/nav | Manrope | 14px | 14px | medium/600 weight; normal case |

Never use display type for metadata or dense technical tags. Never use Manrope at a weight below 450 for small text.

## 6. Layout and component specification

### Global frame

- Max content width: `var(--content)` / 1200px.
- Horizontal padding: `var(--gutter)`.
- Sections have `padding-block: var(--section-space)` unless the detailed component specifies otherwise.
- Use a 12-column desktop grid with 24px gaps. On tablet, use 8 columns; on mobile, a one-column layout.
- Keep section headers left-aligned. Only the hero can use a split layout.

### Header

- Height: 72px desktop, 64px mobile.
- Position: fixed; solid `rgba(246, 243, 238, 0.96)` with `backdrop-filter` only if it remains visually indistinguishable from solid paper. A 1px bottom line appears after the page scrolls 8px.
- Desktop: name at left; nav centered/right; `Resume ↗` is a text link, not a filled button.
- Active nav item: oxblood text and 2px underline offset 7px. Do not use dots or pills.
- Mobile: name plus 44 × 44px menu button. Opening the menu places a solid panel below the header, traps focus, closes with Escape, and returns focus to the menu trigger.

### Hero

- Desktop grid: 7 columns copy / 5 columns art. Vertically center within a minimum 760px viewport area.
- Copy order: eyebrow → headline → supporting text → status line → CTA row.
- The collectible card sits to the right and should feel like a physical editorial artifact. It may retain a **very subtle** pointer tilt on fine pointers, maximum 4 degrees, but it must have no rainbow foil, color-dodge blend effects, or auto-moving shine.
- On mobile: copy first, card after CTA; card width 238–268px; do not force it above the name.
- Add a small text-only visual cue beneath the card: `Scroll to see the work` on desktop only.

### Section heading component

Use the same component for Work, Experience, About, and Interests:

```text
01 / Selected work
Work with real constraints.
Short optional sentence, maximum 110 characters.
```

- Kicker: mono, 11px, oxblood.
- Title: display type.
- Optional descriptor: 16px soft ink; omit if it repeats the title.
- Do not use icons or decorative horizontal rules directly under the title.

### Selected work: horizontal carousel (required)

This carousel is not a content dump. It is a deliberate way to give each featured project enough visual room.

**Desktop structure**

```text
[section title                        ] [01 / 04] [←] [→]

| card 01: image / media | title, one-line, tags, outcome, links |
```

- One project slide occupies the full content width; it has an internal 7/5 media/content split at 1024px and above.
- Slide surface: `--surface`, `--radius-xl`, 1px `--line`, `--shadow-card`.
- Media panel: 16:10, clipped to the card’s left-side radii; image stays completely visible and has no text overlay.
- Content panel: 40–48px padding desktop; 28px mobile.
- Project number and category are metadata at top.
- One-line project statement follows title, then a short “What I built” bullet list (max 3), then stack chips (max 4), then outcome and links.
- Links: `Case study` only when a written case study exists; `Live site ↗` and/or `Source ↗` when real URLs exist. Do not render dead links.
- Arrow buttons: real `button` elements, 44 × 44px, outlined, with an accessible label (`Previous project`, `Next project`). Disable appropriately at bounds if non-looping.
- Counter updates accessibly using an `aria-live="polite"` element such as `Project 2 of 4`.

**Interaction behavior**

- Build with CSS `scroll-snap-type: x mandatory`, `overflow-x: auto`, and `scroll-snap-align: start`. Do not use a heavy carousel package unless the existing project already has one.
- Buttons call `scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'start' })` for the next/previous slide.
- Support keyboard left/right arrows only when focus is within the carousel; do not hijack page-level arrow keys.
- Touch/trackpad scrolling is the primary gesture. Use `scrollbar-width: none` only if buttons/counter make discoverability clear; otherwise retain a subtle scrollbar.
- Do not autoplay, loop, show pagination dots, use drag physics, or animate slide content separately from the slide movement.
- On mobile, the slide width is `calc(100vw - 40px)` so a 16–24px edge of the next slide remains visible. This signals horizontal scroll without instructions.
- On desktop, slides may be 88–92% of the viewport inside the track, leaving a restrained next-card preview; never show three tiny cards.

### More experiments list

- Three rows beneath the carousel, separated by 1px lines.
- Layout: index / title and summary / stack. On mobile, stack moves under summary.
- Rows are links only if a real project destination exists. Otherwise use plain article rows.

### Experience timeline

- Do not place each job inside a card.
- Use a continuous vertical left rule on desktop with an oxblood current-role marker. Content is a two-column grid: date/location (3 columns) and role/company/achievement (9 columns).
- Each entry is separated by a light horizontal line and has 56–72px vertical padding.
- Company is the primary supporting line; role is the display title. Make the current or incoming role visibly marked as `Next` but not overemphasized.
- Achievements use two concise lines with a small square/line bullet in `--accent`; no large circular bullets.
- On mobile, move dates above role and use only one left rule. Ensure the text never wraps around the marker.

### Education and technical strengths

Place these in one asymmetric two-column section rather than two equal cards.

- Left (5 columns): degree, school, location, expected date, and six-course list with dividers.
- Right (7 columns): title `Technical working set`; four named groups as compact rows: Systems Programming, Algorithms & Data, Tools & Environment, Languages.
- Each row shows the group name at left and neutral tags at right. Tags use `--surface-muted`, `--radius-sm`, 12–13px; they are not buttons.
- Focus areas become a single sentence below the degree: `Current focus: concurrency, multithreading, server architectures, and algorithm optimization.`

### Interests

- Use a single full-width, lightly tinted `--surface-muted` band with no border and generous but not oversized padding.
- Header copy: `Beyond the terminal` / `The things that keep the work interesting.`
- Three interest rows are divided, with number, label, and final 1–2 sentence copy. On desktop, let the copy take the largest column.
- No image needed initially. If images are added later, use exactly one candid, high-quality personal image as an optional background crop—not three stock-like hobby images.

### Contact and footer

- The final section has ample top/bottom space. Feature the email address as a large underlined display link.
- Secondary links: LinkedIn, GitHub (add when available), phone (only if public contact is intended), location, résumé.
- CTA copy above email: `Have a system, product, or problem worth talking through?`
- Footer is one divider with copyright at left and `Designed and built by Vandan Patel` at right. Do not include “Built with React” as the primary sign-off.

## 7. Component/state contracts

Create these components; keep data in a dedicated content file rather than a huge `App.tsx`.

```text
src/
  content/portfolio.ts       # all project, experience, education, link, and interest data
  components/
    SiteHeader.tsx
    SectionIntro.tsx
    HeroCard.tsx
    ProofStrip.tsx
    ProjectCarousel.tsx
    ProjectSlide.tsx
    ExperienceTimeline.tsx
    TechnicalWorkingSet.tsx
    Interests.tsx
    SiteFooter.tsx
  assets/projects/           # screenshots added later
  App.tsx                    # page composition only
  index.css                  # tokens, base styles, small component-specific CSS
```

For every interactive element, implement these states:

| Element | Default | Hover | Pressed | Focus-visible | Disabled/empty |
| --- | --- | --- | --- | --- | --- |
| Filled CTA | oxblood fill, white text | darker fill, translateY(-1px) | scale(.985) | 2px oxblood ring + 3px offset | n/a |
| Text link | ink | oxblood; underline extends | no positional jump | same ring | do not render without URL |
| Carousel arrow | paper surface + line | surface-muted | scale(.985) | same ring | 40% opacity; no pointer action |
| Project slide | surface + line | no lift required | n/a | focus ring if linkable | placeholder media if cover missing |
| Mobile menu | icon | surface-muted | scale(.985) | same ring | n/a |

## 8. Motion and performance

The site should feel responsive, not animated. Use motion only to confirm navigation or reveal hierarchy.

- **Load:** hero eyebrow, headline, paragraph, status/CTA, and card may fade/translate upward once in DOM order. Use 560ms `--ease-out`, 70ms stagger, maximum 5 items. The headline must remain readable even before JavaScript loads.
- **Scroll reveals:** optional for section intro and content group only, never every tag, bullet, or individual word. One-time opacity + 16px translateY using the same duration/easing.
- **Controls:** hover/press use `--duration-micro` or `--duration-ui`; animate only opacity, color, and transform.
- **Hero card:** optional pointer tilt only on `(hover: hover) and (pointer: fine)` and when reduced motion is not requested. Use `requestAnimationFrame`, refs, and CSS variables—never React state per pointer move.
- **Carousel:** native scroll; no animated `left`, `width`, or layout properties.
- **Reduced motion:** when `prefers-reduced-motion: reduce`, disable smooth scrolling, reveal transitions, pointer tilt, and all ambient movement. Render the fully visible end state.
- Remove the current custom cursor, drift keyframes, bloom layers, grid layers, and rainbow foil treatment.

## 9. Responsive behavior

| Viewport | Required behavior |
| --- | --- |
| 1440px+ | 1200px content max; hero split 7/5; full project media/content split; visible carousel controls. |
| 1024–1439px | Preserve desktop structure with 32px gutters; project slide split can become 6/6. |
| 768–1023px | Header nav may remain desktop if it fits; hero card becomes smaller; project media stays above content if split becomes cramped. |
| 480–767px | Mobile menu; hero copy first; proof strip 2 × 2; project cards use media-over-content; experience date above content. |
| Under 480px | 20px gutters; no text below 16px except metadata; carousel retains next-card edge; CTA buttons can stack only when necessary. |

Test at 375px, 768px, 1024px, and 1440px. There must be no horizontal page overflow outside the carousel track.

## 10. Accessibility requirements

- Use semantic landmarks: one `header`, one `nav`, one `main`, meaningful `section` elements with `aria-labelledby`, and one `footer`.
- Keep heading order: one `h1`, then section `h2`, then project/job `h3`.
- All controls work with keyboard. The carousel buttons are visible, keyboard focus is not clipped, and carousel arrow keys work only while the carousel is focused.
- Every icon-only button needs `aria-label`; decorative icons use `aria-hidden="true"`.
- Maintain a 44 × 44px target for navigation controls and carousel arrows.
- Preserve visible focus indicators. Never use `outline: none` without an equal or stronger replacement.
- Make external links clear in accessible names; use `rel="noopener noreferrer"` on `target="_blank"` links.
- Do not put important copy in images. All screenshot content is supplementary, not the sole explanation of a project.
- Verify text/background contrast meets WCAG AA, including muted metadata and hover states.

## 11. Implementation plan for a weaker model

Do the phases in order. Do not redesign while coding; all visual choices are already decided above.

### Phase A — preserve and prepare (small)

1. Inspect `package.json`, `src/App.tsx`, `src/index.css`, and the existing image assets before changing code.
2. Keep React 18, TypeScript, Vite 5, Tailwind 3, and Lucide React as currently installed. Do not add a carousel library, animation library, or design-system dependency.
3. Create `src/content/portfolio.ts` and move the existing factual data into typed arrays.
4. Create the component files listed in Section 7. Leave external URLs absent until real URLs are supplied; do not invent GitHub/live links.

### Phase B — system and shell (medium)

1. Replace the current `:root` variables with the exact Section 5 tokens.
2. Remove CSS and JSX for the custom cursor, scene/bloom/grid/grain background, and rainbow foil hero-card layers.
3. Retain Fraunces and Manrope if they are already loaded; verify they load in `index.html`. If unavailable, use the documented fallbacks rather than silently changing the font system.
4. Build `SiteHeader`, page max-width wrapper, anchors, responsive menu, and the new hero.
5. Build the proof strip before the project section.

### Phase C — content hierarchy (large)

1. Build `ProjectCarousel` with CSS scroll snap and arrow buttons. Start with the four featured project records and intentional screenshot placeholders.
2. Build the three-row More Experiments list.
3. Build the timeline, education/working-set grid, interests placeholder section, and closing contact/footer.
4. Ensure `App.tsx` is only responsible for page composition and small page-level behavior.

### Phase D — polish and verification (medium)

1. Add interaction and focus states from Section 7.
2. Add restrained motion from Section 8 and its reduced-motion path.
3. Test the four required viewport widths and keyboard navigation.
4. Run `npm run lint` and `npm run build`; resolve all errors before handoff.
5. Add screenshots one at a time using the exact project asset contract in Section 4, then re-check crop, alt text, and file size.

## 12. Acceptance checklist

A build is ready only when every statement is true:

- [ ] The site clearly uses one warm-paper/oxblood palette with no competing gradient, glow, rainbow, or dark-theme language.
- [ ] A visitor can reach selected work, résumé, and contact from the first viewport.
- [ ] The first four projects appear in a user-controlled horizontal carousel with accessible buttons, keyboard support, and no autoplay.
- [ ] Project screenshot placeholders are polished before screenshots are supplied, and later screenshots can be dropped into a stable 16:10 media slot.
- [ ] Experience, education, skills, projects, and personal interests are all represented—but not with the same component repeated everywhere.
- [ ] All displayed claims and metrics originate from the existing portfolio content or user-supplied facts; no new achievements or links were fabricated.
- [ ] On mobile, the page reads naturally in one column and the carousel remains discoverable and operable.
- [ ] Reduced-motion users get the full static experience; keyboard users get visible, logical focus.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] The result reads as one cohesive personal editorial site, not a résumé page with visual effects added afterward.

## 13. Inputs still needed from Vandan before final publishing

1. GitHub profile URL and any project repository/live-demo URLs.
2. Three final hobby/interest entries for the “Beyond the terminal” section.
3. A decision on whether the phone number should stay public.
4. Project screenshots using the screenshot briefing in Section 4.
5. Confirmation of the preferred status wording once the Fanatics role begins.

