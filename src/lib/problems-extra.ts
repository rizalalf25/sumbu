import { fmt, problem, take, type Level, type Problem } from "./mathx.ts";

function sign(n: number, unit = "") {
  return n < 0 ? `− ${Math.abs(n)}${unit}` : `+ ${n}${unit}`;
}

function rantai(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [1, 2, 3, 4]);
    const b = take(seed, 2, [-3, -2, -1, 1, 2, 3]);
    const n = take(seed, 3, [2, 3, 4]);
    const x = take(seed, 4, [-1, 0, 1, 2]);
    const inner = a * x + b;
    const value = n * a * inner ** (n - 1);
    return problem(
      `f(x) = (${a}x ${sign(b)})^${n}. Berapa f'(${x})?`,
      "Aturan rantai: turunkan luar, kali turunan dalam.",
      value,
      `Luar: ${n}(…)^${n - 1}. Dalam: ${a}.`,
      [`f'(x) = ${n}(${a}x ${sign(b)})^${n - 1} × ${a}.`, `Di x = ${x}: isi kurung = ${inner}.`, `f'(${x}) = ${n} × ${inner}^${n - 1} × ${a} = ${value}.`],
    );
  }
  if (level === 2) {
    const a = take(seed, 1, [1, 2, 3]);
    const b = take(seed, 2, [-2, -1, 1, 2, 4]);
    const c = take(seed, 3, [1, 2, 3, -1]);
    const d = take(seed, 4, [-3, -1, 1, 3, 5]);
    const x = take(seed, 5, [-2, -1, 0, 1, 2, 3]);
    const value = a * (c * x + d) + c * (a * x + b);
    return problem(
      `f(x) = (${a}x ${sign(b)})(${c}x ${sign(d)}). Berapa f'(${x})?`,
      "Aturan kali: (uv)' = u'v + uv'.",
      value,
      "Turunkan satu faktor, biarkan yang lain, lalu tukar.",
      [`u' = ${a}, v' = ${c}.`, `Di x = ${x}: u = ${a * x + b}, v = ${c * x + d}.`, `f' = ${a}×${c * x + d} + ${a * x + b}×${c} = ${value}.`],
    );
  }
  const w = take(seed, 1, [0, 1, 2, 3, 4]);
  const x = take(seed, 2, [1, 2, 3]);
  const t = take(seed, 3, [4, 6, 8, 10, 12]);
  const eta = take(seed, 4, [0.01, 0.05, 0.1]);
  const grad = 2 * (w * x - t) * x;
  const value = w - eta * grad;
  return problem(
    `Galat L(w) = (w·${x} − ${t})². Mulai w = ${w}, laju belajar η = ${fmt(eta)}. Berapa w setelah satu langkah gradient descent?`,
    "dL/dw = 2(wx − t)·x. w baru = w − η · dL/dw.",
    value,
    "Turunan negatif berarti w harus naik.",
    [`dL/dw = 2(${w * x} − ${t}) × ${x} = ${grad}.`, `w baru = ${w} − ${fmt(eta)} × (${grad}) = ${fmt(value)}.`],
    0.01,
  );
}

function bunga(seed: number, level: Level): Problem {
  if (level === 1) {
    const pv = take(seed, 1, [1000, 2000, 5000, 10000, 2500]);
    const i = take(seed, 2, [5, 6, 8, 10, 12]);
    const n = take(seed, 3, [1, 2, 3, 5]);
    const value = pv * (1 + i / 100) ** n;
    return problem(
      `Tabungan Rp${pv} ribu, bunga majemuk ${i}% per tahun. Berapa saldo setelah ${n} tahun (ribu rupiah)?`,
      "FV = PV (1+i)^n. Bulatkan ke 2 desimal.",
      value,
      "Kalikan faktor (1+i), jangan tambahkan n × bunga.",
      [`Faktor = ${fmt(1 + i / 100)}^${n} = ${fmt((1 + i / 100) ** n, 4)}.`, `FV = ${pv} × itu = ${fmt(value)}.`],
      Math.max(0.5, value * 0.002),
    );
  }
  if (level === 2) {
    const fv = take(seed, 1, [1000, 5000, 10000, 20000, 50000]);
    const i = take(seed, 2, [5, 8, 10, 12]);
    const n = take(seed, 3, [1, 2, 3, 4]);
    const value = fv / (1 + i / 100) ** n;
    return problem(
      `Janji pembayaran Rp${fv} ribu, ${n} tahun lagi. Bunga ${i}% per tahun. Nilai sekarang (ribu rupiah)?`,
      "PV = FV / (1+i)^n.",
      value,
      "Uang masa depan selalu bernilai lebih kecil hari ini, jika bunga positif.",
      [`(1+i)^n = ${fmt((1 + i / 100) ** n, 4)}.`, `PV = ${fv} / itu = ${fmt(value)}.`],
      Math.max(0.5, value * 0.002),
    );
  }
  const pv = take(seed, 1, [6000, 10000, 12000, 20000, 30000]);
  const i = take(seed, 2, [1, 1.5, 2]);
  const n = take(seed, 3, [6, 12, 24, 36]);
  const r = i / 100;
  const factor = (1 - (1 + r) ** -n) / r;
  const value = pv / factor;
  return problem(
    `Pinjaman Rp${pv} ribu, bunga ${fmt(i)}% per bulan, dilunasi ${n} kali cicilan sama di akhir bulan. Cicilan per bulan (ribu rupiah)?`,
    "A = PV / [(1 − (1+i)^−n) / i].",
    value,
    "Hitung faktor anuitas dulu, baru bagi pinjaman dengan faktor itu.",
    [`Faktor = (1 − ${fmt(1 + r, 3)}^−${n}) / ${fmt(r, 3)} = ${fmt(factor, 3)}.`, `A = ${pv} / ${fmt(factor, 3)} = ${fmt(value)}.`],
    Math.max(0.5, value * 0.005),
  );
}

