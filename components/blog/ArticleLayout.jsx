import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import ContactForm from '@/components/ContactForm';

export default function ArticleLayout({
  route,
  postId = '12',
  category = 'Company',
  categoryHref = '/category/company/',
  title,
  publishedDate = 'Mar 18, 2025',
  publishedIso = '2025-03-18T08:29:42+00:00',
  updatedDate = 'Apr 16, 2025',
  updatedIso = '2025-04-16T01:33:11+00:00',
  image,
  prevPost,
  nextPost,
  children,
}) {
  return (
    <PageLayout route={route}>
      <div className="breadcrumb-wrap">
        <div className="breadcrumb-overlay" />
        <div data-elementor-type="wp-post" data-elementor-id="2399" className="elementor elementor-2399">
          <div
            className="elementor-element elementor-element-2e5eb79 e-con-full e-flex e-con e-parent"
            data-id="2e5eb79"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-1b51338 e-flex e-con-boxed e-con e-child"
              data-id="1b51338"
              data-element_type="container"
            >
              <div className="e-con-inner">
                <div
                  className="elementor-element elementor-element-17a4b8a elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                  data-id="17a4b8a"
                  data-element_type="widget"
                  data-widget_type="hfe-breadcrumbs-widget.default"
                >
                  <div className="elementor-widget-container">
                    <nav aria-label="Breadcrumb">
                      <ul className="hfe-breadcrumbs hfe-breadcrumbs-show-home">
                        <li className="hfe-breadcrumbs-item hfe-breadcrumbs-first">
                          <span className="hfe-breadcrumbs-home-icon" />
                          <Link href="/" prefetch={false}>
                            <span className="hfe-breadcrumbs-text">Home</span>
                          </Link>
                        </li>
                        <li className="hfe-breadcrumbs-separator">
                          <span className="hfe-breadcrumbs-separator-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square-full"
                              viewBox="0 0 512 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 512H0V0h512v512z" />
                            </svg>
                          </span>
                        </li>
                        <li className="hfe-breadcrumbs-item ">
                          <Link href={categoryHref} prefetch={false}>
                            <span className="hfe-breadcrumbs-text">{category}</span>
                          </Link>
                        </li>
                        <li className="hfe-breadcrumbs-separator">
                          <span className="hfe-breadcrumbs-separator-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square-full"
                              viewBox="0 0 512 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 512H0V0h512v512z" />
                            </svg>
                          </span>
                        </li>
                        <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                          <span className="hfe-breadcrumbs-text" aria-current="page">
                            {title}
                          </span>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-c50fdb1 elementor-widget elementor-widget-spacer"
              data-id="c50fdb1"
              data-element_type="widget"
              data-widget_type="spacer.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-spacer">
                  <div className="elementor-spacer-inner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="content" className="site-content clear" tabIndex="-1">
        <div className="col-full">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <article
                id={`post-${postId}`}
                className={`post-${postId} post type-post status-publish format-standard has-post-thumbnail hentry`}
              >
                <div className="single-content">
                  <header className="entry-header header-post-thumbnail">
                    <div className="entry-meta">
                      <div className="entry-meta-inner">
                        <div className="categories-link">
                          <span className="screen-reader-text">Categories</span>
                          <Link href={categoryHref} rel="category tag" prefetch={false}>
                            {category}
                          </Link>
                        </div>
                        <div className="posted-on">
                          <Link href={`/${route}/`} rel="bookmark" prefetch={false}>
                            <time className="entry-date published" dateTime={publishedIso}>
                              {publishedDate}
                            </time>
                            <time className="updated" dateTime={updatedIso}>
                              {updatedDate}
                            </time>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <h1 className="beta entry-title">{title}</h1>
                  </header>
                  {image && (
                    <div className="post-thumbnail">
                      <img
                        width="1290"
                        height="600"
                        src={image}
                        className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                        alt={title}
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="entry-content">
                    {children}
                  </div>
                  <aside className="entry-taxonomy" />
                  {(prevPost || nextPost) && (
                    <nav
                      id="post-navigation"
                      className="navigation post-navigation"
                      role="navigation"
                      aria-label="Post Navigation"
                    >
                      <h2 className="screen-reader-text">Post navigation</h2>
                      <div className="nav-links">
                        {prevPost && (
                          <div className="nav-previous">
                            <Link href={prevPost.href} rel="prev" prefetch={false}>
                              <span className="nav-content">
                                <span className="reader-text">Previous post </span>
                                <span className="title">{prevPost.title}</span>
                              </span>
                            </Link>
                          </div>
                        )}
                        {nextPost && (
                          <div className="nav-next">
                            <Link href={nextPost.href} rel="next" prefetch={false}>
                              <span className="nav-content">
                                <span className="reader-text">Next post </span>
                                <span className="title">{nextPost.title}</span>
                              </span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </nav>
                  )}
                  <section id="comments" className="comments-area" aria-label="Post Comments">
                    <div id="respond" className="comment-respond">
                      <span id="reply-title" className="gamma comment-reply-title">
                        Leave a Reply{' '}
                        <small>
                          <Link
                            rel="nofollow"
                            id="cancel-comment-reply-link"
                            href={`/${route}/#respond`}
                            style={{ display: 'none' }}
                            prefetch={false}
                          >
                            Cancel reply
                          </Link>
                        </small>
                      </span>
                      <ContactForm id="commentform" className="comment-form">
                        <p className="comment-notes">
                          <span id="email-notes">Your email address will not be published.</span>{' '}
                          <span className="required-field-message">
                            Required fields are marked <span className="required">*</span>
                          </span>
                        </p>
                        <p className="comment-form-comment">
                          <textarea
                            id="comment"
                            name="comment"
                            cols="45"
                            rows="4"
                            maxLength="65525"
                            required
                            placeholder="Comment"
                            defaultValue=""
                          />
                        </p>
                        <p className="comment-form-author">
                          <input
                            id="author"
                            name="author"
                            type="text"
                            placeholder="Your Name *"
                            defaultValue=""
                            size="30"
                            aria-required="true"
                            required
                          />
                        </p>
                        <p className="comment-form-email">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email Address *"
                            defaultValue=""
                            size="30"
                            aria-required="true"
                            required
                          />
                        </p>
                        <p className="comment-form-url">
                          <input
                            id="url"
                            name="url"
                            type="url"
                            placeholder="Your Website"
                            defaultValue=""
                            size="30"
                          />
                        </p>
                        <p className="comment-form-cookies-consent">
                          <input
                            id="wp-comment-cookies-consent"
                            name="wp-comment-cookies-consent"
                            type="checkbox"
                            defaultValue="yes"
                          />{' '}
                          <label htmlFor="wp-comment-cookies-consent">
                            Save my name, email, and website in this browser for the next time I comment.
                          </label>
                        </p>
                        <p className="form-submit">
                          <button name="submit" type="submit" id="submit" className="submit button-style">
                            <span className="button-text">Post Comment</span>
                            <span className="button-icon">
                              <span className="btn-icon-wrap">
                                <span className="btn-icon">
                                  <i className="spaciaz-icon-arrow-long-right" />
                                </span>
                                <span className="btn-icon-hover">
                                  <i className="spaciaz-icon-arrow-long-right" />
                                </span>
                              </span>
                            </span>
                          </button>
                          <input
                            type="hidden"
                            name="comment_post_ID"
                            defaultValue={postId}
                            id="comment_post_ID"
                          />
                          <input type="hidden" name="comment_parent" id="comment_parent" defaultValue="0" />
                        </p>
                      </ContactForm>
                    </div>
                  </section>
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

