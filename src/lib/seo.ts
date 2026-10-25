import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

/** Build an absolute URL on the configured site origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

interface PageMetadataInput {
  title?: string;
  description?: string;
  /** Path of the page, e.g. `/projects/geovision-ai`. */
  path: string;
}

/** Metadata with canonical URL plus Open Graph and Twitter tags. */
export function buildPageMetadata({
  title,
  description = siteConfig.description,
  path,
}: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const url = absoluteUrl(path);
  // A page's own `openGraph` replaces the parent's, including the images from
  // src/app/opengraph-image.tsx, so every page names the image explicitly.
  const socialImage = {
    url: absoluteUrl("/opengraph-image"),
    width: 1200,
    height: 630,
    alt: `${siteConfig.name}, ${siteConfig.roles[0]}`,
  };

  return {
    // The root layout's title template appends the site name, so pass the
    // bare page title here. Social cards below use the full title.
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImage.url],
    },
  };
}

/**
 * schema.org Person data for search engines, built only from the site config
 * (nothing is invented). Rendered as JSON-LD on the home page.
 */
export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.roles[0],
    description: siteConfig.description,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Pimpri Chinchwad University",
    },
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  };
}

/** JSON for a <script type="application/ld+json"> tag; `<` is escaped so the
 * content can never close the tag early. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
