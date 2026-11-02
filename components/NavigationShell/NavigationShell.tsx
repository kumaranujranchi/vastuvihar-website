'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

// import CustomCursor from '@/components/CustomCursor/CustomCursor';
// import LeadModal from '@/components/LeadModal/LeadModal';
// import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';

interface NavigationShellProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  cookieConsent: React.ReactNode;
}

export default function NavigationShell({
  header,
  children,
  footer,
  cookieConsent,
}: NavigationShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main style={{ minHeight: '100vh', width: '100%' }}>{children}</main>;
  }

  return (
    <>
      {children}
      {cookieConsent}
    </>
  );
}
