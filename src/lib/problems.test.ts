import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkAnswer, fmt, readNumbers, type Level } from "./mathx.ts";
import { makeProblem, topicIds } from "./problems.ts";
import { allTopics } from "./topics.ts";
import { allRoadmaps, flatSteps } from "./roadmaps.ts";
import { BANK } from "./bank.ts";

describe("readNumbers", () => {
  it("menerima koma, titik, pecahan, dan pemisah ribuan Indonesia", () => {
    assert.ok(readNumbers("0,5").includes(0.5));
    assert.ok(readNumbers("0.5").includes(0.5));
    assert.ok(readNumbers("1/2").includes(0.5));
    assert.ok(readNumbers("3.200").includes(3200));
    assert.ok(readNumbers("Rp112.000").includes(112000));
    assert.ok(readNumbers("1.048.576").includes(1048576));
    assert.ok(readNumbers("1.732").includes(1.732));
    assert.ok(readNumbers("−4").includes(-4));
    assert.ok(readNumbers("5 m/s").includes(5));
    assert.deepEqual(readNumbers(""), []);
    assert.deepEqual(readNumbers("abc"), []);
  });

  it("fmt memakai koma desimal", () => {
    assert.equal(fmt(0.5), "0,5");
    assert.equal(fmt(3200), "3200");
    assert.equal(fmt(-1.25), "-1,25");
  });
});

describe("bank soal", () => {
  const ids = topicIds();

  it("setiap materi punya generator dan angka bank", () => {
    for (const topic of allTopics()) {
      assert.ok(ids.includes(topic.id), `generator hilang: ${topic.id}`);
      assert.ok((BANK[topic.id] ?? 0) > 0, `bank kosong, jalankan npm run bank: ${topic.id}`);
    }
  });

  it("setiap soal valid dan kunci jawabannya sendiri diterima", () => {
    for (const id of ids) {
      for (const level of [1, 2, 3] as Level[]) {
        for (let seed = 1; seed <= 400; seed++) {
          const p = makeProblem(id, seed + level * 1009, level);
          const where = `${id} L${level} seed ${seed}: ${p.prompt}`;
          assert.ok(Number.isFinite(p.value), `nilai tidak hingga — ${where}`);
          assert.ok(!/undefined|NaN|Infinity/.test(p.prompt + p.given + p.steps.join(" ")), `teks rusak — ${where}`);
          assert.ok(checkAnswer(p, p.answer), `kunci ${p.answer} ditolak — ${where}`);
          if (Number.isInteger(p.value) && Math.abs(p.value) >= 1000) {
            assert.ok(checkAnswer(p, p.value.toLocaleString("id-ID")), `format ribuan ditolak — ${where}`);
          }
        }
      }
    }
  });

  it("jawaban yang jelas salah ditolak", () => {
    for (const id of ids) {
      const p = makeProblem(id, 7, 2);
      assert.ok(!checkAnswer(p, String(p.value + 1 + Math.abs(p.value) * 0.1)), `terlalu longgar: ${id}`);
    }
  });
});

describe("peta profesi", () => {
  it("setiap peta punya langkah inti dan tidak ada materi ganda", () => {
    for (const road of allRoadmaps()) {
      assert.ok(flatSteps(road, false).length >= 5, `peta ${road.id} terlalu tipis`);
    }
  });
});
