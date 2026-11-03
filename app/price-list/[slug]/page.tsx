import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout'; 
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import styles from './price-list-detail.module.css';
import { priceLists } from '@/data/priceLists';
import { createPageMetadata } from '@/lib/metadata';

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** The lowest home price in rupees, ignoring shops, parking and per-sq.ft. rates. */
function lowestHomePrice(project: (typeof priceLists)[number]) {
  const prices = [...(project.bungalows || []), ...(project.flats || [])]
    .flatMap((unit) => [unit.deluxePrice, unit.luxuryPrice])
    .filter((price): price is string => Boolean(price) && !String(price).includes('/Sq.'))
    .map((price) => Number(price.replace(/,/g, '')))
    .filter((price) => Number.isFinite(price) && price > 0);

  return prices.length ? Math.min(...prices) : null;
}

export function generateMetadata({ params }: PageProps) {
  return params.then(({ slug }) => {
    const project = priceLists.find((item) => item.slug === slug);
    if (!project) return { title: 'Price list not found' };

    const lowest = lowestHomePrice(project);
    // 100000 rupees = 1 lakh. Rounded to 2 places, so 9,50,000 reads as 9.5.
    const from = lowest ? `₹${Number((lowest / 100000).toFixed(2))} Lakh` : null;

    return createPageMetadata({
      title: from ? `${project.projectName} Price List: From ${from}` : `${project.projectName} Price List`,
      description: `${project.projectName} prices valid ${project.effectiveDate}${from ? `, from ${from}` : ''}. See unit areas, deluxe and luxury prices, the payment schedule and specifications.`,
      path: `/price-list/${slug}/`,
    });
  });
}

function formatPrice(value?: string) {
  if (!value) return '—';
  if (value.includes('/Sq.')) return value;
  return `₹${value}`;
}

