import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

const DRAFT_COOKIE_NAME = "__prerender_bypass";
const DRAFT_COOKIE_MAX_AGE_SECONDS = 2 * 60;

/**
 * Refreshes the draft mode cookie. Call this periodically (e.g. every 60s)
 * while in draft mode to keep the session alive. Only works when the request
 * already has a valid draft cookie (cookies sent automatically with credentials).
 */
const GET = async () => {
  // `isEnabled` is only true when the cookie matches this deployment's preview
  // mode ID, so an arbitrary `__prerender_bypass` value cannot mint a session.
  const draft = await draftMode();
  const draftCookie = (await cookies()).get(DRAFT_COOKIE_NAME);

  if (!draft.isEnabled || !draftCookie?.value) {
    return NextResponse.json({ error: "Not in draft mode" }, { status: 401 });
  }

  draft.enable();

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: DRAFT_COOKIE_NAME,
    value: draftCookie.value,
    maxAge: DRAFT_COOKIE_MAX_AGE_SECONDS,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    partitioned: true,
    path: "/",
  });
  return response;
};

export { GET };
