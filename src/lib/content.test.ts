import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LESSONS, ROAD_LANGS } from "./code.ts";
import { PROJECTS, projectsOf } from "./projects.ts";
import { allRoadmaps } from "./roadmaps.ts";
import { readinessOf } from "./readiness.ts";
import { emptySave, parseSave } from "./progress.ts";

describe("proyek dan bahasa per peta", () => {
  it("setiap peta punya dua proyek dan minimal satu bahasa wajib", () => {
    for (const road of allRoadmaps()) {
      assert.equal(projectsOf(road.id).length, 2, `jumlah proyek ${road.id}`);
      const langs = ROAD_LANGS[road.id] ?? [];
      assert.ok(langs.some((item) => !item.optional), `bahasa wajib ${road.id}`);
    }
  });

  it("proyek punya tahapan, alat, dan hasil yang cukup", () => {
    const ids = new Set<string>();
    for (const project of PROJECTS) {
      assert.ok(!ids.has(project.id), `id ganda ${project.id}`);
      ids.add(project.id);
      assert.ok(project.milestones.length >= 4, `tahapan ${project.id}`);
      assert.ok(project.stack.length >= 1 && project.deliver.length >= 1, `alat/hasil ${project.id}`);
    }
  });

  it("robotika punya proyek drone", () => {
    assert.ok(projectsOf("robotika").some((project) => /drone/i.test(project.title)));
  });
});

describe("pelajaran kode", () => {
  it("id unik dan kuis valid", () => {
    const ids = new Set<string>();
    for (const lesson of LESSONS) {
      assert.ok(!ids.has(lesson.id), `id ganda ${lesson.id}`);
      ids.add(lesson.id);
      assert.ok(lesson.quiz.options.length >= 3, `pilihan ${lesson.id}`);
      assert.equal(new Set(lesson.quiz.options).size, lesson.quiz.options.length, `pilihan ganda ${lesson.id}`);
      assert.ok(lesson.code.trim().length > 0, `kode kosong ${lesson.id}`);
    }
  });
});

describe("kesiapan dan cadangan", () => {
  it("kesiapan 0 untuk progres kosong dan naik saat ada kemajuan", () => {
    const road = allRoadmaps()[0];
    assert.equal(readinessOf(road, emptySave).score, 0);
    const project = projectsOf(road.id)[0];
    const lesson = (ROAD_LANGS[road.id] ?? [])[0].lessons[0];
    const after = readinessOf(road, { ...emptySave, code: { [lesson]: 1 }, proj: { [project.id]: [0, 1] } });
    assert.ok(after.score > 0);
  });

  it("parseSave menerima cadangan dan menolak teks asing", () => {
    const text = JSON.stringify({ ...emptySave, correct: { aljabar: 3 } });
    assert.equal(parseSave(text)?.correct.aljabar, 3);
    assert.equal(parseSave("bukan json"), null);
    assert.equal(parseSave(JSON.stringify({ halo: 1 })), null);
  });
});
