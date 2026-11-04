import type { ReactNode } from 'react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { createPageMetadata } from '@/lib/metadata';

// The page is a client component, so its metadata lives here.
export const metadata = createPageMetadata({
  title: 'Apply for a Job',
  description: 'Send your details and resume to the Vastu Vihar HR team.',
  path: '/careers/apply/',
});

export default function ApplyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BreadcrumbJsonLd items={[{ name: 'Careers', path: '/careers/' }, { name: 'Apply' }]} />
    </>
  );
}
