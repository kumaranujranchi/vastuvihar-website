# Spaciaz Website — Demo 5

This is the simplified, runnable Next.js website made from the uploaded Spaciaz project. **The fifth homepage is now the main website at `/`.** Every page uses the same Demo 5 header, footer, navigation, fonts, and shared interaction system.

## Run the website

Install **Node.js 20.9 or newer**, extract this ZIP, and open a terminal in the `spaciaz-website` folder — the folder containing `package.json`.

```bash
npm ci
npm run dev
```

Open **http://localhost:3000**.

`npm ci` installs the versions in the included lockfile. The project uses Next.js **16.4.3**, React **19.3.1**, and plain JavaScript/JSX. You do not need WordPress, Elementor, PHP, or a database to run it.

To use a different port:

```bash
npm run dev -- --port 3001
```

## Simple folder structure

| Folder | What belongs here |
| --- | --- |
| `app/` | Website pages and route files. The homepage is `app/page.jsx`; About is `app/about-us/page.jsx`, etc. |
| `components/` | Shared Header, Footer, Navigation, MobileNavigation, Breadcrumb, layouts, forms, and dialogs. |
| `components/home/` | Nine named Demo 5 sections: Hero, Partners, Company, Projects, Careers, Values, Stats, Image, and News. |
| `components/projects/` | One reusable project-detail layout, split into facts, hero, description, amenities, media, location, enquiry, and navigation. |
| `components/team/` | One reusable team-member profile layout. |
| `animations/` | Reveal effects, counters, carousels, tabs, menus, scrolling, filters, media, and career interactions. |
| `styles/` | All CSS. `globals.css` imports the shared styles, individual page styles, animation styles, and layout adjustments. |
| `public/images/` | Photographs, image assets, and the website logos. |
| `public/fonts/` | Local font and icon-font files. |
| `public/icons/` | Reusable partner SVG artwork extracted from the original page markup. |
| `data/` | Shared navigation, branding/contact settings, project details, team details, page metadata, and site search entries. |
| `scripts/` | Integrity verification and optional static export. |

There is no `src/generated/` folder, hash-named header/footer collection, asset path through `wp-content/`, reference-theme copy, or stylesheet synchronization step. Edit the real JSX and CSS files directly.

## Pages retained

| Page group | URL / location |
| --- | --- |
| Home — Demo 5 design | `/` |
| About | `/about-us/` |
| Core values | `/core-values/` |
| Awards | `/our-awards/` |
| Team | `/our-team/` |
| Six team profiles | `/our-team/[slug]/` |
| Careers | `/careers/` |
| FAQs | `/faqs/` |
| Contact | `/contact/` |
| Project grid | `/projects/` |
| Thirteen project details | `/projects/[slug]/` |
| Blog and blog grid | `/blog/`, `/blog-grid/` |
| Fourteen original articles | Their existing article URLs |
| Related archives | Blog categories, project status/location archives, and existing pagination URLs |
| Error page | Shared layout with helpful Home and Projects links |

There are **61 retained content routes**. The normal navigation highlights the main website sections; supporting archives remain available through their existing links.

Removed: all separate `/home-1/` through `/home-10/` demo routes, all service listing/detail pages, the homepage's service section, `/projects-list/`, and the `/all-pages/` demo directory. The fifth demo is served only at the website root. The header and mobile menu have no demo selector or Services item.

## Where to edit

| Change | File(s) |
| --- | --- |
| Site name, shared phone/email, logo paths | `data/site.js` |
| Desktop, mobile, and footer navigation links | `data/navigation.js` |
| Header / footer markup | `components/Header.jsx`, `components/Footer.jsx` |
| Homepage section order | `app/page.jsx` |
| Homepage copy and images | The corresponding file in `components/home/` |
| Company and other regular page content | The matching `app/.../page.jsx` |
| Project grid cards and filter options | `app/projects/page.jsx` |
| Project detail titles, images, locations, prices, and facts | `data/projects.js` |
| Shared project descriptions, amenities, media, and map | The corresponding file in `components/projects/` |
| Team-member profile information | `data/team.js` |
| Colors and typography | `styles/foundation.css`, `styles/theme.css` |
| Shared header/footer styling | `styles/header.css`, `styles/footer.css`, `styles/layout.css` |
| Page-specific styling | `styles/pages/` |
| Motion and interactive behavior | `animations/` and `styles/animations.css` |
| Search text and page lookup metadata | `data/search-index.json`, `data/pages.json` |

