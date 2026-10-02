/**
 * Menghitung ulang jumlah variasi soal per materi dan menulis src/lib/bank.ts.
 * Jalankan: npm run bank
 */
import { writeFileSync } from "node:fs";
import { makeProblem, topicIds } from "../src/lib/problems.ts";

const SEEDS = 4000;
const counts: Record<string, number> = {};
for (const id of topicIds()) {
  const seen = new Set<string>();
  for (const level of [1, 2, 3] as const) {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const p = makeProblem(id, seed + level * 1009, level);
      seen.add(`${level}|${p.prompt}|${p.given}`);
    }
  }
  counts[id] = seen.size;
}

const body = Object.entries(counts)
  .map(([id, n]) => `  ${id}: ${n},`)
  .join("\n");
writeFileSync(
  new URL("../src/lib/bank.ts", import.meta.url),
  `// Dibuat otomatis oleh scripts/bank-count.ts. Jangan diedit tangan; jalankan \`npm run bank\`.\nexport const BANK: Record<string, number> = {\n${body}\n};\n`,
);
console.log(`bank.ts: ${Object.keys(counts).length} materi, ${Object.values(counts).reduce((a, b) => a + b, 0)} variasi.`);
