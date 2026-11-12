import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Optimistic gate only — no DB check: the proxy runs on every request,
// prefetches included (Next's auth guide), and pages do the real validation
// via getSession(). /login stays reachable so a stale cookie can't ping-pong.
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
