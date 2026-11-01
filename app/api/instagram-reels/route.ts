// src/app/api/instagram-reels/route.ts
// JSON view of the Instagram reels. The home page reads them directly on the server
// via getReels(); this endpoint stays for any external consumers.
import { NextResponse } from 'next/server';
import { getInstagramReels } from '@/lib/reels';

export async function GET() {
  return NextResponse.json(await getInstagramReels());
}
