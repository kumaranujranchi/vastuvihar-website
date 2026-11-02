import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { COOKIE_INVENTORY, COOKIE_PURPOSES, OFFERED_CATEGORIES, TAG_IDS } from '@/lib/privacy/cookieConfig';
import { keyedHash } from '@/lib/security/crypto';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText, csvCell, oneOf } from '@/lib/validation';

const PAGE_SIZE = 50;

function parseDate(value: string | null, endOfDay = false): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** The visitor column shows the start of the keyed hash, so one browser's history can be followed. */
const visitorCode = (browserKey: string | null) => (browserKey ? browserKey.slice(0, 10) : '');

/** Cookie choices made in visitors' browsers. Holds no contact details and no IP addresses. */
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'privacy:read');
  if (!admin) return response;

  try {
    const params = new URL(request.url).searchParams;
    const from = parseDate(params.get('from'));
    const to = parseDate(params.get('to'), true);
    const consentId = cleanText(params.get('consentId'), 64).toLowerCase();

    // The summary follows the date and visitor filters, so it always shows every category.
    const base = {
      recordType: 'browser',
      purpose: { in: COOKIE_PURPOSES as string[] },
      ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
      ...(consentId ? { browserKey: keyedHash(`browser:${consentId}`) } : {}),
    };
    const purpose = oneOf(params.get('purpose'), COOKIE_PURPOSES as string[]);
    const action = oneOf(params.get('action'), ['GRANTED', 'WITHDRAWN'] as const);
    const where = { ...base, ...(purpose ? { purpose } : {}), ...(action ? { action } : {}) };

    if (params.get('format') === 'csv') {
      const rows = await prisma.consentRecord.findMany({ where, orderBy: { createdAt: 'desc' }, take: 20000 });
      const lines = rows.map((row) =>
        [row.createdAt.toISOString(), visitorCode(row.browserKey), row.purpose, row.action, row.noticeVersion, row.language, row.source]
          .map(csvCell)
          .join(','),
      );
      await audit(admin, 'cookie_log.exported', 'consent_record', undefined, { count: rows.length });
      return new Response(`﻿${['Time (UTC),Visitor code,Category,Choice,Notice version,Language,Source', ...lines].join('\r\n')}`, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="vastu_vihar_cookie_log_${new Date().toISOString().slice(0, 10)}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
    const [rows, total, summary] = await Promise.all([
      prisma.consentRecord.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.consentRecord.count({ where }),
      prisma.consentRecord.groupBy({ by: ['purpose', 'action'], where: base, _count: { _all: true } }),
    ]);

    return NextResponse.json({
      success: true,
      rows: rows.map((row) => ({
        id: row.id,
        createdAt: row.createdAt,
        visitor: visitorCode(row.browserKey),
        purpose: row.purpose,
        action: row.action,
        noticeVersion: row.noticeVersion,
        language: row.language,
        source: row.source,
      })),
      total,
      page,
      pageSize: PAGE_SIZE,
      summary: summary.map((group) => ({ purpose: group.purpose, action: group.action, count: group._count._all })),
      purposes: COOKIE_PURPOSES,
      offered: OFFERED_CATEGORIES,
      tags: { googleAnalytics: Boolean(TAG_IDS.ga4), googleAds: Boolean(TAG_IDS.googleAds), metaPixel: Boolean(TAG_IDS.metaPixel) },
      inventory: COOKIE_INVENTORY,
    });
  } catch (error) {
    logError('admin.privacy.cookies', error);
    return jsonError('Failed to load the cookie log', 500);
  }
}
