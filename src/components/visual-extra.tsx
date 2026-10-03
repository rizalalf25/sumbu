import { useState } from "react";
import { idn } from "@/lib/mathx";
import type { VisualKind } from "@/lib/topics";
import { Big, color, Plot, Range, Sketch } from "./visual-kit";

type Paint = { ink: string; copper: string; line: string; signal: string; muted: string };

function palette(): Paint {
  return {
    ink: color("--color-ink", "#e7f6ff"),
    copper: color("--color-copper", "#3df0c2"),
    line: color("--color-line", "#243044"),
    signal: color("--color-signal", "#ff2d8a"),
    muted: color("--color-muted", "#8aa0b5"),
  };
}

/** Ubah koordinat dunia ke piksel kanvas untuk rentang x dan y tertentu. */
function frame(w: number, h: number, x0: number, x1: number, y0: number, y1: number, pad = 18) {
  return {
    px: (x: number) => pad + ((x - x0) / (x1 - x0)) * (w - 2 * pad),
    py: (y: number) => h - pad - ((y - y0) / (y1 - y0)) * (h - 2 * pad),
  };
}

function axes(ctx: CanvasRenderingContext2D, w: number, h: number, c: Paint, yZero?: number) {
  ctx.strokeStyle = c.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const y = yZero ?? h - 18;
  ctx.moveTo(18, y);
  ctx.lineTo(w - 18, y);
  ctx.moveTo(18, 18);
  ctx.lineTo(18, h - 18);
  ctx.stroke();
}

function f1(n: number) {
  return idn(n.toFixed(1));
}

function f2(n: number) {
  return idn(n.toFixed(2));
}

function DescentPlay() {
  const [eta, setEta] = useState(0.3);
  const [start, setStart] = useState(-3);
  const target = 2;
  const loss = (w: number) => (w - target) ** 2;
  const path = [start];
  for (let i = 0; i < 8; i++) {
    const w = path[path.length - 1];
    path.push(w - eta * 2 * (w - target));
  }
  const last = path[path.length - 1];
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const { px, py } = frame(w, h, -4, 8, 0, 40);
    axes(ctx, w, h, c);
    ctx.strokeStyle = c.copper;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -4; x <= 8; x += 0.1) {
      const y = Math.min(40, loss(x));
      if (x === -4) ctx.moveTo(px(x), py(y));
      else ctx.lineTo(px(x), py(y));
    }
    ctx.stroke();
    ctx.strokeStyle = c.signal;
    ctx.fillStyle = c.signal;
    ctx.beginPath();
    path.forEach((p, i) => {
      const cx = px(Math.max(-4, Math.min(8, p)));
      const cy = py(Math.min(40, loss(p)));
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.stroke();
    path.forEach((p) => {
      ctx.beginPath();
      ctx.arc(px(Math.max(-4, Math.min(8, p))), py(Math.min(40, loss(p))), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <div className="grid grid-cols-2 gap-3">
        <Big label="w setelah 8 langkah" value={f2(last)} />
        <Big label="Galat L(w)" value={f2(loss(last))} />
      </div>
      <Range label="Laju belajar η" value={eta} min={0.05} max={1.1} step={0.05} onChange={setEta} />
      <Range label="w awal" value={start} min={-4} max={8} step={1} onChange={setStart} />
      <p className="text-sm text-muted">
        L(w) = (w − 2)². {eta > 1 ? "η di atas 1: langkah melompati lembah dan galat membesar." : eta > 0.5 ? "Langkah melompat ke seberang, tetapi masih mengecil." : "Langkah pelan dan aman menuju lembah di w = 2."}
      </p>
    </div>
  );
}

function PvPlay() {
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const pv = 1000 / (1 + rate / 100) ** years;
  const data = Array.from({ length: 31 }, (_, t) => ({ x: t, y: Math.round(1000 / (1 + rate / 100) ** t) }));
  return (
    <div className="grid gap-3">
      <Plot data={data} />
      <Big label={`Nilai sekarang dari Rp1 juta yang diterima ${years} tahun lagi`} value={pv.toFixed(0)} unit="ribu" />
      <Range label="Bunga per tahun (%)" value={rate} min={0} max={20} step={1} onChange={setRate} />
      <Range label="Tahun" value={years} min={0} max={30} step={1} onChange={setYears} />
    </div>
  );
}

function NormalPlay() {
  const [mu, setMu] = useState(70);
  const [sd, setSd] = useState(10);
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const { px, py } = frame(w, h, 0, 140, 0, 0.085);
    axes(ctx, w, h, c);
    const pdf = (x: number) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));
    for (const [k, alpha] of [
      [2, "33"],
      [1, "66"],
    ] as const) {
      ctx.fillStyle = `${c.copper}${alpha}`;
      ctx.beginPath();
      ctx.moveTo(px(mu - k * sd), py(0));
      for (let x = mu - k * sd; x <= mu + k * sd; x += 0.5) ctx.lineTo(px(x), py(Math.min(0.085, pdf(x))));
      ctx.lineTo(px(mu + k * sd), py(0));
      ctx.fill();
    }
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= 140; x += 0.5) {
      const y = py(Math.min(0.085, pdf(x)));
      if (x === 0) ctx.moveTo(px(x), y);
      else ctx.lineTo(px(x), y);
    }
    ctx.stroke();
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <div className="grid grid-cols-2 gap-3">
        <Big label="68% data di" value={`${mu - sd}–${mu + sd}`} />
        <Big label="95% data di" value={`${mu - 2 * sd}–${mu + 2 * sd}`} />
      </div>
      <Range label="Rata-rata μ" value={mu} min={30} max={110} step={1} onChange={setMu} />
      <Range label="Simpangan baku σ" value={sd} min={3} max={25} step={1} onChange={setSd} />
    </div>
  );
}

