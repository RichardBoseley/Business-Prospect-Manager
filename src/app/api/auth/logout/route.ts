import { NextRequest, NextResponse } from "next/server";
import { getAuthConfig, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const cfg = getAuthConfig();
  const target = cfg
    ? `${cfg.domain}/logout?client_id=${cfg.clientId}&logout_uri=${encodeURIComponent(cfg.appUrl + "/")}`
    : new URL("/", req.url).toString();
  const res = NextResponse.redirect(target);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
