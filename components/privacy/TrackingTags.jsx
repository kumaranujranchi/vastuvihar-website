'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCookieChoice } from '@/lib/privacy/cookieChoices';
import { logPageView } from '@/lib/privacy/activityLog';
import { noteLanding, syncAdSource } from '@/lib/privacy/adSource';
import { applyTagConsent, trackAdPageView } from '@/lib/privacy/tags';

/** Keeps the tags and the activity log in step with the visitor's choice, in every tab. Never runs in the admin area. */
export default function TrackingTags() {
  const pathname = usePathname();
  const choice = useCookieChoice();
  const isAdmin = pathname?.startsWith('/admin');
  const analytics = !isAdmin && choice?.analytics === true;
  const advertising = !isAdmin && choice?.advertising === true;
  const advertisingChoice = choice?.advertising;

  useEffect(() => {
    applyTagConsent({ analytics, advertising });
    if (isAdmin) return;
    noteLanding();
    syncAdSource(advertisingChoice);
    trackAdPageView(pathname);
    logPageView(pathname);
  }, [analytics, advertising, advertisingChoice, isAdmin, pathname]);

  return null;
}
