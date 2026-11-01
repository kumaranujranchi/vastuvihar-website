import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');
    await fs.mkdir(uploadDir, { recursive: true });

    const safeBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);
    const uniqueFileName = `${Date.now()}_${safeBaseName}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/blogs/${uniqueFileName}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Editor image upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}

