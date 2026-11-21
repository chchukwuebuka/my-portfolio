export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  adminEmail: string;
  sessionSecret: string;
}

export interface GA4Config {
  propertyId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

export class ConfigError extends Error {
  public readonly missingKeys: string[];

  constructor(missingKeys: string[]) {
    super(`Missing required server configuration: ${missingKeys.join(", ")}`);
    this.name = "ConfigError";
    this.missingKeys = missingKeys;
  }
}

function readEnv(key: string): string {
  return (process.env[key] ?? "").trim();
}

export function getSessionSecret(): string {
  const secret = readEnv("SESSION_SECRET");
  if (secret.length < 32) {
    throw new ConfigError(["SESSION_SECRET (min 32 chars)"]);
  }
  return secret;
}

export function getAdminEmail(): string {
  const email = readEnv("ADMIN_EMAIL").toLowerCase();
  if (!email || !email.includes("@")) {
    throw new ConfigError(["ADMIN_EMAIL"]);
  }
  return email;
}

export function getOAuthConfig(requestUrl?: string): OAuthConfig {
  const clientId = readEnv("GOOGLE_CLIENT_ID");
  const clientSecret = readEnv("GOOGLE_CLIENT_SECRET");
  const adminEmail = readEnv("ADMIN_EMAIL").toLowerCase();
  const sessionSecret = readEnv("SESSION_SECRET");

  let redirectUri = readEnv("GOOGLE_REDIRECT_URI");
  if (!redirectUri && requestUrl) {
    const origin = new URL(requestUrl).origin;
    redirectUri = `${origin}/.netlify/functions/auth-callback`;
  }

  const missing: string[] = [];
  if (!clientId) missing.push("GOOGLE_CLIENT_ID");
  if (!clientSecret) missing.push("GOOGLE_CLIENT_SECRET");
  if (!redirectUri) missing.push("GOOGLE_REDIRECT_URI");
  if (!adminEmail || !adminEmail.includes("@")) missing.push("ADMIN_EMAIL");
  if (sessionSecret.length < 32) missing.push("SESSION_SECRET");

  if (missing.length > 0) {
    throw new ConfigError(missing);
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    adminEmail,
    sessionSecret,
  };
}

export function getGA4Config(): GA4Config {
  const propertyId = readEnv("GA4_PROPERTY_ID");
  const serviceAccountEmail = readEnv("GA4_SERVICE_ACCOUNT_EMAIL");
  const rawPrivateKey = process.env.GA4_PRIVATE_KEY ?? "";

  // Support both escaped "\n" in Netlify env vars and multiline PEM strings
  const privateKey = rawPrivateKey
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .trim();

  const missing: string[] = [];
  if (!propertyId || !/^\d+$/.test(propertyId)) missing.push("GA4_PROPERTY_ID");
  if (!serviceAccountEmail) missing.push("GA4_SERVICE_ACCOUNT_EMAIL");
  if (!privateKey.includes("BEGIN PRIVATE KEY")) missing.push("GA4_PRIVATE_KEY");

  if (missing.length > 0) {
    throw new ConfigError(missing);
  }

  return {
    propertyId,
    serviceAccountEmail,
    privateKey,
  };
}

export function isGA4Configured(): boolean {
  try {
    getGA4Config();
    return true;
  } catch {
    return false;
  }
}

export function isOAuthConfigured(requestUrl?: string): boolean {
  try {
    getOAuthConfig(requestUrl);
    return true;
  } catch {
    return false;
  }
}
