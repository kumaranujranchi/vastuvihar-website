import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, type AdminPrincipal } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText, normalizeEmail, normalizePhone, oneOf } from '@/lib/validation';
import { recordConsent, withdrawMarketing } from '@/lib/privacy/consent';
import { PURPOSES } from '@/lib/privacy/notices';
import { applyCorrection, buildAccessSummary, eraseContact, findPersonalData } from '@/lib/privacy/dataSubject';

type Params = { params: Promise<{ id: string }> };

const ACTIONS = [
  'START_VERIFICATION',
  'VERIFY',
  'SET_STATUS',
  'ADD_NOTE',
  'APPLY_CORRECTION',
  'APPLY_ERASURE',
  'WITHDRAW_CONSENT',
  'GENERATE_ACCESS_SUMMARY',
  'RESOLVE',
  'REJECT',
] as const;

const SETTABLE = ['RECEIVED', 'VERIFYING', 'IN_PROGRESS', 'ESCALATED'] as const;
const NEEDS_VERIFICATION = new Set(['APPLY_CORRECTION', 'APPLY_ERASURE', 'WITHDRAW_CONSENT', 'GENERATE_ACCESS_SUMMARY']);

// Only the contact channels staff actually confirmed count. Otherwise someone could
// pair their own email with a victim's phone, verify the email and reach the victim's data.
function verifiedContact(item: { email: string | null; phone: string | null; verifiedChannels: string | null }) {
  const channels = (item.verifiedChannels || '').split(',');
  return {
    email: channels.includes('email') ? item.email : null,
    phone: channels.includes('phone') ? item.phone : null,
  };
}

// Each data action is valid only for the kind of request that asked for it.
const ALLOWED_FOR_TYPE: Record<string, string[]> = {
  GENERATE_ACCESS_SUMMARY: ['ACCESS'],
  APPLY_CORRECTION: ['CORRECTION'],
  APPLY_ERASURE: ['ERASURE', 'CONSENT_WITHDRAWAL'],
  WITHDRAW_CONSENT: ['CONSENT_WITHDRAWAL'],
};

/** Before identity is verified staff see only counts. Record references follow verification. */
export async function GET(request: Request, { params }: Params) {
  const { admin, response } = await requirePermission(request, 'privacy:read');
  if (!admin) return response;

  try {
    const { id } = await params;
    const item = await prisma.privacyRequest.findUnique({
      where: { id },
      include: { events: { orderBy: { createdAt: 'asc' } } },
    });
    if (!item) return jsonError('Request not found', 404);

    const data = await findPersonalData(item.verifiedAt ? verifiedContact(item) : { email: item.email, phone: item.phone });
    await audit(admin, 'privacy_request.viewed', 'privacy_request', id);

    return NextResponse.json({
      success: true,
      request: item,
      matches: {
        leads: data.leads.length,
        applications: data.applications.length,
        comments: data.comments.length,
        consents: data.consents.length,
        newsletter: data.newsletter ? 1 : 0,
        legalHolds:
          data.leads.filter((lead) => lead.legalHoldReason).length +
          data.applications.filter((app) => app.legalHoldReason).length,
      },
      records: item.verifiedAt
        ? [
            ...data.leads.map((lead) => ({
              recordType: 'lead',
              id: lead.id,
              label: `Enquiry, ${lead.createdAt.toISOString().slice(0, 10)}, status ${lead.status}`,
              legalHoldReason: lead.legalHoldReason,
            })),
            ...data.applications.map((app) => ({
              recordType: 'application',
              id: app.id,
              label: `Job application, ${app.createdAt.toISOString().slice(0, 10)}, status ${app.status}`,
              legalHoldReason: app.legalHoldReason,
            })),
          ]
        : [],
    });
  } catch (error) {
    logError('admin.privacy.requests.view', error);
    return jsonError('Failed to load request', 500);
  }
}

async function addEvent(requestId: string, admin: AdminPrincipal, action: string, note?: string) {
  await prisma.privacyRequestEvent.create({
    data: { requestId, actorEmail: admin.email, action, note: note || null },
  });
}

