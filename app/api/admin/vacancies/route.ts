import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { revalidateCareers } from '@/lib/revalidate';

const textValue = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

function operationError(error: unknown, operation: string): NextResponse {
  console.error(`[admin.vacancies.${operation}]`, error);
  const code = getErrorCode(error);
  const messages: Record<string, string> = {
    P1000: 'Database credentials are invalid.',
    P1001: 'Unable to connect to the database.',
    P1002: 'Database connection timed out.',
    P1003: 'The configured database does not exist.',
    P2000: 'A field is too long for its database column. Check the description and requirements column types.',
    P2021: 'The job vacancies table is missing. Apply the database migrations.',
    P2022: 'The job vacancies table is out of date. Apply the database migrations.',
    P2025: 'The requested job vacancy was not found.',
  };
  return NextResponse.json(
    {
      success: false,
      error: (code && messages[code]) || `Failed to ${operation} the job vacancy. Check the server log.`,
      code: code || 'UNKNOWN',
    },
    { status: code === 'P2025' ? 404 : 500 },
  );
}

export async function GET(request: Request) {
  try {
    const { admin, response } = await requirePermission(request, 'vacancies:manage');
    if (!admin) return response;

    const vacancies = await prisma.jobVacancy.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, vacancies });
  } catch (error) {
    // Never report success with an empty list when the database actually failed.
    return operationError(error, 'load');
  }
}

export async function POST(request: Request) {
  try {
    const { admin, response } = await requirePermission(request, 'vacancies:manage');
    if (!admin) return response;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body.' },
        { status: 400 },
      );
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job vacancy data.' },
        { status: 400 },
      );
    }

    const input = body as Record<string, unknown>;
    const title = textValue(input.title);
    const description = textValue(input.description);
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Job title and description are required.' },
        { status: 400 },
      );
    }

    let vacancy;
    try {
      vacancy = await prisma.jobVacancy.create({
        data: {
          title,
          department: textValue(input.department) || null,
          location: textValue(input.location) || 'Ranchi, JH',
          type: textValue(input.type) || 'Full - Time',
          description,
          requirements: textValue(input.requirements) || null,
          isActive: typeof input.isActive === 'boolean' ? input.isActive : true,
        },
      });
    } catch (error) {
      return operationError(error, 'create');
    }
    revalidateCareers();

    // Once the DB insert succeeds, an audit-write failure must not tell the UI
    // that posting failed; doing so can cause users to publish duplicates.
    try {
      await audit(admin, 'vacancy.created', 'vacancy', vacancy.id);
    } catch (error) {
      console.error('[admin.vacancies.create.audit] Vacancy saved, but audit write failed:', error);
      // Monitor this error: audit integrity must be restored separately.
    }

    return NextResponse.json({ success: true, vacancy }, { status: 201 });
  } catch (error) {
    return operationError(error, 'create');
  }
}

export async function PATCH(request: Request) {
  try {
    const { admin, response } = await requirePermission(request, 'vacancies:manage');
    if (!admin) return response;

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON request body.' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: 'Invalid job vacancy data.' }, { status: 400 });
    }

    const id = textValue(body.id);
    if (!id) {
      return NextResponse.json({ success: false, error: 'Vacancy ID required.' }, { status: 400 });
    }
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) {
      if (!textValue(body.title)) return NextResponse.json({ success: false, error: 'Job title is required.' }, { status: 400 });
      data.title = textValue(body.title);
    }
    if (body.department !== undefined) data.department = textValue(body.department) || null;
    if (body.location !== undefined) data.location = textValue(body.location) || 'Ranchi, JH';
    if (body.type !== undefined) data.type = textValue(body.type) || 'Full - Time';
    if (body.description !== undefined) {
      if (!textValue(body.description)) return NextResponse.json({ success: false, error: 'Job description is required.' }, { status: 400 });
      data.description = textValue(body.description);
    }
    if (body.requirements !== undefined) data.requirements = textValue(body.requirements) || null;
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') return NextResponse.json({ success: false, error: 'isActive must be boolean.' }, { status: 400 });
      data.isActive = body.isActive;
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update.' }, { status: 400 });
    }

    let vacancy;
    try {
      vacancy = await prisma.jobVacancy.update({ where: { id }, data });
    } catch (error) {
      return operationError(error, 'update');
    }
    revalidateCareers();

    try {
      await audit(admin, 'vacancy.updated', 'vacancy', id);
    } catch (error) {
      console.error('[admin.vacancies.update.audit] Vacancy updated, but audit write failed:', error);
    }
    return NextResponse.json({ success: true, vacancy });
  } catch (error) {
    return operationError(error, 'update');
  }
}

export async function DELETE(request: Request) {
  try {
    const { admin, response } = await requirePermission(request, 'vacancies:manage');
    if (!admin) return response;

    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Vacancy ID required.' }, { status: 400 });
    }

    try {
      await prisma.jobVacancy.delete({ where: { id } });
    } catch (error) {
      return operationError(error, 'delete');
    }
    revalidateCareers();

    try {
      await audit(admin, 'vacancy.deleted', 'vacancy', id);
    } catch (error) {
      console.error('[admin.vacancies.delete.audit] Vacancy deleted, but audit write failed:', error);
    }
    return NextResponse.json({ success: true, message: 'Job vacancy deleted successfully' });
  } catch (error) {
    return operationError(error, 'delete');
  }
}