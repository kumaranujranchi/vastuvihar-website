import './PageLayout.css';
import SiteLayout from './SiteLayout';
import ThemeRuntime from '@/components/common/ThemeRuntime';
import pages from '@/data/pages.json';
import searchIndex from '@/data/search-index.json';

/** Shared Demo 5 layout and behavior for every website route. */
export default function PageLayout({ route = 'home', children }) {
  const page = pages.find((entry) => entry.route === route);
  const bodyClass = page?.bodyClass || 'page theme-spaciaz elementor-default elementor-kit-4';

  return (
    <div className={`theme-page ${bodyClass}`} data-next-route={route}>
      <SiteLayout isHome={route === 'home'}>{children}</SiteLayout>
      <ThemeRuntime key={route} route={route} bodyClass={bodyClass} searchIndex={searchIndex} />
    </div>
  );
}
