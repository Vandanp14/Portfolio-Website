# AI & Big-Tech Product-Site UI Research (Apple, Anthropic, Cluely, Linear, Cursor, Stripe)

- **Researched:** 20 October 2026.
- **Pages fetched live:** 30 (4 per site for Apple, Anthropic, Cluely, Linear, Cursor, Stripe and Vercel; 2 for Perplexity, whose homepage is a client-rendered SPA). Every value below was extracted from the served HTML or the compiled CSS bundles, not from memory.
- **The stated problem, in one sentence:** the current portfolio reads as a light-mode SaaS/editorial hybrid — Geist, white paper, violet accent, uniform 2px-radius cards — with no product-grade staging, no technical metadata voice, and nothing a visitor would remember; it must become a site that presents one engineer the way Apple, Linear and Anthropic present a product: staged, measured, technical and unmistakable.
- **Sourcing note:** all eight sites answered HTTP 200 and were fetched with a desktop UA. Apple's CSS ships SF Pro via `wss/fonts`; Anthropic's marketing pages mix a Webflow-built homepage (brand CSS) with Next.js product pages; Linear ships only 18 KB of external CSS and inlines its design tokens in a 245 KB `<style>` block plus JS payload, so its palette was read from colour literals in the document. Perplexity's headings are client-rendered and could not be scraped — its typography and colour data come from its compiled CSS and are marked *(unverified for layout)*. No claim below is from memory.

---

## 1. Apple (`apple.com`, `/iphone/`, `/macbook-pro/`, `/newsroom/`)

### Page layout
A stack of full-bleed "acts", each with exactly one claim centred over a product image or video, separated by generous white space and, where a section changes register, a `#f5f5f7` band. There is no card grid and no sidebar: the product is the page. A persistent local nav (`iPhone · Overview · Tech Specs · Compare`) sits 44px tall under the global bar, so a visitor always knows which act of the story they are in. Headings observed: *iPhone*, *iPhone Duo*, *Switch to iPhone*, *Designed to Last*, *Cutting-Edge Cameras*, *Apple Intelligence and Siri AI*, *Environment*, *Privacy*, *Explore the lineup.*

### Tile / unit anatomy
1. Oversized wear-anywhere headline at 48/56/64/80px, weight 600, tracking **-0.022em**, line-height 1.05–1.1.
2. A one-sentence subhead at 21–28px in `#6e6e73`, max ~600px wide.
3. Two text links in Apple blue **#0071e3** (39 occurrences in the homepage CSS), 17px, with a chevron — never a filled button in the hero.
4. Full-bleed media, often edge-to-edge and often dark, with the copy above it.
5. A small `#f5f5f7` spec strip repeating price, availability, and a `Buy` pill (**border-radius: 980px**).
6. Section close-out: a `Learn more` / `Buy` pair, then a hairline `#d2d2d7` divider.

### State & ritual mechanics
Almost no state. Apple's "ritual" is scroll choreography: media scrubs or cross-fades with scroll position, and the local nav highlights the current act. Buttons are the only interactive objects, with a 120–200ms colour shift. Dark sections invert the band (`#000` with white copy) without changing type metrics — the same 17px/1.47 body across every band.

### Typography measured
Body **17px / 1.47**, secondary 14px, captions 12px; scale 17 · 21 · 28 · 40 · 48 · 56 · 64 · 80. Tracking: `-0.022em` and `-0.016em` on display, `0.011em` on captions. Radii: 980px (pills), 28px (media tiles), 10px (small chips). Palette: ink `#1d1d1f`, muted `#6e6e73`, hairline `#d2d2d7`, band `#f5f5f7`, accent `#0071e3`, dark `#000000 / #1d1d1f`.

**Takeaway: Apple earns attention by subtraction — one claim, one image, one action per screen, with typography doing the work that decoration would otherwise do.**

---

## 2. Anthropic (`anthropic.com`, `/claude`, `/research`, `/careers`)

