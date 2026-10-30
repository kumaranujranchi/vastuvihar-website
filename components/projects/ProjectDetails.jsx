import Link from 'next/link';
import ProjectBreadcrumb from './ProjectBreadcrumb';
import ProjectFacts from './ProjectFacts';
import ProjectHero from './ProjectHero';
import ProjectDescription from './ProjectDescription';
import ProjectAmenities from './ProjectAmenities';
import ProjectMedia from './ProjectMedia';
import ProjectLocation from './ProjectLocation';
import ProjectEnquiry from './ProjectEnquiry';
import ProjectNavigation from './ProjectNavigation';

/** One reusable project layout for all Vastu Vihar home models. */
export default function ProjectDetails({ project }) {
  return (
    <>
      <ProjectBreadcrumb project={project} />
      <div id="content" className="site-content clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div className="single-projects-header col-full">
                <div className="project-location">
                  <i className="spaciaz-icon-marker" aria-hidden="true" />{' '}
                  <Link href={project.locationHref} rel="tag" prefetch={false}>
                    {project.location}
                  </Link>
                </div>
                <h1 className="beta entry-title">{project.title}</h1>
              </div>
              <div className="single-project-content col-full">
                <div className="elementor elementor-2178">
                  <ProjectFacts project={project} />
                  <ProjectHero project={project} />
                  <ProjectDescription project={project} />
                  <ProjectAmenities />
                  <ProjectMedia project={project} />
                  <ProjectLocation project={project} />
                  <ProjectEnquiry project={project} />
                  <ProjectNavigation project={project} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
