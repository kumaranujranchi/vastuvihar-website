# Cloudflare deployment runbook

The site runs on Cloudflare Workers through OpenNext, with D1 for the database, R2 for
uploaded files and a Cron Trigger for the retention job. AWS Lightsail stays the live
site until the cutover in section 6, and stays available as the rollback target.

## 1. Environments

| | UAT | Production |
|---|---|---|
| Worker | `vastuvihar-website-uat` | `vastuvihar-website` |
| URL | https://vastuvihar-website-uat.aditya-7c7.workers.dev | https://vastuvihar.org (custom domain, at cutover) |
| D1 | `vastuvihar-db-uat` (`e7c2092f-…`) | `vastuvihar-db` (`be4de6b9-…`) |
| R2 | `vastuvihar-uat-private`, `vastuvihar-uat-media` | `vastuvihar-private`, `vastuvihar-media` |
| Config | `env.uat` in `wrangler.jsonc` | top level of `wrangler.jsonc` |
| Search engines | `noindex`, robots.txt disallows all | indexed |
| Tracking tags | always off | on only when the tag IDs are set at build time |
| workers.dev URL | on | **off** (`workers_dev: false`, `preview_urls: false`) |

Each environment is built separately, because `NEXT_PUBLIC_*` values are fixed at build
time. Always go through `scripts/cf.mjs` (the `cf:*` npm scripts). It sets those values,
refuses to build while a `.env` file exists (OpenNext would bundle it into the Worker),
and runs the preflight below before any deploy.

```bash
npm run cf:preflight:uat            # checks only
npm run cf:deploy:uat               # preflight, build, migrate, deploy
npm run cf:upload:production        # preflight, build, migrate, upload a version (no traffic)
npm run cf:deploy:production        # same, then move 100% of traffic (prefer upload + promote)
npm run cf:preview                  # local Worker with local D1/R2 (needs .dev.vars)
```

Preflight fails when: a `REPLACE_` value remains in `wrangler.jsonc`; a D1 ID or an R2
binding is missing; R2 is not enabled or a bucket does not exist; `PRIVACY_HASH_SECRET` or
`RETENTION_CRON_SECRET` is not set on the Worker; `REQUIRE_CF_ACCESS` is not `1`; a
`.env` file exists; and, for production, the git tree is not clean, workers.dev or
preview URLs are on, or `--confirm-production` is missing.

## 2. The built-in admin login, and why Access is mandatory

`app/api/admin/auth/route.ts` keeps, by request, a master login for `info@vastuvihar.org`
that accepts fixed passwords written in the source code, and creates or
re-activates a SUPER_ADMIN account on use. Anyone who can reach the login form can
therefore take over the admin area: every enquiry, CV, privacy request and admin user.

On Cloudflare this is contained by **Cloudflare Access**, enforced twice:

