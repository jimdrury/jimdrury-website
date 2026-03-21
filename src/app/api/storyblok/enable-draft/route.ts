import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

const ROOT_PATH = "/";
const DRAFT_COOKIE_NAME = "__prerender_bypass";
const DRAFT_COOKIE_MAX_AGE_SECONDS = 2 * 60;
const CURRENT_PREVIEW_MODE_ID = process.env.__NEXT_PREVIEW_MODE_ID;

const getSafeReturnTo = (returnTo: string | null): string => {
  if (!returnTo) {
    return ROOT_PATH;
  }

  if (returnTo.startsWith("//")) {
    return ROOT_PATH;
  }

  const normalized = returnTo.startsWith("/") ? returnTo : `/${returnTo}`;
  return normalized || ROOT_PATH;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnToPath = getSafeReturnTo(searchParams.get("returnTo"));
  const returnToQuery = new URLSearchParams(searchParams);
  returnToQuery.delete("returnTo");
  const returnTo =
    returnToQuery.size > 0
      ? `${returnToPath}?${returnToQuery.toString()}`
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
}
