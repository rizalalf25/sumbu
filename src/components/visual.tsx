import { useEffect, useState } from "react";
import { idn } from "@/lib/mathx";
import type { VisualKind } from "@/lib/topics";
import { isSceneKind, LabView } from "./lab-view";
import { ExtraWidget } from "./visual-extra";
import { Big, color, Plot, Range, Sketch } from "./visual-kit";

function PercentPlay() {
  const [price, setPrice] = useState(200);
  const [off, setOff] = useState(30);
  const pay = price * (1 - off / 100);
  return (
    <div className="grid gap-4">
      <Big label="Yang dibayar" value={pay.toFixed(0)} unit="ribu, jika harga dalam ribu" />
      <Range label="Harga awal" value={price} min={50} max={500} step={10} onChange={setPrice} />
      <Range label="Diskon %" value={off} min={0} max={80} step={5} onChange={setOff} />
    </div>
  );
}

function EquationPlay() {
  const [x, setX] = useState(1);
  const left = 3 * x + 2;
  const goal = 14;
  const ok = Math.abs(left - goal) < 0.05;
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">Geser x sampai dua ruas sama: 3x + 2 = 14.</p>
      <div className="grid grid-cols-2 gap-3">
        <Big label="Ruas kiri" value={left.toFixed(0)} />
        <Big label="Ruas kanan" value="14" />
      </div>
      <Range label="Nilai x" value={x} min={-2} max={8} step={1} onChange={setX} />
      <p className="text-sm">{ok ? "Sama. x = 4. Cek: 3×4 + 2 = 14." : "Belum sama. Operasi yang sama harus berlaku di kedua ruas."}</p>
    </div>
  );
}

function LinePlay() {
  const [m, setM] = useState(2);
  const [c, setC] = useState(1);
  const data = Array.from({ length: 13 }, (_, i) => {
    const x = i - 6;
    return { x, y: m * x + c };
  });
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label="f(3)" value={(m * 3 + c).toFixed(0)} />
      <Range label="Gradien m" value={m} min={-3} max={4} step={1} onChange={setM} />
      <Range label="Titik potong c" value={c} min={-4} max={6} step={1} onChange={setC} />
    </div>
  );
}

function ExpPlay() {
  const [t, setT] = useState(4);
  const data = Array.from({ length: 9 }, (_, i) => ({ x: i, y: 100 * 2 ** i }));
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label={`Jumlah setelah ${t} jam, awal 100`} value={String(100 * 2 ** t)} />
      <Range label="Jam" value={t} min={0} max={8} step={1} onChange={setT} />
      <p className="text-sm text-muted">Tiap jam kali 2, bukan tambah 2. Grafik meninggalkan garis lurus.</p>
    </div>
  );
}

function UnitPlay() {
  const [deg, setDeg] = useState(40);
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const ink = color("--color-ink", "#e7f6ff");
    const copper = color("--color-copper", "#3df0c2");
    const line = color("--color-line", "#243044");
    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.38;
    const cy = h * 0.62;
    const r = Math.min(w, h) * 0.32;
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - r - 8, cy);
    ctx.lineTo(cx + r + 16, cy);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - r - 12);
    ctx.stroke();
    const rad = (deg * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy - r * Math.sin(rad);
    ctx.strokeStyle = copper;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = copper;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = "14px sans-serif";
    ctx.fillText(idn(`sin ${deg}° = ${Math.sin(rad).toFixed(3)}`), w * 0.62, 36);
    ctx.fillText(idn(`cos ${deg}° = ${Math.cos(rad).toFixed(3)}`), w * 0.62, 58);
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <Range label="Sudut" value={deg} min={0} max={90} step={1} onChange={setDeg} />
    </div>
  );
}

function AreaPlay() {
  const [w, setW] = useState(8);
  const [h, setH] = useState(5);
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Big label="Luas" value={String(w * h)} unit="satuan²" />
        <Big label="Keliling" value={String(2 * (w + h))} unit="satuan" />
      </div>
      <Range label="Panjang" value={w} min={2} max={12} step={1} onChange={setW} />
      <Range label="Lebar" value={h} min={2} max={10} step={1} onChange={setH} />
      <p className="text-sm text-muted">Luas membesar kalau salah satu sisi bertambah. Keliling juga, tetapi rumusnya lain.</p>
    </div>
  );
}

