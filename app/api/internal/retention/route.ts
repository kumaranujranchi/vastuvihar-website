import { NextResponse } from 'next/server';
import { safeEqual } from '@/lib/security/crypto';
import { jsonError, logError } from '@/lib/security/request';
import { runRetention } from '@/lib/privacy/retention';

/** Called by a scheduled job on the server. Disabled unless RETENTION_CRON_SECRET is set. */
export async function POST(request: Request) {
  const secret = process.env.RETENTION_CRON_SECRET;
  const supplied = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!secret || secret.length < 32 || !supplied || !safeEqual(supplied, secret)) {
    return jsonError('Unauthorized', 401);
  }
  try {
    const dryRun = new URL(request.url).searchParams.get('dryRun') === '1';
    return NextResponse.json({ success: true, ...(await runRetention({ dryRun, trigger: 'cron' })) });
  } catch (error) {
    logError('retention.cron', error);
    return jsonError('Retention run failed.', 500);
  }
}
