import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardPublicPost, jsonError, logError } from '@/lib/security/request';
import { cleanText, isTrue, normalizeEmail } from '@/lib/validation';
import { noticeLanguage, recordConsent } from '@/lib/privacy/consent';
import { NOTICE_VERSION, PURPOSES } from '@/lib/privacy/notices';

export async function POST(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'comments', 5, 10 * 60 * 1000);
    if (blocked) return blocked;

    const body = await request.json();

    if (cleanText(body.website_url, 200)) {
      return NextResponse.json({ success: true });
    }

    const postId = cleanText(body.postId, 64);
    const authorName = cleanText(body.authorName, 120);
    const content = cleanText(body.content, 4000);
    if (!postId || !authorName || !content) return jsonError('Name and comment are required.', 400);

    const rawEmail = cleanText(body.authorEmail, 254);
    const authorEmail = rawEmail ? normalizeEmail(rawEmail) : null;
    if (rawEmail && !authorEmail) return jsonError('Please enter a valid email address.', 400);

    if (!isTrue(body.consentPrimary)) return jsonError('Please confirm your consent to publish this comment.', 400);

    const post = await prisma.blogPost.findUnique({ where: { id: postId }, select: { isPublished: true } });
    if (!post?.isPublished) return jsonError('This post is not accepting comments.', 404);

    const language = noticeLanguage(body.noticeLanguage);
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName,
        authorEmail,
        content,
        isApproved: false,
        noticeVersion: NOTICE_VERSION,
        noticeLanguage: language,
      },
      select: { id: true },
    });

    await recordConsent({
      email: authorEmail,
      recordType: 'comment',
      recordId: comment.id,
      purpose: PURPOSES.COMMENT,
      action: 'GRANTED',
      language,
      source: 'blog_comment',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    logError('comments.create', error);
    return jsonError('Failed to submit comment. Please try again.', 500);
  }
}
