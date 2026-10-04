# SUMBU

Aplikasi web untuk belajar matematika dan fisika. Satu materi dibuka satu napas: inti dulu, gambar yang bisa digerakkan, kasus nyata, baru soal. Bahasa antarmukanya Indonesia.

Cocok untuk perhatian yang mudah loncat. Tidak ada dinding teks, tidak ada animasi yang berjalan sendiri. Rumus ditampilkan dengan KaTeX. Materi terbuka tanpa akun; setelah login, progres dan catatan pribadi tersimpan ke database dan bisa dilanjutkan lintas perangkat.

SUMBU kini full stack: daftar/login email dan password, dashboard belajar, progres per pengguna, cadangan JSON, dan ruang diskusi terbuka. Tidak diperlukan kode undangan. Panduan menerbitkan untuk akses bersama teman ada di [DEPLOYMENT.md](DEPLOYMENT.md).

## Isi

- **Pelajaran.** Setiap topik punya langkah singkat: inti, gambar, kasus nyata, jebakan, lalu latihan.
- **Rumus.** Kartu rumus cepat, bisa dicari.
- **Latihan.** Soal dibuat ulang dari parameter, jadi banknya tidak habis di halaman pertama. Jawaban boleh pakai koma atau titik desimal, pecahan, dan pemisah ribuan (3.200).
- **Studio.** Adegan Three.js: parabola, bandul, gelombang, vektor, muatan, permukaan, medan. Gerak baru berjalan setelah tombol "Putar gerak" ditekan.
- **Peta profesi.** Hanya pelajaran yang terpakai, bukan seluruh katalog, lengkap dengan bahasa pemrograman yang disarankan, dua proyek, dan meter kesiapan kerja.
- **Proyek studi kasus.** 30 proyek (2 per peta), dari dasbor KPI sampai drone quadcopter. Tiap tahap menyebut materi dan pelajaran kode yang dipakai, dan bisa dicentang.
- **Daftar belanja dan panduan rakit.** 10 proyek perangkat keras (drone, robot pengikut garis, stasiun cuaca, inkubator, konverter buck, model BMS, PLTS mini, braket rak, bandul, spektrum audio) punya daftar komponen, alat, bahan habis pakai, perkiraan harga, total yang bisa dikurangi barang yang sudah dimiliki, dan langkah rakit dengan peringatan keselamatan.
- **Kode.** 44 pelajaran Python, SQL, C/C++, R, dan Bash bertingkat (dasar, menengah, lanjut). Setiap pelajaran mengikuti Janji → Ide → Baca → Tebak → Coba → Jebakan → Catat, dengan percobaan khusus, catatan, draf tersimpan, dan tautan pelajaran berikutnya. 23 contoh Python dan SQL bisa diubah dan dijalankan langsung di peramban (Pyodide di web worker dan sql.js).
- **Tantangan kode.** 22 tantangan Python dan SQL yang dinilai otomatis dengan tes, dari median sampai pengendali PID; draf jawaban tersimpan otomatis.
- **LPDP.** Persiapan beasiswa LPDP: tahapan seleksi, materi dan bank soal tes bakat skolastik (verbal, kuantitatif, penalaran). Semua 17 jenis soal punya contoh cara pengerjaan bertahap, petunjuk sebelum menjawab, dan pembahasan setelah menjawab. Simulasi 30 soal 30 menit menampilkan cara pengerjaan setelah selesai. Ada latihan esai bertimer dan wawancara dengan metode STAR. Soalnya buatan SUMBU, bukan soal asli LPDP; ketentuan resmi selalu mengikuti panduan LPDP.
- **Metode.** Sesi 12 menit, mode fokus, cara mencatat, dan cadangan/pulihkan progres ke file JSON.

Katalog: 57 materi dalam tiga jalur (matematika dasar, fisika dasar, lanjutan), termasuk statistik inferensial, regresi, Bayes, aljabar linear, aturan rantai dan optimasi, bunga dan anuitas, logika dan graf, aritmetika modular, entropi, proses stokastik, kendali, sinyal digital, kuantum, rotasi, termodinamika, magnet, dan kekuatan bahan.

Peta yang tersedia (15):

- **Data dan model:** analis data, ilmuwan data, AI engineer.
- **Profesi yang sedang tumbuh:** insinyur robotika, insinyur energi terbarukan, insinyur keamanan siber, analis kuantitatif, ilmuwan iklim dan geospasial, insinyur sistem tertanam dan IoT.
- **Teknik dan sains:** aktuaris, insinyur elektro, insinyur mesin, fisikawan.
- **Perbatasan riset:** insinyur komputasi kuantum, bioinformatikawan.

Satu langkah peta dianggap cukup setelah tiga jawaban benar pada materinya, dengan minimal satu di level Sedang atau Tantangan.

## Menjalankan

Perlu Node.js 22.13+ dan npm (QC memakai Node 24).

```bash
npm ci
npm run dev
```

Buka [http://localhost:8080](http://localhost:8080).

## Memeriksa

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Setelah menambah atau mengubah generator soal, hitung ulang jumlah variasi:

```bash
npm run bank
```

`npm run build` menghasilkan keluaran produksi Vercel. `npm run build:node` menghasilkan server Node mandiri. Pratinjau build dengan database QA lokal dijelaskan di [DEPLOYMENT.md](DEPLOYMENT.md).

```bash
npm run preview
```

## Tumpukan

React, TanStack Start, Vite, TypeScript, Tailwind CSS v4, KaTeX, Three.js, Better Auth, PostgreSQL, dan PGLite untuk pengembangan lokal.

Progres, catatan, dan peta aktif disimpan per akun di PostgreSQL, dengan salinan lokal untuk koneksi terputus. Tamu memakai `localStorage`. Akun tidak wajib untuk membuka materi. Diskusi memerlukan akun dan keanggotaan ruang; siapa pun yang terdaftar bisa langsung bergabung.
