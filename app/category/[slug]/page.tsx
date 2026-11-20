import '../../blog/blog.css';

import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import BlogHero from '@/components/blog/BlogHero';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { orEmpty, prisma } from '@/lib/prisma';
import { BLOG_CATEGORIES as CATEGORY_MAP } from '@/lib/blogCategories';
import { createPageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// Rendered on each request, because it reads the database. The Cloudflare build has no
// writable page cache (open-next.config.ts), so a cached copy would never refresh.
export const dynamic = 'force-dynamic';



export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryName = CATEGORY_MAP[slug] || slug.replace(/-/g, ' ');

  return createPageMetadata({
    title: `${categoryName} Archives | Vastu Vihar`,
    description: `Browse all latest updates, news, and articles in the ${categoryName} category.`,
    path: `/category/${slug}/`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryName = CATEGORY_MAP[slug];

  if (!categoryName) {
    notFound();
  }

  const posts = await prisma.blogPost
    .findMany({
      where: {
        isPublished: true,
        category: categoryName,
      },
      orderBy: { createdAt: 'desc' },
    })
    .catch(orEmpty('Blog category'));

  return (
    <PageLayout route={`category-${slug}`}>
      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div className="vv-blog-page vv-category-page">
                <BlogHero
                  title={categoryName}
                  breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Blog', href: '/blog/' },
                    { label: categoryName },
                  ]}
                />

                <section
                  className="vv-blog-page__listing"
                  aria-label={`${categoryName} blog posts`}
                >
                  <div className="vv-blog-page__listing-inner">
                    {posts.length === 0 ? (
                      <div className="vv-blog-page__empty" role="status">
                        <h2>No posts found in this category.</h2>
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

      <BreadcrumbJsonLd
        items={[
          { name: 'Blog', path: '/blog/' },
          { name: categoryName },
        ]}
      />
    </PageLayout>
  );
}
