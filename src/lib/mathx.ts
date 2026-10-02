export function roundTo(n: number, d = 2): number {
  const f = 10 ** d;
  return Math.round((n + Number.EPSILON) * f) / f;
}

export function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return "—";
  const r = roundTo(n, d);
  if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
  return r.toFixed(d).replace(/0+$/, "").replace(/\.$/, "");
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

export function problem(
  prompt: string,
  given: string,
  value: number,
  hint: string,
  steps: string[],
  tol?: number,
): Problem {
  return {
    prompt,
    given,
    answer: fmt(value),
    value,
    hint,
    steps,
    tol,
  };
}

export function checkAnswer(p: Problem, raw: string): boolean {
  const t = raw.trim().toLowerCase().replace(/,/g, ".").replace(/\s+/g, "");
  if (!t) return false;
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  let n: number | null = null;
  if (frac && Number(frac[2]) !== 0) n = Number(frac[1]) / Number(frac[2]);
  else {
    const m = t.match(/-?\d+(?:\.\d+)?/);
    if (m) n = Number(m[0]);
  }
  if (n === null || !Number.isFinite(n)) return false;
  const tol = p.tol ?? Math.max(0.03, Math.abs(p.value) * 0.02);
  return Math.abs(n - p.value) <= tol;
}
