import './NewsSection.css';
import '../common/ScrollingTicker.css';
import Link from 'next/link';
import { orEmpty, prisma } from '@/lib/prisma';
import StaticPill from '../common/StaticPill';

// Format dates: "Nov 7, 2026"
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default async function NewsSection() {
  // Fetch latest 3 published posts so exactly 3 cards fit in one line
  const posts = await prisma.blogPost
    .findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })
    .catch(orEmpty('Home news'));

  if (posts.length === 0) return null;

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
                    <span className="elementor-button-text" data-name="view all posts">
                      <span>view all posts</span>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            COMPACT 3-CARD BLOG GRID
        ========================================== */}
        <div
          className="elementor-element elementor-element-f8366e7 elementor-widget__width-inherit animated-fast elementor-invisible elementor-widget elementor-widget-spaciaz-post-grid"
          data-id="f8366e7"
          data-element_type="widget"
          data-settings={'{"_animation":"opal-move-up"}'}
          data-widget_type="spaciaz-post-grid.default"
        >
          <div className="elementor-widget-container">
            <div className="vv-home-blog-grid">
              {posts.map((post) => {
                const postUrl = `/blog/${post.slug}/`;

                return (
                  <article key={post.id} className="vv-home-blog-card">
                    <Link
                      href={postUrl}
                      prefetch={false}
                      className="vv-home-blog-link"
                      aria-label={`Read ${post.title}`}
                    >
                      {/* 5:4 Thumbnail */}
                      {post.imagePath ? (
                        <div className="vv-home-blog-thumb">
                          <img
                            loading="lazy"
                            decoding="async"
                            width={800}
                            height={640}
                            src={post.imagePath}
                            alt={post.title}
                            className="vv-home-blog-img"
                          />
                        </div>
                      ) : null}

                      {/* Content */}
                      <div className="vv-home-blog-body">
                        <div className="vv-home-blog-meta">
                          <span className="vv-home-blog-category">
                            {post.category}
                          </span>
                          <span className="vv-home-blog-divider" aria-hidden="true" />
                          <time
                            className="vv-home-blog-date"
                            dateTime={post.createdAt.toISOString()}
                          >
                            {formatDate(post.createdAt)}
                          </time>
                        </div>

                        <h3 className="vv-home-blog-title">
                          <span>{post.title}</span>
                        </h3>
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
  );
}
