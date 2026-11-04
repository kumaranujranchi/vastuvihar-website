# Items needing business, legal or compliance approval (deliverable 11)

The code provides the mechanisms. These decisions belong to the organisation, and legal review is needed for the website to meet the acceptance criterion in practice.

## Must be settled before launch

| # | Item | Why | Owner |
|---|---|---|---|
| 1 | **Approve all notice and consent wording**, in `lib/privacy/notices.js` and `app/privacy-policy/page.jsx` | Drafted by the developer, not legally reviewed | Legal |
| 2 | **Have the Hindi text reviewed** | Written without a professional translator or legal review | Legal |
| 3 | **Approve retention periods** in the admin panel | Nothing is deleted until you do. The policy already promises a 24-month limit on enquiries, which is **not enforced until `LEAD` is approved** | Legal, Business |
| 4 | **Appoint and name the privacy contact**, in `data/privacy/processors.js` | Only a title is published. Check whether the Act requires more of you | Business, Legal |
| 5 | **Confirm `privacy@` and `complaint.officer@vastuvihar.org` exist and are monitored** | They are published and the site cannot confirm they work. The website sends no email, so **staff must check the admin queue daily** | IT |
| 6 | **Choose a host and sign a data processing contract** | Required for Data Processors, and the policy names a host generically | Business, Legal |
| 7 | **Name the breach response team** in `breach-response.md` | Blank | Business |
| 8 | **Confirm the lawful basis for each activity** in `data-inventory.md` | Those entries are proposals | Legal |
| 9 | **Confirm the response deadlines** | 30 days comes from your existing policy. I could not confirm the statutory limit for grievances. The 72-hour Board report comes from secondary sources, not the rule text | Legal |
| 10 | **Clean up `prisma/dev.db`** (see below) | It may hold personal data and is in git history | Developer, Legal |

## `prisma/dev.db`

This database file is tracked in git and has rows (3 leads, 1 job application, 1 comment). Its contents were not inspected, and it was left in place at the owner's direction because it was unclear whether it holds real data.

1. Find out whether the rows are real. If they are, **record this in the breach register** and assess it, because anyone with repository access can read them.
2. Move local development to a separate file (`prisma/local.db` is already ignored) by changing `DATABASE_URL` in `.env`.
3. Remove it from tracking: `git rm --cached prisma/dev.db`, and add it to `.gitignore`.
4. To remove it from history, rewrite the history and force-push. This affects everyone with a clone, so coordinate it first. Treat copies in existing clones as still exposed.

The old admin password (`lib/adminAuth.ts` before this work) also remains in git history. It no longer works, but do not reuse it anywhere.

## Business decisions

| # | Decision | Current state |
|---|---|---|
| 11 | **Home page hero:** visitors now see a still image until they allow videos and maps | Needed to meet consent, and the policy already promised this. Accepted visitors get the video as before |
| 12 | **Form fields made optional:** email on enquiry forms and comments, budget on project enquiries | Done to collect only what is needed. Restore any you can justify as necessary |
| 13 | **Comments now need approval** | The site already told users this. Someone must moderate the queue |
| 14 | **WhatsApp replies by sales staff** | The button remains, and it puts customer data on staff phones. Allow with rules, or remove |
| 15 | **Marketing to existing leads** | Old leads have no recorded marketing consent, so they show as "No marketing" |
| 16 | **Older leads have no consent record** | Decide whether to re-seek consent or delete them. Migration does not create consent that was never recorded |
| 17 | **Staff names and mobile numbers** in `data/branch-contacts.js` | Published personal data of employees. Confirm they agreed, or use office numbers |
| 18 | **MFA** for SUPER_ADMIN and PRIVACY_OFFICER | Not built. Strongly recommended |
| 19 | **Automatic email or SMS:** ticket confirmations, identity checks by one-time code | Not built, because no provider exists. Staff handle this manually. **Also means a form cannot prove a number belongs to the person typing it,** so someone could opt another person in to marketing. Consider a one-time code on the marketing box before sending any campaign |

## Before switching on analytics or remarketing tags

Setting a tag ID in the environment makes the tag live for anyone who allows it. First:

| # | Item | Why | Owner |
|---|---|---|---|
| A | **Approve the cookie wording**, including the tag sections that appear in the policy once an ID is set | Drafted by the developer, not legally reviewed | Legal |
| B | **Accept and review each provider's terms**, then update `role` and `contract` in `data/privacy/processors.js` | Marked as pending | Legal, Business |
| C | **Decide how remarketing fits the children rule** | The banner has no age confirmation. The policy says no tracking or targeted advertising is directed at children, relying on the site being directed at adults. Exclude under-18s in the ad platform settings too | Legal |
| D | **Open the live site with real IDs and check the browser console and cookie list** | The Content Security Policy hosts follow the providers' published needs, and were not tested against real accounts. Check that `COOKIE_INVENTORY` in `lib/privacy/cookieConfig.js` matches what is set | Developer |
| E | **Approve the visitor activity wording and Hindi text**, and whether linking an ad source to an enquiry is acceptable | The ad source sits beside a name and phone number on the enquiry, so it is personal data there. Drafted by the developer, not legally reviewed | Legal |
| F | **Approve a `VISITOR_EVENT` retention period** in Admin > Privacy & Compliance > Retention | Until one is approved, visitor activity is kept indefinitely unless the visitor withdraws | Legal, Business |

## Legal questions

| # | Question | Note |
|---|---|---|
| 20 | **Which obligations apply, and from when?** | Sources report the Rules were notified in mid-November 2025, with substantive obligations after 18 months (around May 2027) and Consent Manager registration after 12. This is from secondary sources, so verify it |
| 21 | **Other Eighth Schedule languages** | The Act offers notices in English or any Schedule language. The site has English and Hindi, and offers others on request. Confirm this is enough |
| 22 | **Children** | The site asks people to confirm they are 18 or older and has no parental consent flow. A self-declaration is not verifiable consent, so it works only if the site is truly not offered to children. Job applicants under 18 should be considered |
| 23 | **Significant Data Fiduciary status** | If notified as one, extra duties apply, including a Data Protection Officer. The policy uses that title, so check it is accurate |
| 24 | **Cross-border transfers** | Google, Vimeo and WhatsApp may process data abroad. Check against any government restrictions |
| 25 | **Nominee verification** | What evidence is enough to accept a nominee? |
| 26 | **Consent versus "legitimate use" for enquiries** | Section 7(a) may cover data given voluntarily for a specific purpose. Consent was used as the stricter choice. Legal may prefer otherwise |
| 27 | **Legacy statements in the policy** | Booking KYC, 8-year retention and the section citations were kept from the earlier policy, and were not independently verified |

## Not in this codebase

Offline booking and KYC data, staff devices and email accounts, and any sales tools used outside the website need the same review.

## Sources

Commencement and breach details came from secondary legal summaries, not the gazette text:

- [Mondaq: DPDP Rules 2025 notified](https://www.mondaq.com/india/data-protection/1708164/digital-personal-data-protection-rules-2025-notified)
- [Hogan Lovells: DPDP Act brought into force](https://www.hoganlovells.com/en/publications/indias-digital-personal-data-protection-act-2023-brought-into-force-)
- [KS&K: DPDP data breach notification timeline](https://ksandk.com/md/data-protection-and-data-privacy/dpdp-data-breach-notification-timeline/)
