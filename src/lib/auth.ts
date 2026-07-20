/**
 * Cognito hosted-UI authentication (authorization-code flow).
 *
 * Auth is driven entirely by environment variables set on the server:
 *   COGNITO_ISSUER        https://cognito-idp.<region>.amazonaws.com/<poolId>
 *   COGNITO_DOMAIN        https://<domain-prefix>.auth.<region>.amazoncognito.com
 *   COGNITO_CLIENT_ID
 *   COGNITO_CLIENT_SECRET
 *   APP_URL               https://<host> (public URL of this app)
 *
 * When these are absent (e.g. a fresh local clone) the app runs without
 * authentication — no env vars are needed for local development.
 */

export const SESSION_COOKIE = "bpm_session";
export const STATE_COOKIE = "bpm_oauth_state";

export interface AuthConfig {
  issuer: string;
  domain: string;
  clientId: string;
  clientSecret: string;
  appUrl: string;
}

export function getAuthConfig(): AuthConfig | null {
  const issuer = process.env.COGNITO_ISSUER;
  const domain = process.env.COGNITO_DOMAIN;
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;
  const appUrl = process.env.APP_URL;
  if (!issuer || !domain || !clientId || !clientSecret || !appUrl) return null;
  return {
    issuer,
    domain: domain.replace(/\/$/, ""),
    clientId,
    clientSecret,
    appUrl: appUrl.replace(/\/$/, ""),
  };
}

export function isAuthConfigured(): boolean {
  return getAuthConfig() !== null;
}

export function callbackUrl(cfg: AuthConfig): string {
  return `${cfg.appUrl}/api/auth/callback`;
}
