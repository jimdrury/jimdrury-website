import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const STORYBLOK_PARAM_PREFIX = "_storyblok";
const DRAFT_COOKIE_NAME = "__prerender_bypass";
const ENABLE_DRAFT_ROUTE = "/api/storyblok/enable-draft";

const hasStoryblokPreviewParams = (searchParams: URLSearchParams): boolean => {
  for (const key of searchParams.keys()) {
    if (key.startsWith(STORYBLOK_PARAM_PREFIX)) {
      return true;
    }
  }

  return false;
};

export function proxy(request: NextRequest) {
  if (!hasStoryblokPreviewParams(request.nextUrl.searchParams)) {
    return NextResponse.next();
  }

  if (request.cookies.has(DRAFT_COOKIE_NAME)) {
    return NextResponse.next();
  }

  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const enableDraftUrl = new URL(ENABLE_DRAFT_ROUTE, request.url);
  enableDraftUrl.searchParams.set("returnTo", returnTo);

  return NextResponse.redirect(enableDraftUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
