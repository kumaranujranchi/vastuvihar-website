import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { getGalleryAlbums, isBuiltInPhoto, isGalleryAlbum } from '@/lib/gallery';
import { deleteGalleryImage, saveGalleryImage } from '@/lib/privateStorage';
import { prisma } from '@/lib/prisma';
import { jsonError, logError } from '@/lib/security/request';
import { revalidateGallery } from '@/lib/revalidate';

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'gallery:manage');
  if (!admin) return response;
  try {
    return NextResponse.json({ success: true, albums: await getGalleryAlbums() });
  } catch (error) {
    logError('admin.gallery.list', error);
    return jsonError('Failed to load the gallery', 500);
  }
}

/** Adds a photo, or replaces one when builtInName or uploadId is sent. */
export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'gallery:manage');
  if (!admin) return response;

  let savedName: string | undefined;
  try {
    const form = await request.formData();
    const album = String(form.get('album') || '');
    const builtInName = String(form.get('builtInName') || '');
    const uploadId = String(form.get('uploadId') || '');
    const file = form.get('file');

    if (!isGalleryAlbum(album)) return jsonError('Unknown album.', 400);
    if (!(file instanceof File) || file.size === 0) return jsonError('No image file provided.', 400);
    if (builtInName && !isBuiltInPhoto(album, builtInName)) return jsonError('Photo not found.', 404);

    const upload = uploadId ? await prisma.galleryImage.findUnique({ where: { id: uploadId } }) : null;
    if (uploadId && (!upload || upload.album !== album || upload.builtInName)) {
      return jsonError('Photo not found.', 404);
    }

    const saved = await saveGalleryImage(file);
    if (saved.error || !saved.name) return jsonError(saved.error || 'Failed to save the image.', 400);
    savedName = saved.name;

    let previousName: string | null = null;
    let id: string;
    if (upload) {
      previousName = upload.storageKey;
      id = upload.id;
      await prisma.galleryImage.update({ where: { id }, data: { storageKey: savedName } });
    } else if (builtInName) {
      const existing = await prisma.galleryImage.findUnique({
        where: { album_builtInName: { album, builtInName } },
      });
      previousName = existing?.storageKey ?? null;
      const row = existing
        ? await prisma.galleryImage.update({ where: { id: existing.id }, data: { storageKey: savedName } })
        : await prisma.galleryImage.create({ data: { album, builtInName, storageKey: savedName } });
      id = row.id;
    } else {
      id = (await prisma.galleryImage.create({ data: { album, storageKey: savedName } })).id;
    }

    revalidateGallery();

    // The database now points at the new file, so a failure here only leaves an unused file.
    await deleteGalleryImage(previousName).catch((error) => logError('admin.gallery.cleanup', error));
    await audit(admin, uploadId || builtInName ? 'gallery.image_replaced' : 'gallery.image_added', 'gallery_image', id, { album });
    return NextResponse.json({ success: true }, { status: uploadId || builtInName ? 200 : 201 });
  } catch (error) {
    logError('admin.gallery.save', error);
    await deleteGalleryImage(savedName).catch(() => {});
    return jsonError('Failed to save the image.', 500);
  }
}

export async function DELETE(request: Request) {
  const { admin, response } = await requirePermission(request, 'gallery:manage');
  if (!admin) return response;
  try {
    const params = new URL(request.url).searchParams;
    const album = params.get('album') || '';
    const builtInName = params.get('builtInName') || '';
    const uploadId = params.get('uploadId') || '';
    if (!isGalleryAlbum(album)) return jsonError('Unknown album.', 400);

    let previousName: string | null = null;
    let id: string;
    if (uploadId) {
      const upload = await prisma.galleryImage.findUnique({ where: { id: uploadId } });
      if (!upload || upload.album !== album || upload.builtInName) return jsonError('Photo not found.', 404);
      previousName = upload.storageKey;
      id = upload.id;
      await prisma.galleryImage.delete({ where: { id } });
    } else {
      if (!isBuiltInPhoto(album, builtInName)) return jsonError('Photo not found.', 404);
      // Built-in files ship with the site, so removing one is recorded rather than deleted.
      const existing = await prisma.galleryImage.findUnique({
        where: { album_builtInName: { album, builtInName } },
      });
      previousName = existing?.storageKey ?? null;
      const row = existing
        ? await prisma.galleryImage.update({ where: { id: existing.id }, data: { storageKey: null } })
        : await prisma.galleryImage.create({ data: { album, builtInName, storageKey: null } });
      id = row.id;
    }
    revalidateGallery();

    await deleteGalleryImage(previousName).catch((error) => logError('admin.gallery.cleanup', error));
    await audit(admin, 'gallery.image_deleted', 'gallery_image', id, { album });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.gallery.delete', error);
    return jsonError('Failed to delete the photo.', 500);
  }
}
