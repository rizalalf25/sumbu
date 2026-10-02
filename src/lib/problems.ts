import { fmt, problem, take, type Level, type Problem } from "./mathx";

const G = 10;
const PI = 3.14;

function lin(seed: number, level: Level): Problem {
  if (level === 1) {
    const p = take(seed, 1, [5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
    const n = take(seed, 2, [40, 60, 80, 100, 120, 150, 160, 200, 240, 250, 300, 400, 500, 800]);
    const value = (p / 100) * n;
    return problem(
      `Berapa ${p}% dari ${n}?`,
      "Jawaban angka saja.",
      value,
      "Ubah persen jadi desimal: bagi 100, baru dikali.",
      [`${p}% = ${fmt(p / 100)}.`, `${fmt(p / 100)} × ${n} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const price = take(seed, 1, [50, 80, 100, 120, 150, 200, 250, 400, 500, 750]);
    const d = take(seed, 2, [5, 10, 15, 20, 25, 30, 40, 50]);
    const value = price * (1 - d / 100);
    return problem(
      `Harga ${price} dapat diskon ${d}%. Berapa yang harus dibayar?`,
      "Diskon dihitung dari harga awal. Jawaban angka saja.",
      value,
      "Yang dibayar = harga × (1 − diskon/100), bukan harga − diskon.",
      [
        `Faktor bayar = 1 − ${d}/100 = ${fmt(1 - d / 100)}.`,
        `${price} × ${fmt(1 - d / 100)} = ${fmt(value)}.`,
      ],
    );
  }
  const mode = take(seed, 4, [0, 1]);
  if (mode === 0) {
    const price = take(seed, 1, [100, 200, 250, 400, 500, 800]);
    const d1 = take(seed, 2, [10, 20, 25, 30]);
    const d2 = take(seed, 3, [10, 20, 25]);
    const value = price * (1 - d1 / 100) * (1 - d2 / 100);
    return problem(
      `Harga ${price} diskon ${d1}%, lalu diskon lagi ${d2}% dari harga setelah diskon pertama. Berapa harga akhir?`,
      "Dua diskon beruntun bukan diskon (d1+d2).",
      value,
      "Kalikan dua faktor secara berurutan. Jangan jumlahkan persennya.",
      [
        `Setelah diskon pertama: ${price} × ${fmt(1 - d1 / 100)} = ${fmt(price * (1 - d1 / 100))}.`,
        `Lalu × ${fmt(1 - d2 / 100)} = ${fmt(value)}.`,
      ],
    );
  }
  const total = take(seed, 1, [60, 80, 100, 120, 150, 180, 200, 240, 300]);
  const a = take(seed, 2, [1, 2, 3]);
  const b = take(seed, 3, [2, 3, 4, 5]);
  const value = (total * Math.max(a, b)) / (a + b);
  return problem(
    `Uang ${total} dibagi dengan rasio ${a}:${b}. Berapa bagian yang lebih besar?`,
    "Rasio a:b artinya a bagian dan b bagian dari total a+b.",
    value,
    "Bagian terbesar = total × angka rasio terbesar / jumlah rasio.",
    [
      `Jumlah bagian = ${a}+${b} = ${a + b}.`,
      `Satu bagian = ${total}/${a + b} = ${fmt(total / (a + b))}.`,
      `Bagian besar = ${fmt(total / (a + b))} × ${Math.max(a, b)} = ${fmt(value)}.`,
    ],
  );
}

function aljabar(seed: number, level: Level): Problem {
  const xs = [-6, -4, -3, -2, -1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (level === 1) {
    const x = take(seed, 1, xs);
    const a = take(seed, 2, [2, 3, 4, 5, 6, 7]);
    const b = take(seed, 3, [-12, -8, -5, -3, -1, 2, 3, 4, 6, 8, 11]);
    const c = a * x + b;
    const btxt = b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`;
    return problem(
      `Selesaikan ${a}x ${btxt} = ${c}. Berapa x?`,
      "Lakukan operasi yang sama di kedua ruas.",
      x,
      "Pindahkan bilangan tanpa x dulu, baru bagi koefisien x.",
      [`${a}x = ${c} − (${b}) = ${c - b}.`, `x = ${c - b}/${a} = ${x}.`],
    );
  }
  if (level === 2) {
    const x = take(seed, 1, xs);
    const inside = take(seed, 2, [-4, -2, -1, 1, 2, 3, 5]);
    const a = take(seed, 3, [2, 3, 4, 5, 6]);
    const c = a * (x + inside);
    const sign = inside < 0 ? `− ${Math.abs(inside)}` : `+ ${inside}`;
    return problem(
      `Selesaikan ${a}(x ${sign}) = ${c}. Berapa x?`,
      "Bagi dulu dengan koefisien di luar kurung, atau uraikan.",
      x,
      "Bagi kedua ruas dengan angka di depan kurung.",
      [`x ${sign} = ${c}/${a} = ${c / a}.`, `x = ${c / a} − (${inside}) = ${x}.`],
    );
  }
  const x = take(seed, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, -2, -3]);
  const y = take(seed, 2, [1, 2, 3, 4, 5, 6, 8, -1, -4]);
  const s = x + y;
  const d = x - y;
  return problem(
    `Diketahui x + y = ${s} dan x − y = ${d}. Berapa x?`,
    "Jumlahkan kedua persamaan supaya y hilang.",
    x,
    "x = (jumlah + selisih) / 2.",
    [`(x+y) + (x−y) = ${s} + (${d}) = ${s + d}.`, `2x = ${s + d}, jadi x = ${x}.`, `Cek: y = ${y}.`],
  );
}

function fungsi(seed: number, level: Level): Problem {
  if (level < 3) {
    const m = take(seed, 1, [-3, -2, -1, 1, 2, 3, 4, 5]);
    const c = take(seed, 2, [-6, -3, -1, 0, 2, 4, 5, 8]);
    const k = take(seed, 3, [-2, -1, 0, 1, 2, 3, 4, 5, 6]);
    const value = m * k + c;
    const ctext = c < 0 ? `− ${Math.abs(c)}` : `+ ${c}`;
    if (level === 1) {
      return problem(
        `f(x) = ${m}x ${ctext}. Berapa f(${k})?`,
        "Masukkan x, jangan berhenti di rumus.",
        value,
        "Ganti x dengan angka, lalu hitung.",
        [`f(${k}) = ${m}×${k} ${ctext} = ${value}.`],
      );
    }
    const x1 = take(seed, 4, [0, 1, 2, -2]);
    const dx = take(seed, 5, [1, 2, 3, 4]);
    const x2 = x1 + dx;
    const y1 = m * x1 + c;
    const y2 = m * x2 + c;
    return problem(
      `Garis melalui (${x1}, ${y1}) dan (${x2}, ${y2}). Berapa gradiennya?`,
      "Gradien = perubahan y / perubahan x.",
      m,
      "m = (y2 − y1) / (x2 − x1).",
      [`Δy = ${y2} − (${y1}) = ${y2 - y1}.`, `Δx = ${x2} − (${x1}) = ${dx}.`, `m = ${y2 - y1}/${dx} = ${m}.`],
    );
  }
  const a = take(seed, 1, [1, 2, 3, 4, -1, -2]);
  const k = take(seed, 2, [-3, -2, -1, 2, 3, 4, 5]);
  const value = a * k * k;
  return problem(
    `f(x) = ${a}x². Berapa f(${k})?`,
    "Kuadrat dulu, baru kali koefisien.",
    value,
    "x² artinya x dikali x, bukan x dikali 2.",
    [`(${k})² = ${k * k}.`, `${a} × ${k * k} = ${value}.`],
  );
}

function eksponen(seed: number, level: Level): Problem {
  const powers: [number, number][] = [];
  for (const base of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const max = base <= 3 ? 8 : base <= 5 ? 4 : 3;
    for (let n = 2; n <= max; n++) powers.push([base, n]);
  }
  if (level === 1) {
    const [base, n] = take(seed, 1, powers);
    const value = base ** n;
    return problem(`Berapa ${base}^${n}?`, "Pangkat artinya perkalian berulang, bukan kali.", value, `${base}^${n} bukan ${base}×${n}.`, [
      `${base} dikali dirinya ${n} kali = ${value}.`,
    ]);
  }
  if (level === 2) {
    const [base, n] = take(seed, 1, powers);
    const value = base ** n;
    return problem(`${base}^x = ${value}. Berapa x?`, "Logaritma bertanya: dipangkatkan berapa.", n, `Kalikan ${base} sampai dapat ${value}.`, [
      `${base}^${n} = ${value}, jadi x = ${n}.`,
    ]);
  }
  const start = take(seed, 1, [3, 5, 6, 7, 8, 10, 12, 15, 20, 25, 40]);
  const t = take(seed, 2, [2, 3, 4, 5, 6]);
  const value = start * 2 ** t;
  return problem(
    `Populasi awal ${start} menjadi dua kali lipat setiap jam. Berapa setelah ${t} jam?`,
    "Lipat dua sebanyak t kali: kali 2^t.",
    value,
    "Jangan kali 2 saja. Kali 2, diulang sesuai jumlah jam.",
    [`Faktor = 2^${t} = ${2 ** t}.`, `${start} × ${2 ** t} = ${value}.`],
  );
}

const ANGLES = [30, 45, 60] as const;
function trigValue(fn: "sin" | "cos" | "tan", angle: number): number {
  const table: Record<string, number> = {
    sin30: 0.5,
    cos30: 0.866,
    tan30: 0.577,
    sin45: 0.707,
    cos45: 0.707,
    tan45: 1,
    sin60: 0.866,
    cos60: 0.5,
    tan60: 1.732,
  };
  return table[`${fn}${angle}`] ?? 0;
}

function trig(seed: number, level: Level): Problem {
  const note = "Pakai: sin30=0,5 cos30=0,866 tan30=0,577; sin45=cos45=0,707 tan45=1; sin60=0,866 cos60=0,5 tan60=1,732.";
  if (level === 1) {
    const fn = take(seed, 1, ["sin", "cos", "tan"] as const);
    const angle = take(seed, 2, ANGLES);
    const value = trigValue(fn, angle);
    return problem(`Berapa ${fn} ${angle}°?`, note, value, "Ini sudut istimewa. Hafal segitiga 30-60 dan 45.", [
      `${fn} ${angle}° = ${fmt(value, 3)}.`,
    ], 0.02);
  }
  if (level === 2) {
    const scale = take(seed, 1, [1, 2, 3, 4, 5]);
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
    ] as const;
    const [a0, b0, c0] = take(seed, 2, triples);
    const a = a0 * scale;
    const b = b0 * scale;
    const c = c0 * scale;
    const ask = take(seed, 3, [0, 1]);
    if (ask === 0) {
      return problem(
        `Segitiga siku-siku punya sisi tegak ${a} dan ${b}. Berapa sisi miring?`,
        "Pythagoras: miring² = tegak² + sisi².",
        c,
        "Jumlahkan kuadrat kedua sisi siku, lalu ambil akar.",
        [`${a}² + ${b}² = ${a * a + b * b}.`, `Akarnya ${c}.`],
      );
    }
    return problem(
      `Sisi miring ${c} dan satu sisi siku ${a}. Berapa sisi siku yang lain?`,
      "sisi² = miring² − sisi yang diketahui².",
      b,
      "Kurangkan kuadrat, baru diakarkan.",
      [`${c}² − ${a}² = ${c * c - a * a}.`, `Akarnya ${b}.`],
    );
  }
  const angle = take(seed, 1, ANGLES);
  const d = take(seed, 2, [10, 12, 15, 20, 30, 40]);
  const value = d * trigValue("tan", angle);
  return problem(
    `Jarak ke gedung ${d} m. Sudut elevasi ke puncak ${angle}°. Berapa tinggi gedung dalam meter?`,
    note + " Tinggi = jarak × tan sudut.",
    value,
    "Gambar siku-siku: depan = tinggi, samping = jarak.",
    [`tan ${angle}° = ${fmt(trigValue("tan", angle), 3)}.`, `tinggi = ${d} × ${fmt(trigValue("tan", angle), 3)} = ${fmt(value)}.`],
    0.05,
  );
}

function geometri(seed: number, level: Level): Problem {
  if (level === 1) {
    const kind = take(seed, 1, [0, 1]);
    if (kind === 0) {
      const p = take(seed, 2, [4, 5, 6, 8, 10, 12, 15]);
      const l = take(seed, 3, [3, 4, 5, 6, 7, 9]);
      return problem(`Persegi panjang ${p} × ${l}. Berapa luasnya?`, "Luas, bukan keliling.", p * l, "Luas = panjang × lebar.", [
        `${p} × ${l} = ${p * l}.`,
      ]);
    }
    const base = take(seed, 2, [6, 8, 10, 12, 14, 16, 20]);
    const h = take(seed, 3, [3, 4, 5, 6, 8, 9]);
    return problem(`Segitiga alas ${base} dan tinggi ${h}. Berapa luasnya?`, "Jangan lupa 1/2.", (base * h) / 2, "Luas = ½ × alas × tinggi.", [
      `½ × ${base} × ${h} = ${fmt((base * h) / 2)}.`,
    ]);
  }
  if (level === 2) {
    const r = take(seed, 1, [2, 3, 4, 5, 6, 7, 8, 10, 12]);
    const value = PI * r * r;
    return problem(`Jari-jari lingkaran ${r}. Berapa luasnya?`, "Pakai π = 3,14. Luas = π r².", value, "Kuadratkan jari-jari dulu, baru kali 3,14.", [
      `r² = ${r * r}.`, `3,14 × ${r * r} = ${fmt(value)}.`,
    ]);
  }
  const scale = take(seed, 1, [1, 2, 3, 5]);
  const [a, b, c] = take(seed, 2, [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [9, 12, 15],
    [8, 15, 17],
  ] as const);
  return problem(
    `Sisi siku-siku ${a * scale} dan ${b * scale}. Berapa hipotenusa?`,
    "a² + b² = c².",
    c * scale,
    "Jangan jumlahkan sisi lalu dibagi dua.",
    [`${a * scale}² + ${b * scale}² = ${a * a * scale * scale + b * b * scale * scale}.`, `Akar = ${c * scale}.`],
  );
}

function barisan(seed: number, level: Level): Problem {
  const a = take(seed, 1, [2, 3, 4, 5, 7, 8, 10, 12]);
  const d = take(seed, 2, [2, 3, 4, 5, 6, -2, -3]);
  const n = take(seed, 3, [5, 6, 8, 10, 12, 15]);
  if (level === 1) {
    const value = a + (n - 1) * d;
    return problem(
      `Barisan aritmetika suku pertama ${a}, beda ${d}. Berapa suku ke-${n}?`,
      "U_n = a + (n−1)d.",
      value,
      "Beda ditambah sebanyak (n−1), bukan n.",
      [`(n−1)d = ${n - 1} × ${d} = ${(n - 1) * d}.`, `U_${n} = ${a} + (${(n - 1) * d}) = ${value}.`],
    );
  }
  if (level === 2) {
    const value = (n / 2) * (2 * a + (n - 1) * d);
    return problem(
      `Jumlah ${n} suku pertama barisan aritmetika, a = ${a}, beda ${d}. Berapa jumlahnya?`,
      "S_n = n/2 × (2a + (n−1)d).",
      value,
      "Ini jumlah, bukan suku terakhir saja.",
      [`2a + (n−1)d = ${2 * a + (n - 1) * d}.`, `S = ${n}/2 × itu = ${fmt(value)}.`],
    );
  }
  const r = take(seed, 4, [2, 3]);
  const n2 = take(seed, 5, [3, 4, 5]);
  const a2 = take(seed, 6, [1, 2, 3, 4, 5]);
  const value = a2 * (r ** n2 - 1) / (r - 1);
  return problem(
    `Deret geometri suku pertama ${a2}, rasio ${r}. Berapa jumlah ${n2} suku pertama?`,
    "S = a (r^n − 1) / (r − 1).",
    value,
    "Rasio dikali tiap langkah, bukan ditambah.",
    [`r^n = ${r ** n2}.`, `S = ${a2} × (${r ** n2} − 1) / ${r - 1} = ${fmt(value)}.`],
  );
}

function limit(seed: number, level: Level): Problem {
  if (level === 1) {
    const m = take(seed, 1, [2, 3, 4, 5, -2]);
    const c = take(seed, 2, [-5, -1, 0, 2, 4, 7]);
    const a = take(seed, 3, [-2, -1, 0, 1, 2, 3, 4]);
    const value = m * a + c;
    const ctext = c < 0 ? `− ${Math.abs(c)}` : `+ ${c}`;
    return problem(
      `Berapa limit x → ${a} dari ${m}x ${ctext}?`,
      "Polinom boleh langsung disubstitusi.",
      value,
      "Ganti x dengan angka yang didekati.",
      [`${m}×${a} ${ctext} = ${value}.`],
    );
  }
  const a = take(seed, 1, [1, 2, 3, 4, 5, 6, 8, -2, -3]);
  if (level === 2) {
    return problem(
      `Berapa limit x → ${a} dari (x² − ${a * a}) / (x − ${a === 0 ? "0" : `(${a})`})?`,
      "Bentuk 0/0. Faktorkan dulu. Jika a negatif, x − (a) = x + |a|.",
      2 * a,
      "x² − a² = (x−a)(x+a). Corek (x−a).",
      [`Setelah dicorek: x + (${a}).`, `Di x = ${a}: ${a} + (${a}) = ${2 * a}.`],
    );
  }
  return problem(
    `Berapa limit h → 0 dari ((${a}+h)² − ${a * a}) / h?`,
    "Ini definisi turunan x² di x = a.",
    2 * a,
    "Uraikan (a+h)² = a² + 2ah + h².",
    [`Pembilang = 2·${a}·h + h².`, `Bagi h: 2·${a} + h → ${2 * a}.`],
  );
}

function turunan(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [1, 2, 3, 4, 5]);
    const n = take(seed, 2, [2, 3, 4, 5]);
    const x = take(seed, 3, [1, 2, 3, -1, -2]);
    const value = a * n * x ** (n - 1);
    return problem(
      `f(x) = ${a}x^${n}. Berapa f'(${x})?`,
      "Aturan pangkat: koefisien kali pangkat, pangkat turun 1.",
      value,
      "Turunkan dulu, baru masukkan angka.",
      [`f'(x) = ${a * n} x^${n - 1}.`, `Di x = ${x}: ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const a = take(seed, 1, [1, 2, 3]);
    const b = take(seed, 2, [-4, -2, 1, 3, 5]);
    const x = take(seed, 3, [-2, -1, 1, 2, 3, 4]);
    const value = 2 * a * x + b;
    const btxt = b < 0 ? `− ${Math.abs(b)}x` : `+ ${b}x`;
    return problem(
      `f(x) = ${a}x² ${btxt}. Berapa f'(${x})?`,
      "Turunan jumlah = jumlah turunan.",
      value,
      "Turunan x² adalah 2x. Turunan cx adalah c.",
      [`f'(x) = ${2 * a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}.`, `Di x=${x}: ${fmt(value)}.`],
    );
  }
  const t = take(seed, 1, [1, 2, 3, 4, 5, 6]);
  const a = take(seed, 2, [1, 2, 3]);
  const value = 2 * a * t;
  return problem(
    `Posisi s(t) = ${a} t² meter, t dalam detik. Berapa kecepatan di t = ${t} sekon?`,
    "Kecepatan adalah turunan posisi.",
    value,
    "v = ds/dt = 2 a t.",
    [`v(t) = ${2 * a} t.`, `v(${t}) = ${value} m/s.`],
  );
}

function integral(seed: number, level: Level): Problem {
  const coef = take(seed, 1, [1, 2, 3, 4, 5, 6, 8]);
  if (level === 1) {
    const a = take(seed, 2, [2, 3, 4, 5, 6, 8, 10, 12]);
    const value = (coef * a * a) / 2;
    const label = coef === 1 ? "x" : `${coef}x`;
    return problem(
      `Hitung integral dari 0 sampai ${a} untuk fungsi ${label}.`,
      "∫ c x dx = c x²/2. Batas atas dikurangi batas bawah.",
      value,
      "Antiturunan c x adalah c x²/2.",
      [`Di batas ${a}: ${coef} × ${a * a} / 2 = ${fmt(value)}.`, "Di 0 hasilnya 0."],
    );
  }
  if (level === 2) {
    const a = take(seed, 2, [1, 2, 3, 4, 5, 6]);
    const value = (coef * a ** 3) / 3;
    const label = coef === 1 ? "x²" : `${coef}x²`;
    return problem(
      `Hitung integral dari 0 sampai ${a} untuk fungsi ${label}.`,
      "∫ c x² dx = c x³/3.",
      value,
      "Pangkat naik satu, lalu bagi dengan pangkat baru.",
      [`${coef} × ${a ** 3} / 3 = ${fmt(value)}.`],
    );
  }
  const lo = take(seed, 2, [0, 1, 2, 3]);
  const hi = lo + take(seed, 3, [1, 2, 3, 4, 5]);
  const value = coef * (hi * hi - lo * lo);
  const label = coef === 1 ? "2x" : `${2 * coef}x`;
  return problem(
    `Hitung integral dari ${lo} sampai ${hi} untuk fungsi ${label}.`,
    "Antiturunan 2c x adalah c x².",
    value,
    "Hitung antiturunan di batas atas, kurangi batas bawah.",
    [`${coef} × (${hi}² − ${lo}²) = ${fmt(value)}.`],
  );
}

function peluang(seed: number, level: Level): Problem {
  if (level === 1) {
    const red = take(seed, 1, [1, 2, 3, 4, 5]);
    const blue = take(seed, 2, [1, 2, 3, 4, 5, 6]);
    const value = red / (red + blue);
    return problem(
      `Kantong berisi ${red} bola merah dan ${blue} bola biru. Peluang mengambil merah dalam satu cabutan acak?`,
      "Jawaban desimal. Contoh 0,5.",
      value,
      "P = yang diinginkan / total bola.",
      [`Total = ${red + blue}.`, `P = ${red}/${red + blue} = ${fmt(value)}.`],
      0.02,
    );
  }
  if (level === 2) {
    const target = take(seed, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const ways: Record<number, number> = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };
    return problem(
      `Dua dadu adil dilempar. Berapa banyak hasil yang jumlahnya ${target}?`,
      "Ini banyaknya cara, bukan peluang. Total ruang sampel 36.",
      ways[target] ?? 0,
      "Daftar pasangan (dadu1, dadu2).",
      [`Ada ${ways[target]} pasangan. Peluangnya nanti ${ways[target]}/36 kalau ditanya peluang.`],
    );
  }
  const pairs: [number, number, number][] = [
    [5, 2, 10],
    [6, 2, 15],
    [6, 3, 20],
    [7, 2, 21],
    [8, 2, 28],
    [8, 3, 56],
    [9, 2, 36],
    [10, 2, 45],
    [10, 3, 120],
  ];
  const [n, k, value] = take(seed, 1, pairs);
  return problem(
    `Berapa kombinasi C(${n}, ${k}), yaitu banyak cara memilih ${k} dari ${n} tanpa memedulikan urutan?`,
    "C(n,k) = n! / (k! (n−k)!).",
    value,
    "Urutan tidak dihitung dua kali. Itu bedanya dengan permutasi.",
    [`C(${n}, ${k}) = ${value}.`],
  );
}

function vektor(seed: number, level: Level): Problem {
  const triples = [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
    [9, 12, 15],
    [7, 24, 25],
    [20, 21, 29],
  ] as const;
  if (level === 1) {
    const [x, y, m] = take(seed, 1, triples);
    const s = take(seed, 2, [1, -1]);
    return problem(
      `Berapa panjang vektor (${s * x}, ${y})?`,
      "Panjang = akar(x² + y²). Tanda minus tidak mengubah kuadrat.",
      m,
      "Kuadratkan tiap komponen, jumlahkan, akar.",
      [`${s * x}² + ${y}² = ${x * x + y * y}.`, `Akar = ${m}.`],
    );
  }
  if (level === 2) {
    const x1 = take(seed, 1, [-4, -2, -1, 1, 2, 3, 4, 5]);
    const y1 = take(seed, 2, [-3, -1, 0, 2, 3, 4]);
    const x2 = take(seed, 3, [-3, -2, 1, 2, 4, 5]);
    const y2 = take(seed, 4, [-2, 0, 1, 3, 4]);
    const value = x1 * x2 + y1 * y2;
    return problem(
      `Hitung dot product (${x1}, ${y1}) · (${x2}, ${y2}).`,
      "x1 x2 + y1 y2. Bukan panjang.",
      value,
      "Kalikan komponen sepasang, lalu jumlahkan.",
      [`${x1}×${x2} + ${y1}×${y2} = ${value}.`],
    );
  }
  const a = take(seed, 1, [1, 2, 3, 4, 5]);
  const b = take(seed, 2, [-2, -1, 0, 2, 3]);
  const c = take(seed, 3, [1, 2, 4, -3]);
  const d = take(seed, 4, [2, 3, 5, -1]);
  const value = a * d - b * c;
  return problem(
    `Determinan matriks [[${a}, ${b}], [${c}, ${d}]].`,
    "det = ad − bc.",
    value,
    "Diagonal utama dikali, diagonal lain dikurangi.",
    [`${a}×${d} − (${b})×(${c}) = ${value}.`],
  );
}

function satuan(seed: number, level: Level): Problem {
  if (level === 1) {
    const v = take(seed, 1, [18, 36, 54, 72, 90, 108, 126, 144, 180, 216, 252, 288]);
    return problem(`Berapa m/s untuk kecepatan ${v} km/jam?`, "Bagi 3,6 untuk km/jam → m/s.", v / 3.6, "3,6 km/jam = 1 m/s.", [
      `${v} / 3,6 = ${fmt(v / 3.6)}.`,
    ]);
  }
  if (level === 2) {
    const cm = take(seed, 1, [25, 40, 50, 75, 80, 120, 150, 175, 200, 250, 275, 400, 1250, 1500, 2500]);
    return problem(`${cm} cm sama dengan berapa meter?`, "100 cm = 1 m.", cm / 100, "Bagi 100, bukan 1000.", [`${cm}/100 = ${fmt(cm / 100)}.`]);
  }
  const m = take(seed, 1, [2, 5, 8, 10, 12, 15, 18, 20, 25, 30, 36, 40, 50]);
  return problem(`${m} m/s sama dengan berapa km/jam?`, "Kali 3,6.", m * 3.6, "m/s ke km/jam dikali 3,6.", [
    `${m} × 3,6 = ${fmt(m * 3.6)}.`,
  ]);
}

function kinematika(seed: number, level: Level): Problem {
  const v0 = take(seed, 1, [0, 2, 4, 5, 8, 10, 12]);
  const a = take(seed, 2, [1, 2, 3, -1, -2]);
  const t = take(seed, 3, [2, 3, 4, 5, 6, 8]);
  if (level === 1) {
    const value = v0 + a * t;
    return problem(
      `Benda kecepatan awal ${v0} m/s, percepatan tetap ${a} m/s², selama ${t} s. Berapa kecepatan akhirnya (m/s)?`,
      `g tidak dipakai. v = v0 + a t.`,
      value,
      "Percepatan boleh negatif: itu perlambatan.",
      [`v = ${v0} + (${a})×${t} = ${value}.`],
    );
  }
  if (level === 2) {
    const value = v0 * t + 0.5 * a * t * t;
    return problem(
      `v0 = ${v0} m/s, a = ${a} m/s², t = ${t} s. Berapa perpindahan (m)?`,
      "s = v0 t + ½ a t².",
      value,
      "½ a t² sering terlupa. Hitung t² dulu.",
      [`v0 t = ${v0 * t}.`, `½ a t² = ${fmt(0.5 * a * t * t)}.`, `Jumlah = ${fmt(value)}.`],
    );
  }
  const v0b = take(seed, 1, [0, 6, 8, 10]);
  const s = take(seed, 2, [5, 8, 16, 20, 25, 45]);
  const ab = take(seed, 3, [2, 4, 5]);
  const value = Math.sqrt(v0b * v0b + 2 * ab * s);
  return problem(
    `v0 = ${v0b} m/s, a = ${ab} m/s², perpindahan ${s} m. Berapa kelajuan akhir?`,
    "v² = v0² + 2 a s. Jawaban positif.",
    value,
    "Jangan lupa akar di akhir.",
    [`v² = ${v0b ** 2} + 2×${ab}×${s} = ${v0b ** 2 + 2 * ab * s}.`, `v = ${fmt(value)}.`],
    0.05,
  );
}

function parabola(seed: number, level: Level): Problem {
  const v = take(seed, 1, [10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40]);
  const angle = take(seed, 2, ANGLES);
  const s = trigValue("sin", angle);
  const c = trigValue("cos", angle);
  const given = `g = ${G}. Pakai sinus/kosinus sudut istimewa (sin30=0,5, sin45=0,707, sin60=0,866).`;
  if (level === 1) {
    const value = (2 * v * s) / G;
    return problem(
      `Bola dilempar ${v} m/s pada sudut ${angle}° dari tanah datar. Berapa lama di udara (sekon)?`,
      given,
      value,
      "t = 2 v sinθ / g. Hanya komponen vertikal yang menentukan waktu.",
      [`sin ${angle}° = ${fmt(s, 3)}.`, `t = 2×${v}×${fmt(s, 3)} / ${G} = ${fmt(value)}.`],
      0.06,
    );
  }
  if (level === 2) {
    const value = (v * v * s * s) / (2 * G);
    return problem(
      `v = ${v} m/s, θ = ${angle}°. Berapa tinggi maksimum (m)?`,
      given,
      value,
      "H = v² sin²θ / (2g).",
      [`sin²θ = ${fmt(s * s, 3)}.`, `H = ${v * v} × itu / ${2 * G} = ${fmt(value)}.`],
      0.08,
    );
  }
  const sin2 = 2 * s * c;
  const value = (v * v * sin2) / G;
  return problem(
    `v = ${v} m/s, θ = ${angle}°, tanah datar. Berapa jarak mendatar (m)?`,
    given + " sin 2θ = 2 sinθ cosθ.",
    value,
    "R = v² sin 2θ / g.",
    [`sin 2θ = 2×${fmt(s, 3)}×${fmt(c, 3)} = ${fmt(sin2, 3)}.`, `R = ${v * v} × itu / ${G} = ${fmt(value)}.`],
    0.15,
  );
}

function newton(seed: number, level: Level): Problem {
  if (level === 1) {
    const m = take(seed, 1, [1, 2, 3, 4, 5, 8, 10]);
    const a = take(seed, 2, [1, 2, 3, 4, 0.5]);
    return problem(`Massa ${m} kg dipercepat ${fmt(a)} m/s². Berapa gaya total (N)?`, "ΣF = m a.", m * a, "Gaya total, bukan salah satu gaya saja.", [
      `F = ${m} × ${fmt(a)} = ${fmt(m * a)}.`,
    ]);
  }
  if (level === 2) {
    const m = take(seed, 1, [0.5, 1, 2, 2.5, 3, 4, 6, 8]);
    return problem(`Berapa berat benda ${fmt(m)} kg? Ambil g = ${G}. Jawaban dalam newton.`, "Berat = m g, bukan massa.", m * G, "Massa kg, berat newton.", [
      `w = ${fmt(m)} × ${G} = ${fmt(m * G)}.`,
    ]);
  }
  const m = take(seed, 1, [2, 4, 5]);
  const mu = take(seed, 2, [0.1, 0.2, 0.25, 0.5]);
  const a = take(seed, 3, [0.5, 1, 2]);
  const f = mu * m * G;
  const F = f + m * a;
  return problem(
    `Balok ${m} kg ditarik mendatar dengan ${fmt(F)} N. μ = ${fmt(mu)}, lantai datar, g = ${G}. Berapa percepatan (m/s²)?`,
    "Gesek = μ N dan N = mg pada lantai datar.",
    a,
    "a = (F − gesek) / m. Gesek menahan.",
    [`N = ${m * G} N.`, `gesek = ${fmt(mu)} × ${m * G} = ${fmt(f)} N.`, `a = (${fmt(F)} − ${fmt(f)}) / ${m} = ${fmt(a)}.`],
  );
}

function energi(seed: number, level: Level): Problem {
  if (level === 1) {
    const m = take(seed, 1, [1, 2, 3, 4, 5]);
    const v = take(seed, 2, [2, 3, 4, 6, 8, 10]);
    const value = 0.5 * m * v * v;
    return problem(`Massa ${m} kg, kelajuan ${v} m/s. Berapa energi kinetik (J)?`, "EK = ½ m v².", value, "Kuadratkan kelajuan, baru kali massa dan ½.", [
      `v² = ${v * v}.`, `EK = ½ × ${m} × ${v * v} = ${fmt(value)}.`,
    ]);
  }
  if (level === 2) {
    const m = take(seed, 1, [1, 2, 2.5, 4, 5]);
    const h = take(seed, 2, [1, 2, 3, 4, 5, 8, 10]);
    return problem(`Massa ${fmt(m)} kg di ketinggian ${h} m. g = ${G}. Energi potensial gravitasi (J)?`, "EP = m g h, acuan di tanah.", m * G * h, "Tiga faktor: massa, g, tinggi.", [
      `EP = ${fmt(m)} × ${G} × ${h} = ${fmt(m * G * h)}.`,
    ]);
  }
  const h = take(seed, 1, [0.2, 0.45, 0.8, 1.25, 1.8, 2.45, 3.2, 5, 7.2]);
  const value = Math.sqrt(2 * G * h);
  return problem(
    `Benda diam dijatuhkan dari ${fmt(h)} m. g = ${G}, gesekan abaikan. Berapa kelajuan saat sampai (m/s)?`,
    "½ m v² = m g h, massa coret.",
    value,
    "v = akar(2 g h).",
    [`2gh = ${fmt(2 * G * h)}.`, `v = ${fmt(value)}.`],
  );
}

function momentum(seed: number, level: Level): Problem {
  if (level === 1) {
    const m = take(seed, 1, [0.5, 1, 2, 3, 4, 5]);
    const v = take(seed, 2, [2, 3, 4, 5, 6, 8, 10]);
    return problem(`Momentum benda ${fmt(m)} kg yang bergerak ${v} m/s?`, "p = m v. Satuan kg·m/s.", m * v, "Momentum punya arah. Di soal ini ambil nilai searah gerak positif.", [
      `p = ${fmt(m)} × ${v} = ${fmt(m * v)}.`,
    ]);
  }
  if (level === 2) {
    const m1 = take(seed, 1, [1, 2, 3, 4]);
    const m2 = take(seed, 2, [1, 2, 3, 4]);
    const v1 = take(seed, 3, [2, 4, 6, 8, 10]);
    const value = (m1 * v1) / (m1 + m2);
    return problem(
      `Massa ${m1} kg kecepatan ${v1} m/s menumbuk massa ${m2} kg yang diam, lalu menempel. Berapa kecepatan bersama (m/s)?`,
      "Momentum kekal. Tidak ada gaya luar sepanjang garis tumbukan.",
      value,
      "v = (m1 v1) / (m1 + m2).",
      [`Momentum awal = ${m1 * v1}.`, `v = ${m1 * v1} / ${m1 + m2} = ${fmt(value)}.`],
    );
  }
  const F = take(seed, 1, [10, 20, 25, 40, 50, 100]);
  const dt = take(seed, 2, [0.1, 0.2, 0.4, 0.5, 2]);
  return problem(
    `Gaya rata-rata ${F} N bekerja selama ${fmt(dt)} s. Berapa impuls (N·s)?`,
    "Impuls = F Δt = perubahan momentum.",
    F * dt,
    "Perlama waktu, impuls membesar walau gaya sama.",
    [`J = ${F} × ${fmt(dt)} = ${fmt(F * dt)}.`],
  );
}

function gelombang(seed: number, level: Level): Problem {
  if (level === 1) {
    const f = take(seed, 1, [2, 4, 5, 10, 20, 50]);
    const lam = take(seed, 2, [0.2, 0.5, 1, 2, 3, 4]);
    return problem(`Frekuensi ${f} Hz, panjang gelombang ${fmt(lam)} m. Cepat rambat (m/s)?`, "v = f λ.", f * lam, "Jangan dibagi.", [
      `v = ${f} × ${fmt(lam)} = ${fmt(f * lam)}.`,
    ]);
  }
  if (level === 2) {
    const L = take(seed, 1, [0.1, 0.4, 0.9, 1.6, 2.5]);
    const root = Math.sqrt(L / G);
    const value = 2 * PI * root;
    return problem(
      `Bandul sederhana panjang ${fmt(L)} m, simpangan kecil. g = ${G}, π = 3,14. Periode (s)?`,
      "T = 2 π √(L/g). Massa tidak masuk.",
      value,
      "Akar dulu, baru kali 2π.",
      [`L/g = ${fmt(L / G, 3)}.`, `√ = ${fmt(root, 3)}.`, `T = 2×3,14×itu = ${fmt(value)}.`],
      0.05,
    );
  }
  const tension = take(seed, 1, [10, 40, 90, 160, 250]);
  const mu = take(seed, 2, [0.1, 0.4, 0.9]);
  const value = Math.sqrt(tension / mu);
  return problem(
    `Dawai tegangan ${tension} N, massa per panjang ${fmt(mu)} kg/m. Cepat rambat gelombang (m/s)?`,
    "v = √(T/μ).",
    value,
    "T di sini tegangan, bukan periode.",
    [`T/μ = ${fmt(tension / mu)}.`, `v = ${fmt(value)}.`],
    0.05,
  );
}

function fluida(seed: number, level: Level): Problem {
  if (level === 1) {
    const h = take(seed, 1, [1, 2, 3, 4, 5, 8, 10]);
    const value = (1000 * G * h) / 1000;
    return problem(
      `Kedalaman air ${h} m. ρ = 1000 kg/m³, g = ${G}. Berapa tekanan gauge (kPa), tanpa tekanan udara?`,
      "P = ρ g h. 1000 Pa = 1 kPa.",
      value,
      "Jangan lupa ρ air 1000, lalu ubah ke kPa dengan bagi 1000.",
      [`P = 1000×${G}×${h} = ${1000 * G * h} Pa = ${fmt(value)} kPa.`],
    );
  }
  if (level === 2) {
    const V = take(seed, 1, [0.001, 0.002, 0.005, 0.01, 0.02]);
    const value = 1000 * G * V;
    return problem(
      `Benda mendesak air laut tawar bervolume ${fmt(V, 3)} m³. ρ = 1000, g = ${G}. Gaya apung (N)?`,
      "Archimedes: F = ρ fluida × g × volume yang terdesak.",
      value,
      "Pakai volume terdesak, bukan selalu volume benda utuh.",
      [`F = 1000 × ${G} × ${fmt(V, 3)} = ${fmt(value)}.`],
    );
  }
  const A1 = take(seed, 1, [2, 4, 5, 6, 8]);
  const v1 = take(seed, 2, [1, 2, 3, 4]);
  const A2 = take(seed, 3, [1, 2]);
  const value = (A1 * v1) / A2;
  return problem(
    `Pipa luas penampang ${A1} cm² kecepatan air ${v1} m/s menyempit menjadi ${A2} cm². Kecepatan di bagian sempit (m/s)?`,
    "A1 v1 = A2 v2. Satuan luas sama jadi tidak perlu diubah.",
    value,
    "Pipa sempit, air lebih cepat.",
    [`${A1}×${v1} = ${A2} × v2.`, `v2 = ${fmt(value)}.`],
  );
}

function listrik(seed: number, level: Level): Problem {
  if (level === 1) {
    const I = take(seed, 1, [0.5, 1, 2, 3, 4, 5]);
    const R = take(seed, 2, [2, 3, 4, 5, 6, 10, 12]);
    return problem(`Arus ${fmt(I)} A melalui hambatan ${R} Ω. Tegangan (V)?`, "V = I R.", I * R, "Ohm: tegangan = arus kali hambatan.", [
      `V = ${fmt(I)} × ${R} = ${fmt(I * R)}.`,
    ]);
  }
  if (level === 2) {
    const mode = take(seed, 1, [0, 1]);
    const r1 = take(seed, 2, [2, 3, 4, 6, 10]);
    const r2 = take(seed, 3, [2, 3, 6, 12]);
    if (mode === 0) {
      return problem(`Dua hambatan ${r1} Ω dan ${r2} Ω tersusun seri. Hambatan pengganti (Ω)?`, "Seri: jumlahkan.", r1 + r2, "Seri seperti satu jalan, hambatan bertambah.", [
        `R = ${r1}+${r2} = ${r1 + r2}.`,
      ]);
    }
    const value = (r1 * r2) / (r1 + r2);
    return problem(`Dua hambatan ${r1} Ω dan ${r2} Ω tersusun paralel. Hambatan pengganti (Ω)?`, "Paralel: 1/R = 1/R1 + 1/R2.", value, "Hasil paralel lebih kecil daripada hambatan terkecil.", [
      `R = (${r1}×${r2}) / (${r1}+${r2}) = ${fmt(value)}.`,
    ]);
  }
  const q1 = take(seed, 1, [1, 2, 3, 4]);
  const q2 = take(seed, 2, [1, 2, 3]);
  const r = take(seed, 3, [0.3, 1]);
  const value = ((9e9 * q1 * q2) / (r * r)) * 1e-12;
  return problem(
    `Dua muatan ${q1} μC dan ${q2} μC terpisah ${fmt(r)} m. k = 9×10⁹. Besar gaya Coulomb (N)?`,
    "F = k |q1 q2| / r². Ubah μC ke coulomb: ×10⁻⁶.",
    value,
    "Jangan lupa kuadrat jarak, dan mikro artinya 10⁻⁶.",
    [`q1 q2 = ${q1 * q2}×10⁻¹².`, `k/r² × itu = ${fmt(value)} N.`],
    0.05,
  );
}

function optik(seed: number, level: Level): Problem {
  const pairs: [number, number, number][] = [];
  for (const f of [4, 5, 6, 8, 10, 12, 15, 16, 18, 20, 24, 30]) {
    pairs.push([f, 2 * f, 2 * f]);
    if (f % 2 === 0) pairs.push([f, (3 * f) / 2, 3 * f]);
    if (f % 3 === 0) pairs.push([f, (4 * f) / 3, 4 * f]);
  }
  const [f, s, sp] = take(seed, 1, pairs);
  if (level === 1) {
    return problem(
      `Lensa fokus ${f} cm, benda ${s} cm di depan lensa. Jarak bayangan (cm)?`,
      "1/f = 1/s + 1/s'. Semua dalam cm, konsisten.",
      sp,
      "Cari 1/s' = 1/f − 1/s, lalu balik.",
      [`1/${f} − 1/${s} = 1/${sp}.`, `s' = ${sp} cm.`],
    );
  }
  if (level === 2) {
    return problem(
      `s = ${s} cm, s' = ${sp} cm. Berapa perbesaran linear (nilai positif)?`,
      "m = |s'/s|.",
      sp / s,
      "Perbesaran tanpa tanda cukup ditanya di sini.",
      [`|${sp}/${s}| = ${fmt(sp / s)}.`],
    );
  }
  const n2 = take(seed, 2, [1.25, 1.5, 2, 2.5, 4]);
  const sinr = 0.5 / n2;
  return problem(
    `Cahaya dari udara (n=1) menuju medium n = ${fmt(n2)} dengan sudut datang 30°. Berapa sin sudut bias?`,
    "n1 sin i = n2 sin r. sin 30° = 0,5.",
    sinr,
    "Yang ditanya sin r, bukan r dalam derajat.",
    [`sin r = 0,5 / ${fmt(n2)} = ${fmt(sinr)}.`],
    0.02,
  );
}

function foton(seed: number, level: Level): Problem {
  const rows = [
    [1240, 1],
    [620, 2],
    [496, 2.5],
    [400, 3.1],
    [310, 4],
    [248, 5],
  ] as const;
  const [lam, e] = take(seed, 1, rows);
  if (level === 1) {
    return problem(
      `Panjang gelombang foton ${lam} nm. Berapa energinya dalam eV?`,
      "Pakai E (eV) ≈ 1240 / λ(nm).",
      e,
      "Makin pendek gelombang, makin besar energi.",
      [`E = 1240/${lam} = ${fmt(e)} eV.`],
      0.05,
    );
  }
  const phi = take(seed, 2, [0.5, 1, 1.5, 2]);
  const k = Math.max(0, e - phi);
  if (level === 2) {
    return problem(
      `Foton ${fmt(e)} eV mengenai logam fungsi kerja ${fmt(phi)} eV. Energi kinetik maksimum elektron (eV)?`,
      "K = E − φ jika E > φ, selain itu 0.",
      k,
      "Fungsi kerja adalah ongkos minimum untuk lepas.",
      [`K = ${fmt(e)} − ${fmt(phi)} = ${fmt(k)}.`],
    );
  }
  const over = e > phi ? 1 : 0;
  return problem(
    `E = ${fmt(e)} eV, φ = ${fmt(phi)} eV. Apakah elektron lepas? Jawab 1 jika ya, 0 jika tidak.`,
    "Lepas hanya jika energi foton lebih besar daripada fungsi kerja.",
    over,
    "Bandingkan dua angka. Tidak perlu rumus baru.",
    [over === 1 ? "E lebih besar, elektron lepas." : "E tidak cukup, tidak ada elektron lepas, K = 0."],
  );
}

function kompleks(seed: number, level: Level): Problem {
  const pairs = [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
    [9, 12, 15],
    [0, 5, 5],
    [7, 0, 7],
  ] as const;
  if (level === 1) {
    const [x, y, m] = take(seed, 1, pairs);
    const sy = take(seed, 2, [1, -1]);
    return problem(`Modulus bilangan kompleks ${x} + (${sy * y})i ?`, "|z| = √(x²+y²).", m, "Sama seperti panjang vektor.", [
      `${x}² + ${sy * y}² = ${m * m}.`, `|z| = ${m}.`,
    ]);
  }
  if (level === 2) {
    const a = take(seed, 1, [1, 2, 3, 4]);
    const b = take(seed, 2, [-2, -1, 1, 2, 3]);
    const c = take(seed, 3, [1, 2, -1, 3]);
    const d = take(seed, 4, [1, 2, 4, -2]);
    const value = a * c - b * d;
    return problem(
      `Bagian real dari (${a} + (${b})i)(${c} + (${d})i)?`,
      "(a+bi)(c+di) bagian real = ac − bd.",
      value,
      "i² = −1, itu yang membuat minus.",
      [`ac = ${a * c}, bd = ${b * d}.`, `real = ${a * c} − (${b * d}) = ${value}.`],
    );
  }
  const kind = take(seed, 1, [
    [3, 0, 0],
    [0, 4, 90],
    [0, -2, -90],
    [-5, 0, 180],
    [2, 2, 45],
    [2, -2, -45],
    [-2, 2, 135],
  ] as const);
  return problem(
    `Argumen (dalam derajat, antara −180 dan 180) dari ${kind[0]} + (${kind[1]})i ?`,
    "Argumen adalah sudut terhadap sumbu real positif.",
    kind[2],
    "Gambar dulu di bidang Argand, baru baca sudut.",
    [`Titik (${kind[0]}, ${kind[1]}) bersudut ${kind[2]}°.`],
  );
}

function deret(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [1, 2, 3, 4, 5, 6]);
    const n = take(seed, 2, [3, 4, 5, 6]);
    const value = a * (2 ** n - 1);
    return problem(
      `Jumlah geometri: suku pertama ${a}, rasio 2, sebanyak ${n} suku.`,
      "S = a (r^n − 1) / (r − 1).",
      value,
      "Untuk rasio 2, penyebutnya 1.",
      [`2^${n} − 1 = ${2 ** n - 1}.`, `S = ${a} × itu = ${value}.`],
    );
  }
  if (level === 2) {
    const a = take(seed, 1, [3, 4, 5, 6, 8, 10, 12]);
    return problem(
      `Deret geometri tak hingga, suku pertama ${a}, rasio 1/2. Jumlahnya?`,
      "Hanya boleh jika |r| < 1. S = a / (1−r).",
      a / 0.5,
      "1 − 1/2 = 1/2, jadi jumlah = a dibagi 1/2.",
      [`S = ${a} / (1/2) = ${fmt(a / 0.5)}.`],
    );
  }
  const x = take(seed, 1, [1, 0.5, 2]);
  const value = 1 + x + (x * x) / 2;
  return problem(
    `Hampiri e^x dengan tiga suku: 1 + x + x²/2, untuk x = ${fmt(x)}.`,
    "Ini polinom Taylor, bukan nilai e yang dihafal.",
    value,
    "Hitung suku x²/2 terpisah.",
    [`1 + ${fmt(x)} + ${fmt((x * x) / 2)} = ${fmt(value)}.`],
  );
}

