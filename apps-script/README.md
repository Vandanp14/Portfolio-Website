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
- Clasp login and the web app owner's mail authorization are separate. Run
  `verifyContactSetup` in the editor as the owner to grant consent and check quota
  without sending email. The GET readiness check now uses this too.
- The recipient can be changed without a redeploy by setting a script property
  named `RECIPIENT`.
- Follow redirects. With curl use `--data '{}' -L`, not `-X POST -L` (which
  can incorrectly retain POST on the redirected request). A browser check is
  still necessary to verify CORS.

## Recovery and verification

### Incident: 2026-10-05

The live frontend used the correct deployment URL. Its POST received a 302 from
`script.google.com`, then 404 HTML from `script.googleusercontent.com`; some
requests timed out. A GET health check sometimes succeeded. Clasp authentication,
anonymous access, execute-as-owner, and deployed source version 2 were verified.

Refreshing that same deployment at version 2 restored the browser POST to HTTP
200 with `{"ok":false,"error":"Please include your name."}` in ~3.5 seconds.
This establishes the recovery, not Google's unobservable internal root cause.
No evidence showed expired clasp credentials or missing owner consent.

Version 3 subsequently added mail-readiness checks and was deployed to the same
URL. Browser GET and invalid POST both returned HTTP 200 with the expected JSON;
GET included `mailReady:true`. No test email was sent, so inbox delivery was not
verified. Node's automatic POST redirect separately returned 404 while the browser
passed; the CLI probe therefore follows Google's 302/303 using a fresh GET with
no POST headers/body. That explicit redirect also returned the expected JSON.

After the owner reported the form still was not working, a separate client bug was
found: for submissions within two seconds of mounting, or when browser autofill
populated a hidden honeypot, the UI displayed “Message sent” without making a
request. This behavior could explain a false success, but there is no evidence it
caused the initial report. The client-side skip and honeypot were removed; every
valid form submission now posts to the backend, which retains server-side spam
filtering. A later CLI probe timed out even though browser checks passed, so Google
or network availability can still vary. Do not automatically retry message
delivery after a timeout because the first request may already have sent email.

### If it happens again

1. From the repository root, run `npm run check:contact`. Requires Node 22+;
   the checker itself has no package dependencies. It reads `.env.local`,
   `.env.production`, or `.env`; to check a specific deployed URL use
   `npm run check:contact -- 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec'`.
   Confirm this matches the endpoint in the live frontend's build.
2. Check management access and deployed version:

   ```bash
   cd apps-script
   clasp show-authorized-user
   clasp list-deployments
   ```

   If clasp reports an authentication error, run `clasp login` as the owner.
   This repairs CLI access only; it does not grant the deployed script mail consent.
3. For the same redirect/404 failure, refresh the existing deployment using its
   **current version number from the list**, not a new deployment:

   ```bash
   clasp redeploy AKfycbzXsv_yueegt2Gv3-G9OARmljJ2VAj1GG0RcnkeYRUG_nxI_hWISB7hufTCLtcLQKyW7w --versionNumber CURRENT_VERSION
   ```

   For source changes, run `clasp push` and then the normal redeploy command in
   Updating above (without pinning an old version). Push alone does not ship.
4. If GET returns `mailReady:false`, open the editor linked above as the owner,
   select `verifyContactSetup`, and run it. Review/grant Google's requested mail
   permissions if prompted. A quota error requires waiting for quota recovery;
   re-login/redeploy will not replenish quota. Check the editor's Executions pane
   for other exceptions. `clasp logs` requires a configured GCP project ID and
   is not configured in this repo.
5. In Deploy → Manage deployments, retain **Execute as: Me** and **Who has access:
   Anyone**. If you intentionally create a replacement deployment, update
   `VITE_CONTACT_ENDPOINT` in Vercel and `.env.local`, then rebuild/redeploy the
   frontend. Vite embeds this value at build time.
6. Repeat `npm run check:contact` and test from the live site's browser context.
   A safe browser-console probe (substitute the current endpoint) is:

   ```js
   await fetch('https://script.google.com/macros/s/DEPLOYMENT_ID/exec', {
     method: 'POST',
     headers: { 'Content-Type': 'text/plain;charset=utf-8' },
     body: '{}',
     signal: AbortSignal.timeout(15000),
   }).then(response => response.json())
   ```

   Expected: `{"ok":false,"error":"Please include your name."}`. This exercises
   POST and its response redirect without sending mail or consuming the message
   rate limit. Mail readiness checks authorization/quota but does not prove inbox
   delivery. For that final check, submit a message yourself and confirm receipt.

### Prevention and limits

- GET now checks mail authorization/quota, rather than always claiming “up.”
- `npm run check:contact` fails on timeout, HTTP errors, non-JSON responses,
  unavailable mail readiness, or an unexpected POST response. Run it after every
  deployment. It is not a scheduled monitor.
- Preserve the deployment ID; do not replace the endpoint with a temporary
  `script.googleusercontent.com` redirect URL.
- Do not automatically retry message POSTs: a failed response does not establish
  that an email was not sent, so retries can duplicate messages.
- A valid form submission now always sends a POST before it can show “Message
  sent.” The client no longer has a timer or autofillable honeypot that silently
  skips delivery. The server still drops a nonempty `company` honeypot for direct
  bot requests.
