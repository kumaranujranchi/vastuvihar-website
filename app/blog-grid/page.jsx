import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
export const metadata = {
  title: 'Blog Grid',
  description:
    'Blog Grid HomeBlog Grid Latest All Posts Company Social Media Tips & Tricks Uncategorized CategoriesTips & Tricks Mar 18, 2025Apr 17, 2025 How to Get Started in Buying Your First Home CategoriesCompany Mar 18, 2025Apr 16, 2025 Exploring Min',
};
export default function BlogGridPage() {
  return (
    <PageLayout route="blog-grid">
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div
                data-elementor-type="wp-page"
                data-elementor-id="3356"
                className="elementor elementor-3356"
              >
                <div
                  className="elementor-element elementor-element-8cf7674 e-con-full e-flex e-con e-parent"
                  data-id="8cf7674"
                  data-element_type="container"
                  data-settings={'{"background_background":"classic"}'}
                >
                  <div
                    className="elementor-element elementor-element-307655e e-flex e-con-boxed e-con e-child"
                    data-id="307655e"
                    data-element_type="container"
                  >
                    <div className="e-con-inner">
                      <div
                        className="elementor-element elementor-element-8df3906 elementor-widget elementor-widget-page-title"
                        data-id="8df3906"
                        data-element_type="widget"
                        data-widget_type="page-title.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                            <h2 className="elementor-heading-title elementor-size-default">Blog Grid</h2>
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-ed4ffca e-con-full e-flex e-con e-child"
                        data-id="ed4ffca"
                        data-element_type="container"
                      >
                        <div
                          className="elementor-element elementor-element-9bcfd1f elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                          data-id="9bcfd1f"
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
                                    Blog Grid
                                  </span>
                                </li>
                              </ul>
                            </nav>{' '}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-57f13d8 elementor-widget elementor-widget-spacer"
                    data-id="57f13d8"
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
                <div
                  className="elementor-element elementor-element-57fbeb1 e-flex e-con-boxed e-con e-parent"
                  data-id="57fbeb1"
                  data-element_type="container"
                >
                  <div className="e-con-inner">
                    <div
                      className="elementor-element elementor-element-ae5edf7 elementor-widget elementor-widget-spaciaz-post-grid"
                      data-id="ae5edf7"
                      data-element_type="widget"
                      data-widget_type="spaciaz-post-grid.default"
                    >
                      <div className="elementor-widget-container">
                        <div className="elementor-post-wrapper elementor-post-list">
                          <div className="d-grid"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-element elementor-element-079f4c5 e-flex e-con-boxed e-con e-parent"
                  data-id="079f4c5"
                  data-element_type="container"
                >
                  <div className="e-con-inner">
                    <div
                      className="elementor-element elementor-element-4cecf79 elementor-widget elementor-widget-heading"
                      data-id="4cecf79"
                      data-element_type="widget"
                      data-widget_type="heading.default"
                    >
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default">Latest</h2>{' '}
                      </div>
                    </div>
                    <div
                      className="elementor-element elementor-element-e38ca75 elementor-widget elementor-widget-spaciaz-post-filter"
                      data-id="e38ca75"
                      data-element_type="widget"
                      data-widget_type="spaciaz-post-filter.default"
                    >
                      <div className="elementor-widget-container">
                        <div className="navigation-post-filter">
                          <Link className="" href="/blog/" prefetch={false}>
                            All Posts
                          </Link>
                          <Link className="" href="/category/company/" prefetch={false}>
                            Company
                          </Link>
                          <Link className="" href="/category/social-media/" prefetch={false}>
                            Social Media
                          </Link>
                          <Link className="" href="/category/tips-tricks/" prefetch={false}>
                            Tips &amp; Tricks
                          </Link>
                          <Link className="" href="/category/uncategorized/" prefetch={false}>
                            Uncategorized
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div
                      className="elementor-element elementor-element-2557fae elementor-widget elementor-widget-spaciaz-post-grid"
                      data-id="2557fae"
                      data-element_type="widget"
                      data-widget_type="spaciaz-post-grid.default"
                    >
                      <div className="elementor-widget-container">
                        <div className="elementor-post-wrapper elementor-post-style-1">
                          <div className="d-grid">
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    fetchPriority="high"
                                    decoding="async"
                                    width="900"
                                    height="599"
                                    src="/images/blog_14-1024x682.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link
                                          href="/category/tips-tricks/"
                                          rel="category tag"
                                          prefetch={false}
                                        >
                                          Tips &amp; Tricks
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link
                                          href="/how-to-get-started-in-buying-your-first-home/"
                                          rel="bookmark"
                                          prefetch={false}
                                        >
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:47+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-17T01:52:36+00:00">
                                            Apr 17, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link
                                      href="/how-to-get-started-in-buying-your-first-home/"
                                      rel="bookmark"
                                      prefetch={false}
                                    >
                                      How to Get Started in Buying Your First Home
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    decoding="async"
                                    width="900"
                                    height="599"
                                    src="/images/blog_13-1024x682.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link href="/category/company/" rel="category tag" prefetch={false}>
                                          Company
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link
                                          href="/exploring-minimalism-with-a-touch-of-luxury/"
                                          rel="bookmark"
                                          prefetch={false}
                                        >
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:47+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-16T01:33:11+00:00">
                                            Apr 16, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link
                                      href="/exploring-minimalism-with-a-touch-of-luxury/"
                                      rel="bookmark"
                                      prefetch={false}
                                    >
                                      Exploring Minimalism with a Touch of Luxury
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    decoding="async"
                                    width="900"
                                    height="599"
                                    src="/images/blog_12-1024x682.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link
                                          href="/category/social-media/"
                                          rel="category tag"
                                          prefetch={false}
                                        >
                                          Social Media
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link
                                          href="/are-sustainable-materials-the-future-of-homes/"
                                          rel="bookmark"
                                          prefetch={false}
                                        >
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:46+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-16T01:33:11+00:00">
                                            Apr 16, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link
                                      href="/are-sustainable-materials-the-future-of-homes/"
                                      rel="bookmark"
                                      prefetch={false}
                                    >
                                      Are Sustainable Materials the Future of Homes?
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    loading="lazy"
                                    decoding="async"
                                    width="900"
                                    height="641"
                                    src="/images/blog_11-1024x729.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link
                                          href="/category/tips-tricks/"
                                          rel="category tag"
                                          prefetch={false}
                                        >
                                          Tips &amp; Tricks
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link
                                          href="/biophilic-design-bringing-nature-indoors/"
                                          rel="bookmark"
                                          prefetch={false}
                                        >
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:46+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-16T01:33:11+00:00">
                                            Apr 16, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link
                                      href="/biophilic-design-bringing-nature-indoors/"
                                      rel="bookmark"
                                      prefetch={false}
                                    >
                                      Biophilic Design Bringing Nature Indoors
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    loading="lazy"
                                    decoding="async"
                                    width="900"
                                    height="537"
                                    src="/images/blog_10-1024x611.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link
                                          href="/category/social-media/"
                                          rel="category tag"
                                          prefetch={false}
                                        >
                                          Social Media
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link href="/revamping-old-spaces/" rel="bookmark" prefetch={false}>
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:45+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-17T01:52:42+00:00">
                                            Apr 17, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link href="/revamping-old-spaces/" rel="bookmark" prefetch={false}>
                                      Revamping Old Spaces
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    loading="lazy"
                                    decoding="async"
                                    width="900"
                                    height="599"
                                    src="/images/blog_9-1024x682.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link href="/category/company/" rel="category tag" prefetch={false}>
                                          Company
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link
                                          href="/tiny-homes-big-benefits/"
                                          rel="bookmark"
                                          prefetch={false}
                                        >
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:45+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-16T01:33:11+00:00">
                                            Apr 16, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link href="/tiny-homes-big-benefits/" rel="bookmark" prefetch={false}>
                                      Tiny Homes: Big Benefits
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    loading="lazy"
                                    decoding="async"
                                    width="900"
                                    height="571"
                                    src="/images/blog_8-1024x650.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link
                                          href="/category/social-media/"
                                          rel="category tag"
                                          prefetch={false}
                                        >
                                          Social Media
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link
                                          href="/biophilic-architecture-nature-in-design/"
                                          rel="bookmark"
                                          prefetch={false}
                                        >
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:45+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-16T01:33:11+00:00">
                                            Apr 16, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link
                                      href="/biophilic-architecture-nature-in-design/"
                                      rel="bookmark"
                                      prefetch={false}
                                    >
                                      Biophilic Architecture: Nature in Design
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    loading="lazy"
                                    decoding="async"
                                    width="900"
                                    height="505"
                                    src="/images/blog_7-1024x575.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link
                                          href="/category/tips-tricks/"
                                          rel="category tag"
                                          prefetch={false}
                                        >
                                          Tips &amp; Tricks
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link
                                          href="/smart-homes-the-future-of-living/"
                                          rel="bookmark"
                                          prefetch={false}
                                        >
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:44+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-16T01:33:11+00:00">
                                            Apr 16, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link
                                      href="/smart-homes-the-future-of-living/"
                                      rel="bookmark"
                                      prefetch={false}
                                    >
                                      Smart Homes: The Future of Living
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                            <div className="grid-item">
                              <div className="post-inner blog-grid">
                                <div className="post-thumbnail">
                                  <img
                                    loading="lazy"
                                    decoding="async"
                                    width="900"
                                    height="599"
                                    src="/images/blog_6-1024x682.jpg"
                                    className="attachment-large size-large wp-post-image"
                                    alt=""
                                  />
                                </div>{' '}
                                <div className="post-content">
                                  <div className="entry-meta">
                                    <div className="entry-meta-inner">
                                      <div className="categories-link">
                                        <span className="screen-reader-text">Categories</span>
                                        <Link href="/category/company/" rel="category tag" prefetch={false}>
                                          Company
                                        </Link>
                                      </div>{' '}
                                      <div className="posted-on">
                                        <Link
                                          href="/sustainable-cities-a-greener-future/"
                                          rel="bookmark"
                                          prefetch={false}
                                        >
                                          <time
                                            className="entry-date published"
                                            dateTime="2025-03-18T08:29:44+00:00"
                                          >
                                            Mar 18, 2025
                                          </time>
                                          <time className="updated" dateTime="2025-04-17T01:52:51+00:00">
                                            Apr 17, 2025
                                          </time>
                                        </Link>
                                      </div>{' '}
                                    </div>
                                  </div>
                                  <h3 className="omega entry-title">
                                    <Link
                                      href="/sustainable-cities-a-greener-future/"
                                      rel="bookmark"
                                      prefetch={false}
                                    >
                                      Sustainable Cities: A Greener Future
                                    </Link>
                                  </h3>{' '}
                                </div>
                              </div>{' '}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