function CiPlay() {
  const [n, setN] = useState(25);
  const [s, setS] = useState(20);
  const se = s / Math.sqrt(n);
  const mean = 100;
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const { px } = frame(w, h, 80, 120, 0, 1);
    const y = h / 2;
    ctx.strokeStyle = c.line;
    ctx.beginPath();
    ctx.moveTo(px(80), y);
    ctx.lineTo(px(120), y);
    ctx.stroke();
    ctx.strokeStyle = c.copper;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(px(Math.max(80, mean - 1.96 * se)), y);
    ctx.lineTo(px(Math.min(120, mean + 1.96 * se)), y);
    ctx.stroke();
    ctx.fillStyle = c.ink;
    ctx.beginPath();
    ctx.arc(px(mean), y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "13px sans-serif";
    ctx.fillStyle = c.muted;
    ctx.fillText("80", px(80) - 6, y + 28);
    ctx.fillText("100", px(100) - 10, y + 28);
    ctx.fillText("120", px(120) - 10, y + 28);
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <div className="grid grid-cols-2 gap-3">
        <Big label="Galat baku" value={f2(se)} />
        <Big label="Interval 95%" value={`${f1(mean - 1.96 * se)}–${f1(mean + 1.96 * se)}`} />
      </div>
      <Range label="Ukuran sampel n" value={n} min={4} max={400} step={1} onChange={setN} />
      <Range label="Simpangan baku s" value={s} min={5} max={40} step={1} onChange={setS} />
      <p className="text-sm text-muted">Empat kali n hanya membuat interval setengah lebar.</p>
    </div>
  );
}

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function ScatterPlay() {
  const [slope, setSlope] = useState(1.5);
  const [noise, setNoise] = useState(3);
  const pts = Array.from({ length: 24 }, (_, i) => {
    const x = (i / 23) * 10;
    const e = (rand(i + 1) + rand(i + 50) - 1) * 2 * noise;
    return { x, y: 5 + slope * x + e };
  });
  const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const sxy = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const sxx = pts.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  const syy = pts.reduce((s, p) => s + (p.y - my) ** 2, 0);
  const b = sxy / sxx;
  const a = my - b * mx;
  const r = syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const { px, py } = frame(w, h, 0, 10, -20, 45);
    axes(ctx, w, h, c);
    ctx.fillStyle = c.ink;
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(px(p.x), py(Math.max(-20, Math.min(45, p.y))), 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = c.copper;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px(0), py(a));
    ctx.lineTo(px(10), py(a + b * 10));
    ctx.stroke();
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <div className="grid grid-cols-3 gap-3">
        <Big label="Kemiringan b" value={f2(b)} />
        <Big label="Intersep a" value={f1(a)} />
        <Big label="Korelasi r" value={f2(r)} />
      </div>
      <Range label="Hubungan sebenarnya" value={slope} min={-3} max={3} step={0.5} onChange={setSlope} />
      <Range label="Noise" value={noise} min={0} max={12} step={1} onChange={setNoise} />
    </div>
  );
}

