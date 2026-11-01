import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = formData.get('fullName') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const jobTitle = formData.get('jobTitle') as string | null;
    const experience = formData.get('experience') as string | null;
    const coverLetter = formData.get('coverLetter') as string | null;
    const resumeFile = formData.get('resume') as File | null;

    if (!fullName || !email || !phone || !jobTitle) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, phone number, and job title are required.' },
        { status: 400 }
      );
    }

    let resumePath: string | null = null;

    if (resumeFile && resumeFile.size > 0) {
      // Validate file size (max 5MB)
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Resume file size exceeds 5MB limit.' },
          { status: 400 }
        );
      }

      // Check extension
      const originalName = resumeFile.name;
      const ext = path.extname(originalName).toLowerCase();
      const allowedExts = ['.pdf', '.doc', '.docx'];

      if (!allowedExts.includes(ext)) {
        return NextResponse.json(
          { success: false, error: 'Only PDF or DOC/DOCX resume files are supported.' },
          { status: 400 }
        );
      }

      // Ensure directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
      await fs.mkdir(uploadDir, { recursive: true });

      // Create unique safe file name
      const safeCandidateName = fullName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const uniqueFileName = `${Date.now()}_${safeCandidateName}${ext}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      resumePath = `/uploads/resumes/${uniqueFileName}`;
    }

    // Save job application to DB
    const application = await prisma.jobApplication.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        jobTitle: jobTitle.trim(),
        experience: experience ? experience.trim() : null,
        coverLetter: coverLetter ? coverLetter.trim() : null,
        resumePath: resumePath,
        status: 'SUBMITTED',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your application has been received successfully! Our HR team will review it.',
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting job application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to view job applications (Admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const adminKey = process.env.ADMIN_API_KEY;

    if (adminKey && key !== adminKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, count: applications.length, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications.' },
      { status: 500 }
    );
  }
}
