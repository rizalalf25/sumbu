import { getTopic } from "./topics.ts";

export type ChallengeLevel = "dasar" | "menengah" | "lanjut";

export type Challenge = {
  id: string;
  lang: "python" | "sql";
  level: ChallengeLevel;
  title: string;
  /** Tugas dalam satu-dua paragraf. */
  task: string;
  starter: string;
  /** Python: kode pengujian yang memanggil cek(nama, kondisi). SQL: query solusi; hasilnya dibandingkan. */
  tests: string;
  /** SQL: apakah urutan baris ikut dinilai. */
  ordered?: boolean;
  hint: string;
  solution: string;
  topic?: string;
};

/** Tabel contoh yang sama dipakai semua pelajaran dan tantangan SQL. */
export const SQL_FIXTURE = `CREATE TABLE penjualan(id INTEGER, kota TEXT, omzet INTEGER);
INSERT INTO penjualan VALUES (1,'Bandung',10),(2,'Bandung',30),(3,'Medan',20),(4,'Medan',20),(5,'Medan',50);
CREATE TABLE pelanggan(id INTEGER, nama TEXT);
INSERT INTO pelanggan VALUES (1,'Ani'),(2,'Budi'),(3,'Citra');
CREATE TABLE pesanan(id INTEGER, pelanggan_id INTEGER, total INTEGER);
INSERT INTO pesanan VALUES (10,1,50),(11,1,70),(12,2,40);
CREATE TABLE mingguan(minggu INTEGER, nilai INTEGER);
INSERT INTO mingguan VALUES (1,10),(2,20),(3,30),(4,40);
CREATE TABLE ab(varian TEXT, beli INTEGER);
INSERT INTO ab WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 1000) SELECT 'A', CASE WHEN i <= 50 THEN 1 ELSE 0 END FROM n;
INSERT INTO ab WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 1000) SELECT 'B', CASE WHEN i <= 62 THEN 1 ELSE 0 END FROM n;`;

export const SQL_TABLES = [
  "penjualan(id, kota, omzet): 5 baris penjualan di Bandung dan Medan",
  "pelanggan(id, nama): Ani, Budi, Citra",
  "pesanan(id, pelanggan_id, total): 3 pesanan, Citra belum pernah memesan",
  "mingguan(minggu, nilai): minggu 1–4",
  "ab(varian, beli): 1000 baris A (50 membeli), 1000 baris B (62 membeli)",
];

