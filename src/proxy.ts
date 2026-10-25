import { NextResponse, type NextRequest } from "next/server";

import { getProjectBySlug } from "@/lib/content";

/**
 * Returns a real HTTP 404 for unknown or draft project slugs.
 *
 * With Cache Components, a slug that was not pre-rendered is resolved at
 * request time and streamed, so the status is already 200 before `notFound()`
 * can run (search engines would see a "soft 404"). Checking the slug here,
 * before streaming starts, keeps the status honest.
 * The check is a cheap in-memory lookup over `src/content/projects.ts`.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  if (!getProjectBySlug(decodeURIComponent(slug))) {
    // Rewriting to a path that matches no route renders `not-found.tsx`
    // with a 404 status.
    return NextResponse.rewrite(new URL("/not-found-rewrite", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/projects/:slug",
};
