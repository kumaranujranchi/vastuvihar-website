import './ProjectNavigation.css';
import Link from 'next/link';
import { getProject } from '@/data/projects';
export default function ProjectNavigation({ project }) {
  const previous = getProject(project.previousSlug);
  const next = getProject(project.nextSlug);
  return (
    <div className="elementor-element elementor-element-a95c38b e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-e8bb0a5 elementor-widget elementor-widget-spaciaz-projects-navigation">
          <div className="elementor-widget-container">
            <nav id="post-navigation" className="navigation post-navigation" aria-label="Project navigation">
              <h2 className="screen-reader-text">Project navigation</h2>
              <div className="nav-links">
                {previous && (
                  <div className="nav-previous">
                    <Link
                      href={`/projects/${previous.slug}/`}
                      rel="prev"
                      prefetch={false}
                      aria-label={`Previous project: ${previous.title}`}
                    >
                      <span className="nav-content">
                        <span className="reader-text">previous project</span>
                      </span>
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="nav-next">
                    <Link
                      href={`/projects/${next.slug}/`}
                      rel="next"
                      prefetch={false}
                      aria-label={`Next project: ${next.title}`}
                    >
                      <span className="nav-content">
                        <span className="reader-text">next project</span>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