function BayesPlay() {
  const [prev, setPrev] = useState(1);
  const [sens, setSens] = useState(95);
  const [fp, setFp] = useState(5);
  const sick = 1000 * (prev / 100);
  const tp = sick * (sens / 100);
  const fpos = (1000 - sick) * (fp / 100);
  const ppv = tp / (tp + fpos);
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const cols = 50;
    const rows = 20;
    const cell = Math.min((w - 8) / cols, (h - 8) / rows);
    const sickCells = Math.round(sick);
    const tpCells = Math.round(tp);
    const fpCells = Math.round(fpos);
    for (let i = 0; i < 1000; i++) {
      const x = 4 + (i % cols) * cell;
      const y = 4 + Math.floor(i / cols) * cell;
      let fill = c.line;
      if (i < tpCells) fill = c.copper;
      else if (i < sickCells) fill = c.muted;
      else if (i < sickCells + fpCells) fill = c.signal;
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, cell - 1.5, cell - 1.5);
    }
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <p className="text-sm text-muted">1.000 orang. Hijau: sakit dan positif. Merah muda: sehat tetapi positif palsu.</p>
      <Big label="P(sakit | positif)" value={`${f1(ppv * 100)}%`} />
      <Range label="Prevalensi (%)" value={prev} min={0.5} max={50} step={0.5} onChange={setPrev} />
      <Range label="Sensitivitas (%)" value={sens} min={50} max={100} step={1} onChange={setSens} />
      <Range label="Positif palsu (%)" value={fp} min={1} max={30} step={1} onChange={setFp} />
    </div>
  );
}

function LogicPlay() {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);
  const rows: [string, boolean][] = [
    ["p DAN q", p && q],
    ["p ATAU q", p || q],
    ["p XOR q", p !== q],
    ["p ⇒ q", !p || q],
    ["TIDAK p", !p],
  ];
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={p ? "btn" : "btn-ghost"} aria-pressed={p} onClick={() => setP((v) => !v)}>
          p = {p ? "benar" : "salah"}
        </button>
        <button type="button" className={q ? "btn" : "btn-ghost"} aria-pressed={q} onClick={() => setQ((v) => !v)}>
          q = {q ? "benar" : "salah"}
        </button>
      </div>
      <ul className="grid gap-2">
        {rows.map(([label, val]) => (
          <li key={label} className="card flex items-center justify-between px-4 py-2">
            <span className="font-mono">{label}</span>
            <span className={val ? "font-semibold text-copper" : "text-muted"}>{val ? "1 (benar)" : "0 (salah)"}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">Implikasi hanya salah ketika p benar dan q salah. Coba kombinasi itu.</p>
    </div>
  );
}

function RotationPlay() {
  const [m, setM] = useState(150);
  const [v, setV] = useState(10);
  const [r, setR] = useState(20);
  const force = (m * v * v) / r;
  const grip = 0.7 * m * 10;
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const cx = w / 2;
    const cy = h / 2;
    const rad = Math.min(w, h) * 0.18 + r * 1.6;
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(rad, Math.min(w, h) / 2 - 10), 0, Math.PI * 2);
    ctx.stroke();
    const R = Math.min(rad, Math.min(w, h) / 2 - 10);
    const bx = cx + R * Math.cos(-0.6);
    const by = cy + R * Math.sin(-0.6);
    ctx.fillStyle = c.ink;
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fill();
    const len = Math.min(R - 12, 20 + force / 40);
    ctx.strokeStyle = force > grip ? c.signal : c.copper;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - len * Math.cos(-0.6), by - len * Math.sin(-0.6));
    ctx.stroke();
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <div className="grid grid-cols-2 gap-3">
        <Big label="Gaya ke pusat" value={force.toFixed(0)} unit="N" />
        <Big label="Cengkeram ban maks (μ = 0,7)" value={grip.toFixed(0)} unit="N" />
      </div>
      <p className={`text-sm ${force > grip ? "font-semibold text-signal" : "text-muted"}`}>
        {force > grip ? "Gaya yang dibutuhkan melebihi cengkeram: tergelincir." : "Masih dalam batas cengkeram ban."}
      </p>
      <Range label="Massa (kg)" value={m} min={50} max={300} step={10} onChange={setM} />
      <Range label="Kecepatan (m/s)" value={v} min={2} max={25} step={1} onChange={setV} />
      <Range label="Jari-jari tikungan (m)" value={r} min={5} max={60} step={1} onChange={setR} />
    </div>
  );
}

