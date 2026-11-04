import { prisma } from '@/lib/prisma';
import { phoneMatchKey } from '@/lib/validation';

export interface Contact {
  email?: string | null;
  phone?: string | null;
}

type Row = { id: string; email: string | null; phone: string | null };

/**
 * Compares in code, on full normalised numbers. A SQL suffix match would treat
 * +19534095340 and 9534095340 as one person, and older rows can hold spaces or
 * prefixes that SQL cannot normalise.
 */
function rowMatches(row: Row, contact: Contact): boolean {
  const email = contact.email?.toLowerCase();
  if (email && row.email?.toLowerCase() === email) return true;
  return Boolean(contact.phone && row.phone && phoneMatchKey(row.phone) === phoneMatchKey(contact.phone));
}

const CONTACT_FIELDS = { id: true, email: true, phone: true } as const;

export async function matchingLeads(contact: Contact): Promise<Row[]> {
  if (!contact.email && !contact.phone) return [];
  const rows = await prisma.lead.findMany({ select: CONTACT_FIELDS });
  return rows.filter((row) => rowMatches(row, contact));
}

export async function matchingApplications(contact: Contact): Promise<Row[]> {
  if (!contact.email && !contact.phone) return [];
  const rows = await prisma.jobApplication.findMany({ select: CONTACT_FIELDS });
  return rows.filter((row) => rowMatches(row, contact));
}
