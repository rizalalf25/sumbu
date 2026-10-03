import { getProject } from "./projects.ts";

export type PartGroup = "inti" | "habis" | "alat" | "opsional";

export type Part = {
  item: string;
  spec: string;
  qty: number;
  /** Perkiraan harga per satuan dalam rupiah: [termurah, termahal]. */
  price: [number, number];
  group: PartGroup;
  note?: string;
};

export type BuildStep = { t: string; d: string; warn?: string };

export type Kit = {
  /** Satu-dua kalimat: apa yang dibangun dan pilihan jalurnya. */
  summary: string;
  parts: Part[];
  build: BuildStep[];
  /** Saran belanja: cara memilih, jebakan, dan cara berhemat. */
  tips: string[];
};

export const GROUP_LABEL: Record<PartGroup, { title: string; note: string }> = {
  inti: { title: "Komponen inti", note: "Wajib untuk proyek ini." },
  habis: { title: "Bahan habis pakai", note: "Murah, tetapi pekerjaan macet tanpanya." },
  alat: { title: "Alat kerja", note: "Sekali beli, dipakai ulang di proyek lain. Coret yang sudah punya." },
  opsional: { title: "Opsional", note: "Untuk lanjutan atau kenyamanan. Boleh ditunda." },
};

// Alat kerja elektronika yang dipakai banyak proyek.
const SOLDER: Part = { item: "Solder listrik bersuhu atur", spec: "60–90 W, ujung chisel 2 mm, suhu 300–380 °C", qty: 1, price: [150000, 900000], group: "alat", note: "Solder 30 W tanpa pengatur suhu sulit dipakai untuk kabel daya tebal." };
const MULTIMETER: Part = { item: "Multimeter digital", spec: "Ukur tegangan DC, arus, hambatan, dan uji sambung (bunyi)", qty: 1, price: [80000, 350000], group: "alat" };
const OBENG: Part = { item: "Set obeng presisi", spec: "Plus, minus, dan hex 1,5 / 2 / 2,5 mm", qty: 1, price: [50000, 200000], group: "alat" };
const TANG: Part = { item: "Tang potong kecil, pengupas kabel, pinset", spec: "Untuk kabel 12–28 AWG", qty: 1, price: [60000, 200000], group: "alat" };
const TIMAH: Part = { item: "Timah solder dan flux", spec: "Timah 63/37 diameter 0,8 mm + flux pasta atau pena", qty: 1, price: [40000, 150000], group: "habis" };
const SUSUT: Part = { item: "Selongsong susut panas, kabel ties, double tape", spec: "Paket ukuran campur", qty: 1, price: [30000, 90000], group: "habis" };
const JUMPER: Part = { item: "Kabel jumper dan breadboard", spec: "Jumper male-male / male-female 40 pcs, breadboard 400–830 lubang", qty: 1, price: [25000, 60000], group: "inti" };

