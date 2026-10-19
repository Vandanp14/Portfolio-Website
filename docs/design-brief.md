# Design brief — portfolio product-story revamp

## Intent

Turn a resume-like editorial index into an experience that demonstrates how Vandan builds: make the software visible first, help visitors move quickly between the work and the engineering story, and keep verified facts close to the interface evidence.

## Audience and primary task

Recruiters and engineering collaborators need to assess focus, ownership, and shipped work, then reach the résumé or contact page. Primary task: explore projects. Secondary tasks: understand experience, technical range, and follow up.

## Reference-site study

The current Apple landing page uses centered product headlines, a direct pair of actions, and full-width product imagery, then repeats that product-story unit in distinct page chapters. Uber makes the first task unmistakable and sequences the process into clear steps. Cluely leads with one product promise and lets visitors inspect a detailed, interactive app surface before explaining capabilities in separate chapters.

### Transfer into this portfolio

| Reference | Observed pattern | Portfolio use |
|---|---|---|
| [Apple](https://www.apple.com/) | Centered launch story, concise actions, oversized product image, separated feature stories | Clear centered opening, a real interface stage, then focused story sections |
| [Uber](https://www.uber.com/) | Direct first action, simple navigation, process ordering, visible progress cues | Full-width utility nav, direct project controls, numbered route and experience steps |
| [Cluely](https://cluely.com/) | Immediate interface demo, a visible working surface, evidence-led feature sequence | Real project screen in the first viewport, selectable project viewer, interface-led case studies |

Do not reuse their assets, product chrome, copy, or logos. The purpose is to translate their interaction and storytelling patterns to Vandan's own work.

## Direction

**Product story, clear utility.** Replace the previous warm editorial system throughout the site. Use a crisp near-white / black palette, a focused blue action color, substantial interface framing, and larger responsive type. Alternate light informational pages and dark product-story surfaces to make the portfolio read as a sequence of distinct chapters.

### Tokens

- Canvas: near-white `#F5F6F8`; raised surface `#FFFFFF`; mist `#E9EDF4`; ink `#10131A`.
- Product stage: near-black `#090B10` with `#F7F8FC` copy and blue `#94B6FF` active state.
- Action blue: `#1764E8`, used for links, selected project state, and primary actions; 5.22:1 against white and 4.83:1 against the cool-white canvas.
- Typography: existing Geist and Geist Mono, sans-first; large tight display headlines, calm readable body text, compact mono labels for data and progress only.
- Layout: full-width utility bar; centered promise and interface proof; modular full-bleed product chapters; scannable route and work controls.
- Surfaces: 10–22px radii for interface frames, media, and controls. Flat page backgrounds, restrained borders, and neutral shadows.
- Motion: short state feedback and one-shot screen/section transitions. Keep content visible when motion is reduced; avoid motion that competes with the interface screenshots.

## Product structure

1. **Home:** centered headline and direct actions; product window containing an actual project screenshot; verified outcome strip; selectable showcase that cycles through the three featured products; route directory.
2. **Work:** concise introduction; keyboard-operable project selector; active product story with lead screenshot, summary, build details, outcome metrics, and supporting images.
3. **Experience:** current Fanatics chapter first, then a route-like progression through previous roles with dates, responsibilities, and stacks.
4. **About:** compact story heading, grouped toolkit, degree and community/recognition sections.
5. **Contact:** direct contact options beside a focused, validated message form.

## Preserve

- Keep every existing route and verified project fact, screenshot, outcome, and contact destination.
- Preserve skip navigation, semantic headings, keyboard project selection, visible focus, reduced-motion support, theme choice, contact validation, analytics, and lazy loading for blog and résumé.
- Avoid fabricated interface screenshots. MINT Game Hub gets an explicitly editorial game index until real screenshots exist.

## Tradeoffs

- A dark framed interface gives real screenshots room and makes the opening feel more product-oriented; use white space elsewhere so the site stays easy to read.
- A selectable project story makes the work browsable without repeating a long project index and keeps each actual screenshot tied to its project.
- The new blue action color is brighter than the previous accent and must retain readable text contrast in both themes.
- The site borrows layout and interaction ideas from the references while keeping its own content, assets, and identity.

## Implementation plan

- Rebuild homepage composition and add a stateful featured-project showcase.
- Rework project browsing into a keyboard-operable selector and screen-led case study.
- Refresh shared navigation, section openers, route directory, experience, about, contact, and footer surfaces.
- Review desktop and mobile routes, interaction states, reduced motion, and production build output.
