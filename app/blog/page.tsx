
import '@/styles/pages/blog.css';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import Link from 'next/link';
import { connection } from 'next/server';
import { orEmpty, prisma } from '@/lib/prisma';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Latest Blogs | Vastu Vihar',
  description: 'Vastu Vihar Latest News and Updates',
  path: '/blog/',
});

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatCategorySlug = (cat: string) =>
  cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default async function BlogGridPage() {
  // Read posts per request, so the build does not need the database.
  await connection();

  const posts = await prisma.blogPost
    .findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    })
    .catch(orEmpty('Blog'));

  return (
    <PageLayout route="blog-grid">
      <div
        id="content"
        className="site-content-page clear"
        tabIndex={-1}
      >
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div
                data-elementor-type="wp-page"
                data-elementor-id="3356"
                className="elementor elementor-3356"
              >
                {/* =====================================
                    1. PAGE HEADER
                ===================================== */}

                <div
                  className="elementor-element elementor-element-8cf7674 e-con-full e-flex e-con e-parent"
                  data-id="8cf7674"
                  data-element_type="container"
                  data-settings={
                    '{"background_background":"classic"}'
                  }
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
                            <h1 className="elementor-heading-title elementor-size-default">
                              Latest Blogs
                            </h1>
                          </div>
                        </div>
                      </div>

                      {/* Breadcrumbs */}

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
                                  <span className="hfe-breadcrumbs-home-icon" />

                                  <Link
                                    href="/"
                                    prefetch={false}
                                  >
                                    <span className="hfe-breadcrumbs-text">
                                      Home
                                    </span>
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
                                      <path d="M512 512H0V0h512v512z" />
                                    </svg>
                                  </span>
                                </li>

                                <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                                  <span
                                    className="hfe-breadcrumbs-text"
                                    aria-current="page"
                                  >
                                    Blogs
                                  </span>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Spacer */}

                  <div
                    className="elementor-element elementor-element-57f13d8 elementor-widget elementor-widget-spacer"
                    data-id="57f13d8"
                    data-element_type="widget"
                    data-widget_type="spacer.default"
                  >
                    <div className="elementor-widget-container">
                      <div className="elementor-spacer">
                        <div className="elementor-spacer-inner" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* =====================================
                    2. BLOG GRID
                ===================================== */}

                <div
                  className="elementor-element elementor-element-079f4c5 e-flex e-con-boxed e-con e-parent"
                  data-id="079f4c5"
                  data-element_type="container"
                >
                  <div className="e-con-inner">
                    <div
                      className="elementor-element elementor-element-2557fae elementor-widget elementor-widget-spaciaz-post-grid"
                      data-id="2557fae"
                      data-element_type="widget"
                      data-widget_type="spaciaz-post-grid.default"
                    >
                      <div className="elementor-widget-container">
                        <div className="elementor-post-wrapper elementor-post-style-1">

                          {posts.length === 0 ? (
                            <div
                              style={{
                                padding: '60px 0',
                                textAlign: 'center',
                                color: '#64748b',
                              }}
                            >
                              <h3>No posts published yet.</h3>
                            </div>
                          ) : (
                            <div className="d-grid">
                              {posts.map((post) => {
                                const postUrl = `/blog/${post.slug}/`;

                                return (
                                  <div
                                    className="grid-item"
                                    key={post.id}
                                  >
                                    {/* WHOLE CARD CLICKABLE */}

                                    <Link
                                      href={postUrl}
                                      prefetch={false}
                                      className="post-inner blog-grid vv-blog-card-link"
                                      aria-label={`Read ${post.title}`}
                                    >
                                      {/* Blog Thumbnail */}

                                      {post.imagePath && (
                                        <div className="post-thumbnail">
                                          <img
                                            loading="lazy"
                                            decoding="async"
                                            width={900}
                                            height={599}
                                            src={post.imagePath}
                                            className="attachment-large size-large wp-post-image"
                                            alt={post.title}
                                          />
                                        </div>
                                      )}

                                      {/* Blog Content */}

                                      <div className="post-content">
                                        <div className="entry-meta">
                                          <div className="entry-meta-inner">

                                            {/* Category */}

                                            <div className="categories-link">
                                              <span className="screen-reader-text">
                                                Categories
                                              </span>

                                              <span className="vv-blog-category">
                                                {post.category}
                                              </span>
                                            </div>

                                            {/* Date */}

                                            <div className="posted-on">
                                              <time
                                                className="entry-date published"
                                                dateTime={post.createdAt.toISOString()}
                                              >
                                                {formatDate(
                                                  post.createdAt
                                                )}
                                              </time>
                                            </div>

                                          </div>
                                        </div>

                                        {/* Blog Title */}

                                        <h3 className="omega entry-title">
                                          <span className="vv-blog-title">
                                            {post.title}
                                          </span>
                                        </h3>

                                      </div>
                                    </Link>
                                  </div>
                                );
                              })}
                            </div>
                          )}

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

      <BreadcrumbJsonLd
        items={[{ name: 'Blog' }]}
      />
    </PageLayout>
  );
}
