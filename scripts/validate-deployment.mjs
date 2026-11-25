import { ACCOUNT_ENV_KEYS, accountsMode, missingAccountEnv } from "./accounts-mode.mjs";

if (process.env.VERCEL && accountsMode() === "off") {
  const missing = missingAccountEnv();
  console.log(
    missing.length === ACCOUNT_ENV_KEYS.length
      ? "[sumbu] DATABASE_URL, BETTER_AUTH_SECRET, dan BETTER_AUTH_URL belum diisi: situs tayang tanpa akun " +
          "(progres disimpan di peramban). Isi ketiganya lalu redeploy untuk mengaktifkan akun."
      : `[sumbu] Pengaturan akun belum lengkap (kurang: ${missing.join(", ")}): situs tayang tanpa akun ` +
          "(progres disimpan di peramban). Lengkapi ketiganya lalu redeploy untuk mengaktifkan akun.",
  );
} else if (process.env.VERCEL) {
  const missing = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"].filter(
    (key) => !process.env[key]?.trim(),
  );
  if (missing.length)
    throw new Error(`Atur environment Vercel sebelum deploy: ${missing.join(", ")}`);
  if (process.env.BETTER_AUTH_SECRET.trim().length < 32)
    throw new Error("BETTER_AUTH_SECRET minimal 32 karakter acak.");
  const url = new URL(process.env.BETTER_AUTH_URL.trim());
  if (url.protocol !== "https:" || url.origin !== process.env.BETTER_AUTH_URL.trim())
    throw new Error("BETTER_AUTH_URL harus origin HTTPS tanpa path/trailing slash.");
}
