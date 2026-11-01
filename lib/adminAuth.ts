import { cookies } from 'next/headers';

const COOKIE_NAME = 'vv_admin_token';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'vastu@admin2025';

export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === Buffer.from(DEFAULT_PASSWORD).toString('base64');
}

export function getAdminToken(): string {
  return Buffer.from(DEFAULT_PASSWORD).toString('base64');
}

export { COOKIE_NAME, DEFAULT_PASSWORD };
