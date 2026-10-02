import { useEffect, useRef, useState } from "react";
import { idn } from "@/lib/mathx";
import type { SceneKind } from "./scenes";

type SliderSpec = { key: string; label: string; min: number; max: number; step: number };

const UI: Record<
  SceneKind,
  { title: string; sliders: SliderSpec[]; initial: Record<string, number>; caption: (p: Record<string, number>) => string }
> = {
  projectile: {
    title: "Lemparan",
    sliders: [
      { key: "speed", label: "Kelajuan (m/s)", min: 8, max: 40, step: 1 },
      { key: "angle", label: "Sudut (derajat)", min: 15, max: 75, step: 1 },
    ],
    initial: { speed: 20, angle: 45 },
    caption: (p) => {
      const g = 10;
      const rad = (p.angle * Math.PI) / 180;
      const vy = p.speed * Math.sin(rad);
      const vx = p.speed * Math.cos(rad);
      const t = (2 * vy) / g;
      const h = (vy * vy) / (2 * g);
      const r = vx * t;
      return `g = 10. Waktu di udara ${t.toFixed(2)} s, tinggi maks ${h.toFixed(1)} m, jarak ${r.toFixed(1)} m. Sudut dekat 45° membuat jarak paling jauh.`;
    },
  },
  pendulum: {
    title: "Bandul",
    sliders: [
      { key: "length", label: "Panjang (m)", min: 0.6, max: 2.8, step: 0.1 },
      { key: "amp", label: "Simpangan (derajat)", min: 5, max: 40, step: 1 },
    ],
    initial: { length: 1.6, amp: 22 },
    caption: (p) => {
      const t = 2 * 3.14 * Math.sqrt(p.length / 10);
      return `Periode kecil ≈ ${t.toFixed(2)} s. Massa tidak masuk. Memperpendek tali membuat ayunan lebih cepat. Simpangan di model ini tidak mengubah periode.`;
    },
  },
  wave: {
    title: "Gelombang",
    sliders: [
      { key: "amp", label: "Amplitudo", min: 0.2, max: 1.4, step: 0.05 },
      { key: "lambda", label: "Panjang gelombang", min: 0.8, max: 4, step: 0.1 },
      { key: "speed", label: "Cepat rambat", min: 0.4, max: 3, step: 0.1 },
    ],
    initial: { amp: 0.7, lambda: 2.4, speed: 1.2 },
    caption: (p) => {
      const f = p.speed / p.lambda;
      return `v = f λ, jadi frekuensi ≈ ${f.toFixed(2)} Hz. Mengubah amplitudo tidak mengubah cepat rambat.`;
    },
  },
  vector: {
    title: "Dua vektor",
    sliders: [
      { key: "ax", label: "A · x", min: -4, max: 4, step: 0.5 },
      { key: "ay", label: "A · y", min: -4, max: 4, step: 0.5 },
      { key: "bx", label: "B · x", min: -4, max: 4, step: 0.5 },
      { key: "by", label: "B · y", min: -4, max: 4, step: 0.5 },
    ],
    initial: { ax: 3, ay: 1, bx: -1, by: 2 },
    caption: (p) => {
      const rx = p.ax + p.bx;
      const ry = p.ay + p.by;
      const mag = Math.hypot(rx, ry);
      return `Resultan (${rx.toFixed(1)}, ${ry.toFixed(1)}), panjang ${mag.toFixed(2)}. Panah neon A, magenta B, pucat hasil jumlah.`;
    },
  },
  charges: {
    title: "Dua muatan",
    sliders: [
      { key: "q1", label: "Muatan kiri", min: -4, max: 4, step: 0.5 },
      { key: "q2", label: "Muatan kanan", min: -4, max: 4, step: 0.5 },
      { key: "sep", label: "Jarak", min: 1, max: 4, step: 0.1 },
    ],
    initial: { q1: 2, q2: -2, sep: 2.4 },
    caption: (p) =>
      p.q1 * p.q2 < 0
        ? "Muatan beda tanda saling tarik. Panah medan keluar dari positif dan masuk ke negatif."
        : "Muatan sejenis saling tolak. Jauhkan mereka: medan di tengah melemah dengan cepat.",
  },
  surface: {
    title: "Permukaan z = a x² + b z²",
    sliders: [
      { key: "a", label: "Lengkung x", min: -0.3, max: 0.3, step: 0.02 },
      { key: "b", label: "Lengkung z", min: -0.3, max: 0.3, step: 0.02 },
    ],
    initial: { a: 0.16, b: -0.1 },
    caption: (p) =>
      `∂z/∂x = ${(2 * p.a).toFixed(2)} x dan ∂z/∂z_koord = ${(2 * p.b).toFixed(2)} z. Tanda positif melengkung ke atas seperti lembah terbalik, negatif seperti bukit terbalik di arah itu.`,
  },
  field: {
    title: "Medan datar",
    sliders: [
      { key: "mode", label: "0 sumber · 1 pusaran", min: 0, max: 1, step: 1 },
      { key: "gain", label: "Kekuatan gambar", min: 0.6, max: 1.8, step: 0.1 },
    ],
    initial: { mode: 0, gain: 1 },
    caption: (p) =>
      p.mode >= 0.5
        ? "Mode pusaran: divergensi nol, curl tidak nol. Panah mengelilingi pusat."
        : "Mode sumber: panah menyebar. Divergensi positif, curl pada bidang ini nol.",
  },
};

