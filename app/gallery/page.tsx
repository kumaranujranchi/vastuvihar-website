import PageLayout from '@/components/PageLayout';
import GalleryPreview from '@/components/gallery/GalleryPreview';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Gallery | Vastu Vihar',
  description: 'Explore the latest events, townships, and projects by Vastu Vihar.',
  path: '/gallery/',
});

// Mock data fetcher - replace this with your folder reading logic
async function getGalleryCategories() {
  return [
    {
      id: 'events',
      title: 'Company Events',
      slug: 'events',
      images: Array.from({ length: 12 }).map((_, i) => ({
        id: `evt-${i}`,
        src: `/images/gallery/events/image-${i + 1}.jpg`, // Update path
        alt: `Event Image ${i + 1}`,
      })),
    },
    {
      id: 'townships',
      title: 'Our Townships',
      slug: 'townships',
      images: Array.from({ length: 9 }).map((_, i) => ({
        id: `twn-${i}`,
        src: `/images/gallery/townships/image-${i + 1}.jpg`, // Update path
        alt: `Township Image ${i + 1}`,
      })),
    },
  ];
}

export default async function GalleryMainPage() {
  const categories = await getGalleryCategories();

  return (
    <PageLayout route="gallery">
      {/* HEADER PLACEHOLDER */}
      <div className="gallery-page-header">
        <h1>Photo Gallery</h1>
        <p>Glimpses of our events, projects, and milestones.</p>
      </div>

      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              {categories.map((category) => (
                <GalleryPreview
                  key={category.id}
                  title={category.title}
                  slug={category.slug}
                  images={category.images}
                />
              ))}
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}