function SequencePlay() {
  const [d, setD] = useState(3);
  const data = Array.from({ length: 8 }, (_, i) => ({ x: i + 1, y: 4 + i * d }));
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label="Suku ke-8" value={String(4 + 7 * d)} />
      <Range label="Beda" value={d} min={-2} max={6} step={1} onChange={setD} />
    </div>
  );
}

function LimitPlay() {
  const [x, setX] = useState(2.4);
  const data = [-2, -1, 0, 0.5, 1.5, 2, 3, 4].map((px) => ({ x: px, y: px + 1 }));
  const y = x === 1 ? NaN : (x * x - 1) / (x - 1);
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label={`(x²−1)/(x−1) di x=${x.toFixed(2)}`} value={Number.isFinite(y) ? y.toFixed(2) : "—"} />
      <Range label="x, mendekati 1" value={x} min={0} max={2} step={0.05} onChange={setX} />
      <p className="text-sm text-muted">Di x=1 rumus mentah 0/0. Setelah difaktorkan, nilainya menuju 2.</p>
    </div>
  );
}

function TangentPlay() {
  const [a, setA] = useState(1);
  const data = Array.from({ length: 21 }, (_, i) => {
    const x = (i - 10) / 2;
    return { x, y: x * x, z: a * a + 2 * a * (x - a) };
  });
  return (
    <div className="grid gap-3">
      <Plot data={data} y2 />
      <Big label={`Kemiringan di x=${a.toFixed(1)}`} value={(2 * a).toFixed(1)} />
      <Range label="Titik singgung" value={a} min={-2} max={2} step={0.1} onChange={setA} />
      <p className="text-sm text-muted">Garis neon adalah y=x². Garis terang adalah singgung. Kemiringannya 2x.</p>
    </div>
  );
}

function IntegralPlay() {
  const [b, setB] = useState(3);
  const data = Array.from({ length: 21 }, (_, i) => {
    const x = i / 4;
    return { x, y: x };
  });
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label={`Luas di bawah y=x dari 0 sampai ${b}`} value={(b * b / 2).toFixed(1)} />
      <Range label="Batas atas" value={b} min={1} max={5} step={1} onChange={setB} />
    </div>
  );
}

function DicePlay() {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const total = counts.reduce((s, n) => s + n, 0);
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-6 gap-2">
        {counts.map((n, i) => (
          <div key={i} className="card p-2 text-center">
            <p className="font-display text-2xl tabular-nums">{i + 1}</p>
            <p className="text-sm tabular-nums text-muted">{n}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn"
        onClick={() => {
          const next = [0, 0, 0, 0, 0, 0];
          for (let i = 0; i < 60; i++) next[Math.floor(Math.random() * 6)] += 1;
          setCounts(next);
        }}
      >
        Lempar 60 kali
      </button>
      <p className="text-sm text-muted">
        {total === 0
          ? "Teori: tiap muka dekat 10 dari 60. Simpan dulu tebakanmu, baru lempar."
          : "Frekuensi tidak harus persis 10. Makin banyak lemparan, biasanya makin dekat."}
      </p>
    </div>
  );
}

function UnitsPlay() {
  const [v, setV] = useState(72);
  return (
    <div className="grid gap-3">
      <Big label="Dalam m/s" value={(v / 3.6).toFixed(1)} />
      <Range label="Kecepatan km/jam" value={v} min={0} max={144} step={3.6} onChange={setV} />
      <p className="text-sm text-muted">Bagi 3,6. 36 km/jam = 10 m/s. Kebalikannya kali 3,6.</p>
    </div>
  );
}

function MotionPlay() {
  const [a, setA] = useState(2);
  const [t, setT] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => setT((v) => (v > 4 ? 0 : v + 0.05)), 40);
    return () => window.clearInterval(id);
  }, []);
  const s = 0.5 * a * t * t;
  return (
    <div className="grid gap-3">
      <div className="relative h-16 overflow-hidden rounded-2xl border border-line bg-soft">
        <div className="absolute top-4 h-8 w-8 rounded-full bg-copper" style={{ left: `calc(${Math.min(92, s * 4)}% )` }} />
      </div>
      <Big label="Jarak dari diam" value={s.toFixed(1)} unit="m" />
      <Range label="Percepatan" value={a} min={0} max={4} step={0.5} onChange={setA} />
      <p className="text-sm text-muted">s = ½ a t². Jejak makin renggang karena kecepatan bertambah.</p>
    </div>
  );
}

