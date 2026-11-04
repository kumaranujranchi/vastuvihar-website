import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText } from '@/lib/validation';
import { ensureRetentionPolicies, runRetention } from '@/lib/privacy/retention';
import { getSettings, SETTING_DEFAULTS, type SettingKey } from '@/lib/privacy/settings';

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'retention:manage');
  if (!admin) return response;
  try {
    const [policies, logs, settings] = await Promise.all([
      ensureRetentionPolicies(),
      prisma.retentionLog.findMany({ orderBy: { createdAt: 'desc' }, take: 60 }),
      getSettings(),
    ]);
    return NextResponse.json({
      success: true,
      policies,
      logs,
      settings: (Object.keys(SETTING_DEFAULTS) as SettingKey[]).map((key) => ({
        key,
        label: SETTING_DEFAULTS[key].label,
        value: settings[key],
      })),
    });
  } catch (error) {
    logError('admin.retention.list', error);
    return jsonError('Failed to load retention data', 500);
  }
}

/** Sets a period (approval is recorded), or clears it so the job leaves the category alone. */
export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'retention:manage');
  if (!admin) return response;
  try {
    const body = await request.json();

    if (body.settingKey) {
      const key = body.settingKey as SettingKey;
      const value = Number(body.value);
      if (!(key in SETTING_DEFAULTS) || !Number.isInteger(value) || value <= 0) return jsonError('Invalid setting', 400);
      await prisma.privacySetting.upsert({
        where: { key },
        update: { value: String(value), updatedBy: admin.email },
        create: { key, value: String(value), updatedBy: admin.email },
      });
      await audit(admin, 'privacy_setting.updated', 'privacy_setting', key, { value });
      return NextResponse.json({ success: true });
    }

    const category = cleanText(body.category, 40);
    await ensureRetentionPolicies();
    if (!(await prisma.retentionPolicy.findUnique({ where: { category } }))) return jsonError('Unknown category', 404);

    if (body.retentionDays === null || body.retentionDays === '') {
      await prisma.retentionPolicy.update({
        where: { category },
        data: { retentionDays: null, approvedBy: null, approvedAt: null },
      });
      await audit(admin, 'retention_policy.cleared', 'retention_policy', category);
      return NextResponse.json({ success: true });
    }

    const retentionDays = Number(body.retentionDays);
    const legalBasis = cleanText(body.legalBasis, 500);
    if (!Number.isInteger(retentionDays) || retentionDays <= 0) return jsonError('Enter a whole number of days.', 400);
    if (!legalBasis) return jsonError('Record the approval or legal basis for this period.', 400);

    await prisma.retentionPolicy.update({
      where: { category },
      data: { retentionDays, legalBasis, approvedBy: admin.email, approvedAt: new Date() },
    });
    await audit(admin, 'retention_policy.approved', 'retention_policy', category, { retentionDays });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.retention.update', error);
    return jsonError('Failed to update retention policy', 500);
  }
}

export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'retention:manage');
  if (!admin) return response;
  try {
    const body = await request.json();
    const result = await runRetention({ dryRun: body.dryRun !== false, trigger: 'admin', actor: admin });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logError('admin.retention.run', error);
    return jsonError('Retention run failed', 500);
  }
}
