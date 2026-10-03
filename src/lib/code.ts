import { getTopic } from "./topics.ts";

export type LangId = "python" | "sql" | "cpp" | "r" | "bash";

export type Lang = {
  id: LangId;
  name: string;
  kicker: string;
  summary: string;
  tryLabel: string;
  tryUrl: string;
};

export type LessonLevel = "dasar" | "menengah" | "lanjut";

export type CodeLesson = {
  id: string;
  lang: LangId;
  /** Diisi otomatis dari LESSON_META. */
  level?: LessonLevel;
  /** Bisa dijalankan langsung di peramban. */
  run?: "python" | "sql";
  title: string;
  minutes: number;
  idea: string;
  code: string;
  explain: string[];
  quiz: { q: string; options: string[]; answer: number; why: string };
  /** Materi matematika/fisika yang dipakai contoh ini. */
  topic?: string;
};

export const LANGS: Lang[] = [
  {
    id: "python",
    name: "Python",
    kicker: "Data, AI, sains, otomasi",
    summary:
      "Bahasa pertama yang paling berguna untuk hampir semua peta: analisis data, model AI, simulasi fisika, dan skrip otomasi. Pustakanya (NumPy, pandas, scikit-learn, PyTorch, Qiskit) adalah alat kerja harian industri.",
    tryLabel: "Google Colab, tanpa instal",
    tryUrl: "https://colab.research.google.com",
  },
  {
    id: "sql",
    name: "SQL",
    kicker: "Bahasa tabel",
    summary:
      "Hampir semua data perusahaan tinggal di basis data. SQL adalah cara bertanya kepadanya: menyaring, menggabung, dan meringkas tabel. Wajib untuk analis, ilmuwan data, aktuaris, dan quant.",
    tryLabel: "SQLite Online, di peramban",
    tryUrl: "https://sqliteonline.com",
  },
  {
    id: "cpp",
    name: "C dan C++",
    kicker: "Dekat dengan perangkat keras",
    summary:
      "Mikrokontroler, drone, robot, dan sistem yang harus cepat ditulis dengan C atau C++. Kamu belajar tipe data, memori, waktu nyata, dan loop kendali.",
    tryLabel: "Wokwi, simulator Arduino dan ESP32",
    tryUrl: "https://wokwi.com",
  },
  {
    id: "r",
    name: "R",
    kicker: "Statistik dan biostatistik",
    summary:
      "Bahasa statistik yang kuat di riset kesehatan, bioinformatika, aktuaria, dan iklim. Uji statistik dan grafik publikasi tersedia dalam satu baris.",
    tryLabel: "Posit Cloud, RStudio di peramban",
    tryUrl: "https://posit.cloud",
  },
  {
    id: "bash",
    name: "Bash dan baris perintah",
    kicker: "Server, log, keamanan",
    summary:
      "Server, cloud, dan alat keamanan dijalankan dari terminal. Bash membuatmu bisa membaca log, merangkai alat, dan mengotomasi pekerjaan berulang.",
    tryLabel: "Terminal Linux/macOS, atau WSL di Windows",
    tryUrl: "https://learn.microsoft.com/windows/wsl/install",
  },
];

