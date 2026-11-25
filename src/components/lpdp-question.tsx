import type { LpdpQuestion } from "@/lib/lpdp";
import { LpdpSolution } from "./lpdp-solution";

const LETTER = ["A", "B", "C", "D"];

/** Satu soal pilihan ganda. Dalam mode simulasi (reveal = false) tidak ada umpan balik. */
export function QuestionCard({
  q,
  number,
  pick,
  onPick,
  reveal,
}: {
  q: LpdpQuestion;
  number?: number;
  pick: number | null;
  onPick: (index: number) => void;
  reveal: boolean;
}) {
  const answered = pick !== null;
  return (
    <article className="card p-5">
      {q.passage ? (
        <div className="mb-4 max-h-80 overflow-y-auto border-l-2 border-copper pl-4 text-sm leading-relaxed whitespace-pre-line">
          {q.passage}
        </div>
      ) : null}
      <p className="text-lg">
        {number ? <span className="mr-2 font-mono text-sm text-copper">{number}.</span> : null}
        {q.q}
      </p>
      <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Pilihan jawaban">
        {q.options.map((option, i) => {
          const isPick = pick === i;
          const isAnswer = i === q.answer;
          let tone = isPick ? "btn border-copper" : "btn-ghost";
          if (reveal && answered)
            tone = isAnswer ? "btn" : isPick ? "btn-ghost border-signal" : "btn-ghost opacity-60";
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isPick}
              disabled={reveal && answered}
              className={`${tone} justify-start gap-3 text-left`}
              onClick={() => onPick(i)}
            >
              <span className="font-mono text-sm">{LETTER[i]}</span>
              <span className="font-sans font-medium normal-case tracking-normal">{option}</span>
            </button>
          );
        })}
      </div>
      {reveal && answered ? (
        <div className="mt-4">
          <p className={`font-semibold ${pick === q.answer ? "text-copper" : "text-signal"}`}>
            {pick === q.answer ? "Benar." : `Belum tepat. Jawaban: ${LETTER[q.answer]}.`}
          </p>
          <LpdpSolution q={q} />
        </div>
      ) : null}
    </article>
  );
}

export { LETTER };
