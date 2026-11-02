# Test report (deliverable 10)

**Run:** 2 November 2026, on a production build of the working tree, in an isolated copy with a throwaway database.
**Result: all 93 checks passed (82 API and data, 11 real browser).** Type-check and `scripts/verify.mjs` also passed, and `npm audit --omit=dev` reported 0 vulnerabilities.

Re-run the API suite with `npm run test:dpdp` (see `README.md`). The browser checks were run with a Playwright script kept outside the repository, using local Chrome, so they are not yet part of the repository's tooling.

## Independent review

A separate code review found defects the first test run had missed. All of those below were fixed, and the main ones now have regression tests.

| Severity | Finding | Fix |
|---|---|---|
| High | Verifying one contact unlocked records under another contact on the same request | Staff record which contact they confirmed, and only that contact is matched |
| High | Phone suffix matching could treat different people's numbers as one | Full normalised comparison |
| High | A form tick could undo someone else's opt-out | An opt-out now wins over a form tick |
| Medium | Older records with spaces in phone numbers were missed by erasure | Numbers are normalised before comparing |
| Medium | Erasure could run on any verified request, even a closed one | Actions are limited by request type, and closed requests are locked |
| Medium | Clearing old technical data ignored holds and restarted the retention clock | Holds respected, timestamp preserved |
| Medium | Retention could delete proof of consent for a live record | Proof is kept while its record exists |
| Medium | Failures could leave partial state with a misleading message | Row deletion is transactional, holds rechecked, failures logged per category |
| Low | Account lockout and duplicate enquiries revealed information, plus smaller gaps | Uniform responses, and the remaining items were fixed |

**Accepted, not fixed:** the rate limit can be bypassed if the site runs without a reverse proxy, because it relies on proxy-set headers. The proxy is a deployment requirement in `security.md`.

## Not tested

These need the real environment, or a person:

- HTTPS, certificates and proxy headers on the real host. The redirect logic was tested only with a simulated header.
- Rate limiting and client IP detection behind a real proxy.
- Backups and restore.
- Propagation to a CRM or marketing tool, as none is connected. Only the hook exists.
- Actual delivery of breach notices or request responses, which staff send by hand.
- The Hindi wording, for accuracy.
- Whether any of this satisfies the law. That needs legal review.

## API and data checks

