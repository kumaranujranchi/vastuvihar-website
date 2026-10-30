import Link from 'next/link';

export default function TeamCard({ member, priority = false }) {
  return (
    <div className="grid-item elementor-teambox-item">
      <div className="team-item">
        <Link
          className="team-link elementor-button-icon"
          href={`/our-team/${member.slug}/`}
          prefetch={false}
        >
          <span className="btn-icon-wrap">
            <span className="btn-icon">
              <i className="spaciaz-icon-arrow-long-right" />
            </span>
            <span className="btn-icon-hover">
              <i className="spaciaz-icon-arrow-long-right" />
            </span>
          </span>
        </Link>
        <div className="team-image">
          <div className="team-box-socials-wrapper">
            <div className="team-icon-socials">
              <ul />
            </div>
          </div>
          <div className="team-image-inner">
            <div className="decor_border" />
            <img
              fetchPriority={priority ? 'high' : undefined}
              decoding="async"
              width="615"
              height="750"
              src={member.image}
              className="attachment-full size-full"
              alt={member.name}
            />
          </div>
        </div>
        <div className="team-infor">
          <div className="team-job">{member.role}</div>
          <h5 className="team-name">
            <Link href={`/our-team/${member.slug}/`} prefetch={false}>
              {member.name}
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