function ForcesPlay() {
  const [pull, setPull] = useState(30);
  const friction = 16;
  const mass = 4;
  const a = (pull - friction) / mass;
  return (
    <div className="grid gap-3">
      <Big label="Percepatan" value={a.toFixed(1)} unit="m/s²" />
      <Range label="Tarikan (N)" value={pull} min={0} max={40} step={1} onChange={setPull} />
      <p className="text-sm text-muted">Massa 4 kg, gesek 16 N. a = (tarikan − gesek) / massa. Di bawah 16 N, model ini negatif: berarti tidak cukup untuk bergerak searah tarikan.</p>
    </div>
  );
}

function EnergyPlay() {
  const [h, setH] = useState(5);
  const v = Math.sqrt(2 * 10 * h);
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Big label="Potensial di puncak, m=1" value={String(10 * h)} unit="J" />
        <Big label="Kelajuan di dasar" value={v.toFixed(1)} unit="m/s" />
      </div>
      <Range label="Tinggi (m)" value={h} min={0} max={10} step={0.5} onChange={setH} />
      <p className="text-sm text-muted">g = 10, gesekan nol. Energi berpindah, tidak hilang.</p>
    </div>
  );
}

function CollisionPlay() {
  const [m2, setM2] = useState(2);
  const v = 6 / (2 + m2);
  return (
    <div className="grid gap-3">
      <Big label="Kecepatan bersama" value={v.toFixed(2)} unit="m/s" />
      <Range label="Massa yang diam (kg)" value={m2} min={1} max={6} step={1} onChange={setM2} />
      <p className="text-sm text-muted">Massa 2 kg pada 3 m/s menumbuk dan menempel. Momentum awal 6. Makin berat yang diam, hasilnya makin pelan.</p>
    </div>
  );
}

function FluidPlay() {
  const [h, setH] = useState(3);
  return (
    <div className="grid gap-3">
      <Big label="Tekanan gauge" value={String(10 * h)} unit="kPa" />
      <Range label="Kedalaman air (m)" value={h} min={0} max={12} step={1} onChange={setH} />
      <p className="text-sm text-muted">ρ = 1000, g = 10, jadi P(kPa) = 10 × kedalaman. Linear, bukan kuadrat.</p>
    </div>
  );
}

function CircuitPlay() {
  const [series, setSeries] = useState(true);
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(6);
  const r = series ? r1 + r2 : (r1 * r2) / (r1 + r2);
  return (
    <div className="grid gap-3">
      <Big label={series ? "Seri" : "Paralel"} value={r.toFixed(2)} unit="Ω" />
      <div className="flex gap-2">
        <button type="button" className={series ? "btn" : "btn-ghost"} onClick={() => setSeries(true)}>
          Seri
        </button>
        <button type="button" className={!series ? "btn" : "btn-ghost"} onClick={() => setSeries(false)}>
          Paralel
        </button>
      </div>
      <Range label="R1" value={r1} min={1} max={12} step={1} onChange={setR1} />
      <Range label="R2" value={r2} min={1} max={12} step={1} onChange={setR2} />
    </div>
  );
}

function LensPlay() {
  const [s, setS] = useState(30);
  const f = 10;
  const inv = 1 / f - 1 / s;
  const sp = inv > 0.0001 ? 1 / inv : Infinity;
  return (
    <div className="grid gap-3">
      <Big label="Jarak bayangan" value={Number.isFinite(sp) ? sp.toFixed(1) : "∞"} unit="cm" />
      <Range label="Jarak benda (cm), f = 10" value={s} min={11} max={80} step={1} onChange={setS} />
      <p className="text-sm text-muted">Makin jauh benda, bayangan mendekati fokus 10 cm.</p>
    </div>
  );
}