function parsial(seed: number, level: Level): Problem {
  const a = take(seed, 1, [1, 2, 3, 4]);
  const x = take(seed, 2, [-2, -1, 1, 2, 3, 4]);
  const y = take(seed, 3, [-1, 1, 2, 3, 5]);
  if (level === 1) {
    const value = 2 * a * x * y;
    return problem(
      `f(x,y) = ${a} x² y. Berapa ∂f/∂x di (${x}, ${y})?`,
      "Saat turunan ke x, y dianggap konstanta.",
      value,
      "∂/∂x (x² y) = 2 x y.",
      [`∂f/∂x = ${2 * a} x y.`, `Di titik: ${2 * a}×${x}×${y} = ${value}.`],
    );
  }
  if (level === 2) {
    const value = a * x * x;
    return problem(
      `f(x,y) = ${a} x² y. Berapa ∂f/∂y di (${x}, ${y})?`,
      "Turunan ke y: x dibekukan.",
      value,
      "y muncul sekali, jadi turunannya menghilangkan y.",
      [`∂f/∂y = ${a} x² = ${value} di x=${x}. y tidak tersisa.`],
    );
  }
  const b = take(seed, 4, [1, 2, 3]);
  const fx = 2 * a * x * y;
  const fy = a * x * x + 2 * b * y;
  const dx = take(seed, 5, [0.1, 0.2, -0.1]);
  const dy = take(seed, 6, [0.1, -0.2, 0.2]);
  const value = fx * dx + fy * dy;
  return problem(
    `f = ${a} x² y + ${b} y². Di (${x}, ${y}), hampiri Δf untuk dx=${fmt(dx)}, dy=${fmt(dy)}.`,
    "df ≈ fx dx + fy dy.",
    value,
    "Hitung dua turunan parsial, kali perubahan masing-masing, jumlahkan.",
    [`fx = ${fx}, fy = ${fy}.`, `Δf ≈ ${fx}×${fmt(dx)} + ${fy}×${fmt(dy)} = ${fmt(value)}.`],
    0.05,
  );
}

