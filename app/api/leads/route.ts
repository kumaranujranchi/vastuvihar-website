import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to determine if an IP is local/private
function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') ||
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.')
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      email,
      city,
      budget,
      project,
      address,
      message,
      source,
      website_url, // Honeypot field (hidden from real users)
    } = body;

    // 1. HONEYPOT BOT TRAP:
    // Bots automatically populate any input element they find.
    // If 'website_url' is present, silently return fake success so bots do not retry or mutate.
    if (website_url && String(website_url).trim().length > 0) {
      console.warn('[SPAM_BLOCKED] Honeypot triggered by automated bot:', {
        fullName,
        email,
        phone,
        website_url,
      });
      return NextResponse.json(
        {
          success: true,
          message: 'Inquiry received successfully! Our team will contact you shortly.',
        },
        { status: 200 }
      );
    }

    // 2. EXTRACT CLIENT IP & COUNTRY
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip');
    const rawIp = (cfIp || forwarded?.split(',')[0] || realIp || '127.0.0.1').trim();
    const clientIp = rawIp.replace(/^::ffff:/, '');

    // Header-based Country detection (Cloudflare / Vercel / Nginx CDN)
    let country = (
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('x-country-code') ||
      null
    )?.toUpperCase() || null;

    // Direct VPS / Lightsail GeoIP resolution fallback
    if (!country && clientIp && !isPrivateIp(clientIp)) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1200);
        const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=country,countryCode`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.countryCode) {
            country = `${geoData.countryCode} - ${geoData.country}`;
          }
        }
      } catch {
        // Continue gracefully without blocking lead submission
      }
    }

    const userAgent = request.headers.get('user-agent')?.slice(0, 255) || null;

    // 3. BASIC VALIDATION
    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, error: 'Full name and phone number are required.' },
        { status: 400 }
      );
    }

    // Phone validation (simple digits check)
    const cleanPhone = String(phone).replace(/[^\d+]/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid 10-digit phone number.' },
        { status: 400 }
      );
    }

    // 4. RATE LIMITING:
    // Max 5 submissions per IP within 5 minutes
    if (clientIp && !isPrivateIp(clientIp)) {
      const recentCount = await prisma.lead.count({
        where: {
          ipAddress: clientIp,
          createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
        },
      });

      if (recentCount >= 5) {
        return NextResponse.json(
          { success: false, error: 'Too many submissions. Please wait a few minutes before trying again.' },
          { status: 429 }
        );
      }
    }

    // 5. RAPID DUPLICATE GUARD:
    // If the same phone submitted within 90 seconds, return success without polluting database
    const recentDuplicate = await prisma.lead.findFirst({
      where: {
        phone: cleanPhone,
        createdAt: { gte: new Date(Date.now() - 90 * 1000) },
      },
    });

    if (recentDuplicate) {
      return NextResponse.json(
        {
          success: true,
          message: 'Inquiry received successfully! Our team will contact you shortly.',
          leadId: recentDuplicate.id,
        },
        { status: 200 }
      );
    }

    // Save verified lead to database with IP, Country, and User-Agent
    const lead = await prisma.lead.create({
      data: {
        fullName: String(fullName).trim(),
        phone: cleanPhone,
        email: email ? String(email).trim().toLowerCase() : null,
        city: city ? String(city).trim() : null,
        budget: budget ? String(budget).trim() : null,
        project: project ? String(project).trim() : null,
        address: address ? String(address).trim() : null,
        message: message ? String(message).trim() : null,
        source: source ? String(source).trim() : 'website_inquiry',
        status: 'NEW',
        ipAddress: clientIp,
        country: country || (isPrivateIp(clientIp) ? 'Local Development' : 'Unknown'),
        userAgent: userAgent,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry received successfully! Our team will contact you shortly.',
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve leads (protected by ADMIN_API_KEY)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const adminKey = process.env.ADMIN_API_KEY;

    // Check basic auth key if ADMIN_API_KEY is defined in environment
    if (adminKey && key !== adminKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads.' },
      { status: 500 }
    );
  }
}