function PhotonPlay() {
  const [lam, setLam] = useState(500);
  const e = 1240 / lam;
  const phi = 2;
  return (
    <div className="grid gap-3">
      <Big label="Energi foton" value={e.toFixed(2)} unit="eV" />
      <Range label="Panjang gelombang (nm)" value={lam} min={300} max={800} step={10} onChange={setLam} />
      <p className="text-sm text-muted">
        Fungsi kerja 2 eV. {e > phi ? `Elektron lepas, K maks ≈ ${idn((e - phi).toFixed(2))} eV.` : "Belum cukup untuk melepas elektron."}
      </p>
    </div>
  );
}

function ArgandPlay() {
  const [x, setX] = useState(3);
  const [y, setY] = useState(4);
  const mod = Math.hypot(x, y);
  const arg = (Math.atan2(y, x) * 180) / Math.PI;
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Big label="Modulus" value={mod.toFixed(2)} />
        <Big label="Argumen" value={arg.toFixed(0)} unit="°" />
      </div>
      <Range label="Real" value={x} min={-5} max={5} step={1} onChange={setX} />
      <Range label="Imajiner" value={y} min={-5} max={5} step={1} onChange={setY} />
    </div>
  );
}

function SeriesPlay() {
  const [n, setN] = useState(4);
  const data = Array.from({ length: 8 }, (_, i) => {
    const k = i + 1;
    const sum = 4 * (1 - 0.5 ** k) / 0.5;
    return { x: k, y: k <= n ? sum : sum };
  }).slice(0, n);
  const sum = 4 * (1 - 0.5 ** n) / 0.5;
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label={`${n} suku, a=4, r=1/2`} value={sum.toFixed(2)} />
      <Range label="Banyak suku" value={n} min={1} max={8} step={1} onChange={setN} />
      <p className="text-sm text-muted">Jumlah menuju 8, yaitu 4 / (1−1/2), tidak melewatinya.</p>
    </div>
  );
}

function FourierPlay() {
  const [n, setN] = useState(3);
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const ink = color("--color-ink", "#e7f6ff");
    const copper = color("--color-copper", "#3df0c2");
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = copper;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const x = -Math.PI + (2 * Math.PI * i) / 120;
      let y = 0;
      for (let k = 1; k <= n; k++) y += ((2 * (-1) ** (k + 1)) / k) * Math.sin(k * x);
      const px = (i / 120) * (w - 16) + 8;
      const py = h / 2 - y * (h * 0.12);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(8, h * 0.2);
    ctx.lineTo(w - 8, h * 0.8);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <Range label="Banyak suku sinus" value={n} min={1} max={12} step={1} onChange={setN} />
      <p className="text-sm text-muted">Garis pucat adalah f(x)=x. Makin banyak suku, gigi gergaji makin mengikuti, dengan riak di dekat ujung.</p>
    </div>
  );
}

function LaplacePlay() {
  const [a, setA] = useState(1);
  const data = Array.from({ length: 20 }, (_, i) => ({ x: i / 2, y: Math.exp(-a * (i / 2)) }));
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label={`L{e^{−${a}t}} di s=3`} value={(1 / (3 + a)).toFixed(2)} />
      <Range label="a pada peluruhan" value={a} min={0} max={3} step={0.5} onChange={setA} />
      <p className="text-sm text-muted">Kurva waktu adalah eksponen yang meluruh. Nilai transformnya 1 dibagi (s + a).</p>
    </div>
  );
}

function OdePlay() {
  const [k, setK] = useState(-0.5);
  const data = Array.from({ length: 16 }, (_, i) => ({ x: i, y: 80 * Math.exp(k * i) }));
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label="y(4), awal 80" value={(80 * Math.exp(k * 4)).toFixed(1)} />
      <Range label="k pada y' = k y" value={k} min={-1} max={0.4} step={0.1} onChange={setK} />
      <p className="text-sm text-muted">k negatif meluruh. k positif tumbuh. Syarat awal memilih tinggi awal, bukan bentuknya.</p>
    </div>
  );
}

function VariationPlay() {
  const straight = 10;
  const [bow, setBow] = useState(2);
  const curve = Math.hypot(3, bow) + Math.hypot(3, 4 - bow) > 0
    ? Math.hypot(5, bow) + Math.hypot(5, bow)
    : straight;
  const length = 2 * Math.hypot(5, bow);
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Big label="Garis lurus (6,8)" value="10" />
        <Big label="Lewat simpangan" value={length.toFixed(2)} />
      </div>
      <Range label="Seberapa melengkung" value={bow} min={0} max={6} step={0.5} onChange={setBow} />
      <p className="text-sm text-muted">Di bidang datar, garis lurus paling pendek. Lengkung selalu lebih panjang. {curve > 0 ? "" : ""}</p>
    </div>
  );
}

