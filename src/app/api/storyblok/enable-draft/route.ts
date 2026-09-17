import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";
import {
  getSafeReturnTo,
  getStoryblokToken,
  isValidStoryblokToken,
  stripStoryblokParams,
} from "./_helpers/storyblok-preview-token";

const DRAFT_COOKIE_NAME = "__prerender_bypass";
const DRAFT_COOKIE_MAX_AGE_SECONDS = 2 * 60;
const CURRENT_PREVIEW_MODE_ID = process.env.__NEXT_PREVIEW_MODE_ID;

const GET = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const tk = getStoryblokToken(searchParams);
  if (!tk) {
    return NextResponse.json(
      { error: "Missing Storyblok validation token" },
      { status: 401 },
    );
  }

  if (!isValidStoryblokToken(tk)) {
    return NextResponse.json(
      { error: "Invalid Storyblok validation token" },
      { status: 401 },
    );
  }

  const returnToPath = getSafeReturnTo(
    searchParams.get("returnTo"),
    requestUrl.origin,
  );
  const forwardedParams = stripStoryblokParams(searchParams);
  const returnTo =
    forwardedParams.size > 0
      ? `${returnToPath}?${forwardedParams.toString()}`
      : returnToPath;

  const draft = await draftMode();
  draft.enable();

  const draftCookie = (await cookies()).get(DRAFT_COOKIE_NAME);
  const response = NextResponse.redirect(new URL(returnTo, request.url));
  const hasStaleDraftCookie =
    Boolean(draftCookie?.value) &&
    Boolean(CURRENT_PREVIEW_MODE_ID) &&
    draftCookie?.value !== CURRENT_PREVIEW_MODE_ID;

  if (hasStaleDraftCookie) {
    response.cookies.delete(DRAFT_COOKIE_NAME);
  }

  const partitionedDraftCookieValue =
    CURRENT_PREVIEW_MODE_ID ?? draftCookie?.value;

  if (partitionedDraftCookieValue) {
    response.cookies.set({
      name: DRAFT_COOKIE_NAME,
      value: partitionedDraftCookieValue,
      maxAge: DRAFT_COOKIE_MAX_AGE_SECONDS,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true,
      path: "/",
    });
  }

  return response;
};

export { GET };
