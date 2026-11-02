import { prisma } from '@/lib/prisma';
import { deleteResume } from '@/lib/privateStorage';
import { emailKey, phoneKey } from './consent';
import { propagate } from './connectors';
import { matchingApplications, matchingLeads, type Contact } from './matching';
import { PROCESSORS } from '@/data/privacy/processors';

export type { Contact };

function consentWhere(contact: Contact) {
  const or: Record<string, unknown>[] = [];
  const phone = phoneKey(contact.phone);
  const email = emailKey(contact.email);
  if (phone) or.push({ phoneKey: phone });
  if (email) or.push({ emailKey: email });
  return or;
}

/** Finds every record under the organisation's control for one verified contact. */
export async function findPersonalData(contact: Contact) {
  const consentOr = consentWhere(contact);
  const leadIds = (await matchingLeads(contact)).map((row) => row.id);
  const applicationIds = (await matchingApplications(contact)).map((row) => row.id);

  const [leads, applications, comments, consents, newsletter] = await Promise.all([
    prisma.lead.findMany({ where: { id: { in: leadIds } } }),
    prisma.jobApplication.findMany({ where: { id: { in: applicationIds } } }),
    contact.email ? prisma.comment.findMany({ where: { authorEmail: contact.email.toLowerCase() } }) : [],
    consentOr.length ? prisma.consentRecord.findMany({ where: { OR: consentOr }, orderBy: { createdAt: 'desc' } }) : [],
    contact.email ? prisma.newsletterSubscriber.findUnique({ where: { email: contact.email.toLowerCase() } }) : null,
  ]);

  return { leads, applications, comments, consents, newsletter };
}

/** The summary staff send to a verified requester, as section 11 of the Act requires. */
export async function buildAccessSummary(contact: Contact) {
  const data = await findPersonalData(contact);
  return {
    generatedAt: new Date().toISOString(),
    dataFiduciary: 'Technoculture Building Centre Private Limited (Vastu Vihar)',
    personalData: {
      enquiries: data.leads.map((lead) => ({
        submittedAt: lead.createdAt,
        name: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        city: lead.city,
        budget: lead.budget,
        project: lead.project,
        address: lead.address,
        message: lead.message,
        status: lead.status,
        marketingConsent: lead.marketingConsent,
        technicalData: { ipAddress: lead.ipAddress, country: lead.country, userAgent: lead.userAgent },
      })),
      jobApplications: data.applications.map((app) => ({
        submittedAt: app.createdAt,
        name: app.fullName,
        phone: app.phone,
        email: app.email,
        jobTitle: app.jobTitle,
        experience: app.experience,
        coverLetter: app.coverLetter,
        resumeOnFile: Boolean(app.resumePath),
        status: app.status,
      })),
      blogComments: data.comments.map((comment) => ({
        submittedAt: comment.createdAt,
        name: comment.authorName,
        email: comment.authorEmail,
        comment: comment.content,
        published: comment.isApproved,
      })),
      newsletter: data.newsletter
        ? {
            email: data.newsletter.email,
            status: data.newsletter.status,
            subscribedAt: data.newsletter.createdAt,
            unsubscribedAt: data.newsletter.unsubscribedAt,
          }
        : null,
    },
    consentHistory: data.consents.map((consent) => ({
      at: consent.createdAt,
      purpose: consent.purpose,
      action: consent.action,
      noticeVersion: consent.noticeVersion,
      language: consent.language,
    })),
    processingActivities: [
      'Responding to property enquiries',
      'Assessing job applications',
      'Moderating and publishing blog comments',
      'Sending marketing communications, only where separately consented',
      'Sending the newsletter, only where consented',
    ],
    sharedWith: PROCESSORS.filter((processor) => processor.receivesPersonalData).map((processor) => ({
      name: processor.name,
      role: processor.role,
      data: processor.data,
    })),
  };
}

