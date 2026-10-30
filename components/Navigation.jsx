'use client';

import './layout/Navigation.css';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/data/navigation';

const normalizePath = (path = '/') => path.replace(/\/+$/, '') || '/';

function isCurrent(pathname, href) {
  return normalizePath(pathname) === normalizePath(href);
}

function isSection(pathname, item) {
  if (isCurrent(pathname, item.href)) return true;
  if (item.children?.some((child) => isSection(pathname, child))) return true;
  return item.href !== '/' && `${normalizePath(pathname)}/`.startsWith(item.href);
}

/** Mobile submenu buttons and focus trapping are managed by ThemeRuntime. */
export default function Navigation({ mobile = false }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <nav className={mobile ? 'mobile-menu-tab mobile-navigation mobile-pages-menu active' : 'main-navigation site-navigation'} aria-label={mobile ? 'Mobile navigation' : 'Main navigation'}>
      <div className={mobile ? 'handheld-navigation' : 'primary-navigation'}>
        <ul id={mobile ? 'mobile-menu' : 'primary-menu'} className="menu">
          {navigation.map((item) => {
            const active = isCurrent(pathname, item.href);
            const section = isSection(pathname, item);
            const expanded = openMenu === item.href;
            return (
              <li key={item.href}
                className={['menu-item', item.children && 'menu-item-has-children', active && 'current-menu-item', section && 'current-menu-ancestor', !mobile && expanded && 'site-submenu-open'].filter(Boolean).join(' ')}
                onMouseEnter={!mobile && item.children ? () => setOpenMenu(item.href) : undefined}
                onMouseLeave={!mobile && item.children ? (event) => {
                  if (!event.currentTarget.contains(document.activeElement)) setOpenMenu(null);
                } : undefined}
                onBlur={!mobile && item.children ? (event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
                } : undefined}
                onKeyDown={!mobile && item.children ? (event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setOpenMenu(null);
                    event.currentTarget.querySelector('.site-submenu-button')?.focus();
                  }
                } : undefined}>
                <Link href={item.href} aria-current={active ? 'page' : undefined} prefetch={false} onClick={!mobile ? () => setOpenMenu(null) : undefined}>
                  {mobile ? item.label : <span className="hover-text" data-name={item.label}>{item.label}</span>}
                </Link>
                {item.children && !mobile && (
                  <button className="site-submenu-button" type="button" aria-label={`Toggle ${item.label} menu`}
                    aria-expanded={expanded} aria-controls="company-submenu"
                    onClick={() => setOpenMenu(expanded ? null : item.href)}>
                    <span aria-hidden="true">⌄</span>
                  </button>
                )}
                {item.children && (
                  <ul className="sub-menu" id={mobile ? 'mobile-company-submenu' : 'company-submenu'} hidden={mobile || !expanded}>
                    {item.children.map((child) => (
                      <li key={child.href} className={`menu-item${isCurrent(pathname, child.href) ? ' current-menu-item' : ''}`}>
                        <Link href={child.href} aria-current={isCurrent(pathname, child.href) ? 'page' : undefined} prefetch={false} onClick={!mobile ? () => setOpenMenu(null) : undefined}>
                          {mobile ? child.label : <span className="hover-text" data-name={child.label}>{child.label}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
