# SEO, AEO and GEO Audit: Vastu Vihar

**Audit date:** 3 November 2026
**Code audited:** branch `feature/dpdp-privacy-compliance` at `0c7a1b7`, plus the uncommitted changes listed in [section 8](#8-changes-made-during-this-audit)
**Method:** crawled a local production build (Next.js 16.4.3), read the source and data files, and checked the live domains

## 1. Summary

The new site has a good technical base. Its pages are server-rendered, its URLs are clean, and its pricing and location data are unusually rich. It is not ready to launch from a search perspective, for three reasons:

1. **Launching on vastuvihar.org as it stands would remove most of the site's existing search presence.** All 103 URLs in the old sitemap have no redirects. The 44 city pages and 12 buying-guide articles also have no equivalent on the new site.
2. **Demo theme content is still live.** The team pages show fictional people, including a "founder & CEO" named Dennis Daniels, with lorem ipsum and US legal credentials. A published article headed "AI in Real Estate" is actually about education.
3. **No page gives search or AI systems structured facts.** There is no JSON-LD anywhere, 29 of the 46 working pages crawled have a generic or malformed title, and no project page shows a RERA number.

### Scorecard

| Area | Rating | Main reason |
|---|---|---|
| Crawlability and rendering | 🟢 Good | Content is in the raw HTML. robots and sitemap now exist |
| Migration readiness | 🔴 Blocking | No redirects, no city pages, and the production domain is undecided |
| On-page metadata | 🔴 Poor | Homepage title is "Home", with 12 generic and 16 doubled titles |
| Structured data | 🔴 Missing | 0 pages have JSON-LD |
| Content and trust (E-E-A-T) | 🔴 Poor | Demo content, no RERA numbers, no real reviews or named experts |
| Local SEO | 🟠 Weak | 42 branch cities are on one page, with no city pages |
| Performance | 🟠 At risk | Heavy assets, but no lab or field scores were captured |
| AEO (answer readiness) | 🟠 Weak | Good raw facts, but few direct answers and only 6 FAQs |
| GEO (AI citation readiness) | 🟠 Weak | Conflicting facts, and thin third-party evidence in limited searches |

Ratings are my judgment from the evidence below. They are not a calculated score.

### What was not measured

Treat these as gaps in the evidence:

- **Rankings, traffic, backlinks and indexed pages:** I had no access to Search Console, analytics or a backlink tool. I don't know how much traffic the old URLs earn, so export that data before finalising the redirects.
- **Core Web Vitals:** Lighthouse failed twice with a Chrome interstitial error in this environment. Section 4.7 reports measured file sizes instead.
- **Actual AI answers:** I did not test ChatGPT, Perplexity, Gemini or AI Overviews. [Appendix D](#appendix-d-ai-visibility-test-prompts) has a prompt set for a baseline.
- **Google Business Profiles:** these were not checked.
- **The production database:** the local database is out of date and contains only one test post, so its blog and careers content is not representative.

External search results came from a US-based tool with a few queries, so treat them as indicative. Crawl figures cover the 50 URLs reachable by following links from the homepage: 46 working pages, 3 returning 404 and 1 returning 500.

## 2. Decisions needed first

These decisions affect most of the fixes below.

| # | Decision | Why it matters | Recommendation |
|---|---|---|---|
| 1 | **Which domain is production?** | `vastuvihar.org` is the old ASP.NET site, and `.com` and `www.vastuvihar.com` both serve a separate Next.js site. This code defaults to `.org`, but the FAQ text and admin UI say `.com` | Choose one. `.org` looks like the better default because the code and company email addresses use it, but check Search Console and backlink data first |
| 2 | **What happens to the other domain?** | Two live sites compete for the same brand. The `.com` homepage has no canonical, and its robots.txt and sitemap.xml return 404 | 301 every URL to the chosen domain, page by page |
| 3 | **Are RERA registration numbers available for every advertised project?** | See finding [C5](#41-critical-resolve-before-launch). This is a compliance question as well as a trust signal | Collect them from the legal team, and have counsel confirm the wording and placement |
| 4 | **Do the claims hold up?** | "65+ cities", "20,000+ homes", Nepal operations and the award details are likely to be quoted by AI systems | Have the business confirm each one (see [G2](#6-geo-generative-engine-optimization)) |
| 5 | **Should AI companies be allowed to train on the content?** | This is separate from appearing in AI search | Allow search crawlers. Allowing training is a business choice (see [Appendix C](#appendix-c-robots-policy-for-ai-crawlers)) |

## 3. What is already working

- **Rendering:** page content, including FAQ answers, is in the initial HTML, so it does not depend on a crawler running JavaScript. Tested crawlers, including GPTBot, ClaudeBot and Googlebot user agents, received the title in `<head>`.
- **URLs:** they are readable and consistent, and non-slash URLs 308 to the trailing-slash version.
- **Status codes:** unknown projects, blog posts, categories, albums and price lists return real 404s.
- **Mobile and language basics:** the viewport tag and `lang="en"` are present.
- **Alt attributes:** none of the crawled images are missing the attribute, though quality varies.
- **Data assets:** the price lists have dated prices, areas and payment schedules. Model pages have room-level dimensions, and contact data covers 42 branch cities. Few competitors publish this much, and it is the best raw material for AEO and GEO.
- **Admin protection:** `/admin` sends `X-Robots-Tag: noindex, nofollow`.

## 4. SEO findings

Severity: 🔴 critical, 🟠 high, 🟡 medium, ⚪ low. Effort: S is under a day, M is a few days, L is a week or more.

### 4.1 Critical: resolve before launch

| ID | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| C1 | 🔴 **No redirects for the old site** | The live sitemap at `vastuvihar.org` lists 103 URLs. `/About.aspx`, `/Project_Bihar/Patna.aspx` and `/Model_Details/Yamuna_Bungalow.aspx` all return 404 on the new build, and `next.config.mjs` has no `redirects()` | Build the map in [Appendix A](#appendix-a-legacy-url-redirect-map), then follow [Google's site-move steps](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes). Keep redirects for at least a year | M |
| C2 | 🔴 **City pages would be lost** | The old sitemap has 44 city pages, such as `/Project_Bihar/Patna.aspx`. The new site has no city routes, so "bungalow in Patna" searches have no matching page | Add `/locations/<city>/` before launch. Data already exists in `data/branch-contacts.js`, `data/site-contacts.js` and `data/priceLists.js`. See [L1](#44-local-seo) | L |
| C3 | 🔴 **Editorial content would be lost** | 12 guides have no new equivalent, including `/9-vastu-checks-before-buying-a-new-house.aspx` and `/FIRST-TIME-HOME-BUYERS-IN-INDIA.aspx`. The new blog holds one test post | Migrate, update and redirect them. These question-led topics are also the natural AEO content | M |
| C4 | 🔴 **Demo content is live and indexable** | `/our-team/dennis-daniels/` and five similar profiles return 200 with lorem ipsum and "New York State Trial Lawyers Institute" (`data/team.js`). `/ai-in-real-estate-construction/` discusses access to education | Replace with real people or delete the routes so they return 404. Leaving them out of the sitemap does not stop indexing. Remove `/our-team/` from the sitemap until it is real, because it currently lists these profiles and nothing links to it | S–M |
| C5 | 🔴 **No RERA numbers on project or price pages** | Case-insensitive search of `components/`, `data/` and the project, price, about and contact routes finds no "RERA". Price pages say "Booking Open". RERA is only mentioned in passing in the privacy policy | [Section 11(2) of the RERA Act](https://rera.ap.gov.in/RERA/Views/AdvertisementGuidelines.aspx) requires the registration number and the Authority's website in advertisements. [Bihar RERA's notice](https://rera.bihar.gov.in/RERAAwarenessAlert.aspx) restates this, and it has been [reported fining promoters for omitting them](https://propnewstime.com/latestnewsstories/MTU2MzI=/rera-bihar-penalises-seven-promoters-for-non-compliance-with-advertisement-regulations). Add a `reraNumber` field and display it on each phase page. **Have counsel confirm how this applies to the website** | M |
| C6 | 🔴 **Test post appears publicly and returns a 500** | "thi sis test blog" shows on the homepage, `/blog/` and `/category/social-media/`, and is in the sitemap. Its page returns 500 because the local database lacks `Comment.noticeVersion` | Delete the post. Sync the schema to the database before launch, because the same error would break every blog post on any database in this state | S |
| C7 | 🔴 **Production domain is undecided** | See [section 2](#2-decisions-needed-first). Code uses `NEXT_PUBLIC_SITE_URL`, while `data/faqs.js:37` and the admin screens hardcode `.com` | Decide, then update all references | S |

### 4.2 Titles, descriptions and headings

| ID | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| M1 | 🔴 **Homepage title is "Home"** | `app/page.jsx:17`. [Next.js docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title) confirm a layout's template does not apply to a page in the same segment | Use the title in the table below | S |
| M2 | 🔴 **Homepage description is scraped theme text** | It ends "...who we are · who we ar" and is 240 characters long | Replace with a written description | S |
| M3 | 🟠 **16 pages have doubled titles** | Example: "Our Team \| Vastu Vihar \| Vastu Vihar". `createPageMetadata` adds the brand (or the title already has it), then the layout template in `app/layout.jsx:10` adds it again | Pass `title: { absolute: formattedTitle }` from `lib/metadata.js`, and remove manual suffixes on `/blog/`, `/projects/` and `/category/` | S |
| M4 | 🔴 **Commercial pages use the default title and description** | 12 crawled pages show "Vastu Vihar – Real Estate & Construction Group": `/price-list/`, 9 price-list detail pages, and the branch and site contact pages. The other 4 price lists have the same gap | Add `generateMetadata` to `app/price-list/[slug]/page.tsx`. The index and contact pages are `'use client'` and cannot export metadata, so move their UI to a client component rendered by a server `page` | S–M |
| M5 | 🟠 **Model descriptions are one template** | "\<Name\> by Vastu Vihar. Explore model specifications..." on all 16 models | Generate from data: BHK, built-up area, plot area and price | S |
| M6 | 🟠 **8 crawled pages have no H1, and 4 have several** | No H1: about, core values, gallery, FAQs, careers, contact, blog and category. Homepage has 4, three of which form "Make your next / career / move" (`components/home/CareersSection.jsx:21,37,121`). Privacy, rights and terms have 2 each | Make header `<h2>`s the H1, make the careers text an H2, and remove duplicate breadcrumb H1s. Also fix `/our-team/` and `/careers/apply/` if kept | S |
| M7 | 🟡 **Raw data shows in headings** | The price page H1 reads "Ara_Phase-2_Extension" | Clean `projectName` values in `data/priceLists.js` | S |

**Suggested titles** (no search-volume data was available, so validate them against Search Console):

| Page | Title | Description direction |
|---|---|---|
| Home | Vastu Vihar: Bungalows & Flats in Bihar & Eastern India | Who, what, since when, where |
| Price detail | Ara Phase-4 Price List: Bungalows from ₹45 Lakh \| Vastu Vihar | Models, price range, validity dates |
| Model | Simplex 2 BHK Bungalow: Plans & Price \| Vastu Vihar | BHK, areas, price range |
| Branch contact | Vastu Vihar Branch Offices in 42 Cities \| Addresses & Phones | States and how to visit |
| City (new) | Bungalows & Flats in Patna \| Vastu Vihar | Phases, models, prices, office |

### 4.3 Canonicals, sitemap and social metadata

| ID | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| T1 | 🟠 **32 of 46 pages have no canonical** | This includes the homepage, `/projects/`, all model pages and all price lists. `/projects/?type=Bungalow` repeats the `/projects/` title with no canonical. Blog posts have none either (`app/blog/[slug]/page.tsx`) | Add a self-referencing canonical to every page. Filtered URLs should point to `/projects/` | S |
| T2 | 🟠 **32 of 46 pages have no Open Graph image, and none have `og:url`** | Model, price and blog index pages lack OG tags entirely. `createPageMetadata` never sets `url` | Route all pages through the helper, and set `url` | S |
| T3 | 🟠 **The default share image is the wrong size** | `/images/vastu-logo.webp` is 1105×612 but is declared as 1200×630 (`lib/metadata.js`) | Create a 1200×630 JPG or PNG. Use real photography per model | S |
| T4 | 🟡 **Blog `og:url` is hardcoded** | `app/blog/[slug]/page.tsx:29` hardcodes `vastuvihar.org` and omits the trailing slash | Build it from `SITE_URL` | S |
| T5 | 🟠 **Sitemap issues** | The test post that returns 500 is listed, and `/our-team/` is listed with fictional people. 4 price lists are in the sitemap but no page links to them: `purnea-phase-4-flats-2-bhk`, `purnea-phase-4-bungalows`, `purnea-phase-4-01-ext-flats` and `purnea-phase-4-01-ext-bungalows`. Static and model entries have no `lastModified` | Clean up with C4 and C6, and link those 4 pages from `/price-list/`. Add `lastModified` only where a real date exists | S |
| T6 | 🟠 **3 broken internal links on `/price-list/`** | `/price-list/gaya-1/`, `/patna-5/` and `/muz-2/` return 404 (`app/price-list/page.tsx:22-24`). Patna is the head office city | Add the missing data or remove the links | S |
| T7 | 🟡 **Broken link from the demo article** | Links to `/eco-friendly-construction-trends/`, which returns 404 | Resolved by removing the article (C4) | S |
| T8 | 🟡 **Empty city entries on the price list** | 5 entries show `phases: []` | Show a useful call to action, or link to the city page | S |
| T9 | 🟡 **Search verification may be lost** | The old site has a `google-site-verification` meta tag. The new site has none. Google says [to keep verification in place during a move](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) | Carry it over through `metadata.verification`, or use DNS verification, which is safer | S |
| T10 | ⚪ **The old sitemap needs retiring** | It lists `www` URLs while the code uses the bare domain, and every `lastmod` is April 2024. Both hosts return 200 for `/About.aspx` | Redirect `www` to the chosen host in one hop. The new `app/robots.ts` and `app/sitemap.ts` replace the old sitemap | S |
| T11 | ⚪ **Unused manifest with template values** | `public/favicon-for-app/manifest.json` says "MyWebSite" and points to icons that don't exist | Fix or delete it | S |

### 4.4 Local SEO

| ID | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| L1 | 🔴 **No city landing pages** | 42 branch cities and 40 site-contact cities share two long pages | Build `/locations/<city>/` with unique content: phases and addresses, models sold there, current prices from the price list, RERA numbers, the branch office and map, local FAQs, and real site photos. Pages that differ only by city name risk being seen as doorway pages, so publish in stages and start with cities that have the most data | L |
| L2 | 🟠 **No LocalBusiness data** | No JSON-LD for the head office or branches | Add per-branch markup on city pages ([Appendix B](#appendix-b-structured-data-templates)) | M |
| L3 | 🟠 **Address spelling varies** | The site uses "Aashiana Tower", a Bihar RERA document uses "Ashiana Towers", and branch data uses inconsistent city spellings (Purnia/Purnea, Chapra/Chhapra, Bhubaneshwar/Bhubaneswar) | Choose one form per location and use it everywhere, including Google Business Profiles and directories | S–M |
| L4 | 🟠 **Google Business Profiles unknown** | Not checked | Audit all branches: verified, correct name and phone, linking to the matching city page | M |
| L5 | 🟡 **Model pages have no location** | Each model has `location: 'Vastu Vihar Home Models'` (`data/projects.js`), and `/projects/nano/` receives links from only 3 crawled pages | Show where each model is sold. Cross-link model, city and price pages | M |
| L6 | 🟡 **English only** | The audience is largely in Hindi-speaking regions, and old news URLs contain Hindi. There is no Hindi site or `hreflang` | Test Hindi versions of the top city pages and buying guides after launch. Use human-reviewed translation | L |

### 4.5 Content and trust (E-E-A-T)

Home buying is a major financial decision, so trust signals matter more here than on most sites.

| ID | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| E1 | 🔴 **Leadership identity conflicts** | The awards page description names the founder as Vinay Kumar Tiwary, while `/our-team/dennis-daniels/` says "founder & ceo" | Publish real leadership profiles, with verified details | M |
| E2 | 🟠 **Testimonials are not from customers** | `components/about/AboutTestimonials.jsx` holds company marketing lines labelled like "Our commitment" | Replace with attributed customer stories, with consent. Do not add review markup to self-written content | M |
| E3 | 🟠 **Thin pages** | `/our-awards/` 41 words, `/careers/` 39, `/gallery/` 83, gallery albums 1–2 words, `/core-values/` 121 | Add awarding body, year and reason to awards. Add captions and event context to albums. Consider `noindex` on empty listings | M |
| E4 | 🟠 **Articles lack named experts** | Blog author defaults to the organisation | Add author and reviewer profiles, such as a named engineer for construction topics or a legal reviewer for buying guides | M |
| E5 | 🟡 **Careers page may go stale** | `/careers/` is prerendered with no revalidation, and `app/api/admin/vacancies/route.ts` doesn't refresh it. New vacancies would not appear until a rebuild | Apply the approach now used for the blog pages. Add `JobPosting` markup once vacancies are shown | S |
| E6 | 🟡 **On-site search exposes demo content** | `data/search-index.json` lists the demo team and old theme pages such as "Blog Grid", and it is serialised into every page's HTML | Regenerate it from real content, and load it only when search opens | S–M |

### 4.6 Structured data

**0 of 46 pages have JSON-LD.** Templates are in [Appendix B](#appendix-b-structured-data-templates). The Next.js guide recommends a `<script type="application/ld+json">` in the layout or page, escaping `<`.

| Priority | Type | Where | Benefit |
|---|---|---|---|
| 1 | `Organization`, `WebSite` | Site-wide | Establishes the entity, including legal name, founding date and profiles |
| 1 | `BreadcrumbList` | All inner pages | Supported by Google, and clarifies site structure |
| 2 | `RealEstateAgent` or `LocalBusiness` | City pages | Addresses, phones and geography per branch |
| 2 | `Product` + `AggregateOffer` | Model and price pages | Machine-readable BHK, area and INR price. There is no dedicated Google real-estate rich result to expect from this |
| 2 | `Article`, `Person` | Blog posts and profiles | Authorship and dates |
| 3 | `VideoObject` | Pages with YouTube videos | Video discovery. 10 of the 16 models have a video |
| 3 | `JobPosting` | Careers, once vacancies exist | Eligible for Google's job experience |
| 3 | `FAQPage` | Only with visible FAQs | **No Google rich result:** [FAQ rich results ended on 7 May 2026](https://developers.google.com/search/docs/appearance/structured-data/faqpage). It may still help other parsers, but don't expect a visible gain |

Markup must match what is visible on the page, and every value should be confirmed first. Do not add `aggregateRating` without genuine reviews shown on the page.

### 4.7 Performance

**No Core Web Vitals scores were captured.** Run [PageSpeed Insights](https://pagespeed.web.dev/) on the deployed site for the homepage, a model page and a price page. The sizes below are from the local build.

| Item | Measured | Note |
|---|---|---|
| Homepage images | 26 unique files, 11.6 MB | Most are lazy-loaded, so not all load at once. Largest is `/villa/ananta.webp` at 6.3 MB |
| Homepage CSS | 16 files, ~1,003 KB uncompressed | One file is 749 KB and `styles/globals.css` is ~1 MB of theme CSS |
| Homepage JavaScript | 10 files, ~632 KB uncompressed | |
| Homepage HTML | 197 KB, or 34.5 KB gzipped | 120 KB is framework data, including the full search index |
| `public/` | 238 MB | `About.jpeg` is 19 MB and `about-bc.jpeg` is 12 MB (both CSS backgrounds). City images are about 3 MB each |
| Static asset caching | `Cache-Control: public, max-age=0` | Measured under `next start`, so check the production nginx config |

| ID | Finding | Fix | Effort |
|---|---|---|---|
| P1 | 🟠 **Image optimisation is off.** `images: { unoptimized: true }` (`next.config.mjs:67`) applies even when not exporting statically, and raw `<img>` is used far more than `next/image` (77 `<img>` lines vs 2 `next/image` references) | Enable optimisation for server builds, then migrate key images, starting with hero and model galleries | M |
| P2 | 🟠 **Oversized source images** | Compress everything over 500 KB, targeting 200 KB or less for most images. Use responsive sizes | S–M |
| P3 | 🟠 **Hero loading is unfocused.** Three hero posters are preloaded, none has `fetchpriority="high"`, and the image used has no dimensions | Preload only the first poster, with high priority and a responsive size | S |
| P4 | 🟠 **Too much unused CSS.** The Elementor/WordPress theme CSS loads on every page | Audit and remove it gradually, testing visually. Remove unused icon fonts (3 families load) | L |
| P5 | 🟡 **Long-lived caching is missing for static assets** | Set a long cache for versioned assets at nginx or through `headers()`, and a shorter one for files whose names can change | S |
| P6 | 🟡 **Old site's homepage is very slow.** It timed out twice (20 s, 60 s) and took 75.9 s once from this network, while `/About.aspx` took 1.5 s | Keep this in mind while the old site stays live. It may already limit crawling, and it adds urgency to the migration | n/a |

## 5. AEO (Answer Engine Optimization)

AEO means structuring content so a search or voice system can pull out a direct answer.

**Google says [no special work is needed](https://developers.google.com/search/docs/appearance/ai-features) for AI Overviews or AI Mode**: "There are no additional requirements to appear in AI Overviews or AI Mode." It also says no special schema or AI text files are needed. So AEO here mostly means good SEO plus clear writing, and the SEO fixes above come first.

| ID | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| A1 | 🟠 **Model pages don't lead with an answer** | Descriptions are slogans such as "ANANTA = INFINITE", with facts spread across tables below | Start each page with a plain two- or three-sentence summary (example below) | M |
| A2 | 🟠 **Only 6 FAQs, all generic** | `data/faqs.js`. Most answers defer to "contact our team" | Grow to 25–40 specific questions, grouped by topic, using real sales-team and enquiry questions | M |
| A3 | 🟠 **Common buyer questions have no page** | Old guides are not migrated (C3), and there are no explainers on the booking process or payment stages | Publish the question list below | L |
| A4 | 🟠 **Headings are slogans, not questions** | "Built on Trust, Driven by Quality..." and model pages with 1 H2 and 13 H3s | Use descriptive headings such as "Simplex floor plan and room sizes" and "Payment schedule" | M |
| A5 | 🟠 **Prices are hard to quote reliably** | See [G1](#6-geo-generative-engine-optimization). Model prices conflict with price lists | Resolve G1 first | S–M |
| A6 | 🟡 **Dates are not prominent on factual pages** | Price lists have validity dates but model pages don't | Show "Prices valid from X to Y" and "Last updated" where accurate. `<time>` is already used on blog listings | S |
| A7 | 🟡 **Some facts are only in images or PDFs** | Floor plans and award graphics. PDF names include `FIRST FLOOR PLAN.pdf` | Keep room data as HTML tables, add descriptive alt text and rename files | M |
| A8 | ⚪ **Generic gallery alt text** | "Simplex Bungalow — Photo 1" | Describe the view, such as "Simplex bungalow front elevation with car parking" | M |

**Example of an answer-first opening**, using current data from `data/priceLists.js`:

> **The Simplex is a 2 BHK Vastu Vihar bungalow on a 1,000 sq ft plot with 1,000 sq ft of built-up area.** At Ara Phase-4, it is priced at ₹45–47 lakh (deluxe and luxury) for bookings from 16 Oct 2026 to 31 Mar 2027. Prices vary by city and phase.

**Priority questions to answer:**

- **Cost:** What does a 2 BHK or 3 BHK Vastu Vihar bungalow cost in [city]? What is the payment schedule? Which costs are extra (registration, stamp duty)?
- **Ownership:** Is land included with the bungalow? How does registration work?
- **Legal:** Is [project] RERA registered? Which documents should a buyer check?
- **Finance:** Which banks finance Vastu Vihar homes? How much down payment is needed?
- **Comparison:** Simplex vs Godawari? Bungalow vs flat? Under-construction vs ready-to-move?
- **Construction:** What is a raft foundation and why is it used? What differs between deluxe and luxury specifications?
- **Process:** How do I book a site visit? What happens after booking? How long until possession?
- **Vastu:** Kitchen direction, house entrance and buying checks, from the old guides.

Legal and financial answers should be reviewed by a qualified person and show that review on the page.

## 6. GEO (Generative Engine Optimization)

GEO means making content easy for AI systems to find, trust and cite. This field is young and the evidence is limited. The best-known study, [Aggarwal et al. (KDD 2024)](https://arxiv.org/abs/2311.09735), found visibility gains of up to 40% in its experiments, with results varying by domain. Those are not guaranteed results for this site, but citing sources and including statistics were among the tested methods and are worthwhile for readers anyway.

| ID | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| G1 | 🔴 **The site contradicts itself on prices** | See table below | Agree on one rule. Suggested: model pages show "from ₹X" drawn from the live price lists, plus the date. Generate the figures from data so they can't drift | M |
| G2 | 🟠 **Key claims need evidence** | **65+ cities**, but the data lists 42 branch cities and 40 site cities. **Nepal** appears in the about page, FAQ and enquiry form, with no Nepal office in the contact data. **20,000+ homes** has no supporting source. **Awards** lack year and issuing body | Confirm each with the business. Publish the basis, such as "20,000+ homes delivered as of [date]". Correct anything unsupported | M |
| G3 | 🟠 **The entity is not clearly defined** | The legal name, Technoculture Building Centre Pvt. Ltd., appears in only a few places, and two domains are live | Add `Organization` schema with `legalName`, `foundingDate`, `founder` and `sameAs`. State it plainly on the about page | S |
| G4 | 🟠 **No single source of company facts** | Facts are scattered across pages | Publish a "Company facts" section on the about page: legal name, founded, HQ, states, homes delivered, leadership and registrations, with "as of" dates | S |
| G5 | 🟠 **Thin third-party presence in the searches I ran** | Results were mostly [aggregator listings](https://www.commonfloor.com/vastu-vihar/builder/aq2crn) and [RERA documents](https://rera.bihar.gov.in/Cause_List/06-06-2025%20-%20COMPLAIN%20CASE%20-%20-%20-%20UPLODING.pdf). I found no independent source naming the founder | Correct directory listings. Seek press coverage, bank or partner mentions and industry citations. Keep profiles consistent. Only pursue Wikipedia or Wikidata if independent sources support notability | L |
| G6 | 🟠 **Public regulatory records may shape AI answers** | Bihar RERA cause lists name the company as respondent in complaint matters. Those I saw don't show outcomes, so this says nothing about whether any complaint was upheld | Have legal review the public record. Publish accurate registration and buyer-support information, so AI systems also have the company's verified details | M |
| G7 | 🟡 **Original data isn't published as content** | Price and construction data sit only in tables | Create useful comparison pages, such as a price overview by city and phase, and a model comparison table. Original data like this is hard for others to replicate | M |
| G8 | 🟡 **Claims don't cite sources** | Buying guides aren't migrated yet, and RERA is not linked | Link to RERA portals, government sources and bank pages | S |
| G9 | 🟡 **AI referrals can't be measured yet** | `NEXT_PUBLIC_GA4_ID` is empty in `.env.example`, so analytics are off by default | Enable GA4 once the policy wording is approved. Track referrals from `chatgpt.com`, `perplexity.ai`, `gemini.google.com` and similar sources. Consent choices will limit coverage | S |
| G10 | ⚪ **`llms.txt` is optional** | The file is absent. Google [says no such file is needed](https://developers.google.com/search/docs/appearance/ai-features) for its AI features | Low priority. Add a short one only after everything else, and don't expect a ranking effect | S |

**Current price conflicts (G1):**

| Model | Model page says | Price list or data says |
|---|---|---|
| Simplex 2 BHK | ₹30–35 lakh | ₹45–47 lakh (Ara Phase-4), ₹51–53 lakh (Ara Phase-2 Ext) |
| Kaveri 4 BHK | ₹35–55 lakh | ₹56.5–60 lakh (Ara Phase-2 Ext) |
| Yamuna 5 BHK | ₹55–70 lakh | ₹78–83 lakh ("Yamuna 5 BHK Big", Ara Phase-4) |
| CEO Bungalow | "₹90 Lac – 1.80 Cr" (`data/project.js:106`) | `minPrice` is 110, or ₹1.10 Cr |
| Classic CEO | "₹90 Lac – 1.70 Cr" (`data/project.js:189`) | `minPrice` is 100 and `maxPrice` is 180 |

Some phases do fall inside the model range (Yamuna 5 BHK at Aurangabad Project-2 is ₹57–62 lakh), so these ranges may be out of date rather than wrong everywhere. Either way, a reader or AI system gets different prices for the same model. The range format also varies, for example "35 - 50Lac" without a currency symbol. Separately, please check the Ananta floor plans: files named `floor-plan_ff_2d` and `floor-plan_g_2d` are labelled Ground Floor and First Floor, so they look swapped.

## 7. Action plan

### Phase 1: launch blockers

1. Decide the production domain and export Search Console data (Decisions 1–2).
2. Remove demo content and the test post, and sync the database schema (C4, C6).
3. Fix homepage metadata, doubled titles and default titles (M1–M4).
4. Add canonicals, Open Graph data and share images (T1–T4).
5. Fix H1s and broken links, and link orphaned price lists (M6, T5, T6).
6. Add RERA numbers after legal review (C5).
7. Resolve price conflicts and confirm company claims (G1, G2).
8. Add `Organization`, `WebSite` and `BreadcrumbList` schema (4.6).
9. Compress the largest images and fix hero loading (P2, P3).

### Phase 2: migration

10. Finalise and implement all redirects, including `www` and the other domain (C1, T10).
11. Build city pages, starting with those that have the most data (C2, L1, L2).
12. Migrate and update the 12 guides (C3).
13. Carry over Search Console verification, then launch, submit the sitemap and file a Change of Address if the domain changes (T9).
14. Monitor Search Console and 404 logs daily for the first weeks. Expect some ranking movement.

### Phase 3: first 90 days after launch

15. Run PageSpeed tests and address real issues (P1, P4, P5).
16. Add answer-first summaries, better headings and an expanded FAQ (A1, A2, A4).
17. Add real leadership profiles, customer stories and expert authors (E1, E2, E4).
18. Clean up Google Business Profiles and directory listings (L3, L4, G5).
19. Publish company facts and comparison pages (G4, G7).
20. Run the AI prompt baseline, then repeat it monthly (Appendix D).

### Phase 4: ongoing

21. Publish question-led content from sales enquiries.
22. Pursue press and partner mentions.
23. Test Hindi pages (L6).
24. Refresh prices and dates whenever price lists change.

### How to measure progress

| Metric | Source |
|---|---|
| Indexed pages, crawl errors, migrated URL coverage | Search Console |
| Clicks and impressions by city and model query | Search Console |
| Core Web Vitals | Search Console and PageSpeed Insights |
| Enquiries by landing page | GA4 and the `Lead.source` field |
| AI referrals | GA4 |
| Mentions and citations for test prompts | Appendix D, tracked monthly |

## 8. Changes made during this audit

Uncommitted changes appeared in the working tree while the audit was running. They were not made as part of this audit and are not committed, so make sure they get committed.

| File | Change | Effect on this audit |
|---|---|---|
| `app/robots.ts` (new) | Allows all crawlers, blocks `/admin/` and `/api/`, and points to the sitemap | Verified working. Replaces an earlier "missing" finding |
| `app/sitemap.ts` (new) | 52 URLs, refreshed hourly | Verified working. See T5 for remaining issues |
| `lib/blogCategories.ts` (new), `app/category/[slug]/page.tsx` | Shared category list | No SEO effect |
| `lib/metadata.js` | Adds `SITE_URL` | Doesn't fix M3 or T2 |
| `app/page.jsx`, `app/blog/page.tsx`, `app/api/admin/blogs/route.ts` | Hourly revalidation and refresh on publish or delete | **Read in source only.** These appeared after the last build I tested |

Crawl figures come from the build dated 3 Nov 2026, 15:04 IST. As this audit finished, further uncommitted changes appeared in the privacy, analytics and tracking code and in `prisma/schema.prisma`. I did not review those, and they may affect C6 and G9. Rebuild and re-check before relying on these figures.

**Security note outside this audit's scope:** `prisma/dev.db` is committed to git and is not covered by `.gitignore`. I didn't inspect it for personal data. Its schema includes leads and other personal data tables, so please review it.

## Appendix A: Legacy URL redirect map

Check this against Search Console and backlink data before use. Items marked **confirm** need a business decision. Avoid redirecting pages to loosely related ones: Google can treat that as a soft 404, so a real 404 or 410 is better if nothing equivalent exists.

**Implementation notes**

- IIS URLs aren't case-sensitive, so links may exist in other casing. `/default.aspx` and `/Default.aspx` are both in the old sitemap.
- `proxy.ts` already normalises paths, so a lowercase lookup table there suits this well. It has not been built or tested.
- Point each redirect straight to the final trailing-slash URL to avoid chains.
- Some old URLs rely on query strings, such as `/Gallery.aspx?gpg=Press_Release`. Match these on the path and the parameter.

```ts
// Sketch for proxy.ts. Test before use. Keys are lowercase pathnames.
const LEGACY: Record<string, string> = {
  '/about.aspx': '/about-us/',
  '/model_details/yamuna_bungalow.aspx': '/projects/yamuna-bungalow/',
  // ...
};
const target = LEGACY[normalized];
if (target) return NextResponse.redirect(new URL(target, request.url), 301);
```

### Company and utility pages

| Old URL | New URL |
|---|---|
| `/`, `/Default.aspx`, `/default.aspx` | `/` |
| `/About.aspx`, `/VastuVihar_SuccessStory.aspx` | `/about-us/` |
| `/VastuVihar_ChairmanMessage.aspx` | `/about-us/` (**confirm**: ideally a leadership section) |
| `/VastuVihar_VisionMission.aspx`, `/VastuVihar_QualityPolicy.aspx` | `/core-values/` |
| `/Vastu-Vihar-Residential-Products.aspx` | `/projects/` |
| `/PriceList.aspx` | `/price-list/` |
| `/Contact_at_Branch.aspx` | `/contact/branch-contact/` |
| `/Contact_at_ProjectSite.aspx` | `/contact/site-contact/` |
| `/Enquiry.aspx`, `/enquiry.aspx` | `/contact/` |
| `/blog.aspx`, `/LatestNews/LatestNews.aspx` | `/blog/` |
| `/LatestNews.aspx?gpg=...` | **Confirm**: migrate Hindi press notes, or redirect to `/gallery/press/` |
| `/SocialEvent.aspx` | `/gallery/event/` |
| `/Gallery.aspx?gpg=Press_Release` | `/gallery/press/` |
| `/TournamentsGallery.aspx?gpg=Champions_Trophy` | `/gallery/tournament/` |
| `/video_gallery.aspx` | `/gallery/` |
| `/Customer_Login/Login.aspx` | **Confirm**: is there still a customer portal? |
| `/Brochure/vastu-vihar-brochure.pdf` | **Confirm**: host a current brochure at the same path |
| `/Amenities-at-vastu-vihar.aspx`, `/Technology-used-in-vastu-vihar.aspx`, `/concrete-building.aspx` | **Confirm**: migrate as content pages (good for AEO) |
| `/vastu-vihar-business-center.aspx`, `/Vastu-Vihar-shopping-complex.aspx`, `/social-distancing-bungalow.aspx` | **Confirm**: no equivalent. Migrate, or return 404/410 |

### Models

| Old URL | New URL |
|---|---|
| `/Model_Details/Yamuna_Bungalow.aspx` | `/projects/yamuna-bungalow/` |
| `/Model_Details/Jayanti_Bungalow.aspx` | `/projects/jayanti-bungalow/` |
| `/Model_Details/Godawari_Bungalow.aspx` | `/projects/godawari-bungalow/` |
| `/Model_Details/Kaveri_Bungalow.aspx` | `/projects/kaveri-bungalow/` |
| `/Model_Details/Simplex_Bungalow.aspx` | `/projects/simplex-bungalow/` |
| `/Model_Details/Gayatri_Row_House.aspx` | `/projects/gayatri-row-house/` |
| `/Rainbow-house.aspx` | `/projects/rainbow-house-bungalow/` |
| `/ambika.aspx` | `/projects/ambika-bungalow/` |
| `/Model_Details/Chota_Flat.aspx`, `/Flat-in-10-Lac.aspx` | **Confirm**: probably `/projects/nano/` |
| `/Model_Details/Apartment.aspx` | **Confirm**: closest apartment model, or `/projects/` |
| `/Model_Details/Mangalam_Bungalow.aspx`, `Katayani_Bungalow.aspx`, `Triveni_Bungalow.aspx`, `Shailputri_Bungalow.aspx`, `Hybrid_Homes.aspx` | **Confirm**: discontinued? Restore, or return 404/410 |
| `/Model_Details/img/Jagannath/*.pdf` | **Confirm**: return 410 if discontinued |

### Guides: migrate to `/blog/<slug>/`

| Old URL | Suggested slug |
|---|---|
| `/9-vastu-checks-before-buying-a-new-house.aspx` | `9-vastu-checks-before-buying-a-new-house` |
| `/What-Should-be-the-Direction-of-Kitchen-As-Per-Vastu.aspx` | `kitchen-direction-as-per-vastu` |
| `/what-is-the-best-house-entrance-as-per-vastu.aspx` | `best-house-entrance-as-per-vastu` |
| `/what-should-be-the-direction-of-toilet-as-per-vastu.aspx` | `toilet-direction-as-per-vastu` |
| `/what-to-keep-in-bedroom-as-per-vastu.aspx` | `what-to-keep-in-bedroom-as-per-vastu` |
| `/What-is-Ishan-Kon-in-Vastu.aspx` | `what-is-ishan-kon-in-vastu` |
| `/under-construction-vs-ready-to-move-property-which-is-better.aspx` | `under-construction-vs-ready-to-move` |
| `/How-to-Decide-How-Much-to-Spend-on-a-House.aspx` | `how-much-to-spend-on-a-house` |
| `/HOW-TO-DECIDE-IF-YOU-SHOULD-BUY-A%20-HOUSE%20-IN%20-INDIA.aspx` | `should-you-buy-a-house-in-india` |
| `/HOW-TO-DECIDE-TO-RENT-OR-BUY-A-HOUSE-IN-INDIA.aspx` | `rent-or-buy-a-house-in-india` |
| `/FIRST-TIME-HOME-BUYERS-IN-INDIA.aspx` | `first-time-home-buyers-in-india` |
| `/A-GUIDE-FOR-FIRST-TIME-HOME-BUYERS.aspx` | `guide-for-first-time-home-buyers` |

### City pages: redirect to `/locations/<city>/` once built

| Old folder | Cities |
|---|---|
| `/Project_Bihar/` (26) | Patna, Gaya, Bhagalpur, Ara, Aurangabad, BiharSharif, Buxar, Dehri_On_Sone, Jehanabad, Munger, Sasaram, Hajipur, Muzaffarpur, Purnia, Begusarai, Chapra, Darbhanga, Bettiah, Madhubani, Motihari, Katihar, Saharsa, Samastipur, Siwan, Sitamarhi, Raxaul |
| `/Project_Jharkhand/` (7) | Ranchi, Jamshedpur, Dhanbad, Bokaro, Hazaribagh, Deoghar, Giridih |
| `/Project_UttraPradesh/` (4) | Varanasi, Gorakhpur, Mirzapur, Lucknow |
| `/Project_WestBengal/` (5) | Durgapur, Siliguri, Kolkata, Asansol, Alipurduar |
| `/Project_Odisha/` (2) | Bhubaneswar, Rourkela |

Raxaul and Lucknow are not in the current branch or site contact data, so check their status before building pages for them.

## Appendix B: Structured data templates

These follow the [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld). Confirm all values before publishing, and remove anything you can't verify. The domain assumes `.org` (Decision 1).

**Rendering pattern:**

```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
/>
```

**Organization and WebSite** (site-wide):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://vastuvihar.org/#organization",
      "name": "Vastu Vihar",
      "legalName": "Technoculture Building Centre Pvt. Ltd.",
      "url": "https://vastuvihar.org/",
      "logo": "https://vastuvihar.org/images/vastu-logo.webp",
      "foundingDate": "1994",
      "email": "info@vastuvihar.org",
      "telephone": "+91-95340-95340",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "417, 419, 4th Floor, Aashiana Tower, Exhibition Road, Old Jakkanpur, Lodipur",
        "addressLocality": "Patna",
        "addressRegion": "Bihar",
        "postalCode": "800001",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://www.facebook.com/vastu-vihar",
        "https://www.instagram.com/vastuvihar_official",
        "https://www.youtube.com/@vastu_vihar",
        "https://in.linkedin.com/company/vastu-vihar-technoculture-building-centre-pvt-ltd"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://vastuvihar.org/#website",
      "url": "https://vastuvihar.org/",
      "name": "Vastu Vihar",
      "publisher": { "@id": "https://vastuvihar.org/#organization" }
    }
  ]
}
```

**BreadcrumbList:**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vastuvihar.org/" },
    { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://vastuvihar.org/projects/" },
    { "@type": "ListItem", "position": 3, "name": "Simplex Bungalow" }
  ]
}
```

**Model page.** Generate prices from the same data shown on the page, after resolving G1:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Simplex Bungalow",
  "category": "2 BHK Bungalow",
  "brand": { "@id": "https://vastuvihar.org/#organization" },
  "image": "https://vastuvihar.org/<first-gallery-image>",
  "description": "<the visible answer-first summary>",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "INR",
    "lowPrice": "<verified low price>",
    "highPrice": "<verified high price>",
    "offerCount": "<number of phases listed>"
  }
}
```

**Branch on a city page:**

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Vastu Vihar Ara Branch",
  "parentOrganization": { "@id": "https://vastuvihar.org/#organization" },
  "url": "https://vastuvihar.org/locations/ara/",
  "email": "ara@vastuvihar.org",
  "telephone": "+91-74880-49821",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1st Floor, Mahuli Tower, K.G. Road",
    "addressLocality": "Ara",
    "addressRegion": "Bihar",
    "postalCode": "802301",
    "addressCountry": "IN"
  }
}
```

Validate with the [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/).

## Appendix C: Robots policy for AI crawlers

The new `app/robots.ts` allows all crawlers except on `/admin/` and `/api/`, so no change is needed for AI visibility. Add explicit rules only if the business wants to opt out of training. Also check that nginx, a firewall or a CDN isn't blocking these bots in production.

| Vendor | Bot | Purpose | If blocked |
|---|---|---|---|
| OpenAI | [`OAI-SearchBot`](https://developers.openai.com/api/docs/bots) | ChatGPT search | Won't appear in ChatGPT search answers |
| OpenAI | `GPTBot` | Model training | Signals that content shouldn't be used for training |
| OpenAI | `ChatGPT-User` | User-initiated visits | robots.txt may not apply |
| Anthropic | [`Claude-SearchBot`](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) | Search quality | May reduce visibility |
| Anthropic | `ClaudeBot` | Model training | Signals exclusion from training |
| Anthropic | `Claude-User` | User-requested fetches | Stops those fetches, and may reduce visibility |
| Perplexity | [`PerplexityBot`](https://docs.perplexity.ai/guides/bots) | Perplexity search results | Reduces visibility in results |
| Perplexity | `Perplexity-User` | User-requested fetches | Generally ignores robots.txt |
| Google | `Googlebot` | Search, including AI Overviews | Removes the site from Search. **Never block** |

To control AI use within Google Search, use the page-level `nosnippet`, `data-nosnippet`, `max-snippet` or `noindex` controls [described by Google](https://developers.google.com/search/docs/appearance/ai-features).

**Example opt-out from training while staying in AI search:**

```ts
rules: [
  { userAgent: ['GPTBot', 'ClaudeBot'], disallow: '/' },
  { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
],
```

## Appendix D: AI visibility test prompts

Run these monthly in ChatGPT, Perplexity, Gemini and Google AI Mode, in a logged-out or fresh session where possible. Results vary between runs, so repeat each prompt and look at trends. For each one, record whether the brand is mentioned, whether the site is cited, whether facts are correct, and which competitors or sources appear.

**Brand**
1. What is Vastu Vihar and who owns it?
2. Who founded Vastu Vihar, and when?
3. Is Vastu Vihar a reliable builder?
4. Are Vastu Vihar projects RERA registered?
5. In which cities does Vastu Vihar operate?

**Commercial**
6. Best affordable bungalow builders in Patna.
7. 2 BHK bungalow under ₹50 lakh in Ara.
8. How much does a Vastu Vihar Simplex bungalow cost?
9. Vastu Vihar Purnea price list.
10. Vastu Vihar branch office address in Ranchi.

**Informational**
11. Under-construction vs ready-to-move: which is better in India?
12. What should a first-time home buyer in Bihar check?
13. What is the best kitchen direction as per Vastu?
14. What is a raft foundation?

**Hindi**
15. पटना में बंगला खरीदने के लिए अच्छे बिल्डर कौन से हैं?
16. वास्तु विहार का बंगला कितने का है?

## Sources

**Official documentation**
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: Site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google: FAQ structured data and rich result status](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [OpenAI: Crawlers](https://developers.openai.com/api/docs/bots)
- [Anthropic: Web crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity: Bots](https://docs.perplexity.ai/guides/bots)
- Next.js docs bundled with the installed version: `node_modules/next/dist/docs/01-app/02-guides/json-ld.md` and `.../04-functions/generate-metadata.md`

**Regulation** (not legal advice)
- [RERA advertisement provisions, Andhra Pradesh RERA](https://rera.ap.gov.in/RERA/Views/AdvertisementGuidelines.aspx)
- [Bihar RERA awareness notice](https://rera.bihar.gov.in/RERAAwarenessAlert.aspx)
- [Report on Bihar RERA advertisement penalties](https://propnewstime.com/latestnewsstories/MTU2MzI=/rera-bihar-penalises-seven-promoters-for-non-compliance-with-advertisement-regulations)

**Research**
- [Aggarwal et al., "GEO: Generative Engine Optimization", KDD 2024](https://arxiv.org/abs/2311.09735)

**Company mentions seen in search**
- [Bihar RERA cause list, 6 June 2025](https://rera.bihar.gov.in/Cause_List/06-06-2025%20-%20COMPLAIN%20CASE%20-%20-%20-%20UPLODING.pdf)
- [Bihar RERA proceeding, 5 Dec 2025](https://rera.bihar.gov.in/Photo_Gallery/05-12-2025%20ved%20prakash%20sir%20proceeding-13.pdf)
- [CommonFloor builder listing](https://www.commonfloor.com/vastu-vihar/builder/aq2crn)
- [Houssed builder listing](https://houssed.com/ranchi/sale/builder/vastu-vihar-814030)
