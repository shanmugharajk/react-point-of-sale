import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Optimistic cookie gate — no DB here, it runs on every request (prefetches
// included); the (app) layout does the real check. /login exempt so a stale
// cookie can't ping-pong.
const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
  const isPublic = PUBLIC_PATHS.includes(request.nextUrl.pathname);
  const hasCookie = Boolean(getSessionCookie(request));

  if (isPublic || hasCookie) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

// Everything except APIs and static files — new pages are gated by default.
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
