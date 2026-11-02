import PageLayout from '@/components/PageLayout';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
import { notFound } from 'next/navigation';

// Mock data fetcher - replace this with your actual database or folder-read logic
async function getGalleryData(slug: string) {
  // Example dummy data structure
  const dummyImages = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    src: `/images/gallery/${slug}/image-${i + 1}.jpg`, // Adjust to your actual path
    alt: `${slug} image ${i + 1}`
  }));

  return {
    title: slug.replace('-', ' ').toUpperCase(),
    images: dummyImages
  };
}

export default async function GallerySlugPage({ params }: { params: { slug: string } }) {
  const data = await getGalleryData(params.slug);

  if (!data || data.images.length === 0) {
    notFound();
  }

  return (
    <PageLayout route={`gallery-${params.slug}`}>
      {/* HEADER PLACEHOLDER */}
      <div className="gallery-page-header">
        {/* Add your AboutHeader or PageHeader component here */}
        <h1>{data.title}</h1>
      </div>

      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area gallery-container">
            <main id="main" className="site-main">
              <GalleryLightbox images={data.images} />
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}