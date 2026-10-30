import './TeamMember.css';
import '../projects/ProjectBreadcrumb.css';
import Link from 'next/link';

/** Keeps the original profile styling while sharing one editable layout. */
function Widget({ id, kind, children, className = '' }) {
  return (
    <div
      className={`elementor-element elementor-element-${id} elementor-widget elementor-widget-${kind} ${className}`}
      data-id={id}
      data-element_type="widget"
      data-widget_type={`${kind}.default`}
    >
      <div className="elementor-widget-container">{children}</div>
    </div>
  );
}

export default function TeamMember({ member }) {
  return (
    <>
      <div className="breadcrumb-wrap">
        <div className="breadcrumb-overlay" />
        <div className="elementor elementor-2399">
          <div className="elementor-element elementor-element-2e5eb79 e-con-full e-flex e-con e-parent">
            <div className="elementor-element elementor-element-1b51338 e-flex e-con-boxed e-con e-child">
              <div className="e-con-inner">
                <Widget id="17a4b8a" kind="hfe-breadcrumbs-widget">
                  <nav aria-label="Breadcrumb">
                    <ul className="hfe-breadcrumbs hfe-breadcrumbs-show-home">
                      <li className="hfe-breadcrumbs-item hfe-breadcrumbs-first">
                        <Link href="/" prefetch={false}>
                          <span className="hfe-breadcrumbs-text">Home</span>
                        </Link>
                      </li>
                      <li className="hfe-breadcrumbs-separator" aria-hidden="true">
                        <span className="site-breadcrumb-dot" />
                      </li>
                      <li className="hfe-breadcrumbs-item">
                        <Link href="/our-team/" prefetch={false}>
                          <span className="hfe-breadcrumbs-text">Our team</span>
                        </Link>
                      </li>
                      <li className="hfe-breadcrumbs-separator" aria-hidden="true">
                        <span className="site-breadcrumb-dot" />
                      </li>
                      <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                        <span className="hfe-breadcrumbs-text" aria-current="page">
                          {member.name}
                        </span>
                      </li>
                    </ul>
                  </nav>
                </Widget>
              </div>
            </div>
            <Widget id="c50fdb1" kind="spacer">
              <div className="elementor-spacer">
                <div className="elementor-spacer-inner" />
              </div>
            </Widget>
          </div>
        </div>
      </div>

      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div className="elementor elementor-1919">
                <div className="elementor-element elementor-element-b31b382 e-flex e-con-boxed e-con e-parent">
                  <div className="e-con-inner">
                    <div
                      className="elementor-element elementor-element-76b65d0 e-con-full e-flex e-con e-child"
                      data-settings={
                        '{"sticky":"top","sticky_on":["desktop","laptop","tablet_extra","tablet","mobile_extra"],"sticky_offset":30,"sticky_effects_offset":30,"sticky_parent":"yes"}'
                      }
                    >
                      <Widget id="26fca5c" kind="image">
                        <img
                          fetchPriority="high"
                          decoding="async"
                          width="615"
                          height="750"
                          src={member.image}
                          className="attachment-full size-full"
                          alt={member.name}
                        />
                      </Widget>
                    </div>

                    <div className="elementor-element elementor-element-5718132 e-con-full e-flex e-con e-child">
                      <Widget id="e55be75" kind="heading">
                        <p className="elementor-heading-title elementor-size-default">
                          {member.role}
                        </p>
                      </Widget>
                      <Widget id="9428af7" kind="heading">
                        <h1 className="elementor-heading-title elementor-size-default">
                          {member.name}
                        </h1>
                      </Widget>
                      <Widget id="d12d035" kind="text-editor">
                        <p>{member.summary}</p>
                      </Widget>
                      <Widget id="9bc2d15" kind="text-editor">
                        <p>Email address:</p>
                      </Widget>
                      <Widget id="f90d180" kind="text-editor">
                        <p>
                          <a href={`mailto:${member.email}`}>{member.email}</a>
                        </p>
                      </Widget>

                      <div className="elementor-element elementor-element-033f2f3 e-con-full e-flex e-con e-child">
                        <Widget id="1436033" kind="text-editor">
                          <p>{member.phone}</p>
                        </Widget>
                        <Widget
                          id="9741752"
                          kind="icon-list"
                          className="elementor-icon-list--layout-inline elementor-align-right elementor-list-item-link-full_width"
                        >
                          <ul className="elementor-icon-list-items elementor-inline-items">
                            {(member.socialLinks || []).map((social) => (
                              <li
                                key={social.label}
                                className="elementor-icon-list-item elementor-inline-item"
                              >
                                <a
                                  href={social.href}
                                  aria-label={`${member.name} on ${social.label}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="elementor-icon-list-icon">
                                    <i
                                      aria-hidden="true"
                                      className={`spaciaz-icon- spaciaz-icon-${social.icon}`}
                                    />
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </Widget>
                      </div>

                      <Widget id="7867b23" kind="heading">
                        <h2 className="elementor-heading-title elementor-size-default">About me</h2>
                      </Widget>
                      <Widget id="4040ced" kind="text-editor">
                        <p>{member.about}</p>
                      </Widget>
                      <Widget
                        id="bcf037c"
                        kind="icon-list"
                        className="elementor-icon-list--layout-traditional elementor-list-item-link-full_width"
                      >
                        <ul className="elementor-icon-list-items">
                          {member.highlights.map((highlight) => (
                            <li className="elementor-icon-list-item" key={highlight}>
                              <span className="elementor-icon-list-icon">
                                <svg
                                  aria-hidden="true"
                                  className="e-font-icon-svg e-fas-circle"
                                  viewBox="0 0 512 512"
                                >
                                  <circle cx="256" cy="256" r="248" />
                                </svg>
                              </span>
                              <span className="elementor-icon-list-text">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </Widget>
                      <Widget id="11836fa" kind="text-editor">
                        <p>{member.biography}</p>
                      </Widget>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
