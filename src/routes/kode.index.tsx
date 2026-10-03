import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { CHALLENGES } from "@/lib/challenges";
import { LANGS, LESSONS, LEVEL_LABEL, lessonsOf, type LangId, type LessonLevel } from "@/lib/code";
import { useSave } from "@/lib/progress";

export const Route = createFileRoute("/kode/")({ component: CodeHome });

const LEVELS: LessonLevel[] = ["dasar", "menengah", "lanjut"];

function CodeHome() {
  const { save } = useSave();
  const [active, setActive] = useState<LangId>("python");
  const lang = LANGS.find((item) => item.id === active)!;
  const lessons = lessonsOf(active);
  const passedLessons = LESSONS.filter((l) => save.code[l.id]).length;
  const passedChallenges = CHALLENGES.filter((c) => save.challenge[c.id]).length;
  const runnable = LESSONS.filter((l) => l.run).length;

  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">Bahasa pemrograman</p>
      <h1 className="mt-1 text-4xl md:text-5xl">Matematika yang dijalankan mesin.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Baca kodenya, tebak keluarannya, lalu jalankan dan ubah langsung di sini. Python dan SQL berjalan di peramban tanpa instal apa pun; bahasa lain memakai alat gratis yang disarankan.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="card p-3 sm:p-4">
          <p className="font-display text-2xl tabular-nums sm:text-3xl">
            {passedLessons}
            <span className="text-muted">/{LESSONS.length}</span>
          </p>
          <p className="text-sm text-muted">pelajaran lulus kuis</p>
        </div>
        <div className="card p-3 sm:p-4">
          <p className="font-display text-2xl tabular-nums sm:text-3xl">
            {passedChallenges}
            <span className="text-muted">/{CHALLENGES.length}</span>
          </p>
          <p className="text-sm text-muted">tantangan kode lulus</p>
        </div>
        <div className="card p-3 sm:p-4">
          <p className="font-display text-2xl tabular-nums sm:text-3xl">{runnable}</p>
          <p className="text-sm text-muted">pelajaran bisa dijalankan di peramban</p>
        </div>
      </div>

      <Link to="/kode/tantangan" className="card card-link mt-4 flex flex-wrap items-center justify-between gap-3 p-5">
        <span>
          <span className="block text-sm font-semibold text-copper">Tantangan kode · dinilai otomatis</span>
          <span className="mt-1 block text-xl">Tulis fungsimu sendiri, lalu uji dengan tes</span>
          <span className="mt-1 block text-sm text-muted">
            {CHALLENGES.filter((c) => c.lang === "python").length} tantangan Python dan {CHALLENGES.filter((c) => c.lang === "sql").length} tantangan SQL, dari median sampai pengendali PID.
          </span>
        </span>
        <span className="btn">Mulai tantangan</span>
      </Link>

      <nav className="chip-row mt-10 flex gap-2 overflow-x-auto pb-1" aria-label="Pilih bahasa" role="tablist">
        {LANGS.map((item) => {
          const all = lessonsOf(item.id);
          const done = all.filter((l) => save.code[l.id]).length;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active === item.id}
              className={`chip shrink-0 ${active === item.id ? "border-copper text-copper" : ""}`}
              onClick={() => setActive(item.id)}
            >
              {item.name} · {done}/{all.length}
            </button>
          );
        })}
      </nav>

      <section className="mt-6" role="tabpanel" aria-label={lang.name}>
        <p className="text-sm font-semibold text-copper">{lang.kicker}</p>
        <h2 className="text-3xl">{lang.name}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{lang.summary}</p>
        <p className="mt-2 text-sm">
          {lessons.some((l) => l.run) ? "Contoh bertanda ▶ bisa dijalankan di halaman pelajaran. " : ""}
          Untuk proyek sungguhan:{" "}
          <a href={lang.tryUrl} target="_blank" rel="noreferrer" className="font-semibold text-copper underline-offset-4 hover:underline">
            {lang.tryLabel}
          </a>
        </p>

        {LEVELS.map((level) => {
          const rows = lessons.filter((l) => l.level === level);
          if (!rows.length) return null;
          return (
            <div key={level} className="mt-6">
              <h3 className="text-xl">{LEVEL_LABEL[level]}</h3>
              <ol className="card mt-2 divide-y divide-line">
                {rows.map((lesson) => (
                  <li key={lesson.id}>
                    <Link to="/kode/$lessonId" params={{ lessonId: lesson.id }} className="flex items-center gap-3 px-4 py-3.5">
                      <span className="w-6 shrink-0 text-center text-copper" aria-label={lesson.run ? "bisa dijalankan" : undefined}>
                        {lesson.run ? "▶" : ""}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{lesson.title}</span>
                        <span className="block truncate text-sm text-muted">{lesson.idea}</span>
                      </span>
                      <span className={`shrink-0 text-sm ${save.code[lesson.id] ? "font-semibold text-copper" : "text-muted"}`}>
                        {save.code[lesson.id] ? "Lulus" : `${lesson.minutes} mnt`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </section>
    </Shell>
  );
}
