import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CodeBlock, RunPanel } from "@/components/code-view";
import { FocusToggle, Shell } from "@/components/shell";
import { getLang, getLesson, LEVEL_LABEL, lessonsOf } from "@/lib/code";
import { useSave } from "@/lib/progress";
import { getTopic } from "@/lib/topics";

export const Route = createFileRoute("/kode/$lessonId")({ component: LessonRoute });

function LessonRoute() {
  const { lessonId } = Route.useParams();
  return <CodeLessonPage key={lessonId} lessonId={lessonId} />;
}

function CodeLessonPage({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId);
  const { save, passLesson } = useSave();
  const [pick, setPick] = useState<number | null>(null);

  if (!lesson) {
    return (
      <Shell>
        <h1 className="text-4xl">Pelajaran tidak ketemu</h1>
        <Link to="/kode" className="btn mt-6">
          Semua pelajaran kode
        </Link>
      </Shell>
    );
  }

  const lang = getLang(lesson.lang);
  const siblings = lessonsOf(lesson.lang);
  const index = siblings.findIndex((item) => item.id === lesson.id);
  const next = siblings[index + 1];
  const topic = lesson.topic ? getTopic(lesson.topic) : undefined;
  const answered = pick !== null;
  const correct = pick === lesson.quiz.answer;
  const passed = Boolean(save.code[lesson.id]);

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/kode" className="text-sm font-semibold text-copper">
            {lang.name} · pelajaran {index + 1} dari {siblings.length}
          </Link>
          <h1 className="mt-1 text-4xl">{lesson.title}</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-3 text-sm text-muted">
        {LEVEL_LABEL[lesson.level ?? "dasar"]} · sekitar {lesson.minutes} menit{passed ? " · sudah lulus" : ""}
        {topic ? (
          <>
            {" · memakai materi "}
            <Link to="/belajar/$topicId" params={{ topicId: topic.id }} className="font-semibold text-copper">
              {topic.title}
            </Link>
          </>
        ) : null}
      </p>

      <article className="card mt-5 p-5">
        <p className="text-sm font-semibold text-copper">Satu ide</p>
        <p className="mt-2 text-lg">{lesson.idea}</p>
      </article>

      <div className="mt-4">
        {lesson.run ? (
          <RunPanel key={lesson.id} initial={lesson.code} lang={lesson.lang} run={lesson.run} label={lang.name} />
        ) : (
          <CodeBlock code={lesson.code} lang={lesson.lang} label={lang.name} />
        )}
      </div>

      <article className="card mt-4 p-5">
        <h2 className="text-2xl">Baca pelan</h2>
        <ul className="mt-3 grid gap-2">
          {lesson.explain.map((line) => (
            <li key={line} className="flex gap-3">
              <span className="text-copper" aria-hidden="true">
                ›
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="card mt-4 p-5">
        <p className="text-sm font-semibold text-copper">Tebak sebelum menjalankan</p>
        <h2 className="mt-1 text-2xl">{lesson.quiz.q}</h2>
        <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Pilihan jawaban">
          {lesson.quiz.options.map((option, i) => {
            const isPick = pick === i;
            const isAnswer = i === lesson.quiz.answer;
            const tone = !answered ? "btn-ghost" : isAnswer ? "btn" : isPick ? "btn-ghost border-signal" : "btn-ghost opacity-60";
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isPick}
                disabled={answered && correct}
                className={`${tone} justify-start text-left font-mono text-sm`}
                onClick={() => {
                  setPick(i);
                  if (i === lesson.quiz.answer) passLesson(lesson.id);
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
        {answered ? (
          <div className="mt-4">
            <p className="font-semibold">{correct ? "Pas." : "Belum pas. Jawaban yang benar sudah ditandai."}</p>
            <p className="mt-1 text-muted">{lesson.quiz.why}</p>
            {!correct ? (
              <button type="button" className="btn-quiet mt-2 px-0" onClick={() => setPick(null)}>
                Coba lagi
              </button>
            ) : null}
          </div>
        ) : null}
      </article>

      <p className="mt-4 text-sm text-muted">
        {lesson.run ? "Tebak dulu, lalu tekan Jalankan di atas untuk membuktikan. Ubah satu angka dan tebak lagi. " : ""}
        Untuk proyek sungguhan, pakai{" "}
        <a href={lang.tryUrl} target="_blank" rel="noreferrer" className="font-semibold text-copper">
          {lang.tryLabel}
        </a>
        .
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Link to="/kode" className="btn-ghost">
          Semua pelajaran
        </Link>
        {next ? (
          <Link to="/kode/$lessonId" params={{ lessonId: next.id }} className="btn">
            Berikutnya: {next.title}
          </Link>
        ) : null}
      </div>
    </Shell>
  );
}