function HeatPlay() {
  const [th, setTh] = useState(327);
  const [tc, setTc] = useState(27);
  const hot = Math.max(th, tc + 1);
  const eff = (1 - (tc + 273) / (hot + 273)) * 100;
  return (
    <div className="grid gap-4">
      <Big label="Efisiensi maksimum (Carnot)" value={`${f1(eff)}%`} />
      <div className="h-3 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-copper" style={{ width: `${Math.max(0, eff)}%` }} />
      </div>
      <Range label="Suhu panas (°C)" value={th} min={50} max={1000} step={10} onChange={setTh} />
      <Range label="Suhu dingin (°C)" value={tc} min={-20} max={200} step={1} onChange={setTc} />
      <p className="text-sm text-muted">
        Dalam kelvin: {hot + 273} K dan {tc + 273} K. Sisa {f1(100 - eff)}% pasti terbuang sebagai panas ke tempat dingin.
      </p>
    </div>
  );
}

function InductionPlay() {
  const [np, setNp] = useState(880);
  const [ns, setNs] = useState(20);
  const [vp, setVp] = useState(220);
  const vs = (vp * ns) / np;
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Big label="Tegangan sekunder" value={f1(vs)} unit="V" />
        <Big label="Arus sekunder ÷ primer" value={f1(np / ns)} unit="×" />
      </div>
      <Range label="Lilitan primer" value={np} min={50} max={2000} step={10} onChange={setNp} />
      <Range label="Lilitan sekunder" value={ns} min={5} max={2000} step={5} onChange={setNs} />
      <Range label="Tegangan primer (V)" value={vp} min={12} max={240} step={1} onChange={setVp} />
      <p className="text-sm text-muted">{ns > np ? "Trafo penaik: tegangan naik, arus turun." : "Trafo penurun: tegangan turun, arus naik."} Daya ideal tetap sama.</p>
    </div>
  );
}

function StressPlay() {
  const [force, setForce] = useState(20);
  const [area, setArea] = useState(100);
  const sigma = (force * 1000) / (area * 1e-6) / 1e6;
  const factor = 250 / sigma;
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Big label="Tegangan" value={f1(sigma)} unit="MPa" />
        <Big label="Faktor keamanan (luluh 250 MPa)" value={f1(factor)} />
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-line">
        <div className={`h-full ${factor < 1 ? "bg-signal" : "bg-copper"}`} style={{ width: `${Math.min(100, (sigma / 250) * 100)}%` }} />
      </div>
      <Range label="Gaya (kN)" value={force} min={1} max={100} step={1} onChange={setForce} />
      <Range label="Penampang (mm²)" value={area} min={10} max={500} step={10} onChange={setArea} />
      <p className="text-sm text-muted">{factor < 1 ? "Di atas tegangan luluh: batang meregang permanen." : factor < 2 ? "Terlalu mepet. Desain biasanya meminta faktor 2 atau lebih." : "Aman dengan margin."}</p>
    </div>
  );
}

