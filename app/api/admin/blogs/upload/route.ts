import { NextResponse } from 'next/server';
import path from 'node:path';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { saveBlogImage } from '@/lib/privateStorage';
import { jsonError, logError } from '@/lib/security/request';

export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'blogs:manage');
  if (!admin) return response;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) return jsonError('No image file provided', 400);

    const saved = await saveBlogImage(file, path.basename(file.name, path.extname(file.name)));
    if (saved.error) return jsonError(saved.error, 400);

    await audit(admin, 'blog.image_uploaded', 'blog_image', saved.url);
    return NextResponse.json({ success: true, url: saved.url });
  } catch (error) {
    logError('admin.blogs.upload', error);
    return jsonError('Failed to upload image', 500);
  }
}
