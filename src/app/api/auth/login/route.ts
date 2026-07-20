import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { callbackUrl, getAuthConfig, STATE_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET() {
  const cfg = getAuthConfig();
  if (!cfg) return NextResponse.redirect(new URL("/", "http://localhost:3000"));

  const state = crypto.randomBytes(16).toString("hex");
  const authorize = new URL(`${cfg.domain}/oauth2/authorize`);
  authorize.searchParams.set("client_id", cfg.clientId);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("scope", "openid email profile");
  authorize.searchParams.set("redirect_uri", callbackUrl(cfg));
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize);
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: cfg.appUrl.startsWith("https"),
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
