import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText, oneOf } from '@/lib/validation';

const STATUSES = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED'] as const;

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'leads:read');
  if (!admin) return response;

  try {
    const { searchParams } = new URL(request.url);
    const search = cleanText(searchParams.get('search'), 120);
    const status = oneOf(searchParams.get('status'), STATUSES);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const [leads, totalCount, newCount, contactedCount, convertedCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 200,
        // IP address, country and browser details are deliberately not sent to staff screens.
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          city: true,
          budget: true,
          project: true,
          address: true,
          message: true,
          source: true,
          status: true,
          marketingConsent: true,
          marketingWithdrawnAt: true,
          adChannel: true,
          adUtmSource: true,
          adUtmMedium: true,
          adUtmCampaign: true,
          legalHoldReason: true,
          createdAt: true,
        },
      }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'CONTACTED' } }),
      prisma.lead.count({ where: { status: 'CONVERTED' } }),
    ]);

    return NextResponse.json({
      success: true,
      leads,
      stats: { totalCount, newCount, contactedCount, convertedCount },
    });
  } catch (error) {
    logError('admin.leads.list', error);
    return jsonError('Failed to fetch leads', 500);
  }
}

export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'leads:write');
  if (!admin) return response;

  try {
    const body = await request.json();
    const id = cleanText(body.id, 64);
    const status = oneOf(body.status, STATUSES);
    if (!id || !status) return jsonError('Lead ID and a valid status are required', 400);

    await prisma.lead.update({ where: { id }, data: { status } });
    await audit(admin, 'lead.status_changed', 'lead', id, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.leads.update', error);
    return jsonError('Failed to update lead', 500);
  }
}

export async function DELETE(request: Request) {
  const { admin, response } = await requirePermission(request, 'leads:write');
  if (!admin) return response;

  try {
    const id = cleanText(new URL(request.url).searchParams.get('id'), 64);
    if (!id) return jsonError('Lead ID required', 400);

    const lead = await prisma.lead.findUnique({ where: { id }, select: { legalHoldReason: true } });
    if (!lead) return jsonError('Lead not found', 404);
    if (lead.legalHoldReason) return jsonError('This lead is under a legal hold and cannot be deleted.', 409);

    await prisma.lead.delete({ where: { id } });
    await audit(admin, 'lead.deleted', 'lead', id);
    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    logError('admin.leads.delete', error);
    return jsonError('Failed to delete lead', 500);
  }
}
