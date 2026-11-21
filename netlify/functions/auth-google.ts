import { OAuth2Client } from "google-auth-library";
import { ConfigError, getOAuthConfig } from "./_lib/config.ts";
import { errorResponse, isSecureRequest, redirectResponse } from "./_lib/http.ts";
import {
  createOAuthStateCookie,
  generatePkcePair,
  generateRandomToken,
  sanitizeReturnTo,
} from "./_lib/session.ts";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET is supported.");
  }

  let oauth;
  try {
    oauth = getOAuthConfig(req.url);
  } catch (err) {
    if (err instanceof ConfigError) {
      return redirectResponse("/admin/analytics/login?error=config_missing");
    }
    return redirectResponse("/admin/analytics/login?error=oauth_error");
  }

  const url = new URL(req.url);
  const returnTo = sanitizeReturnTo(url.searchParams.get("returnTo"));

  const state = generateRandomToken(32);
  const nonce = generateRandomToken(20);
  const { codeVerifier, codeChallenge } = generatePkcePair();

  const client = new OAuth2Client({
    clientId: oauth.clientId,
    clientSecret: oauth.clientSecret,
    redirectUri: oauth.redirectUri,
  });

  const authUrl = client.generateAuthUrl({
    access_type: "online",
    prompt: "select_account",
    scope: ["openid", "email", "profile"],
    state,
    nonce,
    code_challenge: codeChallenge,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code_challenge_method: "S256" as any,
  });

  const secure = isSecureRequest(req);
  const stateCookie = await createOAuthStateCookie(
    { state, nonce, codeVerifier, returnTo },
    secure
  );

  return redirectResponse(authUrl, [stateCookie]);
}
