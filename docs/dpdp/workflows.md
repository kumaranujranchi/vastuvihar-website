# Consent, rights and grievance workflows (deliverables 3 to 6)

## Consent

**Where the wording lives:** `lib/privacy/notices.js`. Change any wording and you must change `NOTICE_VERSION`, because that version is stored with every consent as proof of what was shown.

**How consent is given:**

1. Each form shows a notice in English or Hindi, with links to the policy and rights page.
2. The person ticks an unticked box. The server rejects the submission without it.
3. On enquiry forms, marketing is a second, optional, unticked box. An enquiry works without it.
4. An append-only `ConsentRecord` stores purpose, action, notice version, language, source and time. Contact details are kept only as keyed hashes, so the proof can outlast erasure of the enquiry.

**Cookies:** the banner, `ConsentEmbed`, the policy page controls and `TrackingTags` share one stored choice (`lib/privacy/cookieChoices.js`). A choice made under an older notice version is ignored, so the person is asked again. The banner also returns when a new category is switched on.

- **Videos and maps:** frames do not render until allowed, and are removed as soon as the choice is off.
- **Analytics, advertising and remarketing:** a category is offered only if its tag ID is set (see `.env.example`). Until then no tag loads, the policy does not mention it and the Content Security Policy does not allow its hosts. Tags load only from `lib/privacy/tags.js`, only after consent. Turning a category off stops the tag and clears its cookies on this site's domain. Enquiry conversions report only that an enquiry happened, never what was typed.
- **Cookie log:** each save adds one `ConsentRecord` per answered category, keyed by a hash of the browser's random consent ID. It holds no contact details or IP address. Staff read and export it under Privacy & Compliance, Cookie log. Exports are audited.

**Newsletter:** the footer form shows the notice and an unticked box. Staff with `newsletter:manage` see the list under Privacy & Compliance, Newsletter. The website sends no email, so staff download a fresh list immediately before each send. The download leaves out anyone unsubscribed or suppressed.

**Children:** the site is for adults, and each form asks the person to confirm they are 18 or older. That is not verifiable parental consent, so there is deliberately no route for a child to submit. See `outstanding-items.md`.

## Withdrawing consent

| What | How | Check needed | Effect |
|---|---|---|---|
| Marketing and newsletter | Rights page, "Stop marketing" | None. The answer is the same whether or not the contact exists | Immediate: lead flags cleared, newsletter entry unsubscribed, opt-out recorded, suppression added, connectors called |
| Any cookie category | Cookie Preferences in the footer, or the policy page | None | Frames removed or tags stopped immediately, withdrawal recorded |
| All consent | Rights page, "Withdraw my consent" | Identity | Withdrawal recorded per purpose, marketing stopped, open enquiries closed. Staff then erase, unless a legal hold applies |

Opt-outs are checked by `isSuppressed()` in `lib/privacy/consent.ts`, and an opt-out wins over a later form tick, because a form cannot prove who is typing. **Any future campaign or marketing export must also call it.** Nothing sends marketing from this website today.

**Limitation:** there is no screen for lifting an opt-out if someone genuinely wants marketing again. For now, a developer removes the suppression after verifying the person.

## Access, correction and erasure

The person submits the form on `/privacy-rights` and gets a ticket number and a target date. They can check progress with the ticket number plus the matching contact. Progress is all that page ever shows.

Staff work in **Admin > Privacy & Compliance > Rights requests**:

1. **Verify identity.** Contact the person on details already in your records. Tick the email or phone you confirmed belongs to them, and record how. **Data is matched only on what you tick**, so someone cannot reach another person's records by adding that person's number to the form. Until then, staff see only match counts, and every data action returns an error.
2. **Act:**
   - **Access:** Generate the summary (data held, consent history, activities, recipients) and send it to the verified contact. The summary is not stored.
   - **Correction:** Apply the change. This updates enquiries, applications and comments, and re-keys the consent ledger so the history stays linked.
   - **Erasure:** Check for anything the law requires you to keep, and place a legal hold on it with the reason. Then erase. This deletes enquiries, applications, resume files and comments, and records what was kept and why.
3. **Close** with an outcome. Each step is timed and attributed on the ticket, and also in the audit log. Closed tickets are locked, so a new request needs a new ticket.

Each data action works only on its own request type: a summary on an access request, a correction on a correction request, and erasure on an erasure or consent withdrawal request.

**Backups and logs:** erasure cannot reach existing backups or server logs. They must expire on a documented schedule. See `retention-plan.md`.

## Nomination

A person submits a nominee through the rights page. A nominee can later submit a request and mark it as acting for that person. **Staff must check authority before acting**, for example against a death certificate or evidence of incapacity, with the original nomination. This is a manual step and needs legal sign-off.

## Grievances

Same form, with a category and a `GRV-` ticket. They have a separate queue with counts for received, in progress, escalated and resolved, and overdue tickets are highlighted. Every response goes on the ticket. The deadline is set in **Retention > Deadlines**, and the published contact is in `data/privacy/processors.js`.

## Roles

| Role | Can do |
|---|---|
| SUPER_ADMIN | Everything, including staff accounts |
| PRIVACY_OFFICER | Rights requests, grievances, breach register, retention, audit log, comment moderation. Reads leads and applications, and cannot export |
| SALES | Read, update and export leads |
| HR | Applications, resumes and job openings |
| CONTENT | Blog posts and comment moderation |

Defined in `lib/adminAuth.ts`, and enforced on every admin API call rather than only in the UI.