export const LESSONS: CodeLesson[] = [
  // ---------------------------------------------------------------- Python
  {
    id: "py-dasar",
    lang: "python",
    title: "Variabel, tipe, dan f-string",
    minutes: 10,
    idea: "Variabel adalah nama untuk sebuah nilai. Python membedakan bilangan bulat (int), desimal (float), dan teks (str). f-string menyisipkan nilai ke dalam teks.",
    code: `harga = 200_000
diskon1, diskon2 = 0.30, 0.20
akhir = harga * (1 - diskon1) * (1 - diskon2)
print(f"Harga akhir: {akhir:,.0f}")`,
    explain: [
      "Garis bawah pada 200_000 hanya pemisah agar mudah dibaca; nilainya tetap 200000.",
      "Dua diskon dikalikan sebagai faktor, persis seperti di materi persen.",
      "{akhir:,.0f} berarti: tanpa desimal, dengan pemisah ribuan. Python memakai koma gaya Inggris sebagai pemisah ribuan.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["Harga akhir: 100,000", "Harga akhir: 112,000", "Harga akhir: 120,000", "Harga akhir: 112000.0"],
      answer: 1,
      why: "200.000 × 0,7 × 0,8 = 112.000, lalu diformat dengan pemisah ribuan.",
    },
    topic: "bilangan",
  },
  {
    id: "py-alur",
    lang: "python",
    title: "Kondisi dan perulangan",
    minutes: 10,
    idea: "while mengulang selama syaratnya benar; for mengulang untuk setiap anggota. Indentasi (spasi di depan baris) menandai blok yang diulang.",
    code: `n = 100
jam = 0
while n < 3000:
    n *= 2
    jam += 1
print(jam, n)`,
    explain: [
      "n *= 2 sama dengan n = n * 2: populasi menggandakan diri.",
      "Perulangan berhenti saat n sudah tidak kurang dari 3000.",
      "Ini cara komputer menjawab pertanyaan logaritma: berapa kali digandakan sampai melewati batas?",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["4 1600", "5 3200", "30 3000", "6 6400"],
      answer: 1,
      why: "100 → 200 → 400 → 800 → 1600 → 3200. Lima kali, berhenti di 3200.",
    },
    topic: "eksponen",
  },
  {
    id: "py-fungsi",
    lang: "python",
    title: "Fungsi dan turunan numerik",
    minutes: 12,
    idea: "Fungsi membungkus langkah yang dipakai berulang. Fungsi juga bisa menerima fungsi lain sebagai masukan, seperti mesin yang menerima mesin.",
    code: `def turunan(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)

kuadrat = lambda x: x ** 2
print(round(turunan(kuadrat, 3), 3))`,
    explain: [
      "turunan() menghampiri kemiringan dengan selisih kecil di kiri dan kanan x: definisi limit, dikerjakan komputer.",
      "lambda membuat fungsi kecil tanpa nama. x ** 2 berarti x pangkat 2.",
      "h=1e-5 adalah nilai bawaan: 0,00001.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["3.0", "6.0", "9.0", "18.0"],
      answer: 1,
      why: "Turunan x² adalah 2x. Di x = 3 hasilnya 6.",
    },
    topic: "turunan",
  },
  {
    id: "py-kelas",
    lang: "python",
    title: "Kelas, objek, dan menangani galat",
    minutes: 12,
    idea: "Kelas menggabungkan data dan perilaku. Galat (exception) dilempar saat ada yang tidak beres, dan ditangkap dengan try/except agar program tidak mati.",
    code: `class Akun:
    def __init__(self, saldo):
        self.saldo = saldo

    def tarik(self, jumlah):
        if jumlah > self.saldo:
            raise ValueError("saldo kurang")
        self.saldo -= jumlah

a = Akun(100)
try:
    a.tarik(30)
    a.tarik(80)
except ValueError as e:
    print(e, a.saldo)`,
    explain: [
      "__init__ dijalankan saat objek dibuat; self adalah objek itu sendiri.",
      "Penarikan kedua gagal karena saldo tinggal 70, jadi galat dilempar.",
      "Saldo tidak berubah oleh penarikan yang gagal.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["saldo kurang -10", "saldo kurang 70", "saldo kurang 100", "Tidak ada; program berhenti dengan error"],
      answer: 1,
      why: "Tarik 30 berhasil (saldo 70). Tarik 80 melempar ValueError sebelum saldo dikurangi.",
    },
  },
  {
    id: "py-numpy",
    lang: "python",
    title: "NumPy: vektor dan matriks",
    minutes: 12,
    idea: "NumPy menyimpan angka dalam array dan menghitung seluruh array sekaligus, ratusan kali lebih cepat daripada perulangan Python biasa. Operator @ adalah perkalian matriks.",
    code: `import numpy as np

A = np.array([[2, 1],
              [1, 2]])
v = np.array([1, 1])

print(A @ v)
print(np.linalg.eigvalsh(A))  # nilai eigen matriks simetris`,
    explain: [
      "A @ v: baris pertama 2×1 + 1×1, baris kedua 1×1 + 2×1.",
      "Hasilnya searah v dan tiga kali panjangnya, jadi (1, 1) adalah vektor eigen dengan nilai eigen 3.",
      "eigvalsh mencetak [1. 3.]: dua nilai eigen, urut dari kecil.",
    ],
    quiz: {
      q: "Apa yang dicetak baris pertama?",
      options: ["[2 1]", "[3 3]", "[1 1]", "[[2 1] [1 2]]"],
      answer: 1,
      why: "Baris kali kolom: (2+1, 1+2) = (3, 3).",
    },
    topic: "linalg",
  },
  {
    id: "py-pandas",
    lang: "python",
    title: "pandas: tabel dan groupby",
    minutes: 12,
    idea: "pandas adalah spreadsheet di dalam kode. DataFrame adalah tabel; groupby memecah tabel per kelompok lalu meringkas tiap kelompok.",
    code: `import pandas as pd

df = pd.DataFrame({
    "kota":  ["Bandung", "Bandung", "Medan", "Medan", "Medan"],
    "omzet": [10, 30, 20, 20, 50],
})
print(df.groupby("kota")["omzet"].agg(["mean", "median"]))`,
    explain: [
      "Setiap kota menjadi satu baris hasil.",
      "Bandung: rata-rata dan median sama-sama 20.",
      "Medan: satu omzet besar (50) menarik rata-rata ke 30, tetapi median tetap 20.",
    ],
    quiz: {
      q: "Berapa mean dan median omzet Medan?",
      options: ["mean 20, median 20", "mean 30, median 20", "mean 30, median 30", "mean 90, median 20"],
      answer: 1,
      why: "(20 + 20 + 50) / 3 = 30. Diurutkan 20, 20, 50: tengahnya 20.",
    },
    topic: "sampel",
  },
  {
    id: "py-plot",
    lang: "python",
    title: "matplotlib: grafik yang jujur",
    minutes: 10,
    idea: "Grafik adalah argumen. Sumbu yang diberi label, satuan, dan titik nol yang jujur membuat pembaca tidak tertipu.",
    code: `import matplotlib.pyplot as plt

minggu = [1, 2, 3, 4]
omzet = [100, 102, 101, 104]

plt.plot(minggu, omzet, marker="o")
plt.xlabel("Minggu ke-")
plt.ylabel("Omzet (juta rupiah)")
plt.ylim(0, 120)
plt.title("Omzet mingguan")
plt.show()`,
    explain: [
      "Tanpa plt.ylim(0, 120), sumbu y mulai di 100 dan kenaikan 4% terlihat seperti lonjakan besar.",
      "Label dan satuan di sumbu adalah bagian dari jawaban, sama seperti di soal fisika.",
      "Satu grafik, satu pesan. Judul menyebut apa yang diukur.",
    ],
    quiz: {
      q: "Baris mana yang mencegah kenaikan kecil terlihat dramatis?",
      options: ['plt.plot(..., marker="o")', "plt.ylim(0, 120)", 'plt.title("Omzet mingguan")', "plt.show()"],
      answer: 1,
      why: "ylim memaksa sumbu y mulai dari nol, jadi kenaikan 4% tampil seukuran aslinya.",
    },
    topic: "fungsi",
  },
  {
    id: "py-gd",
    lang: "python",
    title: "Gradient descent dari nol",
    minutes: 14,
    idea: "Melatih model artinya mengulang tiga langkah: hitung galat, hitung turunannya, geser parameter berlawanan arah turunan.",
    code: `w, eta = 0.0, 0.1
x, t = 2.0, 10.0          # satu data: masukan 2, target 10

for langkah in range(3):
    grad = 2 * (w * x - t) * x   # aturan rantai pada (w*x - t)^2
    w = w - eta * grad

print(round(w, 2))`,
    explain: [
      "Langkah 1: grad = 2(0 − 10)·2 = −40, w menjadi 4.",
      "Langkah 2: grad = 2(8 − 10)·2 = −8, w menjadi 4,8.",
      "Langkah 3: grad = 2(9,6 − 10)·2 = −1,6, w menjadi 4,96. Nilai sebenarnya 5.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["4.0", "4.8", "4.96", "5.0"],
      answer: 2,
      why: "Tiga langkah: 0 → 4 → 4,8 → 4,96. Langkahnya mengecil karena turunan mengecil dekat lembah.",
    },
    topic: "rantai",
  },
  {
    id: "py-sklearn",
    lang: "python",
    title: "scikit-learn: model pertama",
    minutes: 12,
    idea: "scikit-learn menyeragamkan semua model: buat, fit ke data, lalu predict. Regresi linear adalah model pertama yang harus dikalahkan model rumit.",
    code: `from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4], [5]])   # biaya iklan (juta)
y = np.array([12, 14, 18, 20, 21])        # penjualan (juta)

model = LinearRegression().fit(X, y)
print(round(model.coef_[0], 1), round(model.intercept_, 1))`,
    explain: [
      "X harus dua dimensi: satu baris per data, satu kolom per fitur.",
      "coef_ adalah kemiringan b; intercept_ adalah a.",
      "Hasilnya sama dengan hitungan tangan di materi Korelasi dan regresi.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["9.8 2.4", "2.4 9.8", "17.0 3.0", "1.0 12.0"],
      answer: 1,
      why: "Kemiringan 2,4 dicetak lebih dulu, lalu intersep 9,8.",
    },
    topic: "regresi",
  },
  {
    id: "py-torch",
    lang: "python",
    title: "PyTorch: autograd adalah aturan rantai",
    minutes: 12,
    idea: "PyTorch mencatat setiap operasi pada tensor, lalu backward() menjalankan aturan rantai mundur untuk menghitung semua turunan secara otomatis.",
    code: `import torch

w = torch.tensor(3.0, requires_grad=True)
L = (w * 2 - 10) ** 2
L.backward()
print(w.grad.item())`,
    explain: [
      "requires_grad=True meminta PyTorch mencatat turunan terhadap w.",
      "L = (2w − 10)². Aturan rantai: dL/dw = 2(2w − 10) · 2.",
      "Ini kasus “Satu neuron yang belajar” di materi Aturan rantai, dihitung mesin.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["-16.0", "16.0", "-4.0", "6.0"],
      answer: 0,
      why: "2(6 − 10) · 2 = −16. Negatif: menaikkan w menurunkan galat.",
    },
    topic: "rantai",
  },
  {
    id: "py-sim",
    lang: "python",
    title: "Simulasi: metode Euler",
    minutes: 12,
    idea: "Persamaan gerak yang tidak punya rumus rapi bisa dilangkahkan: hitung percepatan, perbarui kecepatan, perbarui posisi, ulangi dengan langkah waktu kecil.",
    code: `dt, v, y = 0.1, 0.0, 0.0   # benda dilepas dari diam

for _ in range(10):        # 10 langkah x 0,1 s = 1 detik
    v += -9.8 * dt
    y += v * dt

print(round(v, 2), round(y, 2))`,
    explain: [
      "Setelah 1 detik, kecepatan tepat −9,8 m/s karena percepatannya tetap.",
      "Posisi −5,39 m, sedangkan rumus eksak ½gt² memberi −4,9 m. Selisihnya adalah galat metode Euler.",
      "Perkecil dt dan galatnya ikut mengecil. Itulah pelajaran utama metode numerik.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["-9.8 -4.9", "-9.8 -5.39", "-98.0 -49.0", "0.0 0.0"],
      answer: 1,
      why: "v persis −9,8; y −5,39 karena Euler memakai kecepatan akhir tiap langkah, jadi sedikit melebihi −4,9.",
    },
    topic: "numerik",
  },
  {
    id: "py-qiskit",
    lang: "python",
    title: "Qiskit: sirkuit kuantum pertama",
    minutes: 12,
    idea: "Sirkuit kuantum adalah urutan gerbang pada qubit, diakhiri pengukuran. Satu kali jalan memberi satu hasil acak; ribuan kali jalan memberi sebaran peluangnya.",
    code: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(1)
qc.h(0)              # Hadamard: superposisi 50:50
qc.measure_all()

hasil = StatevectorSampler().run([qc], shots=1000).result()
print(hasil[0].data.meas.get_counts())`,
    explain: [
      "Qubit mulai di |0⟩. Gerbang H membuat amplitudo |0⟩ dan |1⟩ sama, 1/√2.",
      "Peluang tiap hasil = kuadrat amplitudo = 0,5.",
      "Hasilnya kira-kira {'0': 500, '1': 500}, tidak pernah persis sama tiap kali dijalankan.",
    ],
    quiz: {
      q: "Dari 1000 shots, kira-kira berapa kali muncul '0'?",
      options: ["0", "sekitar 250", "sekitar 500", "tepat 1000"],
      answer: 2,
      why: "P(0) = |1/√2|² = 0,5, jadi sekitar separuhnya, dengan sebaran acak.",
    },
    topic: "kuantum",
  },

  {
    id: "py-struktur",
    lang: "python",
    title: "List, dict, dan set",
    minutes: 10,
    idea: "list menyimpan urutan, dict memetakan kunci ke nilai, set menyimpan anggota unik. Memilih wadah yang tepat sering lebih penting daripada algoritmanya.",
    code: `nilai = [72, 85, 90, 85, 60]
nama = {"Ani": 85, "Budi": 72}
nama["Citra"] = 90

unik = set(nilai)
print(len(nilai), len(unik))
print(nama.get("Dodi", 0), sorted(unik)[-1])`,
    explain: [
      "set(nilai) membuang duplikat: 85 hanya dihitung sekali. Ini himpunan di materi Logika.",
      "dict.get(kunci, bawaan) tidak error bila kuncinya tidak ada.",
      "Mencari di set dan dict rata-rata O(1); mencari di list O(n).",
    ],
    quiz: {
      q: "Apa yang dicetak baris pertama?",
      options: ["5 5", "5 4", "4 4", "5 3"],
      answer: 1,
      why: "Lima nilai, empat yang unik (72, 85, 90, 60).",
    },
    topic: "diskrit",
  },
  {
    id: "py-komprehensi",
    lang: "python",
    title: "List comprehension",
    minutes: 10,
    idea: "Comprehension menulis “ubah setiap anggota, saring yang memenuhi syarat” dalam satu baris yang terbaca seperti kalimat matematika.",
    code: `suhu_c = [20, 25, 30, 35]
suhu_f = [c * 9 / 5 + 32 for c in suhu_c]
panas = [f for f in suhu_f if f > 80]
print(panas, sum(suhu_c) / len(suhu_c))`,
    explain: [
      "Baris kedua sama dengan {9c/5 + 32 | c ∈ suhu_c} dalam notasi himpunan.",
      "if di akhir menyaring: hanya suhu di atas 80 °F yang dipertahankan.",
      "Pembagian / di Python selalu menghasilkan float, jadi 68 menjadi 68.0.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["[86, 95] 27", "[86.0, 95.0] 27.5", "[77.0, 86.0, 95.0] 27.5", "[95.0] 27.5"],
      answer: 1,
      why: "Fahrenheit: 68, 77, 86, 95. Yang > 80: 86 dan 95. Rata-rata Celcius 110/4 = 27,5.",
    },
  },
  {
    id: "py-file",
    lang: "python",
    title: "Membaca CSV dan menjumlah per kelompok",
    minutes: 12,
    idea: "Data nyata datang sebagai file teks. Modul csv membaca baris demi baris; setiap nilai awalnya berupa teks dan harus diubah ke angka sebelum dihitung.",
    code: `import csv, io

data = io.StringIO("""kota,omzet
Bandung,10
Bandung,30
Medan,20
Medan,20
Medan,50""")

total = {}
for baris in csv.DictReader(data):
    total[baris["kota"]] = total.get(baris["kota"], 0) + int(baris["omzet"])
print(total)`,
    explain: [
      "io.StringIO berpura-pura menjadi file; di proyek nyata ganti dengan open(\"penjualan.csv\").",
      "DictReader memakai baris pertama sebagai nama kolom.",
      "Tanpa int(), \"10\" + \"30\" menjadi teks \"1030\", bukan 40.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["{'Bandung': 40, 'Medan': 90}", "{'Bandung': '1030', 'Medan': '202050'}", "{'Bandung': 20, 'Medan': 30}", "[40, 90]"],
      answer: 0,
      why: "Omzet tiap kota dijumlahkan sebagai bilangan: 10+30 dan 20+20+50.",
    },
    topic: "sampel",
  },
  {
    id: "py-uji",
    lang: "python",
    title: "Menguji kode dengan assert",
    minutes: 12,
    idea: "Kode yang belum diuji hanya dugaan. assert memeriksa satu fakta; kumpulan assert adalah tes yang bisa dijalankan ulang setiap kali kode diubah. pytest menjalankan ratusan tes seperti ini sekaligus.",
    code: `def median(data):
    urut = sorted(data)
    n = len(urut)
    tengah = n // 2
    if n % 2:
        return urut[tengah]
    return (urut[tengah - 1] + urut[tengah]) / 2

assert median([3, 1, 2]) == 2
assert median([4, 1, 3, 2]) == 2.5
assert median([5]) == 5
print("semua tes lulus")
print(median([10, 2, 8, 4]))`,
    explain: [
      "Uji kasus ganjil, genap, dan satu data: tiga cabang kode, tiga tes.",
      "Bila satu assert salah, program berhenti dengan AssertionError dan menunjuk barisnya.",
      "Tantangan kode di halaman Kode dinilai dengan cara yang sama.",
    ],
    quiz: {
      q: "Apa yang dicetak baris terakhir?",
      options: ["6.0", "5.0", "8", "AssertionError"],
      answer: 0,
      why: "Diurutkan 2, 4, 8, 10; dua nilai tengah 4 dan 8, rata-ratanya 6.0.",
    },
    topic: "sampel",
  },
  {
    id: "py-algoritma",
    lang: "python",
    title: "Pencarian biner dan Big-O",
    minutes: 14,
    idea: "Pada data terurut, membuang separuh kemungkinan di setiap langkah membuat pencarian di sejuta data selesai dalam sekitar 20 langkah. Big-O menyebut pertumbuhannya: O(log n).",
    code: `def cari_biner(arr, target):
    kiri, kanan, langkah = 0, len(arr) - 1, 0
    while kiri <= kanan:
        langkah += 1
        tengah = (kiri + kanan) // 2
        if arr[tengah] == target:
            return tengah, langkah
        if arr[tengah] < target:
            kiri = tengah + 1
        else:
            kanan = tengah - 1
    return -1, langkah

data = list(range(0, 1000, 2))   # 500 bilangan genap
print(cari_biner(data, 998))`,
    explain: [
      "500 data, tetapi paling banyak ⌈log₂ 500⌉ = 9 langkah.",
      "Pencarian linear butuh sampai 500 langkah untuk data yang sama.",
      "Syaratnya: data harus terurut. Mengurutkan sendiri butuh O(n log n).",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["(499, 9)", "(499, 500)", "(998, 9)", "(-1, 9)"],
      answer: 0,
      why: "998 ada di indeks terakhir (499) dan ditemukan dalam 9 langkah.",
    },
    topic: "eksponen",
  },
  {
    id: "py-rekursi",
    lang: "python",
    title: "Rekursi dan memoisasi",
    minutes: 12,
    idea: "Fungsi rekursif memanggil dirinya untuk soal yang lebih kecil. Tanpa ingatan, ia menghitung ulang hal yang sama berkali-kali; memoisasi menyimpan hasil yang sudah dihitung.",
    code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(30), fib.cache_info().misses)`,
    explain: [
      "Tanpa @lru_cache, fib(30) memanggil fungsi lebih dari 1,6 juta kali.",
      "Dengan cache, setiap n dari 0 sampai 30 hanya dihitung sekali: 31 kali.",
      "Ide yang sama dipakai di pemrograman dinamis, misalnya penjajaran urutan DNA.",
    ],
    quiz: {
      q: "Berapa nilai misses (berapa kali fib benar-benar dihitung)?",
      options: ["30", "31", "832040", "1346269"],
      answer: 1,
      why: "Setiap n dari 0 sampai 30 dihitung tepat sekali: 31 nilai.",
    },
    topic: "barisan",
  },
  // ------------------------------------------------------------------- SQL
  {
    id: "sql-select",
    lang: "sql",
    title: "SELECT, WHERE, ORDER BY",
    minutes: 10,
    idea: "SELECT memilih kolom, FROM menyebut tabel, WHERE menyaring baris, ORDER BY mengurutkan. Urutan menulisnya selalu begitu.",
    code: `-- tabel penjualan:
-- id | kota    | omzet
--  1 | Bandung | 10
--  2 | Bandung | 30
--  3 | Medan   | 20
--  4 | Medan   | 20
--  5 | Medan   | 50

SELECT kota, omzet
FROM penjualan
WHERE omzet >= 20
ORDER BY omzet DESC;`,
    explain: [
      "WHERE omzet >= 20 membuang baris pertama (10).",
      "DESC berarti dari besar ke kecil.",
      "SQL tidak mengubah tabel aslinya; ia hanya mengembalikan hasil.",
    ],
    quiz: {
      q: "Berapa baris yang dikembalikan, dan apa baris pertamanya?",
      options: ["5 baris, Bandung 10", "4 baris, Medan 50", "3 baris, Medan 50", "4 baris, Bandung 30"],
      answer: 1,
      why: "Empat baris lolos saringan (30, 20, 20, 50); diurutkan menurun, yang pertama Medan 50.",
    },
  },
  {
    id: "sql-agregat",
    lang: "sql",
    title: "GROUP BY dan agregat",
    minutes: 10,
    idea: "GROUP BY memecah tabel per kelompok; fungsi agregat (COUNT, SUM, AVG, MIN, MAX) meringkas tiap kelompok menjadi satu baris.",
    code: `SELECT kota,
       COUNT(*)   AS n,
       AVG(omzet) AS rata
FROM penjualan
GROUP BY kota;`,
    explain: [
      "Satu baris hasil per kota.",
      "COUNT(*) menghitung baris; AVG menghitung rata-rata.",
      "SQL standar tidak punya MEDIAN di semua basis data. Rata-rata yang tertarik pencilan tetap harus dicurigai.",
    ],
    quiz: {
      q: "Berapa rata untuk Medan?",
      options: ["20", "30", "50", "90"],
      answer: 1,
      why: "(20 + 20 + 50) / 3 = 30.",
    },
    topic: "sampel",
  },
  {
    id: "sql-join",
    lang: "sql",
    title: "JOIN: menggabung dua tabel",
    minutes: 12,
    idea: "JOIN memasangkan baris dari dua tabel berdasarkan kolom yang sama. INNER JOIN hanya menyimpan pasangan yang cocok; LEFT JOIN menyimpan semua baris tabel kiri.",
    code: `-- pelanggan: (1, Ani), (2, Budi), (3, Citra)
-- pesanan:   (10, pelanggan 1, 50), (11, pelanggan 1, 70), (12, pelanggan 2, 40)

SELECT p.nama, s.total
FROM pelanggan p
LEFT JOIN pesanan s ON s.pelanggan_id = p.id;`,
    explain: [
      "Ani punya dua pesanan, jadi muncul dua kali.",
      "Citra tidak punya pesanan; LEFT JOIN tetap menampilkannya dengan total NULL.",
      "Dengan INNER JOIN, Citra hilang dan hasilnya 3 baris.",
    ],
    quiz: {
      q: "Berapa baris hasil LEFT JOIN ini?",
      options: ["3", "4", "6", "9"],
      answer: 1,
      why: "Ani 2 baris + Budi 1 baris + Citra 1 baris (NULL) = 4.",
    },
    topic: "diskrit",
  },
  {
    id: "sql-having",
    lang: "sql",
    title: "COUNT DISTINCT dan HAVING",
    minutes: 10,
    idea: "COUNT(DISTINCT kolom) menghitung nilai unik, seperti ukuran himpunan. HAVING menyaring hasil setelah dikelompokkan; WHERE menyaring sebelumnya.",
    code: `SELECT COUNT(*)                     AS pesanan,
       COUNT(DISTINCT pelanggan_id) AS pembeli
FROM pesanan;

SELECT pelanggan_id, SUM(total) AS belanja
FROM pesanan
GROUP BY pelanggan_id
HAVING SUM(total) > 50;`,
    explain: [
      "Ada 3 pesanan dari 2 pembeli unik. Melaporkan 3 pembeli adalah salah hitung himpunan.",
      "Query kedua: Ani belanja 120, Budi 40. HAVING hanya meloloskan Ani.",
    ],
    quiz: {
      q: "Berapa nilai kolom pembeli pada query pertama?",
      options: ["1", "2", "3", "120"],
      answer: 1,
      why: "pelanggan_id unik hanya 1 dan 2.",
    },
    topic: "diskrit",
  },
  {
    id: "sql-window",
    lang: "sql",
    title: "Fungsi jendela: rata-rata bergerak",
    minutes: 12,
    idea: "Fungsi jendela menghitung ringkasan tanpa meringkas baris: setiap baris tetap ada, tetapi mendapat nilai dari tetangganya. Cocok untuk tren deret waktu.",
    code: `-- mingguan: (1, 10), (2, 20), (3, 30), (4, 40)

SELECT minggu,
       AVG(nilai) OVER (
         ORDER BY minggu
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS rata3
FROM mingguan;`,
    explain: [
      "Jendela berisi baris itu sendiri dan dua baris sebelumnya.",
      "Minggu 1 hanya punya dirinya (10); minggu 2 rata-rata 10 dan 20.",
      "Rata-rata bergerak meredam lonjakan sesaat agar tren terlihat.",
    ],
    quiz: {
      q: "Berapa rata3 di minggu 4?",
      options: ["25", "30", "40", "100"],
      answer: 1,
      why: "(20 + 30 + 40) / 3 = 30.",
    },
    topic: "barisan",
  },
  {
    id: "sql-ab",
    lang: "sql",
    title: "Uji A/B dan jebakan pembagian bulat",
    minutes: 12,
    idea: "Tingkat konversi adalah pembagian. Di banyak basis data, bilangan bulat dibagi bilangan bulat dibulatkan ke bawah, jadi 50/1000 menjadi 0.",
    code: `-- ab: 1000 baris varian A (50 beli), 1000 baris varian B (62 beli)

SELECT varian, SUM(beli) / COUNT(*) AS salah
FROM ab GROUP BY varian;

SELECT varian, ROUND(SUM(beli) * 1.0 / COUNT(*), 3) AS konversi
FROM ab GROUP BY varian;`,
    explain: [
      "Query pertama memberi 0 untuk kedua varian: pembagian bulat.",
      "Mengalikan 1.0 mengubahnya menjadi desimal: 0,05 dan 0,062.",
      "Langkah berikutnya bukan mengumumkan pemenang, tetapi menghitung galat baku selisihnya (materi Interval kepercayaan).",
    ],
    quiz: {
      q: "Di SQLite atau PostgreSQL, apa nilai kolom salah untuk varian A?",
      options: ["0.05", "0", "5", "50"],
      answer: 1,
      why: "50 / 1000 dengan dua bilangan bulat dibulatkan ke bawah menjadi 0.",
    },
    topic: "inferensi",
  },

  {
    id: "sql-cte",
    lang: "sql",
    title: "Subquery dan CTE",
    minutes: 12,
    idea: "CTE (WITH … AS) memberi nama pada hasil antara, sehingga query panjang terbaca bertahap. Subquery di WHERE membandingkan setiap baris dengan hasil ringkasan.",
    code: `WITH total_kota AS (
  SELECT kota, SUM(omzet) AS total
  FROM penjualan
  GROUP BY kota
)
SELECT kota, total
FROM total_kota
WHERE total > (SELECT AVG(total) FROM total_kota);`,
    explain: [
      "Langkah 1: total per kota (Bandung 40, Medan 90).",
      "Langkah 2: rata-rata total kota = 65.",
      "Langkah 3: hanya kota di atas 65 yang tampil.",
    ],
    quiz: {
      q: "Apa hasilnya?",
      options: ["Bandung 40", "Medan 90", "Bandung 40 dan Medan 90", "Tidak ada baris"],
      answer: 1,
      why: "Rata-rata (40 + 90)/2 = 65; hanya Medan yang di atasnya.",
    },
  },
  {
    id: "sql-indeks",
    lang: "sql",
    title: "Indeks dan EXPLAIN",
    minutes: 12,
    idea: "Tanpa indeks, basis data membaca seluruh tabel (SCAN) untuk menemukan beberapa baris. Indeks seperti daftar isi buku: langsung melompat ke halaman yang dicari (SEARCH).",
    code: `CREATE INDEX idx_pesanan_pelanggan ON pesanan(pelanggan_id);

EXPLAIN QUERY PLAN
SELECT * FROM pesanan WHERE pelanggan_id = 1;`,
    explain: [
      "EXPLAIN QUERY PLAN tidak menjalankan query; ia menunjukkan rencananya.",
      "SEARCH … USING INDEX berarti indeks dipakai; SCAN berarti seluruh tabel dibaca.",
      "Indeks mempercepat baca tetapi memperlambat tulis sedikit. Buat untuk kolom yang sering disaring atau di-JOIN.",
    ],
    quiz: {
      q: "Kata apa di hasil EXPLAIN yang menandakan seluruh tabel dibaca?",
      options: ["SEARCH", "SCAN", "INDEX", "PLAN"],
      answer: 1,
      why: "SCAN membaca semua baris satu per satu; pada jutaan baris ini lambat.",
    },
  },
  // ------------------------------------------------------------------- C++
  {
    id: "cpp-dasar",
    lang: "cpp",
    title: "Tipe data dan pembagian bulat",
    minutes: 10,
    idea: "C++ menuntut tipe untuk setiap variabel. int menyimpan bilangan bulat, double desimal. Operasi antara dua int tetap int.",
    code: `#include <iostream>

int main() {
  int a = 7, b = 2;
  double c = 7.0 / 2;
  std::cout << a / b << " " << c << "\\n";
}`,
    explain: [
      "a / b dengan dua int membuang sisa: 3.",
      "7.0 / 2 melibatkan double, jadi hasilnya 3.5.",
      "Bug sensor yang paling sering: rata-rata dihitung dengan int dan desimalnya hilang.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["3.5 3.5", "3 3.5", "3 3", "4 3.5"],
      answer: 1,
      why: "Pembagian bulat 7/2 = 3; pembagian desimal 7.0/2 = 3.5.",
    },
    topic: "bilangan",
  },
  {
    id: "cpp-overflow",
    lang: "cpp",
    title: "Overflow: bilangan yang berputar",
    minutes: 10,
    idea: "Tipe berukuran tetap punya batas. uint8_t hanya 0 sampai 255; melewati batas membuatnya berputar kembali, persis aritmetika modular 256.",
    code: `#include <cstdint>
#include <iostream>

int main() {
  uint8_t x = 250;
  x += 10;
  std::cout << int(x) << "\\n";
}`,
    explain: [
      "250 + 10 = 260, tetapi 8 bit hanya muat 256 nilai.",
      "260 mod 256 = 4.",
      "Penghitung waktu millis() di Arduino juga berputar setelah sekitar 49 hari; kode yang benar memakai selisih, bukan perbandingan langsung.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["260", "255", "4", "-6"],
      answer: 2,
      why: "Bilangan 8 bit tak bertanda berputar di 256: 260 − 256 = 4.",
    },
    topic: "modular",
  },
  {
    id: "cpp-arduino",
    lang: "cpp",
    title: "Arduino: setup() dan loop()",
    minutes: 10,
    idea: "Program mikrokontroler tidak pernah selesai. setup() berjalan sekali saat menyala; loop() diulang selamanya.",
    code: `const int LED = 13;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, HIGH);
  delay(250);
  digitalWrite(LED, LOW);
  delay(250);
}`,
    explain: [
      "delay(250) menunggu 250 milidetik.",
      "Satu putaran loop: nyala 250 ms + mati 250 ms = 500 ms.",
      "delay() membuat mikrokontroler diam total. Program yang harus membaca sensor sambil berkedip memakai millis().",
    ],
    quiz: {
      q: "Berapa kali LED berkedip per detik?",
      options: ["1", "2", "4", "250"],
      answer: 1,
      why: "Periode 0,5 s, jadi frekuensinya 1/0,5 = 2 Hz.",
    },
    topic: "gelombang",
  },
  {
    id: "cpp-adc",
    lang: "cpp",
    title: "Membaca sensor: ADC dan skala",
    minutes: 10,
    idea: "Tegangan sensor diubah ADC menjadi bilangan bulat. Arduino Uno memakai ADC 10 bit: 0 sampai 1023 untuk 0 sampai 5 V.",
    code: `void loop() {
  int raw = analogRead(A0);          // 0..1023
  float volt = raw * 5.0 / 1023.0;
  float suhu = volt * 100.0;         // LM35: 10 mV per °C
  Serial.println(suhu);
  delay(1000);                       // 1 cuplikan per detik
}`,
    explain: [
      "10 bit memberi 2¹⁰ = 1024 tingkat; satu langkah ≈ 4,9 mV.",
      "LM35 mengeluarkan 10 mV per °C, jadi volt × 100 = °C.",
      "delay(1000) berarti laju sampling 1 Hz. Cukup untuk suhu, terlalu lambat untuk getaran.",
    ],
    quiz: {
      q: "Jika raw = 512, berapa kira-kira volt?",
      options: ["0,5 V", "1,0 V", "2,5 V", "5,12 V"],
      answer: 2,
      why: "512 × 5 / 1023 ≈ 2,50 V, sekitar setengah skala.",
    },
    topic: "sinyal",
  },
  {
    id: "cpp-pid",
    lang: "cpp",
    title: "PID dengan langkah waktu tetap",
    minutes: 14,
    idea: "Pengendali PID ditulis sebagai fungsi yang dipanggil pada laju tetap. Integral adalah penjumlahan galat × dt; turunan adalah selisih galat dibagi dt.",
    code: `float kp = 2.0, ki = 0.5, kd = 0.1;
float integral = 0, prevErr = 0;

float pid(float target, float ukur, float dt) {
  float err = target - ukur;
  integral += err * dt;
  float deriv = (err - prevErr) / dt;
  prevErr = err;
  return kp * err + ki * integral + kd * deriv;
}

// panggilan pertama: pid(10, 8, 0.1)`,
    explain: [
      "err = 2, integral = 0,2, deriv = (2 − 0)/0,1 = 20.",
      "Keluaran = 2×2 + 0,5×0,2 + 0,1×20 = 4 + 0,1 + 2 = 6,1.",
      "Lonjakan dari suku D pada panggilan pertama disebut derivative kick. Pengendali nyata menurunkan ukuran, bukan galat, untuk menghindarinya.",
    ],
    quiz: {
      q: "Berapa keluaran panggilan pertama pid(10, 8, 0.1)?",
      options: ["4.0", "4.1", "6.1", "24.1"],
      answer: 2,
      why: "P = 4, I = 0,1, D = 2. Jumlahnya 6,1.",
    },
    topic: "kendali",
  },
  {
    id: "cpp-ros",
    lang: "cpp",
    title: "ROS 2: node, topik, dan laju",
    minutes: 12,
    idea: "Robot modern terdiri dari banyak program kecil (node) yang saling mengirim pesan lewat topik. Satu node membaca IMU, satu menghitung kendali, satu menggerakkan motor.",
    code: `#include <chrono>
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/float32.hpp"
using namespace std::chrono_literals;

class Ketinggian : public rclcpp::Node {
 public:
  Ketinggian() : Node("ketinggian") {
    pub_ = create_publisher<std_msgs::msg::Float32>("/tinggi", 10);
    timer_ = create_wall_timer(100ms, [this] {
      std_msgs::msg::Float32 m;
      m.data = bacaBarometer();
      pub_->publish(m);
    });
  }
 private:
  float bacaBarometer() { return 1.5f; }
  rclcpp::Publisher<std_msgs::msg::Float32>::SharedPtr pub_;
  rclcpp::TimerBase::SharedPtr timer_;
};`,
    explain: [
      "create_publisher membuat topik /tinggi bertipe Float32.",
      "create_wall_timer(100ms, …) memanggil fungsi setiap 100 milidetik.",
      "Node lain cukup subscribe ke /tinggi; mereka tidak perlu tahu sensor apa yang dipakai.",
    ],
    quiz: {
      q: "Pada laju berapa pesan /tinggi dikirim?",
      options: ["1 Hz", "10 Hz", "100 Hz", "1000 Hz"],
      answer: 1,
      why: "Satu pesan tiap 0,1 s berarti 10 pesan per detik.",
    },
    topic: "sinyal",
  },

  {
    id: "cpp-pointer",
    lang: "cpp",
    title: "Nilai, referensi, dan pointer",
    minutes: 12,
    idea: "C++ membedakan menyalin nilai, meminjam variabel (referensi &), dan menunjuk alamatnya (pointer *). Ini yang membuat C++ cepat, dan juga sumber bug paling berbahaya.",
    code: `#include <iostream>

void tambah(int nilai, int& ref, int* ptr) {
  nilai += 1;   // salinan: tidak berpengaruh ke luar
  ref += 1;     // referensi: mengubah variabel asli
  *ptr += 1;    // pointer: mengubah isi di alamat itu
}

int main() {
  int a = 0, b = 0, c = 0;
  tambah(a, b, &c);
  std::cout << a << b << c << "\\n";
}`,
    explain: [
      "a disalin, jadi tetap 0.",
      "b dan c berubah karena fungsi bekerja pada variabel aslinya.",
      "Pointer yang menunjuk ke memori yang sudah dibebaskan adalah celah keamanan klasik.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["000", "111", "011", "001"],
      answer: 2,
      why: "Hanya salinan a yang tidak kembali; b lewat referensi dan c lewat pointer berubah.",
    },
  },
  {
    id: "cpp-kelas",
    lang: "cpp",
    title: "Struct, vector, dan filter sensor",
    minutes: 12,
    idea: "struct mengemas data dan fungsinya; std::vector adalah array yang bisa tumbuh. Bersama-sama mereka membentuk filter rata-rata bergerak yang biasa dipakai untuk sensor yang berisik.",
    code: `#include <iostream>
#include <numeric>
#include <vector>

struct Sensor {
  std::vector<float> data;
  void tambah(float x) {
    data.push_back(x);
    if (data.size() > 3) data.erase(data.begin());
  }
  float rata() const {
    return std::accumulate(data.begin(), data.end(), 0.0f) / data.size();
  }
};

int main() {
  Sensor s;
  for (float x : {10.0f, 20.0f, 30.0f, 40.0f}) s.tambah(x);
  std::cout << s.rata() << "\\n";
}`,
    explain: [
      "Hanya tiga bacaan terakhir yang disimpan; yang tertua dibuang.",
      "std::accumulate menjumlahkan isi vector.",
      "Di mikrokontroler, buffer melingkar (circular buffer) lebih hemat daripada erase.",
    ],
    quiz: {
      q: "Apa yang dicetak?",
      options: ["25", "30", "20", "100"],
      answer: 1,
      why: "Tersisa 20, 30, 40; rata-ratanya 30.",
    },
    topic: "sampel",
  },
  // --------------------------------------------------------------------- R
  {
    id: "r-vektor",
    lang: "r",
    title: "Vektor dan ringkasan",
    minutes: 10,
    idea: "Di R, hampir semua hal adalah vektor. Fungsi statistik bekerja langsung pada seluruh vektor.",
    code: `gaji <- c(rep(5, 9), 95)   # sembilan orang 5 juta, satu direktur 95 juta
mean(gaji)
median(gaji)
sd(gaji)                    # simpangan baku sampel (bagi n-1)`,
    explain: [
      "rep(5, 9) mengulang angka 5 sembilan kali; c() menggabungkan.",
      "sd() di R memakai pembagi n−1, sesuai materi Statistik sampel.",
      "Kasus ini sama dengan “Gaji rata-rata yang menyesatkan”.",
    ],
    quiz: {
      q: "Apa hasil mean(gaji) dan median(gaji)?",
      options: ["14 dan 14", "14 dan 5", "5 dan 5", "50 dan 5"],
      answer: 1,
      why: "Rata-rata (45 + 95)/10 = 14; median tetap 5.",
    },
    topic: "sampel",
  },
  {
    id: "r-uji",
    lang: "r",
    title: "Uji t dan interval kepercayaan",
    minutes: 12,
    idea: "Satu baris t.test() memberi nilai p dan interval kepercayaan 95%. Yang sulit bukan menjalankannya, tetapi membacanya dengan jujur.",
    code: `lama <- c(12.1, 11.8, 12.4, 12.0, 11.9, 12.3)
baru <- c(11.2, 11.6, 11.4, 11.9, 11.1, 11.5)

hasil <- t.test(lama, baru)
hasil$p.value
hasil$conf.int`,
    explain: [
      "t.test membandingkan rata-rata dua kelompok, misalnya waktu proses mesin lama dan baru.",
      "conf.int adalah interval 95% untuk selisih rata-rata.",
      "Jika interval itu tidak memuat 0, selisihnya sulit dijelaskan sebagai kebetulan sampel.",
    ],
    quiz: {
      q: "Interval 95% selisih rata-rata adalah 0,3 sampai 0,9. Apa artinya?",
      options: [
        "Ada 95% peluang selisih sebenarnya tepat 0,6",
        "Selisihnya kemungkinan nyata, karena 0 tidak ada di interval",
        "Mesin baru 95% lebih cepat",
        "Data pasti berdistribusi normal",
      ],
      answer: 1,
      why: "Interval yang tidak memuat 0 berarti data tidak cocok dengan dugaan “tidak ada selisih”.",
    },
    topic: "inferensi",
  },
  {
    id: "r-lm",
    lang: "r",
    title: "Regresi dengan lm()",
    minutes: 10,
    idea: "lm() mencocokkan model linear dengan rumus ala R: y ~ x dibaca “y dijelaskan oleh x”.",
    code: `iklan     <- c(1, 2, 3, 4, 5)
penjualan <- c(12, 14, 18, 20, 21)

model <- lm(penjualan ~ iklan)
coef(model)
summary(model)$r.squared`,
    explain: [
      "coef() mengembalikan (Intercept) lalu kemiringan iklan.",
      "r.squared adalah porsi variasi penjualan yang dijelaskan garis.",
      "summary(model) juga memberi galat baku dan nilai p tiap koefisien.",
    ],
    quiz: {
      q: "Apa hasil coef(model)?",
      options: ["(Intercept) 2.4, iklan 9.8", "(Intercept) 9.8, iklan 2.4", "(Intercept) 17, iklan 3", "(Intercept) 0, iklan 4.25"],
      answer: 1,
      why: "Sama dengan hitungan tangan: a = 9,8 dan b = 2,4.",
    },
    topic: "regresi",
  },
  {
    id: "r-dplyr",
    lang: "r",
    title: "dplyr dan pipa",
    minutes: 10,
    idea: "Pipa |> mengalirkan tabel dari satu langkah ke langkah berikutnya, sehingga analisis terbaca seperti kalimat: ambil data, saring, kelompokkan, ringkas.",
    code: `library(dplyr)

penjualan |>
  filter(omzet >= 20) |>
  group_by(kota) |>
  summarise(n = n(), median = median(omzet))`,
    explain: [
      "filter membuang baris; group_by membagi; summarise meringkas.",
      "Dengan data penjualan yang sama seperti di pelajaran SQL, baris Bandung 10 terbuang.",
      "Hasilnya: Bandung n = 1, Medan n = 3.",
    ],
    quiz: {
      q: "Berapa n untuk Medan?",
      options: ["1", "2", "3", "5"],
      answer: 2,
      why: "Ketiga baris Medan (20, 20, 50) lolos filter omzet ≥ 20.",
    },
    topic: "sampel",
  },

  {
    id: "r-ggplot",
    lang: "r",
    title: "ggplot2: grafik berlapis",
    minutes: 10,
    idea: "ggplot2 membangun grafik lapis demi lapis: data, pemetaan sumbu, lalu geometri. Satu baris tambahan menambahkan garis regresi lengkap dengan pita ketidakpastiannya.",
    code: `library(ggplot2)

df <- data.frame(iklan = 1:5, penjualan = c(12, 14, 18, 20, 21))

ggplot(df, aes(x = iklan, y = penjualan)) +
  geom_point() +
  geom_smooth(method = "lm", se = TRUE) +
  labs(x = "Biaya iklan (juta)", y = "Penjualan (juta)")`,
    explain: [
      "aes() memetakan kolom ke sumbu.",
      "geom_smooth(method = \"lm\") menggambar garis regresi linear.",
      "se = TRUE menambahkan pita interval kepercayaan 95% di sekitar garis.",
    ],
    quiz: {
      q: "Apa yang ditambahkan se = TRUE?",
      options: ["Label sumbu", "Pita interval kepercayaan di sekitar garis", "Titik data", "Judul grafik"],
      answer: 1,
      why: "se berarti standard error; pitanya menunjukkan ketidakpastian garis.",
    },
    topic: "regresi",
  },
  // ------------------------------------------------------------------ Bash
  {
    id: "sh-dasar",
    lang: "bash",
    title: "Navigasi, file, dan menghitung baris",
    minutes: 10,
    idea: "Terminal bekerja dengan perintah pendek: pwd (di mana aku), ls (isi folder), cd (pindah), head (lihat awal file), wc (hitung).",
    code: `pwd
ls -lh data/
head -n 3 data/penjualan.csv
wc -l data/penjualan.csv
# 101 data/penjualan.csv`,
    explain: [
      "ls -lh menampilkan ukuran file yang mudah dibaca (K, M, G).",
      "head -n 3 menampilkan tiga baris pertama, termasuk header.",
      "wc -l menghitung baris. File CSV biasanya punya satu baris header.",
    ],
    quiz: {
      q: "wc -l mencetak 101 untuk file CSV dengan header. Berapa baris data?",
      options: ["99", "100", "101", "102"],
      answer: 1,
      why: "101 baris dikurangi 1 baris header = 100 baris data.",
    },
  },
  {
    id: "sh-pipa",
    lang: "bash",
    title: "Pipa: grep, sort, uniq",
    minutes: 12,
    idea: "Pipa | mengalirkan keluaran satu perintah ke perintah berikutnya. Gabungan kecil ini cukup untuk menemukan serangan di log server.",
    code: `# auth.log (potongan):
# Failed password for root from 10.0.0.5
# Accepted password for ani from 10.0.0.9
# Failed password for root from 10.0.0.5
# Failed password for admin from 10.0.0.7
# Accepted password for budi from 10.0.0.9

grep "Failed password" auth.log | wc -l
grep "Failed password" auth.log | awk '{print $NF}' | sort | uniq -c | sort -rn`,
    explain: [
      "grep menyaring baris yang memuat teks itu.",
      "awk '{print $NF}' mengambil kolom terakhir: alamat IP.",
      "sort | uniq -c menghitung kemunculan tiap IP; sort -rn mengurutkan dari yang terbanyak.",
    ],
    quiz: {
      q: "Apa keluaran perintah pertama?",
      options: ["2", "3", "5", "10.0.0.5"],
      answer: 1,
      why: "Ada tiga baris “Failed password”.",
    },
    topic: "diskrit",
  },
  {
    id: "sh-izin",
    lang: "bash",
    title: "Izin file: chmod dan bilangan oktal",
    minutes: 10,
    idea: "Setiap file punya izin baca (r=4), tulis (w=2), jalankan (x=1) untuk pemilik, grup, dan lainnya. Tiap digit oktal adalah tiga bit.",
    code: `chmod 640 kunci_rahasia.pem
ls -l kunci_rahasia.pem
# -rw-r----- 1 ani dev 1.7K kunci_rahasia.pem`,
    explain: [
      "6 = 110 biner = rw-: pemilik boleh baca dan tulis.",
      "4 = 100 = r--: grup hanya baca. 0 = ---: orang lain tidak boleh apa-apa.",
      "Kunci SSH yang bisa dibaca semua orang adalah celah keamanan klasik.",
    ],
    quiz: {
      q: "Izin apa yang diberikan digit 7?",
      options: ["r--", "rw-", "r-x", "rwx"],
      answer: 3,
      why: "7 = 111 biner = 4 + 2 + 1: baca, tulis, dan jalankan.",
    },
    topic: "diskrit",
  },
  {
    id: "sh-hash",
    lang: "bash",
    title: "Hash dan integritas file",
    minutes: 10,
    idea: "Hash kriptografis meringkas file menjadi sidik jari pendek. Satu bit file berubah, sidik jarinya berubah total. Dipakai untuk memeriksa unduhan dan menyimpan kata sandi.",
    code: `sha256sum installer.iso
# 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08  installer.iso

echo -n "halo" | sha256sum
echo -n "Halo" | sha256sum   # hasil sama sekali berbeda`,
    explain: [
      "SHA-256 menghasilkan 256 bit, ditulis sebagai heksadesimal.",
      "Satu digit heksadesimal = 4 bit.",
      "Bandingkan hash unduhan dengan yang diumumkan situs resmi sebelum menjalankan installer.",
    ],
    quiz: {
      q: "Berapa karakter heksadesimal dalam satu hash SHA-256?",
      options: ["32", "64", "128", "256"],
      answer: 1,
      why: "256 bit / 4 bit per karakter = 64 karakter.",
    },
    topic: "entropi",
  },
  {
    id: "sh-skrip",
    lang: "bash",
    title: "Skrip, variabel, dan perulangan",
    minutes: 12,
    idea: "Perintah yang diketik berulang-ulang sebaiknya dijadikan skrip. set -euo pipefail membuat skrip berhenti saat ada yang salah, bukan diam-diam melanjutkan dengan data rusak.",
    code: `#!/usr/bin/env bash
set -euo pipefail

for f in data/*.csv; do
  baris=$(( $(wc -l < "$f") - 1 ))
  echo "$f: $baris baris data"
done`,
    explain: [
      "for f in data/*.csv mengulang untuk setiap file CSV di folder data.",
      "$(( … )) adalah aritmetika; wc -l < \"$f\" menghitung baris tanpa mencetak nama file.",
      "Tanda kutip di \"$f\" mencegah error bila nama file mengandung spasi.",
    ],
    quiz: {
      q: "Apa efek set -e?",
      options: [
        "Mencetak setiap perintah sebelum dijalankan",
        "Menghentikan skrip begitu ada perintah yang gagal",
        "Mengabaikan semua galat",
        "Menjalankan skrip lebih cepat",
      ],
      answer: 1,
      why: "-e: keluar saat perintah gagal; -u: galat bila variabel belum diisi; pipefail: kegagalan di tengah pipa ikut terdeteksi.",
    },
  },
];

