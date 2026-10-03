import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation, CURATED, drawQuestion, patternQuestion, quantQuestion, SUBTES, type LpdpQuestion } from "./lpdp.ts";

function valid(q: LpdpQuestion) {
  const where = `${q.id}: ${q.q}`;
  assert.equal(q.options.length, 4, `4 pilihan — ${where}`);
  assert.equal(new Set(q.options).size, 4, `pilihan unik — ${where} ${JSON.stringify(q.options)}`);
  assert.ok(q.answer >= 0 && q.answer < 4, `kunci valid — ${where}`);
  assert.ok(!/NaN|undefined|Infinity/.test(q.q + q.options.join() + q.why), `teks rusak — ${where}`);
}

describe("bank soal LPDP", () => {
  it("soal kurasi valid dan id unik", () => {
    const ids = new Set<string>();
    for (const q of CURATED) {
      valid(q);
      assert.ok(!ids.has(q.id), `id ganda ${q.id}`);
      ids.add(q.id);
    }
    assert.ok(CURATED.filter((q) => q.sub === "verbal").length >= 60);
    assert.ok(CURATED.filter((q) => q.sub === "penalaran").length >= 20);
  });

  it("soal kuantitatif dan pola buatan valid", () => {
    for (let seed = 1; seed <= 3000; seed++) {
      valid(quantQuestion(seed));
      valid(patternQuestion(seed));
    }
  });

  it("setiap jenis soal di materi bisa ditarik untuk latihan", () => {
    for (const sub of SUBTES) {
      for (const kind of sub.kinds) {
        const q = drawQuestion(sub.id, 42, kind.id);
        valid(q);
      }
    }
  });

  it("paket simulasi berisi 30 soal tanpa kembar", () => {
    const sim = buildSimulation(7);
    assert.equal(sim.length, 30);
    assert.equal(new Set(sim.map((q) => q.q + (q.passage ?? ""))).size, 30);
  });
});
