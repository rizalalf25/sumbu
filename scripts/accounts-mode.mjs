/**
 * Mode akun SUMBU.
 *
 * Akun (login, sinkron progres, ruang diskusi) butuh PostgreSQL dan tiga pengaturan:
 * DATABASE_URL, BETTER_AUTH_SECRET, dan BETTER_AUTH_URL. Di Vercel, kalau ketiganya belum diisi
 * sama sekali, SUMBU tayang sebagai situs belajar tanpa akun: semua materi jalan dan progres
 * disimpan di peramban, seperti versi sebelum ada akun. Begitu ketiganya diisi lalu redeploy,
 * akun aktif dengan sendirinya.
 *
 * Akun baru aktif kalau ketiganya ada. Integrasi database (misalnya Neon) sering mengisi
 * DATABASE_URL sendiri sebelum dua pengaturan auth disiapkan; dalam keadaan setengah jadi itu
 * situs tetap tayang tanpa akun, dan log build menyebut pengaturan yang masih kurang.
 *
 * Di luar Vercel (pengembangan, CI, pratinjau lokal, server Node mandiri) mode akun selalu aktif.
 */
export const ACCOUNT_ENV_KEYS = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"];

/**
 * Pengaturan akun yang belum diisi.
 * @param {Record<string, string | undefined>} [env]
 */
export function missingAccountEnv(env = process.env) {
  return ACCOUNT_ENV_KEYS.filter((key) => !env[key]?.trim());
}

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {"on" | "off"}
 */
export function accountsMode(env = process.env) {
  if (!env.VERCEL) return "on";
  return missingAccountEnv(env).length === 0 ? "on" : "off";
}
