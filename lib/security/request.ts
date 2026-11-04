import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { keyedHash } from './crypto';

/**
 * Only trust a header the deployment's reverse proxy overwrites. Set
 * CLIENT_IP_HEADER to that header. Otherwise the right-most x-forwarded-for hop
 * is used, because that entry is added by the nearest proxy, not by the client.
 */
export function clientIp(request: Request): string {
  const configured = process.env.CLIENT_IP_HEADER;
  if (configured) {
    const value = request.headers.get(configured);
    if (value) return value.split(',')[0].trim().replace(/^::ffff:/, '');
  }
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const hops = forwarded.split(',').map((hop) => hop.trim()).filter(Boolean);
    if (hops.length) return hops[hops.length - 1].replace(/^::ffff:/, '');
  }
  return 'unknown';
}

/** Rejects cross-site browser requests. Non-browser clients send no Origin. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Database-backed so limits survive restarts. Stores only a keyed hash of the IP. */
export async function isRateLimited(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  if (process.env.DISABLE_RATE_LIMIT === '1' && process.env.NODE_ENV !== 'production') return false;
  try {
    const keyHash = keyedHash(`rate:${clientIp(request)}`);
    const since = new Date(Date.now() - windowMs);
    const count = await prisma.rateLimitHit.count({ where: { bucket, keyHash, createdAt: { gte: since } } });
    if (count >= limit) return true;
    await prisma.rateLimitHit.create({ data: { bucket, keyHash } });
    return false;
  } catch (error) {
    logError('rateLimit', error);
    return false;
  }
}

/** Logs the error class and code only, because messages can echo submitted data. */
export function logError(scope: string, error: unknown): void {
  const e = error as Error;
  console.error(`[${scope}] ${e?.message || e}`);
}

export function jsonError(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

/** Guard shared by every public write endpoint. Returns a response when blocked. */
export async function guardPublicPost(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
): Promise<NextResponse | null> {
  if (!isSameOrigin(request)) return jsonError('Cross-site request rejected.', 403);
  if (await isRateLimited(request, bucket, limit, windowMs)) {
    return jsonError('Too many submissions. Please wait a few minutes.', 429);
  }
  return null;
}
