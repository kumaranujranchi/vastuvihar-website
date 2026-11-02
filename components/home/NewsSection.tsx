import './NewsSection.css';
import '../common/ScrollingTicker.css';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import StaticPill from '../common/StaticPill';

// Helper to format dates to match your UI ("Mar 18, 2025")
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper to format category for URLs ("Tips & Tricks" -> "tips-tricks")
const formatCategorySlug = (cat: string) => cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default async function NewsSection() {
  // Fetch the 4 latest published blog posts
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  // Separate the first post (featured left) and the remaining posts (list right)
  const featuredPost = posts[0];
  const listPosts = posts.slice(1, 4);

  return (
    <div
      className="elementor-element elementor-element-eab14e7 e-flex e-con-boxed e-con e-parent"
      data-id="eab14e7"
      data-element_type="container"
    >
      <div className="e-con-inner">
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
                  role="button"
                  prefetch={false}
                >
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-icon">
                      <span className="btn-icon-wrap">
                        <span className="btn-icon">
                          <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-arrow-long-right"></i>
                        </span>
                        <span className="btn-icon-hover">
                          <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-arrow-long-right"></i>
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
                
                {/* DYNAMIC FEATURED POST (LEFT SIDE) */}
                {featuredPost && (
                  <div className="blog-style-grid">
                    <div className="post-inner blog-grid">
                      {featuredPost.imagePath && (
                        <div className="post-thumbnail">
                          <img
                            loading="lazy"
                            decoding="async"
                            width="900"
                            height="599"
                            src={featuredPost.imagePath}
                            className="attachment-large size-large wp-post-image"
                            alt={featuredPost.title}
                          />
                        </div>
                      )}
                      <div className="post-content">
                        <div className="entry-meta">
                          <div className="entry-meta-inner">
                            <div className="categories-link">
                              <span className="screen-reader-text">Categories</span>
                              <Link href={`/category/${formatCategorySlug(featuredPost.category)}/`} rel="category tag" prefetch={false}>
                                {featuredPost.category}
                              </Link>
                            </div>
                            <div className="posted-on">
                              <Link href={`/blog/${featuredPost.slug}/`} rel="bookmark" prefetch={false}>
                                <time className="entry-date published" dateTime={featuredPost.createdAt.toISOString()}>
                                  {formatDate(featuredPost.createdAt)}
                                </time>
                                <time className="updated" dateTime={featuredPost.updatedAt.toISOString()}>
                                  {formatDate(featuredPost.updatedAt)}
                                </time>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <h3 className="omega entry-title">
                          <Link href={`/blog/${featuredPost.slug}/`} rel="bookmark" prefetch={false}>
                            {featuredPost.title}
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* DYNAMIC LIST POSTS (RIGHT SIDE) */}
                <div className="blog-column">
                  {listPosts.map((post) => (
                    <article
                      key={post.id}
                      className={`article-default post type-post status-publish format-standard has-post-thumbnail hentry category-${formatCategorySlug(post.category)}`}
                    >
                      <div className="post-inner blog-list1">
                        <div className="post-content">
                          <div className="post-left">
                            {post.imagePath && (
                              <div className="post-thumbnail">
                                <img
                                  loading="lazy"
                                  decoding="async"
                                  width="900"
                                  height="599"
                                  src={post.imagePath}
                                  className="attachment-large size-large wp-post-image"
                                  alt={post.title}
                                />
                              </div>
                            )}
                          </div>
                          <div className="post-right">
                            <div className="entry-meta">
                              <div className="entry-meta-inner">
                                <div className="categories-link">
                                  <span className="screen-reader-text">Categories</span>
                                  <Link href={`/category/${formatCategorySlug(post.category)}/`} rel="category tag" prefetch={false}>
                                    {post.category}
                                  </Link>
                                </div>
                                <div className="posted-on">
                                  <Link href={`/blog/${post.slug}/`} rel="bookmark" prefetch={false}>
                                    <time className="entry-date published" dateTime={post.createdAt.toISOString()}>
                                      {formatDate(post.createdAt)}
                                    </time>
                                    <time className="updated" dateTime={post.updatedAt.toISOString()}>
                                      {formatDate(post.updatedAt)}
                                    </time>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <h3 className="omega entry-title">
                              <Link href={`/blog/${post.slug}/`} rel="bookmark" prefetch={false}>
                                {post.title}
                              </Link>
                            </h3>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}