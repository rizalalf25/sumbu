import { betterAuth, type BetterAuthOptions } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { getPglite } from "../db";
import { pgliteDialect } from "./pglite-dialect";

// Standalone Sumbu authentication. The original platform adapter stays available
// for its preview tooling; application accounts never depend on that broker.
const globals = globalThis as typeof globalThis & { __sumbuSecret?: string };
let instance: ReturnType<typeof betterAuth> | undefined;
export const authConfigured = true;

export function getAuth() {
  if (instance) return instance;
  const production = process.env.NODE_ENV === "production";
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const baseURL = process.env.BETTER_AUTH_URL?.trim();
  const secret = process.env.BETTER_AUTH_SECRET?.trim();
  const localPreview = process.env.SUMBU_ALLOW_LOCAL_DB === "true" && !process.env.VERCEL;
  if (production && !localPreview && (!databaseUrl || !baseURL || !secret || secret.length < 32)) {
    throw new Error(
      "Konfigurasi produksi memerlukan DATABASE_URL, BETTER_AUTH_URL, dan BETTER_AUTH_SECRET minimal 32 karakter.",
    );
  }
  if (
    production &&
    !localPreview &&
    (!baseURL?.startsWith("https://") || new URL(baseURL).origin !== baseURL)
  ) {
    throw new Error(
      "BETTER_AUTH_URL produksi harus berupa origin HTTPS tanpa path atau garis miring di akhir.",
    );
  }
  globals.__sumbuSecret ??= randomBytes(32).toString("hex");
  const secure = Boolean(baseURL?.startsWith("https://"));
  const options: BetterAuthOptions = {
    appName: "SUMBU",
    baseURL: baseURL ?? "http://localhost:8080",
    secret: secret ?? globals.__sumbuSecret,
    database: databaseUrl
      ? new Pool({ connectionString: databaseUrl, max: 5 })
      : { dialect: pgliteDialect(() => getPglite()), type: "postgres" },
    trustedOrigins:
      production && !localPreview
        ? [baseURL!]
        : [
            baseURL ?? "http://localhost:8080",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:8081",
            "http://127.0.0.1:8081",
          ],
    emailAndPassword: { enabled: true, minPasswordLength: 10, maxPasswordLength: 128 },
    account: { accountLinking: { enabled: false } },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 120,
      customRules: {
        "/sign-in/email": { window: 60, max: 10 },
        "/sign-up/email": { window: 60, max: 5 },
      },
    },
    advanced: {
      cookiePrefix: "sumbu",
      useSecureCookies: secure,
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax", secure, path: "/" },
    },
    plugins: [tanstackStartCookies()],
  };
  instance = betterAuth(options);
  return instance;
}
