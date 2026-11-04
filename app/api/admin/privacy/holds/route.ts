import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText, oneOf } from '@/lib/validation';

/** Places or lifts a legal hold, which blocks both erasure and scheduled deletion. */
export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'privacy:manage');
  if (!admin) return response;
  try {
    const body = await request.json();
    const recordType = oneOf(body.recordType, ['lead', 'application'] as const);
    const id = cleanText(body.id, 64);
    if (!recordType || !id) return jsonError('Record type and ID are required.', 400);
    const reason = cleanText(body.reason, 500) || null;

    if (recordType === 'lead') {
      await prisma.lead.update({ where: { id }, data: { legalHoldReason: reason } });
    } else {
      await prisma.jobApplication.update({ where: { id }, data: { legalHoldReason: reason } });
    }
    await audit(admin, reason ? 'legal_hold.placed' : 'legal_hold.lifted', recordType, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.privacy.holds', error);
    return jsonError('Failed to update legal hold', 500);
  }
}
