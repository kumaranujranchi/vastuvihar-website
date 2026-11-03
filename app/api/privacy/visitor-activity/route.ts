import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardPublicPost, jsonError, logError } from '@/lib/security/request';
import { allowedCategories, browserKeyFor, toVisitorEventRow } from '@/lib/privacy/visitorLog';

const MAX_EVENTS = 25;

/**
 * Logs what happened in a browser whose visitor allowed analytics or advertising. The
 * consent ledger is checked here too, so a request cannot log a category that was refused.
 */
export async function POST(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'visitor-activity', 600, 60 * 60 * 1000);
    if (blocked) return blocked;

    const body = await request.json();
    const browserKey = browserKeyFor(body.browserId);
    if (!browserKey) return jsonError('Invalid browser identifier.', 400);
    if (!Array.isArray(body.events) || !body.events.length || body.events.length > MAX_EVENTS) {
      return jsonError('Invalid events.', 400);
    }

    const allowed = await allowedCategories(browserKey);
    const data = body.events
      .map((event: unknown) => toVisitorEventRow(event, browserKey, allowed))
      .filter((row: unknown): row is NonNullable<typeof row> => Boolean(row));
    if (data.length) await prisma.visitorEvent.createMany({ data });

    return NextResponse.json({ success: true, stored: data.length }, { status: 201 });
  } catch (error) {
    logError('privacy.visitor_activity', error);
    return jsonError('Could not record that activity.', 500);
  }
}
