import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText, oneOf } from '@/lib/validation';
import { getSettings } from '@/lib/privacy/settings';

const STATUSES = ['DETECTED', 'ASSESSING', 'CONTAINED', 'NOTIFIED', 'CLOSED'] as const;
const SEVERITIES = ['UNASSESSED', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
const TEXT_FIELDS = [
  'title', 'nature', 'scope', 'affectedDataTypes', 'containmentActions',
  'remediationActions', 'likelyConsequences', 'ownerEmail', 'boardReference', 'notificationNotes',
] as const;
const DATE_FIELDS = ['occurredAt', 'boardIntimatedAt', 'boardReportedAt', 'principalsNotifiedAt'] as const;
const NUMBER_FIELDS = ['affectedCount', 'principalsNotifiedCount'] as const;

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function collect(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const field of TEXT_FIELDS) if (field in body) data[field] = cleanText(body[field], 4000) || null;
  for (const field of DATE_FIELDS) if (field in body) data[field] = parseDate(body[field]);
  for (const field of NUMBER_FIELDS) {
    if (field in body) {
      const parsed = Number(body[field]);
      data[field] = body[field] === '' || body[field] === null || !Number.isFinite(parsed) ? null : Math.max(0, Math.trunc(parsed));
    }
  }
  if ('status' in body) data.status = oneOf(body.status, STATUSES) || undefined;
  if ('severity' in body) data.severity = oneOf(body.severity, SEVERITIES) || undefined;
  return data;
}

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'breach:manage');
  if (!admin) return response;
  try {
    const incidents = await prisma.breachIncident.findMany({ orderBy: { detectedAt: 'desc' }, take: 100 });
    return NextResponse.json({ success: true, incidents });
  } catch (error) {
    logError('admin.breach.list', error);
    return jsonError('Failed to load incidents', 500);
  }
}

export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'breach:manage');
  if (!admin) return response;
  try {
    const body = await request.json();
    const title = cleanText(body.title, 200);
    if (!title) return jsonError('Give the incident a short title.', 400);

    const detectedAt = parseDate(body.detectedAt) || new Date();
    const { breachBoardReportHours } = await getSettings();

    const incident = await prisma.breachIncident.create({
      data: {
        ...(collect(body) as object),
        title,
        reference: `BR-${detectedAt.getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`,
        detectedAt,
        boardDueAt: new Date(detectedAt.getTime() + breachBoardReportHours * 60 * 60 * 1000),
        createdBy: admin.email,
      },
    });
    await audit(admin, 'breach.recorded', 'breach', incident.id, { reference: incident.reference });
    return NextResponse.json({ success: true, incident }, { status: 201 });
  } catch (error) {
    logError('admin.breach.create', error);
    return jsonError('Failed to record incident', 500);
  }
}

export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'breach:manage');
  if (!admin) return response;
  try {
    const body = await request.json();
    const id = cleanText(body.id, 64);
    if (!id) return jsonError('Incident ID required', 400);

    const data = collect(body);
    const incident = await prisma.breachIncident.update({ where: { id }, data });
    await audit(admin, 'breach.updated', 'breach', id, { fields: Object.keys(data) });
    return NextResponse.json({ success: true, incident });
  } catch (error) {
    logError('admin.breach.update', error);
    return jsonError('Failed to update incident', 500);
  }
}