function sampel(seed: number, level: Level): Problem {
  const pool = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];
  if (level === 1) {
    const data = [0, 1, 2, 3, 4].map((i) => take(seed, i + 1, pool));
    const sorted = [...data].sort((x, y) => x - y);
    const value = sorted[2];
    return problem(
      `Median data ${data.join(", ")}?`,
      "Urutkan dulu, ambil yang di tengah.",
      value,
      "Median bukan rata-rata. Lima data: nilai ke-3 setelah diurutkan.",
      [`Diurutkan: ${sorted.join(", ")}.`, `Tengah = ${value}.`],
    );
  }
  if (level === 2) {
    const data = [0, 1, 2, 3].map((i) => take(seed, i + 1, pool));
    const mean = data.reduce((s, n) => s + n, 0) / data.length;
    const ss = data.reduce((s, n) => s + (n - mean) ** 2, 0);
    const value = ss / (data.length - 1);
    return problem(
      `Varians sampel (bagi n−1) dari ${data.join(", ")}?`,
      "s² = Σ(x − x̄)² / (n − 1).",
      value,
      "Data ini sampel, jadi bagi 3, bukan 4.",
      [`x̄ = ${fmt(mean)}.`, `Σ(x − x̄)² = ${fmt(ss)}.`, `s² = ${fmt(ss)} / 3 = ${fmt(value)}.`],
      0.05,
    );
  }
  const mu = take(seed, 1, [50, 60, 70, 100, 500]);
  const sd = take(seed, 2, [4, 5, 8, 10, 20]);
  const z = take(seed, 3, [-2.5, -2, -1.5, -1, 0.5, 1, 1.5, 2, 3]);
  const x = mu + z * sd;
  return problem(
    `Rata-rata ${mu}, simpangan baku ${sd}. Skor z untuk nilai ${fmt(x)}?`,
    "z = (x − rata-rata) / simpangan baku.",
    z,
    "Tanda negatif berarti di bawah rata-rata.",
    [`x − μ = ${fmt(x - mu)}.`, `z = ${fmt(x - mu)} / ${sd} = ${fmt(z)}.`],
  );
}

function inferensi(seed: number, level: Level): Problem {
  const n = take(seed, 1, [16, 25, 36, 49, 64, 100, 144, 400]);
  const s = take(seed, 2, [4, 6, 8, 10, 12, 20, 30]);
  const se = s / Math.sqrt(n);
  if (level === 1) {
    return problem(
      `Sampel n = ${n}, simpangan baku s = ${s}. Galat baku rata-rata?`,
      "SE = s / √n.",
      se,
      "Akar dari n, bukan n.",
      [`√${n} = ${Math.sqrt(n)}.`, `SE = ${s} / ${Math.sqrt(n)} = ${fmt(se, 3)}.`],
      0.01,
    );
  }
  if (level === 2) {
    const mean = take(seed, 3, [50, 72, 100, 250, 18]);
    const value = mean + 1.96 * se;
    return problem(
      `Rata-rata sampel ${mean}, s = ${s}, n = ${n}. Batas atas interval kepercayaan 95%? Pakai 1,96.`,
      "x̄ + 1,96 × s/√n.",
      value,
      "Hitung galat baku dulu.",
      [`SE = ${fmt(se, 3)}.`, `1,96 × SE = ${fmt(1.96 * se, 3)}.`, `Batas atas = ${fmt(value)}.`],
      0.05,
    );
  }
  const p = take(seed, 3, [0.1, 0.2, 0.5, 0.04, 0.3]);
  const m = take(seed, 4, [100, 400, 900, 2500, 10000]);
  const value = Math.sqrt((p * (1 - p)) / m);
  return problem(
    `Tingkat konversi ${fmt(p * 100)}% dari ${m} pengunjung. Galat baku proporsinya? (Jawab sebagai desimal, misalnya 0,015.)`,
    "SE = √(p(1−p)/n).",
    value,
    "Pakai p dalam desimal, bukan persen.",
    [`p(1−p) = ${fmt(p * (1 - p), 4)}.`, `Bagi ${m}, lalu akar: ${fmt(value, 4)}.`],
    0.0006,
  );
}

