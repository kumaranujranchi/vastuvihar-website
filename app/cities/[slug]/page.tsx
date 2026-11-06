import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { createPageMetadata } from '@/lib/metadata';
import CityProjects, {
  type CityData,
  type CityModel,
  type CityPhase,
} from '@/components/cities/CityProjects';
import { projectsData } from '@/data/project';
import cityData from '@/data/cities.json';
import styles from './page.module.css';

// Use your existing City / Price List hero CSS unchanged.
// Update this import only if the hero module is located elsewhere.
import heroStyles from '@/app/price-list/hero.module.css';

// cities.json contains ONLY canonical model slugs. Model details are always
// resolved from lib/models-data.ts (one source for slug, image, name and price).
type CityConfig = Omit<CityData, 'phases'> & {
  phases: Array<Omit<CityPhase, 'models'> & { models: string[] }>;
};

type CatalogueModel = {
  slug: string;
  name: string;
  price: string;
  gallery?: string[];
  modelTypes?: Array<{
    stats?: Array<{ label: string; value: number | string }>;
  }>;
};

const cities = cityData as Record<string, CityConfig>;
const modelCatalogue = projectsData as unknown as Record<string, CatalogueModel>;

type CityPageProps = {
  params: Promise<{ slug: string }>;
};

function getBedrooms(model: CatalogueModel): number | null {
  // Use the model's actual Bedrooms statistic, not its old phase-card label.
  const bedroomStat = model.modelTypes
    ?.flatMap((type) => type.stats ?? [])
    .find((stat) => /^bedrooms?$/i.test(stat.label.trim()));

  if (bedroomStat) {
    const count = Number(bedroomStat.value);
    if (Number.isFinite(count) && count > 0) return count;
  }

  // Fallback for future catalogue items that mention their BHK in the name.
  const nameBhk = model.name.match(/(\d+)\s*BHK/i);
  return nameBhk ? Number(nameBhk[1]) : null;
}

function getCityWithModels(city: CityConfig): CityData {
  return {
    ...city,
    phases: city.phases.map((phase) => {
      // Remove duplicates within a phase, e.g. both legacy Yamuna 5-BHK
      // variants are the same canonical model in models-data.ts.
      const uniqueModelSlugs = [...new Set(phase.models)];

      const models: CityModel[] = uniqueModelSlugs.flatMap((slug) => {
        const model = modelCatalogue[slug];
        if (!model) return []; // Don't show models missing from the catalogue.

        const bhk = getBedrooms(model);
        if (bhk === null) return [];

        return [{
          slug: model.slug,
          image: model.gallery?.[0] ?? '',
          title: model.name,
          price: model.price,
          bhk,
        }];
      });

      return { ...phase, models };
    }),
  };
}

export function generateStaticParams() {
  return Object.keys(cities).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CityPageProps) {
  const { slug } = await params;
  const city = cities[slug.toLowerCase()];

  if (!city) return { title: 'City Not Found | Vastu Vihar' };

  return createPageMetadata({
    title: `Projects in ${city.name} | Vastu Vihar`,
    description: `Explore Vastu Vihar projects, phases, master plans and home models in ${city.name}, ${city.state}.`,
    path: `/cities/${city.slug}/`,
  });
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const config = cities[slug.toLowerCase()];

  if (!config) notFound();

  // Catalogue data is resolved on the server. The existing client-side
  // CityProjects component receives the same CityData shape as before.
  const city = getCityWithModels(config);

  return (
    <PageLayout route="cities">
      <main className={styles.page}>
        <section className={heroStyles.hero}>
          <div className={heroStyles.heroInner}>
            <h1>Projects in {city.name}</h1>

            <div className={heroStyles.heroBottom}>
              <nav className={heroStyles.breadcrumbs} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true" />
                <Link href="/cities/">Cities</Link>
                <span aria-hidden="true" />
                <strong aria-current="page">{city.name}</strong>
              </nav>
            </div>
          </div>
          <div className={heroStyles.heroCurve} />
        </section>

        <CityProjects city={city} />
      </main>
    </PageLayout>
  );
}