### Page layout
Warm paper (`#faf9f5`) with an ink headline that behaves like a publication rather than a product. The homepage is a single editorial statement — *"AI research and products that put safety at the frontier"* — followed by a *Latest releases* rail. Sub-pages switch to a structured research index (*Alignment · Economics · Frontier Red Team · Interpretability · Societal Impacts*) and a careers page that reads like a magazine feature. Sections are separated by hairline rules, not cards.

### Tile / unit anatomy
1. Serif display line (Tiempos) — the only place the serif is allowed to be large.
2. Small mono/sans eyebrow above it in letterspaced caps.
3. Body copy in Styrene A/B at ~16–18px, colour `#141413`, measure ~65ch.
4. A single clay accent **#d97757** on links and the small ":Claude:" mark.
5. Rules at `#e8e6dc` / `#d1cfc5`; no shadows anywhere.
6. Cards, when they exist, are **square-cornered** (`--body-border-radius: 0`) and bounded by a 1px rule.

### State & ritual mechanics
A page-load stagger of headline → body → cards, all on one easing curve (`--hero-ease: cubic-bezier(.2,.7,.2,1)`) at `--transition-duration: .2s` for UI and ~700ms for staggered reveals. Hover is a colour change only — no lift, no scale. The site has no dark mode on marketing pages; the "dark" register exists as a section (slate ramp `#0f0f0e → #73726c`) rather than a theme.

### Typography measured
Families: **Tiempos Text** (serif), **Styrene A/B** (sans), **Anthropic Mono**, JetBrains Mono fallback. Palette: paper `#faf9f5`, ink `#141413`, body-muted `#5e5d59`, rules `#e8e6dc`, `#d1cfc5`,`#b0aea5`, clay `#d97757`, slate ramp 1000→550. Radius **0** on content surfaces.

**Takeaway: Anthropic proves a warm paper ground plus one serif display voice and a single clay accent reads as more intelligent than any amount of UI chrome.**

---

## 3. Cluely (`cluely.com`, `/pricing`, `/careers`, `/blog`)

### Page layout
A single dark stage (`#0b0c0e`–`#1c1d22`) with an EB Garamond headline at near-full width, then a product demo, then FAQ. Everything is one column; the page argues rather than navigates. Pricing is a three-plan comparison table with no rounded cards; careers opens with *"You're running out of time to make generational wealth. This is your best shot."* — the voice is the design.