/** Bahasa yang disarankan untuk tiap peta, urut prioritas, lengkap dengan pelajaran yang relevan. */
export type RoadLang = { lang: LangId; why: string; lessons: string[]; optional?: boolean };

export const ROAD_LANGS: Record<string, RoadLang[]> = {
  analis: [
    { lang: "sql", why: "Bahasa sehari-hari analis: hampir semua angka diambil dari basis data.", lessons: ["sql-select", "sql-agregat", "sql-join", "sql-having", "sql-window", "sql-cte", "sql-ab"] },
    { lang: "python", why: "pandas dan grafik untuk analisis yang tidak muat di spreadsheet.", lessons: ["py-dasar", "py-alur", "py-struktur", "py-file", "py-pandas", "py-plot"] },
    { lang: "r", why: "Alternatif Python untuk uji statistik cepat.", lessons: ["r-vektor", "r-uji"], optional: true },
  ],
  ilmuwan: [
    { lang: "python", why: "Ekosistem utama ilmu data: NumPy, pandas, scikit-learn.", lessons: ["py-dasar", "py-alur", "py-struktur", "py-komprehensi", "py-fungsi", "py-kelas", "py-file", "py-uji", "py-numpy", "py-pandas", "py-plot", "py-gd", "py-sklearn"] },
    { lang: "sql", why: "Mengambil dan menyiapkan data sendiri tanpa menunggu tim lain.", lessons: ["sql-select", "sql-agregat", "sql-join", "sql-window", "sql-cte"] },
    { lang: "r", why: "Banyak dipakai di riset dan statistik terapan.", lessons: ["r-vektor", "r-lm", "r-dplyr"], optional: true },
  ],
  ai: [
    { lang: "python", why: "Bahasa hampir semua kerangka AI: PyTorch, Hugging Face, LangChain.", lessons: ["py-dasar", "py-alur", "py-struktur", "py-komprehensi", "py-fungsi", "py-kelas", "py-uji", "py-algoritma", "py-numpy", "py-gd", "py-torch", "py-sklearn"] },
    { lang: "bash", why: "Melatih model berarti bekerja di server GPU lewat terminal.", lessons: ["sh-dasar", "sh-pipa"] },
    { lang: "sql", why: "Data pelatihan dan log evaluasi sering tinggal di tabel.", lessons: ["sql-select", "sql-agregat"], optional: true },
  ],
  aktuaris: [
    { lang: "sql", why: "Data polis dan klaim tersimpan di basis data perusahaan.", lessons: ["sql-select", "sql-agregat", "sql-join", "sql-having"] },
    { lang: "python", why: "Model cadangan dan simulasi Monte Carlo.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-numpy", "py-pandas", "py-sim"] },
    { lang: "r", why: "Banyak paket aktuaria (misalnya untuk tabel mortalita) tersedia di R.", lessons: ["r-vektor", "r-lm", "r-uji"] },
  ],
  elektro: [
    { lang: "python", why: "Analisis sinyal, FFT, dan simulasi rangkaian dengan NumPy dan SciPy.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-numpy", "py-plot", "py-sim"] },
    { lang: "cpp", why: "Firmware mikrokontroler, ADC, dan kendali digital.", lessons: ["cpp-dasar", "cpp-overflow", "cpp-arduino", "cpp-adc", "cpp-pid"] },
  ],
  mesin: [
    { lang: "python", why: "Hitungan desain, simulasi dinamika, dan pengolahan data uji.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-numpy", "py-plot", "py-sim"] },
    { lang: "cpp", why: "Mesin modern dikendalikan mikrokontroler dan PLC.", lessons: ["cpp-dasar", "cpp-arduino", "cpp-pid"], optional: true },
  ],
  fisikawan: [
    { lang: "python", why: "Analisis data eksperimen dan simulasi numerik.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-numpy", "py-plot", "py-sim", "py-qiskit"] },
    { lang: "cpp", why: "Simulasi besar dan perangkat lunak eksperimen yang butuh kecepatan.", lessons: ["cpp-dasar", "cpp-overflow"], optional: true },
    { lang: "bash", why: "Menjalankan simulasi di klaster komputasi.", lessons: ["sh-dasar", "sh-pipa"], optional: true },
  ],
  robotika: [
    { lang: "cpp", why: "Firmware pengendali penerbangan, loop PID, dan node ROS 2 yang harus cepat.", lessons: ["cpp-dasar", "cpp-overflow", "cpp-arduino", "cpp-adc", "cpp-pointer", "cpp-kelas", "cpp-pid", "cpp-ros"] },
    { lang: "python", why: "Simulasi, perencanaan lintasan, dan visi komputer.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-kelas", "py-numpy", "py-sim"] },
    { lang: "bash", why: "Robot menjalankan Linux; build dan peluncuran ROS 2 lewat terminal.", lessons: ["sh-dasar"], optional: true },
  ],
  energi: [
    { lang: "python", why: "Simulasi produksi surya, baterai, dan analisis ekonomi proyek.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-numpy", "py-pandas", "py-plot", "py-sim"] },
    { lang: "sql", why: "Data meteran dan SCADA tersimpan dalam tabel deret waktu.", lessons: ["sql-select", "sql-agregat", "sql-window"] },
    { lang: "cpp", why: "Pengendali inverter dan BMS ditulis di mikrokontroler.", lessons: ["cpp-dasar", "cpp-adc", "cpp-pid"], optional: true },
  ],
  siber: [
    { lang: "bash", why: "Membaca log, mengelola izin, dan menjalankan alat keamanan.", lessons: ["sh-dasar", "sh-pipa", "sh-izin", "sh-hash", "sh-skrip"] },
    { lang: "python", why: "Skrip otomasi, analisis log, dan prototipe kriptografi.", lessons: ["py-dasar", "py-alur", "py-struktur", "py-fungsi", "py-kelas", "py-file", "py-pandas"] },
    { lang: "cpp", why: "Memahami pointer dan overflow memori adalah dasar analisis kerentanan.", lessons: ["cpp-dasar", "cpp-overflow", "cpp-pointer"] },
    { lang: "sql", why: "SIEM dan log keamanan diquery dengan bahasa mirip SQL.", lessons: ["sql-select", "sql-agregat", "sql-having"], optional: true },
  ],
  quant: [
    { lang: "python", why: "Riset strategi, backtest, dan model risiko.", lessons: ["py-dasar", "py-alur", "py-struktur", "py-fungsi", "py-kelas", "py-uji", "py-numpy", "py-pandas", "py-plot", "py-sim", "py-sklearn"] },
    { lang: "sql", why: "Data harga dan transaksi historis.", lessons: ["sql-select", "sql-agregat", "sql-join", "sql-window", "sql-cte"] },
    { lang: "cpp", why: "Sistem eksekusi berlatensi rendah.", lessons: ["cpp-dasar", "cpp-overflow"], optional: true },
  ],
  iklim: [
    { lang: "python", why: "xarray, pandas, dan GIS untuk data iklim dan citra satelit.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-numpy", "py-pandas", "py-plot", "py-sim", "py-sklearn"] },
    { lang: "r", why: "Banyak analisis statistik iklim dan ekologi ditulis di R.", lessons: ["r-vektor", "r-uji", "r-lm"], optional: true },
    { lang: "bash", why: "Mengunduh dan memproses ribuan file data di server.", lessons: ["sh-dasar", "sh-pipa"], optional: true },
  ],
  iot: [
    { lang: "cpp", why: "Firmware ESP32 dan Arduino: sensor, ADC, kendali, komunikasi.", lessons: ["cpp-dasar", "cpp-overflow", "cpp-arduino", "cpp-adc", "cpp-kelas", "cpp-pid"] },
    { lang: "python", why: "Gateway, dasbor, dan MicroPython di perangkat.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-pandas"] },
    { lang: "bash", why: "Raspberry Pi dan server IoT berjalan di Linux.", lessons: ["sh-dasar", "sh-izin"], optional: true },
  ],
  kuantum: [
    { lang: "python", why: "Qiskit, Cirq, dan PennyLane semuanya berbasis Python.", lessons: ["py-dasar", "py-alur", "py-fungsi", "py-numpy", "py-qiskit"] },
  ],
  bioinfo: [
    { lang: "python", why: "Biopython, pandas, dan scikit-learn untuk data urutan dan ekspresi gen.", lessons: ["py-dasar", "py-alur", "py-struktur", "py-fungsi", "py-file", "py-rekursi", "py-numpy", "py-pandas", "py-plot", "py-sklearn"] },
    { lang: "r", why: "Bioconductor adalah standar analisis ekspresi gen.", lessons: ["r-vektor", "r-uji", "r-lm", "r-dplyr", "r-ggplot"] },
    { lang: "bash", why: "Alat genomik dijalankan dari terminal di server.", lessons: ["sh-dasar", "sh-pipa"] },
  ],
};