export const CHALLENGES: Challenge[] = [
  // ------------------------------------------------------------ Python dasar
  {
    id: "ch-diskon",
    lang: "python",
    level: "dasar",
    title: "Diskon beruntun",
    task: "Tulis fungsi diskon_beruntun(harga, d1, d2) yang mengembalikan harga akhir setelah diskon d1 persen, lalu diskon d2 persen dari harga yang sudah turun.",
    starter: `def diskon_beruntun(harga, d1, d2):
    # d1 dan d2 dalam persen, misalnya 30 berarti 30%
    pass`,
    tests: `cek("200000, 30%, 20% = 112000", abs(diskon_beruntun(200000, 30, 20) - 112000) < 1e-6)
cek("tanpa diskon tetap", diskon_beruntun(50000, 0, 0) == 50000)
cek("100%, lalu apa pun = 0", abs(diskon_beruntun(80000, 100, 50)) < 1e-6)`,
    hint: "Kalikan faktor (1 − d/100) dua kali. Jangan jumlahkan persennya.",
    solution: `def diskon_beruntun(harga, d1, d2):
    return harga * (1 - d1 / 100) * (1 - d2 / 100)`,
    topic: "bilangan",
  },
  {
    id: "ch-fpb",
    lang: "python",
    level: "dasar",
    title: "FPB dengan algoritma Euclid",
    task: "Tulis fungsi fpb(a, b) untuk bilangan bulat positif tanpa memakai math.gcd.",
    starter: `def fpb(a, b):
    pass`,
    tests: `cek("fpb(84, 36) = 12", fpb(84, 36) == 12)
cek("fpb(17, 5) = 1", fpb(17, 5) == 1)
cek("fpb(10, 100) = 10", fpb(10, 100) == 10)
cek("tidak memakai math.gcd", "gcd" not in _kode)`,
    hint: "Selama b tidak nol: (a, b) = (b, a % b). Saat b nol, a adalah FPB.",
    solution: `def fpb(a, b):
    while b:
        a, b = b, a % b
    return a`,
    topic: "modular",
  },
  {
    id: "ch-median",
    lang: "python",
    level: "dasar",
    title: "Median",
    task: "Tulis fungsi median(data) untuk list angka yang tidak kosong. Jumlah data bisa ganjil atau genap. Jangan mengubah urutan list aslinya.",
    starter: `def median(data):
    pass`,
    tests: `cek("ganjil", median([3, 1, 2]) == 2)
cek("genap", median([4, 1, 3, 2]) == 2.5)
cek("satu data", median([7]) == 7)
asli = [5, 1, 4]
median(asli)
cek("list asli tidak berubah", asli == [5, 1, 4])`,
    hint: "Pakai sorted(data), bukan data.sort(), supaya list aslinya tidak berubah.",
    solution: `def median(data):
    urut = sorted(data)
    n = len(urut)
    t = n // 2
    return urut[t] if n % 2 else (urut[t - 1] + urut[t]) / 2`,
    topic: "sampel",
  },
  {
    id: "ch-kata",
    lang: "python",
    level: "dasar",
    title: "Menghitung kata",
    task: "Tulis fungsi hitung_kata(teks) yang mengembalikan dict berisi berapa kali tiap kata muncul. Abaikan huruf besar/kecil, dan pisahkan kata dengan spasi.",
    starter: `def hitung_kata(teks):
    pass`,
    tests: `h = hitung_kata("Data itu data dan data")
cek("data muncul 3 kali", h.get("data") == 3)
cek("itu muncul 1 kali", h.get("itu") == 1)
cek("tidak ada 'Data' kapital", "Data" not in h)
cek("teks kosong", hitung_kata("") == {})`,
    hint: "teks.lower().split() memberi daftar kata; pakai dict.get(kata, 0) + 1.",
    solution: `def hitung_kata(teks):
    hasil = {}
    for kata in teks.lower().split():
        hasil[kata] = hasil.get(kata, 0) + 1
    return hasil`,
  },
  {
    id: "ch-bayes",
    lang: "python",
    level: "dasar",
    title: "Peluang sakit jika positif",
    task: "Tulis fungsi peluang_sakit(prevalensi, sensitivitas, positif_palsu) yang mengembalikan P(sakit | tes positif). Semua masukan berupa desimal antara 0 dan 1.",
    starter: `def peluang_sakit(prevalensi, sensitivitas, positif_palsu):
    pass`,
    tests: `cek("1%, 95%, 5% ≈ 0,161", abs(peluang_sakit(0.01, 0.95, 0.05) - 0.161) < 0.001)
cek("50%, 100%, 0% = 1", abs(peluang_sakit(0.5, 1.0, 0.0) - 1) < 1e-9)
cek("hasil di antara 0 dan 1", 0 <= peluang_sakit(0.2, 0.9, 0.1) <= 1)`,
    hint: "Positif benar = prevalensi × sensitivitas. Positif palsu = (1 − prevalensi) × positif_palsu. Bagi yang benar dengan jumlah keduanya.",
    solution: `def peluang_sakit(prevalensi, sensitivitas, positif_palsu):
    benar = prevalensi * sensitivitas
    palsu = (1 - prevalensi) * positif_palsu
    return benar / (benar + palsu)`,
    topic: "bayes",
  },
  // --------------------------------------------------------- Python menengah
  {
    id: "ch-varians",
    lang: "python",
    level: "menengah",
    title: "Varians sampel",
    task: "Tulis fungsi varians_sampel(data) dengan pembagi n − 1, tanpa memakai pustaka statistics atau numpy.",
    starter: `def varians_sampel(data):
    pass`,
    tests: `cek("[2, 4, 4, 4, 5, 5, 7, 9] ≈ 4,571", abs(varians_sampel([2, 4, 4, 4, 5, 5, 7, 9]) - 32 / 7) < 1e-9)
cek("data sama = 0", varians_sampel([3, 3, 3]) == 0)
cek("tidak memakai pustaka", "statistics" not in _kode and "numpy" not in _kode)`,
    hint: "Hitung rata-rata dulu, lalu jumlah kuadrat simpangan, lalu bagi len(data) − 1.",
    solution: `def varians_sampel(data):
    rata = sum(data) / len(data)
    return sum((x - rata) ** 2 for x in data) / (len(data) - 1)`,
    topic: "sampel",
  },
  {
    id: "ch-bergerak",
    lang: "python",
    level: "menengah",
    title: "Rata-rata bergerak",
    task: "Tulis fungsi rata_bergerak(data, k) yang mengembalikan list rata-rata setiap k data berurutan. Panjang hasil = len(data) − k + 1.",
    starter: `def rata_bergerak(data, k):
    pass`,
    tests: `cek("k = 3", rata_bergerak([10, 20, 30, 40], 3) == [20, 30])
cek("k = 1 sama dengan data", rata_bergerak([1, 2, 3], 1) == [1, 2, 3])
cek("panjang hasil", len(rata_bergerak(list(range(100)), 7)) == 94)`,
    hint: "Untuk i dari 0 sampai len(data) − k, ambil potongan data[i:i + k].",
    solution: `def rata_bergerak(data, k):
    return [sum(data[i:i + k]) / k for i in range(len(data) - k + 1)]`,
    topic: "barisan",
  },
  {
    id: "ch-regresi",
    lang: "python",
    level: "menengah",
    title: "Regresi linear dari nol",
    task: "Tulis fungsi regresi(xs, ys) yang mengembalikan (a, b) untuk garis ŷ = a + b·x dengan kuadrat terkecil, tanpa numpy atau scikit-learn.",
    starter: `def regresi(xs, ys):
    pass`,
    tests: `a, b = regresi([1, 2, 3, 4, 5], [12, 14, 18, 20, 21])
cek("kemiringan 2,4", abs(b - 2.4) < 1e-9)
cek("intersep 9,8", abs(a - 9.8) < 1e-9)
a2, b2 = regresi([0, 1, 2], [1, 3, 5])
cek("garis sempurna y = 1 + 2x", abs(a2 - 1) < 1e-9 and abs(b2 - 2) < 1e-9)`,
    hint: "b = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)², lalu a = ȳ − b·x̄.",
    solution: `def regresi(xs, ys):
    mx = sum(xs) / len(xs)
    my = sum(ys) / len(ys)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    sxx = sum((x - mx) ** 2 for x in xs)
    b = sxy / sxx
    return my - b * mx, b`,
    topic: "regresi",
  },
  {
    id: "ch-biner",
    lang: "python",
    level: "menengah",
    title: "Pencarian biner",
    task: "Tulis fungsi cari(arr, target) untuk list yang sudah terurut. Kembalikan indeks target, atau −1 bila tidak ada. Harus O(log n): jangan memakai arr.index atau perulangan linear.",
    starter: `def cari(arr, target):
    pass`,
    tests: `data = list(range(0, 2_000_000, 2))
cek("ketemu di akhir", cari(data, 1_999_998) == 999_999)
cek("ketemu di awal", cari(data, 0) == 0)
cek("tidak ada", cari(data, 7) == -1)
cek("list kosong", cari([], 3) == -1)
cek("tidak memakai .index", ".index(" not in _kode)`,
    hint: "Simpan kiri dan kanan; bandingkan elemen tengah, lalu buang separuh yang tidak mungkin.",
    solution: `def cari(arr, target):
    kiri, kanan = 0, len(arr) - 1
    while kiri <= kanan:
        t = (kiri + kanan) // 2
        if arr[t] == target:
            return t
        if arr[t] < target:
            kiri = t + 1
        else:
            kanan = t - 1
    return -1`,
  },
  {
    id: "ch-modpow",
    lang: "python",
    level: "menengah",
    title: "Pangkat modular cepat",
    task: "Tulis fungsi pangkat_mod(a, e, n) yang menghitung a^e mod n dengan kuadrat-berulang. Harus cepat untuk e sangat besar, dan tidak boleh memakai pow() bawaan.",
    starter: `def pangkat_mod(a, e, n):
    pass`,
    tests: `cek("2^5 mod 7 = 4", pangkat_mod(2, 5, 7) == 4)
cek("RSA mainan: 4^3 mod 33 = 31", pangkat_mod(4, 3, 33) == 31)
cek("eksponen raksasa", pangkat_mod(3, 10**18, 1_000_000_007) == pow(3, 10**18, 1_000_000_007))
cek("tidak memakai pow()", "pow(" not in _kode)`,
    hint: "Selama e > 0: jika e ganjil, hasil = hasil·a mod n; lalu a = a·a mod n dan e //= 2.",
    solution: `def pangkat_mod(a, e, n):
    hasil = 1
    a %= n
    while e > 0:
        if e % 2:
            hasil = hasil * a % n
        a = a * a % n
        e //= 2
    return hasil`,
    topic: "modular",
  },
  {
    id: "ch-entropi",
    lang: "python",
    level: "menengah",
    title: "Entropi sebaran",
    task: "Tulis fungsi entropi(ps) yang mengembalikan entropi dalam bit untuk list peluang. Peluang 0 tidak menyumbang apa pun.",
    starter: `import math

def entropi(ps):
    pass`,
    tests: `cek("koin adil = 1 bit", abs(entropi([0.5, 0.5]) - 1) < 1e-9)
cek("8 pilihan rata = 3 bit", abs(entropi([1 / 8] * 8) - 3) < 1e-9)
cek("1/2, 1/4, 1/4 = 1,5 bit", abs(entropi([0.5, 0.25, 0.25]) - 1.5) < 1e-9)
cek("pasti terjadi = 0", entropi([1.0, 0.0]) == 0)`,
    hint: "Jumlahkan −p·log2(p) hanya untuk p > 0.",
    solution: `import math

def entropi(ps):
    return sum(-p * math.log2(p) for p in ps if p > 0) + 0.0`,
    topic: "entropi",
  },
  {
    id: "ch-gd",
    lang: "python",
    level: "menengah",
    title: "Melatih satu neuron",
    task: "Tulis fungsi latih(xs, ts, eta, langkah) yang memulai w = 0 lalu menjalankan gradient descent pada galat L(w) = Σ(w·x − t)² / n sebanyak langkah kali. Kembalikan w akhir.",
    starter: `def latih(xs, ts, eta, langkah):
    w = 0.0
    # tulis perulangan gradient descent di sini
    return w`,
    tests: `w = latih([1, 2, 3], [2, 4, 6], 0.05, 200)
cek("menemukan w ≈ 2", abs(w - 2) < 1e-3)
w2 = latih([2], [10], 0.1, 3)
cek("tiga langkah satu data ≈ 4,96", abs(w2 - 4.96) < 1e-9)`,
    hint: "dL/dw = 2 · Σ(w·x − t)·x / n. Perbarui w = w − eta · gradien.",
    solution: `def latih(xs, ts, eta, langkah):
    w = 0.0
    n = len(xs)
    for _ in range(langkah):
        grad = 2 * sum((w * x - t) * x for x, t in zip(xs, ts)) / n
        w -= eta * grad
    return w`,
    topic: "rantai",
  },
  // ----------------------------------------------------------- Python lanjut
  {
    id: "ch-pid",
    lang: "python",
    level: "lanjut",
    title: "Kelas pengendali PID",
    task: "Lengkapi kelas PID dengan metode update(target, ukur, dt) yang mengembalikan keluaran Kp·e + Ki·∫e dt + Kd·de/dt. Integral dan galat sebelumnya disimpan di objek; panggilan pertama memakai galat sebelumnya = 0.",
    starter: `class PID:
    def __init__(self, kp, ki, kd):
        self.kp, self.ki, self.kd = kp, ki, kd
        self.integral = 0.0
        self.galat_lalu = 0.0

    def update(self, target, ukur, dt):
        pass`,
    tests: `pid = PID(2.0, 0.5, 0.1)
cek("panggilan pertama = 6,1", abs(pid.update(10, 8, 0.1) - 6.1) < 1e-9)
cek("panggilan kedua = 4,2", abs(pid.update(10, 8, 0.1) - 4.2) < 1e-9)
p = PID(1, 0, 0)
cek("P saja = galat", p.update(5, 3, 0.1) == 2)`,
    hint: "Hitung e, tambahkan e·dt ke integral, turunan = (e − galat_lalu)/dt, simpan e sebagai galat_lalu.",
    solution: `class PID:
    def __init__(self, kp, ki, kd):
        self.kp, self.ki, self.kd = kp, ki, kd
        self.integral = 0.0
        self.galat_lalu = 0.0

    def update(self, target, ukur, dt):
        e = target - ukur
        self.integral += e * dt
        turunan = (e - self.galat_lalu) / dt
        self.galat_lalu = e
        return self.kp * e + self.ki * self.integral + self.kd * turunan`,
    topic: "kendali",
  },
  {
    id: "ch-euler",
    lang: "python",
    level: "lanjut",
    title: "Simulasi jatuh dengan hambatan udara",
    task: "Tulis fungsi jatuh(m, k, dt, t_akhir) yang mensimulasikan benda dilepas dari diam dengan metode Euler: percepatan = g − (k/m)·v, g = 9,8. Kembalikan kecepatan pada t_akhir. Bandingkan dengan kecepatan terminal m·g/k.",
    starter: `def jatuh(m, k, dt, t_akhir):
    g = 9.8
    v = 0.0
    pass`,
    tests: `v = jatuh(1.0, 0.5, 0.001, 30)
cek("mendekati kecepatan terminal 19,6", abs(v - 19.6) < 0.01)
cek("tanpa hambatan, 1 detik = 9,8", abs(jatuh(1.0, 0.0, 0.01, 1) - 9.8) < 1e-6)
cek("selalu di bawah terminal", jatuh(2.0, 1.0, 0.01, 2) < 19.6)`,
    hint: "Ulangi round(t_akhir / dt) kali: v += (g − k/m·v)·dt.",
    solution: `def jatuh(m, k, dt, t_akhir):
    g = 9.8
    v = 0.0
    for _ in range(round(t_akhir / dt)):
        v += (g - k / m * v) * dt
    return v`,
    topic: "ode",
  },
  {
    id: "ch-markov",
    lang: "python",
    level: "lanjut",
    title: "Rantai Markov cuaca",
    task: "Tulis fungsi sebaran(P, awal, n) yang mengembalikan sebaran keadaan setelah n langkah. P adalah list baris matriks transisi, awal adalah list peluang awal. Tanpa numpy.",
    starter: `def sebaran(P, awal, n):
    pass`,
    tests: `P = [[0.9, 0.1], [0.5, 0.5]]
s1 = sebaran(P, [1, 0], 1)
cek("satu langkah = baris pertama", abs(s1[0] - 0.9) < 1e-9 and abs(s1[1] - 0.1) < 1e-9)
s2 = sebaran(P, [1, 0], 2)
cek("dua langkah: cerah 0,86", abs(s2[0] - 0.86) < 1e-9)
s = sebaran(P, [0, 1], 200)
cek("jangka panjang ≈ 5/6 cerah", abs(s[0] - 5 / 6) < 1e-6)
cek("jumlah tetap 1", abs(sum(s) - 1) < 1e-9)`,
    hint: "Satu langkah: baru[j] = Σ_i lama[i]·P[i][j]. Ulangi n kali.",
    solution: `def sebaran(P, awal, n):
    s = list(awal)
    for _ in range(n):
        s = [sum(s[i] * P[i][j] for i in range(len(s))) for j in range(len(P[0]))]
    return s`,
    topic: "stokastik",
  },
  // ------------------------------------------------------------------- SQL
  {
    id: "sq-total",
    lang: "sql",
    level: "dasar",
    title: "Omzet per kota",
    task: "Tampilkan kolom kota dan total omzet (beri nama total) per kota, urut dari total terbesar.",
    starter: "SELECT kota\nFROM penjualan;",
    tests: "SELECT kota, SUM(omzet) AS total FROM penjualan GROUP BY kota ORDER BY total DESC;",
    ordered: true,
    hint: "GROUP BY kota, SUM(omzet), lalu ORDER BY total DESC.",
    solution: "SELECT kota, SUM(omzet) AS total\nFROM penjualan\nGROUP BY kota\nORDER BY total DESC;",
  },
  {
    id: "sq-belum",
    lang: "sql",
    level: "dasar",
    title: "Pelanggan yang belum pernah memesan",
    task: "Tampilkan nama pelanggan yang tidak punya satu pun pesanan.",
    starter: "SELECT nama\nFROM pelanggan;",
    tests: "SELECT p.nama FROM pelanggan p LEFT JOIN pesanan s ON s.pelanggan_id = p.id WHERE s.id IS NULL;",
    hint: "LEFT JOIN ke pesanan, lalu saring baris yang pasangannya NULL.",
    solution: "SELECT p.nama\nFROM pelanggan p\nLEFT JOIN pesanan s ON s.pelanggan_id = p.id\nWHERE s.id IS NULL;",
    topic: "diskrit",
  },
  {
    id: "sq-unik",
    lang: "sql",
    level: "dasar",
    title: "Pesanan dan pembeli unik",
    task: "Dalam satu baris, tampilkan jumlah pesanan (kolom pesanan) dan jumlah pembeli unik (kolom pembeli).",
    starter: "SELECT COUNT(*) AS pesanan\nFROM pesanan;",
    tests: "SELECT COUNT(*) AS pesanan, COUNT(DISTINCT pelanggan_id) AS pembeli FROM pesanan;",
    hint: "COUNT(DISTINCT pelanggan_id).",
    solution: "SELECT COUNT(*) AS pesanan,\n       COUNT(DISTINCT pelanggan_id) AS pembeli\nFROM pesanan;",
    topic: "diskrit",
  },
  {
    id: "sq-having",
    lang: "sql",
    level: "menengah",
    title: "Pembeli besar",
    task: "Tampilkan nama pelanggan dan total belanjanya, hanya untuk yang total belanjanya lebih dari 50.",
    starter: "SELECT p.nama\nFROM pelanggan p;",
    tests: "SELECT p.nama, SUM(s.total) AS belanja FROM pelanggan p JOIN pesanan s ON s.pelanggan_id = p.id GROUP BY p.nama HAVING SUM(s.total) > 50;",
    hint: "JOIN, GROUP BY nama, lalu HAVING SUM(total) > 50.",
    solution: "SELECT p.nama, SUM(s.total) AS belanja\nFROM pelanggan p\nJOIN pesanan s ON s.pelanggan_id = p.id\nGROUP BY p.nama\nHAVING SUM(s.total) > 50;",
  },
  {
    id: "sq-konversi",
    lang: "sql",
    level: "menengah",
    title: "Konversi uji A/B",
    task: "Tampilkan varian dan tingkat konversinya dalam desimal (kolom konversi), dibulatkan 3 angka di belakang koma.",
    starter: "SELECT varian, SUM(beli) / COUNT(*) AS konversi\nFROM ab\nGROUP BY varian;",
    tests: "SELECT varian, ROUND(SUM(beli) * 1.0 / COUNT(*), 3) AS konversi FROM ab GROUP BY varian;",
    hint: "Kode awal memberi 0 karena pembagian bulat. Kalikan 1.0 sebelum membagi.",
    solution: "SELECT varian,\n       ROUND(SUM(beli) * 1.0 / COUNT(*), 3) AS konversi\nFROM ab\nGROUP BY varian;",
    topic: "inferensi",
  },
  {
    id: "sq-bergerak",
    lang: "sql",
    level: "lanjut",
    title: "Rata-rata bergerak 2 minggu",
    task: "Tampilkan minggu dan rata-rata nilai minggu itu dengan minggu sebelumnya (kolom rata2), urut menurut minggu. Minggu pertama cukup rata-rata dirinya sendiri.",
    starter: "SELECT minggu, nilai\nFROM mingguan;",
    tests: "SELECT minggu, AVG(nilai) OVER (ORDER BY minggu ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS rata2 FROM mingguan ORDER BY minggu;",
    ordered: true,
    hint: "AVG(nilai) OVER (ORDER BY minggu ROWS BETWEEN 1 PRECEDING AND CURRENT ROW).",
    solution: "SELECT minggu,\n       AVG(nilai) OVER (\n         ORDER BY minggu\n         ROWS BETWEEN 1 PRECEDING AND CURRENT ROW\n       ) AS rata2\nFROM mingguan\nORDER BY minggu;",
    topic: "barisan",
  },
  {
    id: "sq-cte",
    lang: "sql",
    level: "lanjut",
    title: "Kota di atas rata-rata",
    task: "Dengan CTE, hitung total omzet per kota, lalu tampilkan hanya kota yang totalnya di atas rata-rata total semua kota.",
    starter: "WITH total_kota AS (\n  SELECT kota\n  FROM penjualan\n)\nSELECT *\nFROM total_kota;",
    tests: "WITH t AS (SELECT kota, SUM(omzet) AS total FROM penjualan GROUP BY kota) SELECT kota, total FROM t WHERE total > (SELECT AVG(total) FROM t);",
    hint: "Di CTE: GROUP BY kota dengan SUM(omzet) AS total. Di query utama: WHERE total > (SELECT AVG(total) FROM total_kota).",
    solution: "WITH total_kota AS (\n  SELECT kota, SUM(omzet) AS total\n  FROM penjualan\n  GROUP BY kota\n)\nSELECT kota, total\nFROM total_kota\nWHERE total > (SELECT AVG(total) FROM total_kota);",
  },
];

/** Kerangka penguji Python. Kode pengguna dijalankan, lalu tes, lalu ringkasan bertanda khusus. */
export function pythonHarness(userCode: string, tests: string): string {
  return `_hasil = []
def cek(nama, kondisi):
    _hasil.append((nama, bool(kondisi)))
_kode = ${JSON.stringify(userCode)}
${userCode}

try:
${tests
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
except Exception as _e:
    _hasil.append((f"tes berhenti karena galat: {type(_e).__name__}: {_e}", False))
for _nama, _ok in _hasil:
    print(("✓ " if _ok else "✗ ") + _nama)
print("__LULUS__" if _hasil and all(ok for _, ok in _hasil) else "__GAGAL__")`;
}

const byId = new Map(CHALLENGES.map((c) => [c.id, c]));
for (const c of CHALLENGES) {
  if (c.topic && !getTopic(c.topic)) throw new Error(`Tantangan ${c.id} menyebut materi yang tidak ada: ${c.topic}`);
}

export function getChallenge(id: string): Challenge | undefined {
  return byId.get(id);
}
