import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, ROLES } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { hashPassword } from '@/lib/security/crypto';
import { jsonError, logError } from '@/lib/security/request';
import { cleanText, normalizeEmail, oneOf } from '@/lib/validation';

const SAFE_FIELDS = { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, lockedUntil: true, createdAt: true };

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'users:manage');
  if (!admin) return response;
  try {
    const users = await prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' }, select: SAFE_FIELDS });
    return NextResponse.json({ success: true, users, roles: ROLES });
  } catch (error) {
    logError('admin.users.list', error);
    return jsonError('Failed to load users', 500);
  }
}

export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'users:manage');
  if (!admin) return response;
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const name = cleanText(body.name, 120);
    const role = oneOf(body.role, ROLES);
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !name || !role) return jsonError('Name, email and role are required.', 400);
    if (password.length < 12) return jsonError('The password must have at least 12 characters.', 400);
    if (await prisma.adminUser.findUnique({ where: { email } })) return jsonError('That email already has an account.', 409);

    const user = await prisma.adminUser.create({
      data: { email, name, role, passwordHash: await hashPassword(password) },
      select: SAFE_FIELDS,
    });
    await audit(admin, 'admin_user.created', 'admin_user', user.id, { role });
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    logError('admin.users.create', error);
    return jsonError('Failed to create user', 500);
  }
}

export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'users:manage');
  if (!admin) return response;
  try {
    const body = await request.json();
    const id = cleanText(body.id, 64);
    if (!id) return jsonError('User ID required', 400);
    if (id === admin.id && (body.isActive === false || (body.role && body.role !== admin.role))) {
      return jsonError('You cannot remove your own access.', 400);
    }

    const data: Record<string, unknown> = {};
    if (body.role !== undefined) {
      const role = oneOf(body.role, ROLES);
      if (!role) return jsonError('Invalid role', 400);
      data.role = role;
    }
    if (body.isActive !== undefined) data.isActive = body.isActive === true;
    if (body.password) {
      if (typeof body.password !== 'string' || body.password.length < 12) {
        return jsonError('The password must have at least 12 characters.', 400);
      }
      data.passwordHash = await hashPassword(body.password);
    }

    await prisma.adminUser.update({ where: { id }, data });
    // Any change to access ends the user's existing sessions.
    await prisma.adminSession.deleteMany({ where: { userId: id } });
    await audit(admin, 'admin_user.updated', 'admin_user', id, { fields: Object.keys(data) });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.users.update', error);
    return jsonError('Failed to update user', 500);
  }
}
