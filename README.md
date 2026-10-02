# SUMBU

Aplikasi web untuk belajar matematika dan fisika. Satu materi dibuka satu napas: inti dulu, gambar yang bisa digerakkan, kasus nyata, baru soal. Bahasa antarmukanya Indonesia.

Cocok untuk perhatian yang mudah loncat. Tidak ada dinding teks. Rumus ditampilkan dengan KaTeX, progress tersimpan di peramban ini saja.

## Isi

- **Pelajaran.** Setiap topik punya langkah singkat: inti, gambar, kasus nyata, jebakan, lalu latihan.
- **Rumus.** Kartu rumus cepat, bisa dicari.
- **Latihan.** Soal dibuat ulang dari parameter, jadi banknya tidak habis di halaman pertama.
- **Studio.** Adegan Three.js: parabola, bandul, gelombang, vektor, muatan, permukaan, medan.
- **Peta profesi.** Hanya pelajaran yang terpakai, bukan seluruh katalog.
- **Metode.** Sesi 12 menit, mode fokus, dan cara mencatat.

Peta yang tersedia: analis data, ilmuwan data, AI engineer, aktuaris, insinyur elektro, insinyur mesin, dan fisikawan.

Tiga soal benar pada satu materi sudah cukup untuk menandai langkah peta sebagai selesai.

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
npm run build
```

`npm run build` menghasilkan keluaran produksi. Pratinjau lokal:

```bash
npm run preview:restart
```

## Tumpukan

React, TanStack Start, Vite, TypeScript, Tailwind CSS v4, KaTeX, Three.js.

Progres, catatan, dan peta aktif disimpan di `localStorage`. Tidak ada akun yang wajib untuk belajar.
