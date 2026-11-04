import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';

export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'vacancies:manage');
  if (!admin) return response;

  try {
    const vacancies = await prisma.jobVacancy.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, vacancies });
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch vacancies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'vacancies:manage');
  if (!admin) return response;

  try {
    const body = await request.json();
    const { title, department, location, type, description, requirements, isActive } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Job title and description are required' }, { status: 400 });
    }

    const vacancy = await prisma.jobVacancy.create({
      data: {
        title: title.trim(),
        department: department ? department.trim() : null,
        location: location ? location.trim() : 'Ranchi, JH',
        type: type ? type.trim() : 'Full - Time',
        description: description.trim(),
        requirements: requirements ? requirements.trim() : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await audit(admin, 'vacancy.created', 'vacancy', vacancy.id);
    return NextResponse.json({ success: true, vacancy }, { status: 201 });
  } catch (error) {
    console.error('Error creating vacancy:', error);
    return NextResponse.json({ success: false, error: 'Failed to create job vacancy' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'vacancies:manage');
  if (!admin) return response;

  try {
    const body = await request.json();
    const { id, title, department, location, type, description, requirements, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Vacancy ID required' }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title.trim();
    if (department !== undefined) data.department = department ? department.trim() : null;
    if (location !== undefined) data.location = location.trim();
    if (type !== undefined) data.type = type.trim();
    if (description !== undefined) data.description = description.trim();
    if (requirements !== undefined) data.requirements = requirements ? requirements.trim() : null;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const updated = await prisma.jobVacancy.update({
      where: { id },
      data,
    });

    await audit(admin, 'vacancy.updated', 'vacancy', id);
    return NextResponse.json({ success: true, vacancy: updated });
  } catch (error) {
    console.error('Error updating vacancy:', error);
    return NextResponse.json({ success: false, error: 'Failed to update job vacancy' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { admin, response } = await requirePermission(request, 'vacancies:manage');
  if (!admin) return response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Vacancy ID required' }, { status: 400 });
    }

    await prisma.jobVacancy.delete({ where: { id } });
    await audit(admin, 'vacancy.deleted', 'vacancy', id);
    return NextResponse.json({ success: true, message: 'Job vacancy deleted successfully' });
  } catch (error) {
    console.error('Error deleting vacancy:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete vacancy' }, { status: 500 });
  }
}
