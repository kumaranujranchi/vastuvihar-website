import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

const MODELS_DATA = [
  {
    id: 1,
    name: "Ananta Bungalow",
    slug: "ananta-bungalow",
    price: "₹ 50 - 70 Lac",
    tags: ["Top New", "Sale"],
    area: "1800",
    beds: "3",
    baths: "3",
    parking: "1",
    image: "/villa/ananta.webp",
    description: "A thoughtfully designed 3-bedroom bungalow offering comfortable family living, spacious interiors, and a welcoming atmosphere with a balance of style and everyday practicality."
  },
  {
    id: 2,
    name: "Ceo Bungalow",
    slug: "ceo-bungalow",
    price: "₹ 1.10Cr - 1.80Cr",
    tags: ["Top New", "Sale"],
    area: "2500",
    beds: "5",
    baths: "4",
    parking: "1",
    image: "/villa/ceo.webp",
    description: "A premium 5-bedroom bungalow offering generous interiors, multiple bathrooms, and an expansive layout for families who value space, privacy, and an elevated living experience."
  },
  {
    id: 3,
    name: "Classic Ceo Bungalow",
    slug: "classic-ceo-bungalow",
    price: "₹ 1 Cr - 1.80 Cr",
    tags: ["Top New", "Sale"],
    area: "2500",
    beds: "5",
    baths: "4",
    parking: "1",
    image: "/villa/classic-CEO-bunglow.webp",
    description: "A classic premium 5-bedroom residence designed around spacious family living, combining generous room configurations with a timeless residential character."
  },
  {
    id: 4,
    name: "Yamuna Bungalow 7bhk",
    slug: "yamuna-bungalow-7bhk",
    price: "₹ 60 Lac - 1 Cr",
    tags: [],
    area: "",
    beds: "7",
    baths: "4",
    parking: "1",
    image: "/yamuna/yamuna3.webp",
    description: "A spacious bungalow with flexible 7 bedroom options, designed for larger families seeking generous living spaces, adaptable layouts, and room to grow."
  },
  {
    id: 5,
    name: "Yamuna Bungalow 5bhk",
    slug: "yamuna-bungalow",
    price: "₹ 55 - 70 Lac*",
    tags: [],
    area: "2200",
    beds: "5",
    baths: "3",
    parking: "1",
    image: "/villa/yamuna-bungalow.webp",
    description: "A spacious bungalow with flexible 5 bedroom options, designed for larger families seeking generous living spaces, adaptable layouts, and room to grow."
  },
  {
    id: 6,
    name: "Simplex Bungalow",
    slug: "simplex-bungalow",
    price: "₹ 30 - 35 Lac*",
    tags: [],
    area: "1000",
    beds: "2",
    baths: "1",
    parking: "1",
    image: "/villa/simplex.webp",
    description: "A compact and practical 2-bedroom bungalow designed for affordable homeownership, offering essential living spaces and a straightforward layout for small families."
  },
  {
    id: 7,
    name: "Business Bungalow",
    slug: "business-bungalow",
    price: "₹ 35 - 50 Lac",
    tags: ["Top New"],
    area: "1550",
    beds: "2",
    baths: "2",
    parking: "1",
    image: "/villa/business-Bungalow.webp",
    description: "A spacious 2-bedroom bungalow with a versatile layout, suited to buyers seeking comfortable residential space with potential for a work-from-home lifestyle."
  },
  {
    id: 8,
    name: "Godawari Bungalow",
    slug: "godawari-bungalow",
    price: "₹ 30 - 40 Lac",
    tags: [],
    area: "900",
    beds: "3",
    baths: "2",
    parking: "1",
    image: "/villa/godawari.webp",
    description: "A well-planned 3-bedroom bungalow that combines functional interiors with comfortable family spaces, making everyday living convenient and accessible."
  },
  {
    id: 9,
    name: "Jayanti Bungalow",
    slug: "jayanti-bungalow",
    price: "₹ 40 - 50 Lac*",
    tags: [],
    area: "1300",
    beds: "3",
    baths: "2",
    parking: "1",
    image: "/villa/jayanti-classic.webp",
    description: "A flexible bungalow offering 3 bedroom configurations, giving families options to suit their space requirements while maintaining a practical and comfortable layout."
  },
  {
    id: 10,
    name: "Kaveri Bungalow",
    slug: "kaveri-bungalow",
    price: "₹ 35 - 55 Lac",
    tags: [],
    area: "1400",
    beds: "4",
    baths: "2",
    parking: "1",
    image: "/kaveri/kaveri-row.webp",
    description: "A well-proportioned 4-bedroom bungalow with a practical layout, providing families with dedicated sleeping spaces and room for comfortable everyday living."
  },
  {
    id: 11,
    name: "Gayatri Row House",
    slug: "gayatri-row-house",
    price: "₹ 28 - 35 Lac",
    tags: [],
    area: "1300",
    beds: "2",
    baths: "2",
    parking: "1",
    image: "/gayatri/thumb.webp",
    description: "A compact 2-bedroom row house featuring two bathrooms and a space-conscious design, offering an appealing option for small families seeking independent home living."
  },
  {
    id: 12,
    name: "Rainbow Row House",
    slug: "rainbow-house-bungalow",
    price: "₹ 35 - 45 Lac",
    tags: ["Top New", "Sale"],
    area: "2000",
    beds: "3",
    baths: "5",
    parking: "1",
    image: "/villa/bainbow-house-bungalow.webp",
    description: "A spacious 4-bedroom bungalow with five bathrooms and generous overall area, designed to accommodate family needs while providing additional convenience and privacy."
  },
  {
    id: 13,
    name: "Ambika Bungalow",
    slug: "ambika-bungalow",
    price: "₹ 40 - 50 Lac",
    tags: ["Top New"],
    area: "2100",
    beds: "4",
    baths: "2",
    parking: "1",
    image: "/villa/ambika-bungalow.webp",
    description: "A generously sized 4 bedroom bungalow offering room to relax, gather, and enjoy family life, with a spacious layout designed around everyday comfort."
  },
  {
    id: 8,
    name: "Ganga New 2BHK",
    slug: "ganga-new-2bhk",
    price: "₹ 10 - 16 Lac",
    tags: ["Top New Apartment"],
    area: "510",
    beds: "2",
    baths: "1",
    parking: "1",
    image: "/villa/ganga.webp",
    description: "An affordable 2-bedroom home designed to make efficient use of space, providing a practical option for first-time buyers, couples, and small families."
  },
  {
    id: 14,
    name: "Aditi 1.0",
    slug: "aditi",
    price: "₹ 16 - 24 Lac",
    tags: [],
    area: "750",
    beds: "3",
    baths: "2",
    parking: "1",
    image: "/aditi/thumb.webp",
    description: "A budget-friendly apartment option with 3 BHK configurations, offering practical layouts for individuals and families looking for an accessible urban home."
  },
  {
    id: 15,
    name: "Nano",
    slug: "nano",
    price: "₹ 7 - 15 Lac",
    tags: ["Top New"],
    area: "350",
    beds: "1",
    baths: "1",
    parking: "-",
    image: "/nano/thumb.webp",
    description: "A spacious 4-bedroom home designed for growing families, featuring generous living areas and a practical layout that supports privacy and shared moments."
  },
];


