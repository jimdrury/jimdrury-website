import { type NextRequest, NextResponse } from "next/server";
import { environment } from "@/environment";

export async function GET(request: NextRequest) {
  const key = environment.INDEXNOW_KEY;

  if (!key) {
    return new Response("Not Found", { status: 404 });
  }

  const requestedKey = request.nextUrl.searchParams.get("key");
  if (requestedKey !== key) {
    return new Response("Not Found", { status: 404 });
  }

  return new NextResponse(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
