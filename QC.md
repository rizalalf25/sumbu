# QC SUMBU — 4 Oktober 2026

SUMBU sudah memiliki akun sungguhan, penyimpanan progres per pengguna, dashboard, serta ruang belajar tanpa kode undangan. Materi tetap terbuka bagi tamu. Perubahan disiapkan untuk Vercel dan PostgreSQL; belum diterbitkan ke internet karena akun hosting/database belum tersedia.

## Perbaikan yang dilakukan

- Login dan pendaftaran email/password menggantikan akses akun pengembangan bersama. Backend mengambil identitas dari sesi; klien tidak boleh menentukan pemilik data.
- Catatan, latihan, draf kode, proyek, dan persiapan LPDP memakai satu penyimpanan progres bersama. Data tamu terpisah dari setiap akun, dengan pilihan impor dan cadangan.
- Sinkronisasi memeriksa revisi dan mempertahankan salinan lokal saat terjadi konflik. Respons dari sesi lama tidak dapat berpindah ke akun lain. Status penguasaan dari simpanan lokal versi lama dipertahankan.
- Ruang terbuka dapat dibuat dan diikuti pengguna terdaftar. Pembacaan/pengiriman pesan memerlukan keanggotaan. Penghapusan dibatasi ke penulis atau pemilik ruang.
- Validasi data progres, ukuran cadangan, panjang pesan, batas pesan, dan pembatasan login diterapkan di backend.
- Timer yang selesai mencatat sesi fokus. Navigasi akun, tampilan ponsel, indikator sinkronisasi, serta pemuatan awal server/browser diperbaiki.
- Seluruh tes skrip kini benar-benar ditemukan pada Windows maupun Linux. Fixture terisolasi dari aset situs asli. Aset PGLite lokal dapat dimuat pada build Node.
- Migrasi produksi memakai transaksi dan advisory lock transaksi agar deployment bersamaan aman melalui koneksi PostgreSQL pooled.

## Hasil pemeriksaan

| Pemeriksaan                         | Hasil                                                                 |
| ----------------------------------- | --------------------------------------------------------------------- |
| TypeScript                          | Lulus                                                                 |
| ESLint                              | 0 error; 3 peringatan Fast Refresh yang sudah ada                     |
| Unit/regression                     | 274 lulus, 0 gagal, 4 dilewati                                        |
| Audit dependency saat pengerjaan    | 0 kerentanan dilaporkan npm                                           |
| Build Vercel                        | Lulus                                                                 |
| Build Node produksi                 | Lulus                                                                 |
| Browser desktop dan ponsel          | Tidak ada error JavaScript atau luapan horizontal; isi dev/build sama |
| Alur full stack pada build produksi | 15 pemeriksaan lulus                                                  |

Empat tes yang dilewati memeriksa dokumen skill platform Grok lama yang tidak disertakan dalam repository. Tes aplikasi dan alur akun tidak dilewati. Tes browser menggunakan Edge/Playwright, akun fixture yang dibuat khusus untuk QC, serta database PGLite lokal yang menjalankan SQL PostgreSQL. Akun fixture dan database lokal tidak ikut Git.

Alur browser mencakup materi tanpa akun, perlindungan dashboard, daftar/login/keluar, penolakan password salah, sesi fokus, catatan setelah reload, pemisahan data dua akun, pembuatan ruang, pembatasan nonanggota, bergabung tanpa undangan, moderasi, ponsel, pengambilan progres dari browser baru, dan konflik perubahan dari dua perangkat.

## Hal yang masih memerlukan hosting

Belum ada URL publik atau pengujian terhadap PostgreSQL cloud/Vercel yang benar-benar diterbitkan. Ikuti [DEPLOYMENT.md](DEPLOYMENT.md) untuk membuat hosting/database, mengisi tiga environment produksi, dan menjalankan verifikasi setelah deploy. Jangan masukkan secret ke Git atau chat.

Verifikasi email, reset password melalui email, panel admin seluruh situs, pelaporan penyalahgunaan, dan penghapusan akun mandiri belum tersedia. Ruang memakai polling 15 detik dan menampilkan 100 pesan terakhir. Batas fitur lainnya dijelaskan dalam panduan deployment.

## Mengulang QC

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run build:node
```

Tes browser: jalankan pratinjau sesuai panduan deployment, kemudian `npm run test:e2e`. Workflow `.github/workflows/qc.yml` menyiapkan proses ini untuk pull request.