// Model details are intentionally kept exactly as provided, including existing image paths.
// Model IDs are not used as React keys because the provided data contains a duplicate id: 8.
function modelType(model) {
  if (model.name.includes('Row House')) return 'row-house';
  if (model.name.toLowerCase().includes('bungalow')) return 'bungalow';
  if (model.name === 'Aditi 1.0') return 'apartment';
  return 'other-home';
}

// Prices in the supplied data are ranges. This filters by the starting price.
function startingPriceLakhs(price) {
  const match = price.replace('₹', '').trim().match(/^(\d+(?:\.\d+)?)\s*(Cr|Lac)?/i);
  if (!match) return null;
  return Number(match[1]) * (/^cr$/i.test(match[2] || '') ? 100 : 1);
}

function isInStartingBudget(price, budget) {
  if (!budget) return true;
  const amount = startingPriceLakhs(price);
  if (amount === null) return false;
  switch (budget) {
    case 'under-20': return amount < 20;
    case '20-40': return amount >= 20 && amount < 40;
    case '40-60': return amount >= 40 && amount < 60;
    case '60-100': return amount >= 60 && amount < 100;
    case '100-plus': return amount >= 100;
    default: return true;
  }
}

export const metadata = {
  title: 'Homes & Bungalow Models | Vastu Vihar',
  description:
    'Explore Vastu Vihar bungalow, row house and apartment models. Compare home types, BHK options and indicative starting prices.',
};
export default async function ProjectsPage({ searchParams }) {
  const params = (await searchParams) || {};
  const filters = {
    status: typeof params.status === 'string' ? params.status : '',
    type: typeof params.type === 'string' ? params.type : '',
    beds: typeof params.beds === 'string' ? params.beds : '',
    budget: typeof params.budget === 'string' ? params.budget : '',
  };
  const filteredModels = MODELS_DATA.filter((model) =>
    (!filters.status || model.tags.includes(filters.status)) &&
    (!filters.type || modelType(model) === filters.type) &&
    (!filters.beds || model.beds === filters.beds) &&
    isInStartingBudget(model.price, filters.budget)
  );
  return (
    <PageLayout route="projects">
      <div className="breadcrumb-wrap">
        <div className="breadcrumb-overlay"></div>{' '}
        <div data-elementor-type="wp-post" data-elementor-id="4326" className="elementor elementor-4326">
          <div
            className="elementor-element elementor-element-01909e9 e-con-full e-flex e-con e-parent"
            data-id="01909e9"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-c4ae009 e-flex e-con-boxed e-con e-child"
              data-id="c4ae009"
              data-element_type="container"
            >
              <div className="e-con-inner">
                <div
                  className="elementor-element elementor-element-295b751 hidden-spaciaz-list-item-yes elementor-widget elementor-widget-spaciaz-breadcrumb"
                  data-id="295b751"
                  data-element_type="widget"
                  data-widget_type="spaciaz-breadcrumb.default"
                >
                  <div className="elementor-widget-container">
                    <div className="breadcrumb" typeof="BreadcrumbList" vocab="https://schema.org/">
                      <div className="breadcrumb-listItem">
                        <span property="itemListElement" typeof="ListItem">
                          <Link
                            property="item"
                            typeof="WebPage"
                            title="Go to Home."
                            href="/"
                            className="home"
                            prefetch={false}
                          >
                            <span property="name">Home</span>
                          </Link>
                        </span>{' '}
                        &gt;{' '}
                        <span property="itemListElement" typeof="ListItem">
                          <span property="name" className="archive post-spaciaz_project-archive current-item">
                            Home Models
                          </span>
                        </span>
                      </div>{' '}
                      <h1 className="spaciaz-title">Our Home Models</h1>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-element elementor-element-5b44ace elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                  data-id="5b44ace"
                  data-element_type="widget"
                  data-widget_type="hfe-breadcrumbs-widget.default"
                >
                  <div className="elementor-widget-container">
                    <nav aria-label="Breadcrumb">
                      <ul className="hfe-breadcrumbs hfe-breadcrumbs-show-home">
                        <li className="hfe-breadcrumbs-item hfe-breadcrumbs-first">
                          <span className="hfe-breadcrumbs-home-icon"></span>
                          <Link href="/" prefetch={false}>
                            <span className="hfe-breadcrumbs-text">Home</span>
                          </Link>
                        </li>
                        <li className="hfe-breadcrumbs-separator">
                          <span className="hfe-breadcrumbs-separator-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square-full"
                              viewBox="0 0 512 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 512H0V0h512v512z"></path>
                            </svg>
                          </span>
                        </li>
                        <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                          <span className="hfe-breadcrumbs-text" aria-current="page">
                            Home Models
                          </span>
                        </li>
                      </ul>
                    </nav>{' '}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-2638992 elementor-widget elementor-widget-spacer"
              data-id="2638992"
              data-element_type="widget"
              data-widget_type="spacer.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-spacer">
                  <div className="elementor-spacer-inner"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="content" className="site-content clear" tabIndex="-1">
        <div className="col-fluid">
          <div className="project-archive-style-2 col-full">
            <div id="primary" className="content-area">
              <main id="main" className="site-main" role="main">
                <div className="project-archive-content has-filter-style-1">
                  <div className="spaciaz-project-filter">
                    <form
                      className="project-form-filter spaciaz-project-has-filter-style-1"
                      data-next-project-filter=""
                      method="get"
                      action="/projects"
                    >
                      <h4 className="filter-title">Filter</h4>
                      <select name="status" aria-label="Model highlights" defaultValue={filters.status}>
                        <option value="">All Models</option>
                        <option value="Top New">Top New</option>
                        <option value="Sale">Sale</option>
                      </select>
                      <select name="type" aria-label="Home type" defaultValue={filters.type}>
                        <option value="">Home Type</option>
                        <option value="bungalow">Bungalow</option>
                        <option value="row-house">Row House</option>
                        <option value="apartment">Apartment</option>
                        <option value="other-home">Other Homes</option>
                      </select>
                      <select name="beds" aria-label="Bedrooms" defaultValue={filters.beds}>
                        <option value="">Bedrooms</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4 BHK</option>
                        <option value="5">5 BHK</option>
                        <option value="7">7 BHK</option>
                      </select>
                      <select name="budget" aria-label="Starting price" defaultValue={filters.budget}>
                        <option value="">Starting Price</option>
                        <option value="under-20">Under ₹20 Lac</option>
                        <option value="20-40">₹20 – 40 Lac</option>
                        <option value="40-60">₹40 – 60 Lac</option>
                        <option value="60-100">₹60 Lac – 1 Cr</option>
                        <option value="100-plus">₹1 Cr and Above</option>
                      </select>
                      <div className="filter-wrap filter-wrap-button">
                        <button type="submit">Search</button>
                      </div>
                    </form>{' '}
                  </div>
                  <div className="archive-content-inner">
                    <div
                      style={{ '--gutter-width': '30px' }}
                      className="d-grid grid-columns-desktop-3 grid-columns-tablet-2 grid-columns-1"
                    >
                      {filteredModels.map((model) => (
                        <div className="grid-item" key={model.slug}>
                          <div
                            className="project-item project-style-2"
                            data-budget={model.price}
                            data-type={modelType(model)}
                            data-status={model.tags.join(',')}
                            data-beds={model.beds}
                            title={model.description}
                          >
                            <div className="project-post-thumbnail">
                              <img
                                width="1920"
                                height="1344"
                                src={model.image}
                                className="attachment-full size-full wp-post-image"
                                alt={model.name}
                                loading="lazy"
                                decoding="async"
                              />{' '}
                            </div>
                            <div className="project-content">
                              <div className="project-status">
                                <Link href={`/models/${model.slug}/`} prefetch={false}>
                                  {model.price}
                                </Link>
                              </div>{' '}
                              <div className="project-location">
                                <i className="spaciaz-icon-marker"></i>
                                <span>
                                  {model.beds} BHK{model.area ? ` · ${model.area} sq. ft.` : ''}
                                </span>
                              </div>{' '}
                              <h4 className="project-title delta">
                                <Link href={`/models/${model.slug}/`} prefetch={false}>
                                  {model.name}
                                </Link>
                              </h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>{' '}
                    {filteredModels.length === 0 && (
                      <p>No models match your filters. Please change your selection and try again.</p>
                    )}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