function TransformPlay() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [cc, setC] = useState(1);
  const [d, setD] = useState(2);
  const tr = a + d;
  const det = a * d - b * cc;
  const disc = tr * tr - 4 * det;
  const eig = disc >= 0 ? [(tr + Math.sqrt(disc)) / 2, (tr - Math.sqrt(disc)) / 2] : null;
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    // Skala sama di dua sumbu supaya persegi tetap persegi dan sudut arah eigen jujur.
    const k = (w - 36) / (h - 36);
    const { px, py } = frame(w, h, -4 * k, 4 * k, -4, 4);
    axes(ctx, w, h, c, py(0));
    ctx.strokeStyle = c.line;
    ctx.beginPath();
    ctx.moveTo(px(0), 18);
    ctx.lineTo(px(0), h - 18);
    ctx.stroke();
    const map = (x: number, y: number): [number, number] => [a * x + b * y, cc * x + d * y];
    const shape = (pts: [number, number][], stroke: string, fill?: string) => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(px(x), py(y)) : ctx.lineTo(px(x), py(y))));
      ctx.closePath();
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    const sq: [number, number][] = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    shape(sq, c.muted);
    shape(sq.map(([x, y]) => map(x, y)), c.copper, `${c.copper}33`);
    if (eig) {
      ctx.strokeStyle = c.signal;
      ctx.setLineDash([6, 4]);
      for (const l of eig) {
        let vx = b;
        let vy = l - a;
        if (Math.abs(vx) < 1e-9 && Math.abs(vy) < 1e-9) {
          vx = l - d;
          vy = cc;
        }
        if (Math.abs(vx) < 1e-9 && Math.abs(vy) < 1e-9) continue;
        const n = Math.hypot(vx, vy);
        ctx.beginPath();
        ctx.moveTo(px((-4 * vx) / n), py((-4 * vy) / n));
        ctx.lineTo(px((4 * vx) / n), py((4 * vy) / n));
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <div className="grid grid-cols-2 gap-3">
        <Big label="Determinan (faktor luas)" value={f2(det)} />
        <Big label="Nilai eigen" value={eig ? `${f2(eig[0])} ; ${f2(eig[1])}` : "kompleks"} />
      </div>
      <p className="text-sm text-muted">Abu-abu: persegi satuan. Hijau: hasil transformasi. Garis putus merah muda: arah eigen yang tidak berbelok.</p>
      <div className="grid grid-cols-2 gap-3">
        <Range label="a" value={a} min={-2} max={3} step={0.5} onChange={setA} />
        <Range label="b" value={b} min={-2} max={3} step={0.5} onChange={setB} />
        <Range label="c" value={cc} min={-2} max={3} step={0.5} onChange={setC} />
        <Range label="d" value={d} min={-2} max={3} step={0.5} onChange={setD} />
      </div>
    </div>
  );
}

function ClockPlay() {
  const [n, setN] = useState(12);
  const [value, setValue] = useState(19);
  const rem = ((value % n) + n) % n;
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) / 2 - 22;
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = "12px sans-serif";
    for (let k = 0; k < n; k++) {
      const ang = -Math.PI / 2 + (2 * Math.PI * k) / n;
      ctx.fillStyle = k === rem ? c.copper : c.muted;
      ctx.fillText(String(k), cx + (R + 12) * Math.cos(ang) - 5, cy + (R + 12) * Math.sin(ang) + 4);
    }
    const ang = -Math.PI / 2 + (2 * Math.PI * rem) / n;
    ctx.strokeStyle = c.copper;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (R - 8) * Math.cos(ang), cy + (R - 8) * Math.sin(ang));
    ctx.stroke();
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <Big label={`${value} mod ${n}`} value={String(rem)} />
      <Range label="Bilangan" value={value} min={-30} max={100} step={1} onChange={setValue} />
      <Range label="Modulus n" value={n} min={2} max={24} step={1} onChange={setN} />
      <p className="text-sm text-muted">
        {value} = {Math.floor(value / n)} × {n} + {rem}. Jarum hanya ingat sisanya.
      </p>
    </div>
  );
}

