import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, authorName, authorEmail, content } = body;

    if (!postId || !authorName || !content) {
      return NextResponse.json(
        { success: false, error: 'Name, comment, and post ID are required.' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName: authorName.trim(),
        authorEmail: authorEmail ? authorEmail.trim().toLowerCase() : null,
        content: content.trim(),
      },
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error('Error submitting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit comment. Please try again.' },
      { status: 500 }
    );
  }
}