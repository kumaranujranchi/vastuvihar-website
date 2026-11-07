import { revalidatePath } from 'next/cache';

// Public pages that read the database are cached (ISR) and refreshed here whenever an
// admin or privacy action changes what they show. Each page also refreshes hourly as a
// safety net. Route patterns refresh every matching page on its next visit.

// With trailingSlash: true the cached sitemap is tagged '/sitemap.xml/' and
// '/sitemap.xml/layout', so a plain revalidatePath('/sitemap.xml') matches neither.
// The 'layout' type produces the matching tag (verified with x-nextjs-cache).
const SITEMAP: [string, 'layout'] = ['/sitemap.xml', 'layout'];

function refresh(paths: Array<[string, 'page' | 'layout' | undefined]>) {
  for (const [path, type] of paths) {
    try {
      revalidatePath(path, type);
    } catch (error) {
      // Outside a request (for example a CLI script) there is no cache to refresh.
      console.warn(`revalidate ${path} skipped:`, error);
    }
  }
}

/** Every page that lists or shows blog posts: a post was created, edited or deleted. */
export function revalidateBlog() {
  refresh([
    ['/', undefined],
    ['/blog', undefined],
    // Every post, since a change also moves its neighbours' previous/next links.
    ['/blog/[slug]', 'page'],
    ['/category/[slug]', 'page'],
    SITEMAP,
  ]);
}

/** Post pages only: a published comment was approved, hidden, corrected or erased. */
export function revalidateBlogComments() {
  refresh([['/blog/[slug]', 'page']]);
}

/** Gallery pages: a photo was added, replaced or removed. */
export function revalidateGallery() {
  refresh([
    ['/gallery', undefined],
    ['/gallery/[slug]', 'page'],
    // Albums with no photos are left out of the sitemap.
    SITEMAP,
  ]);
}

/** Careers page: a vacancy was created, edited or deleted. */
export function revalidateCareers() {
  refresh([['/careers', undefined]]);
}
