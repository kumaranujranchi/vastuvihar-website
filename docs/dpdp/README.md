# DPDP Act 2023: implementation record

How this website handles the developer checklist. **This is an engineering record, not legal advice.** The site supports compliance, and the items in `outstanding-items.md` must be settled before it can be relied on.

## Deliverables

| # | Deliverable | Where |
|---|---|---|
| 1 | Pages, forms, scripts and integrations | `data-inventory.md` |
| 2 | Personal data and purposes | `data-inventory.md` |
| 3 | Privacy policy and consent notices | `/privacy-policy`, `lib/privacy/notices.js` |
| 4 | Consent and withdrawal workflow | `workflows.md` |
| 5 | Access, correction and erasure workflow | `workflows.md` |
| 6 | Grievance workflow | `workflows.md` |
| 7 | Security details and tests | `security.md`, `test-report.md` |
| 8 | Retention and deletion plan | `retention-plan.md` |
| 9 | Data Processors and integration changes | `data-inventory.md`, `data/privacy/processors.js` |
| 10 | Test report | `test-report.md` |
| 11 | Items needing approval | `outstanding-items.md` |
| Extra | Breach runbook | `breach-response.md` |

## Checklist status

**Built** means the mechanism exists and has been tested. **Needs you** points to a decision or action outside the code.

| § | Requirement | Status | Implementation | Needs you |
|---|---|---|---|---|
| 1 | Privacy Policy | Built | `app/privacy-policy/page.jsx`, rewritten to match actual behaviour | Legal approval, officer's name |
| 2 | Consent management | Built | `ConsentFields`, `ConsentRecord`, `lib/privacy/consent.ts` | Wording approval, other languages |
| 3 | Forms | Built | All 4 public forms audited and updated | Field decisions |
| 4 | Separate marketing consent | Built | Optional box, opt-out page, suppression list | Treatment of old leads |
| 5 | Cookie and tracking audit | Built | No trackers found. Videos and maps gated | None |
| 6 | Access requests | Built | `/privacy-rights`, access summary | Identity check is manual |
| 7 | Correction | Built | Request form, verified correction across stores | None |
| 8 | Erasure | Built | Verified erasure, legal holds, recorded outcome | Backup policy |
| 9 | Grievances | Built | Tickets, queue, configurable deadline, published contact | Monitoring, officer's name |
| 10 | Security | Built | See `security.md` | Server setup, MFA decision |
| 11 | Breach management | Built | Register, drafts, tracking, runbook | Name the team, run a drill |
| 12 | Retention | Built, inactive | Scheduled job, previews, logs. Off until periods are approved | **Approve periods** |
| 13 | CRM and integrations | Built | Inventory and connector hook. No CRM exists | Processor contracts |
| 14 | Children | Assessed | Adult-only site with an age confirmation. No parental flow | Legal view |
| 15 | Sharing and accuracy | Built | Validation, export audit, recipient inventory | None |
| 16 | Nomination | Built | Request type, stored details | Verification rules |
| 17 | Admin panel | Built | `/admin/privacy`, 5 roles, audit log | Assign staff roles |
| 18 | Testing | Done | `test-report.md` | Repeat on the real host |
| 19 | Deliverables | Done | This folder | None |
| 20 | Instructions | Followed | Backend, database and integrations were all reviewed | Legal coordination |

## Running it

Stop any running dev server first, because Windows locks the Prisma engine file.

```
npm install
```

```
npm run cf:migrate:local
ADMIN_BOOTSTRAP_PASSWORD='choose-12-or-more-characters' npm run admin:create -- --local you@vastuvihar.org "Your Name" SUPER_ADMIN
npm run dev
```

Sign in at `/admin/login` with that email and password. The old shared password no longer works.

## Testing

**`npm run test:dpdp` needs porting to D1.** It reads and checks a SQLite file and a resume folder directly, and the site now uses D1 and R2 instead, so it cannot run as written. Until it is ported, test these flows by hand on a local build (`npm run build && npm run start`).

The suite creates and erases records and accounts, so it refuses to run against anything but localhost.

## When something changes

| Change | Also do |
|---|---|
| Consent wording | Raise `NOTICE_VERSION` in `lib/privacy/notices.js` |
| New form | Use `ConsentFields`, call `recordConsent`, and add it to `data-inventory.md` |
| New tracking script or embed | Put it behind consent, update the CSP in `next.config.mjs`, and update the inventory and policy |
| New CRM or marketing tool | Add it to `lib/privacy/connectors.ts` and `data/privacy/processors.js`, sign a contract, and check `isSuppressed` before sending marketing |
| New table with personal data | Add it to `lib/privacy/dataSubject.ts` and `lib/privacy/retention.ts` |
