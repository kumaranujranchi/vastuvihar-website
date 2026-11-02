import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardPublicPost, jsonError, logError } from '@/lib/security/request';
import { cleanText, isTrue, normalizeEmail } from '@/lib/validation';
import { isSuppressed, noticeLanguage, recordConsent } from '@/lib/privacy/consent';
import { NOTICE_VERSION, PURPOSES } from '@/lib/privacy/notices';

const DONE = { success: true, message: 'Thank you. You are on the Vastu Vihar newsletter list.' };

export async function POST(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'newsletter', 5, 60 * 60 * 1000);
    if (blocked) return blocked;

    const body = await request.json();
    if (cleanText(body.website_url, 200)) return NextResponse.json(DONE);

    const email = normalizeEmail(body.email);
    if (!email) return jsonError('Please enter a valid email address.', 400);
    if (!isTrue(body.consentPrimary)) return jsonError('Please tick the box to confirm your consent.', 400);

    // Every case answers the same, so this form cannot reveal who has subscribed or opted out.
    // A website form cannot prove who is typing, so a tick never overrides an earlier opt-out.
    if (await isSuppressed(null, email)) return NextResponse.json(DONE);
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.status === 'SUBSCRIBED') return NextResponse.json(DONE);

    const language = noticeLanguage(body.noticeLanguage);
    const details = { status: 'SUBSCRIBED', noticeVersion: NOTICE_VERSION, noticeLanguage: language, unsubscribedAt: null };
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: details,
      create: { email, ...details },
    });
    await recordConsent({
      email,
      recordType: 'newsletter',
      recordId: subscriber.id,
      purpose: PURPOSES.NEWSLETTER,
      action: 'GRANTED',
      language,
      source: 'newsletter_form',
    });
    return NextResponse.json(DONE);
  } catch (error) {
    logError('newsletter.subscribe', error);
    return jsonError('We could not add you to the list. Please try again.', 500);
  }
}