/** Adegan yang bergerak terhadap waktu. Bawaannya diam; gerak dimulai dengan tombol. */
const MOVING = new Set<SceneKind>(["projectile", "pendulum", "wave"]);

export function LabView({ kind }: { kind: SceneKind }) {
  const cfg = UI[kind];
  const [values, setValues] = useState(cfg.initial);
  const latest = useRef(values);
  latest.current = values;
  const host = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState("Menyiapkan ruang visual…");
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const moves = MOVING.has(kind);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let dispose = () => {};
    let dead = false;
    import("./scenes")
      .then(({ mountScene }) => {
        if (dead) return;
        dispose = mountScene(el, kind, () => latest.current, () => playingRef.current);
        setNote("");
      })
      .catch(() => setNote("Gambar 3D tidak tersedia di perangkat ini. Rumus di bawah tetap berlaku."));
    return () => {
      dead = true;
      dispose();
    };
  }, [kind]);

  return (
    <div className="grid gap-4">
      <div className="lab-host card relative h-72 overflow-hidden md:h-96">
        <div ref={host} className="absolute inset-0" />
        {note ? <p className="absolute inset-x-4 bottom-4 text-sm text-muted">{note}</p> : null}
      </div>
      {moves ? (
        <button type="button" className="btn-ghost justify-self-start" aria-pressed={playing} onClick={() => setPlaying((v) => !v)}>
          {playing ? "Jeda gerak" : "Putar gerak"}
        </button>
      ) : null}
      <div className="grid gap-3">
        {cfg.sliders.map((slider) => (
          <label key={slider.key} className="grid gap-1 text-sm">
            <span className="flex items-center justify-between gap-3">
              <span>{slider.label}</span>
              <span className="font-mono tabular-nums text-ink">{idn(Number(values[slider.key] ?? 0).toFixed(slider.step < 1 ? 1 : 0))}</span>
            </span>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={values[slider.key]}
              onChange={(event) => setValues((prev) => ({ ...prev, [slider.key]: Number(event.target.value) }))}
            />
          </label>
        ))}
      </div>
      <p className="text-sm text-muted">{idn(cfg.caption(values))}</p>
      <p className="text-sm text-ink">Seret gambar untuk memutar pandangan. Ubah satu penggeser, lalu sebut apa yang berubah.</p>
    </div>
  );
}

export function isSceneKind(kind: string): kind is SceneKind {
  return kind in UI;
}