function regresi(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [2, 5, 10, 12.5, -3]);
    const b = take(seed, 2, [0.5, 1.5, 2, 3, -1.2]);
    const x = take(seed, 3, [2, 4, 5, 8, 10]);
    const value = a + b * x;
    return problem(
      `Garis regresi ŷ = ${fmt(a)} ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}x. Prediksi untuk x = ${x}?`,
      "Masukkan x ke persamaan garis.",
      value,
      "Kemiringan dikali x, lalu tambah intersep.",
      [`${fmt(b)} × ${x} = ${fmt(b * x)}.`, `ŷ = ${fmt(a)} + ${fmt(b * x)} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const sxx = take(seed, 1, [4, 5, 8, 10, 20, 40]);
    const b = take(seed, 2, [-2, -0.5, 0.5, 1.5, 2, 2.4, 3]);
    const sxy = b * sxx;
    return problem(
      `Σ(x−x̄)(y−ȳ) = ${fmt(sxy)} dan Σ(x−x̄)² = ${sxx}. Kemiringan garis regresi?`,
      "b = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)².",
      b,
      "Kovarians dibagi variasi x.",
      [`b = ${fmt(sxy)} / ${sxx} = ${fmt(b)}.`],
    );
  }
  const xbar = take(seed, 1, [2, 3, 5, 10]);
  const ybar = take(seed, 2, [10, 17, 25, 40]);
  const b = take(seed, 3, [0.5, 1.2, 2, 2.4, -1.5]);
  const value = ybar - b * xbar;
  return problem(
    `x̄ = ${xbar}, ȳ = ${ybar}, kemiringan b = ${fmt(b)}. Intersep a?`,
    "Garis regresi lewat titik rata-rata: a = ȳ − b x̄.",
    value,
    "Kurangi, jangan tambahkan.",
    [`b x̄ = ${fmt(b * xbar)}.`, `a = ${ybar} − ${fmt(b * xbar)} = ${fmt(value)}.`],
  );
}

function bayes(seed: number, level: Level): Problem {
  if (level === 1) {
    const total = take(seed, 1, [200, 500, 1000]);
    const nb = take(seed, 2, [40, 50, 80, 100]);
    const nab = take(seed, 3, [10, 20, 25, 30]);
    const value = nab / nb;
    return problem(
      `Dari ${total} pelanggan, ${nb} membuka promo (B). Dari yang membuka, ${nab} membeli (A dan B). Berapa P(beli | buka promo)?`,
      "P(A|B) = jumlah A dan B / jumlah B.",
      value,
      "Dunia dikecilkan ke yang membuka promo saja.",
      [`P(A|B) = ${nab} / ${nb} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const prev = take(seed, 1, [1, 2, 5, 10, 20]);
    const sens = take(seed, 2, [90, 95, 99]);
    const fp = take(seed, 3, [2, 5, 10]);
    const tp = (sens / 100) * (prev / 100);
    const fpos = (fp / 100) * (1 - prev / 100);
    const value = tp / (tp + fpos);
    return problem(
      `Penyakit ada pada ${prev}% orang. Tes positif pada ${sens}% orang sakit dan ${fp}% orang sehat. Peluang sakit jika positif?`,
      "Bayangkan 1.000 orang, hitung positif benar dan positif palsu.",
      value,
      "Positif palsu dari kelompok sehat yang besar sering mengalahkan positif benar.",
      [
        `Positif benar: ${fmt(tp * 1000, 1)} dari 1.000.`,
        `Positif palsu: ${fmt(fpos * 1000, 1)} dari 1.000.`,
        `P = ${fmt(tp * 1000, 1)} / ${fmt((tp + fpos) * 1000, 1)} = ${fmt(value)}.`,
      ],
    );
  }
  const pa = take(seed, 1, [0.1, 0.2, 0.3, 0.5]);
  const pba = take(seed, 2, [0.6, 0.8, 0.9]);
  const pbn = take(seed, 3, [0.05, 0.1, 0.2]);
  const value = pba * pa + pbn * (1 - pa);
  return problem(
    `P(A) = ${fmt(pa)}, P(B|A) = ${fmt(pba)}, P(B|bukan A) = ${fmt(pbn)}. Berapa P(B)?`,
    "Peluang total: P(B) = P(B|A)P(A) + P(B|¬A)P(¬A).",
    value,
    "P(¬A) = 1 − P(A).",
    [`${fmt(pba)} × ${fmt(pa)} = ${fmt(pba * pa, 3)}.`, `${fmt(pbn)} × ${fmt(1 - pa)} = ${fmt(pbn * (1 - pa), 3)}.`, `P(B) = ${fmt(value, 3)}.`],
    0.005,
  );
}

