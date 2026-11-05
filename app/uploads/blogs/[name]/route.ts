import { readBlogImage } from '@/lib/privateStorage';

/** Serves blog images from R2. Images shipped in public/uploads are served before this runs. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const image = await readBlogImage(name);
  if (!image) return new Response('Not found', { status: 404 });
  return new Response(image.body as unknown as BodyInit, {
    headers: {
      'Content-Type': image.contentType,
      // Each upload gets a new name, so a stored image never changes.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
