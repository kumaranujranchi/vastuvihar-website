import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { deleteResume } from '@/lib/privateStorage';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText, oneOf } from '@/lib/validation';

const STATUSES = ['SUBMITTED', 'REVIEWED', 'SHORTLISTED', 'REJECTED'] as const;

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'applications:read');
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
        { email: { contains: search } },
        { phone: { contains: search } },
        { jobTitle: { contains: search } },
      ];
    }

    const [applications, totalCount, shortlistedCount, pendingCount] = await Promise.all([
      prisma.jobApplication.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: 'SHORTLISTED' } }),
      prisma.jobApplication.count({ where: { status: 'SUBMITTED' } }),
    ]);

    return NextResponse.json({
      success: true,
      applications: applications.map(({ resumePath, ...application }) => ({
        ...application,
        // The stored path stays on the server. Staff download through the audited route.
        resumePath: resumePath ? `/api/admin/applications/${application.id}/resume` : null,
      })),
      stats: { totalCount, shortlistedCount, pendingCount },
    });
  } catch (error) {
    logError('admin.applications.list', error);
    return jsonError('Failed to fetch applications', 500);
  }
}

export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'applications:write');
  if (!admin) return response;

  try {
    const body = await request.json();
    const id = cleanText(body.id, 64);
    const status = oneOf(body.status, STATUSES);
    if (!id || !status) return jsonError('Application ID and a valid status are required', 400);

    await prisma.jobApplication.update({ where: { id }, data: { status } });
    await audit(admin, 'application.status_changed', 'application', id, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.applications.update', error);
    return jsonError('Failed to update application', 500);
  }
}

export async function DELETE(request: Request) {
  const { admin, response } = await requirePermission(request, 'applications:write');
  if (!admin) return response;

  try {
    const id = cleanText(new URL(request.url).searchParams.get('id'), 64);
    if (!id) return jsonError('Application ID required', 400);

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      select: { legalHoldReason: true, resumePath: true },
    });
    if (!application) return jsonError('Application not found', 404);
    if (application.legalHoldReason) return jsonError('This application is under a legal hold and cannot be deleted.', 409);

    await deleteResume(application.resumePath);
    await prisma.jobApplication.delete({ where: { id } });
    await audit(admin, 'application.deleted', 'application', id);
    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    logError('admin.applications.delete', error);
    return jsonError('Failed to delete application', 500);
  }
}
