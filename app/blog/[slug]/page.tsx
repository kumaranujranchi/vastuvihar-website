import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/blog/ArticleLayout';
import CommentForm from '../CommentForm';

// 1. Await params in Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // <-- MUST AWAIT PARAMS

    const post = await prisma.blogPost.findUnique({
        where: { slug },
    });

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Vastu Vihar`,
        description: post.excerpt || post.title,
        openGraph: {
            images: post.imagePath ? [post.imagePath] : [],
        },
    };
}

// 2. Await params in the Page Component
export default async function DynamicSingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // <-- MUST AWAIT PARAMS

    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
            comments: {
                where: { isApproved: true },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!post || !post.isPublished) {
        notFound();
    }

    const previousPost = await prisma.blogPost.findFirst({
        where: { createdAt: { lt: post.createdAt }, isPublished: true },
        orderBy: { createdAt: 'desc' },
    });

    const nextPost = await prisma.blogPost.findFirst({
        where: { createdAt: { gt: post.createdAt }, isPublished: true },
        orderBy: { createdAt: 'asc' },
    });

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
            prevPost={previousPost ? { title: previousPost.title, href: `/blog/${previousPost.slug}/` } : undefined}
            nextPost={nextPost ? { title: nextPost.title, href: `/blog/${nextPost.slug}/` } : undefined}
        >
            {/* Blog Content */}
            <div
                className="dynamic-blog-content wp-block-post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
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