const LEVELS: Record<LessonLevel, string[]> = {
  dasar: ["py-dasar", "py-alur", "py-struktur", "py-komprehensi", "py-fungsi", "sql-select", "sql-agregat", "sql-join", "cpp-dasar", "cpp-overflow", "cpp-arduino", "r-vektor", "sh-dasar", "sh-pipa"],
  menengah: ["py-kelas", "py-file", "py-uji", "py-numpy", "py-pandas", "py-plot", "py-algoritma", "sql-having", "sql-window", "sql-cte", "sql-ab", "cpp-adc", "cpp-pointer", "cpp-kelas", "r-dplyr", "r-lm", "r-ggplot", "sh-izin", "sh-hash", "sh-skrip"],
  lanjut: ["py-rekursi", "py-gd", "py-sklearn", "py-sim", "py-torch", "py-qiskit", "sql-indeks", "cpp-pid", "cpp-ros", "r-uji"],
};

/** Pelajaran Python yang pustakanya tersedia di Pyodide (peramban). PyTorch, Qiskit, dan grafik tidak. */
const RUN_PYTHON = new Set(["py-dasar", "py-alur", "py-struktur", "py-komprehensi", "py-fungsi", "py-kelas", "py-file", "py-uji", "py-numpy", "py-pandas", "py-algoritma", "py-rekursi", "py-gd", "py-sklearn", "py-sim"]);