1. Access applications in front of `/admin` and `/api/admin` (set up in section 3).
2. The app itself (`proxy.ts`, `lib/security/cfAccess.ts`) verifies the Access token
   (RS256 signature against the team's keys, issuer, audience, expiry) on every `/admin`
   and `/api/admin` request when `REQUIRE_CF_ACCESS=1`. So the gate also holds on any
   URL Access does not cover. Placeholder values make the admin area answer **503**, a
   request without a valid token gets **403**.

**A public launch is safe only with Access configured and limited to named staff.** It
is still a risk worth removing: anyone given Access (or a compromised staff account)
can use the master password, and the login cannot be revoked or audited per person.
Replace it with per-person accounts (`npm run admin:create:d1`) when you can.

## 3. One-time setup (needs the account owner)

1. **Workers Paid plan.** Admin sign-in hashes the password with scrypt, about 170 ms of
   CPU. The free plan stops a request at 10 ms, so sign-in would fail with error 1102.
2. **Enable R2** in the dashboard (R2 > Purchase/Enable). Then:
   ```bash
   npx wrangler r2 bucket create vastuvihar-uat-private
   npx wrangler r2 bucket create vastuvihar-uat-media
   npx wrangler r2 bucket create vastuvihar-private
   npx wrangler r2 bucket create vastuvihar-media
   ```
   Leave public access off on all four. Then redeploy UAT (`npm run cf:deploy:uat`),
   because the current UAT version was deployed without R2.
3. **Cloudflare Access** (Zero Trust > Access > Applications):
   - UAT: Workers & Pages > `vastuvihar-website-uat` > Settings > Domains & Routes >
     workers.dev > *Enable Cloudflare Access*. Restrict its policy to staff emails.
   - Production (after the zone is on Cloudflare, section 6): a self-hosted application
     with destinations `vastuvihar.org/admin` and `vastuvihar.org/api/admin`, a policy
     that allows only named staff emails, and one-time PIN or your identity provider.
   - Copy each application's **Application Audience (AUD) tag** and your **team domain**
     (`<team>.cloudflareaccess.com`) into `wrangler.jsonc`: `CF_ACCESS_AUD` and
     `CF_ACCESS_TEAM_DOMAIN` (top level for production, `env.uat.vars` for UAT).
4. **Secrets** (UAT already has both):
   ```bash
   npx wrangler secret put PRIVACY_HASH_SECRET      # production: reuse the Lightsail value
   npx wrangler secret put RETENTION_CRON_SECRET
   ```
5. **Rate-limit the login** (Security > WAF > Rate limiting rules): for example 5
   requests per minute per IP to `/api/admin/auth/`, action Block.
6. **CI** (optional, `.github/workflows/cloudflare.yml`): add repository secret
   `CLOUDFLARE_API_TOKEN` (Workers, D1, R2 edit), variable `CLOUDFLARE_ACCOUNT_ID`, a
   `uat` environment, and a `production` environment with required reviewers.

## 4. UAT

Already done on 2026-11-19: D1 created and migrated (`0001`, `0002`), secrets set, Worker
deployed with its cron trigger. After section 3:

```bash
npm run cf:deploy:uat
ADMIN_BOOTSTRAP_PASSWORD='12+ chars' node scripts/create-admin-d1.mjs --remote --env uat you@vastuvihar.org "Your Name" SUPER_ADMIN
```

UAT sign-off checklist: home, projects, cities, price lists, blog, gallery and careers
pages; contact and project enquiry forms; careers application with a CV upload, then the
CV download in the admin; blog post with an image; gallery upload and removal; cookie
banner (no tracker loads before consent); privacy request; admin roles; retention dry run;
an attempt to reach `/admin/login/` without Access (must be 403).

## 5. Moving the data from Lightsail

Prisma on Node.js stores dates as integers, Prisma on D1 stores ISO text and cannot read
integers ("Inconsistent column data"). Never import a plain SQLite dump.
`scripts/export-sqlite-to-d1.mjs` converts every date column; it was tested by exporting
a populated database, importing it into a fresh local D1 and reading every model back.

Rehearse on UAT first, then repeat for production at cutover:

```bash
# On Lightsail: a consistent copy of the database and the upload folders.
sqlite3 /var/www/vastuvihar-website/prisma/<db file> ".backup /tmp/vv.db"
tar czf /tmp/vv-files.tgz -C /var/www/vastuvihar-website storage/private/resumes public/uploads
# Copy both to a private folder on your machine, then:
npm run migrate:export -- ./vv.db ./vv-import.sql
npx wrangler d1 execute DB --remote --env uat --file ./vv-import.sql      # UAT rehearsal
node scripts/upload-files-to-r2.mjs ./vv-files --env uat                  # needs R2
# Check row counts against Lightsail, sign in, open a few enquiries and a CV.
```

Notes: the target must be freshly migrated and **empty** (to redo, recreate the UAT
database). Admin sessions are not copied, so everyone signs in again. The export and the
tarball hold personal data: keep them off shared drives and delete them afterwards.

## 6. Production cutover

1. **Before the day.** Section 3 done; UAT signed off with a rehearsed import. Add
   `vastuvihar.org` to this Cloudflare account with its existing DNS records still
   pointing at Lightsail, change the nameservers at the registrar, and wait until the zone
   is active. Lower the TTL of the site records to 300 s. Create the production Access
   application and put its AUD in `wrangler.jsonc`. Commit; run
   `npm run cf:preflight:production` until it passes (secrets need the Worker to exist:
   run `npx wrangler secret put` first, which creates it).
2. **Upload without traffic:** `npm run cf:upload:production` (or the manual CI job).
   This applies D1 migrations, then uploads a version. Production D1 today has only
   `0001` applied, so `0002_gallery_images` runs here. Migrations must only add things,
   so the live version keeps working with the new schema.
3. **Freeze Lightsail writes** (maintenance page, or stop the PM2 app briefly), take the
   final database and files copy, then run the import from section 5 with no `--env`.
   Compare row counts.
4. **Promote and route:** `npx wrangler versions deploy <version-id>@100% -y`, then
   Workers & Pages > `vastuvihar-website` > Settings > Domains & Routes > add the custom
   domains `vastuvihar.org` and `www.vastuvihar.org`. Turn on SSL/TLS > Edge
   Certificates > *Always Use HTTPS*.
5. **Verify** within 15 minutes: the UAT checklist on production, one real enquiry,
   `/admin/` asks for Access, `robots.txt` allows indexing, the sitemap lists real URLs,
   Workers observability shows no errors.
6. Keep Lightsail running, untouched, for two weeks. Disable its auto-deploy
   (`.github/workflows/deploy.yml`) only after that.

## 7. Rollback

| What went wrong | Action | Time |
|---|---|---|
| New code is broken | `npx wrangler rollback` (or `wrangler versions deploy <previous-id>@100%`) | under a minute |
| A migration or import damaged data | `npx wrangler d1 time-travel info DB` to find a bookmark, export current rows you need (`wrangler d1 export DB --remote`), then `wrangler d1 time-travel restore DB --bookmark=<id>` | minutes; later writes are lost |
| Cloudflare cutover must be undone | Remove the Worker's custom domains, put back the A/CNAME records for Lightsail, unfreeze Lightsail. Then export enquiries, applications, consent records and privacy requests created on D1 since cutover and add them to Lightsail by hand, so no submission is lost | 5–15 minutes plus DNS TTL |

Time Travel keeps 30 days of D1 history on the paid plan. Record a bookmark before every
migration or import (`wrangler d1 time-travel info DB`). R2 objects are only ever added
by these procedures, so they need no rollback.

## 8. Operations

- Logs: Workers & Pages > Worker > Observability (`observability.enabled`).
- Retention runs daily at 02:00 IST (`triggers.crons`). It deletes nothing until periods
  are approved in Admin > Privacy > Retention.
- Pages that read the database render on each request (`dynamic = 'force-dynamic'`);
  the build output cache is read-only (`open-next.config.ts`). Do not add `revalidate`.
- `proxy.ts` runs as Node.js middleware, which OpenNext marks experimental on Cloudflare.
  It passed every test here; re-test admin access after upgrading OpenNext or Next.js.
