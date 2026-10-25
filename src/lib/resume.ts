import { existsSync } from "node:fs";
import path from "node:path";

import { siteConfig } from "@/config/site";

/**
 * The resume button is only shown when the PDF actually exists in
 * `public/`, so the site never advertises a download that would 404.
 * Server-only: uses the filesystem at build/render time.
 */
export function isResumeAvailable(): boolean {
  const filePath = path.join(
    process.cwd(),
    "public",
    siteConfig.resume.path.replace(/^\//, ""),
  );
  return existsSync(filePath);
}
