import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText } from '@/lib/validation';

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'comments:moderate');
  if (!admin) return response;
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { post: { select: { title: true, slug: true } } },
    });
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    logError('admin.comments.list', error);
    return jsonError('Failed to load comments', 500);
  }
}

export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'comments:moderate');
  if (!admin) return response;
  try {
    const body = await request.json();
    const id = cleanText(body.id, 64);
    if (!id) return jsonError('Comment ID required', 400);
    const isApproved = body.isApproved === true;
    await prisma.comment.update({ where: { id }, data: { isApproved } });
    await audit(admin, isApproved ? 'comment.approved' : 'comment.unpublished', 'comment', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.comments.update', error);
    return jsonError('Failed to update comment', 500);
  }
}

export async function DELETE(request: Request) {
  const { admin, response } = await requirePermission(request, 'comments:moderate');
  if (!admin) return response;
  try {
    const id = cleanText(new URL(request.url).searchParams.get('id'), 64);
    if (!id) return jsonError('Comment ID required', 400);
    await prisma.comment.delete({ where: { id } });
    await audit(admin, 'comment.deleted', 'comment', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.comments.delete', error);
    return jsonError('Failed to delete comment', 500);
  }
}
