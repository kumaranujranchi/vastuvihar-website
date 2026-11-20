import './blog.css';

import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import BlogHero from '@/components/blog/BlogHero';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { orEmpty, prisma } from '@/lib/prisma';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Latest Blogs | Vastu Vihar',
  description: 'Vastu Vihar Latest News and Updates',
  path: '/blog/',
});

// Rendered on each request, because it reads the database. The Cloudflare build has no
// writable page cache (open-next.config.ts), so a cached copy would never refresh.
export const dynamic = 'force-dynamic';

export default async function BlogGridPage() {
  const posts = await prisma.blogPost
    .findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    })
    .catch(orEmpty('Blog'));

  return (
    <PageLayout route="blog-grid">
      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div className="vv-blog-page">
                <BlogHero
                  title="Latest Blogs"
                  breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Blogs' },
                  ]}
                />

                <section className="vv-blog-page__listing" aria-label="Latest blog posts">
                  <div className="vv-blog-page__listing-inner">
                    {posts.length === 0 ? (
                      <div className="vv-blog-page__empty" role="status">
                        <h2>No posts published yet.</h2>
                      </div>
                    ) : (
                      <div className="vv-blog-page__grid">
                        {posts.map((post) => (
                          <BlogPostCard key={post.id} post={post} />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>

      <BreadcrumbJsonLd items={[{ name: 'Blog' }]} />
    </PageLayout>
  );
}