/** Applies a verified correction across every store and re-keys the consent ledger. */
export async function applyCorrection(
  contact: Contact,
  changes: { fullName?: string; email?: string; phone?: string },
) {
  const person: Record<string, string> = {};
  if (changes.fullName) person.fullName = changes.fullName;
  if (changes.email) person.email = changes.email;
  if (changes.phone) person.phone = changes.phone;

  const leadIds = (await matchingLeads(contact)).map((row) => row.id);
  const applicationIds = (await matchingApplications(contact)).map((row) => row.id);
  const leads = await prisma.lead.updateMany({ where: { id: { in: leadIds } }, data: person });
  const applications = await prisma.jobApplication.updateMany({ where: { id: { in: applicationIds } }, data: person });

  const commentData: Record<string, string> = {};
  if (changes.fullName) commentData.authorName = changes.fullName;
  if (changes.email) commentData.authorEmail = changes.email;
  const comments = contact.email && Object.keys(commentData).length
    ? await prisma.comment.updateMany({ where: { authorEmail: contact.email.toLowerCase() }, data: commentData })
    : { count: 0 };

  // If the corrected address is already listed, that entry and its status stand.
  let newsletter = 0;
  const oldAddress = contact.email?.toLowerCase();
  const newAddress = changes.email?.toLowerCase();
  if (oldAddress && newAddress && oldAddress !== newAddress) {
    const taken = await prisma.newsletterSubscriber.findUnique({ where: { email: newAddress } });
    const { count } = taken
      ? await prisma.newsletterSubscriber.deleteMany({ where: { email: oldAddress } })
      : await prisma.newsletterSubscriber.updateMany({ where: { email: oldAddress }, data: { email: newAddress } });
    newsletter = count;
  }

  const oldPhone = phoneKey(contact.phone);
  const oldEmail = emailKey(contact.email);
  if (changes.phone && oldPhone) {
    await prisma.consentRecord.updateMany({ where: { phoneKey: oldPhone }, data: { phoneKey: phoneKey(changes.phone) } });
  }
  if (changes.email && oldEmail) {
    await prisma.consentRecord.updateMany({ where: { emailKey: oldEmail }, data: { emailKey: emailKey(changes.email) } });
  }

  const propagation = await propagate('correction', contact, { fields: Object.keys(person) });
  return { leads: leads.count, applications: applications.count, comments: comments.count, newsletter, propagation };
}

/**
 * Erases one contact's records. Anything under a documented legal hold is kept and
 * reported back, so the outcome can record the exception. Consent records survive
 * because they hold only keyed hashes and evidence that consent was handled lawfully.
 */
export async function eraseContact(contact: Contact) {
  const { leads, applications, comments, newsletter } = await findPersonalData(contact);

  const heldLeads = leads.filter((lead) => lead.legalHoldReason);
  const heldApps = applications.filter((app) => app.legalHoldReason);
  const eraseLeads = leads.filter((lead) => !lead.legalHoldReason);
  const eraseApps = applications.filter((app) => !app.legalHoldReason);

  // All rows go together or not at all. The hold is rechecked at delete time, so a
  // hold placed moments ago still wins, and only rows actually deleted lose their files.
  const leadIds = eraseLeads.map((lead) => lead.id);
  const appIds = eraseApps.map((app) => app.id);
  const stillHeldApps = await prisma.$transaction(async (tx) => {
    const held = await tx.jobApplication.findMany({
      where: { id: { in: appIds }, NOT: { legalHoldReason: null } },
      select: { id: true },
    });
    await tx.lead.deleteMany({ where: { id: { in: leadIds }, legalHoldReason: null } });
    await tx.jobApplication.deleteMany({ where: { id: { in: appIds }, legalHoldReason: null } });
    await tx.comment.deleteMany({ where: { id: { in: comments.map((comment) => comment.id) } } });
    if (newsletter) await tx.newsletterSubscriber.deleteMany({ where: { id: newsletter.id } });
    return new Set(held.map((row) => row.id));
  });

  // A file that cannot be removed must be reported, because no row now points to it.
  const filesNotRemoved: string[] = [];
  for (const app of eraseApps) {
    if (stillHeldApps.has(app.id)) continue;
    try {
      await deleteResume(app.resumePath);
    } catch {
      if (app.resumePath) filesNotRemoved.push(app.resumePath);
    }
  }

  const propagation = await propagate('erasure', contact);
  return {
    erased: {
      leads: eraseLeads.length,
      applications: eraseApps.length - stillHeldApps.size,
      comments: comments.length,
      newsletter: newsletter ? 1 : 0,
    },
    filesNotRemoved,
    retained: {
      leads: heldLeads.map((lead) => ({ id: lead.id, reason: lead.legalHoldReason })),
      applications: heldApps.map((app) => ({ id: app.id, reason: app.legalHoldReason })),
    },
    propagation,
  };
}
