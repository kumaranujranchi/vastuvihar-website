'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCookieChoice } from '@/lib/privacy/cookieChoices';
import { applyTagConsent, trackAdPageView } from '@/lib/privacy/tags';

/** Keeps the tags in step with the visitor's choice, in every tab. Never runs in the admin area. */
export default function TrackingTags() {
  const pathname = usePathname();
  const choice = useCookieChoice();
  const isAdmin = pathname?.startsWith('/admin');
  const analytics = !isAdmin && choice?.analytics === true;
  const advertising = !isAdmin && choice?.advertising === true;

  useEffect(() => {
    applyTagConsent({ analytics, advertising });
    trackAdPageView(pathname);
  }, [analytics, advertising, pathname]);

  return null;
}
