import { allTopics, getTopic, type Topic } from "./topics";

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

function lesson(topicId: string, why: string, optional = false): RoadStep {
  if (!getTopic(topicId)) throw new Error(`Peta menyebut materi yang tidak ada: ${topicId}`);
  return { topicId, why, optional };
}

export const ROADMAPS: Roadmap[] = [
  {
    id: "analis",
    title: "Analis data",
    kicker: "Angka yang sudah ada",
    line: "KPI, grafik, pertumbuhan, dan ketidakpastian. Tanpa fisika.",
    summary: "Kerja analis adalah membaca tabel yang sudah terkumpul, lalu bilang apa yang berubah dan apa yang belum boleh dipercaya. Kalkulus dan fisika tidak masuk peta ini.",
    outcome: "Kamu bisa menghitung rasio tanpa menjumlahkan persen, membaca kemiringan grafik, dan curiga pada rata-rata.",
    skip: "Kalkulus, fisika, Fourier, dan persamaan diferensial bukan pekerjaan analis harian. Semuanya tetap di katalog.",
    phases: [
      {
        title: "Membaca angka",
        note: "Tiga alat sebelum kamu membuka statistik.",
        steps: [
          lesson("bilangan", "Konversi, bagian dari total, dan diskon bertumpuk adalah bahasa KPI."),
          lesson("aljabar", "Hubungan “naik sekian, hasil sekian” paling sering cukup berupa garis lurus."),
          lesson("fungsi", "Grafik dasbor adalah fungsi. Kemiringan adalah laju, bukan hiasan sumbu."),
        ],
      },
      {
        title: "Tren dan ketidakpastian",
        note: "Supaya lonjakan seminggu tidak langsung disebut tren.",
        steps: [
          lesson("barisan", "Angka per minggu adalah barisan. Bedakan pertumbuhan tetap dan lonjakan sekali."),
          lesson("eksponen", "Pertumbuhan berlipat dan skala log. Persen saja tidak cukup kalau angkanya melonjak."),
          lesson("peluang", "Tanpa ini, kata signifikan hanya gaya bahasa."),
          lesson("statistik", "Rata-rata, sebaran, dan sampel: tiga cara tabel kelihatan meyakinkan padahal tidak."),
        ],
      },
    ],
  },
  {
    id: "ilmuwan",
    title: "Ilmuwan data",
    kicker: "Model dari data",
    line: "Dari rasio sampai matriks: yang dipakai saat melatih model.",
    summary: "Ilmuwan data tidak menghafal seluruh matematika teknik. Yang dipakai berulang adalah peluang, turunan sebagai arah perbaikan, dan data yang berbentuk vektor serta matriks.",
    outcome: "Kamu bisa menjelaskan kenapa model linear punya intercept, kenapa galat diturunkan, dan kenapa satu baris data adalah vektor.",
    skip: "Fluida, optik, medan, persamaan diferensial parsial, dan residu tetap di katalog. Itu metode fisika, bukan syarat model tabular.",
    phases: [
      {
        title: "Bahasa model",
        note: "Sebelum algoritma, kamu harus bisa membaca rumus sederhananya.",
        steps: [
          lesson("bilangan", "Metrik, bobot, dan skala sering berupa rasio. Jangan jumlahkan persen."),
          lesson("aljabar", "Intercept dan kemiringan model linear adalah persamaan ini."),
          lesson("fungsi", "Model adalah mesin: fitur masuk, prediksi keluar."),
          lesson("eksponen", "Log mengubah perkalian menjadi penjumlahan. Ia muncul di peluang dan fitur yang tumbuh cepat."),
        ],
      },
      {
        title: "Yang dioptimalkan",
        note: "Melatih model artinya menggeser parameter supaya galat turun.",
        steps: [
          lesson("peluang", "Prediksi yang jujur adalah sebaran kemungkinan, bukan satu angka sakti."),
          lesson("statistik", "Kamu perlu tahu kapan sampel kecil sedang menipu metrik."),
          lesson("limit", "Turunan adalah limit. Lewati ini dan gradien jadi simbol hafalan."),
          lesson("turunan", "Arah yang menurunkan galat adalah turunan. Itu inti langkah pelatihan."),
          lesson("parsial", "Galat bergantung pada banyak parameter sekaligus. Turunannya parsial, bukan satu huruf."),
          lesson("integral", "Peluang pada suatu rentang adalah luas di bawah kurva."),
        ],
      },
      {
        title: "Bentuk data",
        note: "Di kode, ini yang benar-benar dikalikan.",
        steps: [
          lesson("barisan", "Deret waktu adalah barisan. Banyak data bisnis berbentuk itu."),
          lesson("vektor", "Satu baris data adalah vektor fitur."),
          lesson("matriks", "Sekumpulan baris, dan bobot model, dikalikan sebagai matriks."),
          lesson("numerik", "Di data nyata jarang ada rumus tertutup. Kamu iterasi, dan pembulatan itu nyata."),
          lesson("deret", "Hampiran memotong fungsi yang tidak punya rumus rapi. Model sering hidup dari pemotongan ini."),
        ],
      },
    ],
  },
  {
    id: "ai",
    title: "AI Engineer",
    kicker: "Model yang dijalankan",
    line: "Vektor, matriks, turunan, dan peluang. Itu yang menggerakkan model.",
    summary: "AI engineer memasang model supaya ia belajar dan tetap stabil saat dijalankan. Peta ini hanya pelajaran yang muncul di perkalian matriks, gradien, dan keluaran berupa peluang.",
    outcome: "Kamu bisa menelusuri satu lapisan sebagai fungsi, backpropagation sebagai aturan rantai, dan softmax sebagai eksponen yang dinormalkan.",
    skip: "Persamaan diferensial parsial, fluida, foton, dan teorema Gauss bukan tiket masuk. Sinyal dan citra ada di bawah, dan boleh dilewati.",
    phases: [
      {
        title: "Mesin masukan",
        note: "Satu lapisan, sebelum kamu peduli arsitektur.",
        steps: [
          lesson("aljabar", "Bobot kali masukan, lalu digeser: itu persamaan linear di setiap neuron."),
          lesson("fungsi", "Lapisan adalah fungsi. Keluarannya menjadi masukan lapisan berikut."),
          lesson("eksponen", "Softmax, log-loss, dan peluruhan laju belajar hidup di eksponen dan log."),
          lesson("vektor", "Embedding dan aktivasi adalah vektor, bukan daftar angka yang lepas-lepas."),
        ],
      },
      {
        title: "Yang membuatnya belajar",
        note: "Ini yang dihitung berulang saat pelatihan.",
        steps: [
          lesson("matriks", "Perkalian yang dijalankan perangkat adalah perkalian matriks."),
          lesson("limit", "Gradien adalah limit perubahan kecil. Pahami dulu sebelum simbolnya."),
          lesson("turunan", "Aturan rantai pada turunan adalah ide di balik backpropagation."),
          lesson("parsial", "Setiap bobot punya turunannya sendiri. Kumpulan itu adalah gradien, yaitu turunan parsial."),
          lesson("integral", "Nilai harapan dan rapat peluang kontinu adalah luas, bukan jumlah diam-diam."),
          lesson("peluang", "Keluaran klasifikasi dan model generatif adalah peluang."),
          lesson("statistik", "Kamu perlu membedakan metrik yang naik karena kebetulan sampel."),
          lesson("numerik", "Gradien yang meledak, langkah terlalu besar, dan pembulatan: ini pelajarannya."),
        ],
      },
      {
        title: "Hanya untuk sinyal, suara, atau citra",
        note: "Bukan syarat. Lewati kalau pekerjaanmu tidak menyentuh gelombang atau gambar.",
        steps: [
          lesson("trig", "Rotasi dan gelombang hidup di sinus dan kosinus.", true),
          lesson("fourier", "Suara dan citra sering diurai menjadi jumlah gelombang.", true),
        ],
      },
    ],
  },
  {
    id: "aktuaris",
    title: "Aktuaris",
    kicker: "Harga ketidakpastian",
    line: "Persen, deret, peluang, dan ekor distribusi. Tanpa fisika.",
    summary: "Aktuaris mengubah kejadian yang belum tentu terjadi menjadi angka uang. Yang penting di sini: bunga, deret pembayaran, peluang klaim, dan luas ekor distribusi.",
    outcome: "Kamu bisa menolak diskon persen yang dijumlahkan, menulis anuitas sebagai deret, dan membaca peluang ekor sebagai luas.",
    skip: "Matriks besar, Fourier, dan seluruh fisika tidak masuk. Ambil turunan di katalog hanya kalau kamu masuk model kontinu yang memakai laju sesaat.",
    phases: [
      {
        title: "Uang terhadap waktu",
        note: "Sebelum tabel mortalita, kamu harus jujur pada bunga dan rasio.",
        steps: [
          lesson("bilangan", "Premi dan bunga dimulai dari persen. Dua persen beruntun tidak dijumlah."),
          lesson("aljabar", "Nilai sekarang dan nilai yang ditanya sering satu huruf di satu ruas."),
          lesson("fungsi", "Manfaat atau cadangan sebagai fungsi waktu. Satu masukan, satu keluaran."),
          lesson("eksponen", "Bunga majemuk dan peluruhan adalah eksponen, bukan perkalian yang diulang malas."),
          lesson("barisan", "Anuitas dan cicilan adalah deret. Rumusnya menggantikan penjumlahan sebulan-sebulan."),
          lesson("deret", "Pembayaran yang panjang dan hampiran kontinu lebih jujur sebagai deret, bukan sepuluh baris dijumlah."),
          lesson("limit", "Bunga kontinu adalah limit dari bunga yang dikompoundkan makin sering."),
        ],
      },
      {
        title: "Kejadian dan kerugian besar",
        note: "Harga sebuah janji bergantung pada seberapa sering, dan seberapa parah.",
        steps: [
          lesson("peluang", "Klaim adalah kejadian. Nilai uangnya dikalikan peluangnya, bukan firasat."),
          lesson("statistik", "Tabel mortalita dan ukuran klaim adalah statistik sampel, lengkap dengan sebarannya."),
          lesson("integral", "Pada distribusi kontinu, kerugian besar duduk di ekor. Ekor itu luas, bukan satu titik."),
        ],
      },
    ],
  },
  {
    id: "elektro",
    title: "Insinyur elektro",
    kicker: "Sinyal dan rangkaian",
    line: "Rangkaian, sinyal, fasor, Fourier, dan medan.",
    summary: "Peta ini memegang yang membentuk kerja elektro: rangkaian, sinyal, sistem terhadap waktu, lalu medan. Mekanika benda tidak ikut.",
    outcome: "Kamu bisa membaca fasor sebagai bilangan kompleks, mengurai sinyal dengan Fourier, dan membawa rangkaian linear ke ranah Laplace.",
    skip: "Fluida, gaya Newton, dan mekanika benda tegar bukan gerbang elektro. Materi itu tetap di katalog, tercantum di bawah.",
    phases: [
      {
        title: "Bahasa sinyal",
        note: "Sinus, redaman, dan panah komponen.",
        steps: [
          lesson("aljabar", "Hukum Kirchhoff pada akhirnya sistem persamaan linear."),
          lesson("fungsi", "Tegangan terhadap waktu adalah fungsi. Kamu harus bisa membacanya."),
          lesson("trig", "Arus bolak-balik, fase, dan gelombang adalah sinus dan kosinus."),
          lesson("eksponen", "Redaman dan pengisian kapasitor berbentuk eksponen, bukan garis."),
          lesson("vektor", "Fasor dan komponen medan digambar sebagai vektor."),
        ],
      },
      {
        title: "Rangkaian yang berubah",
        note: "Dari muatan terhadap waktu sampai ranah s.",
        steps: [
          lesson("limit", "Turunan arus dan tegangan butuh arti “perubahan kecil” yang jernih."),
          lesson("turunan", "Arus pada kapasitor adalah turunan muatan. Itu bukan analogi."),
          lesson("integral", "Muatan adalah integral arus. Energi juga sering luas di bawah kurva."),
          lesson("satuan", "Salah satuan pada kapasitor atau induktor menggagalkan seluruh rangkaian di kertas."),
          lesson("listrik", "Hukum Ohm, rangkaian, dan medan muatan adalah lantai, bukan pengayaan."),
          lesson("gelombang", "Sinyal merambat. Frekuensi, panjang gelombang, dan cepat rambat tidak boleh tertukar."),
          lesson("kompleks", "Fasor adalah bilangan kompleks. Impedansi ikut aljabar itu."),
          lesson("deret", "Hampiran dan Fourier sendiri adalah deret. Sinyal jarang satu sinus tunggal."),
          lesson("fourier", "Sinyal rumit diurai menjadi sinus. Itu alat harian, bukan bab hiasan."),
          lesson("laplace", "Sistem linear diselesaikan di ranah s, lalu dikembalikan ke waktu."),
          lesson("ode", "Muatan dan arus terhadap waktu adalah persamaan diferensial biasa."),
        ],
      },
      {
        title: "Elektromagnetika",
        note: "Masuk setelah rangkaian terasa ringan. Ini bagian bidangnya, bukan pengayaan sembarangan.",
        steps: [
          lesson("medan", "Gradien, divergensi, dan curl adalah kalimat untuk medan listrik dan magnet."),
          lesson("fluks", "Berapa banyak medan menembus permukaan. Hukum Gauss duduk di sini."),
          lesson("pde", "Gelombang pada ruang dan waktu sekaligus. Persamaan Maxwell yang disederhanakan berakhir di sini.", true),
          lesson("numerik", "Geometri rangkaian yang tidak rapi jarang punya rumus tertutup.", true),
        ],
      },
      {
        title: "Hanya untuk fotonika",
        note: "Cahaya sebagai komponen. Lewati kalau kamu di rangkaian dan sinyal.",
        steps: [
          lesson("optik", "Lensa dan sinar: geometri cahaya sebelum foton.", true),
          lesson("foton", "Energi terkuantisasi. Perlu kalau kamu menyentuh sensor atau laser.", true),
        ],
      },
    ],
  },
  {
    id: "mesin",
    title: "Insinyur mesin",
    kicker: "Gaya, gerak, fluida",
    line: "Gaya, energi, getaran, fluida, dan persamaan geraknya.",
    summary: "Insinyur mesin di peta ini belajar benda yang bergerak, menyimpan energi, bergetar, dan dialiri fluida. Listrik dan optik tidak ikut.",
    outcome: "Kamu bisa memecah gaya, menghitung usaha dari energi, dan tahu kapan gerak butuh persamaan diferensial, bukan rumus GLB.",
    skip: "Listrik, foton, dan Fourier bukan inti mesin. Parabola dan benda kontinu sudah masuk di peta, bukan disembunyikan.",
    phases: [
      {
        title: "Gambar dan komponen",
        note: "Sebelum hukum Newton, satuan dan komponen harus rapi.",
        steps: [
          lesson("aljabar", "Hampir setiap kesetimbangan gaya berakhir sebagai persamaan linear."),
          lesson("fungsi", "Posisi terhadap waktu adalah fungsi. Grafiknya bukan sketsa bebas."),
          lesson("trig", "Gaya pada bidang miring dan komponen vektor butuh sinus dan kosinus."),
          lesson("geometri", "Panjang, luas, dan Pythagoras muncul di gambar, tidak hanya di pelajaran SMP."),
          lesson("vektor", "Gaya yang tidak segaris dijumlah lewat komponen, baru diukur panjangnya."),
        ],
      },
      {
        title: "Perubahan",
        note: "Kecepatan dan usaha adalah turunan dan luas.",
        steps: [
          lesson("limit", "Kecepatan sesaat adalah limit. Tanpa itu, turunan posisi terasa sulap."),
          lesson("turunan", "Kecepatan turunan posisi. Percepatan turunan kecepatan."),
          lesson("integral", "Perpindahan adalah luas di bawah kurva kecepatan. Usaha mirip itu."),
        ],
      },
      {
        title: "Benda yang bergerak",
        note: "Ini daftar yang dipakai di soal mesin tahun pertama.",
        steps: [
          lesson("satuan", "Newton, joule, dan pascal. Salah satuan berarti salah desain di kertas."),
          lesson("kinematika", "Gerak lurus dulu. Jangan loncat ke gaya sebelum posisi dan waktu rapi."),
          lesson("parabola", "Lintasan lengkung: lemparan, nozzle, titik jatuh. Waktu datang dari sumbu vertikal."),
          lesson("newton", "Gaya resultan, massa, dan percepatan. Gambar gaya sebelum rumus."),
          lesson("energi", "Usaha dan kekekalan energi memotong banyak soal yang macet di gaya."),
          lesson("momentum", "Tumbukan dan impuls. Gaya besar dalam waktu singkat lebih jujur begini."),
          lesson("gelombang", "Getaran mesin, pada ayunan kecil, tidak bergantung pada seberapa keras disentak."),
          lesson("fluida", "Tekanan, debit, dan gaya apung. Pompa dan saluran tidak selesai dengan Newton saja."),
          lesson("ode", "Gaya yang bergantung pada kecepatan tidak selesai dengan satu rumus kinematika."),
        ],
      },
      {
        title: "Benda yang tidak lagi satu garis",
        note: "Bukan gerbang tahun pertama. Fluida lanjut, panas, dan getaran sistem butuh ini.",
        steps: [
          lesson("parsial", "Tekanan atau suhu yang berubah ke lebih dari satu arah.", true),
          lesson("lipat", "Gaya pada luasan dan volume, bukan hanya sepanjang garis.", true),
          lesson("laplace", "Getaran dan sistem kontrol linear sering diselesaikan di ranah s.", true),
          lesson("pde", "Panas pada batang atau pelat: ruang dan waktu sekaligus.", true),
          lesson("numerik", "Bentuk yang tidak punya rumus tertutup dihitung langkah demi langkah, dengan galat yang sadar.", true),
          lesson("variasi", "Prinsip energi minimum. Dipakai saat kamu memilih bentuk, bukan hanya satu angka.", true),
        ],
      },
    ],
  },
  {
    id: "fisikawan",
    title: "Fisikawan",
    kicker: "Hukum, lalu metodenya",
    line: "Mekanika, listrik, lalu matematika yang dipakai terus.",
    summary: "Inti dulu: kalkulus, mekanika, listrik, dan metode yang muncul lagi. Cabang katalog — fluida, optik, foton, residu — ada di bawah, bukan di depan.",
    outcome: "Kamu bisa bergerak dari hukum Newton ke turunan, lalu membaca Fourier dan persamaan diferensial sebagai alat, bukan bab terpisah.",
    skip: "Yang tidak masuk hanya persen harian dan barisan sekolah. Peran mereka sudah ditutup deret, peluang, dan integral. Sisanya ada di peta ini.",
    phases: [
      {
        title: "Bahasa",
        note: "Tanpa ini, bab fisika hanya hafalan simbol.",
        steps: [
          lesson("aljabar", "Memindahkan suku dengan jujur. Hampir setiap penurunan rumus berhenti di sini kalau kacau."),
          lesson("fungsi", "Hukum fisika adalah fungsi. Grafik adalah seluruh pasangan masukan dan keluaran."),
          lesson("trig", "Komponen, rotasi, dan gelombang butuh sinus dan kosinus."),
          lesson("geometri", "Panjang, luas, dan sudut pada gambar. Banyak hukum dimulai dari sini, bukan dari notasi mewah."),
          lesson("eksponen", "Peluruhan, pertumbuhan, dan gelombang teredam berbentuk eksponen."),
          lesson("vektor", "Gaya, kecepatan, dan medan adalah vektor. Arahnya bagian dari jawaban."),
        ],
      },
      {
        title: "Kalkulus yang dipakai",
        note: "Tiga ide, bukan seluruh trik integral.",
        steps: [
          lesson("limit", "Turunan dan kekontinuan berdiri di atas limit."),
          lesson("turunan", "Laju sesaat: kecepatan, arus, dan kemiringan energi potensial."),
          lesson("integral", "Menjumlahkan potongan kecil: usaha, muatan, dan luas peluang."),
        ],
      },
      {
        title: "Hukum yang tidak dilewati",
        note: "Lantai bersama sebelum memilih bidang.",
        steps: [
          lesson("satuan", "Dimensi yang tidak cocok berarti persamaan itu bukan fisika."),
          lesson("kinematika", "Gerak dulu, gaya kemudian. Waktu sering jadi penghubung dua sumbu."),
          lesson("newton", "Hukum gerak. Gambar gaya sebelum memecah komponen."),
          lesson("energi", "Kekekalan memotong soal yang bertele-tele di gaya."),
          lesson("momentum", "Jika gaya rumit tetapi impulsnya singkat, pindah ke momentum."),
          lesson("gelombang", "Frekuensi, panjang gelombang, dan superposisi. Akan kembali di Fourier."),
          lesson("listrik", "Muatan, medan, dan rangkaian sederhana. Lantai untuk medan vektor nanti."),
        ],
      },
      {
        title: "Metode yang kembali terus",
        note: "Alat, bukan koleksi bab.",
        steps: [
          lesson("kompleks", "Gelombang dan fasor ditulis lebih pendek dengan bilangan kompleks."),
          lesson("deret", "Hampiran Taylor adalah cara fisika memotong fungsi yang tidak mau sederhana."),
          lesson("matriks", "Sistem linear, ragam normal, dan transformasi duduk di matriks."),
          lesson("medan", "Gradien, divergensi, dan curl adalah kalimat untuk medan, bukan hiasan notasi."),
          lesson("fourier", "Fungsi periodik diurai menjadi sinus. Getaran dan gelombang kembali ke sini."),
          lesson("ode", "Hampir setiap hukum satu variabel waktu menjadi persamaan diferensial biasa."),
          lesson("peluang", "Sebelum sebaran dan ketidakpastian ukur, kejadian dan frekuensi jangka panjang harus jernih."),
          lesson("statistik", "Pengukuran punya sebaran. Satu angka tanpa ketidakpastian belum hasil."),
        ],
      },
      {
        title: "Saat soal tidak lagi satu variabel",
        note: "Bukan gerbang. Buka setelah inti terasa ringan.",
        steps: [
          lesson("parsial", "Fungsi dua peubah atau lebih. Turunan dengan peubah lain ditahan.", true),
          lesson("lipat", "Integral pada luasan dan volume, bukan hanya sepanjang garis.", true),
          lesson("fluks", "Berapa banyak medan yang menembus permukaan.", true),
          lesson("laplace", "Mengubah persamaan diferensial menjadi aljabar, lalu kembali.", true),
          lesson("pde", "Panas, gelombang, dan potensial: fungsi terhadap ruang dan waktu sekaligus.", true),
          lesson("numerik", "Saat persamaan tidak punya rumus tertutup, kamu iterasi dengan sadar galat.", true),
        ],
      },
      {
        title: "Cabang, setelah inti",
        note: "Tetap bagian fisikawan. Jangan dibuka bersamaan dengan hukum Newton.",
        steps: [
          lesson("parabola", "Kasus gerak dua sumbu. Waktu adalah penghubung, bukan dua gerak yang terpisah.", true),
          lesson("fluida", "Tekanan, debit, dan gaya apung. Bidang sendiri, bukan pengganti Newton.", true),
          lesson("optik", "Sinar dan lensa, sebelum cahaya diperlakukan sebagai foton.", true),
          lesson("foton", "Energi terkuantisasi. Gerbang ke fisika modern di katalog ini.", true),
          lesson("residu", "Integral di bidang kompleks lewat kutub. Alat, bukan hafalan kontur.", true),
          lesson("variasi", "Lintasan yang membuat suatu besaran stasioner. Aksi dan bentuk optimum.", true),
          lesson("khusus", "Bessel, Legendre, dan saudara mereka: solusi yang muncul terus di persamaan fisika.", true),
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

export function isEnough(correct: number): boolean {
  return correct >= DONE_AT;
}

export function doneCount(road: Roadmap, correct: Record<string, number>, optional = false): number {
  return flatSteps(road, optional).filter((step) => isEnough(correct[step.topicId] ?? 0)).length;
}

export function nextStep(road: Roadmap, correct: Record<string, number>): RoadStep | undefined {
  return flatSteps(road, false).find((step) => !isEnough(correct[step.topicId] ?? 0));
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
