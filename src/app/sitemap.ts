import type { MetadataRoute } from "next";

import { getPublishedProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/") },
    ...getPublishedProjects().map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
    })),
  ];
}
