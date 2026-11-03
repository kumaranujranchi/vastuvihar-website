
'use client';

import './layout/Navigation.css';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/data/navigation';

/* ------------------------------------
   HELPERS
------------------------------------ */

const normalizePath = (path = '/') =>
  path.replace(/\/+$/, '') || '/';

function isCurrent(pathname, href) {
  return normalizePath(pathname) === normalizePath(href);
}

function isSection(pathname, item) {
  if (isCurrent(pathname, item.href)) return true;

  if (
    item.children?.some((child) =>
      isSection(pathname, child)
    )
  ) {
    return true;
  }

  const base = normalizePath(item.href);

  return (
    base !== '/' &&
    normalizePath(pathname).startsWith(`${base}/`)
  );
}

/* ------------------------------------
   CHEVRON DOWN SVG
------------------------------------ */

function ChevronDownIcon({ expanded = false }) {
  return (
    <svg
      className={`nav-chevron-icon ${expanded ? 'is-open' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ------------------------------------
   NAVIGATION
------------------------------------ */

export default function Navigation({ mobile = false }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  const closeMenu = () => setOpenMenu(null);

  return (
    <nav
      className={
        mobile
          ? 'mobile-menu-tab mobile-navigation mobile-pages-menu active'
          : 'main-navigation site-navigation'
      }
      aria-label={
        mobile ? 'Mobile navigation' : 'Main navigation'
      }
    >
      <div
        className={
          mobile
            ? 'handheld-navigation'
            : 'primary-navigation'
        }
      >
        <ul
          id={mobile ? 'mobile-menu' : 'primary-menu'}
          className="menu"
        >
          {navigation.map((item) => {
            const active = isCurrent(pathname, item.href);
            const section = isSection(pathname, item);

            const hasChildren =
              Array.isArray(item.children) &&
              item.children.length > 0;

            const expanded = openMenu === item.href;

            const submenuId = `${
              mobile ? 'mobile' : 'desktop'
            }-submenu-${item.href.replace(/[^a-z0-9]/gi, '-')}`;

            return (
              <li
                key={item.href}
                className={[
                  'menu-item',

                  hasChildren && 'menu-item-has-children',

                  active && 'current-menu-item',

                  section && 'current-menu-ancestor',

                  !mobile &&
                    expanded &&
                    'site-submenu-open',
                ]
                  .filter(Boolean)
                  .join(' ')}

                /* DESKTOP HOVER */
                onMouseEnter={
                  !mobile && hasChildren
                    ? () => setOpenMenu(item.href)
                    : undefined
                }

                onMouseLeave={
                  !mobile && hasChildren
                    ? (event) => {
                        if (
                          !event.currentTarget.contains(
                            document.activeElement
                          )
                        ) {
                          closeMenu();
                        }
                      }
                    : undefined
                }

                /* KEYBOARD ACCESSIBILITY */
                onFocusCapture={
                  !mobile && hasChildren
                    ? () => setOpenMenu(item.href)
                    : undefined
                }

                onBlurCapture={
                  !mobile && hasChildren
                    ? (event) => {
                        if (
                          !event.currentTarget.contains(
                            event.relatedTarget
                          )
                        ) {
                          closeMenu();
                        }
                      }
                    : undefined
                }

                onKeyDown={
                  !mobile && hasChildren
                    ? (event) => {
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          closeMenu();

                          event.currentTarget
                            .querySelector(
                              '.site-submenu-button'
                            )
                            ?.focus();
                        }
                      }
                    : undefined
                }
              >
                {/* MAIN LINK */}
                <Link
                  href={item.href}
                  aria-current={
                    active ? 'page' : undefined
                  }
                  prefetch={false}
                  onClick={
                    !mobile ? closeMenu : undefined
                  }
                >
                  {mobile ? (
                    item.label
                  ) : (
                    <span
                      className="hover-text"
                      data-name={item.label}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>

                {/* SVG DROPDOWN BUTTON */}
                {hasChildren && !mobile && (
                  <button
                    className="site-submenu-button"
                    type="button"
                    aria-label={`Toggle ${item.label} submenu`}
                    aria-expanded={expanded}
                    aria-controls={submenuId}
                    onClick={() =>
                      setOpenMenu(
                        expanded ? null : item.href
                      )
                    }
                  >
                    <ChevronDownIcon expanded={expanded} />
                  </button>
                )}

                {/* CHILDREN */}
                {hasChildren && (
                  <ul
                    id={submenuId}
                    className="sub-menu"
                    hidden={mobile || !expanded}
                  >
                    {item.children.map((child) => {
                      const childActive = isCurrent(
                        pathname,
                        child.href
                      );

                      return (
                        <li
                          key={child.href}
                          className={[
                            'menu-item',
                            childActive &&
                              'current-menu-item',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <Link
                            href={child.href}
                            aria-current={
                              childActive
                                ? 'page'
                                : undefined
                            }
                            prefetch={false}
                            onClick={
                              !mobile
                                ? closeMenu
                                : undefined
                            }
                          >
                            {mobile ? (
                              child.label
                            ) : (
                              <span
                                className="hover-text"
                                data-name={child.label}
                              >
                                {child.label}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
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
