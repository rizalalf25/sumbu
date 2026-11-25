/**
 * Tes bawaan template Grok (scripts/**\/*.test.mjs) membaca berkas di .grok/ (app-env.json, skill og)
 * yang hanya disediakan sandbox Grok dan sengaja tidak ikut di-commit. Di clone biasa atau CI berkas
 * itu tidak ada, sehingga belasan tes pasti gagal walau aplikasinya sehat. Karena itu tes platform
 * hanya dijalankan bila .grok/app-env.json ada. Untuk memaksanya, jalankan `npm run test:platform`.
 *
 * Catatan: `npm run preview:restart` juga membuat folder .grok/ (untuk pid dan log), jadi yang dicek
 * berkas app-env.json, bukan sekadar foldernya.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (!existsSync(".grok/app-env.json")) {
  console.log("Tes platform dilewati: .grok/app-env.json tidak ada (hanya tersedia di sandbox Grok).");
  process.exit(0);
}

const run = spawnSync(process.execPath, ["--test", "scripts/**/*.test.mjs"], { stdio: "inherit" });
process.exit(run.status ?? 1);