function diskrit(seed: number, level: Level): Problem {
  if (level === 1) {
    const total = take(seed, 1, [100, 120, 200]);
    const a = take(seed, 2, [40, 50, 60]);
    const b = take(seed, 3, [30, 35, 45]);
    const both = take(seed, 4, [15, 20, 25]);
    const value = total - (a + b - both);
    return problem(
      `Dari ${total} orang, ${a} suka kopi, ${b} suka teh, ${both} suka keduanya. Berapa yang tidak suka keduanya?`,
      "|A ∪ B| = |A| + |B| − |A ∩ B|.",
      value,
      "Kurangi irisan sekali, lalu kurangkan dari total.",
      [`Suka minimal satu = ${a} + ${b} − ${both} = ${a + b - both}.`, `Tidak keduanya = ${total} − ${a + b - both} = ${value}.`],
    );
  }
  if (level === 2) {
    const mode = take(seed, 1, [0, 1, 2]);
    if (mode === 0) {
      const n = take(seed, 2, [2, 3, 4, 5, 6, 8]);
      return problem(`Tabel kebenaran untuk ${n} pernyataan punya berapa baris?`, "Tiap pernyataan benar atau salah.", 2 ** n, "2 pilihan dikali sebanyak n.", [`2^${n} = ${2 ** n}.`]);
    }
    if (mode === 1) {
      const e = take(seed, 2, [5, 7, 9, 12, 15, 20]);
      return problem(`Graf punya ${e} sisi. Berapa jumlah derajat semua titiknya?`, "Σ derajat = 2 × banyak sisi.", 2 * e, "Tiap sisi punya dua ujung.", [`2 × ${e} = ${2 * e}.`]);
    }
    const n = take(seed, 2, [4, 5, 6, 8, 10, 12]);
    return problem(
      `${n} kota, setiap pasang kota dihubungkan satu jalan langsung. Berapa banyak jalan?`,
      "Graf lengkap: n(n−1)/2 sisi.",
      (n * (n - 1)) / 2,
      "Tiap kota terhubung ke n−1 kota, tetapi tiap jalan terhitung dua kali.",
      [`${n} × ${n - 1} / 2 = ${(n * (n - 1)) / 2}.`],
    );
  }
  const value = take(seed, 1, [5, 9, 12, 13, 21, 37, 42, 77, 100, 129, 200, 255]);
  const bin = value.toString(2);
  return problem(
    `Bilangan biner ${bin} sama dengan berapa dalam desimal?`,
    "Tiap digit dari kanan bernilai 1, 2, 4, 8, 16, …",
    value,
    "Jumlahkan nilai tempat yang digitnya 1.",
    [
      `${bin
        .split("")
        .reverse()
        .map((d, i) => (d === "1" ? String(2 ** i) : null))
        .filter(Boolean)
        .reverse()
        .join(" + ")} = ${value}.`,
    ],
  );
}

function rotasi(seed: number, level: Level): Problem {
  if (level === 1) {
    const w = take(seed, 1, [2, 3, 4, 5, 10, 0.5]);
    const r = take(seed, 2, [0.2, 0.3, 0.5, 1, 1.5, 2]);
    return problem(`Roda berputar ω = ${fmt(w)} rad/s, jari-jari ${fmt(r)} m. Kecepatan tepi roda (m/s)?`, "v = ω r.", w * r, "ω harus dalam rad/s.", [
      `v = ${fmt(w)} × ${fmt(r)} = ${fmt(w * r)}.`,
    ]);
  }
  if (level === 2) {
    const m = take(seed, 1, [0.5, 1, 2, 100, 150, 1000]);
    const v = take(seed, 2, [2, 4, 5, 10, 15, 20]);
    const r = take(seed, 3, [1, 2, 5, 10, 20, 50]);
    const value = (m * v * v) / r;
    return problem(
      `Benda ${fmt(m)} kg bergerak ${v} m/s pada lingkaran berjari-jari ${r} m. Gaya sentripetal (N)?`,
      "F = m v² / r.",
      value,
      "Kuadratkan kecepatan.",
      [`v² = ${v * v}.`, `F = ${fmt(m)} × ${v * v} / ${r} = ${fmt(value)}.`],
    );
  }
  const r = take(seed, 1, [0.2, 0.25, 0.3, 0.4, 0.5]);
  const F = take(seed, 2, [10, 20, 40, 50, 100]);
  const th = take(seed, 3, [30, 90] as const);
  const value = r * F * (th === 30 ? 0.5 : 1);
  return problem(
    `Kunci sepanjang ${fmt(r)} m didorong ${F} N dengan sudut ${th}° terhadap gagang. Torsi (N·m)?`,
    "τ = r F sin θ. sin 30° = 0,5, sin 90° = 1.",
    value,
    "Hanya komponen gaya yang tegak lurus gagang yang memutar.",
    [`sin ${th}° = ${th === 30 ? "0,5" : "1"}.`, `τ = ${fmt(r)} × ${F} × itu = ${fmt(value)}.`],
  );
}

function termo(seed: number, level: Level): Problem {
  if (level === 1) {
    const m = take(seed, 1, [0.5, 1, 2, 5, 10]);
    const dT = take(seed, 2, [10, 20, 30, 50, 75]);
    const value = (m * 4200 * dT) / 1000;
    return problem(
      `Air ${fmt(m)} kg dipanaskan naik ${dT}°C. c air = 4.200 J/kg°C. Kalor yang dibutuhkan (kJ)?`,
      "Q = m c ΔT. 1 kJ = 1.000 J.",
      value,
      "Kalikan tiga faktor, lalu bagi 1.000 untuk kJ.",
      [`Q = ${fmt(m)} × 4200 × ${dT} = ${fmt(value * 1000)} J.`, `= ${fmt(value)} kJ.`],
    );
  }
  if (level === 2) {
    const th = take(seed, 1, [127, 227, 327, 527, 727]);
    const tc = take(seed, 2, [27, 7, 77]);
    const Th = th + 273;
    const Tc = tc + 273;
    const value = (1 - Tc / Th) * 100;
    return problem(
      `Mesin panas antara ${th}°C dan ${tc}°C. Efisiensi Carnot maksimum (%)?`,
      "η = 1 − Tc/Th, suhu dalam kelvin (°C + 273).",
      value,
      "Ubah ke kelvin dulu.",
      [`Th = ${Th} K, Tc = ${Tc} K.`, `η = 1 − ${Tc}/${Th} = ${fmt(value)}%.`],
      0.2,
    );
  }
  const m = take(seed, 1, [1, 2, 5, 10, 50]);
  const dT = take(seed, 2, [20, 30, 50]);
  const P = take(seed, 3, [500, 1000, 1500, 2000]);
  const value = (m * 4200 * dT) / P / 60;
  return problem(
    `Pemanas ${P} W memanaskan ${m} kg air naik ${dT}°C. c = 4.200 J/kg°C, tanpa rugi panas. Berapa menit?`,
    "t = Q / P, lalu bagi 60.",
    value,
    "Daya adalah joule per detik.",
    [`Q = ${m * 4200 * dT} J.`, `t = ${m * 4200 * dT} / ${P} = ${fmt(value * 60)} s = ${fmt(value)} menit.`],
    Math.max(0.05, value * 0.01),
  );
}

