// Diisi vite.config.ts saat build dari scripts/accounts-mode.mjs.
declare const __SUMBU_ACCOUNTS__: string | undefined;

/**
 * Apakah akun (login, sinkron progres, ruang diskusi) aktif di build ini.
 *
 * Mati hanya bila situs di-deploy di Vercel tanpa DATABASE_URL, BETTER_AUTH_SECRET, dan
 * BETTER_AUTH_URL. Dalam mode itu tidak ada panggilan ke /api/auth atau database: semua
 * materi tetap jalan dan progres tersimpan di peramban. Di luar Vite (tes Node) dianggap aktif.
 */
export const ACCOUNTS_ENABLED: boolean =
  typeof __SUMBU_ACCOUNTS__ === "undefined" || __SUMBU_ACCOUNTS__ !== "off";
