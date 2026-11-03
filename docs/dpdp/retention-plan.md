# Retention and deletion plan (deliverable 8)

**No period is hard-coded.** Each category starts unapproved, and the job skips it. Nothing is deleted automatically until the organisation approves a period in **Admin > Privacy & Compliance > Retention**, which records who approved it, when, and on what basis.

## Categories

| Category | Measured from | Action | Period |
|---|---|---|---|
| `LEAD` | Last update | Delete | **To approve.** The policy says at most 24 months |
| `LEAD_CONVERTED` | Last update | Delete | **To approve.** Likely longer, because of property law and tax |
| `LEAD_TECH_METADATA` | Submission | Clear IP, country, browser | **To approve.** Suggest a short period, as this data has no current use |
| `APPLICATION` | Last update | Delete, with resume file | **To approve** |
| `COMMENT` | Submission | Delete | **To approve** |
| `CHAT` | Last update | Delete | **To approve.** Legacy data only |
| `PRIVACY_REQUEST` | Resolution | Delete, with its history | **To approve.** Keep long enough to evidence compliance |
| `CONSENT_RECORD` | Creation | Delete | **To approve.** Keep long enough to evidence consent |
| `VISITOR_EVENT` | Creation | Delete | **To approve.** Suggest a short period. Withdrawing a category also deletes its rows straight away |
| `AUDIT_LOG` | Creation | Delete | **To approve.** Check against the rules on log retention |

Two technical stores are purged on each live run, without needing approval, because they hold no usable personal data: rate-limit hashes after 24 hours, and expired staff sessions.

**The privacy policy currently states 24 months for enquiries, and that is not enforced until `LEAD` is approved.** Approve 730 days, or change the policy to match your decision, before launch.

## Legal holds

A legal hold, placed on a verified request with its reason, stops both erasure and scheduled deletion of that record. Use it where a law requires retention. Lift it when the requirement ends. Use of held data should be limited to the purpose the law allows: this is an organisational rule, and the system only blocks deletion.

## Running it

**Preview first:** the Retention tab has a preview that counts what would be deleted, changing nothing. Review it before approving a period or running deletion.

**Schedule:** call the protected endpoint daily from the server. For example, in cron:

```
0 2 * * * curl -fsS -X POST -H "Authorization: Bearer $RETENTION_CRON_SECRET" https://vastuvihar.org/api/internal/retention/
```

Every run writes to `RetentionLog`, shown on the Retention tab. The endpoint is disabled until `RETENTION_CRON_SECRET` is set.

## Outside the job's reach

| Store | Handling required |
|---|---|
| Database and file backups | Set a backup retention period, and document that erased data disappears when backups expire |
| Web server and proxy logs | Set rotation, in line with the rules on log retention |
| CSV exports on staff computers | Staff policy: delete after use. Exports are logged, so they can be traced |
| WhatsApp conversations on staff phones | Decide whether staff may use WhatsApp, and how those chats are cleared |
| Offline booking records | Outside this system |
| Third-party services (Google, Vimeo) | They act independently, and the website sends them no form data |

## Adding a connected system

When a CRM or marketing platform is added, register it in `lib/privacy/connectors.ts`. The hook passes opt-outs, corrections and erasure to it. Scheduled deletion does **not** call connectors yet, so add this to `runRetention` at the same time.
