import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const vacancies = await prisma.jobVacancy.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, vacancies });
  } catch (error) {
    console.error('Error fetching public vacancies:', error);
    return NextResponse.json({ success: false, vacancies: [] });
  }
}
