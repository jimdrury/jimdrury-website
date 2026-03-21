import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

const DRAFT_COOKIE_NAME = "__prerender_bypass";
const DRAFT_COOKIE_MAX_AGE_SECONDS = 2 * 60;
const CURRENT_PREVIEW_MODE_ID = process.env.__NEXT_PREVIEW_MODE_ID;

/**
 * Refreshes the draft mode cookie. Call this periodically (e.g. every 60s)
 * while in draft mode to keep the session alive. Only works when the request
 * already has a valid draft cookie (cookies sent automatically with credentials).
 */
export async function GET() {
  const draftCookie = (await cookies()).get(DRAFT_COOKIE_NAME);
  if (!draftCookie?.value) {
    return NextResponse.json({ error: "Not in draft mode" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  const hasStaleDraftCookie =
    Boolean(CURRENT_PREVIEW_MODE_ID) &&
    draftCookie.value !== CURRENT_PREVIEW_MODE_ID;

  const response = NextResponse.json({ ok: true });
  const partitionedDraftCookieValue =
    CURRENT_PREVIEW_MODE_ID ?? draftCookie.value;

  if (hasStaleDraftCookie) {
    response.cookies.delete(DRAFT_COOKIE_NAME);
  }

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

  return response;
}