export async function POST(request: Request, { params }: Params) {
  const { admin, response } = await requirePermission(request, 'privacy:manage');
  if (!admin) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const action = oneOf(body.action, ACTIONS);
    if (!action) return jsonError('Unknown action', 400);

    const item = await prisma.privacyRequest.findUnique({ where: { id } });
    if (!item) return jsonError('Request not found', 404);

    if (NEEDS_VERIFICATION.has(action) && !item.verifiedAt) {
      return jsonError("Verify the requester's identity before acting on their data.", 409);
    }
    if (['RESOLVED', 'REJECTED'].includes(item.status) && action !== 'ADD_NOTE') {
      return jsonError('This request is closed. Ask the person to raise a new one.', 409);
    }
    if (ALLOWED_FOR_TYPE[action] && !ALLOWED_FOR_TYPE[action].includes(item.type)) {
      return jsonError('That action does not apply to this type of request.', 409);
    }

    const note = cleanText(body.note, 2000);
    const contact = verifiedContact(item);
    let result: unknown = null;

    switch (action) {
      case 'START_VERIFICATION':
        await prisma.privacyRequest.update({ where: { id }, data: { status: 'VERIFYING' } });
        await addEvent(id, admin, 'VERIFICATION_STARTED', note);
        break;

      case 'VERIFY': {
        const method = cleanText(body.method, 200);
        if (!method) return jsonError('Record how identity was verified.', 400);
        const requested: unknown[] = Array.isArray(body.channels) ? body.channels : [];
        const channels = [
          ...(requested.includes('email') && item.email ? ['email'] : []),
          ...(requested.includes('phone') && item.phone ? ['phone'] : []),
        ];
        if (!channels.length) return jsonError('Select which contact detail you confirmed belongs to this person.', 400);
        await prisma.privacyRequest.update({
          where: { id },
          data: {
            verifiedAt: new Date(),
            verifiedBy: admin.email,
            verifyMethod: method,
            verifiedChannels: channels.join(','),
            status: 'IN_PROGRESS',
          },
        });
        await addEvent(id, admin, 'IDENTITY_VERIFIED', `${channels.join(' and ')}: ${method}`);
        break;
      }

      case 'SET_STATUS': {
        const status = oneOf(body.status, SETTABLE);
        if (!status) return jsonError('Invalid status', 400);
        await prisma.privacyRequest.update({ where: { id }, data: { status } });
        await addEvent(id, admin, `STATUS_${status}`, note);
        break;
      }

      case 'ADD_NOTE':
        if (!note) return jsonError('A note is required.', 400);
        await addEvent(id, admin, 'NOTE', note);
        break;

      case 'APPLY_CORRECTION': {
        const changes: { fullName?: string; email?: string; phone?: string } = {};
        const fullName = cleanText(body.fullName, 120);
        if (fullName) changes.fullName = fullName;
        if (body.email) {
          const email = normalizeEmail(body.email);
          if (!email) return jsonError('Invalid corrected email.', 400);
          changes.email = email;
        }
        if (body.phone) {
          const phone = normalizePhone(body.phone);
          if (!phone) return jsonError('Invalid corrected phone number.', 400);
          changes.phone = phone;
        }
        if (!Object.keys(changes).length) return jsonError('Nothing to correct.', 400);

        result = await applyCorrection(contact, changes);
        await addEvent(id, admin, 'CORRECTION_APPLIED', `Fields: ${Object.keys(changes).join(', ')}. Result: ${JSON.stringify(result)}`);
        await audit(admin, 'privacy_request.correction_applied', 'privacy_request', id, { fields: Object.keys(changes) });
        break;
      }

      case 'APPLY_ERASURE': {
        result = await eraseContact(contact);
        const retained = (result as Awaited<ReturnType<typeof eraseContact>>).retained;
        const heldCount = retained.leads.length + retained.applications.length;
        await prisma.privacyRequest.update({
          where: { id },
          data: {
            retentionNote: (result as Awaited<ReturnType<typeof eraseContact>>).filesNotRemoved.length
              ? 'Some resume files could not be removed. See the history and remove them by hand.'
              : heldCount
              ? `${heldCount} record(s) retained under legal hold: ${[...retained.leads, ...retained.applications].map((held) => held.reason).join('; ')}`
              : null,
          },
        });
        await addEvent(id, admin, 'ERASURE_APPLIED', JSON.stringify(result));
        await audit(admin, 'privacy_request.erasure_applied', 'privacy_request', id, {
          erased: (result as Awaited<ReturnType<typeof eraseContact>>).erased,
          retained: heldCount,
        });
        break;
      }

      case 'WITHDRAW_CONSENT': {
        const source = `privacy_request:${item.ticketNo}`;
        const updated = await withdrawMarketing(contact, source);

        // Record the withdrawal for every other purpose this contact consented to,
        // and stop follow-up. Staff then apply erasure unless a legal hold applies.
        const { leads, consents } = await findPersonalData(contact);
        const purposes = [...new Set(consents.map((consent) => consent.purpose))].filter(
          // withdrawMarketing has already recorded both of these.
          (purpose) => purpose !== PURPOSES.MARKETING && purpose !== PURPOSES.NEWSLETTER,
        );
        for (const purpose of purposes) {
          await recordConsent({ ...contact, purpose, action: 'WITHDRAWN', language: item.language, source });
        }
        await prisma.lead.updateMany({
          where: { id: { in: leads.map((lead) => lead.id) }, legalHoldReason: null },
          data: { status: 'CLOSED' },
        });

        result = { marketingRecordsUpdated: updated, purposesWithdrawn: purposes };
        await addEvent(id, admin, 'CONSENT_WITHDRAWN', JSON.stringify(result));
        await audit(admin, 'privacy_request.consent_withdrawn', 'privacy_request', id, { updated });
        break;
      }

      case 'GENERATE_ACCESS_SUMMARY':
        result = await buildAccessSummary(contact);
        await addEvent(id, admin, 'ACCESS_SUMMARY_GENERATED');
        await audit(admin, 'privacy_request.access_summary_generated', 'privacy_request', id);
        break;

      case 'RESOLVE':
      case 'REJECT': {
        if (!note) return jsonError('Record the outcome before closing this request.', 400);
        const status = action === 'RESOLVE' ? 'RESOLVED' : 'REJECTED';
        await prisma.privacyRequest.update({
          where: { id },
          data: { status, outcome: note, resolvedAt: new Date() },
        });
        await addEvent(id, admin, status, note);
        await audit(admin, `privacy_request.${status.toLowerCase()}`, 'privacy_request', id);
        break;
      }
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    logError('admin.privacy.requests.action', error);
    return jsonError('The action failed and may be incomplete. Check the history, then retry.', 500);
  }
}
