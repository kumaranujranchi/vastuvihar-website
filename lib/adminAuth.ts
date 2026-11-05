import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseReady } from '@/lib/dbBootstrap';
import { keyedHash, randomToken, sha256 } from '@/lib/security/crypto';
import { isSameOrigin, jsonError } from '@/lib/security/request';

export const COOKIE_NAME = 'vv_admin_session';
export const SESSION_HOURS = 10;

export const PERMISSIONS = [
  'leads:read',
  'leads:write',
  'leads:export',
  'applications:read',
  'applications:write',
  'vacancies:manage',
  'blogs:manage',
  'gallery:manage',
  'comments:moderate',
  'newsletter:manage',
  'privacy:read',
  'privacy:manage',
  'breach:manage',
  'retention:manage',
  'audit:read',
  'users:manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
  SUPER_ADMIN: PERMISSIONS,
  PRIVACY_OFFICER: [
    'leads:read',
    'applications:read',
    'comments:moderate',
    'newsletter:manage',
    'privacy:read',
    'privacy:manage',
    'breach:manage',
    'retention:manage',
    'audit:read',
  ],
  SALES: ['leads:read', 'leads:write', 'leads:export'],
  HR: ['applications:read', 'applications:write', 'vacancies:manage'],
  CONTENT: ['blogs:manage', 'gallery:manage', 'comments:moderate', 'newsletter:manage'],
};

export const ROLES = Object.keys(ROLE_PERMISSIONS);

export interface AdminPrincipal {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: readonly Permission[];
}

export const MASTER_ADMIN: AdminPrincipal = {
  id: 'admin_master',
  email: 'info@vastuvihar.org',
  name: 'Vastu Vihar Admin',
  role: 'SUPER_ADMIN',
  permissions: PERMISSIONS,
};

export async function getCurrentAdmin(): Promise<AdminPrincipal | null> {
  await ensureDatabaseReady();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  // Check fallback signed token (e.g. for edge workers where SQLite is unreachable)
  if (token.includes('.')) {
    const [payloadB64, sig] = token.split('.');
    try {
      const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf8');
      if (keyedHash(payloadStr) === sig) {
        const payload = JSON.parse(payloadStr);
        if (payload.exp > Date.now()) {
          return {
            ...MASTER_ADMIN,
            email: payload.email || MASTER_ADMIN.email,
          };
        }
      }
    } catch {}
  }

  try {
    const session = await prisma.adminSession.findUnique({
      where: { tokenHash: sha256(token) },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date() || !session.user.isActive) return null;

    const { user } = session;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role] || [],
    };
  } catch {
    return null;
  }
}

/** Every admin route calls this. It returns either the principal or a response. */
export async function requirePermission(
  request: Request,
  permission?: Permission,
): Promise<{ admin: AdminPrincipal; response?: undefined } | { admin?: undefined; response: NextResponse }> {
  if (request.method !== 'GET' && !isSameOrigin(request)) {
    return { response: jsonError('Cross-site request rejected.', 403) };
  }
  const admin = await getCurrentAdmin();
  if (!admin) return { response: jsonError('Unauthorized', 401) };
  if (permission && !admin.permissions.includes(permission)) {
    return { response: jsonError('You do not have permission for this action.', 403) };
  }
  return { admin };
}

export async function startSession(userId: string): Promise<void> {
  await ensureDatabaseReady();
  const token = randomToken();
  const maxAge = SESSION_HOURS * 60 * 60;
  try {
    await prisma.adminSession.create({
      data: {
        tokenHash: sha256(token),
        userId,
        expiresAt: new Date(Date.now() + maxAge * 1000),
      },
    });
  } catch {}
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function startFallbackSession(email: string): Promise<void> {
  const maxAge = SESSION_HOURS * 60 * 60;
  const payload = JSON.stringify({ email, exp: Date.now() + maxAge * 1000 });
  const signature = keyedHash(payload);
  const token = Buffer.from(payload).toString('base64url') + '.' + signature;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token && !token.includes('.')) {
    try {
      await prisma.adminSession.deleteMany({ where: { tokenHash: sha256(token) } });
    } catch {}
  }
  cookieStore.delete(COOKIE_NAME);
}
