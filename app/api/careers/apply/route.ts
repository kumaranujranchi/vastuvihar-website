import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteResume, MAX_RESUME_BYTES, saveResume } from '@/lib/privateStorage';
import { guardPublicPost, jsonError, logError } from '@/lib/security/request';
import { cleanText, isTrue, normalizeEmail, normalizePhone } from '@/lib/validation';
import { noticeLanguage, recordConsent } from '@/lib/privacy/consent';
import { NOTICE_VERSION, PURPOSES } from '@/lib/privacy/notices';

export async function POST(request: Request) {
  try {
    const blocked = await guardPublicPost(request, 'careers', 5, 60 * 60 * 1000);
    if (blocked) return blocked;

    // Reject oversized bodies before they are read into memory.
    const declared = Number(request.headers.get('content-length') || 0);
    if (declared > MAX_RESUME_BYTES + 256 * 1024) return jsonError('Resume file size exceeds 5MB limit.', 413);

    const form = await request.formData();

    if (cleanText(form.get('website_url'), 200)) {
      return NextResponse.json({ success: true, message: 'Application received.' });
    }

    const fullName = cleanText(form.get('fullName'), 120);
    const email = normalizeEmail(form.get('email'));
    const phone = normalizePhone(form.get('phone'));
    const jobTitle = cleanText(form.get('jobTitle'), 160);
    if (!fullName || !email || !phone || !jobTitle) {
      return jsonError('Full name, a valid email, a valid phone number and job title are required.', 400);
    }
    if (!isTrue(form.get('consentPrimary'))) {
      return jsonError('Please confirm your consent so we can assess your application.', 400);
    }

    const resume = form.get('resume');
    if (!(resume instanceof File) || resume.size === 0) return jsonError('Please attach your resume.', 400);
    const saved = await saveResume(resume);
    if (saved.error) return jsonError(saved.error, 400);

    const language = noticeLanguage(form.get('noticeLanguage'));
    const application = await prisma.jobApplication
      .create({
        data: {
          fullName,
          email,
          phone,
          jobTitle,
          experience: cleanText(form.get('experience'), 200) || null,
          coverLetter: cleanText(form.get('coverLetter'), 4000) || null,
          resumePath: saved.path,
          status: 'SUBMITTED',
          noticeVersion: NOTICE_VERSION,
          noticeLanguage: language,
        },
      })
      .catch(async (error) => {
        // Without a row, nothing could ever find and delete this file.
        await deleteResume(saved.path);
        throw error;
      });

    await recordConsent({
      phone,
      email,
      recordType: 'application',
      recordId: application.id,
      purpose: PURPOSES.APPLICATION,
      action: 'GRANTED',
      language,
      source: 'careers_apply',
    });

    return NextResponse.json(
      { success: true, message: 'Your application has been received successfully! Our HR team will review it.' },
      { status: 201 },
    );
  } catch (error) {
    logError('careers.apply', error);
    return jsonError('Failed to submit application. Please try again.', 500);
  }
}
