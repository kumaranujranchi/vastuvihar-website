import Link from 'next/link';
import './Gallery.css';

interface ImageProps {
  id: string | number;
  src: string;
  alt: string;
}

interface GalleryPreviewProps {
  title: string;
  slug: string;
  images: ImageProps[];
}

export default function GalleryPreview({ title, slug, images }: GalleryPreviewProps) {
  // Grab only the first 7 images
  const previewImages = images.slice(0, 7);

  return (
    <section className="gallery-preview-section">
      <div className="gallery-container">
        <h2 className="gallery-section-title">{title}</h2>
        
        <div className="gallery-grid">
          {previewImages.map((img) => (
            <div key={img.id} className="gallery-item">
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
          
          {/* 8th Slot: View More Button */}
          {images.length > 7 && (
            <Link href={`/gallery/${slug}`} className="gallery-view-more">
              <div className="view-more-content">
                <span>View More</span>
                <span className="view-more-count">+{images.length - 7} photos</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}