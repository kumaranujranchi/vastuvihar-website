'use client';

import { useState } from 'react';
import './Gallery.css';

interface ImageProps {
  id: string | number;
  src: string;
  alt: string;
}

export default function GalleryLightbox({ images }: { images: ImageProps[] }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setCurrentIndex(index);
  const closeLightbox = () => setCurrentIndex(null);

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex !== null) {
      setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex !== null) {
      setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }
  };

  return (
    <>
      {/* Main Grid */}
      <div className="gallery-grid">
        {images.map((img, index) => (
          <div 
            key={img.id} 
            className="gallery-item clickable"
            onClick={() => openLightbox(index)}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {currentIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          
          <button className="lightbox-nav prev" onClick={showPrev}>&#10094;</button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[currentIndex].src} 
              alt={images[currentIndex].alt} 
            />
            <div className="lightbox-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          <button className="lightbox-nav next" onClick={showNext}>&#10095;</button>
        </div>
      )}
    </>
  );
}