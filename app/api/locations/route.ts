// src/app/api/locations/route.ts
// JSON view of the map locations. The home page reads them directly on the server
// via getMapLocations(); this endpoint stays for any external consumers.
import { NextResponse } from 'next/server';
import { getSheetLocations } from '@/lib/locations';

export type { LocationItem } from '@/lib/locations';

export async function GET() {
  const locations = await getSheetLocations();
  return NextResponse.json({ locations });
}
