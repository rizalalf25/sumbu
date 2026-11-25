import type { LpdpQuestion } from "@/lib/lpdp";
import { solutionSteps } from "@/lib/lpdp-learning";

export function LpdpSolution({ q }: { q: LpdpQuestion }) {
  return (
    <section className="mt-4 border-t border-line pt-4" aria-label="Cara pengerjaan">
      <h3 className="text-xl">Cara pengerjaan</h3>
      <ol className="mt-3 grid gap-3">
        {solutionSteps(q).map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 font-mono text-copper">{i + 1}.</span>
            <p className="min-w-0 text-sm leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