function lipat(seed: number, level: Level): Problem {
  const A = take(seed, 1, [1, 2, 3, 4]);
  const B = take(seed, 2, [1, 2, 3, 4, 5]);
  if (level === 1) {
    const value = B * (A * A) / 2;
    return problem(
      `Hitung ∫ dari x=0 sampai ${A}, ∫ dari y=0 sampai ${B}, dari fungsi x.`,
      "Kerjakan integral dalam (y) dulu. Daerah persegi.",
      value,
      "∫_0^B x dy = x B, lalu ∫ x B dx.",
      [`Dalam: x×${B}.`, `Luar: ${B} × x²/2 dari 0 ke ${A} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const value = (A * B * B) / 2;
    return problem(
      `∫_0^${A} ∫_0^${B} y dy dx.`,
      "y tidak bergantung pada x.",
      value,
      "∫ y dy = y²/2.",
      [`∫_0^${B} y dy = ${B * B}/2.`, `Kali lebar x yaitu ${A}: ${fmt(value)}.`],
    );
  }
  const rho = take(seed, 3, [1, 2, 3, 4]);
  const value = rho * A * B;
  return problem(
    `Pelat persegi 0≤x≤${A}, 0≤y≤${B}, rapat massa konstan ${rho}. Massa pelat?`,
    "Massa = rapat × luas jika rapat seragam.",
    value,
    "Integral lipat dari konstanta adalah konstanta kali luas.",
    [`Luas = ${A * B}.`, `Massa = ${rho} × ${A * B} = ${value}.`],
  );
}

function matriks(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [1, 2, 3, 4, 5, -2]);
    const b = take(seed, 2, [0, 1, 2, -1, 3]);
    const c = take(seed, 3, [1, -2, 2, 4]);
    const d = take(seed, 4, [1, 2, 3, -3, 5]);
    return problem(`det [[${a}, ${b}], [${c}, ${d}]] = ?`, "ad − bc.", a * d - b * c, "Urutan pengurangan sering terbalik.", [
      `${a}×${d} − (${b}×${c}) = ${a * d - b * c}.`,
    ]);
  }
  const ax = take(seed, 1, [1, 2, 0, -1]);
  const ay = take(seed, 2, [0, 1, 2, 3]);
  const az = take(seed, 3, [0, 1, -1, 2]);
  const bx = take(seed, 4, [1, 0, 2]);
  const by = take(seed, 5, [1, 2, -1]);
  const bz = take(seed, 6, [0, 3, 1]);
  const cx = ay * bz - az * by;
  const cy = az * bx - ax * bz;
  const cz = ax * by - ay * bx;
  if (level === 2) {
    return problem(
      `a = (${ax}, ${ay}, ${az}), b = (${bx}, ${by}, ${bz}). Komponen z dari a × b?`,
      "k · (a×b) = ax by − ay bx.",
      cz,
      "Komponen z tidak memakai az atau bz.",
      [`${ax}×${by} − ${ay}×${bx} = ${cz}.`],
    );
  }
  const mag = Math.sqrt(cx * cx + cy * cy + cz * cz);
  return problem(
    `a=(${ax},${ay},${az}), b=(${bx},${by},${bz}). Besar |a×b|?`,
    "Hitung ketiga komponen, lalu panjang vektor itu.",
    mag,
    "Besar silang = luas jajar genjang yang direntang a dan b.",
    [`a×b = (${cx}, ${cy}, ${cz}).`, `|a×b| = ${fmt(mag)}.`],
    0.05,
  );
}

function medan(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [-2, -1, 0, 1, 2, 3, 4]);
    const b = take(seed, 2, [-3, -1, 1, 2, 5]);
    const c = take(seed, 3, [0, 1, -2, 3, 4]);
    return problem(
      `F = (${a} x, ${b} y, ${c} z). Berapa divergensi ∇·F?`,
      "Jumlahkan turunan tiap komponen terhadap variabelnya sendiri.",
      a + b + c,
      "∂(a x)/∂x = a, bukan a x.",
      [`∇·F = ${a} + (${b}) + (${c}) = ${a + b + c}.`],
    );
  }
  if (level === 2) {
    const c = take(seed, 1, [1, 2, 3, 4, 5]);
    return problem(
      `F = (${-c} y, ${c} x, 0). Komponen z dari curl F?`,
      "∇×F komponen z = ∂Fy/∂x − ∂Fx/∂y.",
      2 * c,
      "Fx = −c y, turunannya ke y adalah −c. Minus ketemu minus.",
      [`∂Fy/∂x = ${c}.`, `∂Fx/∂y = ${-c}.`, `Selisih = ${c} − (${-c}) = ${2 * c}.`],
    );
  }
  const a = take(seed, 1, [1, 2, 3, 4]);
  const x = take(seed, 2, [-2, 1, 2, 3, 5]);
  return problem(
    `f = ${a} x² + y². Komponen x dari gradien di x = ${x}?`,
    "∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z).",
    2 * a * x,
    "Gradien menunjuk arah naiknya f paling curam.",
    [`∂f/∂x = ${2 * a} x = ${2 * a * x} di x=${x}.`],
  );
}

function fluks(seed: number, level: Level): Problem {
  const L = take(seed, 1, [1, 2, 3]);
  if (level === 1) {
    const value = 3 * L ** 3;
    return problem(
      `F = (x, y, z). Fluks keluar melalui permukaan kubus sisi ${L} yang pusatnya di titik asal?`,
      "Divergensi Gauss: fluks tertutup = ∭ ∇·F dV.",
      value,
      "∇·F = 3, volume kubus L³.",
      [`∇·F = 1+1+1 = 3.`, `Volume = ${L ** 3}.`, `Fluks = ${value}.`],
    );
  }
  const a = take(seed, 2, [1, 2, 0]);
  const b = take(seed, 3, [0, 1, 2]);
  const c = take(seed, 4, [1, 3]);
  const div = a + b + c;
  return problem(
    `F = (${a} x, ${b} y, ${c} z) melalui permukaan tertutup kubus sisi ${L}. Fluks keluar?`,
    "Kalau divergensi konstan, fluks = divergensi × volume.",
    div * L ** 3,
    "Jangan hitung enam muka satu per satu kalau Gauss berlaku.",
    [`∇·F = ${div}.`, `Fluks = ${div} × ${L ** 3} = ${div * L ** 3}.`],
  );
}

function fourier(seed: number, level: Level): Problem {
  const n = take(seed, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
  const value = (2 * (-1) ** (n + 1)) / n;
  if (level === 1) {
    return problem(
      `f(x)=x pada (−π, π), bn = 2(−1)^{n+1}/n. Berapa b${n}?`,
      "Fungsi ganjil ini hanya punya suku sinus.",
      value,
      "Tanda berganti. Hitung (−1) pangkat n+1 dulu.",
      [`(−1)^${n + 1} = ${(-1) ** (n + 1)}.`, `b${n} = 2 × itu / ${n} = ${fmt(value)}.`],
      0.03,
    );
  }
  if (level === 2) {
    return problem(
      `Dengan rumus yang sama, berapa |b${n}|?`,
      "Nilai mutlak membuang tanda.",
      Math.abs(value),
      "Besar koefisien mengecil seperti 2/n.",
      [`|b${n}| = 2/${n} = ${fmt(Math.abs(value))}.`],
      0.03,
    );
  }
  return problem(
    `Tanda b${n} untuk f(x)=x. Jawab 1 jika positif, −1 jika negatif.`,
    "bn = 2(−1)^{n+1}/n.",
    value > 0 ? 1 : -1,
    "n ganjil pada rumus ini positif, n genap negatif.",
    [value > 0 ? "Tanda positif, jawab 1." : "Tanda negatif, jawab −1."],
  );
}

function laplace(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [1, 2, 3, 4]);
    const s = take(seed, 2, [5, 6, 7, 8, 9]);
    return problem(
      `Berapa L{e^{${a} t}} di s = ${s}?`,
      "L{e^{at}} = 1/(s−a), untuk s > a.",
      1 / (s - a),
      "Jangan lupa penyebut s − a, bukan s + a.",
      [`1/(${s}−${a}) = ${fmt(1 / (s - a))}.`],
    );
  }
  if (level === 2) {
    const w = take(seed, 1, [1, 2, 3]);
    const s = take(seed, 2, [1, 2, 4]);
    const value = w / (s * s + w * w);
    return problem(`L{sin(${w} t)} di s = ${s}?`, "L{sin ωt} = ω / (s² + ω²).", value, "ω di pembilang, bukan s.", [
      `penyebut = ${s}² + ${w}² = ${s * s + w * w}.`, `hasil = ${w}/itu = ${fmt(value)}.`,
    ]);
  }
  const s = take(seed, 1, [1, 2, 4, 5]);
  return problem(`L{t} di s = ${s}?`, "L{t} = 1/s².", 1 / (s * s), "Bukan 1/s. Itu untuk L{1}.", [
    `1/${s}² = ${fmt(1 / (s * s))}.`,
  ]);
}

function ode(seed: number, level: Level): Problem {
  if (level === 1) {
    const half = take(seed, 1, [2, 3, 4, 5]);
    const steps = take(seed, 2, [1, 2, 3, 4]);
    const y0 = take(seed, 3, [80, 160, 240, 320, 400]);
    const value = y0 / 2 ** steps;
    return problem(
      `Zat meluruh dengan waktu paruh ${half} jam. Awal ${y0}. Sisa setelah ${half * steps} jam?`,
      "Tiap paruh, tinggal setengah. Ini solusi y = y0 e^{kt} dengan k = −ln2 / paruh.",
      value,
      "Berapa kali paruh yang dilewati? Bagi waktu dengan waktu paruh.",
      [`Jumlah paruh = ${steps}.`, `Sisa = ${y0} / 2^${steps} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const x = take(seed, 1, [2, 3, 4, 5]);
    const c = take(seed, 2, [-2, 0, 1, 3, 5]);
    return problem(
      `dy/dx = 2x dan y(0) = ${c}. Berapa y(${x})?`,
      "Integralkan: y = x² + C. C dari syarat awal.",
      x * x + c,
      "Konstanta tidak hilang. Ia diikat oleh y(0).",
      [`y = x² + ${c}.`, `y(${x}) = ${x * x} + (${c}) = ${x * x + c}.`],
    );
  }
  const m = take(seed, 1, [1, 4]);
  const k = take(seed, 2, [4, 16, 36, 100]);
  const omega = Math.sqrt(k / m);
  const value = (2 * PI) / omega;
  return problem(
    `Osilator m = ${m} kg, k = ${k} N/m. Periode (s)? π = 3,14.`,
    "ω = √(k/m), T = 2π/ω.",
    value,
    "Periode bukan ω. Jangan tertukar.",
    [`ω = ${fmt(omega)}.`, `T = 2×3,14 / ω = ${fmt(value)}.`],
    0.05,
  );
}

function pde(seed: number, level: Level): Problem {
  if (level === 1) {
    const tension = take(seed, 1, [10, 40, 90, 160]);
    const mu = take(seed, 2, [0.1, 0.4, 0.9, 1.6]);
    const value = Math.sqrt(tension / mu);
    return problem(
      `Dawai, tegangan ${tension} N, μ = ${fmt(mu)} kg/m. Cepat rambat gelombang c pada persamaan gelombang?`,
      "c = √(T/μ). Persamaan: ∂²u/∂t² = c² ∂²u/∂x².",
      value,
      "c di persamaan adalah cepat rambat, kuadratnya yang muncul sebagai koefisien.",
      [`c = ${fmt(value)} m/s.`],
      0.05,
    );
  }
  if (level === 2) {
    const L = take(seed, 1, [1, 2, 5]);
    const n = take(seed, 2, [1, 2, 3]);
    const value = (n * n * 10) / (L * L);
    return problem(
      `Dawai panjang ${L}, ujung tetap. Ambil π² = 10. Nilai eigen λ_${n} = (nπ/L)²?`,
      "Syarat batas ujung tetap memaksa sinus dan λ positif.",
      value,
      "n = 1 adalah nada dasar. n menaik, λ naik kuadrat.",
      [`λ = ${n}² × 10 / ${L}² = ${fmt(value)}.`],
    );
  }
  const c = take(seed, 1, [10, 20, 40, 80]);
  const L = take(seed, 2, [1, 2, 4, 5]);
  return problem(
    `Cepat rambat ${c} m/s, panjang dawai ${L} m, kedua ujung tetap. Frekuensi dasar (Hz)?`,
    "λ_gelombang = 2L untuk nada dasar. f = c/λ.",
    c / (2 * L),
    "Setengah gelombang muat sekali di sepanjang dawai.",
    [`λ = 2×${L} = ${2 * L}.`, `f = ${c}/${2 * L} = ${fmt(c / (2 * L))}.`],
  );
}

function variasi(seed: number, level: Level): Problem {
  if (level === 1) {
    const triples = [
      [3, 4, 5],
      [6, 8, 10],
      [5, 12, 13],
      [8, 15, 17],
      [9, 12, 15],
    ] as const;
    const [x, y, d] = take(seed, 1, triples);
    return problem(
      `Lintasan terpendek dari (0,0) ke (${x}, ${y}). Panjangnya?`,
      "Fungsional panjang diminimalkan oleh garis lurus. Ini Pythagoras.",
      d,
      "Kalkulus variasi di kasus datar mengembalikan garis lurus.",
      [`√(${x}²+${y}²) = ${d}.`],
    );
  }
  if (level === 2) {
    const x1 = take(seed, 1, [0, 1, 2]);
    const y1 = take(seed, 2, [0, 1, -1, 2]);
    const x2 = x1 + take(seed, 3, [2, 3, 4, 5]);
    const y2 = y1 + take(seed, 4, [-3, -1, 2, 4, 6]);
    const m = (y2 - y1) / (x2 - x1);
    return problem(
      `Garis melalui (${x1}, ${y1}) dan (${x2}, ${y2}). Gradiennya?`,
      "EL untuk ∫ √(1+y'²) dx memberi y'' = 0, jadi gradien tetap.",
      m,
      "Gradien = Δy/Δx.",
      [`(${y2} − (${y1})) / (${x2} − ${x1}) = ${fmt(m)}.`],
    );
  }
  const m = take(seed, 1, [1, 2, 4]);
  const k = take(seed, 2, [4, 9, 16, 25]);
  const omega = Math.sqrt(k / m);
  return problem(
    `Lagrangian L = ½ m ẋ² − ½ k x² dengan m=${m}, k=${k}. Frekuensi sudut gerak yang memenuhi Euler–Lagrange?`,
    "EL menghasilkan m ẍ + k x = 0, sama seperti Newton.",
    omega,
    "ω = √(k/m), bukan √(m/k).",
    [`ω = √(${k}/${m}) = ${fmt(omega)}.`],
  );
}

function residu(seed: number, level: Level): Problem {
  if (level === 1) {
    const c = take(seed, 1, [1, 2, 3, 4, 5, -2, -3]);
    return problem(
      `Residu fungsi ${c}/(z − 2) di kutub z = 2?`,
      "Kutub sederhana  c/(z−a) punya residu c.",
      c,
      "Residu adalah koefisien 1/(z−a), bukan nilai fungsi.",
      [`Res = ${c}.`],
    );
  }
  if (level === 2) {
    const a = take(seed, 1, [1, 2, 3, 4]);
    const b = take(seed, 2, [0, 1, -1, 2, 5]);
    return problem(
      `Residu (z + (${b})) / (z − ${a}) di z = ${a}?`,
      "Kalikan (z−a), lalu masukkan z=a.",
      a + b,
      "Yang tersisa pembilang di titik kutub.",
      [`Res = ${a} + (${b}) = ${a + b}.`],
    );
  }
  const inside = take(seed, 1, [0, 1]);
  return problem(
    inside
      ? "Kutub sederhana residu 3 berada di dalam kontur tertutup berlawanan jarum jam. Integral keliling dibagi 2π (yaitu koefisien yang dikali i, anggap 2πi × res / 2π) — singkatnya: berapa residunya?"
      : "Kontur |z|=1, satu-satunya kandidat kutub di z=4. Integral keliling fungsi meromorf itu?",
    inside
      ? "Integral = 2πi × jumlah residu di dalam. Di soal ini yang ditanya residunya."
      : "Tidak ada kutub di dalam, integral Cauchy = 0.",
    inside ? 3 : 0,
    inside ? "Yang ditanya residu, yaitu 3, bukan 2πi." : "Kutub di luar kontur tidak menyumbang.",
    [inside ? "Residu yang diberikan = 3." : "Integral = 0."],
  );
}

function numerik(seed: number, level: Level): Problem {
  if (level === 1) {
    const a = take(seed, 1, [2, 3, 5, 6, 7, 8, 10, 11, 13, 15]);
    const x0 = take(seed, 2, [1, 2, 3, 4, 5, 6]);
    const fx = x0 * x0 - a;
    const df = 2 * x0;
    const value = x0 - fx / df;
    return problem(
      `Newton untuk f(x)=x²−${a}, mulai x0=${x0}. Berapa x1?`,
      "x1 = x0 − f(x0)/f'(x0). f'=2x.",
      value,
      "Satu langkah saja.",
      [`f(${x0})=${fx}, f'=${df}.`, `x1 = ${x0} − (${fx})/${df} = ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    const c = take(seed, 1, [1, 2, 3, 4, 5]);
    const b = take(seed, 2, [2, 4]);
    const h = b / 2;
    const y0 = 0;
    const y1 = c * (b / 2) ** 2;
    const y2 = c * b * b;
    const value = (h / 2) * (y0 + 2 * y1 + y2);
    return problem(
      `Hampiri ∫ dari 0 sampai ${b} untuk ${c === 1 ? "x²" : `${c}x²`} dengan trapesium, dua pias (h=${fmt(h)}).`,
      "(h/2) (y0 + 2 y1 + y2).",
      value,
      "Ini hampiran, bukan selalu nilai eksak.",
      [`Titik: 0, ${fmt(y1)}, ${fmt(y2)}.`, `Hasil = ${fmt(value)}.`],
    );
  }
  const exact = 8 / 3;
  const approx = take(seed, 1, [3, 2.5, 2.7]);
  const value = (Math.abs(approx - exact) / exact) * 100;
  return problem(
    `Integral eksak ∫_0^2 x² dx = 8/3. Suatu hampiran memberi ${fmt(approx)}. Persen galat terhadap nilai eksak?`,
    "|hampiran − eksak| / |eksak| × 100.",
    value,
    "Penyebut adalah nilai eksak.",
    [`Selisih = ${fmt(Math.abs(approx - exact))}.`, `Persen = ${fmt(value)}.`],
    0.2,
  );
}

function khusus(seed: number, level: Level): Problem {
  const xs = [-2, -1, -0.5, 0, 0.5, 1, 1.5, 2, 3];
  const x = take(seed, 1, xs);
  if (level === 1) {
    const value = (3 * x * x - 1) / 2;
    return problem(
      `P2(x) = (3x² − 1)/2. Berapa P2(${fmt(x)})?`,
      "P_n(1) = 1 untuk semua n. Cek dengan x=1.",
      value,
      "Kuadrat dulu, baru bagi dua.",
      [`3×${fmt(x * x)} − 1 = ${fmt(3 * x * x - 1)}.`, `Bagi 2: ${fmt(value)}.`],
    );
  }
  if (level === 2) {
    return problem(`P1(x) = x. Berapa P1(${fmt(x)})?`, "Legendre derajat 1 adalah identitas.", x, "Tidak ada yang disederhanakan.", [
      `P1(${fmt(x)}) = ${fmt(x)}.`,
    ]);
  }
  const value = (5 * x ** 3 - 3 * x) / 2;
  return problem(
    `P3(x) = (5x³ − 3x)/2. Berapa P3(${fmt(x)})?`,
    "Muncul pada bagian sudut atom hidrogen.",
    value,
    "Jangan buang suku linear.",
    [`5×${fmt(x ** 3)} − 3×${fmt(x)} = ${fmt(5 * x ** 3 - 3 * x)}.`, `Bagi 2 = ${fmt(value)}.`],
  );
}

function statistik(seed: number, level: Level): Problem {
  const data = [0, 1, 2, 3].map((i) => take(seed, i + 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]));
  const mean = data.reduce((s, n) => s + n, 0) / data.length;
  if (level === 1) {
    return problem(`Rata-rata data ${data.join(", ")}?`, "Jumlah bagi banyak data.", mean, "Ada empat angka.", [
      `Jumlah = ${data.reduce((s, n) => s + n, 0)}.`,
      `Rata-rata = ${fmt(mean)}.`,
    ]);
  }
  if (level === 2) {
    const lam = take(seed, 6, [1, 2, 3]);
    const approx = lam === 1 ? 0.37 : lam === 2 ? 0.14 : 0.05;
    return problem(
      `Poisson λ = ${lam}. P(0) = e^{−λ}. Pakai e^{−1}=0,37, e^{−2}=0,14, e^{−3}=0,05. Berapa P(0)?`,
      "λ^0 / 0! = 1, jadi tinggal faktor eksponen.",
      approx,
      "Tidak ada kejadian bukan berarti peluang nol.",
      [`P(0) = ${fmt(approx)}.`],
      0.02,
    );
  }
  const variance = data.reduce((s, n) => s + (n - mean) ** 2, 0) / data.length;
  return problem(
    `Varians populasi (bagi n, bukan n−1) dari ${data.join(", ")}?`,
    "Rata-rata kuadrat simpangan.",
    variance,
    "Hitung rata-rata dulu.",
    [`Rata-rata = ${fmt(mean)}.`, `Varians = ${fmt(variance)}.`],
    0.05,
  );
}

const GENS: Record<string, (seed: number, level: Level) => Problem> = {
  bilangan: lin,
  aljabar,
  fungsi,
  eksponen,
  trig,
  geometri,
  barisan,
  limit,
  turunan,
  integral,
  peluang,
  vektor,
  satuan,
  kinematika,
  parabola,
  newton,
  energi,
  momentum,
  gelombang,
  fluida,
  listrik,
  optik,
  foton,
  kompleks,
  deret,
  parsial,
  lipat,
  matriks,
  medan,
  fluks,
  fourier,
  laplace,
  ode,
  pde,
  variasi,
  residu,
  numerik,
  khusus,
  statistik,
};

export const BANK: Record<string, number> = {
  bilangan: 407,
  aljabar: 766,
  fungsi: 776,
  eksponen: 115,
  trig: 67,
  geometri: 110,
  barisan: 560,
  limit: 210,
  turunan: 206,
  integral: 219,
  peluang: 50,
  vektor: 712,
  satuan: 40,
  kinematika: 458,
  parabola: 99,
  newton: 79,
  energi: 74,
  momentum: 152,
  gelombang: 56,
  fluida: 52,
  listrik: 106,
  optik: 61,
  foton: 54,
  kompleks: 279,
  deret: 34,
  parsial: 678,
  lipat: 120,
  matriks: 1194,
  medan: 188,
  fluks: 57,
  fourier: 33,
  laplace: 33,
  ode: 108,
  pde: 41,
  variasi: 231,
  residu: 29,
  numerik: 73,
  khusus: 27,
  statistik: 995,
};

export function makeProblem(id: string, seed: number, level: Level): Problem {
  const fn = GENS[id] ?? lin;
  return fn(Math.abs(seed) + 1, level);
}

export function bankTotal(): number {
  return Object.values(BANK).reduce((s, n) => s + n, 0);
}

export function topicIds(): string[] {
  return Object.keys(GENS);
}
