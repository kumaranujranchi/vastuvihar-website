import { NextResponse } from 'next/server';
import { guardPublicPost, jsonError, logError } from '@/lib/security/request';
import { cleanText, oneOf } from '@/lib/validation';
import { noticeLanguage, recordConsent } from '@/lib/privacy/consent';
import { CATEGORY_PURPOSES } from '@/lib/privacy/cookieConfig';
import { deleteVisitorEvents } from '@/lib/privacy/visitorLog';
import { keyedHash } from '@/lib/security/crypto';

const SOURCES = ['cookie_banner', 'embed', 'privacy_policy'] as const;

/** Logs a browser's cookie choices against a random browser ID, with no contact data or IP. */
export async function POST(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'cookie-consent', 30, 60 * 60 * 1000);
    if (blocked) return blocked;

    const body = await request.json();
    const browserId = cleanText(body.browserId, 64);
    if (!/^[a-f0-9]{16,64}$/.test(browserId)) return jsonError('Invalid browser identifier.', 400);

    const entries = Object.entries(CATEGORY_PURPOSES).filter(
      ([category]) => typeof body.choices?.[category] === 'boolean',
    );
    if (!entries.length) return jsonError('No cookie choice was given.', 400);

    const browserKey = keyedHash(`browser:${browserId}`);
    const language = noticeLanguage(body.noticeLanguage);
    const source = oneOf(body.source, SOURCES) || 'cookie_banner';
    for (const [category, purpose] of entries) {
      await recordConsent({
        browserKey,
        recordType: 'browser',
        purpose,
        action: body.choices[category] ? 'GRANTED' : 'WITHDRAWN',
        language,
        source,
      });
    }
    await deleteVisitorEvents(
      browserKey,
      (['analytics', 'advertising'] as const).filter((category) => body.choices?.[category] === false),
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    logError('privacy.cookie_consent', error);
    return jsonError('Could not record that choice.', 500);
  }
}
