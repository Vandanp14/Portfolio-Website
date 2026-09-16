# Contact form backend

Google Apps Script web app behind the contact form on vandanpatel.me.
The browser POSTs JSON with `Content-Type: text/plain` so the request stays a
CORS "simple request" — Apps Script cannot answer a preflight OPTIONS.

| | |
|---|---|
| Script ID | `16-P7hjI3jXPxAkatJbuvfMV5rU66aJbNF5K_SsZD0SUAHVcJu1cuHWjJ` |
| Deployment ID | `AKfycbzXsv_yueegt2Gv3-G9OARmljJ2VAj1GG0RcnkeYRUG_nxI_hWISB7hufTCLtcLQKyW7w` |
| Web app URL | `https://script.google.com/macros/s/AKfycbzXsv_yueegt2Gv3-G9OARmljJ2VAj1GG0RcnkeYRUG_nxI_hWISB7hufTCLtcLQKyW7w/exec` |
| Editor | https://script.google.com/home/projects/16-P7hjI3jXPxAkatJbuvfMV5rU66aJbNF5K_SsZD0SUAHVcJu1cuHWjJ/edit |

The front end reads the URL from `VITE_CONTACT_ENDPOINT`. It is set in
`.env.local` for local dev and in the Vercel project for production. Vite
inlines `VITE_*` at build time, so changing it requires a rebuild.

## Updating

```bash
cd apps-script
clasp push
clasp redeploy AKfycbzXsv_yueegt2Gv3-G9OARmljJ2VAj1GG0RcnkeYRUG_nxI_hWISB7hufTCLtcLQKyW7w
```

Always redeploy against that existing deployment ID. A bare `clasp deploy`
mints a new deployment with a **new URL**, which would silently break the form
until the env var was updated.

## Notes

- Manifest is `executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS` — visitors
  need no Google account, and mail is sent as the deploying account.
- `doPost` needs OAuth scopes (MailApp, PropertiesService, LockService). The
  owner must run any function once in the editor and grant consent, otherwise
  POSTs fail while `doGet` still succeeds.
- The recipient can be changed without a redeploy by setting a script property
  named `RECIPIENT`.
- `curl -L` does not reproduce the browser path: Apps Script 302s to
  script.googleusercontent.com and curl mangles the follow-up. Test with a real
  browser `fetch`.
