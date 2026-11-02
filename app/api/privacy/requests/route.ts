import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { guardPublicPost, jsonError, logError } from '@/lib/security/request';
import { cleanText, normalizeEmail, normalizePhone, oneOf, phoneMatchKey } from '@/lib/validation';
import { noticeLanguage } from '@/lib/privacy/consent';
import { getSettings } from '@/lib/privacy/settings';

const TYPES = ['ACCESS', 'CORRECTION', 'ERASURE', 'CONSENT_WITHDRAWAL', 'NOMINATION', 'GRIEVANCE'] as const;
const GRIEVANCE_CATEGORIES = ['CONSENT', 'MARKETING', 'ACCURACY', 'SECURITY', 'REQUEST_HANDLING', 'OTHER'] as const;

function ticketNumber(type: string): string {
  const prefix = type === 'GRIEVANCE' ? 'GRV' : 'DPR';
  return `${prefix}-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'privacy-requests', 5, 60 * 60 * 1000);
    if (blocked) return blocked;

    const body = await request.json();
    if (cleanText(body.website_url, 200)) return NextResponse.json({ success: true, ticketNo: null });

    const type = oneOf(body.type, TYPES);
    if (!type) return jsonError('Please choose a request type.', 400);

    const requesterName = cleanText(body.requesterName, 120);
    const details = cleanText(body.details, 4000);
    const rawEmail = cleanText(body.email, 254);
    const rawPhone = cleanText(body.phone, 32);
    const email = rawEmail ? normalizeEmail(rawEmail) : null;
    const phone = rawPhone ? normalizePhone(rawPhone) : null;

    if (!requesterName || !details) return jsonError('Your name and the details of your request are required.', 400);
    if (rawEmail && !email) return jsonError('Please enter a valid email address.', 400);
    if (rawPhone && !phone) return jsonError('Please enter a valid phone number.', 400);
    if (!email && !phone) return jsonError('Please give the email or phone number you used with us.', 400);

    let requestedChange: string | null = null;
    if (type === 'CORRECTION') {
      const change: Record<string, string> = {};
      const newName = cleanText(body.newName, 120);
      const newEmail = cleanText(body.newEmail, 254);
      const newPhone = cleanText(body.newPhone, 32);
      if (newName) change.fullName = newName;
      if (newEmail) {
        const valid = normalizeEmail(newEmail);
        if (!valid) return jsonError('Please enter a valid corrected email address.', 400);
        change.email = valid;
      }
      if (newPhone) {
        const valid = normalizePhone(newPhone);
        if (!valid) return jsonError('Please enter a valid corrected phone number.', 400);
        change.phone = valid;
      }
      if (Object.keys(change).length) requestedChange = JSON.stringify(change);
    }

    const nomineeName = cleanText(body.nomineeName, 120) || null;
    const nomineeContact = cleanText(body.nomineeContact, 254) || null;
    const nomineeRelation = cleanText(body.nomineeRelation, 80) || null;
    if (type === 'NOMINATION' && (!nomineeName || !nomineeContact)) {
      return jsonError("Please give your nominee's name and contact details.", 400);
    }

    const settings = await getSettings();
    const days = type === 'GRIEVANCE' ? settings.grievanceResponseDays : settings.requestResponseDays;

    const created = await prisma.privacyRequest.create({
      data: {
        ticketNo: ticketNumber(type),
        type,
        category: type === 'GRIEVANCE' ? oneOf(body.category, GRIEVANCE_CATEGORIES) || 'OTHER' : null,
        requesterName,
        email,
        phone,
        details,
        requestedChange,
        nomineeName,
        nomineeContact,
        nomineeRelation,
        actingAs: body.actingAs === 'NOMINEE' ? 'NOMINEE' : 'SELF',
        language: noticeLanguage(body.noticeLanguage),
        dueAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        events: { create: { action: 'RECEIVED', note: 'Submitted through the website.' } },
      },
      select: { ticketNo: true, dueAt: true },
    });

    return NextResponse.json({ success: true, ticketNo: created.ticketNo, dueAt: created.dueAt }, { status: 201 });
  } catch (error) {
    logError('privacy.requests.create', error);
    return jsonError('We could not record your request. Please try again or email privacy@vastuvihar.org.', 500);
  }
}

/**
 * Status check. It needs the ticket number and the contact on the request, and
 * returns only progress: any personal data goes back through the verified channel.
 */
export async function PUT(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'privacy-status', 20, 60 * 60 * 1000);
    if (blocked) return blocked;

    const body = await request.json();
    const ticketNo = cleanText(body.ticketNo, 40).toUpperCase();
    const contact = cleanText(body.contact, 254);
    const notFound = jsonError('No request matches that ticket number and contact.', 404);
    if (!ticketNo || !contact) return notFound;

    const found = await prisma.privacyRequest.findUnique({ where: { ticketNo } });
    if (!found) return notFound;

    const email = normalizeEmail(contact);
    const phone = normalizePhone(contact);
    const matches =
      (email && found.email === email) ||
      (phone && found.phone && phoneMatchKey(found.phone) === phoneMatchKey(phone));
    if (!matches) return notFound;

    return NextResponse.json({
      success: true,
      ticketNo: found.ticketNo,
      type: found.type,
      status: found.status,
      submittedAt: found.createdAt,
      dueAt: found.dueAt,
      resolvedAt: found.resolvedAt,
    });
  } catch (error) {
    logError('privacy.requests.status', error);
    return jsonError('We could not check that request. Please try again.', 500);
  }
}
