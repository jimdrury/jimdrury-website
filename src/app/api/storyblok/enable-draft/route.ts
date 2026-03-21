import crypto from "crypto";
import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { environment } from "@/environment";

const ROOT_PATH = "/";
const DRAFT_COOKIE_NAME = "__prerender_bypass";
const DRAFT_COOKIE_MAX_AGE_SECONDS = 2 * 60;
const CURRENT_PREVIEW_MODE_ID = process.env.__NEXT_PREVIEW_MODE_ID;
const TOKEN_MAX_AGE_SECONDS = 3600;

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

const getStoryblokToken = (
  searchParams: URLSearchParams,
): { spaceId: string; token: string; timestamp: string } | null => {
  const spaceId = searchParams.get("_storyblok_tk[space_id]");
  const token = searchParams.get("_storyblok_tk[token]");
  const timestamp = searchParams.get("_storyblok_tk[timestamp]");

  if (!spaceId || !token || !timestamp) {
    return null;
  }

  return { spaceId, token, timestamp };
};

const isValidStoryblokToken = (tk: {
  spaceId: string;
  token: string;
  timestamp: string;
}): boolean => {
  if (tk.spaceId !== environment.STORYBLOK_SPACE_ID) {
    return false;
  }

  const timestampSeconds = Number(tk.timestamp);
  if (Number.isNaN(timestampSeconds)) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (nowSeconds - timestampSeconds > TOKEN_MAX_AGE_SECONDS) {
    return false;
  }

  const validationString = `${tk.spaceId}:${environment.STORYBLOK_ACCESS_TOKEN}:${tk.timestamp}`;
  const expectedToken = crypto
    .createHash("sha1")
    .update(validationString)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(tk.token),
    Buffer.from(expectedToken),
  );
};

const stripStoryblokParams = (params: URLSearchParams): URLSearchParams => {
  const cleaned = new URLSearchParams(params);
  for (const key of [...cleaned.keys()]) {
    if (key.startsWith("_storyblok_tk[")) {
      cleaned.delete(key);
    }
  }
  cleaned.delete("returnTo");
  return cleaned;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

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

  const returnToPath = getSafeReturnTo(searchParams.get("returnTo"));
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
}
