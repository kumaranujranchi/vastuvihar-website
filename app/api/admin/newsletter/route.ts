import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { emailKey } from '@/lib/privacy/consent';
import { jsonError, logError } from '@/lib/security/request';
import { csvCell, oneOf } from '@/lib/validation';

const PAGE_SIZE = 50;
const STATUSES = ['SUBSCRIBED', 'UNSUBSCRIBED'] as const;

/** Subscriber list. The download only ever holds people who are currently subscribed. */
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'newsletter:manage');
  if (!admin) return response;

  try {
    const params = new URL(request.url).searchParams;

    if (params.get('format') === 'csv') {
      const rows = await prisma.newsletterSubscriber.findMany({
        where: { status: 'SUBSCRIBED' },
        orderBy: { createdAt: 'desc' },
        take: 20000,
      });
      // An opt-out always wins, even if an entry says subscribed.
      const suppressions = await prisma.marketingSuppression.findMany({
        where: { key: { in: rows.map((row) => emailKey(row.email) as string) } },
        select: { key: true },
      });
      const suppressed = new Set(suppressions.map((row) => row.key));
      const sendable = rows.filter((row) => !suppressed.has(emailKey(row.email) as string));
      const lines = sendable.map((row) =>
        [row.email, row.createdAt.toISOString(), row.noticeVersion, row.noticeLanguage].map(csvCell).join(','),
      );
      await audit(admin, 'newsletter.exported', 'newsletter', undefined, { count: sendable.length });
      return new Response(`﻿${['Email,Subscribed at,Notice version,Language', ...lines].join('\r\n')}`, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="vastu_vihar_newsletter_${new Date().toISOString().slice(0, 10)}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    const status = oneOf(params.get('status'), STATUSES);
    const where = status ? { status } : {};
    const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
    const [subscribers, total, groups] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.newsletterSubscriber.count({ where }),
      prisma.newsletterSubscriber.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);
    const counts = Object.fromEntries(groups.map((group) => [group.status, group._count._all]));
    return NextResponse.json({ success: true, subscribers, total, page, pageSize: PAGE_SIZE, counts });
  } catch (error) {
    logError('admin.newsletter', error);
    return jsonError('Failed to load subscribers', 500);
  }
}
