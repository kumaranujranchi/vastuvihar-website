import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { createPageMetadata } from '@/lib/metadata';
import PriceListView from './PriceListView';

export const metadata = createPageMetadata({
  title: 'Vastu Vihar Price Lists by City & Project Phase',
  description: 'Check current Vastu Vihar bungalow and flat price lists by city and project phase, with unit areas, payment schedules and validity dates.',
  path: '/price-list/',
});

export default function PriceListPage() {
  return (
    <>
      <PriceListView />
      <BreadcrumbJsonLd items={[{ name: 'Price List' }]} />
    </>
  );
}
