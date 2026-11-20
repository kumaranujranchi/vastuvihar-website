import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import './not-found.css';

export default function NotFound() {
  return (
    <PageLayout route="not-found">
      <main id="main" className="vv-not-found">
        <p className="vv-not-found__eyebrow">404 — Page not found</p>
        <h1 className="vv-not-found__title">Let’s get you back home.</h1>
        <p className="vv-not-found__text">
          This address doesn’t match a page. Explore our models or return to the homepage.
        </p>
        <div className="vv-not-found__actions">
          <Link className="vv-not-found__button" href="/">Back to home ↗</Link>
          <Link className="vv-not-found__button" href="/projects/">Explore our Models ↗</Link>
        </div>
      </main>
    </PageLayout>
  );
}
