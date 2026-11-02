# Data inventory (deliverables 1, 2 and 9)

Everything the website collects, where it goes, and why. Update this file and `data/privacy/processors.js` before adding a form, script or integration.

## Forms and pages that process personal data

| Form or page | Route | Component | Data | Mandatory | Purpose | Lawful basis (for legal review) | Stored in |
|---|---|---|---|---|---|---|---|
| Contact | `/contact` | `components/contact/ContactSection.jsx` | Name, phone, email, message | Name, phone | Respond to the enquiry | Consent | `Lead` |
| Project enquiry | `/projects/[slug]` | `components/projects/ProjectEnquiry.jsx` | As above, plus preferred city, budget, project | Name, phone, city | Respond to the enquiry | Consent | `Lead` |
| Marketing opt-in | Both enquiry forms | `components/privacy/ConsentFields.jsx` | Yes or no, with time | No | Promotional calls, SMS, WhatsApp, email | Separate consent | `Lead`, `ConsentRecord` |
| Job application | `/careers/apply` | `app/careers/apply/page.tsx` | Name, email, phone, position, experience, resume, note | Name, email, phone, position, resume | Assess the application | Consent | `JobApplication`, private folder |
| Blog comment | `/blog/[slug]` | `app/blog/CommentForm.tsx` | Name, comment, email | Name, comment | Moderate and publish the comment | Consent | `Comment` |
| Rights request or grievance | `/privacy-rights` | `components/privacy/RightsCentre.jsx` | Name, phone or email, details, corrections, nominee | Name, details, one contact | Handle the request | Legal obligation | `PrivacyRequest` |
| Marketing opt-out | `/privacy-rights` | `components/privacy/RightsCentre.jsx` | Phone or email | Yes | Stop marketing | Withdrawal of consent | Hash only |
| Cookie banner | All pages | `components/CookieConsent/CookieConsent.tsx` | Random browser ID, choice | No | Remember and evidence the choice | Consent | Browser, hash in `ConsentRecord` |
| Staff sign-in | `/admin/login` | `app/admin/login/page.tsx` | Staff email, password hash | Yes | Access control | Employment | `AdminUser`, `AdminSession` |

**Not on this website:** newsletter, callback, site visit or account registration forms, and any chat widget. Booking KYC (PAN, Aadhaar, bank details) is collected offline and sits outside this codebase, so it needs its own review.

**Unused code:** `components/common/ContactForm.jsx` has no consent controls. Nothing renders it. Delete it or add `ConsentFields` before using it.

## Data categories

| Category | Fields | Purpose | Who can see it |
|---|---|---|---|
| Enquiry contact | Name, phone, email | Respond to the enquiry | SALES, SUPER_ADMIN, PRIVACY_OFFICER |
| Property preference | City, budget, project, message | Respond to the enquiry | Same as above |
| Applicant | Name, phone, email, position, experience, note | Recruitment | HR, SUPER_ADMIN, PRIVACY_OFFICER |
| Resume | File, which can hold anything the applicant included | Recruitment | Same as above, through an audited download |
| Comment | Name and comment (public once approved), email (never public) | Publishing comments | CONTENT, PRIVACY_OFFICER, SUPER_ADMIN |
| Rights request | Name, contact, details, nominee | Handling the request | PRIVACY_OFFICER, SUPER_ADMIN |
| Consent ledger | Keyed hash of contact, purpose, version, language, time | Evidence of consent | PRIVACY_OFFICER, SUPER_ADMIN (hashes are not displayed) |
| Rate limiting | Keyed hash of IP, purged after 24 hours | Abuse prevention | Nobody through the UI |
| Staff | Name, email, role, last sign-in | Access control | SUPER_ADMIN |
| Legacy technical data | IP, country, browser on older leads | None now | Hidden from staff, included in access summaries |

## Scripts and tracking audit

| Technology | Found? | Data | Legal basis | Control |
|---|---|---|---|---|
| Google Analytics 4 | No | n/a | n/a | n/a |
| Google Tag Manager | No | n/a | n/a | n/a |
| Meta Pixel | No | n/a | n/a | n/a |
| Ad conversion and remarketing tags | No | n/a | n/a | n/a |
| Heatmaps and session recording | No | n/a | n/a | n/a |
| Third-party chat widget | No | n/a | n/a | n/a |
| YouTube (home hero) | Yes | IP, browser, cookies | Consent | Local image until consent |
| YouTube (project video) | Yes | IP, browser, cookies | Consent | `ConsentEmbed` |
| YouTube and Vimeo (lightbox) | Yes | IP, browser, cookies | Consent | `ConsentEmbed` |
| Google Maps (contact, branches) | Yes | IP, browser, cookies | Consent | `ConsentEmbed` |
| Google Fonts or other external CSS | No | n/a | n/a | Fonts are self-hosted |
| Outbound links (social, Maps directions, `wa.me`) | Yes | Sent only when clicked | Visitor's action | None needed |

The Content Security Policy in `next.config.mjs` blocks scripts and connections to anywhere else. A new tag will not load until its host is deliberately added, which is the prompt to add it here and put it behind consent.

## Recipients

See `data/privacy/processors.js`, shown in the admin panel under **Data sharing**.

| Recipient | Role | Data | When | Contract status |
|---|---|---|---|---|
| Hosting provider | Data Processor | All form data | Always | **Host not chosen. Contract needed.** |
| Google (YouTube, Maps) | Independent third party | IP, browser, cookies | After consent | Standard terms |
| Vimeo | Independent third party | IP, browser, cookies | After consent | Standard terms |
| WhatsApp (Meta) | Independent third party | Enquirer's name and phone | When sales staff click the button | **Decision needed** |

**No CRM, email, SMS or WhatsApp platform is connected.** Because of this, propagation is a registered hook with no connectors yet (`lib/privacy/connectors.ts`). Any new platform must be added there so opt-outs, corrections and erasure reach it.

**Removed:** `ip-api.com` (sent visitor IPs over plain HTTP on every enquiry) and `/api/chat` (public, stored messages, could forward them to Google Gemini; no page used it).