export const KITS: Record<string, Kit> = {
  drone: {
    summary:
      "Quadcopter 5 inci bertenaga baterai 4S. Jalur utama memakai flight controller F405 dengan firmware terbuka (ArduPilot atau INAV) supaya kamu bisa menala PID, membaca log, dan memakai mode tahan ketinggian. Jalur lanjutan (opsional): rig uji satu sumbu dengan ESP32 untuk menulis PID sendiri sebelum menyentuh drone utuh.",
    parts: [
      { item: "Rangka (frame) 5 inci", spec: "Serat karbon, jarak sumbu motor 220–250 mm, lengan ≥ 4 mm", qty: 1, price: [200000, 450000], group: "inti" },
      { item: "Motor brushless", spec: "Ukuran 2207 atau 2306, 2300–2550 KV untuk baterai 4S", qty: 4, price: [120000, 300000], group: "inti", note: "Beli 4 yang sama merek dan KV-nya; lebih baik 5 untuk cadangan." },
      { item: "Stack flight controller + ESC 4-in-1", spec: "FC STM32 F405 dengan gyro, barometer, slot microSD/flash untuk log; ESC 4-in-1 40–55 A, firmware BLHeli_S/AM32/BLHeli_32", qty: 1, price: [900000, 1800000], group: "inti", note: "Pastikan FC terdaftar mendukung ArduPilot atau INAV bila ingin mode tahan ketinggian." },
      { item: "Baling-baling 5 inci", spec: "5043 atau 5045, tiga daun, satu set = 2 CW + 2 CCW", qty: 4, price: [25000, 60000], group: "inti", note: "Baling-baling paling sering patah; stok minimal 4 set." },
      { item: "Baterai LiPo 4S", spec: "1300–1500 mAh, 75–120C, konektor XT60", qty: 2, price: [350000, 650000], group: "inti", note: "Dua baterai: satu terbang, satu diisi." },
      { item: "Pengisi daya balance LiPo", spec: "Mendukung 1–6S, minimal 50 W, plus adaptor DC 12–24 V", qty: 1, price: [450000, 1200000], group: "inti", note: "Jangan pernah mengisi LiPo dengan pengisi biasa." },
      { item: "Remote control (pemancar) ELRS 2,4 GHz", spec: "Mode 2, protokol ExpressLRS, minimal 8 kanal", qty: 1, price: [900000, 2500000], group: "inti", note: "Bisa dipakai lagi untuk drone dan robot berikutnya." },
      { item: "Penerima (receiver) ELRS 2,4 GHz", spec: "Seri EP1/EP2 atau setara, cocok dengan pemancar", qty: 1, price: [120000, 250000], group: "inti" },
      { item: "Kapasitor low-ESR", spec: "35 V, 1000 µF, dipasang di pad baterai ESC", qty: 1, price: [5000, 15000], group: "inti", note: "Meredam lonjakan tegangan yang bisa merusak ESC." },
      { item: "Kabel konektor XT60 (pigtail)", spec: "XT60 betina dengan kabel silikon 12–14 AWG", qty: 1, price: [20000, 50000], group: "inti" },
      { item: "Tali pengikat baterai dan pad karet", spec: "Strap 20 × 250 mm anti-selip", qty: 2, price: [15000, 40000], group: "inti" },
      { item: "Smoke stopper XT60", spec: "Pembatas arus untuk menyalakan pertama kali", qty: 1, price: [50000, 120000], group: "inti", note: "Mencegah komponen terbakar bila ada solderan yang korsleting." },
      { item: "Kantong LiPo tahan api", spec: "Ukuran cukup untuk 2–4 baterai", qty: 1, price: [50000, 150000], group: "inti" },
      { item: "Baut M3/M2 cadangan dan threadlocker biru", spec: "Baut M3 6–12 mm, mur nyloc, threadlocker kekuatan sedang", qty: 1, price: [30000, 80000], group: "habis" },
      TIMAH,
      SUSUT,
      SOLDER,
      MULTIMETER,
      OBENG,
      TANG,
      { item: "Kunci baling-baling", spec: "Kunci sok 8 mm untuk mur M5 baling-baling", qty: 1, price: [15000, 40000], group: "alat" },
      { item: "Modul GPS M10 dengan kompas", spec: "UART, kompatibel ArduPilot/INAV", qty: 1, price: [250000, 500000], group: "opsional", note: "Untuk tahan posisi dan pulang otomatis." },
      { item: "Simulator terbang di laptop", spec: "Liftoff, Velocidrone, atau sejenis; colok pemancar lewat USB", qty: 1, price: [100000, 300000], group: "opsional", note: "Melatih jempol tanpa mematahkan baling-baling." },
      { item: "Rig uji satu sumbu (jalur firmware sendiri)", spec: "ESP32, IMU MPU-6050, 2 motor + ESC tunggal, batang kayu berengsel", qty: 1, price: [350000, 700000], group: "opsional", note: "Untuk menulis dan menala PID sendiri dengan aman, ditambat di meja." },
      { item: "Kamera FPV, pemancar video, dan kacamata FPV", spec: "Analog atau digital", qty: 1, price: [1500000, 6000000], group: "opsional", note: "Tidak wajib untuk belajar kendali." },
    ],
    build: [
      { t: "Periksa semua komponen", d: "Cocokkan dengan daftar belanja. Colok FC ke laptop lewat USB sebelum disolder: pasang firmware (ArduPilot lewat Mission Planner, atau INAV Configurator) dan pastikan gyro bergerak saat papan dimiringkan." },
      { t: "Rakit rangka", d: "Pasang lengan, pelat bawah, dan standoff. Kencangkan baut lengan, beri threadlocker pada baut logam ke logam." },
      { t: "Pasang motor", d: "Empat motor di ujung lengan, kabel mengarah ke tengah. Pastikan baut motor tidak terlalu panjang hingga menyentuh gulungan kawat di dalam motor.", warn: "Baut yang menyentuh gulungan membuat motor korsleting dan terbakar." },
      { t: "Solder kabel motor ke ESC", d: "Potong kabel motor secukupnya, timah ujung kabel dan pad, lalu solder. Urutan tiga kabel tidak penting; arah putar diatur nanti di perangkat lunak." },
      { t: "Solder konektor baterai dan kapasitor", d: "XT60 ke pad baterai ESC (merah ke +, hitam ke −), kapasitor 1000 µF di pad yang sama dengan kaki panjang ke +. Ukur dengan multimeter: tidak boleh ada sambungan antara + dan −.", warn: "Terbalik kutub di sini merusak ESC dan FC seketika." },
      { t: "Pasang FC di atas ESC", d: "Pakai grommet karet peredam getaran. Panah di FC menghadap depan rangka. Sambungkan kabel ESC–FC bawaan stack." },
      { t: "Pasang dan pasangkan receiver", d: "Solder receiver ke UART di FC (TX ke RX, RX ke TX, 5 V, GND). Ikat (bind) receiver dengan pemancar ELRS memakai frasa bind yang sama." },
      { t: "Nyalakan pertama kali lewat smoke stopper", d: "Tanpa baling-baling. Colok baterai lewat smoke stopper. Jika lampu smoke stopper menyala terang terus, cabut segera dan cari korsleting.", warn: "Selalu lepas baling-baling selama tahap 8 sampai 10." },
      { t: "Konfigurasi di perangkat lunak", d: "Atur orientasi papan, kalibrasi akselerometer dan kompas, peta kanal pemancar, saklar arming, mode Stabilize/Angle dan AltHold, serta failsafe saat sinyal hilang." },
      { t: "Cek urutan dan arah putar motor", d: "Di tab motor, putar satu per satu dengan gas rendah. Cocokkan urutan dan arah dengan diagram firmware; balik arah di konfigurator ESC bila salah." },
      { t: "Pasang baling-baling", d: "Baling-baling CW di motor CW, CCW di motor CCW, sisi bertulisan menghadap atas. Kencangkan mur dengan kunci." },
      { t: "Terbang uji pertama", d: "Di lapangan rumput yang luas, jauh dari orang. Terbang rendah 1–2 m dalam mode Angle/Stabilize selama 30 detik, mendarat, lalu raba suhu motor. Motor panas berarti getaran atau PID terlalu tinggi.", warn: "Patuhi aturan drone Kementerian Perhubungan: jangan dekat bandara, jangan di atas keramaian, dan tetap dalam jarak pandang." },
      { t: "Rekam log dan tala PID", d: "Aktifkan log (dataflash/blackbox). Tala ketinggian dan sikap satu sumbu per sesi, lalu analisis log dengan Python seperti di tahap proyek." },
    ],
    tips: [
      "Beli stack FC + ESC dari merek yang sama supaya kabel dan pinout cocok tanpa solder tambahan.",
      "Cek di daftar perangkat yang didukung ArduPilot atau INAV sebelum membeli FC; tidak semua FC murah didukung.",
      "Toko hobi RC biasanya lebih paham kecocokan komponen daripada toko elektronik umum. Tanyakan sebelum membeli.",
      "Hemat di kamera FPV (opsional), jangan hemat di pengisi daya LiPo, smoke stopper, dan kantong tahan api.",
      "Harga di daftar ini perkiraan pasar Indonesia untuk komponen hobi; cek ulang di toko karena kurs dan stok cepat berubah.",
    ],
  },

  "line-follower": {
    summary: "Robot dua roda di atas sasis akrilik, digerakkan Arduino, dengan lima sensor inframerah untuk membaca garis hitam.",
    parts: [
      { item: "Arduino Nano atau Uno R3 (klon)", spec: "ATmega328P, kabel USB", qty: 1, price: [45000, 150000], group: "inti" },
      { item: "Sensor garis 5 kanal", spec: "Modul TCRT5000 lima kanal, keluaran analog", qty: 1, price: [25000, 70000], group: "inti" },
      { item: "Driver motor TB6612FNG", spec: "Dua kanal, 1,2 A per kanal", qty: 1, price: [25000, 60000], group: "inti", note: "Lebih efisien daripada L298N untuk baterai 7,4 V." },
      { item: "Kit sasis 2WD", spec: "Pelat akrilik, 2 motor gearbox kuning (TT), 2 roda, 1 roda bebas, baut", qty: 1, price: [60000, 130000], group: "inti" },
      { item: "Baterai Li-ion 18650", spec: "Merek tepercaya, ≥ 2000 mAh", qty: 2, price: [25000, 60000], group: "inti" },
      { item: "Dudukan 2 × 18650 dengan saklar", spec: "Keluaran 7,4 V", qty: 1, price: [10000, 25000], group: "inti" },
      { item: "Pengisi baterai 18650", spec: "Pengisi dua slot atau modul TP4056 dengan proteksi", qty: 1, price: [25000, 80000], group: "inti" },
      JUMPER,
      { item: "Lintasan uji", spec: "Karton putih A0 atau lantai terang + lakban hitam 19 mm", qty: 1, price: [20000, 50000], group: "habis" },
      TIMAH,
      SUSUT,
      SOLDER,
      MULTIMETER,
      OBENG,
      { item: "Motor N20 600 rpm dengan encoder", spec: "Sepasang, untuk versi cepat", qty: 1, price: [80000, 180000], group: "opsional" },
      { item: "Sensor garis 8 kanal (QTR-8A atau setara)", spec: "Resolusi posisi lebih halus", qty: 1, price: [60000, 150000], group: "opsional" },
    ],
    build: [
      { t: "Rakit sasis", d: "Pasang motor, roda, dan roda bebas ke pelat akrilik. Solder kabel ke terminal motor bila belum ada." },
      { t: "Pasang sensor", d: "Sensor di depan, 3–8 mm di atas lantai, tegak lurus arah gerak." },
      { t: "Sambungkan driver motor", d: "TB6612: PWMA/PWMB ke pin PWM Arduino, AIN/BIN ke pin digital, VM ke baterai, VCC ke 5 V, STBY ke 5 V, semua GND disatukan." },
      { t: "Sambungkan sensor", d: "Lima keluaran analog ke A0–A4, VCC ke 5 V, GND ke GND." },
      { t: "Uji per bagian", d: "Unggah program uji: cetak nilai sensor ke Serial di atas putih dan hitam, lalu putar tiap motor maju-mundur. Tukar kabel motor bila arahnya terbalik." },
      { t: "Kalibrasi", d: "Catat nilai minimum (putih) dan maksimum (hitam) tiap sensor, lalu normalkan ke 0–1000." },
      { t: "Pasang baterai dan uji jalan", d: "Mulai dengan kecepatan rendah dan Kp kecil di lintasan lurus." },
      { t: "Tala dan catat", d: "Ikuti tahap proyek: tambah D, uji tikungan, catat waktu putaran tiap konfigurasi." },
    ],
    tips: [
      "Kit sasis 2WD biasanya sudah termasuk motor dan roda; cek isi paket sebelum membeli terpisah.",
      "Hindari menyuplai motor dari pin 5 V Arduino; motor harus mengambil daya langsung dari baterai lewat driver.",
      "Harga perkiraan pasar Indonesia; komponen ini banyak tersedia di toko elektronik daring.",
    ],
  },

  "stasiun-cuaca": {
    summary: "ESP32 dengan sensor suhu, kelembapan, dan tekanan BME280 di dalam kotak berventilasi, mengirim data lewat Wi-Fi ke dasbor.",
    parts: [
      { item: "ESP32 DevKit V1", spec: "Wi-Fi + Bluetooth, USB", qty: 1, price: [60000, 120000], group: "inti" },
      { item: "Sensor BME280", spec: "Suhu, kelembapan, tekanan; I2C", qty: 1, price: [45000, 90000], group: "inti", note: "Banyak modul BMP280 dijual sebagai BME280. BMP280 tidak mengukur kelembapan; cek ID sensor setelah tiba." },
      { item: "Kotak tahan air IP65 kecil", spec: "± 10 × 7 × 5 cm, untuk ESP32", qty: 1, price: [25000, 60000], group: "inti" },
      { item: "Pelindung radiasi (radiation shield)", spec: "Tumpukan piring plastik putih yang diberi celah, atau beli jadi", qty: 1, price: [20000, 120000], group: "inti", note: "Sensor yang kena sinar matahari langsung membaca suhu terlalu tinggi." },
      { item: "Adaptor 5 V 2 A dan kabel USB panjang", spec: "Kabel 3–5 m", qty: 1, price: [30000, 70000], group: "inti" },
      { item: "PCB lubang dan header", spec: "Untuk sambungan permanen", qty: 1, price: [10000, 25000], group: "inti" },
      TIMAH,
      SUSUT,
      { item: "Lem tembak atau silikon", spec: "Menutup lubang kabel kotak", qty: 1, price: [15000, 40000], group: "habis" },
      SOLDER,
      MULTIMETER,
      OBENG,
      { item: "Panel surya 6 V 2 W + TP4056 + baterai 18650", spec: "Untuk lokasi tanpa listrik", qty: 1, price: [80000, 180000], group: "opsional" },
      { item: "Penakar hujan tipping bucket", spec: "Keluaran saklar reed", qty: 1, price: [150000, 350000], group: "opsional" },
      { item: "Layar OLED 0,96 inci", spec: "I2C, tampilan lokal", qty: 1, price: [25000, 45000], group: "opsional" },
    ],
    build: [
      { t: "Uji di breadboard", d: "BME280 ke ESP32 lewat I2C (SDA GPIO21, SCL GPIO22, 3,3 V, GND). Jalankan contoh pustaka dan pastikan ketiga besaran terbaca." },
      { t: "Cek sensor asli", d: "Baca ID chip: 0x60 berarti BME280, 0x58 berarti BMP280 tanpa kelembapan." },
      { t: "Kirim data", d: "Sambungkan ke Wi-Fi, publikasikan JSON ke MQTT setiap menit. Uji ulang sambung otomatis saat Wi-Fi diputus." },
      { t: "Solder permanen", d: "Pindahkan rangkaian ke PCB lubang, kabel sensor 20–50 cm agar sensor bisa di luar kotak elektronik." },
      { t: "Rakit pelindung radiasi", d: "Sensor di dalam tumpukan piring berventilasi, kotak ESP32 terpisah dan tertutup rapat." },
      { t: "Pasang di luar", d: "1,2–2 m di atas tanah, di tempat teduh berangin, jauh dari dinding yang memantulkan panas." },
      { t: "Rekam seminggu", d: "Biarkan berjalan 7 hari, lalu lanjut ke tahap analisis di proyek." },
    ],
    tips: [
      "Beli BME280 dari penjual yang menulis ID chip atau memberi garansi tukar.",
      "Untuk umur baterai, pakai mode deep sleep ESP32 dan kirim data setiap 5–10 menit.",
      "Harga perkiraan pasar Indonesia; cek ulang di toko.",
    ],
  },

  inkubator: {
    summary: "Kotak styrofoam dengan pemanas 12 V, kipas, dan sensor suhu-kelembapan, dikendalikan ESP32 dengan PID lewat MOSFET. Seluruhnya bertegangan rendah 12 V.",
    parts: [
      { item: "ESP32 DevKit atau Arduino Nano", spec: "ESP32 bila ingin notifikasi Wi-Fi", qty: 1, price: [45000, 120000], group: "inti" },
      { item: "Sensor SHT31", spec: "Suhu ±0,3 °C dan kelembapan, I2C", qty: 1, price: [60000, 130000], group: "inti", note: "Alternatif murah DS18B20 tahan air (hanya suhu)." },
      { item: "Modul MOSFET logic-level", spec: "Misalnya D4184 atau IRLZ44N, mampu ≥ 10 A pada gerbang 3,3 V", qty: 1, price: [15000, 40000], group: "inti", note: "Modul IRF520 biasa tidak menyala penuh dengan sinyal 3,3 V." },
      { item: "Pemanas 12 V", spec: "PTC heater 12 V 50–80 W dengan sirip, atau lampu pijar 12 V 25 W", qty: 1, price: [35000, 90000], group: "inti" },
      { item: "Kipas 12 V 8 cm", spec: "Meratakan panas di dalam kotak", qty: 1, price: [15000, 35000], group: "inti" },
      { item: "Adaptor 12 V 5 A", spec: "Lebih besar dari daya pemanas + kipas", qty: 1, price: [70000, 130000], group: "inti" },
      { item: "Kotak styrofoam", spec: "± 40 liter, dinding ≥ 2 cm", qty: 1, price: [30000, 60000], group: "inti" },
      { item: "Rak kawat dan nampan air kecil", spec: "Rak di atas pemanas, nampan untuk kelembapan", qty: 1, price: [20000, 50000], group: "inti" },
      { item: "Termometer digital referensi", spec: "Untuk mengecek sensor", qty: 1, price: [30000, 80000], group: "inti" },
      { item: "Jack DC, terminal sekrup, sekring 5 A", spec: "Sambungan daya yang rapi dan aman", qty: 1, price: [15000, 35000], group: "inti" },
      TIMAH,
      SUSUT,
      SOLDER,
      MULTIMETER,
      { item: "Pisau cutter", spec: "Membuat lubang di styrofoam", qty: 1, price: [10000, 30000], group: "alat" },
      { item: "Layar OLED dan buzzer", spec: "Tampilan suhu dan alarm lokal", qty: 1, price: [30000, 60000], group: "opsional" },
    ],
    build: [
      { t: "Uji sensor", d: "Baca SHT31 di breadboard dan bandingkan dengan termometer referensi selama 10 menit." },
      { t: "Rangkai daya", d: "Adaptor 12 V → sekring → MOSFET → pemanas. Kipas langsung ke 12 V. GND ESP32 disatukan dengan GND 12 V.", warn: "Gunakan hanya pemanas 12 V. Jangan menghubungkan rangkaian ini ke listrik 220 V." },
      { t: "Uji MOSFET", d: "Kirim PWM 25%, 50%, 100%; ukur tegangan di pemanas dengan multimeter." },
      { t: "Rakit kotak", d: "Pemanas dan kipas di bawah rak, sensor di tengah setinggi telur, nampan air di sudut. Lubang kecil untuk kabel." },
      { t: "Ukur respons tangga", d: "Pemanas 100% sampai suhu stabil; catat kurva untuk mencari konstanta waktu." },
      { t: "Pasang pengaman", d: "Matikan pemanas bila suhu > 39,5 °C atau sensor gagal dibaca." },
      { t: "Jalankan PID 24 jam", d: "Lanjut ke tahap penalaan dan evaluasi di proyek, sebelum memasukkan telur." },
    ],
    tips: [
      "Pastikan modul MOSFET logic-level; ini kesalahan beli yang paling sering.",
      "Kalibrasi sensor dengan termometer referensi; selisih 1 °C sudah berpengaruh pada penetasan.",
      "Harga perkiraan pasar Indonesia; cek ulang di toko.",
    ],
  },

  "buck-converter": {
    summary:
      "Desain lengkapnya disimulasikan di laptop (gratis, LTspice atau Python). Daftar ini untuk prototipe kecil 12 V → 5 V berdaya rendah di breadboard, dengan Arduino sebagai pengendali PWM dan PI.",
    parts: [
      { item: "Arduino Nano atau ESP32", spec: "Pembangkit PWM dan pengendali", qty: 1, price: [45000, 120000], group: "inti" },
      { item: "MOSFET kanal-P IRF9540N", spec: "Saklar sisi atas", qty: 2, price: [10000, 20000], group: "inti", note: "Satu cadangan." },
      { item: "Transistor 2N2222 dan paket resistor", spec: "Penggerak gerbang MOSFET dan pembagi tegangan umpan balik", qty: 1, price: [20000, 40000], group: "inti" },
      { item: "Induktor toroid 100 µH", spec: "Arus ≥ 3 A", qty: 1, price: [10000, 30000], group: "inti" },
      { item: "Dioda Schottky SS34 atau 1N5822", spec: "Dioda roda bebas", qty: 2, price: [3000, 10000], group: "inti" },
      { item: "Kapasitor elektrolit 470 µF 25 V", spec: "Masukan dan keluaran", qty: 3, price: [3000, 8000], group: "inti" },
      { item: "Resistor beban 10 Ω 5 W", spec: "Beban uji, dua buah untuk uji lonjakan beban", qty: 2, price: [3000, 8000], group: "inti" },
      { item: "Adaptor 12 V 2 A", spec: "Sumber daya", qty: 1, price: [40000, 80000], group: "inti" },
      JUMPER,
      MULTIMETER,
      SOLDER,
      { item: "Osiloskop mini", spec: "DSO138 kit atau osiloskop genggam, ≥ 200 kHz", qty: 1, price: [250000, 900000], group: "opsional", note: "Untuk melihat riak tegangan dan PWM; tanpa ini kamu masih bisa mengukur rata-rata dengan multimeter." },
      { item: "Modul buck LM2596 jadi", spec: "Pembanding efisiensi", qty: 1, price: [15000, 30000], group: "opsional" },
    ],
    build: [
      { t: "Simulasi dulu", d: "Kerjakan tahap 1–4 proyek di laptop sampai nilai L, C, dan duty cycle masuk akal." },
      { t: "Rakit rangkaian daya", d: "MOSFET kanal-P di sisi atas, dioda Schottky ke GND, induktor seri ke keluaran, kapasitor di masukan dan keluaran.", warn: "Perhatikan kutub kapasitor elektrolit; terbalik bisa meletup." },
      { t: "Rakit penggerak gerbang", d: "Pin PWM Arduino → resistor → basis 2N2222; kolektor menarik gerbang MOSFET ke GND, resistor pull-up ke 12 V." },
      { t: "Uji loop terbuka", d: "PWM tetap 40% ke beban 10 Ω; ukur tegangan keluaran dan bandingkan dengan duty × 12 V." },
      { t: "Umpan balik", d: "Pembagi tegangan ke pin analog; jalankan PI digital dengan target 5 V." },
      { t: "Uji lonjakan beban", d: "Tambah beban kedua secara paralel; rekam tegangan keluaran dan bandingkan dengan simulasi." },
    ],
    tips: [
      "Tetap di bawah 24 V DC selama belajar.",
      "Pin PWM Arduino bawaan hanya sekitar 1 kHz; gunakan timer untuk frekuensi puluhan kHz agar induktor kecil cukup.",
      "Harga perkiraan pasar Indonesia; cek ulang di toko.",
    ],
  },

  "bms-ev": {
    summary: "Model laboratorium satu sel 18650: ESP32 mengukur arus dan tegangan, menghitung SoC, dan memantau suhu. Prinsipnya sama dengan BMS kendaraan, tetapi aman di meja belajar.",
    parts: [
      { item: "ESP32 DevKit", spec: "Logger dan pengolah", qty: 1, price: [60000, 120000], group: "inti" },
      { item: "Sensor arus INA219 atau INA226", spec: "I2C, ukur tegangan dan arus", qty: 1, price: [30000, 80000], group: "inti" },
      { item: "Sel Li-ion 18650", spec: "Merek tepercaya dengan data kapasitas jelas", qty: 2, price: [40000, 80000], group: "inti", note: "Sel murah bertuliskan kapasitas tak masuk akal (misal 9900 mAh) hampir pasti palsu." },
      { item: "Dudukan 18650 tunggal", spec: "Dengan kabel", qty: 2, price: [5000, 15000], group: "inti" },
      { item: "Modul pengisi TP4056 dengan proteksi", spec: "Pengisian CC/CV dan proteksi lebih/kurang tegangan", qty: 1, price: [8000, 20000], group: "inti" },
      { item: "Resistor beban 4,7 Ω 10 W", spec: "Arus buang ± 0,8 A", qty: 2, price: [5000, 15000], group: "inti" },
      { item: "Termistor NTC 10 kΩ dan resistor 10 kΩ", spec: "Sensor suhu sel", qty: 2, price: [3000, 8000], group: "inti" },
      JUMPER,
      MULTIMETER,
      SOLDER,
      { item: "Beban elektronik DC", spec: "Arus konstan, untuk uji kapasitas yang rapi", qty: 1, price: [150000, 350000], group: "opsional" },
      { item: "Kotak logam atau kantong LiPo", spec: "Tempat sel saat diuji", qty: 1, price: [50000, 120000], group: "opsional" },
    ],
    build: [
      { t: "Rangkai pengukuran", d: "Sel → INA219 → resistor beban; INA219 ke ESP32 lewat I2C. NTC ditempel ke badan sel dengan selotip kapton." },
      { t: "Uji pembacaan", d: "Bandingkan tegangan INA219 dengan multimeter; selisih harus < 1%." },
      { t: "Isi penuh", d: "Isi sel dengan TP4056 sampai lampu selesai; catat tegangan istirahat setelah 30 menit." },
      { t: "Rekam pengosongan", d: "Buang lewat resistor sampai 3,0 V sambil merekam arus, tegangan, dan suhu setiap detik.", warn: "Jangan buang di bawah 2,8 V dan hentikan bila sel lebih panas dari 50 °C." },
      { t: "Hitung kapasitas", d: "Integralkan arus terhadap waktu: itulah kapasitas nyata sel." },
      { t: "Bandingkan estimator", d: "Lanjut ke tahap proyek: coulomb counting vs koreksi tegangan." },
    ],
    tips: [
      "Beli sel 18650 dari penjual yang menyebut merek dan seri selnya.",
      "Jangan membongkar paket baterai motor atau sepeda listrik untuk proyek ini.",
      "Harga perkiraan pasar Indonesia; cek ulang di toko.",
    ],
  },

  "plts-atap": {
    summary:
      "Desain PLTS atap cukup dikerjakan dengan laptop dan data radiasi gratis. Kit di bawah opsional tapi disarankan: sistem mini 20 Wp agar angka hitunganmu bisa diukur langsung.",
    parts: [
      { item: "Panel surya 20 Wp", spec: "Monokristalin, 18 V Vmp", qty: 1, price: [150000, 300000], group: "inti" },
      { item: "Solar charge controller PWM 10 A", spec: "12 V, dengan keluaran beban", qty: 1, price: [60000, 150000], group: "inti" },
      { item: "Aki VRLA 12 V 7 Ah", spec: "Kering, bebas perawatan", qty: 1, price: [150000, 250000], group: "inti" },
      { item: "Lampu LED 12 V 5 W", spec: "Beban uji malam hari", qty: 1, price: [15000, 30000], group: "inti" },
      { item: "ESP32 + sensor INA219", spec: "Merekam daya panel setiap menit", qty: 1, price: [90000, 200000], group: "inti" },
      { item: "Kabel 1,5 mm², sekring inline 10 A, terminal", spec: "Sambungan panel–controller–aki", qty: 1, price: [40000, 80000], group: "inti" },
      MULTIMETER,
      OBENG,
      TANG,
      { item: "Busur derajat atau aplikasi kemiringan", spec: "Mengatur sudut panel", qty: 1, price: [0, 20000], group: "opsional" },
    ],
    build: [
      { t: "Pasang controller dulu ke aki", d: "Urutan wajib: aki ke controller lebih dulu, baru panel, baru beban.", warn: "Memasang panel sebelum aki bisa merusak controller PWM." },
      { t: "Pasang panel", d: "Hadapkan ke utara (untuk lokasi di selatan khatulistiwa) atau sesuai hitunganmu, dengan kemiringan kecil 10–15° agar air hujan mengalir." },
      { t: "Pasang logger", d: "INA219 di jalur panel → controller; rekam tegangan dan arus setiap menit." },
      { t: "Rekam seminggu", d: "Bandingkan energi harian terukur (luas di bawah kurva daya) dengan hitungan jam puncak matahari." },
      { t: "Skalakan ke rumah", d: "Kalikan temuanmu ke ukuran kWp rumah dan perbarui hitungan ekonomi di tahap proyek." },
    ],
    tips: [
      "Untuk PLTS rumah sungguhan, minta survei dan pemasangan dari instalatur bersertifikat; pekerjaan atap dan jaringan PLN bukan proyek belajar.",
      "Harga perkiraan pasar Indonesia; cek ulang di toko.",
    ],
  },

  "braket-rak": {
    summary: "Braket L dari pelat atau besi siku untuk rak 80 cm, dirancang di FreeCAD, dibuat dengan alat tangan, lalu diuji beban bertahap.",
    parts: [
      { item: "Pelat aluminium 3 mm atau besi siku 40 × 40 × 3", spec: "Cukup untuk dua braket", qty: 1, price: [60000, 150000], group: "inti" },
      { item: "Dynabolt atau fischer M6 dengan sekrup", spec: "Sesuai jenis dinding (bata/beton)", qty: 4, price: [5000, 15000], group: "inti" },
      { item: "Papan multipleks 18 mm", spec: "80 × 25 cm", qty: 1, price: [50000, 120000], group: "inti" },
      { item: "Baut dan mur M5 untuk braket–papan", spec: "Panjang 20–25 mm", qty: 4, price: [2000, 5000], group: "inti" },
      { item: "Beban uji", spec: "Karung pasir atau galon berisi air, dengan berat diketahui", qty: 1, price: [0, 30000], group: "habis" },
      { item: "Bor listrik dengan mata bor beton dan besi", spec: "Atau pinjam dari tetangga/bengkel", qty: 1, price: [250000, 700000], group: "alat" },
      { item: "Gergaji besi, kikir, ragum kecil", spec: "Memotong dan merapikan pelat", qty: 1, price: [80000, 250000], group: "alat" },
      { item: "Meteran, waterpass, penggaris siku", spec: "Ukur dan tandai", qty: 1, price: [40000, 120000], group: "alat" },
      { item: "Timbangan gantung digital 50 kg", spec: "Mengukur beban uji", qty: 1, price: [40000, 100000], group: "alat" },
      { item: "Kacamata pelindung dan sarung tangan", spec: "Saat memotong dan mengebor", qty: 1, price: [30000, 80000], group: "alat" },
    ],
    build: [
      { t: "Gambar dan hitung", d: "Selesaikan tahap 1–4 proyek; tentukan tebal pelat dan posisi baut." },
      { t: "Potong dan bor braket", d: "Tandai, potong, kikir tepi tajam, lalu bor lubang baut.", warn: "Pakai kacamata pelindung; serpihan logam berbahaya bagi mata." },
      { t: "Pasang di dinding", d: "Cek kabel dan pipa di dalam dinding sebelum mengebor. Gunakan waterpass." },
      { t: "Uji beban bertahap", d: "Tambah beban 10, 20, 30, 40 kg; ukur lendutan ujung rak dengan penggaris di tiap tahap.", warn: "Jangan berdiri atau meletakkan tangan di bawah rak saat uji beban." },
      { t: "Bandingkan dengan perhitungan", d: "Plot lendutan terhadap beban; apakah masih linear seperti hukum Hooke?" },
    ],
    tips: ["Toko besi lokal biasanya mau memotong pelat sesuai ukuran dengan biaya kecil.", "Harga perkiraan pasar Indonesia; cek ulang di toko."],
  },

  "ukur-g": {
    summary: "Eksperimen meja yang murah: tali, beban, dan ponsel sebagai pengukur waktu.",
    parts: [
      { item: "Tali nilon tidak elastis", spec: "Panjang 3 m", qty: 1, price: [5000, 15000], group: "inti" },
      { item: "Beban bandul", spec: "Mur besar atau pemberat pancing 100–200 g", qty: 1, price: [10000, 30000], group: "inti" },
      { item: "Penyangga", spec: "Paku di kusen pintu, atau klem meja + batang", qty: 1, price: [0, 50000], group: "inti" },
      { item: "Meteran 3 m dan busur derajat", spec: "Ukur panjang dan simpangan", qty: 1, price: [20000, 50000], group: "inti" },
      { item: "Aplikasi phyphox di ponsel", spec: "Gratis; stopwatch akustik atau sensor gerak", qty: 1, price: [0, 0], group: "inti" },
    ],
    build: [
      { t: "Pasang bandul", d: "Ikat beban, ukur panjang dari titik gantung ke pusat beban." },
      { t: "Uji simpangan kecil", d: "Simpangkan ≤ 10°, lepaskan tanpa dorongan, ukur waktu 10 ayunan." },
      { t: "Ulangi 6 panjang × 5 kali", d: "Catat di tabel; ganti panjang dari ± 0,3 m sampai 2 m." },
      { t: "Analisis", d: "Lanjut ke tahap linearisasi dan regresi di proyek." },
    ],
    tips: ["Proyek ini hampir gratis; pakai yang ada di rumah dulu."],
  },

  "spektrum-audio": {
    summary: "Versi utama cukup laptop dan mikrofon. Versi lanjutan memindahkan analisis ke ESP32 dengan mikrofon digital.",
    parts: [
      { item: "Mikrofon", spec: "Mikrofon bawaan laptop, headset, atau mikrofon USB", qty: 1, price: [0, 200000], group: "inti" },
      { item: "Sumber bunyi uji", spec: "Gitar, garpu tala, atau aplikasi pembangkit nada", qty: 1, price: [0, 50000], group: "inti" },
      { item: "ESP32 + mikrofon I2S INMP441", spec: "Untuk versi perangkat mandiri", qty: 1, price: [80000, 170000], group: "opsional" },
      { item: "Layar OLED 0,96 inci", spec: "Menampilkan batang spektrum di ESP32", qty: 1, price: [25000, 45000], group: "opsional" },
    ],
    build: [
      { t: "Cek mikrofon", d: "Rekam 5 detik dan dengarkan ulang; pastikan tidak terpotong (clipping)." },
      { t: "Uji dengan nada murni", d: "Putar nada 440 Hz dari ponsel; puncak spektrum harus tepat di 440 Hz." },
      { t: "Versi ESP32 (opsional)", d: "INMP441 ke pin I2S, cuplik 16 kHz, FFT 1024 titik di perangkat." },
    ],
    tips: ["Mulai dengan laptop; beli ESP32 hanya bila versi laptop sudah jalan."],
  },
};

