
import './NewsSection.css';
import '../common/ScrollingTicker.css';
import Link from 'next/link';
import { orEmpty, prisma } from '@/lib/prisma';
import StaticPill from '../common/StaticPill';

// Format dates: "Mar 18, 2025"
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format category for CSS and URLs
const formatCategorySlug = (cat: string) =>
  cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default async function NewsSection() {
  // Fetch latest 4 published posts
  const posts = await prisma.blogPost
    .findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    })
    .catch(orEmpty('Home news'));

  if (posts.length === 0) return null;

  const featuredPost = posts[0];
  const listPosts = posts.slice(1, 4);

  return (
    <div
      className="elementor-element elementor-element-eab14e7 e-flex e-con-boxed e-con e-parent"
      data-id="eab14e7"
      data-element_type="container"
    >
      <div className="e-con-inner">

        {/* ==========================================
            SECTION HEADER
        ========================================== */}

        <div
          className="elementor-element elementor-element-ec1010d e-con-full e-flex e-con e-child"
          data-id="ec1010d"
          data-element_type="container"
          data-settings={'{"background_background":"classic"}'}
        >
          <StaticPill text="Recent Blogs" />

          <div
            className="elementor-element elementor-element-8034cbb elementor-widget__width-initial animated-fast elementor-invisible elementor-widget elementor-widget-heading"
            data-id="8034cbb"
            data-element_type="widget"
            data-settings={'{"_animation":"opal-move-left"}'}
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                Discover inspiration and trends
              </h2>
            </div>
          </div>
        </div>

        {/* ==========================================
            VIEW ALL POSTS BUTTON
        ========================================== */}

        <div
          className="elementor-element elementor-element-9e2ca95 e-con-full e-flex e-con e-child"
          data-id="9e2ca95"
          data-element_type="container"
        >
          <div
            className="elementor-element elementor-element-5cd4848 enable-style-icon-yes animated-fast elementor-button-outline icon-spaciaz-right elementor-invisible elementor-widget elementor-widget-spaciaz-button"
            data-id="5cd4848"
            data-element_type="widget"
            data-settings={'{"_animation":"opal-move-right"}'}
            data-widget_type="spaciaz-button.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-button-wrapper">
                <Link
                  href="/blog/"
                  className="elementor-button-link elementor-button elementor-size-sm"
                  prefetch={false}
                >
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-icon">
                      <span className="btn-icon-wrap">
                        <span className="btn-icon">
                          <i
                            aria-hidden="true"
                            className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                          />
                        </span>

                        <span className="btn-icon-hover">
                          <i
                            aria-hidden="true"
                            className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                          />
                        </span>
                      </span>
                    </span>

                    <span
                      className="elementor-button-text"
                      data-name="view all posts"
                    >
                      <span>view all posts</span>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            BLOG CARDS
        ========================================== */}

        <div
          className="elementor-element elementor-element-f8366e7 elementor-widget__width-inherit animated-fast elementor-invisible elementor-widget elementor-widget-spaciaz-post-grid"
          data-id="f8366e7"
          data-element_type="widget"
          data-settings={'{"_animation":"opal-move-up"}'}
          data-widget_type="spaciaz-post-grid.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-post-wrapper elementor-post-special">
              <div className="d-grid">

                {/* ====================================
                    FEATURED BLOG - LEFT
                    ENTIRE CARD CLICKABLE
                ==================================== */}

                {featuredPost && (
                  <div className="blog-style-grid">

                    <Link
                      href={`/blog/${featuredPost.slug}/`}
                      prefetch={false}
                      className="post-inner blog-grid vv-news-card-link"
                      aria-label={`Read ${featuredPost.title}`}
                    >
                      {/* Featured Image */}

                      {featuredPost.imagePath && (
                        <div className="post-thumbnail">
                          <img
                            loading="lazy"
                            decoding="async"
                            width={1000}
                            height={800}
                            src={featuredPost.imagePath}
                            className="attachment-large size-large wp-post-image"
                            alt={featuredPost.title}
                          />
                        </div>
                      )}

                      {/* Featured Content */}

                      <div className="post-content">
                        <div className="entry-meta">
                          <div className="entry-meta-inner">

                            {/* Category */}

                            <div className="categories-link">
                              <span className="screen-reader-text">
                                Categories
                              </span>

                              <span className="vv-news-category">
                                {featuredPost.category}
                              </span>
                            </div>

                            {/* Date */}

                            <div className="posted-on">
                              <time
                                className="entry-date published"
                                dateTime={featuredPost.createdAt.toISOString()}
                              >
                                {formatDate(featuredPost.createdAt)}
                              </time>

                              <time
                                className="updated"
                                dateTime={featuredPost.updatedAt.toISOString()}
                              >
                                {formatDate(featuredPost.updatedAt)}
                              </time>
                            </div>

                          </div>
                        </div>

                        {/* Featured Title */}

                        <h3 className="omega entry-title">
                          <span className="vv-news-title">
                            {featuredPost.title}
                          </span>
                        </h3>
                      </div>

                    </Link>
                  </div>
                )}

                {/* ====================================
                    RIGHT SIDE BLOG LIST
                    ENTIRE ARTICLES CLICKABLE
                ==================================== */}

                <div className="blog-column">

                  {listPosts.map((post) => {
                    const postUrl = `/blog/${post.slug}/`;

                    return (
                      <article
                        key={post.id}
                        className={`article-default post type-post status-publish format-standard has-post-thumbnail hentry category-${formatCategorySlug(
                          post.category
                        )}`}
                      >

                        {/* Whole article card link */}

                        <Link
                          href={postUrl}
                          prefetch={false}
                          className="post-inner blog-list1 vv-news-card-link"
                          aria-label={`Read ${post.title}`}
                        >
                          <div className="post-content">

                            {/* Left: Blog Image */}

                            <div className="post-left">
                              {post.imagePath && (
                                <div className="post-thumbnail">
                                  <img
                                    loading="lazy"
                                    decoding="async"
                                    width={1000}
                                    height={800}
                                    src={post.imagePath}
                                    className="attachment-large size-large wp-post-image"
                                    alt={post.title}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Right: Blog Information */}

                            <div className="post-right">
                              <div className="entry-meta">
                                <div className="entry-meta-inner">

                                  {/* Category */}

                                  <div className="categories-link">
                                    <span className="screen-reader-text">
                                      Categories
                                    </span>

                                    <span className="vv-news-category">
                                      {post.category}
                                    </span>
                                  </div>

                                  {/* Date */}

                                  <div className="posted-on">
                                    <time
                                      className="entry-date published"
                                      dateTime={post.createdAt.toISOString()}
                                    >
                                      {formatDate(post.createdAt)}
                                    </time>

                                    <time
                                      className="updated"
                                      dateTime={post.updatedAt.toISOString()}
                                    >
                                      {formatDate(post.updatedAt)}
                                    </time>
                                  </div>

                                </div>
                              </div>

                              {/* Blog Title */}

                              <h3 className="omega entry-title">
                                <span className="vv-news-title">
                                  {post.title}
                                </span>
                              </h3>

                            </div>
                          </div>
                        </Link>

                      </article>
                    );
                  })}

                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