function EntropyPlay() {
  const [p, setP] = useState(0.5);
  const H = (x: number) => (x <= 0 || x >= 1 ? 0 : -x * Math.log2(x) - (1 - x) * Math.log2(1 - x));
  const data = Array.from({ length: 21 }, (_, i) => ({ x: i / 20, y: Number(H(i / 20).toFixed(3)) }));
  return (
    <div className="grid gap-3">
      <Plot data={data} numeric />
      <div className="grid grid-cols-2 gap-3">
        <Big label="Entropi koin" value={f2(H(p))} unit="bit" />
        <Big label="Loss jika model memberi p pada jawaban benar" value={p > 0 ? f2(-Math.log(p)) : "∞"} />
      </div>
      <Range label="Peluang angka p" value={p} min={0.01} max={0.99} step={0.01} onChange={setP} />
      <p className="text-sm text-muted">Puncak 1 bit di p = 0,5: paling tidak bisa ditebak. Koin yang hampir selalu angka hampir tidak membawa informasi.</p>
    </div>
  );
}

function WalkPlay() {
  const [steps, setSteps] = useState(100);
  const [salt, setSalt] = useState(1);
  const walks = Array.from({ length: 6 }, (_, k) => {
    const path = [0];
    for (let i = 1; i <= steps; i++) path.push(path[i - 1] + (rand(salt * 1000 + k * 7919 + i) < 0.5 ? -1 : 1));
    return path;
  });
  const span = Math.max(10, 3 * Math.sqrt(steps));
  const ends = walks.map((wk) => wk[wk.length - 1]);
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const { px, py } = frame(w, h, 0, steps, -span, span);
    axes(ctx, w, h, c, py(0));
    ctx.strokeStyle = c.muted;
    ctx.setLineDash([5, 4]);
    for (const sgn of [1, -1]) {
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const y = py(sgn * Math.sqrt(i));
        if (i === 0) ctx.moveTo(px(i), y);
        else ctx.lineTo(px(i), y);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    walks.forEach((wk, k) => {
      ctx.strokeStyle = k === 0 ? c.copper : `${c.ink}88`;
      ctx.lineWidth = k === 0 ? 2 : 1;
      ctx.beginPath();
      wk.forEach((y, i) => (i === 0 ? ctx.moveTo(px(i), py(y)) : ctx.lineTo(px(i), py(y))));
      ctx.stroke();
    });
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <div className="grid grid-cols-2 gap-3">
        <Big label="√n (garis putus)" value={f1(Math.sqrt(steps))} />
        <Big label="Posisi akhir 6 jalan" value={ends.join(" ; ")} />
      </div>
      <Range label="Banyak langkah n" value={steps} min={10} max={1000} step={10} onChange={setSteps} />
      <button type="button" className="btn-ghost justify-self-start" onClick={() => setSalt((v) => v + 1)}>
        Acak ulang
      </button>
    </div>
  );
}

function PidPlay() {
  const [kp, setKp] = useState(2);
  const [ki, setKi] = useState(0);
  const dt = 0.05;
  let y = 0;
  let integ = 0;
  const data: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i <= 200; i++) {
    const t = i * dt;
    const e = 1 - y;
    integ += e * dt;
    const u = kp * e + ki * integ;
    y += ((u - y) / 1) * dt;
    if (i % 5 === 0) data.push({ x: Number(t.toFixed(2)), y: Number(y.toFixed(3)), z: 1 });
  }
  const finalErr = 1 - y;
  return (
    <div className="grid gap-3">
      <Plot data={data} y2 numeric />
      <div className="grid grid-cols-2 gap-3">
        <Big label="Galat di t = 10" value={f2(finalErr)} />
        <Big label="Teori P saja: 1/(1+Kp)" value={f2(1 / (1 + kp))} />
      </div>
      <Range label="Kp" value={kp} min={0.5} max={20} step={0.5} onChange={setKp} />
      <Range label="Ki" value={ki} min={0} max={5} step={0.25} onChange={setKi} />
      <p className="text-sm text-muted">Garis putih: target 1. Garis hijau: keluaran plant orde satu (τ = 1). Ki di atas nol menghapus sisa galat.</p>
    </div>
  );
}

