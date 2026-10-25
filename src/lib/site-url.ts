/**
 * Public origin of the site, used for canonical URLs, Open Graph tags, the
 * sitemap and robots.txt.
 *
 * Order of preference:
 * 1. NEXT_PUBLIC_SITE_URL, the value you set yourself (always wins).
 * 2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel sets to your production
 *    domain (host only, so https:// is added). This keeps canonical URLs
 *    correct even if you forget step 1.
 * 3. VERCEL_URL, the address of the current preview deployment.
 * 4. http://localhost:3000 for local development.
 */
export function resolveSiteUrl(
  env: Partial<Record<string, string>> = process.env,
): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const host =
    env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || env.VERCEL_URL?.trim();
  if (host)
    return `https://${host.replace(/^https?:\/\//, "")}`.replace(/\/+$/, "");

  return "http://localhost:3000";
}

/** True when the URL still points at a local machine (not publishable). */
export function isLocalUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
