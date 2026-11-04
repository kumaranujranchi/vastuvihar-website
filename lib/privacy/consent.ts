import { prisma } from '@/lib/prisma';
import { keyedHash } from '@/lib/security/crypto';
import { phoneMatchKey } from '@/lib/validation';
import { matchingLeads } from './matching';
import { LANGUAGES, NOTICE_VERSION, PURPOSES } from './notices';

export const phoneKey = (phone?: string | null) => (phone ? keyedHash(`phone:${phoneMatchKey(phone)}`) : null);
export const emailKey = (email?: string | null) => (email ? keyedHash(`email:${email.toLowerCase()}`) : null);

export function noticeLanguage(value: unknown): string {
  return LANGUAGES.some((language) => language.code === value) ? (value as string) : 'en';
}

interface ConsentInput {
  phone?: string | null;
  email?: string | null;
  browserKey?: string | null;
  recordType?: string;
  recordId?: string;
  purpose: string;
  action: 'GRANTED' | 'WITHDRAWN';
  language?: string;
  source: string;
}

export async function recordConsent(input: ConsentInput) {
  return prisma.consentRecord.create({
    data: {
      phoneKey: phoneKey(input.phone),
      emailKey: emailKey(input.email),
      browserKey: input.browserKey || null,
      recordType: input.recordType,
      recordId: input.recordId,
      purpose: input.purpose,
      action: input.action,
      noticeVersion: NOTICE_VERSION,
      language: input.language || 'en',
      source: input.source,
    },
  });
}

/**
 * Website forms cannot prove who is typing, so a form tick never overrides an
 * opt-out: otherwise anyone could re-subscribe someone else by entering their number.
 */
export async function isSuppressed(phone?: string | null, email?: string | null): Promise<boolean> {
  const keys = [phoneKey(phone), emailKey(email)].filter(Boolean) as string[];
  if (!keys.length) return false;
  return (await prisma.marketingSuppression.count({ where: { key: { in: keys } } })) > 0;
}

/**
 * Stops marketing for a contact everywhere, including the other phone or email on
 * the same enquiries. Opting out needs no identity check, because the only effect
 * is fewer messages. The caller's response must not reveal whether the contact exists.
 */
export async function withdrawMarketing(
  contact: { phone?: string | null; email?: string | null },
  source: string,
): Promise<number> {
  const { phone, email } = contact;
  if (!phone && !email) return 0;

  const direct = await matchingLeads(contact);
  const linkedPhones = new Set(direct.map((row) => row.phone).filter(Boolean) as string[]);
  const linkedEmails = new Set(direct.map((row) => row.email).filter(Boolean) as string[]);
  if (phone) linkedPhones.add(phone);
  if (email) linkedEmails.add(email);

  const ids = new Set(direct.map((row) => row.id));
  for (const linked of linkedPhones) {
    for (const row of await matchingLeads({ phone: linked })) ids.add(row.id);
  }
  for (const linked of linkedEmails) {
    for (const row of await matchingLeads({ email: linked })) ids.add(row.id);
  }

  const { count } = await prisma.lead.updateMany({
    where: { id: { in: [...ids] }, marketingConsent: true },
    data: { marketingConsent: false, marketingWithdrawnAt: new Date() },
  });

  const keys = [...[...linkedPhones].map(phoneKey), ...[...linkedEmails].map(emailKey)].filter(Boolean) as string[];
  for (const key of new Set(keys)) {
    await prisma.marketingSuppression.upsert({ where: { key }, update: {}, create: { key, source } });
  }

  await recordConsent({ phone, email, purpose: PURPOSES.MARKETING, action: 'WITHDRAWN', source });

  // The newsletter notice names Stop Marketing as the way to unsubscribe.
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { email: { in: [...linkedEmails].map((linked) => linked.toLowerCase()) }, status: 'SUBSCRIBED' },
  });
  for (const subscriber of subscribers) {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
    });
    await recordConsent({
      email: subscriber.email,
      recordType: 'newsletter',
      recordId: subscriber.id,
      purpose: PURPOSES.NEWSLETTER,
      action: 'WITHDRAWN',
      source,
    });
  }

  const { propagate } = await import('./connectors');
  await propagate('marketing_withdrawn', { phone, email });
  return count;
}
