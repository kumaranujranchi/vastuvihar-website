import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
export const metadata = {
  title: 'Uncategorized',
  description:
    'Nothing Found It seems we can’t find what you’re looking for. Perhaps searching can help. Search for:',
};
export default function CategoryUncategorizedPage() {
  return (
    <PageLayout route="category/uncategorized">
      <Breadcrumb title="Uncategorized" />
      <div id="content" className="site-content clear" tabIndex="-1">
        <div className="col-full">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div className="no-results not-found">
                <header className="page-header">
                  <h1 className="page-title">Nothing Found</h1>
                </header>
                <div className="page-content">
                  <p>It seems we can’t find what you’re looking for. Perhaps searching can help.</p>
                  <SearchForm role="search" className="search-form" data-next-search="">
                    <label>
                      <span className="screen-reader-text">Search for:</span>
                      <input
                        type="search"
                        className="search-field"
                        placeholder="Search …"
                        defaultValue=""
                        name="s"
                        aria-label="Search …"
                      />
                    </label>
                    <input type="submit" className="search-submit" defaultValue="Search" />
                  </SearchForm>
                </div>
              </div>
            </main>
          </div>
          <div id="secondary" className="widget-area" role="complementary">
            <div id="search-2" className="widget widget_search">
              <h2 className="gamma widget-title">Search</h2>
              <div className="widget-content">
                <SearchForm role="search" className="search-form" data-next-search="">
                  <label>
                    <span className="screen-reader-text">Search for:</span>
                    <input
                      type="search"
                      className="search-field"
                      placeholder="Search …"
                      defaultValue=""
                      name="s"
                      aria-label="Search …"
                    />
                  </label>
                  <input type="submit" className="search-submit" defaultValue="Search" />
                </SearchForm>
              </div>
            </div>
            <div id="categories-2" className="widget widget_categories">
              <h2 className="gamma widget-title">Categories</h2>
              <div className="widget-content">
                <ul>
                  <li className="cat-item cat-item-6">
                    <Link href="/category/company/" prefetch={false}>
                      Company
                    </Link>
                  </li>
                  <li className="cat-item cat-item-7">
                    <Link href="/category/social-media/" prefetch={false}>
                      Social Media
                    </Link>
                  </li>
                  <li className="cat-item cat-item-5">
                    <Link href="/category/tips-tricks/" prefetch={false}>
                      Tips &amp; Tricks
                    </Link>
                  </li>
                </ul>
              </div>
            </div>{' '}
            <div id="recent-posts-2" className="widget widget_recent_entries">
              {' '}
              <h2 className="gamma widget-title">Recent Posts</h2>
              <div className="widget-content">
                {' '}
                <ul>
                  <li>
                    <div className="recent-posts-thumbnail">
                      <Link href="/how-to-get-started-in-buying-your-first-home/" prefetch={false}>
                        <img
                          width="150"
                          height="150"
                          src="/images/blog_14-150x150.jpg"
                          className="attachment-thumbnail size-thumbnail wp-post-image"
                          alt=""
                          decoding="async"
                        />{' '}
                      </Link>
                    </div>
                    <div className="recent-posts-info">
                      <p className="post-title">
                        <Link href="/how-to-get-started-in-buying-your-first-home/" prefetch={false}>
                          How to Get Started in Buying Your First Home
                        </Link>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="recent-posts-thumbnail">
                      <Link href="/exploring-minimalism-with-a-touch-of-luxury/" prefetch={false}>
                        <img
                          width="150"
                          height="150"
                          src="/images/blog_13-150x150.jpg"
                          className="attachment-thumbnail size-thumbnail wp-post-image"
                          alt=""
                          decoding="async"
                        />{' '}
                      </Link>
                    </div>
                    <div className="recent-posts-info">
                      <p className="post-title">
                        <Link href="/exploring-minimalism-with-a-touch-of-luxury/" prefetch={false}>
                          Exploring Minimalism with a Touch of Luxury
                        </Link>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="recent-posts-thumbnail">
                      <Link href="/are-sustainable-materials-the-future-of-homes/" prefetch={false}>
                        <img
                          width="150"
                          height="150"
                          src="/images/blog_12-150x150.jpg"
                          className="attachment-thumbnail size-thumbnail wp-post-image"
                          alt=""
                          decoding="async"
                        />{' '}
                      </Link>
                    </div>
                    <div className="recent-posts-info">
                      <p className="post-title">
                        <Link href="/are-sustainable-materials-the-future-of-homes/" prefetch={false}>
                          Are Sustainable Materials the Future of Homes?
                        </Link>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="recent-posts-thumbnail">
                      <Link href="/biophilic-design-bringing-nature-indoors/" prefetch={false}>
                        <img
                          width="150"
                          height="150"
                          src="/images/blog_11-150x150.jpg"
                          className="attachment-thumbnail size-thumbnail wp-post-image"
                          alt=""
                          decoding="async"
                        />{' '}
                      </Link>
                    </div>
                    <div className="recent-posts-info">
                      <p className="post-title">
                        <Link href="/biophilic-design-bringing-nature-indoors/" prefetch={false}>
                          Biophilic Design Bringing Nature Indoors
                        </Link>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