function NewtonPlay() {
  const [x0, setX0] = useState(1);
  const fx = x0 * x0 - 2;
  const x1 = x0 - fx / (2 * x0 || 1);
  return (
    <div className="grid gap-3">
      <Big label="x1" value={x1.toFixed(3)} />
      <Range label="Tebakan x0 untuk x²−2" value={x0} min={0.5} max={4} step={0.1} onChange={setX0} />
      <p className="text-sm text-muted">Garis singgung di x0 memotong sumbu di x1. Akar yang dicari dekat 1,414.</p>
    </div>
  );
}

function LegendrePlay() {
  const [x, setX] = useState(0.4);
  const p2 = (3 * x * x - 1) / 2;
  const data = Array.from({ length: 21 }, (_, i) => {
    const px = -1 + i / 10;
    return { x: Number(px.toFixed(2)), y: (3 * px * px - 1) / 2 };
  });
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label={`P2(${x.toFixed(1)})`} value={p2.toFixed(2)} />
      <Range label="x" value={x} min={-1} max={1} step={0.1} onChange={setX} />
    </div>
  );
}

function PoissonPlay() {
  const [lam, setLam] = useState(2);
  const items = Array.from({ length: 8 }, (_, k) => {
    let p = Math.exp(-lam);
    for (let i = 1; i <= k; i++) p *= lam / i;
    return { k, p };
  });
  const max = Math.max(...items.map((item) => item.p));
  return (
    <div className="grid gap-3">
      <div className="flex h-36 items-end gap-1">
        {items.map((item) => (
          <div key={item.k} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full rounded-t-md bg-copper" style={{ height: `${(item.p / max) * 100}%` }} />
            <span className="text-xs text-muted">{item.k}</span>
          </div>
        ))}
      </div>
      <Range label="λ rata-rata kejadian" value={lam} min={0.5} max={5} step={0.5} onChange={setLam} />
      <p className="text-sm text-muted">Peluang tidak ada kejadian ≈ {idn(Math.exp(-lam).toFixed(2))}. Batang adalah peluang tiap cacahan.</p>
    </div>
  );
}

function Widget({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "percent":
      return <PercentPlay />;
    case "equation":
      return <EquationPlay />;
    case "lineplot":
      return <LinePlay />;
    case "expplot":
      return <ExpPlay />;
    case "unitcircle":
      return <UnitPlay />;
    case "area":
      return <AreaPlay />;
    case "sequence":
      return <SequencePlay />;
    case "limitplot":
      return <LimitPlay />;
    case "tangent":
      return <TangentPlay />;
    case "integral":
      return <IntegralPlay />;
    case "dice":
      return <DicePlay />;
    case "units":
      return <UnitsPlay />;
    case "motion1d":
      return <MotionPlay />;
    case "forces":
      return <ForcesPlay />;
    case "energy":
      return <EnergyPlay />;
    case "collision":
      return <CollisionPlay />;
    case "fluid":
      return <FluidPlay />;
    case "circuit":
      return <CircuitPlay />;
    case "lens":
      return <LensPlay />;
    case "photon":
      return <PhotonPlay />;
    case "argand":
      return <ArgandPlay />;
    case "series":
      return <SeriesPlay />;
    case "fourier":
      return <FourierPlay />;
    case "laplace":
      return <LaplacePlay />;
    case "ode":
      return <OdePlay />;
    case "variation":
      return <VariationPlay />;
    case "newtonplot":
      return <NewtonPlay />;
    case "legendre":
      return <LegendrePlay />;
    case "poisson":
      return <PoissonPlay />;
    default:
      return <ExtraWidget kind={kind} />;
  }
}

export function TopicVisual({ kind }: { kind: VisualKind }) {
  if (isSceneKind(kind)) return <LabView kind={kind} />;
  return (
    <div className="card grid gap-4 p-4 md:p-5">
      <Widget kind={kind} />
      <p className="text-sm">Ubah satu penggeser. Ucapkan satu kalimat: apa yang berubah, apa yang tidak.</p>
    </div>
  );
}