function magnet(seed: number, level: Level): Problem {
  if (level === 1) {
    const B = take(seed, 1, [0.1, 0.2, 0.5, 1, 1.5]);
    const I = take(seed, 2, [1, 2, 3, 5, 10]);
    const L = take(seed, 3, [0.1, 0.2, 0.5, 1]);
    const value = B * I * L;
    return problem(
      `Kawat ${fmt(L)} m berarus ${I} A tegak lurus medan ${fmt(B)} T. Gaya magnet (N)?`,
      "F = B I L sin θ, sin 90° = 1.",
      value,
      "Tiga faktor dikalikan.",
      [`F = ${fmt(B)} × ${I} × ${fmt(L)} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const vp = take(seed, 1, [110, 220, 240, 12]);
    const np = take(seed, 2, [100, 200, 500, 1000, 1100]);
    const ns = take(seed, 3, [10, 20, 50, 100, 2000]);
    const value = (vp * ns) / np;
    return problem(
      `Trafo ideal: primer ${np} lilitan pada ${vp} V, sekunder ${ns} lilitan. Tegangan sekunder (V)?`,
      "Vs/Vp = Ns/Np.",
      value,
      "Lilitan lebih banyak di sekunder berarti tegangan naik.",
      [`Vs = ${vp} × ${ns}/${np} = ${fmt(value)}.`],
    );
  }
  const N = take(seed, 1, [10, 50, 100, 200]);
  const dB = take(seed, 2, [0.1, 0.2, 0.5]);
  const A = take(seed, 3, [0.01, 0.02, 0.05]);
  const dt = take(seed, 4, [0.1, 0.2, 0.5]);
  const value = (N * dB * A) / dt;
  return problem(
    `Kumparan ${N} lilitan, luas ${fmt(A)} m². Medan berubah ${fmt(dB)} T dalam ${fmt(dt)} s. Besar GGL induksi (V)?`,
    "|ε| = N ΔΦ / Δt, dengan ΔΦ = ΔB · A.",
    value,
    "Fluks = medan × luas.",
    [`ΔΦ = ${fmt(dB)} × ${fmt(A)} = ${fmt(dB * A, 4)} Wb.`, `ε = ${N} × ${fmt(dB * A, 4)} / ${fmt(dt)} = ${fmt(value, 3)} V.`],
    Math.max(0.005, value * 0.01),
  );
}

function bahan(seed: number, level: Level): Problem {
  if (level === 1) {
    const F = take(seed, 1, [1000, 2000, 5000, 10000, 50000]);
    const A = take(seed, 2, [0.5, 1, 2, 4, 5]);
    const value = F / (A * 1e-4) / 1e6;
    return problem(
      `Gaya tarik ${F} N pada batang berpenampang ${fmt(A)} cm². Tegangan (MPa)?`,
      "σ = F/A. 1 cm² = 10⁻⁴ m², 1 MPa = 10⁶ Pa.",
      value,
      "Ubah luas ke m² dulu.",
      [`A = ${fmt(A)} × 10⁻⁴ m².`, `σ = ${F} / (${fmt(A)} × 10⁻⁴) = ${fmt(value)} MPa.`],
    );
  }
  if (level === 2) {
    const sigma = take(seed, 1, [50, 100, 150, 200]);
    const L = take(seed, 2, [1, 2, 3, 5]);
    const value = (sigma / 200000) * L * 1000;
    return problem(
      `Batang baja (E = 200 GPa) panjang ${L} m menerima tegangan ${sigma} MPa. Pertambahan panjang (mm)?`,
      "ε = σ/E, ΔL = ε L. 200 GPa = 200.000 MPa.",
      value,
      "Regangan tanpa satuan, lalu kali panjang.",
      [`ε = ${sigma} / 200000 = ${fmt(sigma / 200000, 5)}.`, `ΔL = ε × ${L} m = ${fmt(value)} mm.`],
    );
  }
  const F1 = take(seed, 1, [100, 200, 300, 400, 600]);
  const d1 = take(seed, 2, [0.5, 1, 1.5, 2, 3]);
  const d2 = take(seed, 3, [0.5, 1, 2, 4]);
  const value = (F1 * d1) / d2;
  return problem(
    `Tuas setimbang: beban ${F1} N berjarak ${fmt(d1)} m dari tumpuan. Gaya di sisi lain berjarak ${fmt(d2)} m. Besar gaya itu (N)?`,
    "Στ = 0: F1 d1 = F2 d2.",
    value,
    "Lengan lebih panjang butuh gaya lebih kecil.",
    [`F2 = ${F1} × ${fmt(d1)} / ${fmt(d2)} = ${fmt(value)}.`],
  );
}

function linalg(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [1, 2, 3, -1, 0]);
    const b = take(seed, 2, [0, 1, 2, -2]);
    const c = take(seed, 3, [1, -1, 2, 3]);
    const d = take(seed, 4, [0, 1, 2, 4, -3]);
    const x = take(seed, 5, [1, 2, -1, 3]);
    const y = take(seed, 6, [0, 1, 2, -2]);
    const row = take(seed, 7, [1, 2]);
    const value = row === 1 ? a * x + b * y : c * x + d * y;
    return problem(
      `[[${a}, ${b}], [${c}, ${d}]] dikali vektor (${x}, ${y}). Komponen ${row === 1 ? "pertama" : "kedua"} hasilnya?`,
      "Baris kali kolom: komponen ke-i = baris ke-i · vektor.",
      value,
      "Kalikan pasangan, lalu jumlahkan.",
      [row === 1 ? `${a}×${x} + ${b}×${y} = ${value}.` : `${c}×${x} + ${d}×${y} = ${value}.`],
    );
  }
  if (level === 2) {
    const p = take(seed, 1, [2, 3, 4, 5, 1]);
    const q = take(seed, 2, [1, 2, 3, -1, -2]);
    const value = p + Math.abs(q);
    return problem(
      `Nilai eigen terbesar dari [[${p}, ${q}], [${q}, ${p}]]?`,
      "Untuk [[p, q], [q, p]] nilai eigennya p + q dan p − q.",
      value,
      "Vektor eigennya (1, 1) dan (1, −1). Coba kalikan.",
      [`λ = ${p} + (${q}) = ${p + q} dan λ = ${p} − (${q}) = ${p - q}.`, `Terbesar = ${value}.`],
    );
  }
  const a = take(seed, 1, [1, 2, 3, 4]);
  const b = take(seed, 2, [-1, 1, 2, 3]);
  const c = take(seed, 3, [0, 1, 2, -2]);
  const d = take(seed, 4, [1, 3, 5, -1]);
  const mode = take(seed, 5, [0, 1]);
  const value = mode === 0 ? a * d - b * c : a + d;
  return problem(
    `Matriks [[${a}, ${b}], [${c}, ${d}]]. Berapa ${mode === 0 ? "hasil kali" : "jumlah"} kedua nilai eigennya?`,
    "Hasil kali nilai eigen = determinan. Jumlahnya = trace (a + d).",
    value,
    "Tidak perlu mencari nilai eigen satu per satu.",
    [mode === 0 ? `det = ${a}×${d} − ${b}×${c} = ${value}.` : `tr = ${a} + ${d} = ${value}.`],
  );
}

function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  let b = base % mod;
  let e = exp;
  while (e > 0) {
    if (e & 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>= 1;
  }
  return result;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function modular(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [17, 23, 38, 45, 100, 123, 365, 1000, -7]);
    const n = take(seed, 2, [3, 5, 7, 9, 12, 24]);
    const value = ((a % n) + n) % n;
    return problem(
      `${a} mod ${n}?`,
      "Sisa pembagian, antara 0 dan n−1.",
      value,
      a < 0 ? "Untuk bilangan negatif, tambahkan n sampai sisanya tidak negatif." : "Kurangi kelipatan n terbesar.",
      [`${a} = ${Math.floor(a / n)} × ${n} + ${value}.`],
    );
  }
  if (level === 2) {
    const g = take(seed, 1, [2, 3, 4, 6, 7, 9, 12]);
    const x = take(seed, 2, [5, 7, 8, 11, 13]);
    const y = take(seed, 3, [3, 4, 9, 10, 17]);
    const a = g * x;
    const b = g * y;
    const value = gcd(a, b);
    return problem(
      `FPB(${a}, ${b})?`,
      "Algoritma Euclid: FPB(a, b) = FPB(b, a mod b).",
      value,
      "Ulangi sampai sisanya nol; pembagi terakhir adalah FPB.",
      [`FPB(${a}, ${b}) = ${value}.`],
    );
  }
  const base = take(seed, 1, [2, 3, 5, 7]);
  const exp = take(seed, 2, [3, 4, 5, 6, 8, 10]);
  const mod = take(seed, 3, [5, 7, 11, 13]);
  const value = modPow(base, exp, mod);
  const rows: string[] = [];
  let acc = 1;
  for (let i = 1; i <= exp; i++) {
    acc = (acc * base) % mod;
    rows.push(`${base}^${i} ≡ ${acc}`);
  }
  return problem(
    `${base}^${exp} mod ${mod}?`,
    "Kalikan berulang dan ambil sisa di setiap langkah.",
    value,
    "Angka tidak perlu meledak: sisa dulu, baru kali lagi.",
    [rows.join(", ") + ` (mod ${mod}).`],
  );
}

function entropi(seed: number, level: Level): Problem {
  if (level === 1) {
    const k = take(seed, 1, [1, 2, 3, 4, 5, 6, 10]);
    return problem(
      `Kejadian berpeluang 1/${2 ** k}. Berapa bit informasinya?`,
      "I = −log₂ p.",
      k,
      "Berapa kali dibelah dua sampai ke peluang itu?",
      [`1/${2 ** k} = 2^−${k}.`, `I = ${k} bit.`],
    );
  }
  if (level === 2) {
    const [label, h] = take(seed, 1, [
      ["1/2, 1/2", 1],
      ["1/2, 1/4, 1/4", 1.5],
      ["1/4, 1/4, 1/4, 1/4", 2],
      ["1/2, 1/4, 1/8, 1/8", 1.75],
      ["1/2, 1/8, 1/8, 1/8, 1/8", 2],
      ["delapan peluang 1/8", 3],
      ["1, 0", 0],
      ["1/4, 3/4 (pakai log₂ 3 ≈ 1,585)", 0.811],
    ] as const);
    return problem(
      `Entropi (bit) untuk sebaran peluang ${label}?`,
      "H = −Σ p log₂ p.",
      h,
      "Tiap suku: peluang × bit kejutannya.",
      [`H = ${fmt(h, 3)} bit.`],
      0.01,
    );
  }
  const k = take(seed, 1, [0, 1, 2, 3, 4, 5]);
  const value = k * 0.693;
  return problem(
    `Model memberi peluang 1/${2 ** k} pada jawaban benar. Cross-entropy loss (log natural)? Pakai ln 2 ≈ 0,693.`,
    "Loss = −ln q.",
    value,
    "−ln(1/2^k) = k ln 2.",
    [`−ln(1/${2 ** k}) = ${k} × 0,693 = ${fmt(value, 3)}.`],
    0.01,
  );
}

function stokastik(seed: number, level: Level): Problem {
  if (level === 1) {
    const sd = take(seed, 1, [0.5, 1, 2, 3]);
    const n = take(seed, 2, [4, 9, 16, 25, 100, 400]);
    const value = sd * Math.sqrt(n);
    return problem(
      `Tiap langkah acak independen bersimpangan baku ${fmt(sd)}. Simpangan baku jumlah ${n} langkah?`,
      "σ_n = σ √n.",
      value,
      "Varians yang dijumlah, jadi simpangan baku tumbuh akar n.",
      [`√${n} = ${Math.sqrt(n)}.`, `σ = ${fmt(sd)} × ${Math.sqrt(n)} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const p = take(seed, 1, [0.4, 0.5, 0.55, 0.6, 0.7]);
    const n = take(seed, 2, [10, 20, 50, 100]);
    const value = n * (2 * p - 1);
    return problem(
      `Random walk: tiap langkah +1 dengan peluang ${fmt(p)}, −1 sisanya. Harapan posisi setelah ${n} langkah?`,
      "E[langkah] = p − (1 − p). Kalikan n.",
      value,
      "Harapan bisa negatif jika peluang naik di bawah 0,5.",
      [`E[langkah] = ${fmt(2 * p - 1)}.`, `E[posisi] = ${n} × ${fmt(2 * p - 1)} = ${fmt(value)}.`],
    );
  }
  const a = take(seed, 1, [0.9, 0.8, 0.7, 0.5]);
  const b = take(seed, 2, [0.1, 0.2, 0.3, 0.5]);
  const value = a * a + (1 - a) * b;
  return problem(
    `Rantai Markov dua keadaan, Cerah dan Hujan. P(cerah → cerah) = ${fmt(a)}, P(hujan → cerah) = ${fmt(b)}. Hari ini cerah. Peluang lusa cerah?`,
    "Jumlahkan dua jalur: C→C→C dan C→H→C.",
    value,
    "Jalur lewat hujan memakai 1 − P(cerah → cerah).",
    [`C→C→C = ${fmt(a)} × ${fmt(a)} = ${fmt(a * a, 3)}.`, `C→H→C = ${fmt(1 - a)} × ${fmt(b)} = ${fmt((1 - a) * b, 3)}.`, `Jumlah = ${fmt(value, 3)}.`],
    0.005,
  );
}

function kendali(seed: number, level: Level): Problem {
  if (level === 1) {
    const K = take(seed, 1, [1, 3, 4, 9, 19, 24, 49, 99]);
    const value = 1 / (1 + K);
    return problem(
      `Kendali P dengan penguatan total K = ${K}, masukan tangga satuan. Galat tunak?`,
      "e_ss = 1 / (1 + K).",
      value,
      "K besar mengecilkan galat, tetapi tidak pernah nol tanpa suku integral.",
      [`e_ss = 1 / ${1 + K} = ${fmt(value, 3)}.`],
      0.002,
    );
  }
  if (level === 2) {
    const final = take(seed, 1, [10, 20, 50, 100]);
    const k = take(seed, 2, [1, 2, 3, 4]);
    const e = [0, 0.37, 0.14, 0.05, 0.02][k] ?? 0;
    const value = final * (1 - e);
    return problem(
      `Sistem orde satu menuju ${final}, konstanta waktu τ. Berapa nilainya pada t = ${k}τ? Pakai e⁻¹ = 0,37, e⁻² = 0,14, e⁻³ = 0,05, e⁻⁴ = 0,02.`,
      "y = y_akhir (1 − e^{−t/τ}).",
      value,
      `t/τ = ${k}.`,
      [`1 − e^−${k} = ${fmt(1 - e)}.`, `y = ${final} × ${fmt(1 - e)} = ${fmt(value)}.`],
    );
  }
  const kp = take(seed, 1, [2, 5, 10]);
  const ki = take(seed, 2, [0.5, 1, 2]);
  const err = take(seed, 3, [0.5, 1, 2, -1]);
  const integ = take(seed, 4, [2, 4, 10]);
  const value = kp * err + ki * integ;
  return problem(
    `Pengendali PI: Kp = ${kp}, Ki = ${fmt(ki)}. Galat sekarang ${fmt(err)}, integral galat sejauh ini ${integ}. Keluaran u?`,
    "u = Kp·e + Ki·∫e dt.",
    value,
    "Suku P memakai galat sekarang, suku I memakai tumpukannya.",
    [`P: ${kp} × ${fmt(err)} = ${fmt(kp * err)}.`, `I: ${fmt(ki)} × ${integ} = ${fmt(ki * integ)}.`, `u = ${fmt(value)}.`],
  );
}

function sinyal(seed: number, level: Level): Problem {
  if (level === 1) {
    const f = take(seed, 1, [100, 440, 1000, 3400, 4000, 8000, 20000]);
    return problem(
      `Sinyal berfrekuensi maksimum ${f} Hz. Laju sampling harus lebih dari berapa Hz?`,
      "Nyquist: fs > 2 f_maks.",
      2 * f,
      "Dua kali frekuensi tertinggi, dan dalam praktik lebih besar lagi.",
      [`2 × ${f} = ${2 * f} Hz.`],
    );
  }
  if (level === 2) {
    const fs = take(seed, 1, [500, 800, 1000, 2000]);
    const r = take(seed, 2, [0.6, 0.7, 0.9, 1.1, 1.25, 1.4]);
    const f = fs * r;
    const value = Math.abs(f - Math.round(f / fs) * fs);
    return problem(
      `Sinyal ${fmt(f)} Hz dicuplik pada ${fs} Hz. Tampak sebagai frekuensi berapa (Hz)?`,
      "Alias = |f − k fs|, pilih k bulat terdekat ke f/fs.",
      value,
      "Hasilnya harus di antara 0 dan fs/2.",
      [`k = ${Math.round(f / fs)}.`, `|${fmt(f)} − ${Math.round(f / fs) * fs}| = ${fmt(value)} Hz.`],
    );
  }
  const mode = take(seed, 1, [0, 1]);
  if (mode === 0) {
    const n = take(seed, 2, [4, 8, 10, 12, 16]);
    return problem(`ADC ${n} bit punya berapa tingkat kuantisasi?`, "L = 2^n.", 2 ** n, "Tiap bit menggandakan jumlah tingkat.", [`2^${n} = ${2 ** n}.`]);
  }
  const fs = take(seed, 2, [1000, 8000, 44100, 48000]);
  const N = take(seed, 3, [100, 1000, 1024, 4096]);
  const value = fs / N;
  return problem(
    `DFT dengan ${N} cuplikan pada fs = ${fs} Hz. Resolusi frekuensinya (Hz)?`,
    "Δf = fs / N.",
    value,
    "Lebih banyak cuplikan, jarak frekuensi lebih rapat.",
    [`${fs} / ${N} = ${fmt(value, 3)} Hz.`],
    Math.max(0.01, value * 0.005),
  );
}

function kuantum(seed: number, level: Level): Problem {
  if (level === 1) {
    const alpha = take(seed, 1, [0.6, 0.8, 0.5, 0.3, 0.9, 0.1]);
    const value = 1 - alpha * alpha;
    return problem(
      `Qubit α|0⟩ + β|1⟩ dengan α = ${fmt(alpha)}. Peluang hasil ukur 1?`,
      "|α|² + |β|² = 1. P(1) = |β|².",
      value,
      "Kuadratkan α dulu, lalu kurangkan dari 1.",
      [`P(0) = ${fmt(alpha * alpha)}.`, `P(1) = 1 − ${fmt(alpha * alpha)} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const n = take(seed, 1, [2, 3, 4, 5, 8, 10, 16, 20]);
    return problem(
      `Berapa banyak amplitudo yang dibutuhkan untuk menulis keadaan ${n} qubit?`,
      "Tiap qubit menggandakan jumlah keadaan dasar.",
      2 ** n,
      "2 pangkat banyak qubit.",
      [`2^${n} = ${2 ** n}.`],
    );
  }
  const e1 = take(seed, 1, [0.5, 1, 2, 3]);
  const lo = take(seed, 2, [1, 2, 3]);
  const hi = lo + take(seed, 3, [1, 2]);
  const value = (hi * hi - lo * lo) * e1;
  return problem(
    `Elektron dalam kotak, Eₙ = n² E₁ dengan E₁ = ${fmt(e1)} eV. Energi foton saat turun dari n = ${hi} ke n = ${lo} (eV)?`,
    "ΔE = (n_atas² − n_bawah²) E₁.",
    value,
    "Tingkat energi naik kuadrat, bukan rata.",
    [`${hi}² − ${lo}² = ${hi * hi - lo * lo}.`, `ΔE = ${hi * hi - lo * lo} × ${fmt(e1)} = ${fmt(value)} eV.`],
  );
}

export const EXTRA_GENS: Record<string, (seed: number, level: Level) => Problem> = {
  rantai,
  bunga,
  sampel,
  inferensi,
  regresi,
  bayes,
  diskrit,
  rotasi,
  termo,
  magnet,
  bahan,
  linalg,
  modular,
  entropi,
  stokastik,
  kendali,
  sinyal,
  kuantum,
};