for (const [id, kit] of Object.entries(KITS)) {
  if (!getProject(id)) throw new Error(`Daftar belanja untuk proyek yang tidak ada: ${id}`);
  for (const part of kit.parts) {
    if (part.qty < 1) throw new Error(`Jumlah tidak valid di ${id}: ${part.item}`);
    if (part.price[0] > part.price[1]) throw new Error(`Rentang harga terbalik di ${id}: ${part.item}`);
  }
}

export function kitOf(projectId: string): Kit | undefined {
  return KITS[projectId];
}

/** Total perkiraan [min, max] untuk kelompok tertentu, tanpa bagian yang sudah dimiliki. */
export function kitTotal(kit: Kit, groups: PartGroup[], owned: Set<number> = new Set()): [number, number] {
  return kit.parts.reduce<[number, number]>(
    (sum, part, index) =>
      groups.includes(part.group) && !owned.has(index) ? [sum[0] + part.price[0] * part.qty, sum[1] + part.price[1] * part.qty] : sum,
    [0, 0],
  );
}

/** Rupiah ringkas: Rp950 rb, Rp4,2 jt. */
export function rupiahShort(n: number): string {
  if (n === 0) return "Rp0";
  if (n >= 1_000_000) return `Rp${(Math.round(n / 100_000) / 10).toLocaleString("id-ID")} jt`;
  return `Rp${Math.round(n / 1000).toLocaleString("id-ID")} rb`;
}

