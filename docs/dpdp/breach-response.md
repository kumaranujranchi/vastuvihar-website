# Personal data breach response

**Draft for legal approval.** Confirm the deadlines and format against the current DPDP Rules, 2025 before relying on them. The website records and tracks an incident: people still have to make the notifications.

## Who does what

Name these people before launch, and keep their numbers somewhere that works if the website is down.

| Role | Responsibility | Person |
|---|---|---|
| Incident lead | Runs the response and decides on notification | **To appoint** |
| Technical lead | Contains, investigates and fixes | **To appoint** |
| Legal contact | Confirms obligations and approves notices | **To appoint** |

## What counts

Any unauthorised access, disclosure, alteration, loss or destruction of personal data. For example: a lost laptop holding a lead export, a leaked admin password, a wrongly emailed spreadsheet, or a server compromise. **If unsure, record it.**

## Steps

### 1. Record it: immediately

In **Admin > Privacy & Compliance > Breach register**, enter a short title and select **Record incident**. This starts the clock and sets the Board report target. Tell the incident lead straight away.

If the admin panel is unavailable, keep notes with timestamps and enter them afterwards.

### 2. Contain it

Log each action in the incident, with the time.

| Situation | Action |
|---|---|
| Staff account compromised | Staff access: disable the account, which ends its sessions |
| Password reused or widely exposed | Reset all staff passwords |
| Server compromised | Take the site offline, preserve evidence, restore to a clean server |
| Secrets exposed | Rotate `RETENTION_CRON_SECRET`, and treat `PRIVACY_HASH_SECRET` as exposed. Rotating that one breaks links in the consent ledger, so take legal advice first |
| Lost export or device | Remote wipe if possible, and check the audit log for what was exported |

### 3. Assess it

Fill in the nature, scope, data affected, number of people, and likely consequences. Useful evidence:

- **Audit log:** `lead.exported`, `application.resume_downloaded`, `admin.login_failed`, `admin.account_locked`.
- **Server and proxy logs.**
- **Database:** identify who is affected by searching on the time window or data involved.

### 4. Notify

As reported at the time of writing, Rule 7 of the DPDP Rules, 2025 requires:

- **Affected people:** without delay, through their registered contact details. No exception for severity has been confirmed, so check this.
- **Data Protection Board:** an initial intimation without delay, and a detailed report within 72 hours of becoming aware, unless the Board allows longer.

Rule 7 is understood to fall within the 18-month commencement group (around May 2027). Confirm with your legal adviser. Follow this process now in any case.

The incident screen drafts both documents from what you have entered: **Draft notice to people** and **Draft Board report**. Legal should approve them before they go out. The website has no email or SMS service, so send notices through your own channels.

Record the time, count and reference for each notification on the incident. The register highlights a missed Board target.

### 5. Fix and close

Record the root cause and fixes. Review whether the retention and access rules should change. Set the status to **Closed**.

## Practise it

Run a tabletop exercise before launch and yearly after that: record a test incident titled `DRILL`, work through the steps, and time how long it takes to identify the affected people.
