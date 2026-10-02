export function roundTo(n: number, d = 2): number {
  const f = 10 ** d;
  return Math.round((n + Number.EPSILON) * f) / f;
}

export function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return "—";
  const r = roundTo(n, d);
  if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
  return r.toFixed(d).replace(/0+$/, "").replace(/\.$/, "").replace(".", ",");
}

/** Ganti titik desimal menjadi koma untuk teks tampilan (0.5 → 0,5). */
export function idn(text: string): string {
  return text.replace(/(\d)\.(\d)/g, "$1,$2");
}

export function hash(seed: number, salt: number): number {
  let x = (Math.imul(seed | 0, 0x9e3779b1) ^ Math.imul(salt | 0, 0x85ebca6b)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  return (x ^ (x >>> 16)) >>> 0;
}

export function take<T>(seed: number, salt: number, arr: readonly T[]): T {
  return arr[hash(seed, salt) % arr.length] as T;
}

export type Level = 1 | 2 | 3;

export type Problem = {
  prompt: string;
  given: string;
  answer: string;
  value: number;
  tol?: number;
  hint: string;
  steps: string[];
};

function answerDigits(value: number, tol?: number): number {
  if ((value !== 0 && Math.abs(value) < 0.1) || (tol !== undefined && tol < 0.001)) return 4;
  if (tol !== undefined && tol <= 0.005) return 3;
  return 2;
}

export function problem(
  prompt: string,
  given: string,
  value: number,
  hint: string,
  steps: string[],
  tol?: number,
): Problem {
  return {
    prompt: idn(prompt),
    given: idn(given),
    answer: fmt(value, answerDigits(value, tol)),
    value,
    hint: idn(hint),
    steps: steps.map(idn),
    tol,
  };
}

/**
 * Semua tafsiran angka yang masuk akal dari ketikan pengguna.
 * "3.200" bisa berarti tiga ribu dua ratus (gaya Indonesia) atau 3,2 (gaya Inggris),
 * jadi keduanya dikembalikan; "0,5" dan "0.5" sama-sama 0,5; "1/2" menjadi 0,5.
 */
export function readNumbers(raw: string): number[] {
  const t = raw
    .trim()
    .toLowerCase()
    .replace(/[−–]/g, "-")
    .replace(/rp\.?/g, "")
    .replace(/\s+/g, "");
  if (!t) return [];
  const frac = t.match(/^(-?[\d.,]+)\/(-?[\d.,]+)$/);
  if (frac) {
    const out: number[] = [];
    for (const a of readNumbers(frac[1])) for (const b of readNumbers(frac[2])) if (b !== 0) out.push(a / b);
    return out;
  }
  const token = t.match(/-?\d[\d.,]*/);
  if (!token) return [];
  const raw0 = token[0].replace(/[.,]$/, "");
  const out = new Set<number>();
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(raw0)) out.add(Number(raw0.replace(/\./g, "").replace(",", ".")));
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(raw0)) out.add(Number(raw0.replace(/,/g, "")));
  if (/^-?\d+([.,]\d+)?$/.test(raw0)) out.add(Number(raw0.replace(",", ".")));
  return [...out].filter((n) => Number.isFinite(n));
}

export function tolerance(p: Problem): number {
  if (p.tol !== undefined) return p.tol;
  if (Number.isInteger(p.value)) return 0.001;
  return Math.max(0.01, Math.abs(p.value) * 0.01);
}

export function checkAnswer(p: Problem, raw: string): boolean {
  const tol = tolerance(p);
  return readNumbers(raw).some((n) => Math.abs(n - p.value) <= tol);
}
