import './ProjectDetails.css';
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
  // Use the same model-specific photo for the hero thumbnail and the
  // theme's breadcrumb/banner background. Do not use the sample theme image.
  const heroImage =
    project.gallery?.find((image) => typeof image === 'string' && image.trim()) ||
    project.image ||
    project.modelTypes?.flatMap((model) => model.layouts || []).find((layout) => layout.url)?.url ||
    '';

  // ProjectHero (including older copies) reads project.image, so setting it
  // here fixes the thumbnail without requiring any other file to be edited.
  const modelProject = { ...project, image: heroImage };

  // The theme also sets a default image on .breadcrumb-wrap. Override only
  // that image; all existing typography, sizing, overlays and animations stay.
  const bannerCss = heroImage && /^\/[a-zA-Z0-9_./-]+$/.test(heroImage)
    ? `.breadcrumb-wrap { background-image: url(${JSON.stringify(heroImage)}) !important; }`
    : '';

  return (
    <>
      {bannerCss && <style>{bannerCss}</style>}
      <ProjectBreadcrumb project={modelProject} />
      <div id="content" className="site-content clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div className="single-projects-header col-full">
                <div className="project-location">
                  <i className="spaciaz-icon-marker" aria-hidden="true" />{' '}
                  <Link href={modelProject.locationHref} rel="tag" prefetch={false}>
                    {modelProject.location}
                  </Link>
                </div>
                <h1 className="beta entry-title">{modelProject.title}</h1>
              </div>
              <div className="single-project-content col-full">
                <div className="elementor elementor-2178">
                  <ProjectFacts project={modelProject} />
                  <ProjectHero project={modelProject} />
                  <ProjectDescription project={modelProject} />
                  <ProjectLocation project={modelProject} />
                  <ProjectAmenities />
                  <ProjectMedia project={modelProject} />
                  <ProjectEnquiry project={modelProject} />
                  <ProjectNavigation project={modelProject} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