| Area | Check | Result |
|---|---|---|
| Regression | / loads | Pass |
| Regression | /contact/ loads | Pass |
| Regression | /projects/ loads | Pass |
| Regression | /careers/ loads | Pass |
| Regression | /careers/apply/ loads | Pass |
| Regression | /privacy-policy/ loads | Pass |
| Regression | /privacy-rights/ loads | Pass |
| Regression | /terms-and-conditions/ loads | Pass |
| Regression | /blog/ loads | Pass |
| Notices | Contact form shows a notice and unticked consent boxes, with Hindi available | Pass |
| Notices | Footer links to the policy and rights page, and the rights page names the privacy contact | Pass |
| Notices | Policy no longer claims MFA or analytics the site does not have | Pass |
| Tracking | No third-party frame or tracking script in the server-rendered pages | Pass |
| Consent | An enquiry without consent is rejected and nothing is stored | Pass |
| Consent | An enquiry with consent succeeds without marketing consent | Pass |
| Data minimisation | Form fields are stored, and IP and browser details are not | Pass |
| Data minimisation | Only name and phone are mandatory on an enquiry | Pass |
| Consent | The consent record holds purpose, version, language and time, in hashed form | Pass |
| Marketing | Marketing consent is separate and recorded on its own | Pass |
| Marketing | Opt-out updates the record, adds a suppression and logs a withdrawal | Pass |
| Marketing | Opt-out gives the same answer for an unknown contact | Pass |
| Consent | Media consent is logged without contact data | Pass |
| Forms | An application without consent is rejected | Pass |
| Security | A file disguised as a PDF is rejected | Pass |
| Security | A resume over 5MB is rejected | Pass |
| Forms | A valid application is stored with a private, nameless resume path | Pass |
| Security | Resumes cannot be fetched from the public folder or without signing in | Pass |
| Security | Authorised resume download works, forces a download and is audited | Pass |
| Security | Blog HTML is sanitised when saved | Pass |
| Security | Unsafe blog HTML already in the database is cleaned on render | Pass |
| Forms | A comment needs consent, and stays hidden until approved | Pass |
| Admin | Approving a comment publishes it, without exposing the email | Pass |
| Security | Old public endpoints are gone | Pass |
| Security | All 16 admin endpoints refuse anonymous callers | Pass |
| Security | The old hard-coded admin password no longer works | Pass |
| RBAC | A SALES account can be created and sign in | Pass |
| RBAC | A HR account can be created and sign in | Pass |
| RBAC | A CONTENT account can be created and sign in | Pass |
| RBAC | A PRIVACY_OFFICER account can be created and sign in | Pass |
| RBAC | Permission matrix holds across 14 role and endpoint pairs | Pass |
| RBAC | Disabling an account ends its session immediately | Pass |
| Security | Five wrong passwords lock the account, even for the right password | Pass |
| Security | Login errors do not reveal whether an account exists | Pass |
| Security | Session cookie is HttpOnly and SameSite, and sign-out invalidates it on the server | Pass |
| Security | Cross-site POSTs are rejected on public and admin endpoints | Pass |
| Security | Blog uploads refuse SVG and files that are not images | Pass |
| Security | Security headers are present and the framework header is hidden | Pass |
| Security | HTTP requests redirect to HTTPS behind a proxy | Pass |
| Security | Admin pages redirect when signed out and are marked noindex | Pass |
| Security | Bad input is rejected | Pass |
| Security | A spoofed source value is not stored | Pass |
| Security | CSV export neutralises spreadsheet formulas, omits IP and is audited | Pass |
| Security | Repeated enquiries from one address are rate limited | Pass |
| Access | A request gets a unique ticket and a response deadline | Pass |
| Access | A request needs a contact detail | Pass |
| Access | Status lookup needs the matching contact and reveals no personal data | Pass |
| Access | Staff cannot read or change data before identity is verified | Pass |
| Access | Verification needs a recorded method, and a summary then covers data, consent and recipients | Pass |
| Access | Every step is recorded on the request, and closing needs an outcome | Pass |
| Correction | A verified correction updates every store and keeps the consent ledger linked | Pass |
| Withdrawal | Consent withdrawal stops marketing, records each purpose and closes open enquiries | Pass |
| Erasure | Erasure removes enquiries, applications, resumes and comments, and keeps only hashed consent | Pass |
| Erasure | A legal hold keeps the record, and the outcome records the exception | Pass |
| Identity | Verifying one contact never reaches records under the other | Pass |
| Identity | Numbers sharing the same last digits are different people, and format variants are the same person | Pass |
| Identity | Data actions apply only to the matching request type, and closed requests are locked | Pass |
| Marketing | A form tick cannot undo an opt-out | Pass |
| Marketing | Opting out by email also covers the phone on the same enquiry | Pass |
| Security | A repeat enquiry looks the same as a first one | Pass |
| Grievance | A grievance gets its own ticket, category, deadline and queue, and can be escalated | Pass |
| Grievance | The response deadline can be configured | Pass |
| Nomination | A nomination needs the nominee details, and stores them | Pass |
| Breach | An incident gets a reference and a deadline, and notifications are tracked | Pass |
| Breach | Only permitted roles can open the register | Pass |
| Retention | Without an approved period nothing is deleted, however old the record | Pass |
| Retention | Approving a period requires a recorded basis | Pass |
| Retention | Preview changes nothing, a real run deletes expired records and keeps held, recent or converted ones | Pass |
| Retention | Clearing old technical data respects holds and does not restart the retention clock | Pass |
| Retention | Old proof of consent is kept while its record is live | Pass |
| Retention | An expired application also loses its resume file | Pass |
| Retention | The scheduled endpoint refuses callers without the secret | Pass |
| Audit | Administrative actions are logged without personal data | Pass |

**82 passed, 0 failed, 82 total.**

## Browser checks

| Area | Check | Result |
|---|---|---|
| Browser | Home page contacts no third party before a choice, and the banner has the toggle off | Pass |
| Browser | Closing the banner without choosing keeps everything off | Pass |
| Browser | Rejecting keeps videos off across a reload, with the poster showing | Pass |
| Browser | Accepting loads the video, and withdrawing from the footer removes it immediately | Pass |
| Browser | A choice made under the old pre-ticked banner is not honoured | Pass |
| Browser | Contact map stays behind a placeholder until allowed, then loads without CSP errors | Pass |
| Browser | The contact form blocks submission until consent is ticked, then saves with the chosen language | Pass |
| Browser | The rights page takes a grievance and shows a ticket, on a phone-sized screen with no sideways scroll | Pass |
| Browser | Staff can sign in by email, see a request and work it through the privacy console | Pass |
| Browser | A signed-in sales account sees only its own tabs | Pass |
| Browser | No page breaks the Content Security Policy | Pass |

**11 passed, 0 failed, 11 total.**
