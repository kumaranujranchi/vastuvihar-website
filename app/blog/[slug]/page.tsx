import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/blog/ArticleLayout';

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
      <div 
        className="dynamic-blog-content wp-block-post-content" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </ArticleLayout>
  );
}