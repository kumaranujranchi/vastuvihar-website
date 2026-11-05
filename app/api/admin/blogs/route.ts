import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { saveBlogImage } from '@/lib/privateStorage';
import { sanitizeBlogHtml } from '@/lib/sanitizeHtml';
import { jsonError, logError } from '@/lib/security/request';

// These pages are prerendered from the post list, so a change must refresh them.
function revalidateBlogPages(...slugs: string[]) {
  for (const path of ['/', '/blog', '/sitemap.xml', ...slugs.map((slug) => `/blog/${slug}`)]) revalidatePath(path);
}

function estimateReadingTime(content: string): string {
  const wordCount = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
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
    const calculatedReadingTime = readingTime || estimateReadingTime(content);

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

// Saves an edited post. The image stays unless a new one is sent or removeImage is set.
export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'blogs:manage');
  if (!admin) return response;

  try {
    const formData = await request.formData();
    const id = (formData.get('id') as string || '').trim();
    if (!id) return jsonError('Missing blog ID', 400);

    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) return jsonError('Blog post not found', 404);

    const title = (formData.get('title') as string || '').trim();
    const customSlug = (formData.get('slug') as string || '').trim();
    const excerpt = (formData.get('excerpt') as string || '').trim();
    const content = sanitizeBlogHtml((formData.get('content') as string || '').trim());
    const imageFile = formData.get('image') as File | null;
    const imageAlt = (formData.get('imageAlt') as string || '').trim();
    const metaTitle = (formData.get('metaTitle') as string || '').trim();
    const metaDesc = (formData.get('metaDesc') as string || '').trim();
    const keywords = (formData.get('keywords') as string || '').trim();
    const author = (formData.get('author') as string || '').trim();

    if (!title || !content) return jsonError('Blog title and content are required', 400);

    const slug = await getUniqueSlug(generateSlug(customSlug || title), id);

    const data: Record<string, unknown> = {
      title,
      slug,
      category: (formData.get('category') as string || 'Company').trim(),
      excerpt: excerpt || null,
      content,
      imageAlt: imageAlt || title,
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || excerpt || title,
      keywords: keywords || null,
      author: author || 'Vastu Vihar',
      readingTime: estimateReadingTime(content),
      isPublished: formData.get('isPublished') !== 'false',
    };

    if (imageFile && imageFile.size > 0) {
      const saved = await saveBlogImage(imageFile, slug);
      if (saved.error) return jsonError(saved.error, 400);
      data.imagePath = saved.url;
    } else if (formData.get('removeImage') === 'true') {
      data.imagePath = null;
    }

    const blog = await prisma.blogPost.update({ where: { id }, data });

    await audit(admin, 'blog.updated', 'blog', id);
    revalidateBlogPages(existing.slug, slug);
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    logError('admin.blogs.update', error);
    return jsonError('Failed to update blog post', 500);
  }
}

// GET endpoint to fetch all blogs for the admin table, or one post with ?id=
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'blogs:manage');
  if (!admin) return response;

  const id = new URL(request.url).searchParams.get('id');
  if (id) {
    try {
      const blog = await prisma.blogPost.findUnique({ where: { id } });
      if (!blog) return jsonError('Blog post not found', 404);
      return NextResponse.json({ success: true, blog });
    } catch (error) {
      logError('admin.blogs.read', error);
      return jsonError('Failed to load blog post', 500);
    }
  }

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

    const deleted = await prisma.blogPost.delete({ where: { id } });
    await audit(admin, 'blog.deleted', 'blog', id);
    revalidateBlogPages(deleted.slug);
    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
