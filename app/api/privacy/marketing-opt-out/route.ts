import { NextResponse } from 'next/server';
import { guardPublicPost, jsonError, logError } from '@/lib/security/request';
import { cleanText, normalizeEmail, normalizePhone } from '@/lib/validation';
import { withdrawMarketing } from '@/lib/privacy/consent';

export async function POST(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'marketing-opt-out', 10, 60 * 60 * 1000);
    if (blocked) return blocked;

    const body = await request.json();
    if (cleanText(body.website_url, 200)) return NextResponse.json({ success: true });

    const contact = cleanText(body.contact, 254);
    const email = normalizeEmail(contact);
    const phone = email ? null : normalizePhone(contact);
    if (!email && !phone) return jsonError('Please enter a valid email address or phone number.', 400);

    await withdrawMarketing({ email, phone }, 'website_opt_out');

    // The same answer whether or not the contact exists, to avoid revealing who has enquired.
    return NextResponse.json({
      success: true,
      message: 'Done. This contact will not receive marketing from Vastu Vihar.',
    });
  } catch (error) {
    logError('privacy.opt_out', error);
    return jsonError('We could not process that. Please try again or email privacy@vastuvihar.org.', 500);
  }
}
