import './ProjectCard.css';
import Link from 'next/link';
import { modelType } from '@/data/project-filters';

export default function ProjectCard({ model }) {
  return (
    <div className="grid-item">
      <div
        className="project-item project-style-2"
        data-budget={model.priceRange}
        data-type={modelType(model)}
        data-status={model.youtubeId ? 'walkthrough' : 'no-walkthrough'}
        data-beds={model.bedrooms}
        title={model.description}
      >
        <div className="project-post-thumbnail">
          <img
            width="1920"
            height="1344"
            src={model.image}
            className="attachment-full size-full wp-post-image"
            alt={model.title}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="project-content">
          <div className="project-status">
            <Link href={`/projects/${model.slug}/`} prefetch={false}>
              {model.priceRange}
            </Link>
          </div>
          <div className="project-location">
            <i className="spaciaz-icon-marker" />
            <span>
              {model.bedrooms} BHK{model.builtUp !== 'Not specified' ? ` · ${model.builtUp}` : ''}
            </span>
          </div>
          <h4 className="project-title delta">
            <Link href={`/projects/${model.slug}/`} prefetch={false}>
              {model.title}
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
}

