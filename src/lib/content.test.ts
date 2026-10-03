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

describe("daftar belanja dan panduan rakit", async () => {
  const { KITS, kitAsText, kitTotal, rupiahRange } = await import("./kits.ts");

  it("proyek perangkat keras punya daftar belanja dan panduan rakit", () => {
    for (const id of ["drone", "line-follower", "stasiun-cuaca", "inkubator"]) {
      const kit = KITS[id];
      assert.ok(kit, `kit ${id}`);
      assert.ok(kit.parts.some((part) => part.group === "inti"), `komponen inti ${id}`);
      assert.ok(kit.build.length >= 5, `panduan rakit ${id}`);
    }
    assert.ok(KITS.drone.build.length >= 12, "panduan drone detail");
  });

  it("total dan teks belanja masuk akal", () => {
    const [min, max] = kitTotal(KITS.drone, ["inti", "habis"]);
    assert.ok(min > 2_000_000 && max < 15_000_000 && min < max, `total drone ${min}–${max}`);
    const owned = new Set([0]);
    assert.ok(kitTotal(KITS.drone, ["inti"], owned)[0] < kitTotal(KITS.drone, ["inti"])[0]);
    assert.match(kitAsText("Drone", KITS.drone, owned), /\[sudah ada\]/);
    assert.equal(rupiahRange([950000, 4200000]), "Rp950 rb – Rp4,2 jt");
  });
});

describe("pelajaran dan tantangan kode", async () => {
  const { LESSONS, lessonsOf } = await import("./code.ts");
  const { CHALLENGES, pythonHarness } = await import("./challenges.ts");

  it("setiap pelajaran punya tingkat, dan SQL selalu bisa dijalankan", () => {
    for (const lesson of LESSONS) {
      assert.ok(lesson.level, `tingkat ${lesson.id}`);
      if (lesson.lang === "sql") assert.equal(lesson.run, "sql");
      if (lesson.lang !== "python" && lesson.lang !== "sql") assert.equal(lesson.run, undefined);
    }
    const py = lessonsOf("python");
    assert.equal(py[0].level, "dasar");
    assert.equal(py.at(-1)?.level, "lanjut");
  });

  it("tantangan unik dan kerangka penguji Python berisi kode pengguna dan penanda", () => {
    assert.equal(new Set(CHALLENGES.map((c) => c.id)).size, CHALLENGES.length);
    const harness = pythonHarness("def f():\n    return 1", 'cek("satu", f() == 1)');
    assert.match(harness, /def f\(\):/);
    assert.match(harness, /__LULUS__/);
    assert.match(harness, / {4}cek\("satu", f\(\) == 1\)/);
  });
});
