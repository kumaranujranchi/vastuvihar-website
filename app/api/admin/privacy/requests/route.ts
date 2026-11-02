import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { jsonError, logError } from '@/lib/security/request';
import { oneOf } from '@/lib/validation';

const STATUSES = ['RECEIVED', 'VERIFYING', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'REJECTED'] as const;

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'privacy:read');
  if (!admin) return response;

  try {
    const { searchParams } = new URL(request.url);
    const status = oneOf(searchParams.get('status'), STATUSES);
    const grievance = searchParams.get('view') === 'grievances';

    const where: Record<string, unknown> = grievance ? { type: 'GRIEVANCE' } : { type: { not: 'GRIEVANCE' } };
    if (status) where.status = status;

    const requests = await prisma.privacyRequest.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      take: 200,
      select: {
        id: true,
        ticketNo: true,
        type: true,
        category: true,
        requesterName: true,
        status: true,
        dueAt: true,
        verifiedAt: true,
        createdAt: true,
      },
    });

    const open = ['RECEIVED', 'VERIFYING', 'IN_PROGRESS', 'ESCALATED'];
    const counts = await prisma.privacyRequest.groupBy({
      by: ['status'],
      where: { type: where.type as never },
      _count: { _all: true },
    });
    const overdue = await prisma.privacyRequest.count({
      where: { type: where.type as never, status: { in: open }, dueAt: { lt: new Date() } },
    });

    return NextResponse.json({
      success: true,
      requests,
      counts: Object.fromEntries(counts.map((row) => [row.status, row._count._all])),
      overdue,
    });
  } catch (error) {
    logError('admin.privacy.requests.list', error);
    return jsonError('Failed to load requests', 500);
  }
}
