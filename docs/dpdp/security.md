# Security implementation (deliverable 7)

Test results are in `test-report.md`.

## Problems found and fixed

| Problem | Before | Now |
|---|---|---|
| Public access to leads and applicants | `GET /api/leads` and `/api/careers/apply` returned records when `ADMIN_API_KEY` was unset, including IP addresses | Both removed. Staff use authenticated routes |
| Public resumes | Stored in `public/uploads/resumes` with the candidate's name in the file name | Private folder with random names, audited download. The old path is blocked |
| Unprotected blog admin | Anyone could publish, delete or upload | Requires `blogs:manage` |
| Stored script injection | Blog HTML rendered unfiltered, and anyone could post it | Sanitised on save and on render |
| Arbitrary upload | Any file type could be written to `public/` | JPG, PNG, GIF, WebP only, checked by content, 8MB limit |
| Hard-coded admin password | A plaintext fallback in source code | Removed. Individual accounts with scrypt hashes |
| Static session token | The cookie was the password in base64, and logout could not revoke it | Random token, hashed at rest, 10-hour expiry, revoked on logout or access change |
| Brute force | Unlimited login attempts | Rate limit per address, 15-minute lockout after 5 failures |
| Spoofable rate limit | Trusted a client-supplied header | Uses a header your proxy controls, or the proxy-added hop |
| IP sent over plain HTTP | Every enquiry sent the IP to `ip-api.com` | Removed. IP and browser details no longer stored with leads |
| No security headers | None | CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy |
| Personal data in logs | Spam blocks logged name, email and phone | Logs carry error class and code only |
| Spreadsheet formula injection | CSV export was built in the browser, unescaped | Server-side export, neutralised cells, permission-checked and audited, no IP column |
| Comment auto-publishing | Published instantly while the UI said "awaiting moderation" | Hidden until approved |

## Controls in place

- **Authentication:** individual accounts, scrypt, generic login errors, constant-time checks for unknown accounts.
- **Authorisation:** permission check on every admin route (`requirePermission`).
- **CSRF:** `SameSite=Lax` cookies plus an Origin check on every write.
- **Input:** length caps, control-character stripping, phone and email validation, allowlists for status, source and type fields.
- **Uploads:** size limit before parsing, checked by file signature, downloads forced as attachments.
- **Audit log:** sign-ins, failures, lockouts, exports, resume downloads, status changes, deletions, request actions, retention runs, and breach and access changes. It holds IDs and field names, not personal details.
- **Dependencies:** `npm audit --omit=dev` reports 0 vulnerabilities as of 2 November 2026. Run it monthly.

## Known limits

- **No MFA.** The policy no longer claims it. Strongly recommended before launch for SUPER_ADMIN and PRIVACY_OFFICER.
- **CSP allows inline scripts,** because the alternative (nonces) would force every page to render dynamically. It still blocks external scripts, frames, connections and form targets.
- **The rate limit is per address,** so a distributed attack is not stopped. Add a WAF at the proxy. **It also depends on a proxy:** without one, a client can forge the header it reads and bypass every limit. Never expose `next start` directly to the internet.
- **Staff cannot change their own password.** An administrator sets it under Staff access, using a browser prompt.
- **Data is not encrypted at rest by the app.** Use an encrypted disk for the database, private folder and backups.
- **`prisma/dev.db` is still in git history.** See `outstanding-items.md`.

## Deployment checklist

These are not enforced by code and must be done on the server:

1. Turn on "Always Use HTTPS" for the domain. Cloudflare terminates TLS.
2. Keep `CLIENT_IP_HEADER` set to `cf-connecting-ip` in `wrangler.jsonc`. Cloudflare overwrites this header on every request.
3. Set the secrets with `npx wrangler secret put`, using fresh random values.
4. Keep public access off on the `vastuvihar-private` R2 bucket, and limit who can reach the D1 database and R2 buckets in the Cloudflare account. Anyone with that access can read personal data.
5. Follow "Deploying to Cloudflare" in the README to create the tables and first admin, then remove `ADMIN_BOOTSTRAP_PASSWORD` from your shell.
6. Schedule the retention job. See `retention-plan.md`.
7. Set up backups of D1 and the private bucket. D1 Time Travel covers recent changes only, and R2 has no built-in backup, so test a restore and restrict access to the copies.
8. Decide log retention on the server and proxy. The DPDP Rules, 2025 may set a minimum period for logs. I could not confirm this from the sources checked, so ask your legal adviser.
9. Monitor failed sign-ins (`admin.login_failed`, `admin.account_locked` in the audit log) and server errors.
