import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  callbackUrl,
  getAuthConfig,
  SESSION_COOKIE,
  STATE_COOKIE,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cfg = getAuthConfig();
  if (!cfg) return NextResponse.redirect(new URL("/", req.url));

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get(STATE_COOKIE)?.value;
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.json({ error: "invalid state" }, { status: 400 });
  }

  const tokenRes = await fetch(`${cfg.domain}/oauth2/token`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization:
        "Basic " +
        Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: cfg.clientId,
      code,
      redirect_uri: callbackUrl(cfg),
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "token exchange failed", detail: await tokenRes.text() },
      { status: 502 },
    );
  }
  const tokens = (await tokenRes.json()) as { id_token?: string };
  if (!tokens.id_token) {
    return NextResponse.json({ error: "no id_token" }, { status: 502 });
  }

  const jwks = createRemoteJWKSet(
    new URL(`${cfg.issuer}/.well-known/jwks.json`),
  );
  let expiresIn = 3600;
  try {
    const { payload } = await jwtVerify(tokens.id_token, jwks, {
      issuer: cfg.issuer,
      audience: cfg.clientId,
    });
    if (payload.exp) {
      expiresIn = Math.max(60, payload.exp - Math.floor(Date.now() / 1000));
    }
  } catch {
    return NextResponse.json({ error: "invalid id_token" }, { status: 401 });
  }

  const res = NextResponse.redirect(new URL("/", cfg.appUrl));
  res.cookies.delete(STATE_COOKIE);
  res.cookies.set(SESSION_COOKIE, tokens.id_token, {
    httpOnly: true,
    secure: cfg.appUrl.startsWith("https"),
    sameSite: "lax",
    maxAge: expiresIn,
    path: "/",
  });
  return res;
}
