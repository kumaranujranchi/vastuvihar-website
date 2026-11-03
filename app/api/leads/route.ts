import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardPublicPost, jsonError, logError } from '@/lib/security/request';
import { cleanText, isTrue, normalizeEmail, normalizePhone, oneOf, phoneMatchKey } from '@/lib/validation';
import { isSuppressed, noticeLanguage, recordConsent } from '@/lib/privacy/consent';
import { NOTICE_VERSION, PURPOSES } from '@/lib/privacy/notices';
import { adSourceForLead } from '@/lib/privacy/visitorLog';

const SOURCES = ['contact_section', 'project_enquiry_section'] as const;

export async function POST(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'leads', 5, 5 * 60 * 1000);
    if (blocked) return blocked;

    const body = await request.json();

    // Honeypot: report success to the bot, keep nothing and log nothing personal.
    if (cleanText(body.website_url, 200)) {
      return NextResponse.json({ success: true, message: 'Inquiry received successfully!' });
    }

    const fullName = cleanText(body.fullName, 120);
    const phone = normalizePhone(body.phone);
    if (!fullName || !phone) return jsonError('Full name and a valid phone number are required.', 400);

    const rawEmail = cleanText(body.email, 254);
    const email = rawEmail ? normalizeEmail(rawEmail) : null;
    if (rawEmail && !email) return jsonError('Please enter a valid email address.', 400);

    if (!isTrue(body.consentPrimary)) {
      return jsonError('Please confirm your consent so we can respond to your enquiry.', 400);
    }

    const language = noticeLanguage(body.noticeLanguage);
    const source = oneOf(body.source, SOURCES) || 'contact_section';
    // An earlier opt-out wins over a form tick, which cannot prove who is typing.
    const marketing = isTrue(body.consentMarketing) && !(await isSuppressed(phone, email));
    const accepted = () =>
      NextResponse.json(
        { success: true, message: 'Inquiry received successfully! Our team will contact you shortly.' },
        { status: 201 },
      );

    // Rapid duplicate guard for double submits. The answer matches a normal success,
    // so it does not reveal that this number enquired moments ago.
    const recent = await prisma.lead.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 90 * 1000) } },
      select: { phone: true },
    });
    if (recent.some((row) => phoneMatchKey(row.phone) === phoneMatchKey(phone))) return accepted();

    const now = new Date();
    const lead = await prisma.lead.create({
      data: {
        fullName,
        phone,
        email,
        city: cleanText(body.city, 80) || null,
        budget: cleanText(body.budget, 80) || null,
        project: cleanText(body.project, 160) || null,
        message: cleanText(body.message, 4000) || null,
        source,
        status: 'NEW',
        noticeVersion: NOTICE_VERSION,
        noticeLanguage: language,
        marketingConsent: marketing,
        marketingConsentAt: marketing ? now : null,
        // The browser ID only proves the advertising choice. It is not kept with the enquiry.
        ...(await adSourceForLead(body.browserId, body.adSource)),
      },
    });

    const base = { phone, email, recordType: 'lead', recordId: lead.id, language, source };
    await recordConsent({ ...base, purpose: PURPOSES.ENQUIRY, action: 'GRANTED' });
    if (marketing) {
      await recordConsent({ ...base, purpose: PURPOSES.MARKETING, action: 'GRANTED' });
    }

    return accepted();
  } catch (error) {
    logError('leads.create', error);
    return jsonError('Failed to process inquiry. Please try again later.', 500);
  }
}
