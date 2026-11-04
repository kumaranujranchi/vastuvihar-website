import { prisma } from '@/lib/prisma';
import { keyedHash } from '@/lib/security/crypto';
import { cleanText, oneOf } from '@/lib/validation';
import { AD_CHANNELS, CATEGORY_PURPOSES, TAG_EVENTS, TRACKED_COOKIES } from './cookieConfig';
import { NOTICE_VERSION } from './notices';

export type LoggedCategory = 'analytics' | 'advertising';

const LOGGED_CATEGORIES: LoggedCategory[] = ['analytics', 'advertising'];
const MAX_COOKIES_PER_ROW = 10;

const BROWSER_ID = /^[a-f0-9]{16,64}$/;
// Campaign names are plain labels. This also keeps out an email address pasted into a link.
const UTM_VALUE = /^[\p{L}\p{N} ._:+\-/]{1,100}$/u;
const PAGE_PATH = /^\/[\p{L}\p{N}._~\-/]{0,199}$/u;

export const browserKeyFor = (browserId: unknown): string | null => {
  const id = cleanText(browserId, 64);
  return BROWSER_ID.test(id) ? keyedHash(`browser:${id}`) : null;
};

/** The categories this browser's latest choice allows, under the current notice wording. */
export async function allowedCategories(browserKey: string): Promise<Set<LoggedCategory>> {
  const allowed = new Set<LoggedCategory>();
  for (const category of LOGGED_CATEGORIES) {
    const latest = await prisma.consentRecord.findFirst({
      where: { browserKey, recordType: 'browser', purpose: CATEGORY_PURPOSES[category] },
      orderBy: { createdAt: 'desc' },
      select: { action: true, noticeVersion: true },
    });
    if (latest?.action === 'GRANTED' && latest.noticeVersion === NOTICE_VERSION) allowed.add(category);
  }
  return allowed;
}

function cleanUtm(value: unknown): string | null {
  const text = cleanText(value, 100);
  return UTM_VALUE.test(text) ? text : null;
}

function cleanAdSource(input: unknown) {
  const source = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const adChannel = oneOf(source.channel, AD_CHANNELS as string[]);
  if (!adChannel) return {};
  return {
    adChannel,
    adUtmSource: cleanUtm(source.utmSource),
    adUtmMedium: cleanUtm(source.utmMedium),
    adUtmCampaign: cleanUtm(source.utmCampaign),
  };
}

/** The ad source to save on an enquiry. Bad input gives nothing, and never blocks the enquiry. */
export async function adSourceForLead(browserId: unknown, adSource: unknown) {
  const browserKey = browserKeyFor(browserId);
  if (!browserKey) return {};
  const allowed = await allowedCategories(browserKey);
  return allowed.has('advertising') ? cleanAdSource(adSource) : {};
}

function cleanPath(value: unknown): string | null {
  const path = cleanText(value, 200);
  return PAGE_PATH.test(path) && !path.startsWith('/admin') ? path : null;
}

/** Turns one submitted event into a row, or null if it is malformed or not allowed. */
export function toVisitorEventRow(input: unknown, browserKey: string, allowed: Set<LoggedCategory>) {
  const event = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const category = oneOf(event.category, LOGGED_CATEGORIES);
  if (!category || !allowed.has(category)) return null;
  const path = cleanPath(event.path);
  if (!path) return null;
  const base = { browserKey, category, path, noticeVersion: NOTICE_VERSION };

  if (event.kind === 'page_view') {
    const names = Array.isArray(event.cookies) ? event.cookies : [];
    const cookies = [...new Set(names.map((name) => cleanText(name, 64)))]
      .filter((name) => TRACKED_COOKIES[category].test(name))
      .slice(0, MAX_COOKIES_PER_ROW);
    return {
      ...base,
      kind: 'page_view',
      cookies: cookies.join(',') || null,
      ...(category === 'advertising' ? cleanAdSource(event.adSource) : {}),
    };
  }

  if (event.kind === 'tag_event') {
    const provider = oneOf(event.provider, Object.keys(TAG_EVENTS));
    if (!provider) return null;
    const tag = TAG_EVENTS[provider as keyof typeof TAG_EVENTS];
    const eventName = oneOf(event.eventName, tag.events);
    if (!eventName || !tag.categories.includes(category)) return null;
    return { ...base, kind: 'tag_event', provider, eventName };
  }

  return null;
}

/** Withdrawing a category removes what was logged under it. The consent ledger stays as proof. */
export async function deleteVisitorEvents(browserKey: string, categories: LoggedCategory[]) {
  if (!categories.length) return;
  await prisma.visitorEvent.deleteMany({ where: { browserKey, category: { in: categories } } });
}

export function parseLogDate(value: string | null, endOfDay = false): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** The start of the keyed hash, so one browser's history can be followed across both logs. */
export const visitorCode = (browserKey: string | null) => (browserKey ? browserKey.slice(0, 10) : '');
