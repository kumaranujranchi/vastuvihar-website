import '../../styles/pages/blog.css';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Blog Grid',
  description: 'Vastu Vihar Latest News and Updates',
};

// Date formatter to match your UI ("Mar 18, 2025")
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Formats category for URLs (e.g. "Tips & Tricks" -> "tips-tricks")
const formatCategorySlug = (cat: string) => cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default async function BlogGridPage() {
  // Fetch blogs server-side
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <PageLayout route="blog-grid">
      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="3356" className="elementor elementor-3356">
                
                {/* Header & Breadcrumb (Unchanged) */}
                <div className="elementor-element elementor-element-8cf7674 e-con-full e-flex e-con e-parent" data-element_type="container">
                  <div className="elementor-element elementor-element-307655e e-flex e-con-boxed e-con e-child" data-element_type="container">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-8df3906 elementor-widget elementor-widget-page-title">
                        <div className="elementor-widget-container">
                          <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                            <h2 className="elementor-heading-title elementor-size-default">Blog Grid</h2>
                          </div>
                        </div>
                      </div>
                      <div className="elementor-element elementor-element-ed4ffca e-con-full e-flex e-con e-child" data-element_type="container">
                        <div className="elementor-element elementor-element-9bcfd1f elementor-widget elementor-widget-hfe-breadcrumbs-widget">
                          <div className="elementor-widget-container">
                            <nav aria-label="Breadcrumb">
                              <ul className="hfe-breadcrumbs hfe-breadcrumbs-show-home">
                                <li className="hfe-breadcrumbs-item hfe-breadcrumbs-first">
                                  <Link href="/" prefetch={false}><span className="hfe-breadcrumbs-text">Home</span></Link>
                                </li>
                                <li className="hfe-breadcrumbs-separator">
                                  <span className="hfe-breadcrumbs-separator-icon">/</span>
                                </li>
                                <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                                  <span className="hfe-breadcrumbs-text" aria-current="page">Blog Grid</span>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters (Unchanged) */}
                <div className="elementor-element elementor-element-079f4c5 e-flex e-con-boxed e-con e-parent" data-element_type="container">
                  <div className="e-con-inner">
                    <div className="elementor-element elementor-element-4cecf79 elementor-widget elementor-widget-heading">
                      <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default">Latest</h2>
                      </div>
                    </div>
                    <div className="elementor-element elementor-element-e38ca75 elementor-widget elementor-widget-spaciaz-post-filter">
                      <div className="elementor-widget-container">
                        <div className="navigation-post-filter">
                          <Link href="/blog/" prefetch={false}>All Posts</Link>
                          <Link href="/category/company/" prefetch={false}>Company</Link>
                          <Link href="/category/social-media/" prefetch={false}>Social Media</Link>
                          <Link href="/category/tips-tricks/" prefetch={false}>Tips &amp; Tricks</Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* DYNAMIC POST GRID */}
                    <div className="elementor-element elementor-element-2557fae elementor-widget elementor-widget-spaciaz-post-grid">
                      <div className="elementor-widget-container">
                        <div className="elementor-post-wrapper elementor-post-style-1">
                          <div className="d-grid">
                            
                            {posts.map((post) => (
                              <div className="grid-item" key={post.id}>
                                <div className="post-inner blog-grid">
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
                                  <div className="post-content">
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
                            ))}

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