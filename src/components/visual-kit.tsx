import { useEffect, useRef } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { idn } from "@/lib/mathx";

export function Big({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <p className="text-sm text-muted">{idn(label)}</p>
      <p className="font-display text-4xl tabular-nums">
        {idn(value)} {unit ? <span className="text-lg text-muted">{unit}</span> : null}
      </p>
    </div>
  );
}

export function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="flex justify-between gap-3">
        <span>{label}</span>
        <span className="font-mono tabular-nums">{Number.isInteger(step) ? value : idn(value.toFixed(step < 0.1 ? 2 : 1))}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function Plot({
  data,
  y2 = false,
  numeric = false,
}: {
  data: { x: number; y: number; z?: number }[];
  y2?: boolean;
  /** Sumbu x numerik dengan tik bulat, untuk data yang rapat (bukan satu titik per label). */
  numeric?: boolean;
}) {
  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="x"
            stroke="var(--color-muted)"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => idn(String(v))}
            {...(numeric ? { type: "number" as const, domain: ["dataMin", "dataMax"], tickCount: 6, allowDecimals: true } : {})}
          />
          <YAxis stroke="var(--color-muted)" width={36} tick={{ fontSize: 12 }} tickFormatter={(v) => idn(String(v))} />
          <Line type="monotone" dataKey="y" stroke="var(--color-copper)" dot={false} strokeWidth={2} isAnimationActive={false} />
          {y2 ? (
            <Line type="monotone" dataKey="z" stroke="var(--color-ink)" dot={false} strokeWidth={2} isAnimationActive={false} />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function color(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function Sketch({
  draw,
}: {
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRef.current(ctx, w, h);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);
  return <canvas ref={ref} className="h-56 w-full" />;
}

