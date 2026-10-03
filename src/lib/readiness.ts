import { roadLangs } from "./code.ts";
import { projectsOf } from "./projects.ts";
import { doneCount, flatSteps, type Roadmap, type Score } from "./roadmaps.ts";

export type Progress = Score & { code: Record<string, number>; proj: Record<string, number[]> };

export type Readiness = {
  /** Materi inti yang sudah cukup. */
  theory: { done: number; total: number };
  /** Pelajaran kode wajib yang kuisnya sudah benar. */
  code: { done: number; total: number };
  /** Tahapan proyek yang sudah dicentang, dari semua proyek peta. */
  project: { done: number; total: number };
  /** 0–100, bobot: teori 40%, kode 30%, proyek 30%. */
  score: number;
};

function ratio(part: { done: number; total: number }) {
  return part.total ? part.done / part.total : 0;
}

/** Kesiapan kerja satu peta: materi inti, bahasa pemrograman wajib, dan proyek. */
export function readinessOf(road: Roadmap, save: Progress): Readiness {
  const theory = { done: doneCount(road, save, false), total: flatSteps(road, false).length };
  const lessons = [...new Set(roadLangs(road.id).filter((item) => !item.optional).flatMap((item) => item.lessons))];
  const code = { done: lessons.filter((id) => save.code[id]).length, total: lessons.length };
  const projects = projectsOf(road.id);
  const project = {
    done: projects.reduce((sum, p) => sum + (save.proj[p.id]?.length ?? 0), 0),
    total: projects.reduce((sum, p) => sum + p.milestones.length, 0),
  };
  const score = Math.round(100 * (0.4 * ratio(theory) + 0.3 * ratio(code) + 0.3 * ratio(project)));
  return { theory, code, project, score };
}
