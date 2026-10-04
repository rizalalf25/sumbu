# Menerbitkan SUMBU agar bisa dibuka teman

SUMBU kini memiliki frontend, backend, akun email/password, progres per pengguna, dan ruang diskusi terbuka. Materi tidak memerlukan login. Membuat akun dan bergabung ke ruang tidak memerlukan kode undangan.

## Vercel + PostgreSQL

1. Buat akun Vercel menggunakan akun GitHub Anda. Import repository `rizalalf25/sumbu` setelah perubahan ini masuk ke branch yang akan diterbitkan.
2. Di Marketplace/Storage, tambahkan PostgreSQL, misalnya Neon, dan hubungkan ke proyek. Vercel mendukung integrasi PostgreSQL melalui [Marketplace](https://vercel.com/docs/postgres); [integrasi Neon](https://vercel.com/marketplace/neon) dapat menyediakan databasenya.
3. Atur environment berikut di Settings → Environment Variables. Jangan menyimpan nilai rahasia di repository atau mengirimkannya dalam chat.

| Nama                 | Isi                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------- |
| `DATABASE_URL`       | URL koneksi PostgreSQL dari penyedia database. Gunakan koneksi pooled bila tersedia.   |
| `BETTER_AUTH_SECRET` | Secret acak minimal 32 karakter, tetap sama setelah redeploy.                          |
| `BETTER_AUTH_URL`    | Origin publik aplikasi, misalnya `https://nama-proyek.vercel.app`, tanpa `/` di akhir. |

Untuk membuat secret pada komputer Anda: `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Salin hasil langsung ke pengaturan Vercel.

4. Build dan install sudah diatur melalui `vercel.json`: `npm ci` dan `npm run build`. Build menjalankan migrasi PostgreSQL secara otomatis. Migrasi tidak menghapus data; deployment yang bersamaan diserialisasi dengan advisory lock.
5. Setelah environment disimpan, deploy/redeploy proyek. Perubahan environment memerlukan [redeploy](https://vercel.com/docs/environment-variables/managing-environment-variables). Gunakan database terpisah untuk preview bila Anda mengaktifkan deployment preview, dan sesuaikan `BETTER_AUTH_URL` dengan origin preview yang sebenarnya.
6. Bagikan URL HTTPS yang berhasil diterbitkan. Teman langsung bisa membuka materi, lalu memilih **Masuk → Daftar** untuk menyimpan progres dan bergabung ke ruang.

Konfigurasi produksi menolak database lokal dan secret sementara. Jangan mengatur `SUMBU_ALLOW_LOCAL_DB` di hosting publik. `VITE_AUTH_ENABLED=false` dari template lama tidak mematikan perlindungan akun SUMBU.

## Verifikasi setelah deploy

- Buka beranda sebagai tamu, kemudian buka satu materi dan latihan.
- Daftar dua akun berbeda dan pastikan catatan pribadi tidak muncul di akun lain.
- Tulis catatan, keluar, lalu masuk melalui perangkat lain; catatan harus kembali.
- Buat ruang; akun kedua dapat langsung bergabung tanpa undangan dan mengirim pesan.
- Pemilik ruang dapat menghapus pesan. Anggota lain hanya dapat menghapus pesannya sendiri.
- Periksa bahwa URL menggunakan HTTPS, login/keluar bekerja, dan tidak ada error di log hosting.

## Batas fitur saat ini

- Verifikasi email dan pemulihan kata sandi melalui email belum diaktifkan karena memerlukan layanan pengiriman email. Pendaftaran/login email/password sudah berfungsi; tidak ada tombol pemulihan palsu.
- Diskusi diperbarui setiap 15 detik ketika halaman terlihat, maksimal 100 pesan terbaru. Daftar menampilkan 100 ruang terbaru. Ini cocok sebagai versi awal komunitas; pencarian/pagination dapat ditambahkan jika komunitas tumbuh.
- Progres memakai pemeriksaan revisi. Jika dua perangkat mengubah progres yang sama bersamaan, perangkat dengan revisi lama menampilkan konflik dan tidak menimpa akun diam-diam. Unduh cadangan lokal sebelum memilih **Muat progres akun**.
- Catatan, draf kode, esai, dan wawancara bersifat pribadi. Nama dan pesan diskusi terlihat oleh anggota ruang. Angka progres bukan penilaian resmi atau sertifikasi.
- Belum ada panel admin seluruh situs, pelaporan penyalahgunaan, atau penghapusan akun mandiri. Pemilik ruang memiliki moderasi pesan ruangnya.
- Python/SQL berjalan di browser melalui runner yang sudah ada; pemuatan runtime dapat memerlukan koneksi internet. Ini bukan eksekusi kode pengguna pada server aplikasi.

## Pengembangan dan QC

Perlu Node.js 22.13+ (QC memakai Node 24) dan npm. `npm ci`, lalu `npm run dev`. Database PGLite lokal disimpan di `.data/sumbu` dan bertahan setelah restart; folder tersebut tidak ikut Git. Secret sementara lokal membuat Anda perlu login ulang setelah restart bila `BETTER_AUTH_SECRET` tidak diatur.

Perintah pemeriksaan: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, dan `npm run build:node`. `npm run build` menghasilkan output Vercel; `build:node` menghasilkan server Node di `.output`.

Untuk menguji build tanpa PostgreSQL, jalankan `npm run preview` dengan environment `SUMBU_ALLOW_LOCAL_DB=true`, `SUMBU_DATA_DIR=.data/qa`, dan `BETTER_AUTH_URL=http://127.0.0.1:8081`. Ini hanya untuk QA lokal, membutuhkan dependency proyek terpasang, dan tidak digunakan untuk hosting publik. Kemudian `E2E_BASE_URL=http://127.0.0.1:8081 npm run test:e2e` pada shell yang mendukung sintaks tersebut; di PowerShell gunakan `$env:E2E_BASE_URL='http://127.0.0.1:8081'` lalu `npm run test:e2e`. Chromium Playwright perlu terpasang, atau set `BROWSER_CHANNEL=msedge` untuk memakai Edge.

Hosting Node mandiri: atur tiga environment produksi di atas, jalankan `npm run db:migrate`, `npm run build:node`, kemudian `npm start` di belakang reverse proxy HTTPS. Gunakan PostgreSQL dan jalankan proses dengan `NODE_ENV=production`.

Workflow `.github/workflows/qc.yml` menjalankan pemeriksaan kode, build, dan tes browser pada setiap pull request.
