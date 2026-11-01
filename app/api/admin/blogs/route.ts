import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    // Auto-generate URL slug from title (e.g., "My Post" -> "my-post")
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
      const ext = path.extname(imageFile.name).toLowerCase();
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');
      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}_${slug}${ext}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      imagePath = `/uploads/blogs/${uniqueFileName}`;
    }

    const blog = await prisma.blogPost.create({
      data: {
        title,
        slug,
        category,
        excerpt,
        content,
        imagePath,
      },
    });

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to post blog' }, { status: 500 });
  }
}

// Add this below your existing POST function in app/api/admin/blogs/route.ts

// GET endpoint to fetch all blogs for the admin table
export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// DELETE endpoint to remove a blog
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}