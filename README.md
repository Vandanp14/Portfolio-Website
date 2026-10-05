# Portfolio Website – Vandan Patel

This is my personal portfolio website built with **React + TypeScript + Tailwind CSS**, designed to showcase my education, experiences, skills, and resume in a sleek and responsive layout.

## 🔗 Live Demo
Check it out here: [vandanpatel.me](https://vandanpatel.me)

## 🧰 Tech Stack
- ⚛️ React
- 🟦 TypeScript
- 🌈 Tailwind CSS
- ⚡ Vite
- 📦 Lucide Icons

## 📄 Resume Integration
My resume is embedded via a public Google Drive link so I can update it anytime **without needing to redeploy** the site or push to GitHub.

## 🚀 Deployment
The site is deployed using [Vercel](https://vercel.com), with continuous deployment from this GitHub repo.

## 📁 Folder Structure

src/
├── components/
├── App.tsx          # Main layout and sections
├── assets/          # Icons, images (optional)
└── index.html       # Entry point

## 🛠 Setup Instructions
To run the project locally:
```bash
git clone https://github.com/Vandanp14/Portfolio-Website.git
cd Portfolio-Website
npm install
npm run dev
```

🙋‍♂️ About Me

I’m a Computer Science student at SUNY Oswego, passionate about frontend development, design systems, and building tools that improve user experiences.

📬 Contact
	•	📧 patelvandan024@gmail.com
	•	💼 LinkedIn
	•	🌐 vandanpatel.me

⸻



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
