# Portfolio Website

My personal site, live at [vandanpatel.me](https://vandanpatel.me). It lists my projects, work experience and education, and has a blog, a résumé viewer and a contact form.

## Stack

React 18, TypeScript, Tailwind CSS 3 and Vite. Deployed on Vercel from this repo, with a few Vercel Functions in `api/` for per-page metadata, Open Graph images, the blog proxy and the résumé PDF. The contact form, blog and résumé are backed by Google Apps Script.

## Content

Everything on the site lives in `src/content/portfolio.ts`. The facts come from my master résumé JSON (`~/Desktop/ATS_Resume_Tailor_Agent/master.json`). The résumé page shows the newest PDF in a Google Drive folder, so updating it needs no deploy.

## Run it locally

```bash
git clone https://github.com/Vandanp14/Portfolio-Website.git
cd Portfolio-Website
npm install
npm run dev
```

`npm run lint` and `npm run build` should both pass before a PR. See `CLAUDE.md` for how the code is laid out and `docs/DEPLOYMENT.md` for shipping.

## Contact form troubleshooting

On 2026-10-05, the live form's Apps Script POST redirected to a Google
`script.googleusercontent.com` URL that returned HTTP 404; other requests timed
out. The endpoint, deployed source, anonymous access, and clasp login were correct.
Refreshing the **existing deployment** restored browser POST JSON responses
(about 3.5 seconds). Google's internal reason for the broken redirect was not
observable; this was not a confirmed clasp-login or consent-expiry issue.

When the form was reported broken again, I found a separate frontend issue: the
form could show “Message sent” without posting if submitted in under two seconds
or if browser autofill filled a hidden spam-trap field. I removed that silent
success path so every valid submission reaches the backend. I can't confirm that
this frontend bug caused the original delivery failure.

Run `npm run check:contact` after backend changes or when the form fails. It checks
mail readiness and an invalid POST without sending email. See
[the recovery guide](apps-script/README.md#recovery-and-verification) for exact
redeployment, Google authorization, and verification steps. This is an on-demand
check locally. GitHub Actions also runs it against the published site every 15
minutes. It opens and tags an issue after two failed attempts, then comments and
closes the issue after a successful check. Watch the repository's Issues and enable
GitHub issue notifications to receive those alerts. The monitor has no npm
install step. A passing check verifies the
backend response and mail permission/quota; it cannot prove a real message reached
the inbox without sending a test email.
