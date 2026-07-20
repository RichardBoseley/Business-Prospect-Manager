import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { getAuthConfig, SESSION_COOKIE } from "@/lib/auth";

/**
 * Requires a valid Cognito session for every page and API route except the
 * auth endpoints, the public unsubscribe endpoint and the health check.
 * When Cognito env vars are absent (local development) all requests pass.
 */

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

export async function middleware(req: NextRequest) {
  const cfg = getAuthConfig();
  if (!cfg) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      jwks ??= createRemoteJWKSet(
        new URL(`${cfg.issuer}/.well-known/jwks.json`),
      );
      await jwtVerify(token, jwks, {
        issuer: cfg.issuer,
        audience: cfg.clientId,
      });
      return NextResponse.next();
    } catch {
      // fall through to login redirect
    }
  }
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/api/auth/login", req.url));
}

export const config = {
  matcher: [
    // Everything except auth endpoints, public endpoints and static assets.
    "/((?!api/auth|api/unsubscribe|api/health|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.ico$|.*\\.svg$).*)",
  ],
};
