import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'vv_admin_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy resume location. Files that remain there must never be served publicly.
  // Normalised first, so encoded or differently-cased paths cannot slip past this check.
  let normalized = pathname;
  try {
    normalized = decodeURIComponent(pathname);
  } catch {
    return new NextResponse('Bad request', { status: 400 });
  }
  normalized = normalized.toLowerCase().replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  if (normalized.startsWith('/uploads/resumes')) {
    return new NextResponse('Not found', { status: 404 });
  }

  // Set FORCE_HTTPS=1 behind a TLS-terminating proxy. It is opt-in because Next.js fills
  // in x-forwarded-proto itself, so without a proxy every request would look like HTTP.
  if (process.env.FORCE_HTTPS === '1' && request.headers.get('x-forwarded-proto') === 'http') {
    const secure = request.nextUrl.clone();
    secure.protocol = 'https:';
    secure.port = '';
    return NextResponse.redirect(secure, 308);
  }

  if (pathname.startsWith('/admin')) {
    const isLogin = pathname.startsWith('/admin/login');
    // A convenience redirect only. Every admin API checks the session and role itself,
    // and the admin pages hold no personal data until those APIs return it.
    if (!isLogin && !request.cookies.get(SESSION_COOKIE)?.value) {
      return NextResponse.redirect(new URL('/admin/login/', request.url));
    }
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude Next.js internals, static folders, and all static file extensions (.webp, .png, .jpg, .svg, .css, .js, etc.)
    // so Cloudflare edge serves them directly without wasting Worker CPU time.
    '/((?!_next/static|_next/image|favicon.ico|fonts/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
