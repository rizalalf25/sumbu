import assert from "node:assert/strict";
import { test } from "node:test";
import { LESSONS, LANGS, lessonsOf } from "./code.ts";
import { CODE_PRACTICE, codeGuide, codeProgressKey } from "./code-learning.ts";
import { CURATED, SUBTES, drawQuestion, quantQuestion, patternQuestion } from "./lpdp.ts";
import { solutionSteps } from "./lpdp-learning.ts";
import { progressSchema } from "./progress-schema.ts";

test("LPDP question progress keys are accepted for account synchronization", () => {
  for (const sub of SUBTES) {
    const q = drawQuestion(sub.id, 42);
    const key = `${sub.id}:${q.id}`;
    assert.ok(progressSchema.safeParse({ lpdp: { right: { [key]: 1 }, wrong: {} } }).success, key);
  }
  assert.equal(progressSchema.safeParse({ code: { constructor: 1 } }).success, false);
});

test("all code lessons have a specific experiment and pitfall; saved keys do not collide", () => {
  assert.deepEqual(Object.keys(CODE_PRACTICE).sort(), LESSONS.map((l) => l.id).sort());
  for (const lesson of LESSONS) {
    const guide = codeGuide(lesson);
    assert.ok(guide.task.length > 50 && guide.trap.length > 50, lesson.id);
    assert.ok(!LESSONS.some((l) => l.id === codeProgressKey(lesson.id)));
    assert.ok(
      progressSchema.safeParse({
        steps: { [codeProgressKey(lesson.id)]: 6 },
        notes: { [codeProgressKey(lesson.id)]: "Catatan" },
      }).success,
    );
  }
  for (const lang of LANGS) {
    const levels = lessonsOf(lang.id).map(
      (l) => ({ dasar: 0, menengah: 1, lanjut: 2 })[l.level ?? "dasar"],
    );
    assert.deepEqual(levels, [...levels].sort());
  }
});

test("every LPDP category and generated variant has a worked solution matching its answer", () => {
  const questions = [...CURATED];
  for (const sub of SUBTES)
    for (const kind of sub.kinds)
      for (let seed = 0; seed < 60; seed++) {
        const q = drawQuestion(sub.id, seed, kind.id);
        assert.equal(q.kind, kind.id);
        questions.push(q);
      }
  for (const q of questions) {
    const steps = solutionSteps(q);
    assert.ok(steps.length >= 4, q.id);
    assert.ok(
      steps.some((step) => step.includes(q.options[q.answer])),
      q.id,
    );
    assert.ok(!/NaN|undefined|Infinity/.test(steps.join(" ")), q.id);
  }
});

test("quantitative solutions include exact intermediate values and check the result", () => {
  for (let seed = 0; seed < 40; seed++) {
    const q = quantQuestion(seed, "sistem");
    const prices = [...q.q.matchAll(/Rp([\d.]+)/g)].map((m) => Number(m[1].replaceAll(".", "")));
    const bookPrice = (3 * prices[0] - 2 * prices[1]) / 7;
    assert.equal(q.options[q.answer], "Rp" + bookPrice.toLocaleString("id-ID"));
    assert.ok(solutionSteps(q).some((s) => s.includes("Cek kembali")));
    const pattern = patternQuestion(seed);
    assert.match(solutionSteps(pattern)[0], /nomor alfabet/);
    assert.ok(solutionSteps(pattern)[2].includes(pattern.options[pattern.answer]));
  }
});