All images use short public URLs, such as `/images/project_1.jpg`. To replace an image while keeping the same layout, replace the corresponding file in `public/images/` or update the URL in the relevant component/data record.

The supplied Spaciaz sample copy, project facts, team information, contact details, and map locations are retained. Update those with your own business information before publishing. Some listing-page cards and homepage content remain page-specific; editing a detail record does not automatically rewrite those editorial sections.

### Adding a page or project

Create a normal `app/your-page/page.jsx` route and wrap its content in `PageLayout`, matching the existing pages. Add it to `data/pages.json` and `data/search-index.json` and, if needed, `data/navigation.js`.

For another project detail or team profile, add a record to the corresponding data file. The `[slug]` route generates its page. Update the route/search metadata and any listing cards that should link to it, then rebuild.

The original `elementor-*` class names and `data-settings` hooks are kept where the design or animation code uses them. They are ordinary HTML hooks here; no Elementor software is loaded. Change them together with their CSS/animation references if you rename them.

## Animations and interactions

| File | Responsibility |
| --- | --- |
| `animations/reveal.js` | Entrance effects and animated number counters |
| `animations/carousels.js` | Responsive slides, arrows, dots, swipe, autoplay/pause |
| `animations/navigation.js` | Mobile drawer, focus, submenus, scroll locking |
| `animations/tabs.js` | Video/media tabs and FAQs |
| `animations/scroll.js` | Hero positioning, company timeline, project hover effects, scroll-to-top |
| `animations/project-filter.js` | Filtering the project grid |
| `animations/careers.js` | Opening and switching job descriptions |
| `animations/media.js` | Image/video lightboxes |
| `animations/dom.js` | Shared settings, event cleanup, and focus utilities |

`components/ThemeRuntime.jsx` initializes these modules per route and cleans them up when navigating. Reduced-motion preferences are respected and the server-rendered text remains readable before JavaScript runs.

## Contact and enquiry forms

The website runs without any environment variables. Contact and project-enquiry forms initially display **“Preview form — messages are not sent.”** This avoids showing a false success message when no receiving service is connected.

To enable submissions:

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_CONTACT_ENDPOINT` to your form service's HTTPS endpoint.
3. Restart the development server, or rebuild for production.

```dotenv
NEXT_PUBLIC_CONTACT_ENDPOINT=https://your-form-service.example/submit
```

The endpoint must accept a JSON `POST` from your website, allow its origin through CORS, and return a successful HTTP response. The request contains the form fields and the page URL; project enquiries also include the selected project title. Keep secret keys on your receiving server — `NEXT_PUBLIC_` values are visible in the browser. Configure delivery/CRM storage in that service.

## Production build

```bash
npm run verify
npm run build
npm run start
```

`verify` checks the required pages, imports, local assets, removed routes, navigation links, and search entries. `build` creates the optimized website; `start` serves it at http://localhost:3000.

## Optional static export

```bash
npm run export
```

The deployable files are written to `out/`. Upload the **contents** of `out/` to a static web host that serves directory index files. URLs use trailing slashes. For a normal Next.js server after exporting, run `npm run build` again before `npm run start`.

Use an HTTP server to preview an export; opening `index.html` directly through `file://` does not reproduce normal routing. The supplied paths assume hosting at the domain root.

## Media and included files

Images, logos, and fonts are local. The original Vimeo/YouTube/Pexels videos and Google Maps embeds use external providers and require an internet connection. The Demo 5 hero has a local image fallback while video loads.

The ZIP contains source code, the lockfile, local assets, and these instructions. `node_modules/`, `.next/`, generated `out/`, temporary browser checks, and screenshots are omitted. Install dependencies after extracting.
