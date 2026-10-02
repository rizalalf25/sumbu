import { allTopics, getTopic, type Topic } from "./topics.ts";

export type RoadStep = {
  topicId: string;
  why: string;
  optional?: boolean;
};

export type RoadPhase = {
  title: string;
  note: string;
  steps: RoadStep[];
};

export type Roadmap = {
  id: string;
  title: string;
  kicker: string;
  line: string;
  summary: string;
  outcome: string;
  skip: string;
  phases: RoadPhase[];
};

export const DONE_AT = 3;
export const HARD_AT = 1;

function lesson(topicId: string, why: string, optional = false): RoadStep {
  if (!getTopic(topicId)) throw new Error(`Peta menyebut materi yang tidak ada: ${topicId}`);
  return { topicId, why, optional };
}

export const ROADMAPS: Roadmap[] = [
  {
    id: "analis",
    title: "Analis data",
    kicker: "Angka yang sudah ada",
    line: "KPI, ringkasan, uji A/B, dan regresi. Tanpa kalkulus dan fisika.",
    summary:
      "Kerja analis adalah membaca tabel yang sudah terkumpul, lalu bilang apa yang berubah, seberapa yakin, dan apa yang belum boleh dipercaya. Kalkulus dan fisika tidak masuk peta ini.",
    outcome:
      "Kamu bisa menghitung rasio tanpa menjumlahkan persen, meringkas data dengan median dan simpangan baku, membaca uji A/B dengan interval, dan tidak menyebut korelasi sebagai sebab.",
    skip: "Kalkulus, fisika, Fourier, dan persamaan diferensial bukan pekerjaan analis harian. Semuanya tetap di katalog.",
    phases: [
      {
        title: "Membaca angka",
        note: "Alat dasar sebelum membuka statistik.",
        steps: [
          lesson("bilangan", "Konversi, bagian dari total, dan diskon bertumpuk adalah bahasa KPI."),
          lesson("aljabar", "Hubungan “naik sekian, hasil sekian” paling sering cukup berupa garis lurus."),
          lesson("fungsi", "Grafik dasbor adalah fungsi. Kemiringan adalah laju, bukan hiasan sumbu."),
          lesson("diskrit", "Filter, JOIN, dan COUNT DISTINCT adalah logika dan himpunan. Irisan yang lupa dikurangi menggandakan angka."),
        ],
      },
      {
        title: "Meringkas data",
        note: "Supaya satu angka rata-rata tidak menutupi seluruh tabel.",
        steps: [
          lesson("sampel", "Median, simpangan baku, dan skor z: tiga cara tabel kelihatan meyakinkan padahal tidak."),
          lesson("barisan", "Angka per minggu adalah barisan. Bedakan pertumbuhan tetap dan lonjakan sekali."),
          lesson("eksponen", "Pertumbuhan berlipat dan skala log. Persen saja tidak cukup kalau angkanya melonjak."),
        ],
      },
      {
        title: "Membandingkan dan menjelaskan",
        note: "Dari “naik” ke “naik, dan ini seberapa yakin kami”.",
        steps: [
          lesson("peluang", "Tanpa ini, kata signifikan hanya gaya bahasa."),
          lesson("bayes", "Konversi per segmen dan alarm penipuan adalah peluang bersyarat."),
          lesson("inferensi", "Uji A/B dan interval kepercayaan: selisih kecil pada sampel kecil adalah noise."),
          lesson("regresi", "Hubungan dua kolom, kemiringannya, dan kenapa korelasi bukan sebab."),
        ],
      },
      {
        title: "Untuk analis bisnis dan keuangan",
        note: "Boleh dilewati jika kamu tidak menyentuh uang atau peramalan.",
        steps: [
          lesson("bunga", "Nilai sekarang, payback, dan cicilan: bahasa analis keuangan.", true),
          lesson("stokastik", "Peramalan permintaan dan simulasi Monte Carlo.", true),
        ],
      },
    ],
  },
  {
    id: "ilmuwan",
    title: "Ilmuwan data",
    kicker: "Model dari data",
    line: "Statistik, optimasi, dan aljabar linear: yang dipakai saat melatih model.",
    summary:
      "Ilmuwan data tidak menghafal seluruh matematika teknik. Yang dipakai berulang adalah statistik, turunan sebagai arah perbaikan, dan data yang berbentuk vektor serta matriks.",
    outcome:
      "Kamu bisa menjelaskan kenapa model linear punya intercept, kenapa galat diturunkan lewat aturan rantai, kenapa satu baris data adalah vektor, dan apa yang dicari PCA.",
    skip: "Fluida, optik, medan, persamaan diferensial parsial, dan residu tetap di katalog. Itu metode fisika, bukan syarat model tabular.",
    phases: [
      {
        title: "Bahasa model",
        note: "Sebelum algoritma, kamu harus bisa membaca rumus sederhananya.",
        steps: [
          lesson("bilangan", "Metrik, bobot, dan skala sering berupa rasio. Jangan jumlahkan persen."),
          lesson("aljabar", "Intercept dan kemiringan model linear adalah persamaan ini."),
          lesson("fungsi", "Model adalah mesin: fitur masuk, prediksi keluar."),
          lesson("eksponen", "Log mengubah perkalian menjadi penjumlahan. Ia muncul di peluang, log-loss, dan fitur yang tumbuh cepat."),
          lesson("diskrit", "Kondisi, himpunan, dan graf muncul di pembersihan data dan fitur."),
        ],
      },
      {
        title: "Statistik",
        note: "Prediksi yang jujur adalah sebaran, bukan satu angka sakti.",
        steps: [
          lesson("peluang", "Ruang sampel, kombinasi, dan kejadian saling lepas."),
          lesson("bayes", "Naive Bayes, kalibrasi, dan angka dasar kelas yang langka."),
          lesson("sampel", "Kamu perlu tahu kapan sampel kecil sedang menipu metrik."),
          lesson("inferensi", "Interval dan uji untuk membandingkan model atau eksperimen."),
          lesson("regresi", "Model pertama yang harus kamu kalahkan, dan cara membaca koefisiennya."),
        ],
      },
      {
        title: "Yang dioptimalkan",
        note: "Melatih model artinya menggeser parameter supaya galat turun.",
        steps: [
          lesson("limit", "Turunan adalah limit. Lewati ini dan gradien jadi simbol hafalan."),
          lesson("turunan", "Arah yang menurunkan galat adalah turunan."),
          lesson("rantai", "Aturan rantai dan gradient descent: inti setiap langkah pelatihan."),
          lesson("parsial", "Galat bergantung pada banyak parameter sekaligus. Turunannya parsial."),
          lesson("integral", "Peluang pada suatu rentang adalah luas di bawah kurva."),
        ],
      },
      {
        title: "Bentuk data",
        note: "Di kode, ini yang benar-benar dikalikan.",
        steps: [
          lesson("vektor", "Satu baris data adalah vektor fitur. Kemiripan diukur dengan cosine."),
          lesson("matriks", "Sekumpulan baris dan bobot model dikalikan sebagai matriks."),
          lesson("linalg", "Transformasi, nilai eigen, dan PCA untuk meringkas banyak kolom."),
          lesson("numerik", "Di data nyata jarang ada rumus tertutup. Kamu iterasi, dan pembulatan itu nyata."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Bukan syarat. Buka saat pekerjaanmu menyentuhnya.",
        steps: [
          lesson("entropi", "Pohon keputusan memilih pemisah dengan entropi; log-loss adalah cross-entropy.", true),
          lesson("stokastik", "Deret waktu, rantai Markov, dan simulasi.", true),
          lesson("deret", "Hampiran Taylor di balik banyak trik numerik.", true),
        ],
      },
    ],
  },
  {
    id: "ai",
    title: "AI Engineer",
    kicker: "Model yang dijalankan",
    line: "Vektor, matriks, aturan rantai, dan peluang. Itu yang menggerakkan model.",
    summary:
      "AI engineer memasang model supaya ia belajar, dievaluasi dengan jujur, dan tetap stabil saat dijalankan. Peta ini hanya pelajaran yang muncul di embedding, perkalian matriks, gradien, dan keluaran berupa peluang.",
    outcome:
      "Kamu bisa menelusuri satu lapisan sebagai fungsi, backpropagation sebagai aturan rantai, atensi sebagai perkalian matriks plus softmax, dan pencarian RAG sebagai cosine similarity.",
    skip: "Persamaan diferensial parsial, fluida, foton, dan teorema Gauss bukan tiket masuk. Sinyal dan citra ada di bawah, dan boleh dilewati.",
    phases: [
      {
        title: "Mesin masukan",
        note: "Satu lapisan, sebelum kamu peduli arsitektur.",
        steps: [
          lesson("aljabar", "Bobot kali masukan, lalu digeser: itu persamaan linear di setiap neuron."),
          lesson("fungsi", "Lapisan adalah fungsi. Keluarannya menjadi masukan lapisan berikut."),
          lesson("eksponen", "Softmax, log-loss, dan peluruhan laju belajar hidup di eksponen dan log."),
          lesson("vektor", "Embedding adalah vektor. Pencarian semantik dan RAG memakai cosine similarity."),
        ],
      },
      {
        title: "Aljabar linear",
        note: "Yang dijalankan GPU adalah perkalian matriks.",
        steps: [
          lesson("matriks", "Perkalian yang dijalankan perangkat adalah perkalian matriks."),
          lesson("linalg", "Atensi = softmax(QKᵀ/√d)V. Nilai eigen dan transformasi menjelaskan LoRA dan PCA."),
        ],
      },
      {
        title: "Yang membuatnya belajar",
        note: "Ini yang dihitung berulang saat pelatihan.",
        steps: [
          lesson("limit", "Gradien adalah limit perubahan kecil. Pahami dulu sebelum simbolnya."),
          lesson("turunan", "Laju perubahan galat terhadap satu bobot."),
          lesson("rantai", "Aturan rantai adalah backpropagation. Laju belajar menentukan langkahnya."),
          lesson("parsial", "Setiap bobot punya turunannya sendiri. Kumpulan itu adalah gradien."),
          lesson("numerik", "Gradien yang meledak, langkah terlalu besar, dan pembulatan presisi rendah."),
        ],
      },
      {
        title: "Peluang dan evaluasi",
        note: "Keluaran model adalah peluang. Evaluasinya statistik.",
        steps: [
          lesson("peluang", "Keluaran klasifikasi dan model generatif adalah peluang."),
          lesson("bayes", "Presisi, recall, dan kelas langka adalah peluang bersyarat."),
          lesson("entropi", "Cross-entropy loss, perplexity, dan temperatur sampling."),
          lesson("sampel", "Rata-rata dan sebaran skor pada set evaluasi."),
          lesson("inferensi", "Apakah model baru benar-benar lebih baik, atau kebetulan set uji."),
        ],
      },
      {
        title: "Hanya untuk sinyal, suara, atau citra",
        note: "Bukan syarat. Lewati kalau pekerjaanmu tidak menyentuh gelombang atau gambar.",
        steps: [
          lesson("trig", "Rotasi, positional encoding, dan gelombang hidup di sinus dan kosinus.", true),
          lesson("fourier", "Suara dan citra sering diurai menjadi jumlah gelombang.", true),
          lesson("sinyal", "Laju sampling audio dan aliasing pada citra.", true),
          lesson("integral", "Nilai harapan dan rapat peluang kontinu pada model difusi.", true),
        ],
      },
    ],
  },
  {
    id: "aktuaris",
    title: "Aktuaris",
    kicker: "Harga ketidakpastian",
    line: "Bunga, anuitas, peluang, dan ekor distribusi. Tanpa fisika.",
    summary:
      "Aktuaris mengubah kejadian yang belum tentu terjadi menjadi angka uang. Yang penting di sini: bunga dan nilai sekarang, deret pembayaran, peluang klaim, statistik, dan luas ekor distribusi.",
    outcome:
      "Kamu bisa menolak diskon persen yang dijumlahkan, menghitung nilai sekarang dan anuitas, memperbarui peluang dengan Bayes, dan membaca peluang ekor sebagai luas.",
    skip: "Matriks besar, Fourier, dan seluruh fisika tidak masuk. Turunan hanya perlu jika kamu masuk model kontinu.",
    phases: [
      {
        title: "Uang terhadap waktu",
        note: "Sebelum tabel mortalita, kamu harus jujur pada bunga dan rasio.",
        steps: [
          lesson("bilangan", "Premi dan bunga dimulai dari persen. Dua persen beruntun tidak dijumlah."),
          lesson("aljabar", "Nilai sekarang dan nilai yang ditanya sering satu huruf di satu ruas."),
          lesson("fungsi", "Manfaat atau cadangan sebagai fungsi waktu."),
          lesson("eksponen", "Bunga majemuk dan peluruhan adalah eksponen."),
          lesson("barisan", "Cicilan dan pembayaran berkala adalah barisan dan deret."),
          lesson("bunga", "Nilai sekarang dan anuitas: rumus inti setiap premi dan cadangan."),
          lesson("limit", "Bunga kontinu adalah limit dari bunga yang dihitung makin sering."),
          lesson("deret", "Pembayaran panjang dan hampiran lebih jujur sebagai deret."),
        ],
      },
      {
        title: "Kejadian dan kerugian besar",
        note: "Harga sebuah janji bergantung pada seberapa sering, dan seberapa parah.",
        steps: [
          lesson("peluang", "Klaim adalah kejadian. Nilai uangnya dikalikan peluangnya, bukan firasat."),
          lesson("bayes", "Memperbarui tarif risiko setelah ada riwayat klaim."),
          lesson("sampel", "Tabel mortalita dan ukuran klaim adalah statistik sampel, lengkap dengan sebarannya."),
          lesson("statistik", "Jumlah klaim per periode sering mengikuti Poisson."),
          lesson("inferensi", "Seberapa yakin tarif itu, dengan data yang terbatas."),
          lesson("integral", "Pada distribusi kontinu, kerugian besar duduk di ekor. Ekor itu luas."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Untuk pemodelan lanjut dan ujian profesi tingkat atas.",
        steps: [
          lesson("regresi", "Model tarif (GLM) dimulai dari regresi.", true),
          lesson("stokastik", "Proses klaim, suku bunga acak, dan simulasi Monte Carlo.", true),
          lesson("numerik", "Simulasi dan perhitungan cadangan tanpa rumus tertutup.", true),
        ],
      },
    ],
  },
  {
    id: "elektro",
    title: "Insinyur elektro",
    kicker: "Sinyal dan rangkaian",
    line: "Rangkaian, magnet, sinyal digital, Fourier, kendali, dan medan.",
    summary:
      "Peta ini memegang yang membentuk kerja elektro: rangkaian, magnet dan induksi, sinyal analog dan digital, sistem terhadap waktu, kendali, lalu medan. Mekanika benda tidak ikut.",
    outcome:
      "Kamu bisa membaca fasor sebagai bilangan kompleks, menghitung trafo dengan Faraday, memilih laju sampling, mengurai sinyal dengan Fourier, dan membawa rangkaian ke ranah Laplace.",
    skip: "Fluida, gaya Newton, dan mekanika benda tegar bukan gerbang elektro. Materi itu tetap di katalog, tercantum di bawah.",
    phases: [
      {
        title: "Bahasa sinyal",
        note: "Sinus, redaman, dan panah komponen.",
        steps: [
          lesson("aljabar", "Hukum Kirchhoff pada akhirnya sistem persamaan linear."),
          lesson("fungsi", "Tegangan terhadap waktu adalah fungsi."),
          lesson("trig", "Arus bolak-balik, fase, dan gelombang adalah sinus dan kosinus."),
          lesson("eksponen", "Redaman dan pengisian kapasitor berbentuk eksponen."),
          lesson("vektor", "Fasor dan komponen medan digambar sebagai vektor."),
        ],
      },
      {
        title: "Rangkaian dan magnet",
        note: "Dari muatan terhadap waktu sampai ranah s.",
        steps: [
          lesson("limit", "Turunan arus dan tegangan butuh arti “perubahan kecil” yang jernih."),
          lesson("turunan", "Arus pada kapasitor adalah turunan muatan."),
          lesson("integral", "Muatan adalah integral arus. Energi juga sering luas di bawah kurva."),
          lesson("satuan", "Salah satuan pada kapasitor atau induktor menggagalkan seluruh rangkaian di kertas."),
          lesson("listrik", "Hukum Ohm, rangkaian, dan medan muatan adalah lantai."),
          lesson("magnet", "Motor, generator, induktor, dan trafo: hukum Faraday."),
          lesson("kompleks", "Fasor adalah bilangan kompleks. Impedansi ikut aljabar itu."),
          lesson("ode", "Muatan dan arus terhadap waktu adalah persamaan diferensial biasa."),
          lesson("laplace", "Sistem linear diselesaikan di ranah s, lalu dikembalikan ke waktu."),
        ],
      },
      {
        title: "Sinyal dan kendali",
        note: "Analog ke digital, lalu umpan balik.",
        steps: [
          lesson("gelombang", "Frekuensi, panjang gelombang, dan cepat rambat tidak boleh tertukar."),
          lesson("deret", "Hampiran dan Fourier sendiri adalah deret."),
          lesson("fourier", "Sinyal rumit diurai menjadi sinus. Itu alat harian."),
          lesson("sinyal", "ADC, laju sampling, aliasing, dan resolusi DFT."),
          lesson("kendali", "Catu daya, motor, dan inverter memakai umpan balik."),
        ],
      },
      {
        title: "Elektromagnetika",
        note: "Masuk setelah rangkaian terasa ringan.",
        steps: [
          lesson("medan", "Gradien, divergensi, dan curl adalah kalimat untuk medan listrik dan magnet."),
          lesson("fluks", "Berapa banyak medan menembus permukaan. Hukum Gauss duduk di sini."),
          lesson("pde", "Gelombang pada ruang dan waktu sekaligus: Maxwell yang disederhanakan.", true),
          lesson("numerik", "Medan pada geometri yang tidak rapi dihitung numerik.", true),
        ],
      },
      {
        title: "Hanya untuk fotonika dan semikonduktor",
        note: "Cahaya dan elektron sebagai komponen. Lewati kalau kamu di rangkaian dan sinyal.",
        steps: [
          lesson("optik", "Lensa dan sinar: geometri cahaya sebelum foton.", true),
          lesson("foton", "Energi terkuantisasi. Perlu untuk sensor, LED, dan laser.", true),
          lesson("kuantum", "Pita energi dan tingkat kuantum di balik semikonduktor.", true),
        ],
      },
    ],
  },
  {
    id: "mesin",
    title: "Insinyur mesin",
    kicker: "Gaya, gerak, panas, bahan",
    line: "Gaya, rotasi, energi, panas, kekuatan bahan, dan fluida.",
    summary:
      "Insinyur mesin di peta ini belajar benda yang bergerak dan berputar, menyimpan energi, memanas, menahan beban, dan dialiri fluida. Listrik dan optik tidak ikut.",
    outcome:
      "Kamu bisa memecah gaya, menghitung torsi dan gaya tikungan, memeriksa tegangan dan faktor keamanan, menghitung kalor dan efisiensi mesin, dan tahu kapan gerak butuh persamaan diferensial.",
    skip: "Listrik, foton, dan Fourier bukan inti mesin. Kendali dan metode lanjut ada di bawah sebagai cabang.",
    phases: [
      {
        title: "Gambar dan komponen",
        note: "Sebelum hukum Newton, satuan dan komponen harus rapi.",
        steps: [
          lesson("aljabar", "Hampir setiap kesetimbangan gaya berakhir sebagai persamaan linear."),
          lesson("fungsi", "Posisi terhadap waktu adalah fungsi. Grafiknya bukan sketsa bebas."),
          lesson("trig", "Gaya pada bidang miring dan komponen vektor butuh sinus dan kosinus."),
          lesson("geometri", "Panjang, luas, dan Pythagoras muncul di setiap gambar teknik."),
          lesson("vektor", "Gaya yang tidak segaris dijumlah lewat komponen."),
        ],
      },
      {
        title: "Perubahan",
        note: "Kecepatan dan usaha adalah turunan dan luas.",
        steps: [
          lesson("limit", "Kecepatan sesaat adalah limit."),
          lesson("turunan", "Kecepatan turunan posisi. Percepatan turunan kecepatan."),
          lesson("integral", "Perpindahan adalah luas di bawah kurva kecepatan. Usaha mirip itu."),
        ],
      },
      {
        title: "Benda yang bergerak",
        note: "Daftar yang dipakai di soal mesin tahun pertama.",
        steps: [
          lesson("satuan", "Newton, joule, dan pascal. Salah satuan berarti salah desain di kertas."),
          lesson("kinematika", "Gerak lurus dulu. Jangan loncat ke gaya sebelum posisi dan waktu rapi."),
          lesson("parabola", "Lintasan lengkung: lemparan, nozzle, titik jatuh."),
          lesson("newton", "Gaya resultan, massa, dan percepatan. Gambar gaya sebelum rumus."),
          lesson("energi", "Usaha dan kekekalan energi memotong banyak soal yang macet di gaya."),
          lesson("momentum", "Tumbukan dan impuls."),
          lesson("rotasi", "Roda gigi, poros, dan tikungan: torsi dan gerak melingkar."),
          lesson("gelombang", "Getaran mesin dan resonansi."),
        ],
      },
      {
        title: "Bahan, panas, dan fluida",
        note: "Yang membedakan insinyur mesin dari fisikawan mekanika.",
        steps: [
          lesson("bahan", "Tegangan, regangan, dan faktor keamanan setiap komponen."),
          lesson("termo", "Mesin, pendingin, dan perpindahan kalor."),
          lesson("fluida", "Tekanan, debit, dan gaya apung. Pompa dan saluran."),
          lesson("ode", "Gaya yang bergantung pada kecepatan tidak selesai dengan satu rumus kinematika."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Fluida lanjut, getaran sistem, dan otomasi butuh ini.",
        steps: [
          lesson("kendali", "Otomasi, aktuator, dan PID di setiap mesin modern.", true),
          lesson("parsial", "Tekanan atau suhu yang berubah ke lebih dari satu arah.", true),
          lesson("lipat", "Gaya pada luasan dan volume, bukan hanya sepanjang garis.", true),
          lesson("laplace", "Getaran dan sistem kontrol linear sering diselesaikan di ranah s.", true),
          lesson("pde", "Panas pada batang atau pelat: ruang dan waktu sekaligus.", true),
          lesson("numerik", "Bentuk yang tidak punya rumus tertutup dihitung langkah demi langkah (dasar FEM).", true),
          lesson("variasi", "Prinsip energi minimum saat memilih bentuk.", true),
        ],
      },
    ],
  },
  {
    id: "fisikawan",
    title: "Fisikawan",
    kicker: "Hukum, lalu metodenya",
    line: "Mekanika, panas, listrik-magnet, lalu matematika yang dipakai terus.",
    summary:
      "Inti dulu: kalkulus, mekanika, termodinamika, listrik dan magnet, dan metode yang muncul lagi. Cabang katalog — fluida, optik, kuantum, residu — ada di bawah, bukan di depan.",
    outcome:
      "Kamu bisa bergerak dari hukum Newton ke turunan, lalu membaca Fourier, aljabar linear, dan persamaan diferensial sebagai alat, bukan bab terpisah.",
    skip: "Yang tidak masuk hanya persen harian, barisan sekolah, dan materi khusus industri seperti keuangan dan logika. Sisanya ada di peta ini.",
    phases: [
      {
        title: "Bahasa",
        note: "Tanpa ini, bab fisika hanya hafalan simbol.",
        steps: [
          lesson("aljabar", "Memindahkan suku dengan jujur."),
          lesson("fungsi", "Hukum fisika adalah fungsi."),
          lesson("trig", "Komponen, rotasi, dan gelombang butuh sinus dan kosinus."),
          lesson("geometri", "Panjang, luas, dan sudut pada gambar."),
          lesson("eksponen", "Peluruhan, pertumbuhan, dan gelombang teredam berbentuk eksponen."),
          lesson("vektor", "Gaya, kecepatan, dan medan adalah vektor."),
        ],
      },
      {
        title: "Kalkulus yang dipakai",
        note: "Empat ide, bukan seluruh trik integral.",
        steps: [
          lesson("limit", "Turunan dan kekontinuan berdiri di atas limit."),
          lesson("turunan", "Laju sesaat: kecepatan, arus, dan kemiringan energi potensial."),
          lesson("rantai", "Ganti variabel dan fungsi bersusun ada di setiap penurunan rumus."),
          lesson("integral", "Menjumlahkan potongan kecil: usaha, muatan, dan luas peluang."),
        ],
      },
      {
        title: "Hukum yang tidak dilewati",
        note: "Lantai bersama sebelum memilih bidang.",
        steps: [
          lesson("satuan", "Dimensi yang tidak cocok berarti persamaan itu bukan fisika."),
          lesson("kinematika", "Gerak dulu, gaya kemudian."),
          lesson("newton", "Hukum gerak. Gambar gaya sebelum memecah komponen."),
          lesson("energi", "Kekekalan memotong soal yang bertele-tele di gaya."),
          lesson("momentum", "Jika gaya rumit tetapi impulsnya singkat, pindah ke momentum."),
          lesson("rotasi", "Momentum sudut dan torsi: padanan putar dari Newton."),
          lesson("gelombang", "Frekuensi, panjang gelombang, dan superposisi."),
          lesson("termo", "Kalor, hukum pertama, dan batas efisiensi."),
          lesson("listrik", "Muatan, medan, dan rangkaian sederhana."),
          lesson("magnet", "Gaya Lorentz dan induksi: separuh lain elektromagnetika."),
        ],
      },
      {
        title: "Metode yang kembali terus",
        note: "Alat, bukan koleksi bab.",
        steps: [
          lesson("kompleks", "Gelombang dan fasor ditulis lebih pendek dengan bilangan kompleks."),
          lesson("deret", "Hampiran Taylor adalah cara fisika memotong fungsi."),
          lesson("matriks", "Sistem linear dan transformasi duduk di matriks."),
          lesson("linalg", "Nilai eigen: ragam normal, tingkat energi, dan sumbu utama."),
          lesson("medan", "Gradien, divergensi, dan curl adalah kalimat untuk medan."),
          lesson("fourier", "Fungsi periodik diurai menjadi sinus."),
          lesson("ode", "Hampir setiap hukum satu variabel waktu menjadi persamaan diferensial biasa."),
          lesson("peluang", "Kejadian dan frekuensi jangka panjang harus jernih."),
          lesson("statistik", "Pengukuran punya sebaran. Satu angka tanpa ketidakpastian belum hasil."),
        ],
      },
      {
        title: "Saat soal tidak lagi satu variabel",
        note: "Bukan gerbang. Buka setelah inti terasa ringan.",
        steps: [
          lesson("parsial", "Fungsi dua peubah atau lebih.", true),
          lesson("lipat", "Integral pada luasan dan volume.", true),
          lesson("fluks", "Berapa banyak medan yang menembus permukaan.", true),
          lesson("laplace", "Mengubah persamaan diferensial menjadi aljabar, lalu kembali.", true),
          lesson("pde", "Panas, gelombang, dan potensial: ruang dan waktu sekaligus.", true),
          lesson("numerik", "Saat persamaan tidak punya rumus tertutup.", true),
        ],
      },
      {
        title: "Cabang, setelah inti",
        note: "Tetap bagian fisikawan. Jangan dibuka bersamaan dengan hukum Newton.",
        steps: [
          lesson("parabola", "Kasus gerak dua sumbu.", true),
          lesson("fluida", "Tekanan, debit, dan gaya apung.", true),
          lesson("optik", "Sinar dan lensa, sebelum cahaya diperlakukan sebagai foton.", true),
          lesson("foton", "Energi terkuantisasi.", true),
          lesson("kuantum", "Amplitudo, pengukuran, dan tingkat energi: gerbang fisika modern.", true),
          lesson("stokastik", "Gerak Brown dan difusi sebagai random walk.", true),
          lesson("residu", "Integral di bidang kompleks lewat kutub.", true),
          lesson("variasi", "Lintasan yang membuat suatu besaran stasioner.", true),
          lesson("khusus", "Bessel, Legendre, dan saudara mereka.", true),
        ],
      },
    ],
  },
  {
    id: "robotika",
    title: "Insinyur robotika",
    kicker: "Gerak yang dikendalikan",
    line: "Transformasi, rotasi, sensor, dan kendali umpan balik.",
    summary:
      "Robot adalah mekanika, listrik, dan perangkat lunak yang dipaksa bekerja bersama. Peta ini memegang yang dipakai lengan robot, robot gudang, dan drone: transformasi koordinat, torsi motor, sensor yang berisik, dan PID.",
    outcome:
      "Kamu bisa menulis rotasi sebagai matriks, menghitung torsi dan gaya pada sendi, menala pengendali PID, dan menjelaskan kenapa sensor perlu disaring.",
    skip: "Fluida, optik, keuangan, dan fisika modern tidak masuk. Pembelajaran mesin ada di peta AI Engineer.",
    phases: [
      {
        title: "Bahasa gerak",
        note: "Setiap sendi robot adalah transformasi.",
        steps: [
          lesson("aljabar", "Kinematika lengan berakhir sebagai persamaan."),
          lesson("fungsi", "Posisi sendi terhadap waktu adalah fungsi."),
          lesson("trig", "Sudut sendi ke posisi ujung lengan butuh sinus dan kosinus."),
          lesson("vektor", "Posisi, kecepatan, dan gaya adalah vektor."),
          lesson("matriks", "Rotasi dan translasi ditulis sebagai matriks, lalu dikalikan berantai."),
          lesson("linalg", "Transformasi dan arah eigen: kerangka koordinat dan kekakuan."),
        ],
      },
      {
        title: "Perubahan",
        note: "Kecepatan sendi dan optimasi lintasan.",
        steps: [
          lesson("limit", "Kecepatan sesaat adalah limit."),
          lesson("turunan", "Kecepatan dan percepatan sendi."),
          lesson("rantai", "Jacobian lengan robot adalah aturan rantai; perencanaan lintasan adalah optimasi."),
          lesson("integral", "Dari kecepatan ke posisi: odometri."),
        ],
      },
      {
        title: "Benda yang bergerak",
        note: "Motor harus kuat menahan dan menggerakkan.",
        steps: [
          lesson("satuan", "N·m, rad/s, dan rpm sering tertukar."),
          lesson("kinematika", "Gerak lurus dan profil kecepatan."),
          lesson("newton", "Gaya, massa, dan percepatan beban."),
          lesson("rotasi", "Torsi motor, momen inersia lengan, dan gerak melingkar."),
          lesson("energi", "Daya motor dan baterai."),
        ],
      },
      {
        title: "Aktuator dan kendali",
        note: "Robot yang tidak dikendalikan hanya mesin yang bergerak.",
        steps: [
          lesson("listrik", "Arus dan tegangan motor."),
          lesson("magnet", "Motor DC, servo, dan stepper bekerja dengan gaya Lorentz."),
          lesson("ode", "Dinamika motor dan beban adalah persamaan diferensial."),
          lesson("laplace", "Fungsi alih dan analisis kestabilan."),
          lesson("kendali", "PID di setiap sendi, roda, dan baling-baling."),
        ],
      },
      {
        title: "Sensor dan persepsi",
        note: "Buka saat robotmu mulai membaca dunia.",
        steps: [
          lesson("sampel", "Noise sensor punya rata-rata dan sebaran.", true),
          lesson("bayes", "Fusi sensor dan filter Kalman memperbarui keyakinan posisi.", true),
          lesson("sinyal", "Laju sampling IMU dan encoder.", true),
          lesson("numerik", "Kinematika balik diselesaikan dengan iterasi.", true),
          lesson("parsial", "Gradien pada perencanaan jalur dan peta biaya.", true),
        ],
      },
    ],
  },
  {
    id: "energi",
    title: "Insinyur energi terbarukan",
    kicker: "Surya, baterai, jaringan",
    line: "Daya, panas, efek fotovoltaik, baterai, dan ekonomi proyek.",
    summary:
      "Transisi energi butuh orang yang bisa menghitung panel surya, baterai kendaraan listrik, dan jaringan. Peta ini memegang energi dan daya, listrik AC, panas, efek fotolistrik, pengisian baterai, dan nilai ekonomi proyek.",
    outcome:
      "Kamu bisa menghitung energi dan daya sistem, efisiensi batas mesin panas, kurva pengisian baterai, tegangan trafo, dan nilai sekarang sebuah proyek PLTS.",
    skip: "Kalkulus vektor, Fourier lanjut, dan fisika matematis tidak masuk. Kendali dan simulasi ada di bawah.",
    phases: [
      {
        title: "Dasar hitung",
        note: "Energi adalah angka dengan satuan yang mudah tertukar: W, Wh, J.",
        steps: [
          lesson("bilangan", "Efisiensi, rugi-rugi, dan kapasitas faktor adalah rasio."),
          lesson("aljabar", "Neraca daya adalah persamaan."),
          lesson("fungsi", "Produksi surya dan beban terhadap jam."),
          lesson("eksponen", "Degradasi panel dan pengisian baterai berbentuk eksponen."),
          lesson("satuan", "kW bukan kWh. Salah satuan berarti salah ukuran baterai."),
        ],
      },
      {
        title: "Energi dan listrik",
        note: "Dari daya ke jaringan.",
        steps: [
          lesson("energi", "Usaha, daya, dan kekekalan energi."),
          lesson("listrik", "Arus, tegangan, dan rugi kabel."),
          lesson("magnet", "Generator, inverter, dan trafo jaringan."),
          lesson("trig", "Tegangan AC dan sudut matahari."),
          lesson("kompleks", "Daya aktif, reaktif, dan faktor daya."),
        ],
      },
      {
        title: "Panas dan cahaya",
        note: "Sumber energinya sendiri.",
        steps: [
          lesson("termo", "Batas efisiensi pembangkit panas, pompa kalor, dan panas pada baterai."),
          lesson("fluida", "Turbin air dan angin, pendinginan."),
          lesson("foton", "Efek fotovoltaik: kenapa panel punya celah energi."),
        ],
      },
      {
        title: "Sistem dan ekonomi",
        note: "Proyek energi dinilai dengan uang dan data.",
        steps: [
          lesson("turunan", "Titik daya maksimum panel (MPPT) adalah turunan nol."),
          lesson("integral", "Energi harian adalah luas di bawah kurva daya."),
          lesson("ode", "Pengisian dan pengosongan baterai terhadap waktu."),
          lesson("sampel", "Data radiasi dan beban punya rata-rata dan sebaran."),
          lesson("bunga", "Nilai sekarang, payback, dan biaya listrik seumur proyek (LCOE)."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Untuk desain sistem dan jaringan pintar.",
        steps: [
          lesson("kendali", "Inverter, pengisian baterai, dan frekuensi jaringan dijaga dengan kendali.", true),
          lesson("regresi", "Meramal produksi dan beban dari data.", true),
          lesson("rantai", "Optimasi penjadwalan baterai.", true),
          lesson("numerik", "Simulasi sistem per jam selama setahun.", true),
        ],
      },
    ],
  },
  {
    id: "siber",
    title: "Insinyur keamanan siber",
    kicker: "Logika dan rahasia",
    line: "Logika, biner, aritmetika modular, entropi, dan deteksi anomali.",
    summary:
      "Keamanan siber berdiri di atas logika, bilangan, dan peluang. Peta ini memegang yang muncul di kriptografi, kata sandi, deteksi serangan, dan analisis log.",
    outcome:
      "Kamu bisa membaca biner, menghitung pangkat modular seperti di RSA, menaksir kekuatan kata sandi dalam bit, dan memperbarui kecurigaan dengan Bayes.",
    skip: "Kalkulus, fisika klasik, dan Fourier tidak masuk. Kriptografi pasca-kuantum ada di cabang.",
    phases: [
      {
        title: "Logika dan biner",
        note: "Komputer hanya tahu benar dan salah.",
        steps: [
          lesson("bilangan", "Rasio, persen, dan urutan operasi."),
          lesson("diskrit", "Logika, himpunan, graf jaringan, dan bilangan biner."),
          lesson("eksponen", "Ruang kunci 2ⁿ dan log₂: berapa lama brute force."),
        ],
      },
      {
        title: "Bilangan rahasia",
        note: "Inti kriptografi kunci publik.",
        steps: [lesson("modular", "Sisa bagi, FPB, pangkat modular, dan RSA.")],
      },
      {
        title: "Ketidakpastian dan deteksi",
        note: "Serangan adalah kejadian langka di antara jutaan baris log.",
        steps: [
          lesson("peluang", "Peluang tabrakan hash dan tebakan kata sandi."),
          lesson("bayes", "Alarm palsu: angka dasar serangan yang langka."),
          lesson("entropi", "Kekuatan kata sandi dan keacakan kunci diukur dalam bit."),
          lesson("sampel", "Garis dasar lalu lintas normal dan skor z untuk anomali."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Untuk kriptografi lanjut dan riset.",
        steps: [
          lesson("matriks", "Sandi berbasis matriks dan kode koreksi galat.", true),
          lesson("linalg", "Kriptografi lattice, fondasi standar pasca-kuantum.", true),
          lesson("kuantum", "Kenapa komputer kuantum mengancam RSA.", true),
          lesson("inferensi", "Menguji apakah lonjakan lalu lintas benar-benar anomali.", true),
          lesson("stokastik", "Pemodelan perilaku pengguna dengan rantai Markov.", true),
        ],
      },
    ],
  },
  {
    id: "quant",
    title: "Analis kuantitatif",
    kicker: "Uang, risiko, model",
    line: "Bunga, kalkulus, statistik, random walk, dan aljabar linear.",
    summary:
      "Quant di bank, sekuritas, dan fintech membangun model harga dan risiko. Berbeda dari aktuaris, mereka banyak memakai proses acak, optimasi, dan matriks kovarians.",
    outcome:
      "Kamu bisa menghitung nilai sekarang, menskalakan volatilitas dengan akar waktu, memperkirakan regresi, menjalankan gradient descent, dan membaca matriks kovarians portofolio.",
    skip: "Fisika klasik dan metode medan tidak masuk. PDE untuk model harga ada sebagai cabang.",
    phases: [
      {
        title: "Uang terhadap waktu",
        note: "Setiap harga adalah arus kas yang didiskonto.",
        steps: [
          lesson("bilangan", "Return, persen, dan basis poin."),
          lesson("eksponen", "Majemuk, log-return, dan e."),
          lesson("barisan", "Arus kas berkala."),
          lesson("deret", "Deret pembayaran dan hampiran Taylor untuk durasi dan konveksitas."),
          lesson("limit", "Bunga kontinu."),
          lesson("bunga", "Nilai sekarang, obligasi, dan anuitas."),
        ],
      },
      {
        title: "Kalkulus",
        note: "Sensitivitas harga adalah turunan.",
        steps: [
          lesson("turunan", "Delta dan durasi: laju perubahan harga."),
          lesson("rantai", "Sensitivitas berantai dan optimasi parameter model."),
          lesson("integral", "Nilai harapan sebagai luas."),
          lesson("parsial", "Harga bergantung pada banyak faktor sekaligus: Greeks."),
        ],
      },
      {
        title: "Risiko dan data",
        note: "Return adalah variabel acak.",
        steps: [
          lesson("peluang", "Skenario dan peluangnya."),
          lesson("bayes", "Memperbarui pandangan saat data baru datang."),
          lesson("sampel", "Rata-rata return, volatilitas, dan ekor."),
          lesson("inferensi", "Apakah strategi itu untung karena kemampuan atau kebetulan."),
          lesson("regresi", "Beta saham dan model faktor."),
        ],
      },
      {
        title: "Model",
        note: "Harga bergerak acak; portofolio adalah matriks.",
        steps: [
          lesson("stokastik", "Random walk, volatilitas √t, dan rantai Markov."),
          lesson("matriks", "Bobot portofolio dan matriks kovarians."),
          lesson("linalg", "Nilai eigen kovarians: faktor risiko utama."),
          lesson("numerik", "Monte Carlo dan metode Newton untuk yield."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Untuk derivatif dan model suku bunga.",
        steps: [
          lesson("ode", "Model suku bunga dan peluruhan.", true),
          lesson("pde", "Black–Scholes adalah persamaan panas yang menyamar.", true),
          lesson("entropi", "Ukuran informasi dan keragaman portofolio.", true),
        ],
      },
    ],
  },
  {
    id: "iklim",
    title: "Ilmuwan iklim dan geospasial",
    kicker: "Bumi sebagai data",
    line: "Koordinat, statistik, panas, fluida, dan model numerik.",
    summary:
      "Data satelit, cuaca ekstrem, banjir, dan pertanian presisi butuh orang yang bisa membaca peta, statistik, dan fisika atmosfer sekaligus. Sangat relevan untuk negara kepulauan tropis.",
    outcome:
      "Kamu bisa bekerja dengan koordinat dan proyeksi, meringkas dan menguji tren data iklim, menjelaskan panas dan aliran udara, dan membaca model numerik cuaca.",
    skip: "Keuangan, logika diskrit, dan kriptografi tidak masuk. Kuantum dan optik lanjut juga tidak.",
    phases: [
      {
        title: "Peta dan sudut",
        note: "Bumi bulat, peta datar, citra satelit berupa matriks.",
        steps: [
          lesson("trig", "Lintang, bujur, dan sudut matahari."),
          lesson("geometri", "Luas, jarak, dan Pythagoras pada peta."),
          lesson("vektor", "Arah angin dan arus laut adalah medan vektor."),
          lesson("linalg", "Proyeksi peta, citra satelit, dan PCA pada data iklim."),
        ],
      },
      {
        title: "Data iklim",
        note: "Tren yang nyata harus dipisahkan dari variasi tahunan.",
        steps: [
          lesson("peluang", "Peluang kejadian ekstrem dan periode ulang."),
          lesson("sampel", "Anomali suhu adalah skor terhadap rata-rata jangka panjang."),
          lesson("inferensi", "Apakah tren itu nyata atau variasi alami."),
          lesson("regresi", "Kemiringan tren per dekade."),
        ],
      },
      {
        title: "Fisika atmosfer dan laut",
        note: "Mesin iklim adalah panas yang mengalir.",
        steps: [
          lesson("termo", "Kalor, perubahan wujud air, dan neraca energi Bumi."),
          lesson("fluida", "Tekanan, aliran, dan arus."),
          lesson("gelombang", "Gelombang laut, gempa, dan tsunami."),
          lesson("foton", "Penginderaan jauh dan efek rumah kaca bekerja pada panjang gelombang."),
        ],
      },
      {
        title: "Model",
        note: "Ramalan cuaca adalah persamaan diferensial yang dihitung numerik.",
        steps: [
          lesson("turunan", "Laju perubahan suhu dan tekanan."),
          lesson("ode", "Model kotak sederhana untuk neraca panas."),
          lesson("pde", "Difusi panas dan adveksi: ruang dan waktu sekaligus."),
          lesson("numerik", "Model cuaca dan iklim berjalan langkah demi langkah."),
          lesson("fourier", "Siklus harian, musiman, dan El Niño."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Untuk pemodelan dan pemrosesan citra lanjut.",
        steps: [
          lesson("stokastik", "Hujan dan kekeringan sebagai proses acak.", true),
          lesson("parsial", "Gradien tekanan dan suhu.", true),
          lesson("sinyal", "Resolusi dan sampling sensor satelit.", true),
          lesson("medan", "Divergensi dan pusaran pada angin.", true),
        ],
      },
    ],
  },
  {
    id: "iot",
    title: "Insinyur sistem tertanam dan IoT",
    kicker: "Perangkat kecil, terhubung",
    line: "Biner, rangkaian, sinyal digital, dan kendali.",
    summary:
      "Sensor rumah, mesin pabrik, dan perangkat yang dipakai di badan berjalan di mikrokontroler kecil. Peta ini memegang logika digital, rangkaian, magnet, sampling, dan kendali umpan balik.",
    outcome:
      "Kamu bisa membaca register biner, menghitung rangkaian dan daya, memilih laju sampling ADC, menghindari aliasing, dan menala kendali sederhana.",
    skip: "Mekanika lanjut, fluida, dan fisika matematis tidak masuk. Keamanan perangkat ada sebagai cabang.",
    phases: [
      {
        title: "Digital",
        note: "Mikrokontroler hanya tahu bit.",
        steps: [
          lesson("bilangan", "Skala sensor, persen, dan pembulatan."),
          lesson("diskrit", "Logika, biner, dan mesin keadaan."),
          lesson("eksponen", "2ⁿ tingkat, log₂, dan resolusi ADC."),
        ],
      },
      {
        title: "Rangkaian",
        note: "Perangkat keras di balik setiap pin.",
        steps: [
          lesson("satuan", "mA, mW, dan mAh menentukan umur baterai."),
          lesson("listrik", "Ohm, pembagi tegangan, dan daya."),
          lesson("magnet", "Relay, motor, dan induktor."),
          lesson("kompleks", "Impedansi pada sinyal AC."),
          lesson("ode", "Pengisian kapasitor dan filter RC."),
        ],
      },
      {
        title: "Sinyal dan kendali",
        note: "Dari dunia analog ke angka, lalu kembali.",
        steps: [
          lesson("trig", "Sinyal periodik."),
          lesson("fourier", "Frekuensi dalam sinyal sensor."),
          lesson("sinyal", "Laju sampling, aliasing, dan kuantisasi ADC."),
          lesson("kendali", "PID pada pemanas, motor, dan kipas."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Untuk perangkat yang aman dan pintar.",
        steps: [
          lesson("modular", "Checksum, CRC, dan enkripsi ringan.", true),
          lesson("entropi", "Kompresi data dan keacakan kunci.", true),
          lesson("sampel", "Menyaring noise sensor.", true),
          lesson("laplace", "Analisis filter dan kestabilan.", true),
          lesson("foton", "Sensor cahaya dan inframerah.", true),
        ],
      },
    ],
  },
  {
    id: "kuantum",
    title: "Insinyur komputasi kuantum",
    kicker: "Amplitudo, bukan bit",
    line: "Bilangan kompleks, aljabar linear, peluang, dan qubit.",
    summary:
      "Komputasi kuantum masih muda, tetapi lima tahun ke depan bertumbuh cepat. Bahasanya adalah aljabar linear atas bilangan kompleks, ditambah peluang dan sedikit teori bilangan untuk algoritma kriptografi.",
    outcome:
      "Kamu bisa menulis qubit sebagai vektor amplitudo, menghitung peluang hasil ukur, membaca gerbang sebagai matriks, dan menjelaskan kenapa algoritma Shor mengancam RSA.",
    skip: "Mekanika klasik lanjut, fluida, dan keuangan tidak masuk.",
    phases: [
      {
        title: "Bahasa",
        note: "Keadaan kuantum adalah vektor kompleks.",
        steps: [
          lesson("trig", "Sudut dan fase."),
          lesson("kompleks", "Amplitudo dan fase adalah bilangan kompleks."),
          lesson("vektor", "Keadaan adalah vektor; ukuran kemiripan adalah hasil kali dalam."),
          lesson("matriks", "Gerbang kuantum adalah matriks."),
          lesson("linalg", "Nilai eigen adalah hasil ukur yang mungkin."),
        ],
      },
      {
        title: "Peluang",
        note: "Hasil ukur bersifat acak.",
        steps: [
          lesson("peluang", "Peluang hasil ukur dan pengulangan eksperimen."),
          lesson("sampel", "Berapa kali sirkuit dijalankan supaya estimasinya cukup."),
          lesson("entropi", "Informasi dan keterkaitan antar-qubit."),
        ],
      },
      {
        title: "Fisika",
        note: "Dari gelombang ke qubit.",
        steps: [
          lesson("gelombang", "Superposisi dan interferensi."),
          lesson("foton", "Cahaya datang dalam paket."),
          lesson("kuantum", "Qubit, pengukuran, dan tingkat energi."),
        ],
      },
      {
        title: "Algoritma",
        note: "Kenapa kuantum bisa lebih cepat.",
        steps: [
          lesson("diskrit", "Gerbang logika dan sirkuit."),
          lesson("modular", "Algoritma Shor mencari periode pangkat modular."),
          lesson("fourier", "Transformasi Fourier kuantum adalah inti Shor."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Untuk fisika perangkat keras kuantum.",
        steps: [
          lesson("pde", "Persamaan Schrödinger.", true),
          lesson("khusus", "Fungsi khusus pada atom hidrogen.", true),
          lesson("numerik", "Simulasi sirkuit di komputer biasa.", true),
        ],
      },
    ],
  },
  {
    id: "bioinfo",
    title: "Bioinformatikawan",
    kicker: "Biologi sebagai data",
    line: "Statistik, graf, rantai Markov, dan PCA pada data genom.",
    summary:
      "Genomik, pengembangan obat, dan kesehatan masyarakat menghasilkan data yang sangat besar. Bioinformatikawan memakai statistik, algoritma pada urutan dan graf, serta model peluang.",
    outcome:
      "Kamu bisa menguji perbedaan ekspresi gen dengan benar, membaca log fold change, memahami rantai Markov pada urutan DNA, dan meringkas ribuan gen dengan PCA.",
    skip: "Fisika klasik, kendali, dan keuangan tidak masuk.",
    phases: [
      {
        title: "Data dan urutan",
        note: "DNA adalah teks; jaringan protein adalah graf.",
        steps: [
          lesson("bilangan", "Rasio, persen, dan konsentrasi."),
          lesson("diskrit", "Himpunan gen, graf interaksi, dan logika filter."),
          lesson("eksponen", "Log fold change dan pertumbuhan sel."),
        ],
      },
      {
        title: "Statistik",
        note: "Ribuan uji sekaligus menuntut kehati-hatian.",
        steps: [
          lesson("peluang", "Mutasi dan kecocokan acak."),
          lesson("bayes", "Tes diagnostik dan prior biologis."),
          lesson("sampel", "Variasi antarsampel dan pencilan."),
          lesson("inferensi", "Nilai p, interval, dan bahaya uji berganda."),
          lesson("regresi", "Hubungan dosis-respons dan ekspresi gen."),
        ],
      },
      {
        title: "Model",
        note: "Meringkas dan memodelkan data biologis.",
        steps: [
          lesson("linalg", "PCA pada matriks ekspresi gen."),
          lesson("stokastik", "Rantai Markov pada urutan DNA dan evolusi."),
          lesson("entropi", "Konservasi urutan dan logo motif diukur dalam bit."),
        ],
      },
      {
        title: "Setelah inti",
        note: "Untuk pemodelan dinamis dan komputasi lanjut.",
        steps: [
          lesson("matriks", "Matriks skor penjajaran urutan.", true),
          lesson("ode", "Model populasi, epidemi, dan kadar obat.", true),
          lesson("numerik", "Optimasi dan simulasi.", true),
        ],
      },
    ],
  },
];

for (const road of ROADMAPS) {
  const ids = road.phases.flatMap((phase) => phase.steps.map((step) => step.topicId));
  const dup = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (dup.length) throw new Error(`Peta ${road.id} memakai materi dua kali: ${dup.join(", ")}`);
}

const byId = new Map(ROADMAPS.map((road) => [road.id, road]));

export function allRoadmaps(): Roadmap[] {
  return ROADMAPS;
}

export function getRoadmap(id: string): Roadmap | undefined {
  return byId.get(id);
}

export function flatSteps(road: Roadmap, optional?: boolean): RoadStep[] {
  const steps = road.phases.flatMap((phase) => phase.steps);
  if (optional === undefined) return steps;
  return steps.filter((step) => Boolean(step.optional) === optional);
}

/** Catatan latihan yang dibutuhkan untuk menilai "cukup". */
export type Score = { correct: Record<string, number>; hard?: Record<string, number> };

/** Cukup = minimal DONE_AT jawaban benar, dan minimal satu di level Sedang atau Tantangan. */
export function isEnough(score: Score, topicId: string): boolean {
  return (score.correct[topicId] ?? 0) >= DONE_AT && (score.hard?.[topicId] ?? 0) >= HARD_AT;
}

export function doneCount(road: Roadmap, score: Score, optional = false): number {
  return flatSteps(road, optional).filter((step) => isEnough(score, step.topicId)).length;
}

export function nextStep(road: Roadmap, score: Score): RoadStep | undefined {
  return flatSteps(road, false).find((step) => !isEnough(score, step.topicId));
}

export function minutesOf(steps: RoadStep[]): number {
  return steps.reduce((sum, step) => sum + (getTopic(step.topicId)?.minutes ?? 0), 0);
}

export function omittedTopics(road: Roadmap): Topic[] {
  const used = new Set(flatSteps(road).map((step) => step.topicId));
  return allTopics().filter((topic) => !used.has(topic.id));
}

export function formatSpan(mins: number): string {
  if (mins < 90) return `${mins} menit`;
  const hours = Math.round(mins / 30) / 2;
  const label = Number.isInteger(hours) ? String(hours) : String(hours).replace(".", ",");
  return `sekitar ${label} jam`;
}