export function rupiahRange([min, max]: [number, number]): string {
  if (min === max) return rupiahShort(min);
  return `${rupiahShort(min)} – ${rupiahShort(max)}`;
}

/** Daftar belanja sebagai teks polos, untuk disalin ke catatan atau dikirim ke toko. */
export function kitAsText(title: string, kit: Kit, owned: Set<number> = new Set()): string {
  const lines = [`Daftar belanja: ${title}`, ""];
  for (const group of ["inti", "habis", "alat", "opsional"] as PartGroup[]) {
    const rows = kit.parts.map((part, index) => ({ part, index })).filter(({ part }) => part.group === group);
    if (!rows.length) continue;
    lines.push(`${GROUP_LABEL[group].title}:`);
    for (const { part, index } of rows) {
      const mark = owned.has(index) ? "[sudah ada]" : "[ ]";
      lines.push(`${mark} ${part.qty} × ${part.item} — ${part.spec} (${rupiahRange(part.price)} / satuan)`);
    }
    lines.push("");
  }
  const left = kitTotal(kit, ["inti", "habis", "alat"], owned);
  lines.push(`Perkiraan sisa belanja (tanpa opsional): ${rupiahRange(left)}`);
  lines.push("Harga perkiraan; cek ulang di toko.");
  return lines.join("\n");
}
