import { NextResponse, type NextFetchEvent, type NextMiddleware, type NextRequest } from "next/server";
import { auth } from "./auth";

// Percent-encoded characters that are never valid in legitimate paths on this
// site. Their presence reliably signals scanner probes or injection attempts.
const MALICIOUS_URL_RE = /%22|%27|%3[cC]|%3[eE]|%60|%00|%0[aAdD]/;

// Mirrors the original admin matcher patterns
const ADMIN_PATH_RE = /^\/admin(\/(?!signin).*)?$|^\/api\/admin\//;

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (MALICIOUS_URL_RE.test(request.url)) {
    return new NextResponse(null, { status: 404 });
  }
  if (ADMIN_PATH_RE.test(request.nextUrl.pathname)) {
    return (auth as unknown as NextMiddleware)(request, event);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