function DataTable({
  title,
  items,
}: {
  title: string;
  items: Array<{
    name: string;
    carpetArea?: string;
    builtUpArea?: string;
    landArea?: string;
    deluxePrice?: string;
    luxuryPrice?: string;
    model?: string;
  }>;
}) {
  if (!items?.length) return null;

  const hasModel = items.some((item) => item.model);
  const hasCarpet = items.some((item) => item.carpetArea);
  const hasBuiltUp = items.some((item) => item.builtUpArea);
  const hasLand = items.some((item) => item.landArea);
  const hasDeluxe = items.some((item) => item.deluxePrice);
  const hasLuxury = items.some((item) => item.luxuryPrice);

  return (
    <section className={styles.dataSection}>
      <div className={styles.sectionTitleRow}>
        <div>
          <span className={styles.kicker}>Unit options</span>
          <h2>{title}</h2>
        </div>
        <span>{items.length.toString().padStart(2, '0')} options</span>
      </div>

      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Unit</th>
              {hasModel && <th>Model</th>}
              {hasCarpet && <th>Carpet Area</th>}
              {hasBuiltUp && <th>Built-up Area</th>}
              {hasLand && <th>Land Area</th>}
              {hasDeluxe && <th>Deluxe Price</th>}
              {hasLuxury && <th>Luxury Price</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td><strong>{item.name}</strong></td>
                {hasModel && <td>{item.model || '—'}</td>}
                {hasCarpet && <td>{item.carpetArea ? `${item.carpetArea} sq.ft.` : '—'}</td>}
                {hasBuiltUp && <td>{item.builtUpArea ? `${item.builtUpArea} sq.ft.` : '—'}</td>}
                {hasLand && <td>{item.landArea ? `${item.landArea} sq.ft.` : '—'}</td>}
                {hasDeluxe && <td className={styles.priceCell}>{formatPrice(item.deluxePrice)}</td>}
                {hasLuxury && <td className={styles.priceCell}>{formatPrice(item.luxuryPrice)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function PriceListDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = priceLists.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <PageLayout route="price-list-detail">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1>{project.projectName}</h1>
            <span className={styles.date}>Effective: {project.effectiveDate}</span>

            <div className={styles.heroBottom}>
              <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true" />
                <Link href="/price-list">Price List</Link>
                <span aria-hidden="true" />
                <strong>{project.projectName}</strong>
              </nav>
            </div>
          </div>
          <div className={styles.heroCurve} />
        </section>

        <section className={styles.projectIntro}>
          <div className={styles.container}>
            <div className={styles.projectIntroGrid}>
              <div>
                <span className={styles.kicker}>Project price list</span>
                <h2>Project information</h2>
              </div>

              <div className={styles.contactGrid}>
                <div className={styles.infoItem}><span>Office</span><strong>{project.officeAddress}</strong></div>
                <div className={styles.infoItem}><span>Site</span><strong>{project.siteAddress}</strong></div>
                <div className={styles.infoItem}><span>Phone</span><strong>{project.contactPhones}</strong></div>
                <div className={styles.infoItem}>
                  <span>Email</span>
                  {project.email ? <a href={`mailto:${project.email}`}>{project.email}</a> : <strong>—</strong>}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.container}>
          <DataTable title="Bungalows" items={project.bungalows || []} />
          <DataTable title="Flats" items={project.flats || []} />
          <DataTable title="Shops" items={project.shops || []} />

          {project.parking?.length ? (
            <section className={styles.dataSection}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <span className={styles.kicker}>Additional options</span>
                  <h2>Parking</h2>
                </div>
              </div>
              <div className={styles.tableShell}>
                <table className={styles.table}>
                  <thead><tr><th>Type</th><th>Size</th><th>Price</th></tr></thead>
                  <tbody>
                    {project.parking.map((item, index) => (
                      <tr key={`${item.name}-${index}`}>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.size}</td>
                        <td className={styles.priceCell}>
                          {typeof item.price === 'number'
                            ? `₹${item.price.toLocaleString('en-IN')}`
                            : item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className={styles.paymentSection}>
            <div className={styles.sectionTitleRow}>
              <div>
                <span className={styles.kicker}>Purchase process</span>
                <h2>Payment schedule</h2>
              </div>
            </div>

            <div className={styles.scheduleGrid}>
              {project.paymentSchedules.map((schedule, index) => (
                <article className={styles.scheduleCard} key={`${schedule.title}-${index}`}>
                  <div className={styles.scheduleNumber}>{(index + 1).toString().padStart(2, '0')}</div>
                  <h3>{schedule.title}</h3>
                  <ol>
                    {schedule.steps.map((step, stepIndex) => (
                      <li key={`${step}-${stepIndex}`}>
                        <span>{(stepIndex + 1).toString().padStart(2, '0')}</span>
                        <p>{step.replace(/^\(\d+\)\s*/, '')}</p>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </section>

          {project.specifications?.length ? (
            <section className={styles.dataSection}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <span className={styles.kicker}>Construction details</span>
                  <h2>Specifications</h2>
                </div>
              </div>

              <div className={styles.tableShell}>
                <table className={styles.table}>
                  <thead><tr><th>Particular</th><th>Deluxe</th><th>Luxury</th></tr></thead>
                  <tbody>
                    {project.specifications.map((item, index) => (
                      <tr key={`${item.particular}-${index}`}>
                        <td><strong>{item.particular}</strong></td>
                        <td>{item.deluxe || '—'}</td>
                        <td>{item.luxury || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {project.specificationNote ? <p className={styles.specNote}>{project.specificationNote}</p> : null}
            </section>
          ) : null}

          {project.shopSpecifications?.length ? (
            <section className={styles.dataSection}>
              <div className={styles.sectionTitleRow}>
                <div>
                  <span className={styles.kicker}>Commercial units</span>
                  <h2>Shop specifications</h2>
                </div>
              </div>

              <div className={styles.tableShell}>
                <table className={styles.table}>
                  <thead><tr><th>Particular</th><th>Specification</th></tr></thead>
                  <tbody>
                    {project.shopSpecifications.map((item, index) => (
                      <tr key={`${item.particular}-${index}`}>
                        <td><strong>{item.particular}</strong></td>
                        <td>{item.deluxe || item.luxury || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className={styles.notesSection}>
            <div className={styles.notesGrid}>
              <div>
                <span className={styles.kicker}>Important</span>
                <h2>Notes & terms</h2>
              </div>

              <div className={styles.notesList}>
                {project.notes.map((note, index) => (
                  <div className={styles.noteItem} key={`${note}-${index}`}>
                    <span>{(index + 1).toString().padStart(2, '0')}</span>
                    <p>{note.replace(/^\(?\(?\d+\)?\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.footerCta}>
            <div>
              <span className={styles.kicker}>Need help?</span>
              <h2>{project.footerMessage || 'Contact our project team'}</h2>
            </div>

            <div className={styles.footerActions}>
              <a href={`tel:${project.contactPhones.split(/[\/,]/)[0].trim()}`}>Call project team</a>
              {project.email ? <a href={`mailto:${project.email}`}>Send email</a> : null}
            </div>
          </section>
        </div>
      </main>
      <BreadcrumbJsonLd items={[{ name: 'Price List', path: '/price-list/' }, { name: project.projectName }]} />
    </PageLayout>
  );
}