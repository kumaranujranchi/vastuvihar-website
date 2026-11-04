import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { jsonError, logError } from '@/lib/security/request';
import { csvCell } from '@/lib/validation';

/** Server-side export, so every download is permission-checked and audited. */
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'leads:export');
  if (!admin) return response;

  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5000 });
    const header = ['Date', 'Name', 'Phone', 'Email', 'City', 'Budget', 'Project', 'Status', 'Marketing consent', 'Ad channel', 'UTM source', 'UTM medium', 'UTM campaign', 'Message'];
    const rows = leads.map((lead) =>
      [
        lead.createdAt.toISOString().slice(0, 10),
        lead.fullName,
        lead.phone,
        lead.email,
        lead.city,
        lead.budget,
        lead.project,
        lead.status,
        lead.marketingConsent ? 'Yes' : 'No',
        lead.adChannel,
        lead.adUtmSource,
        lead.adUtmMedium,
        lead.adUtmCampaign,
        lead.message,
      ]
        .map(csvCell)
        .join(','),
    );

    await audit(admin, 'lead.exported', 'lead', undefined, { count: leads.length });

    return new Response(`﻿${[header.join(','), ...rows].join('\r\n')}`, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="vastu_vihar_leads_${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    logError('admin.leads.export', error);
    return jsonError('Failed to export leads', 500);
  }
}
