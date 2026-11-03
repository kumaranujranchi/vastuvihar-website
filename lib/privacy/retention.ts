import { prisma } from '@/lib/prisma';
import { audit } from '@/lib/audit';
import { deleteResume } from '@/lib/privateStorage';
import { randomToken } from '@/lib/security/crypto';
import { logError } from '@/lib/security/request';

export const RETENTION_CATEGORIES = [
  { category: 'LEAD', description: 'Enquiries not converted, measured from the last update' },
  { category: 'LEAD_CONVERTED', description: 'Converted enquiries, measured from the last update' },
  { category: 'LEAD_TECH_METADATA', description: 'Legacy IP address, country and browser details on older enquiries' },
  { category: 'APPLICATION', description: 'Job applications and resumes, measured from the last update' },
  { category: 'COMMENT', description: 'Blog comments, measured from submission' },
  { category: 'NEWSLETTER_UNSUBSCRIBED', description: 'Newsletter entries of people who unsubscribed, measured from unsubscribing' },
  { category: 'CHAT', description: 'Legacy chat sessions from the removed chat endpoint' },
  { category: 'PRIVACY_REQUEST', description: 'Resolved privacy requests and grievances, measured from resolution' },
  { category: 'CONSENT_RECORD', description: 'Hashed consent ledger entries' },
  { category: 'VISITOR_EVENT', description: 'Visitor activity log: pages, cookie names, ad sources and tag events, measured from when they happened' },
  { category: 'AUDIT_LOG', description: 'Administrative audit log entries' },
];

export async function ensureRetentionPolicies() {
  for (const { category, description } of RETENTION_CATEGORIES) {
    await prisma.retentionPolicy.upsert({
      where: { category },
      update: { description },
      create: { category, description },
    });
  }
  return prisma.retentionPolicy.findMany({ orderBy: { category: 'asc' } });
}

type Handler = (cutoff: Date, dryRun: boolean) => Promise<number>;

const handlers: Record<string, Handler> = {
  LEAD: leadHandler({ not: 'CONVERTED' }),
  LEAD_CONVERTED: leadHandler('CONVERTED'),
  async LEAD_TECH_METADATA(cutoff, dryRun) {
    const where = {
      createdAt: { lt: cutoff },
      legalHoldReason: null,
      OR: [{ ipAddress: { not: null } }, { userAgent: { not: null } }, { country: { not: null } }],
    };
    if (dryRun) return prisma.lead.count({ where });
    // updatedAt is written back, or this clean-up would restart the lead's own retention clock.
    const rows = await prisma.lead.findMany({ where, select: { id: true, updatedAt: true } });
    for (const row of rows) {
      await prisma.lead.update({
        where: { id: row.id },
        data: { ipAddress: null, userAgent: null, country: null, updatedAt: row.updatedAt },
      });
    }
    return rows.length;
  },
  async APPLICATION(cutoff, dryRun) {
    const where = { updatedAt: { lt: cutoff }, legalHoldReason: null };
    if (dryRun) return prisma.jobApplication.count({ where });
    const expired = await prisma.jobApplication.findMany({ where, select: { id: true, resumePath: true } });
    let count = 0;
    for (const app of expired) {
      // Row first, with the hold rechecked, so a just-placed hold keeps both row and file.
      const { count: removed } = await prisma.jobApplication.deleteMany({ where: { id: app.id, legalHoldReason: null } });
      if (removed) {
        count += 1;
        await deleteResume(app.resumePath);
      }
    }
    return count;
  },
  async COMMENT(cutoff, dryRun) {
    const where = { createdAt: { lt: cutoff } };
    if (dryRun) return prisma.comment.count({ where });
    return (await prisma.comment.deleteMany({ where })).count;
  },
  async NEWSLETTER_UNSUBSCRIBED(cutoff, dryRun) {
    const where = { status: 'UNSUBSCRIBED', unsubscribedAt: { lt: cutoff } };
    if (dryRun) return prisma.newsletterSubscriber.count({ where });
    return (await prisma.newsletterSubscriber.deleteMany({ where })).count;
  },
  async CHAT(cutoff, dryRun) {
    const where = { updatedAt: { lt: cutoff } };
    if (dryRun) return prisma.chatSession.count({ where });
    return (await prisma.chatSession.deleteMany({ where })).count;
  },
  async PRIVACY_REQUEST(cutoff, dryRun) {
    const where = { resolvedAt: { lt: cutoff } };
    if (dryRun) return prisma.privacyRequest.count({ where });
    return (await prisma.privacyRequest.deleteMany({ where })).count;
  },
  async CONSENT_RECORD(cutoff, dryRun) {
    // Proof of consent must outlive the record it supports, so only entries whose
    // enquiry, application, comment or newsletter entry has gone are eligible.
    const old = await prisma.consentRecord.findMany({
      where: { createdAt: { lt: cutoff } },
      select: { id: true, recordType: true, recordId: true },
    });
    const ids: string[] = [];
    for (const row of old) {
      let live = false;
      if (row.recordId && row.recordType === 'lead') live = Boolean(await prisma.lead.findUnique({ where: { id: row.recordId }, select: { id: true } }));
      if (row.recordId && row.recordType === 'application') live = Boolean(await prisma.jobApplication.findUnique({ where: { id: row.recordId }, select: { id: true } }));
      if (row.recordId && row.recordType === 'comment') live = Boolean(await prisma.comment.findUnique({ where: { id: row.recordId }, select: { id: true } }));
      if (row.recordId && row.recordType === 'newsletter') live = Boolean(await prisma.newsletterSubscriber.findUnique({ where: { id: row.recordId }, select: { id: true } }));
      if (!live) ids.push(row.id);
    }
    if (dryRun) return ids.length;
    return (await prisma.consentRecord.deleteMany({ where: { id: { in: ids } } })).count;
  },
  async VISITOR_EVENT(cutoff, dryRun) {
    const where = { createdAt: { lt: cutoff } };
    if (dryRun) return prisma.visitorEvent.count({ where });
    return (await prisma.visitorEvent.deleteMany({ where })).count;
  },
  async AUDIT_LOG(cutoff, dryRun) {
    const where = { createdAt: { lt: cutoff } };
    if (dryRun) return prisma.auditLog.count({ where });
    return (await prisma.auditLog.deleteMany({ where })).count;
  },
};

