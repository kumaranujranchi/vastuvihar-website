import { cache } from 'react';
import { orEmpty, orNull, prisma } from '@/lib/prisma';
import { sanitizeBlogHtml } from '@/lib/sanitizeHtml';
import { createPageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import CommentForm from '../CommentForm';

// Cached, and refreshed when a post or its comments change (lib/revalidate.ts), or hourly.
export const revalidate = 3600;

// Published posts are prerendered at build time. Posts published later are rendered on
// their first visit and cached from then on.
export async function generateStaticParams() {
    const posts = await prisma.blogPost
        .findMany({ where: { isPublished: true }, select: { slug: true } })
        .catch(orEmpty('Blog post list'));
    return posts.map(({ slug }) => ({ slug }));
}

// Shared by the metadata and the page, so a render reads the post once.
const getPost = cache((slug: string) =>
    prisma.blogPost.findUnique({
        where: { slug },
        include: {
            comments: {
                where: { isApproved: true },
                orderBy: { createdAt: 'desc' },
            },
        },
    }).catch(orNull('Blog post'))
);

// 1. Await params in Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
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
        keywords: post.keywords ? post.keywords.split(',').map((k: string) => k.trim()) : undefined,
        authors: [{ name: post.author || 'Vastu Vihar' }],
        openGraph: {
            ...base.openGraph,
            publishedTime: post.createdAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
        },
    };
}

// 2. Await params in the Page Component
export default async function DynamicSingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // <-- MUST AWAIT PARAMS

    const post = await getPost(slug);

    if (!post || !post.isPublished) {
        notFound();
    }

    const [previousPost, nextPost] = await Promise.all([
        prisma.blogPost.findFirst({
            where: { createdAt: { lt: post.createdAt }, isPublished: true },
            orderBy: { createdAt: 'desc' },
            select: { title: true, slug: true },
        }).catch(orNull('Previous blog post')),
        prisma.blogPost.findFirst({
            where: { createdAt: { gt: post.createdAt }, isPublished: true },
            orderBy: { createdAt: 'asc' },
            select: { title: true, slug: true },
        }).catch(orNull('Next blog post')),
    ]);

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formatCategorySlug = (cat: string) => cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
        <ArticleLayout
            route={post.slug}
            postId={post.id}
            category={post.category}
            categoryHref={`/category/${formatCategorySlug(post.category)}/`}
            title={post.title}
            publishedDate={formatDate(post.createdAt)}
            publishedIso={post.createdAt.toISOString()}
            updatedDate={formatDate(post.updatedAt)}
            updatedIso={post.updatedAt.toISOString()}
            image={post.imagePath || ''}
            imageAlt={post.imageAlt || post.title}
            prevPost={previousPost ? { title: previousPost.title, href: `/blog/${previousPost.slug}/` } : undefined}
            nextPost={nextPost ? { title: nextPost.title, href: `/blog/${nextPost.slug}/` } : undefined}
        >
            <BreadcrumbJsonLd items={[{ name: 'Blog', path: '/blog/' }, { name: post.title }]} />
            {/* Blog Content */}
            <div
                className="dynamic-blog-content wp-block-post-content"
                dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
            />

            {/* --- COMMENTS SECTION --- */}
            <div className="blog-comments-section">
                {post.comments.length > 0 && (
                    <>
                        <h3 className="comments-list-title">
                            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                        </h3>
                        <div className="comments-list">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-meta">
                                        <span className="comment-author">{comment.authorName}</span>
                                        <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* The Client Component Form */}
                <CommentForm postId={post.id} />
            </div>
        </ArticleLayout>
    );
}