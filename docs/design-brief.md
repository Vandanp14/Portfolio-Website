# Design brief — Vandan Patel portfolio refresh

## Intent

Turn the current typographic index into an inviting, product-led portfolio that makes Vandan's engineering range and shipped work understandable in the first screenful. The site should feel like an independent engineer's editorial portfolio: considered, tactile, and specific.

## Audience and primary task

Recruiters and engineering collaborators need to quickly understand the work, level of ownership, and how to follow up. Primary task: explore projects. Secondary tasks: review experience, résumé, and contact details.

## Direction

Editorial Premium, with a utility-first navigation layer. Take Apple's succinct story pacing, Uber's orientation and clear next actions, and Cluely's concrete early product proof. Keep the existing site's excellent case-study depth and responsive routed structure.

### Tokens

- Canvas: warm paper `#F4F1E9`; raised surface `#FBFAF6`; dark ink `#181A18`; secondary ink `#555750`; quiet ink `#77786F`.
- Signature accent: vermilion `#C34D36`, reserved for actions, active states, and small index marks.
- Dark feature panel: `#202320` with warm-white copy; no gradients or broad glass surfaces.
- Typography: existing Geist for readable, compact navigation and body copy; a high-contrast editorial serif for a few display moments only if available locally, otherwise system serif fallback. Avoid loading a new remote font.
- Layout: generous editorial margins with a narrower readable text measure; asymmetrical split hero; image-led project feature; consistent hairline rules.
- Corners: mostly square; modest rounding only for photographic media and controls where it improves affordance.
- Motion: restrained, short entrance and interaction transitions; preserve reduced-motion behavior. The project screens are the one visual focal point.
- Measured body-size contrast for the chosen palette: secondary ink on paper 6.49:1, quiet ink on paper 4.85:1, accent on paper 5.24:1, and secondary ink on dark slate 8.75:1.

## Differentiation map

| Source | Transfer | Portfolio expression |
|---|---|---|
| Apple | concise product story, distinct section beats, image reveals | asymmetrical opening, responsive project-screen reveal, and focused case-study chapters |
| Uber | legible orientation, direct next actions, and task/progress cues | responsive route directory, active timeline rail, and explicit work/contact actions |
| Cluely | show a product interface early, then explain through evidence | actual project screenshots lead each interactive case-study panel before summary and build details |
| Vandan's existing site | substantive case studies and useful routes | preserve the content, route model, keyboard patterns, theme, and contact flow |

## Ranked palette candidates

1. **Warm paper + vermilion** — selected. Distinct from the three references, supports technical screenshots, and gives links/actions one clear role.
2. Cool white + cobalt — legible, but drifts toward common developer portfolio/AI-product palettes.
3. Charcoal + lime — energetic, but risks making screenshots compete and would keep the site visually close to the current dark feature panels.

## Do not regress

- Keep `/work`, `/experience`, `/about`, `/contact`, `/resume`, and `/blog` working.
- Retain substantive, factual project content and existing real screenshots.
- Preserve skip navigation, semantic headings, keyboard-friendly project selection, visible focus, and reduced-motion support.
- Preserve the contact validation/submission behavior, theme toggle, lazy-loaded blog/resume, SEO metadata, analytics, and mobile menu.
- Maintain sufficient text contrast on paper and dark surfaces.

## Assets not to imitate

- Apple's product photography, hero compositions, marketing copy, or product iconography.
- Uber's brand colors, ride-booking form, or imagery.
- Cluely's AI overlay, app chrome, gradient backdrop, or brand marks.
- Generic portfolio mockups or fabricated client logos/metrics.

## What we are NOT doing

- Replacing project facts with marketing claims.
- Turning the homepage into a SaaS feature grid or a dashboard.
- Adding remote dependencies, external font requests, 3D scenes, or a decorative animated background.
- Removing any existing route or interactive capability.

## Phased plan

- P1 (M): Rework the homepage hierarchy into an editorial hero, selected project proof, and clear next steps.
- P2 (M): Rebuild route directory, project viewer, experience timeline, and toolkit presentation around real content.
- P3 (M): Rebase shared palette/type/layout tokens and align global navigation, contact, and footer surfaces to the new direction.
- P4 (S): Refine responsive details, motion/reduced motion, and accessibility; verify all routes and build checks.

## Tradeoffs

- **Visible project proof vs. minimal hero:** moving screenshots up makes the portfolio more credible sooner but gives the opening less empty space. Use one featured visual and keep supporting projects below.
- **Expressive editorial type vs. scanability:** use display type for the name and section pivots, keep body and metadata at practical sizes.
- **Warm light canvas vs. existing dark panels:** warm paper differentiates the identity, while a single dark case-study panel keeps depth and preserves screenshot contrast. Theme toggle remains available.

## Sources

See [portfolio reference patterns](research/portfolio-reference-patterns.md).