function leadHandler(status: unknown): Handler {
  return async (cutoff, dryRun) => {
    const where = { updatedAt: { lt: cutoff }, legalHoldReason: null, status } as never;
    if (dryRun) return prisma.lead.count({ where });
    return (await prisma.lead.deleteMany({ where })).count;
  };
}

/** Skips any category without an approved period, and removes expired technical rows. */
export async function runRetention(options: { dryRun: boolean; trigger: string; actor?: { id?: string; email?: string } | null }) {
  const { dryRun, trigger, actor } = options;
  const runId = randomToken(9);
  const policies = await ensureRetentionPolicies();
  const results: { category: string; affected: number; status: string }[] = [];

  for (const policy of policies) {
    if (!policy.retentionDays || !policy.approvedAt) {
      results.push({ category: policy.category, affected: 0, status: 'skipped: no approved period' });
      await prisma.retentionLog.create({
        data: { runId, category: policy.category, action: 'SKIPPED', affected: 0, dryRun, trigger, note: 'No approved period' },
      });
      continue;
    }
    const cutoff = new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000);
    // One failing category must not stop the others, and must leave a trace.
    try {
      const affected = await handlers[policy.category](cutoff, dryRun);
      results.push({ category: policy.category, affected, status: dryRun ? 'would delete' : 'deleted' });
      await prisma.retentionLog.create({
        data: { runId, category: policy.category, action: policy.action, affected, dryRun, trigger },
      });
    } catch (error) {
      logError(`retention:${policy.category}`, error);
      results.push({ category: policy.category, affected: 0, status: 'failed' });
      await prisma.retentionLog.create({
        data: { runId, category: policy.category, action: 'FAILED', affected: 0, dryRun, trigger, note: 'See server log' },
      });
    }
  }

  if (!dryRun) {
    await prisma.rateLimitHit.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
    await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  }

  await audit(actor || null, dryRun ? 'retention.dry_run' : 'retention.run', 'retention', runId, { trigger });
  return { runId, dryRun, results };
}