export const LEVEL_LABEL: Record<LessonLevel, string> = { dasar: "Dasar", menengah: "Menengah", lanjut: "Lanjut" };
const LEVEL_RANK: Record<LessonLevel, number> = { dasar: 0, menengah: 1, lanjut: 2 };

for (const [level, ids] of Object.entries(LEVELS) as [LessonLevel, string[]][]) {
  for (const id of ids) {
    const lesson = LESSONS.find((item) => item.id === id);
    if (!lesson) throw new Error(`Tingkat untuk pelajaran yang tidak ada: ${id}`);
    lesson.level = level;
  }
}
for (const lesson of LESSONS) {
  if (!lesson.level) throw new Error(`Pelajaran ${lesson.id} belum punya tingkat`);
  if (lesson.lang === "sql") lesson.run = "sql";
  if (RUN_PYTHON.has(lesson.id)) lesson.run = "python";
}

const lessonById = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));
const langById = new Map(LANGS.map((lang) => [lang.id, lang]));

for (const lesson of LESSONS) {
  if (lesson.topic && !getTopic(lesson.topic)) throw new Error(`Pelajaran ${lesson.id} menyebut materi yang tidak ada: ${lesson.topic}`);
  if (lesson.quiz.answer < 0 || lesson.quiz.answer >= lesson.quiz.options.length) throw new Error(`Kunci kuis ${lesson.id} di luar pilihan`);
}
for (const [road, list] of Object.entries(ROAD_LANGS)) {
  for (const item of list) {
    for (const id of item.lessons) {
      const lesson = lessonById.get(id);
      if (!lesson) throw new Error(`Peta ${road} menyebut pelajaran kode yang tidak ada: ${id}`);
      if (lesson.lang !== item.lang) throw new Error(`Peta ${road}: ${id} bukan pelajaran ${item.lang}`);
    }
  }
}

export function getLesson(id: string): CodeLesson | undefined {
  return lessonById.get(id);
}

export function getLang(id: LangId): Lang {
  return langById.get(id)!;
}

/** Pelajaran satu bahasa, urut dari dasar ke lanjut (urutan tulis dipertahankan di dalam tingkat). */
export function lessonsOf(lang: LangId): CodeLesson[] {
  return LESSONS.filter((lesson) => lesson.lang === lang).sort(
    (a, b) => LEVEL_RANK[a.level ?? "dasar"] - LEVEL_RANK[b.level ?? "dasar"],
  );
}

export function roadLangs(roadId: string): RoadLang[] {
  return ROAD_LANGS[roadId] ?? [];
}