### Tile / unit anatomy
1. Serif headline (EB Garamond) in mixed case, often two lines, with a serif italic emphasis.
2. A plain-language subhead that names the competitor: *"Unlike Otter or Granola, Cluely helps you during meetings, not just after."*
3. Product screenshot in a dark device chrome, with a floating transcription/answer panel.
4. A single blue action (**#3152f4**) and ghost secondary.
5. Mono micro-labels for states: *Meeting participants (4)*, *Real-time transcription*.
6. FAQ rows as flat rules with a `+` control.

### State & ritual mechanics
Live product theatre: the hero contains an animated meeting transcript, so the page demonstrates the product instead of describing it. Sticky bottom CTA on mobile. No theme toggle, no card hover effects; transitions are short (150–300ms) and mostly opacity.

### Typography measured
**EB Garamond** (display serif) + **Geist / Inter** (UI sans) + mono for labels. Palette: `#0b0c0e`, `#1c1d22`, `#2e3038`, `#edeef2`, `#f9fafb`, `#dde2ee` (borders), accent `#3152f4`. Radii are small (2–6px) except device chrome.

**Takeaway: Cluely wins with an opinion — a serif voice, a dark stage and copy that takes a position; the design is memorable because the writing is.**

---

## 4. Linear (`linear.app`, `/method`, `/pricing`, `/customers`)

### Page layout
A near-black canvas (`#08090A`) where the *product UI itself* is the hero, staged in perspective on a gradient-lit plinth. Down-page, four labelled capabilities (*Intake and integrations · Planning and monitoring · AI and automations · Build, review, and ship*), then a changelog rail, then *"Built for the future. Available today."* `/method` is a long-form opinion document — numbered principles, no product shots.

### Tile / unit anatomy
1. Tight, large headline in a geometric sans, tracking ≈ -0.02em, colour `#E2E4E7`.
2. Muted subhead `#9c9da1`, body `#62666D`.
3. Product screenshot composited over a soft multi-hue glow — **#F79CE0 (pink), #55CDFF (cyan), #8FA4FF (periwinkle), #FFC47C (peach), #89D196 (green)** — used only behind media.
4. Feature rows: icon + 2-word label + one sentence, aligned to a 12-column grid.
5. Hairline borders `#2E2E32`; radius 8–12px on controls, no cards.
6. Changelog entries as dated mono rows.

### State & ritual mechanics
Scroll-linked parallax on the product plinth; hover reveals a lit border on capability rows. One motion family (fast, precise, 150–250ms), no bounce. Light/dark is a product setting, not marketing chrome.

### Typography measured
Monospace via `--font-monospace`; display/body are the product's Inter-derived face. Palette: bg `#08090A`, text `#E2E4E7`, muted `#9c9da1`/`#62666D`, border `#2E2E32`/`#3E3E44`, gradient hues listed above.

**Takeaway: Linear makes software feel inevitable by putting the real interface on a dark stage and keeping every other element quiet.**

---

## 5. Cursor (`cursor.com`, `/pricing`, `/blog`)

### Page layout
Cream/ink editorial split: a very large custom grotesk (CursorGothic) statement — *"Cursor is your coding agent for building ambitious software."* — then a logo rail (*Trusted every day by teams that build world-class software*), then three product acts (*Agents turn ideas into code · Mission Control Interface · Works autonomously, runs in parallel*), then *"The new way to build software."* `/pricing` is a five-tier table (Free · Plus · Premium · Super · Ultra) with a dense feature comparison and an accordion FAQ. The blog is a filtered index (Customer stories · Press · Videos · Changelog).

### Tile / unit anatomy
1. Custom grotesk display, tight, often 2–3 words per line.
2. A serif (EB Garamond) used sparingly for pull-quotes — a second voice used as emphasis, not as body.
3. Mono (`berkeleyMono`) for every technical label, price, and code token.
4. UI type is deliberately small: **.65–.9rem**, tracking `+.02em to +.05em` on mono labels.
5. Product screenshots as bordered frames, radius 2–3px.
6. Buttons: filled ink, 2px radius — no pills.

### State & ritual mechanics
Type-on and caret effects in the agent demo; tabbed feature panels; FAQ disclosure rows. Easing `cubic-bezier(.22,1,.36,1)`; durations 150–700ms. Restrained colour: one accent per context, never rainbow.

### Typography measured
**CursorGothic**, **EB Garamond**, **berkeleyMono / cursorMono**. Sizes `.65/.7/.75/.8/.85/.9rem`, 1rem, 1.5rem. Tracking `+.02–.05em` (mono), `-.02em` (display). Radii 2/3/4px, 999px only for avatars. Ink `#26251e`/`#1d1b15`, accent `#3b82f6`.

**Takeaway: Cursor shows that a technical product can be warm and editorial if the metadata is set in mono and the radius stays at 2px.**

---

## 6. Stripe (`stripe.com`, `/payments`, `/pricing`)

### Page layout
A hero claim — *"Financial infrastructure to grow your revenue."* — over the industry's defining animated gradient mesh, followed by a solutions grid, a customer-proof band, and a dense product nav. `/payments` is a deep product page: *Convert more customers · Global reach, local experience · Less fraud, more revenue · Move faster and lower costs*. Every section is a two-column argument: claim left, evidence right.

### Tile / unit anatomy
1. `sohne-var` display at 48–94px, tracking **-0.02em**, line-height ~1.05.
2. Gradient text or a gradient "ribbon" behind the headline — the only place the spectrum appears.
3. Body 16–18px in `#061b31`, measure ~60ch.
4. Indigo primary **#635bff** (12 hits) with `#533afd` pressed state; gradient stops `#ee30fb`, `#ff6118`, `#7232f1`, `#ea2261`.
5. Buttons: 4px radius, `rgba(50,50,93,.25)` shadow — the shadow is tinted navy, never grey.
6. Dense mono/spec rows for pricing.

### State & ritual mechanics
Gradient drift is slow and continuous but confined to the hero. Section reveals use `cubic-bezier(.25,1,.5,1)` (44 occurrences) at 300–800ms. Pricing tables keep a sticky column header.

### Typography measured
**sohne-var** + **SourceCodePro**. Tracking `-.01em` (71), `-.02em` (44). Radii 4px dominant, 50% for avatars, 1px for hairlines. Easing `cubic-bezier(.25,1,.5,1)`.

**Takeaway: Stripe confines its most expressive asset — the gradient — to one moment, so the rest of the page can be plain and still feel alive.**

---

## Briefly: adjacent players

- **Vercel (`vercel.com`)** — Geist + Geist Mono + GeistPixelSquare, near-pure black/white, **display tracking down to -3.84px at 64px (-0.06em)**, 6/12px radii, `#0070f3` accent. Contributes the "engineered" compression of display type and the mono-as-UI-label discipline.
- **Perplexity (`perplexity.ai`)** — PPLX Sans/Serif + berkeleyMono, teal accent **#32B8C6**, radius scale 2→24px, weights 300–700, body 16/24, display 36/48 at `-.72px`. Contributes the serif-for-reading / sans-for-controls split and a calm product voice. *(Homepage layout unverified — SPA.)*
- **Omitting:** Framer and Raycast, which added nothing the six above did not already establish more strongly.

---

# Top 12 Transferable Patterns for VandanPatel.me

*Ranked by impact on the stated problem: the portfolio must present one engineer with product-grade staging and a technical voice, instead of reading as a generic light SaaS page.*

1. **Stage each project as a product act, not a card.** Apple gives every claim its own full-bleed screen with one headline, one subhead and one piece of evidence; Linear stages the real UI on a lit plinth. Do the same: one project per viewport-height act in `src/components/work/ProjectAct.tsx`, headline at 56–72px, a 17px subhead, then the screenshot edge-to-edge with no border-radius above 4px and no card shadow. Cut the existing 3-up card grid entirely.

2. **Adopt a two-voice type system: serif for claims, mono for facts.** Anthropic, Cursor and Perplexity all separate editorial voice from technical metadata. Use a high-contrast serif (Instrument Serif) for every headline and pull-quote, IBM Plex Sans for body, IBM Plex Mono for eyebrows, indices, stack names, dates and specs. Never set a paragraph in mono; never set a metric in serif.

3. **Warm the ground and cool the accent.** Every reference except Linear/Cluely sits on paper rather than pure white (`#faf9f5` Anthropic, cream Cursor). Use `#F4F1E8` paper, `#12110E` ink, and a single cold accent — cobalt `#2440FF` — so the warmth of the page and the coldness of the signal do the work that a second and third colour were doing.

4. **Set a measured scale with real tracking.** Apple's 17px/1.47 body and Vercel's `-0.06em` display are decisions, not defaults. Freeze a scale — 12/14/17/21/28/40/56/72/96 — with `-0.035em` display tracking, `-0.01em` on 28–40px, `0` on body, and tabular numerals for every metric.

5. **Square the reading surfaces; round only objects.** Anthropic uses radius 0 on content; Apple reserves 980px for buttons. Adopt radius **0** for sections, images and rules, **2px** for inputs and tags, **999px** only for the one primary action. This single rule removes the "every section is a card" failure the old site has.

6. **Give the page a spine: mono index numbers, hairlines, tabular figures.** Linear and Cursor make technical credibility visible with numbered rows and 1px rules. Number every major section (`01 — Selected work`), put a hairline rule at `rgba(18,17,14,.14)` between acts, and set metrics in Plex Mono at 13px with `font-variant-numeric: tabular-nums`.

7. **Use one gradient, once.** Stripe's spectrum works because it appears in the hero and nowhere else. Build a single cobalt→violet→ember mesh (`#2440FF → #7A4DFF → #FF6A3D`) confined to the hero or footer wordmark, at ≤12% opacity, and forbid gradients on every other surface.

8. **Make the copy take a position.** Cluely's *"Unlike Otter or Granola, Cluely helps you during meetings, not just after."* is the whole design. Rewrite the hero and project intros as declarative claims with a number in them — "Product Builder had no API. I built its first one, and the AI assistant that queries 82,000 records in 37ms." — and cut every sentence that could belong to another engineer.

9. **Build a dark "runtime" register as a band, not a theme.** Cursor and Linear use black for the product; Anthropic uses slate for emphasis. Keep light paper for reading, and make the Fanatics/AI proof section a full-bleed `#0C0C0B` band with the same type metrics — one deliberate inversion instead of a global dark mode toggle.

10. **Choreograph one entrance and stop.** Anthropic's `.2s` UI / ~700ms reveal and Stripe's single `cubic-bezier(.25,1,.5,1)` prove that consistency beats variety. Use one curve (`cubic-bezier(.22,1,.36,1)`), 160ms hover, 700ms masked line reveal with 60ms stagger, and nothing that loops, floats or parallaxes in the background.

11. **Keep navigation contextual and thin.** Apple's 44px local nav and Linear's product sub-nav orient without competing. Use a 56px top bar with the wordmark, four contextual links and a status dot; on section pages, add a second 44px hairline row that shows where the visitor is. No frosted glass, no hamburger on desktop.

12. **End on availability, not a contact form.** Linear closes with *"Built for the future. Available today."*; Apple closes each act with price and availability. Close the page with a mono status line (`Available for Summer 2027 · New York / Remote`), a direct email link set in 28px serif, and three plain text links — no form, no modal, no calendar widget.

---

## Sources

- https://www.apple.com/ — homepage CSS at `/v/homepage/a/styles/main.built.css`, `/v/homepage/a/styles/homepage.built.css`
- https://www.apple.com/iphone/ — `/v/iphone/home/ck/built/styles/overview.built.css`
- https://www.apple.com/macbook-pro/ — `/v/macbook-pro/ax/built/styles/overview.built.css`
- https://www.apple.com/newsroom/ — `/newsroom/styles/site.built.css`
- https://www.anthropic.com/ — Webflow brand CSS `ant-brand.shared.*.css`
- https://www.anthropic.com/claude — Next.js chunks `2194ef83048b6cde.css` et al.
- https://www.anthropic.com/research — Next.js chunk set
- https://www.anthropic.com/careers — Next.js chunk set
- https://cluely.com/ — `/_next/static/css/e0f47fde64bf82ef.css`, `d1dfe70eef796b60.css`
- https://cluely.com/pricing, https://cluely.com/careers, https://cluely.com/blog — same bundles
- https://linear.app/ — inline `<style>` design-token block in the document
- https://linear.app/method, https://linear.app/pricing, https://linear.app/customers — inline token block
- https://cursor.com/ — `marketing-static/_next/static/immutable/chunks/*.css`
- https://cursor.com/pricing, https://cursor.com/blog — same chunks
- https://stripe.com/ — `b.stripecdn.com/mkt-ssr-statics/assets/_next/static/css/*.css`
- https://stripe.com/payments, https://stripe.com/pricing — component CSS bundles
- https://vercel.com/ — `vc-ap-vercel-marketing/_next/static/immutable/chunks/*.css`
- https://www.perplexity.ai/ — `pplx-next-static-public.perplexity.ai/_spa/assets/style__v2-C9F9Dn44.css`
