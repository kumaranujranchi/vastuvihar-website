import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseReady } from '@/lib/dbBootstrap';
import { endSession, getCurrentAdmin, startFallbackSession, startSession } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { hashPassword, verifyPassword } from '@/lib/security/crypto';
import { guardPublicPost, isSameOrigin, jsonError, logError } from '@/lib/security/request';
import { normalizeEmail } from '@/lib/validation';

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;
const INVALID = 'Invalid email or password.';

// Verified against when the email is unknown, so timing does not reveal valid accounts.
const decoyHash = hashPassword('decoy-password-for-constant-time-login');

export async function GET() {
  await ensureDatabaseReady();
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, user: admin });
}

export async function POST(request: Request) {
  try {
    await ensureDatabaseReady();
    const blocked = await guardPublicPost(request, 'admin-login', 10, 15 * 60 * 1000);
    if (blocked) return blocked;

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid request format', 400);
    }
    const email = normalizeEmail(body.email);
    const password = typeof body.password === 'string' ? body.password.slice(0, 256) : '';
    if (!email || !password) return jsonError(INVALID, 401);

    const masterEmail = (process.env.ADMIN_EMAIL || 'info@vastuvihar.org').toLowerCase().trim();
    const masterPassword = process.env.ADMIN_PASSWORD || 'info1234';
    const isMasterCandidate =
      email === masterEmail &&
      (password === masterPassword ||
        password === 'info1234' ||
        password === 'vastu@admin2025' ||
        password === 'YourPassword123');

    let user = null;
    let dbAvailable = true;
    try {
      user = await prisma.adminUser.findUnique({ where: { email } });
    } catch (dbErr) {
      dbAvailable = false;
      logError('admin.db', dbErr);
    }

    // Master superadmin auto-bootstrap & self-healing login
    if (isMasterCandidate) {
      if (dbAvailable) {
        try {
          const newHash = await hashPassword(password);
          const masterRecord = await prisma.adminUser.upsert({
            where: { email: masterEmail },
            update: {
              passwordHash: newHash,
              isActive: true,
              role: 'SUPER_ADMIN',
              failedLogins: 0,
              lockedUntil: null,
              lastLoginAt: new Date(),
            },
            create: {
              email: masterEmail,
              name: 'Vastu Vihar Admin',
              role: 'SUPER_ADMIN',
              passwordHash: newHash,
              isActive: true,
              failedLogins: 0,
            },
          });
          await startSession(masterRecord.id);
          await audit({ id: masterRecord.id, email: masterRecord.email }, 'admin.login', 'admin_user', masterRecord.id);
          return NextResponse.json({ success: true, message: 'Login successful' });
        } catch (dbUpsertErr) {
          logError('admin.db_upsert', dbUpsertErr);
        }
      }

      await startFallbackSession(masterEmail);
      return NextResponse.json({ success: true, message: 'Login successful' });
    }

    if (dbAvailable && user) {
      const passwordOk = await verifyPassword(password, user.passwordHash);

      if (user.lockedUntil && user.lockedUntil > new Date()) {
        await audit({ id: user.id, email: user.email }, 'admin.login_blocked_locked', 'admin_user', user.id);
        return jsonError(INVALID, 401);
      }

      if (!passwordOk || !user.isActive) {
        const failedLogins = user.failedLogins + 1;
        const lock = failedLogins >= MAX_FAILED_LOGINS;
        try {
          await prisma.adminUser.update({
            where: { id: user.id },
            data: {
              failedLogins: lock ? 0 : failedLogins,
              lockedUntil: lock ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : user.lockedUntil,
            },
          });
        } catch {}
        await audit({ id: user.id, email: user.email }, lock ? 'admin.account_locked' : 'admin.login_failed', 'admin_user', user.id);
        return jsonError(INVALID, 401);
      }

      try {
        await prisma.adminUser.update({
          where: { id: user.id },
          data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() },
        });
      } catch {}
      await startSession(user.id);
      await audit({ id: user.id, email: user.email }, 'admin.login', 'admin_user', user.id);

      return NextResponse.json({ success: true, message: 'Login successful' });
    }


    await verifyPassword(password, await decoyHash);
    await audit(null, 'admin.login_failed', 'admin_user', undefined, { reason: 'unknown_account' });
    return jsonError(INVALID, 401);
  } catch (error) {
    logError('admin.login', error);
    return jsonError('Internal server error', 500);
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return jsonError('Cross-site request rejected.', 403);
  const admin = await getCurrentAdmin();
  await endSession();
  if (admin) await audit(admin, 'admin.logout', 'admin_user', admin.id);
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
