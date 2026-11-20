import { cache } from 'react';
import { notFound } from 'next/navigation';
import { orEmpty, orNull, prisma } from '@/lib/prisma';
import { sanitizeBlogHtml } from '@/lib/sanitizeHtml';
import { createPageMetadata } from '@/lib/metadata';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import CommentForm from '../CommentForm';
import '../BlogComments.css';

// Rendered on each request, because it reads the database. The Cloudflare build has no
// writable page cache (open-next.config.ts), so a cached copy would never refresh.
export const dynamic = 'force-dynamic';

type BlogParams = { params: Promise<{ slug: string }> };

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const categorySlug = (category: string) =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, '-');


const getPost = cache((slug: string) =>
  prisma.blogPost
    .findUnique({
      where: { slug },
      include: {
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    .catch(orNull('Blog post'))
);

export async function generateMetadata({ params }: BlogParams) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.isPublished) return { title: 'Post Not Found' };

  const base = createPageMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt || post.title,
    path: `/blog/${encodeURIComponent(post.slug)}/`,
    ...(post.imagePath ? { image: post.imagePath } : {}),
    type: 'article',
  });

  return {
    ...base,
    keywords: post.keywords
      ? post.keywords.split(',').map((keyword: string) => keyword.trim())
      : undefined,
    authors: [{ name: post.author || 'Vastu Vihar' }],
    openGraph: {
      ...base.openGraph,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
  };
}

export default async function DynamicSingleBlogPage({ params }: BlogParams) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.isPublished) notFound();

  const [previousPost, nextPost] = await Promise.all([
    prisma.blogPost
      .findFirst({
        where: { createdAt: { lt: post.createdAt }, isPublished: true },
        orderBy: { createdAt: 'desc' },
        select: { title: true, slug: true },
      })
      .catch(orNull('Previous blog post')),
    prisma.blogPost
      .findFirst({
        where: { createdAt: { gt: post.createdAt }, isPublished: true },
        orderBy: { createdAt: 'asc' },
        select: { title: true, slug: true },
      })
      .catch(orNull('Next blog post')),
  ]);

  return (
    <ArticleLayout
      route={post.slug}
      postId={post.id}
      category={post.category}
      categoryHref={`/category/${categorySlug(post.category)}/`}
      title={post.title}
      publishedDate={formatDate(post.createdAt)}
      publishedIso={post.createdAt.toISOString()}
      updatedDate={formatDate(post.updatedAt)}
      updatedIso={post.updatedAt.toISOString()}
      image={post.imagePath || ''}
      imageAlt={post.imageAlt || post.title}
      prevPost={previousPost
        ? { title: previousPost.title, href: `/blog/${previousPost.slug}/` }
        : undefined}
      nextPost={nextPost
        ? { title: nextPost.title, href: `/blog/${nextPost.slug}/` }
        : undefined}
      afterContent={
        <section className="blog-comments-section" aria-label="Post comments">
          {post.comments.length > 0 && (
            <>
              <h2 className="comments-list-title">
                {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
              </h2>
              <div className="comments-list">
                {post.comments.map((comment) => (
                  <article key={comment.id} className="comment-item">
                    <div className="comment-meta">
                      <span className="comment-author">{comment.authorName}</span>
                      <time className="comment-date" dateTime={comment.createdAt.toISOString()}>
                        {formatDate(comment.createdAt)}
                      </time>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </article>
                ))}
              </div>
            </>
          )}
          <CommentForm postId={post.id} />
        </section>
      }
    >
      <BreadcrumbJsonLd items={[{ name: 'Blog', path: '/blog/' }, { name: post.title }]} />
      <div
        className="dynamic-blog-content wp-block-post-content"
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
      />
    </ArticleLayout>
  );
}
