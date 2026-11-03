import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { AD_CHANNELS } from '@/lib/privacy/cookieConfig';
import { parseLogDate, visitorCode } from '@/lib/privacy/visitorLog';
import { keyedHash } from '@/lib/security/crypto';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText, csvCell, oneOf } from '@/lib/validation';

const PAGE_SIZE = 50;
const CATEGORIES = ['analytics', 'advertising'];
const KINDS = ['page_view', 'tag_event'];

/** Pages, cookie names, ad sources and tag events. Holds no contact details, IP addresses or cookie values. */
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'privacy:read');
  if (!admin) return response;

  try {
    const params = new URL(request.url).searchParams;
    const from = parseLogDate(params.get('from'));
    const to = parseLogDate(params.get('to'), true);
    const consentId = cleanText(params.get('consentId'), 64).toLowerCase();
    const visitor = cleanText(params.get('visitor'), 10).toLowerCase();
    const kind = oneOf(params.get('kind'), KINDS);
    const category = oneOf(params.get('category'), CATEGORIES);
    const adChannel = oneOf(params.get('channel'), AD_CHANNELS as string[]);

    // A consent ID is exact. A visitor code is a filter on what staff can already see.
    const browserFilter = consentId
      ? { browserKey: keyedHash(`browser:${consentId}`) }
      : /^[a-f0-9]{10}$/.test(visitor)
        ? { browserKey: { startsWith: visitor } }
        : {};
    const base = {
      ...browserFilter,
      ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };
    const where = { ...base, ...(kind ? { kind } : {}), ...(category ? { category } : {}), ...(adChannel ? { adChannel } : {}) };

    if (params.get('format') === 'csv') {
      const rows = await prisma.visitorEvent.findMany({ where, orderBy: { createdAt: 'desc' }, take: 20000 });
      const lines = rows.map((row) =>
        [row.createdAt.toISOString(), visitorCode(row.browserKey), row.kind, row.category, row.path, row.cookies, row.adChannel, row.adUtmSource, row.adUtmMedium, row.adUtmCampaign, row.provider, row.eventName]
          .map(csvCell)
          .join(','),
      );
      await audit(admin, 'visitor_activity.exported', 'visitor_event', undefined, { count: rows.length });
      return new Response(`﻿${['Time (UTC),Visitor code,Type,Category,Page,Cookie names,Ad channel,UTM source,UTM medium,UTM campaign,Tag,Tag event', ...lines].join('\r\n')}`, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="vastu_vihar_visitor_activity_${new Date().toISOString().slice(0, 10)}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
    const [rows, total, byKind, byChannel] = await Promise.all([
      prisma.visitorEvent.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      prisma.visitorEvent.count({ where }),
      prisma.visitorEvent.groupBy({ by: ['kind', 'category'], where: base, _count: { _all: true } }),
      prisma.visitorEvent.groupBy({ by: ['adChannel'], where: { ...base, kind: 'page_view', adChannel: { not: null } }, _count: { _all: true } }),
    ]);

    return NextResponse.json({
      success: true,
      rows: rows.map(({ browserKey, ...row }) => ({ ...row, visitor: visitorCode(browserKey) })),
      total,
      page,
      pageSize: PAGE_SIZE,
      summary: byKind.map((group) => ({ kind: group.kind, category: group.category, count: group._count._all })),
      channels: byChannel.map((group) => ({ channel: group.adChannel, count: group._count._all })),
      channelOptions: AD_CHANNELS,
    });
  } catch (error) {
    logError('admin.privacy.visitor_activity', error);
    return jsonError('Failed to load the visitor activity log', 500);
  }
}
