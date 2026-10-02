# SUMBU

Aplikasi web untuk belajar matematika dan fisika. Satu materi dibuka satu napas: inti dulu, gambar yang bisa digerakkan, kasus nyata, baru soal. Bahasa antarmukanya Indonesia.

Cocok untuk perhatian yang mudah loncat. Tidak ada dinding teks, tidak ada animasi yang berjalan sendiri. Rumus ditampilkan dengan KaTeX, progres tersimpan di peramban ini saja.

## Isi

- **Pelajaran.** Setiap topik punya langkah singkat: inti, gambar, kasus nyata, jebakan, lalu latihan.
- **Rumus.** Kartu rumus cepat, bisa dicari.
- **Latihan.** Soal dibuat ulang dari parameter, jadi banknya tidak habis di halaman pertama. Jawaban boleh pakai koma atau titik desimal, pecahan, dan pemisah ribuan (3.200).
- **Studio.** Adegan Three.js: parabola, bandul, gelombang, vektor, muatan, permukaan, medan. Gerak baru berjalan setelah tombol "Putar gerak" ditekan.
- **Peta profesi.** Hanya pelajaran yang terpakai, bukan seluruh katalog.
- **Metode.** Sesi 12 menit, mode fokus, dan cara mencatat.

Katalog: 57 materi dalam tiga jalur (matematika dasar, fisika dasar, lanjutan), termasuk statistik inferensial, regresi, Bayes, aljabar linear, aturan rantai dan optimasi, bunga dan anuitas, logika dan graf, aritmetika modular, entropi, proses stokastik, kendali, sinyal digital, kuantum, rotasi, termodinamika, magnet, dan kekuatan bahan.

Peta yang tersedia (15):

- **Data dan model:** analis data, ilmuwan data, AI engineer.
- **Profesi yang sedang tumbuh:** insinyur robotika, insinyur energi terbarukan, insinyur keamanan siber, analis kuantitatif, ilmuwan iklim dan geospasial, insinyur sistem tertanam dan IoT.
- **Teknik dan sains:** aktuaris, insinyur elektro, insinyur mesin, fisikawan.
- **Perbatasan riset:** insinyur komputasi kuantum, bioinformatikawan.

Satu langkah peta dianggap cukup setelah tiga jawaban benar pada materinya, dengan minimal satu di level Sedang atau Tantangan.

## Menjalankan

Perlu Node.js dan npm.

```bash
npm install
npm run dev
```

Buka [http://localhost:8080](http://localhost:8080).

## Memeriksa

```bash
npm run typecheck
npm test
npm run build
```

Setelah menambah atau mengubah generator soal, hitung ulang jumlah variasi:

```bash
npm run bank
```

`npm run build` menghasilkan keluaran produksi. Pratinjau lokal:

```bash
npm run preview:restart
```

## Tumpukan

React, TanStack Start, Vite, TypeScript, Tailwind CSS v4, KaTeX, Three.js.

Progres, catatan, dan peta aktif disimpan di `localStorage`. Tidak ada akun yang wajib untuk belajar.
