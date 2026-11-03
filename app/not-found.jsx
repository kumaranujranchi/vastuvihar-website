import './not-found.css';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

export default function NotFound() {
  return (
    <PageLayout route="not-found">
      <main id="main" className="next-route-error">
        <p>404 — Page not found</p>
        <h1>Let’s get you back home.</h1>
        <p>This address doesn’t match a page. Explore our models or return to the homepage.</p>
        <Link href="/">Back to home ↗</Link>{' '}
        <Link href="/projects/">Explore our Models ↗</Link>
      </main>
    </PageLayout>
  );
}
