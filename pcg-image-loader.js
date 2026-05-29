/**
 * PCG Image Loader for Next.js
 *
 * When NEXT_PUBLIC_PCG_IMAGE_URL is set, routes images through
 * the Gateway /image/optimize endpoint for server-side optimization.
 * Otherwise, returns the original URL directly (no optimization).
 */
export default function pcgImageLoader({ src, width, quality }) {
  const gateway = process.env.NEXT_PUBLIC_PCG_IMAGE_URL;

  if (!gateway) {
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}`;
  }

  const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3000';
  const absoluteSrc = src.startsWith('http') ? src : `${origin}${src}`;
  const params = new URLSearchParams({
    url: absoluteSrc,
    w: String(width),
    q: String(quality || 75),
  });
  return `${gateway}?${params}`;
}
