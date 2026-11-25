/**
 * Mode akun SUMBU.
 *
 * Akun (login, sinkron progres, ruang diskusi) butuh PostgreSQL dan tiga pengaturan:
 * DATABASE_URL, BETTER_AUTH_SECRET, dan BETTER_AUTH_URL. Di Vercel, kalau ketiganya belum diisi
 * sama sekali, SUMBU tayang sebagai situs belajar tanpa akun: semua materi jalan dan progres
 * disimpan di peramban, seperti versi sebelum ada akun. Begitu ketiganya diisi lalu redeploy,
 * akun aktif dengan sendirinya. Kalau hanya sebagian yang diisi, itu salah konfigurasi, dan
 * scripts/validate-deployment.mjs tetap menggagalkan build.
 *
 * Di luar Vercel (pengembangan, CI, pratinjau lokal, server Node mandiri) mode akun selalu aktif.
 */
export const ACCOUNT_ENV_KEYS = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"];

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {"on" | "off"}
 */
export function accountsMode(env = process.env) {
  if (!env.VERCEL) return "on";
  return ACCOUNT_ENV_KEYS.some((key) => env[key]?.trim()) ? "on" : "off";
}
