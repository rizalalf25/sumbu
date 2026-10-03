import { useState } from "react";
import { GROUP_LABEL, kitAsText, kitTotal, rupiahRange, type Kit, type PartGroup } from "@/lib/kits";

const ORDER: PartGroup[] = ["inti", "habis", "alat", "opsional"];

export function ShoppingList({
  title,
  kit,
  owned,
  onToggle,
}: {
  title: string;
  kit: Kit;
  owned: Set<number>;
  onToggle: (index: number) => void;
}) {
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const total = kitTotal(kit, ["inti", "habis", "alat"]);
  const tools = kitTotal(kit, ["alat"]);
  const extra = kitTotal(kit, ["opsional"]);
  const left = kitTotal(kit, ["inti", "habis", "alat"], owned);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(kitAsText(title, kit, owned));
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied(""), 2000);
  };

  return (
    <section id="belanja" className="fase mt-8">
      <h2 className="text-3xl">Daftar belanja</h2>
      <p className="mt-2 max-w-2xl text-muted">{kit.summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-sm text-muted">Total tanpa opsional</p>
          <p className="mt-1 font-display text-2xl tabular-nums">{rupiahRange(total)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Sisa yang perlu dibeli, setelah dicentang yang sudah punya</p>
          <p className="mt-1 font-display text-2xl tabular-nums text-copper">{rupiahRange(left)}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted">
        {tools[1] > 0 ? `Termasuk alat kerja ${rupiahRange(tools)} yang dipakai ulang di proyek lain. ` : ""}
        {extra[1] > 0 ? `Opsional ${rupiahRange(extra)}. ` : ""}
        Harga perkiraan pasar Indonesia per satuan; cek ulang di toko.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-ghost" onClick={copy}>
          Salin daftar belanja
        </button>
        {copied === "ok" ? <span className="text-sm text-copper">Tersalin. Tempel di catatan atau chat ke toko.</span> : null}
        {copied === "fail" ? <span className="text-sm">Peramban menolak menyalin. Pilih teks secara manual.</span> : null}
      </div>

      {ORDER.map((group) => {
        const rows = kit.parts.map((part, index) => ({ part, index })).filter(({ part }) => part.group === group);
        if (!rows.length) return null;
        return (
          <div key={group} className="mt-6">
            <h3 className="text-xl">{GROUP_LABEL[group].title}</h3>
            <p className="text-sm text-muted">{GROUP_LABEL[group].note}</p>
            <ul className="card mt-3 divide-y divide-line">
              {rows.map(({ part, index }) => {
                const has = owned.has(index);
                return (
                  <li key={`${part.item}-${index}`} className="flex items-start gap-3 px-4 py-3">
                    <input
                      type="checkbox"
                      className="mt-1.5 h-5 w-5 shrink-0 accent-[var(--color-copper)]"
                      checked={has}
                      onChange={() => onToggle(index)}
                      aria-label={`Sudah punya: ${part.item}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium ${has ? "text-muted line-through" : ""}`}>
                        {part.qty > 1 ? <span className="mr-1 font-mono text-copper">{part.qty}×</span> : null}
                        {part.item}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">{part.spec}</p>
                      <p className="mt-1 text-sm tabular-nums sm:hidden">
                        {rupiahRange(part.price)}
                        {part.qty > 1 ? <span className="text-muted"> / satuan · total {rupiahRange([part.price[0] * part.qty, part.price[1] * part.qty])}</span> : null}
                      </p>
                      {part.note ? <p className="mt-1 text-sm">{part.note}</p> : null}
                    </div>
                    <div className="hidden shrink-0 text-right text-sm tabular-nums sm:block">
                      <p>{rupiahRange(part.price)}</p>
                      {part.qty > 1 ? <p className="text-xs text-muted">total {rupiahRange([part.price[0] * part.qty, part.price[1] * part.qty])}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <article className="card mt-6 p-5">
        <h3 className="text-xl">Saran belanja</h3>
        <ul className="mt-3 grid gap-2 text-sm">
          {kit.tips.map((tip) => (
            <li key={tip} className="flex gap-3">
              <span className="text-copper" aria-hidden="true">
                ›
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export function BuildGuide({ kit, done, onToggle }: { kit: Kit; done: Set<number>; onToggle: (index: number) => void }) {
  return (
    <section id="rakit" className="fase mt-10">
      <h2 className="text-3xl">Panduan rakit</h2>
      <p className="mt-2 text-sm text-muted">
        {done.size}/{kit.build.length} langkah selesai. Kerjakan berurutan; centang setelah benar-benar diuji.
      </p>
      <ol className="card rail mt-4 overflow-hidden">
        {kit.build.map((step, i) => {
          const checked = done.has(i);
          return (
            <li key={step.t} className="flex items-start gap-4 px-4 py-4">
              <input
                type="checkbox"
                className="mt-1.5 h-5 w-5 shrink-0 accent-[var(--color-copper)]"
                checked={checked}
                onChange={() => onToggle(i)}
                aria-label={`Langkah rakit ${i + 1}: ${step.t}`}
              />
              <div className="min-w-0 flex-1">
                <p className={`font-medium ${checked ? "text-muted line-through" : ""}`}>
                  <span className="mr-2 font-mono text-sm text-copper">{String(i + 1).padStart(2, "0")}</span>
                  {step.t}
                </p>
                <p className="mt-1 text-sm text-muted">{step.d}</p>
                {step.warn ? (
                  <p className="mt-2 border-l-2 border-signal pl-3 text-sm">
                    <span className="font-semibold text-signal">Awas: </span>
                    {step.warn}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
