import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { saveBlogImage } from '@/lib/privateStorage';
import { sanitizeBlogHtml } from '@/lib/sanitizeHtml';
import { jsonError, logError } from '@/lib/security/request';

// These pages are prerendered from the post list, so a change must refresh them.
function revalidateBlogPages() {
  for (const path of ['/', '/blog', '/sitemap.xml']) revalidatePath(path);
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug || 'untitled-post';
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'blogs:manage');
  if (!admin) return response;

  try {
    const formData = await request.formData();
    const title = (formData.get('title') as string || '').trim();
    const customSlug = (formData.get('slug') as string || '').trim();
    const category = (formData.get('category') as string || 'Company').trim();
    const excerpt = (formData.get('excerpt') as string || '').trim();
    const content = sanitizeBlogHtml((formData.get('content') as string || '').trim());
    const imageFile = formData.get('image') as File | null;
    const imageAlt = (formData.get('imageAlt') as string || '').trim();
    const metaTitle = (formData.get('metaTitle') as string || '').trim();
    const metaDesc = (formData.get('metaDesc') as string || '').trim();
    const keywords = (formData.get('keywords') as string || '').trim();
    const author = (formData.get('author') as string || 'Vastu Vihar').trim();
    const readingTime = (formData.get('readingTime') as string || '').trim();
    const isPublished = formData.get('isPublished') !== 'false';

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Blog title and content are required' },
        { status: 400 }
      );
    }

    // Generate or sanitize unique slug
    const rawSlug = customSlug ? generateSlug(customSlug) : generateSlug(title);
    const finalSlug = await getUniqueSlug(rawSlug);

    // Calculate reading time if not explicitly provided
    let calculatedReadingTime = readingTime;
    if (!calculatedReadingTime) {
      const wordCount = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
      calculatedReadingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    }

    let imagePath: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const saved = await saveBlogImage(imageFile, finalSlug);
      if (saved.error) return jsonError(saved.error, 400);
      imagePath = saved.url;
    }

    const blog = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        category,
        excerpt: excerpt || null,
        content,
        imagePath,
        imageAlt: imageAlt || title,
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt || title,
        keywords: keywords || null,
        author: author || 'Vastu Vihar',
        readingTime: calculatedReadingTime,
        isPublished,
      },
    });

    await audit(admin, 'blog.created', 'blog', blog.id);
    revalidateBlogPages();
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    logError('admin.blogs.create', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}

// GET endpoint to fetch all blogs for the admin table
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'blogs:manage');
  if (!admin) return response;

  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ success: true, blogs: [] });
  }
}

// DELETE endpoint to remove a blog
export async function DELETE(request: Request) {
  const { admin, response } = await requirePermission(request, 'blogs:manage');
  if (!admin) return response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'Missing blog ID' }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });
    await audit(admin, 'blog.deleted', 'blog', id);
    revalidateBlogPages();
    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
