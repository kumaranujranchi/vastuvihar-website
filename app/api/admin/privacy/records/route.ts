import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { jsonError, logError } from '@/lib/security/request';
import { oneOf } from '@/lib/validation';
import { PROCESSORS, REMOVED_INTEGRATIONS } from '@/data/privacy/processors';

/** Read-only registers: consent history, audit log and the processor inventory. */
export async function GET(request: Request) {
  const view = oneOf(new URL(request.url).searchParams.get('view'), ['consents', 'audit', 'processors'] as const);
  if (!view) return jsonError('Unknown view', 400);

  const { admin, response } = await requirePermission(request, view === 'audit' ? 'audit:read' : 'privacy:read');
  if (!admin) return response;

  try {
    if (view === 'processors') {
      return NextResponse.json({ success: true, processors: PROCESSORS, removed: REMOVED_INTEGRATIONS });
    }
    if (view === 'audit') {
      const entries = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 300 });
      return NextResponse.json({ success: true, entries });
    }
    const consents = await prisma.consentRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 300,
      select: {
        id: true,
        recordType: true,
        recordId: true,
        purpose: true,
        action: true,
        noticeVersion: true,
        language: true,
        source: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ success: true, consents });
  } catch (error) {
    logError('admin.privacy.records', error);
    return jsonError('Failed to load records', 500);
  }
}
