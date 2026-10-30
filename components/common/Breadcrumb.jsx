import './Breadcrumb.css';
import { Fragment } from 'react';
import Link from 'next/link';

/** Reusable banner for new pages. Existing page-specific banners may be retained. */
export default function Breadcrumb({ title, items = [] }) {
  const crumbs = [{ label: 'Home', href: '/' }, ...items, { label: title }];
  return (
    <div className="breadcrumb-wrap">
      <div className="breadcrumb-overlay" />
      <div className="elementor elementor-333">
        <div className="elementor-element elementor-element-67488f4 e-con-full e-flex e-con e-parent">
          <div className="elementor-element elementor-element-dcc3858 e-flex e-con-boxed e-con e-child">
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-f731f09 elementor-widget elementor-widget-page-title">
                <div className="elementor-widget-container"><div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                  <h1 className="elementor-heading-title elementor-size-default">{title}</h1>
                </div></div>
              </div>
              <div className="elementor-element elementor-element-4f1e524 elementor-widget elementor-widget-hfe-breadcrumbs-widget">
                <div className="elementor-widget-container">
                  <nav aria-label="Breadcrumb"><ol className="hfe-breadcrumbs hfe-breadcrumbs-show-home">
                    {crumbs.map((crumb, index) => (
                      <Fragment key={`${crumb.label}-${index}`}>
                        {index > 0 && <li className="hfe-breadcrumbs-separator" aria-hidden="true"><span className="site-breadcrumb-dot" /></li>}
                        <li className={`hfe-breadcrumbs-item${index === crumbs.length - 1 ? ' hfe-breadcrumbs-last' : ''}`}>
                          {crumb.href ? <Link href={crumb.href} prefetch={false}><span className="hfe-breadcrumbs-text">{crumb.label}</span></Link> : <span className="hfe-breadcrumbs-text" aria-current="page">{crumb.label}</span>}
                        </li>
                      </Fragment>
                    ))}
                  </ol></nav>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-356ae23 elementor-widget elementor-widget-spacer" aria-hidden="true">
            <div className="elementor-widget-container"><div className="elementor-spacer"><div className="elementor-spacer-inner" /></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
