import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { readResume } from '@/lib/privateStorage';
import { jsonError, logError } from '@/lib/security/request';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requirePermission(request, 'applications:read');
  if (!admin) return response;

  try {
    const { id } = await params;
    const application = await prisma.jobApplication.findUnique({ where: { id }, select: { resumePath: true } });
    if (!application?.resumePath) return jsonError('Resume not found', 404);

    const file = await readResume(application.resumePath);
    if (!file) return jsonError('Resume not found', 404);

    await audit(admin, 'application.resume_downloaded', 'application', id);

    return new Response(new Uint8Array(file.data), {
      headers: {
        'Content-Type': file.mime,
        // Always download, so a crafted file can never render on this origin.
        'Content-Disposition': `attachment; filename="resume-${id}${file.ext}"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    logError('admin.resume.download', error);
    return jsonError('Failed to download resume', 500);
  }
}
