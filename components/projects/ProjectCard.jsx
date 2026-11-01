import './ProjectCard.css';
import Link from 'next/link';
import { modelType, getBudgetCategories } from '@/data/project-filters';

export default function ProjectCard({ model }) {
  const budgetCategories = getBudgetCategories(model).join(',');
  return (
    <div className="grid-item">
      <Link
        href={`/projects/${model.slug}/`}
        prefetch={false}
        className="project-item project-style-2"
        data-budget={budgetCategories}
        data-min-price={model.minPrice}
        data-max-price={model.maxPrice}
        data-type={modelType(model)}
        data-status={model.youtubeId ? 'walkthrough' : 'no-walkthrough'}
        data-beds={model.bedrooms}
        aria-label={`${model.title} - ${model.priceRange}`}
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
            <span className="project-status-badge">
              {model.priceRange}
            </span>
          </div>
          <div className="project-location">
            <i className="spaciaz-icon-marker" />
            <span>
              {model.bedrooms} BHK{model.builtUp !== 'Not specified' ? ` · ${model.builtUp}` : ''}
            </span>
          </div>
          <h4 className="project-title delta">
            <span>{model.title}</span>
          </h4>
        </div>
      </Link>
    </div>
  );
}

