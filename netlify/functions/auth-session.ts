import {
  getMissingGA4Keys,
  isGA4Configured,
  isOAuthConfigured,
} from "./_lib/config.ts";
import { errorResponse, jsonResponse } from "./_lib/http.ts";
import { requireAdminSession } from "./_lib/session.ts";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET is supported.");
  }

  const oauthConfigured = isOAuthConfigured(req.url);
  const ga4Configured = isGA4Configured();

  const auth = await requireAdminSession(req);
  if (!auth.ok) {
    const clearHeader = auth.response.headers.get("set-cookie");
    return jsonResponse(
      {
        authenticated: false,
        oauthConfigured,
        ga4Configured,
      },
      200,
      undefined,
      clearHeader ? [clearHeader] : undefined
    );
  }

  return jsonResponse({
    authenticated: true,
    oauthConfigured,
    ga4Configured,
    ga4MissingKeys: getMissingGA4Keys(),
    csrfToken: auth.session.csrfToken,
    expiresAt: auth.session.expiresAt,
    user: {
      email: auth.session.email,
      name: auth.session.name,
      picture: auth.session.picture,
    },
  });
}