function SamplingPlay() {
  const [f, setF] = useState(9);
  const [fs, setFs] = useState(10);
  const k = Math.round(f / fs);
  const alias = Math.abs(f - k * fs);
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const c = palette();
    const { px, py } = frame(w, h, 0, 1, -1.3, 1.3);
    axes(ctx, w, h, c, py(0));
    ctx.strokeStyle = `${c.ink}99`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 600; i++) {
      const t = i / 600;
      const y = py(Math.sin(2 * Math.PI * f * t));
      if (i === 0) ctx.moveTo(px(t), y);
      else ctx.lineTo(px(t), y);
    }
    ctx.stroke();
    ctx.strokeStyle = c.signal;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    const sgn = f - k * fs >= 0 ? 1 : -1;
    for (let i = 0; i <= 600; i++) {
      const t = i / 600;
      const y = py(sgn * Math.sin(2 * Math.PI * alias * t));
      if (i === 0) ctx.moveTo(px(t), y);
      else ctx.lineTo(px(t), y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = c.copper;
    for (let n = 0; n <= fs; n++) {
      const t = n / fs;
      ctx.beginPath();
      ctx.arc(px(t), py(Math.sin(2 * Math.PI * f * t)), 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  return (
    <div className="grid gap-3">
      <Sketch draw={draw} />
      <div className="grid grid-cols-2 gap-3">
        <Big label="Frekuensi yang tampak" value={String(alias)} unit="Hz" />
        <Big label="Syarat Nyquist" value={fs > 2 * f ? "aman" : "aliasing"} />
      </div>
      <Range label="Frekuensi sinyal f (Hz)" value={f} min={1} max={20} step={1} onChange={setF} />
      <Range label="Laju sampling fs (Hz)" value={fs} min={2} max={60} step={1} onChange={setFs} />
      <p className="text-sm text-muted">Titik hijau: cuplikan. Garis putus: gelombang palsu yang paling cocok dengan titik-titik itu.</p>
    </div>
  );
}

function QubitPlay() {
  const [deg, setDeg] = useState(90);
  const half = (deg * Math.PI) / 360;
  const alpha = Math.cos(half);
  const beta = Math.sin(half);
  const p0 = alpha * alpha;
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Big label="α (amplitudo |0⟩)" value={f2(alpha)} />
        <Big label="β (amplitudo |1⟩)" value={f2(beta)} />
      </div>
      {[
        ["P(0)", p0],
        ["P(1)", 1 - p0],
      ].map(([label, val]) => (
        <div key={label as string} className="grid gap-1">
          <div className="flex justify-between text-sm">
            <span>{label}</span>
            <span className="font-mono tabular-nums">{f2(val as number)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-copper" style={{ width: `${(val as number) * 100}%` }} />
          </div>
        </div>
      ))}
      <Range label="Sudut θ pada bola Bloch (°)" value={deg} min={0} max={180} step={1} onChange={setDeg} />
      <p className="text-sm text-muted">θ = 90° adalah keadaan setelah Hadamard: 50:50. Peluang adalah kuadrat amplitudo, jadi α = 0,71 memberi 0,5.</p>
    </div>
  );
}

export function ExtraWidget({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "descent":
      return <DescentPlay />;
    case "pv":
      return <PvPlay />;
    case "normal":
      return <NormalPlay />;
    case "ci":
      return <CiPlay />;
    case "scatter":
      return <ScatterPlay />;
    case "bayes":
      return <BayesPlay />;
    case "logic":
      return <LogicPlay />;
    case "rotation":
      return <RotationPlay />;
    case "heat":
      return <HeatPlay />;
    case "induction":
      return <InductionPlay />;
    case "stress":
      return <StressPlay />;
    case "transform":
      return <TransformPlay />;
    case "clock":
      return <ClockPlay />;
    case "entropy":
      return <EntropyPlay />;
    case "walk":
      return <WalkPlay />;
    case "pid":
      return <PidPlay />;
    case "sampling":
      return <SamplingPlay />;
    case "qubit":
      return <QubitPlay />;
    default:
      return null;
  }
}
