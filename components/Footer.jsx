import './layout/Footer.css';
import Link from 'next/link';
import { footerGroups } from '@/data/navigation';
import { site } from '@/data/site';

const columnStyles = [
  { column: '45c259f', heading: '9db1883', list: '5dc3fa0' },
  { column: '2a905f5', heading: 'c13e78a', list: '5bbbbf6' },
  { column: 'f1a7136', heading: '2099099', list: 'b28f28c' },
];

function FooterLinkGroup({ group, index }) {
  const ids = columnStyles[index];
  return (
    <div className={`elementor-element elementor-element-${ids.column} e-con-full e-flex e-con e-child`}>
      <div className={`elementor-element elementor-element-${ids.heading} elementor-widget elementor-widget-text-editor`}>
        <div className="elementor-widget-container"><p>{group.title}</p></div>
      </div>
      <div className={`elementor-element elementor-element-${ids.list} icon-list-style-spaciaz-yes elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list`}>
        <div className="elementor-widget-container">
          <ul className="elementor-icon-list-items">
            {group.links.map((link) => (
              <li className="elementor-icon-list-item" key={link.href}>
                <Link href={link.href} prefetch={false}><span className="elementor-icon-list-text">{link.label}</span></Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="colophon" itemType="https://schema.org/WPFooter" itemScope>
      <div className="footer-width-fixer">
        <div className="elementor elementor-6350">
          <div className="elementor-element elementor-element-2979ffc e-con-full e-flex e-con e-parent">
            <div className="elementor-element elementor-element-e376b42 elementor-widget elementor-widget-spacer" aria-hidden="true">
              <div className="elementor-widget-container"><div className="elementor-spacer"><div className="elementor-spacer-inner" /></div></div>
            </div>
            <div className="elementor-element elementor-element-027b0dc e-flex e-con-boxed e-con e-child">
              <div className="e-con-inner">
                <div className="elementor-element elementor-element-068eec6 e-con-full e-flex e-con e-child">
                  <div className="elementor-element elementor-element-2c3c48c elementor-widget elementor-widget-text-editor">
                    <div className="elementor-widget-container"><p>get in touch</p></div>
                  </div>
                  <div className="elementor-element elementor-element-9a8fa13 elementor-button-link line-effect-yes elementor-widget elementor-widget-spaciaz-button">
                    <div className="elementor-widget-container"><div className="elementor-button-wrapper">
                      <a href={site.phoneHref} className="elementor-button-link elementor-button elementor-size-sm">
                        <span className="elementor-button-content-wrapper"><span className="elementor-button-text" data-name={site.phone}><span>{site.phone}</span></span></span>
                      </a>
                    </div></div>
                  </div>
                  <div className="elementor-element elementor-element-9041218 elementor-button-link line-effect-yes elementor-widget elementor-widget-spaciaz-button">
                    <div className="elementor-widget-container"><div className="elementor-button-wrapper">
                      <a href={`mailto:${site.email}`} className="elementor-button-link elementor-button elementor-size-sm">
                        <span className="elementor-button-content-wrapper"><span className="elementor-button-text" data-name={site.email}><span>{site.email}</span></span></span>
                      </a>
                    </div></div>
                  </div>
                </div>
                <div className="elementor-element elementor-element-5026e2f e-con-full e-flex e-con e-child">
                  <div className="elementor-element elementor-element-9b14813 e-con-full e-flex e-con e-child">
                    {footerGroups.map((group, index) => <FooterLinkGroup key={group.title} group={group} index={index} />)}
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-5be06e4 e-con-full e-flex e-con e-child">
            </div>
            <div className="elementor-element elementor-element-aa7f6d2 elementor-widget elementor-widget-text-editor">
              <div className="elementor-widget-container">
                © {new Date().getFullYear()} <Link href="/" prefetch={false}><b>{site.name}</b></Link>. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
