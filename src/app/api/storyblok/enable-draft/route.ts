import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

const ROOT_PATH = "/";
const DRAFT_COOKIE_NAME = "__prerender_bypass";

const getSafeReturnTo = (returnTo: string | null): string => {
  if (!returnTo) {
    return ROOT_PATH;
  }

  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return ROOT_PATH;
  }

  return returnTo;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));

  const draft = await draftMode();
  draft.enable();

  const draftCookie = (await cookies()).get(DRAFT_COOKIE_NAME);
  const response = NextResponse.redirect(new URL(returnTo, request.url));

  if (draftCookie?.value) {
    response.cookies.set({
      name: DRAFT_COOKIE_NAME,
      value: draftCookie.value,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true,
      path: "/",
    });
  }

  return response;
}
