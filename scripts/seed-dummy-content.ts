import "dotenv/config";
import { db } from "../src/db";
import { posts, photos, citySets } from "../src/db/schema";
import { eq } from "drizzle-orm";

interface DummyPhotoItem {
  idKey: string;
  url: string;
  title: string;
  description: string;
  isFavorite: boolean;
  aspectRatio: number;
  width: number;
  height: number;
  blurData: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  district: string;
  fullAddress: string;
  placeFormatted: string;
  make: string;
  model: string;
  lensModel: string;
  focalLength: number;
  focalLength35mm: number;
  fNumber: number;
  iso: number;
  exposureTime: number;
  exposureCompensation: number;
  latitude: number;
  longitude: number;
  gpsAltitude: number;
  dateTimeOriginal: Date;
}

const DUMMY_PHOTOS: DummyPhotoItem[] = [
  // --- SURAKARTA (SOLO) ---
  {
    idKey: "solo-1",
    url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&q=80",
    title: "Sudut Tenang Kraton Surakarta",
    description: "Cahaya pagi menembus pelataran keraton, menangkap detail ukiran kayu klasik dan ketenangan budaya Jawa.",
    isFavorite: true,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "LEHLh[WB2yk8pyoJadR*.7kCMdnj",
    country: "Indonesia",
    countryCode: "ID",
    region: "Jawa Tengah",
    city: "Surakarta",
    district: "Pasar Kliwon",
    fullAddress: "Kraton Surakarta Hadiningrat, Pasar Kliwon, Surakarta, Jawa Tengah, Indonesia",
    placeFormatted: "Surakarta, Jawa Tengah, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 28,
    focalLength35mm: 42,
    fNumber: 2.8,
    iso: 100,
    exposureTime: 0.002, // 1/500s
    exposureCompensation: 0,
    latitude: -7.5755,
    longitude: 110.8282,
    gpsAltitude: 105,
    dateTimeOriginal: new Date("2024-06-12T06:45:00Z"),
  },
  {
    idKey: "solo-2",
    url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&q=80",
    title: "Dinamika Fajar di Pasar Gede",
    description: "Aktivitas pedagang lokal dan aroma rempah tradisional yang menyatu di bawah atap arsitektur Thomas Karsten.",
    isFavorite: true,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    country: "Indonesia",
    countryCode: "ID",
    region: "Jawa Tengah",
    city: "Surakarta",
    district: "Jebres",
    fullAddress: "Pasar Gede Hardjonagoro, Jebres, Surakarta, Jawa Tengah, Indonesia",
    placeFormatted: "Surakarta, Jawa Tengah, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 35,
    focalLength35mm: 52,
    fNumber: 2.8,
    iso: 400,
    exposureTime: 0.004, // 1/250s
    exposureCompensation: -0.3,
    latitude: -7.5683,
    longitude: 110.8327,
    gpsAltitude: 98,
    dateTimeOriginal: new Date("2024-07-20T05:30:00Z"),
  },
  {
    idKey: "solo-3",
    url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1600&q=80",
    title: "Garis Rel Stasiun Solo Balapan",
    description: "Perspektif geometris jalur perlintasan kereta saat matahari sore menyinari gerbong dan kanopi peron.",
    isFavorite: false,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "L9AB*e~q00_3009F-;_300_3~q%M",
    country: "Indonesia",
    countryCode: "ID",
    region: "Jawa Tengah",
    city: "Surakarta",
    district: "Banjarsari",
    fullAddress: "Stasiun Solo Balapan, Banjarsari, Surakarta, Jawa Tengah, Indonesia",
    placeFormatted: "Surakarta, Jawa Tengah, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 50,
    focalLength35mm: 75,
    fNumber: 4.0,
    iso: 160,
    exposureTime: 0.00125, // 1/800s
    exposureCompensation: 0,
    latitude: -7.5583,
    longitude: 110.8208,
    gpsAltitude: 112,
    dateTimeOriginal: new Date("2024-08-05T16:15:00Z"),
  },

  // --- YOGYAKARTA ---
  {
    idKey: "jogja-1",
    url: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1600&q=80",
    title: "Pendar Lampu Jalan Malioboro",
    description: "Suasana malam legendaris di jantung Yogyakarta: siluet pejalan kaki di antara deretan lampu antik khas kota pelajar.",
    isFavorite: true,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "L5H2EC=PM+yV0g-mq.wG9c0100Iu",
    country: "Indonesia",
    countryCode: "ID",
    region: "DI Yogyakarta",
    city: "Yogyakarta",
    district: "Danurejan",
    fullAddress: "Jl. Malioboro, Danurejan, Kota Yogyakarta, DI Yogyakarta, Indonesia",
    placeFormatted: "Yogyakarta, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 24,
    focalLength35mm: 36,
    fNumber: 2.8,
    iso: 800,
    exposureTime: 0.02, // 1/50s
    exposureCompensation: 0,
    latitude: -7.7928,
    longitude: 110.3658,
    gpsAltitude: 115,
    dateTimeOriginal: new Date("2024-09-14T20:10:00Z"),
  },
  {
    idKey: "jogja-2",
    url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80",
    title: "Lanskap Prambanan Golden Hour",
    description: "Sudut pandang drone menangkap keagungan siluet candi Hindu termegah di Indonesia saat matahari terbenam.",
    isFavorite: true,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "LGF5?xYk^6#M@-5c,1J5@[5Qw{V@",
    country: "Indonesia",
    countryCode: "ID",
    region: "DI Yogyakarta",
    city: "Yogyakarta",
    district: "Prambanan",
    fullAddress: "Kompleks Candi Prambanan, Sleman / Klaten, DI Yogyakarta, Indonesia",
    placeFormatted: "Yogyakarta, Indonesia",
    make: "DJI",
    model: "FC3582",
    lensModel: "24mm F1.7",
    focalLength: 6.72,
    focalLength35mm: 24,
    fNumber: 1.7,
    iso: 100,
    exposureTime: 0.001, // 1/1000s
    exposureCompensation: -0.7,
    latitude: -7.752,
    longitude: 110.4914,
    gpsAltitude: 185,
    dateTimeOriginal: new Date("2024-09-15T17:25:00Z"),
  },
  {
    idKey: "jogja-3",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=80",
    title: "Refleksi Aspal Tugu Pal Putih",
    description: "Pantulan cahaya rambu dan lampu kota di atas permukaan jalan basah seusai hujan lebat mengguyur area Tugu.",
    isFavorite: false,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "L56kXN00%Mof?bM{WBj[00%M_3of",
    country: "Indonesia",
    countryCode: "ID",
    region: "DI Yogyakarta",
    city: "Yogyakarta",
    district: "Jetis",
    fullAddress: "Tugu Pal Putih, Jetis, Kota Yogyakarta, DI Yogyakarta, Indonesia",
    placeFormatted: "Yogyakarta, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 30,
    focalLength35mm: 45,
    fNumber: 2.8,
    iso: 640,
    exposureTime: 0.016, // 1/60s
    exposureCompensation: 0,
    latitude: -7.7829,
    longitude: 110.3671,
    gpsAltitude: 120,
    dateTimeOriginal: new Date("2024-10-02T21:40:00Z"),
  },

  // --- SEMARANG ---
  {
    idKey: "smg-1",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&q=80",
    title: "Fasad Kolonial Kota Lama",
    description: "Tekstur bata merah dan jendela melengkung khas abad ke-19 yang terawat apik di kawasan cagar budaya Kota Lama.",
    isFavorite: true,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "LBCY*o00_3_300_3_3_300_3_3_3",
    country: "Indonesia",
    countryCode: "ID",
    region: "Jawa Tengah",
    city: "Semarang",
    district: "Semarang Utara",
    fullAddress: "Kawasan Kota Lama, Semarang Utara, Kota Semarang, Jawa Tengah, Indonesia",
    placeFormatted: "Semarang, Jawa Tengah, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 18,
    focalLength35mm: 27,
    fNumber: 5.6,
    iso: 100,
    exposureTime: 0.0025, // 1/400s
    exposureCompensation: 0,
    latitude: -6.968,
    longitude: 110.4278,
    gpsAltitude: 8,
    dateTimeOriginal: new Date("2024-11-08T09:30:00Z"),
  },
  {
    idKey: "smg-2",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80",
    title: "Lorong Simetris Lawang Sewu",
    description: "Permainan cahaya dan bayangan di sepanjang koridor berpintu ganda yang membentuk ritme visual repetitif dan elegan.",
    isFavorite: false,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
    country: "Indonesia",
    countryCode: "ID",
    region: "Jawa Tengah",
    city: "Semarang",
    district: "Semarang Tengah",
    fullAddress: "Lawang Sewu, Jl. Pemuda, Semarang Tengah, Kota Semarang, Jawa Tengah, Indonesia",
    placeFormatted: "Semarang, Jawa Tengah, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 20,
    focalLength35mm: 30,
    fNumber: 3.5,
    iso: 250,
    exposureTime: 0.008, // 1/125s
    exposureCompensation: -0.3,
    latitude: -6.984,
    longitude: 110.4103,
    gpsAltitude: 12,
    dateTimeOriginal: new Date("2024-11-09T14:15:00Z"),
  },

  // --- JAKARTA ---
  {
    idKey: "jkt-1",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
    title: "Geometri Baja dan Kaca SCBD",
    description: "Gedung pencakar langit modern Sudirman Central Business District yang memotong cakrawala metropolitan Jakarta.",
    isFavorite: true,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "L88|h*V@00_300j[~q_300%M_3j[",
    country: "Indonesia",
    countryCode: "ID",
    region: "DKI Jakarta",
    city: "Jakarta",
    district: "Kebayoran Baru",
    fullAddress: "SCBD Sudirman, Kebayoran Baru, Jakarta Selatan, DKI Jakarta, Indonesia",
    placeFormatted: "Jakarta, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 18,
    focalLength35mm: 27,
    fNumber: 8.0,
    iso: 100,
    exposureTime: 0.0016, // 1/640s
    exposureCompensation: 0,
    latitude: -6.2238,
    longitude: 106.8097,
    gpsAltitude: 25,
    dateTimeOriginal: new Date("2025-01-18T11:00:00Z"),
  },
  {
    idKey: "jkt-2",
    url: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1600&q=80",
    title: "Jalur Cahaya Bundaran HI",
    description: "Long exposure lalu lintas lingkar Bundaran Hotel Indonesia di jam sibuk malam hari dengan latar monumen selamat datang.",
    isFavorite: true,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "LKA2#o-;00_300xu_3_300%M_3xu",
    country: "Indonesia",
    countryCode: "ID",
    region: "DKI Jakarta",
    city: "Jakarta",
    district: "Menteng",
    fullAddress: "Bundaran Hotel Indonesia, Menteng, Jakarta Pusat, DKI Jakarta, Indonesia",
    placeFormatted: "Jakarta, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 22,
    focalLength35mm: 33,
    fNumber: 11.0,
    iso: 100,
    exposureTime: 4.0, // 4 detik long exposure
    exposureCompensation: 0,
    latitude: -6.195,
    longitude: 106.823,
    gpsAltitude: 18,
    dateTimeOriginal: new Date("2025-01-18T19:30:00Z"),
  },
  {
    idKey: "jkt-3",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80",
    title: "Minimalisme Peron MRT Jakarta",
    description: "Struktur beton halus, pencahayaan linier futuristik, dan ritme komuter urban yang bergerak efisien di bawah tanah.",
    isFavorite: false,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "LDD+3G00~q_300j[~q_300%M_3j[",
    country: "Indonesia",
    countryCode: "ID",
    region: "DKI Jakarta",
    city: "Jakarta",
    district: "Tanah Abang",
    fullAddress: "Stasiun MRT Dukuh Atas BNI, Tanah Abang, Jakarta Pusat, DKI Jakarta, Indonesia",
    placeFormatted: "Jakarta, Indonesia",
    make: "SONY",
    model: "ILCE-6400",
    lensModel: "E 18-50mm F2.8 DC DN | Contemporary 021",
    focalLength: 28,
    focalLength35mm: 42,
    fNumber: 2.8,
    iso: 320,
    exposureTime: 0.01, // 1/100s
    exposureCompensation: 0,
    latitude: -6.2008,
    longitude: 106.8227,
    gpsAltitude: -5,
    dateTimeOriginal: new Date("2025-01-19T08:20:00Z"),
  },

  // --- BALI ---
  {
    idKey: "bali-1",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80",
    title: "Lekuk Karang Nusa Penida",
    description: "Pandangan udara drone FPV meluncur di atas tebing kapur terjal Kelingking dan gradasi biru air laut Samudra Hindia.",
    isFavorite: true,
    aspectRatio: 1.5,
    width: 1920,
    height: 1280,
    blurData: "L66j[+00_3_300_3_3_300_3_3_3",
    country: "Indonesia",
    countryCode: "ID",
    region: "Bali",
    city: "Bali",
    district: "Nusa Penida",
    fullAddress: "Kelingking Beach, Nusa Penida, Klungkung, Bali, Indonesia",
    placeFormatted: "Bali, Indonesia",
    make: "DJI",
    model: "FC3582",
    lensModel: "24mm F1.7",
    focalLength: 6.72,
    focalLength35mm: 24,
    fNumber: 1.7,
    iso: 100,
    exposureTime: 0.0008, // 1/1250s
    exposureCompensation: -0.3,
    latitude: -8.7278,
    longitude: 115.4744,
    gpsAltitude: 210,
    dateTimeOriginal: new Date("2025-02-10T10:15:00Z"),
  },
];

interface DummyCitySetItem {
  city: string;
  country: string;
  countryCode: string;
  coverIdKey: string;
  description: string;
}

const DUMMY_CITY_SETS: DummyCitySetItem[] = [
  {
    city: "Surakarta",
    country: "Indonesia",
    countryCode: "ID",
    coverIdKey: "solo-1",
    description: "Sudut-sudut kota Solo: ritme tenang kehidupan kota budaya, pasar rempah bersejarah, dan peninggalan arsitektur keraton.",
  },
  {
    city: "Yogyakarta",
    country: "Indonesia",
    countryCode: "ID",
    coverIdKey: "jogja-2",
    description: "Eksplorasi visual Kota Gudeg: dari dinamika lampu jalan Malioboro hingga siluet megah candi di ufuk senja.",
  },
  {
    city: "Semarang",
    country: "Indonesia",
    countryCode: "ID",
    coverIdKey: "smg-1",
    description: "Kontras fasad kolonial Kota Lama dan geometri lorong Lawang Sewu di pesisir utara Jawa Tengah.",
  },
  {
    city: "Jakarta",
    country: "Indonesia",
    countryCode: "ID",
    coverIdKey: "jkt-2",
    description: "Garis cahaya metropolitan ibu kota: perpaduan pencakar langit kaca, jalur bawah tanah MRT, dan bundaran ikonik.",
  },
  {
    city: "Bali",
    country: "Indonesia",
    countryCode: "ID",
    coverIdKey: "bali-1",
    description: "Perspektif udara pulau dewata: tebing karang Nusa Penida dan lautan biru terbuka.",
  },
];

interface DummyPostItem {
  slug: string;
  title: string;
  tags: string[];
  coverImage: string;
  description: string;
  readingTimeMinutes: number;
  content: string;
}

const DUMMY_POSTS: DummyPostItem[] = [
  {
    slug: "membangun-portofolio-hybrid-tech-dan-visual",
    title: "Membangun Portofolio Hybrid: Web Engineering, FPV Drone, dan Motion Design",
    tags: ["Engineering", "Portfolio", "Personal"],
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80",
    description: "Catatan di balik layar menggabungkan dua identitas: disiplin software engineering modern dan sensitivitas estetika visual.",
    readingTimeMinutes: 5,
    content: `
<h1 class="tiptap-heading">Membangun Portofolio Hybrid: Ketika Kode Bertemu Visual</h1>
<p>Bagi sebagian orang, software engineering dan pembuatan konten visual (fotografi, pilot FPV, motion graphics) berada di dua kutub yang terpisah. Namun dalam perjalanan saya sebagai lulusan Teknik Informatika UMS dan kreator visual, kedua disiplin ini justru saling memperkaya satu sama lain.</p>

<h2 class="tiptap-heading">Menolak Dikotomi "Logika vs Kreativitas"</h2>
<p>Dalam rekayasa web modern, kita dituntut merancang arsitektur yang modular, bersih, dan performan. Saat membangun aplikasi dengan <strong>Next.js</strong>, <strong>TypeScript</strong>, dan <strong>tRPC</strong>, struktur hierarki kode menuntut ketelitian matematis.</p>
<p>Menariknya, prinsip yang sama berlaku saat membingkai foto arsitektur atau menentukan trajectory manuver drone FPV di ruang sempit. Keduanya memerlukan:</p>
<ul class="list-disc">
  <li><p><strong>Komposisi dan Ritme:</strong> Kode yang rapi mudah dibaca; foto dengan leading lines memandu mata audiens secara natural.</p></li>
  <li><p><strong>Efisiensi Resources:</strong> Seperti mengoptimalkan query database, terbang FPV menuntut manajemen daya baterai dan momentum aerodinamis yang presisi.</p></li>
  <li><p><strong>Konsistensi Desain:</strong> Sistem desain (design system) di UI sebanding dengan color grading konsisten pada seri foto dokumenter.</p></li>
</ul>

<h2 class="tiptap-heading">Tantangan Layout Bento dan Inverted Corner</h2>
<p>Situs portofolio ini sendiri merupakan wujud nyata filosofi tersebut. Diadaptasi dari template bento minimalis, saya mempertahankan elemen lengkungan <em>inverted-corner</em> dan tipografi presisi untuk memberikan pengalaman interaksi yang tenang namun responsif.</p>
<blockquote><p>"Desain yang baik adalah ketika fungsionalitas teknis terasa tanpa hambatan, sementara keindahan visual hadir tanpa harus berteriak."</p></blockquote>

<h2 class="tiptap-heading">Dua Jalur Audiens: Tech &amp; Kreatif</h2>
<p>Situs ini sengaja dirancang untuk berbicara kepada dua pihak yang berbeda:</p>
<ol class="list-decimal">
  <li><p><strong>Tech Recruiters &amp; Engineering Teams:</strong> Menampilkan studi kasus proyek nyata dengan analisis Masalah &rarr; Proses &rarr; Hasil dan stack teknis transparan.</p></li>
  <li><p><strong>Klien Kreatif &amp; Kolaborator:</strong> Memperlihatkan hasil karya fotografi, aerial drone, dan motion video melalui <a href="https://gemala.dev" target="_blank" rel="noopener noreferrer">gemala.dev</a> dan <a href="https://gemala.creative" target="_blank" rel="noopener noreferrer">gemala.creative</a>.</p></li>
</ol>
<p>Terima kasih telah berkunjung, dan semoga ruang digital ini memberi gambaran utuh tentang apa yang saya bangun dan rekam.</p>
`.trim(),
  },
  {
    slug: "workflow-remotion-motion-berbasis-kode",
    title: "Workflow Remotion: Menghasilkan Video Motion Dinamis Berbasis Kode React",
    tags: ["React", "Remotion", "Motion"],
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80",
    description: "Bagaimana memanfaatkan komponen React dan TypeScript untuk rendering video motion terprogram dengan konsistensi matematis tinggi.",
    readingTimeMinutes: 4,
    content: `
<h1 class="tiptap-heading">Workflow Remotion: Video Motion Dinamis Berbasis Kode React</h1>
<p>Selama bertahun-tahun, animasi grafis dan motion video identik dengan timeline di software desktop seperti Adobe After Effects. Namun ketika kita membutuhkan video yang dipersonalisasi secara masal atau terintegrasi langsung dengan data API, pendekatan manual menjadi bottleneck.</p>

<h2 class="tiptap-heading">Kenapa Remotion?</h2>
<p><strong>Remotion</strong> mengubah paradigma tersebut: kita menulis animasi menggunakan <code>React</code>, <code>CSS</code>, <code>SVG</code>, dan <code>Canvas</code>, lalu merendernya menjadi file MP4 berkualitas tinggi.</p>
<ul class="list-disc">
  <li><p><strong>Parametrik &amp; Data-Driven:</strong> Video dapat menerima input JSON atau API query, cocok untuk fitur kilas balik (Wrapped), leaderboard dinamis, atau video sertifikat.</p></li>
  <li><p><strong>Komponen yang Dapat Digunakan Ulang:</strong> Transisi, layout tipografi, dan lower-thirds dapat dikemas sebagai reusable React components.</p></li>
  <li><p><strong>Version Control:</strong> Seluruh timeline tersimpan dalam git repository, memudahkan kolaborasi tim developer.</p></li>
</ul>

<h2 class="tiptap-heading">Contoh Struktur Frame Animation</h2>
<pre><code>import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const TitleCard = ({ title }: { title: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi fade in dan slide up halus dalam 0.5 detik pertama
  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, fps * 0.5], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    &lt;div style={{ opacity, transform: \`translateY(\${translateY}px)\` }}&gt;
      &lt;h1 className="text-5xl font-bold"&gt;{title}&lt;/h1&gt;
    &lt;/div&gt;
  );
};</code></pre>

<h2 class="tiptap-heading">Pengalaman di Proyek MedicIME Wrapped</h2>
<p>Konsep ini saya terapkan secara nyata pada sistem <strong>MedicIME Wrapped</strong> untuk komunitas roleplay FiveM. Sistem berhasil mengagregasi ratusan ribu log presensi EMS dan secara otomatis menghasilkan video rekap tahunan bergaya Spotify Wrapped bagi tiap paramedis tanpa campur tangan editing manual.</p>
`.trim(),
  },
  {
    slug: "arsitektur-clean-laravel-studi-kasus-ahp-saw",
    title: "Penerapan DSS Metode AHP-SAW dengan Clean Architecture pada Laravel",
    tags: ["Laravel", "Architecture", "DSS"],
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&q=80",
    description: "Refleksi teknis perancangan algoritma AHP dan SAW dalam sistem evaluasi terstruktur untuk konsistensi matriks bobot kriteria.",
    readingTimeMinutes: 6,
    content: `
<h1 class="tiptap-heading">Penerapan DSS Metode AHP-SAW dengan Clean Architecture</h1>
<p>Dalam tugas akhir saya di Teknik Informatika UMS, saya merancang dan mengimplementasikan sistem pendukung keputusan (<em>Decision Support System</em>) berbasis web untuk evaluasi peserta Baitul Arqam menggunakan kombinasi algoritma <strong>AHP (Analytic Hierarchy Process)</strong> dan <strong>SAW (Simple Additive Weighting)</strong>.</p>

<h2 class="tiptap-heading">Tantangan Matematis: Menjaga Consistency Ratio (CR)</h2>
<p>Kelemahan terbesar saat menentukan bobot kriteria secara manual adalah subjektivitas manusia yang inkonsisten. Metode AHP memecahkan masalah ini dengan matriks perbandingan berpasangan (<em>pairwise comparison matrix</em>):</p>
<ul class="list-disc">
  <li><p>Membentuk matriks n &times; n berdasarkan skala perbandingan Saaty (1 sampai 9).</p></li>
  <li><p>Menghitung nilai Eigenvector ternormalisasi untuk menghasilkan bobot prioritas kriteria.</p></li>
  <li><p>Menghitung Nilai Konsistensi (CI) dan Rasio Konsistensi (CR). Jika <code>CR &le; 0.1</code>, bobot dinyatakan valid secara matematis.</p></li>
</ul>

<h2 class="tiptap-heading">Pemisahan Domain Logic dari Framework Controller</h2>
<p>Banyak sistem Laravel mencampuradukkan perhitungan matematis rumit di dalam Controller. Hal ini membuat pengujian unit (unit testing) menjadi rapuh dan sulit dirawat. Pada <strong>ARQAM App</strong>, logika kalkulasi diisolasi ke dalam Service Layer murni:</p>
<pre><code>// App/Services/DecisionSupport/AhpCalculator.php
class AhpCalculator
{
    public function computeWeights(array $pairwiseMatrix): AhpResult
    {
        // 1. Normalisasi kolom matriks
        // 2. Hitung rata-rata baris (Priority Vector)
        // 3. Hitung Lambda Max, CI, dan CR
        // 4. Return Data Transfer Object (DTO)
    }
}</code></pre>
<p>Setelah bobot terverifikasi konsisten, fase perangkingan alternatif peserta didelegasikan ke <code>SawRanker</code> untuk normalisasi matriks keputusan dan perhitungan nilai preferensi akhir.</p>
<blockquote><p>"Arsitektur yang bersih memastikan algoritma dapat diuji secara independen tanpa ketergantungan pada HTTP request atau state database."</p></blockquote>
`.trim(),
  },
  {
    slug: "sudut-pandang-fpv-sinematik-dan-arsitektur",
    title: "Sudut Pandang FPV: Menjelajah Garis Arsitektur Urban dari Udara",
    tags: ["FPV", "Sinematografi", "Drone"],
    coverImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&q=80",
    description: "Pengalaman menerbangkan drone FPV di ruang terbuka dan perkotaan: teknik manuver halus dan komposisi bingkai dinamis.",
    readingTimeMinutes: 4,
    content: `
<h1 class="tiptap-heading">Sudut Pandang FPV: Menjelajah Garis Arsitektur Urban</h1>
<p>Drone konvensional (camera drone) sangat luar biasa untuk bidikan lanskap statis atau pergerakan stabil berketinggian tinggi. Namun ketika kita ingin membawa audiens merasakan sensasi terbang riil—meluncur melewati celah sempit fasad bangunan, menukik mengikuti tangga spiral, atau melayang rendah di atas tanah—<strong>FPV (First Person View)</strong> membuka dimensi baru.</p>

<h2 class="tiptap-heading">Peralatan dan Setup Rig</h2>
<p>Dalam inventaris alat saya (dapat dilihat di halaman <a href="/about">Tentang</a>), saya memadukan beberapa kelas drone sesuai kebutuhan proyek:</p>
<ul class="list-disc">
  <li><p><strong>BETAFPV Pavo 20 Pro (DJI O4):</strong> Cinewhoop mikro berbobot ringan dengan pelindung baling-baling duct penuh. Ideal untuk eksplorasi interior gedung, ruang kerja, dan interaksi dekat tanpa risiko keselamatan.</p></li>
  <li><p><strong>iFlight Nazgul Evoque F5X:</strong> Drone 5-inch bertenaga tinggi untuk outdoor dengan ketahanan angin optimal, sanggup membawa kamera aksi 4K dan bermanuver akrobatik di kecepatan tinggi.</p></li>
  <li><p><strong>DJI Mini 4 Pro:</strong> Solusi aerial fotografi stabil bersensor CMOS 1/1.3-inch dengan mode vertikal murni dan transmisi jarak jauh.</p></li>
</ul>

<h2 class="tiptap-heading">Filosofi Cinelifter: Smooth over Radical</h2>
<p>Meskipun FPV berakar dari budaya balap drone (racing) dan gaya bebas (freestyle), dalam konteks pembuatan video komersial dan dokumenter, kuncinya adalah <em>smoothness</em>. Throttle control yang halus, rate curva yang linear, dan pemilihan focal length yang tepat menciptakan visual yang menghipnotis tanpa membuat penonton merasa pusing.</p>
<p>Setiap penerbangan adalah studi mendalam tentang sudut datang cahaya matahari, geometri struktur kota, dan ritme waktu.</p>
`.trim(),
  },
];

async function main() {
  console.log("=== SEEDING DUMMY CONTENT ===");

  // 1. Seed Photos
  console.log(`\n1. Inserting / updating ${DUMMY_PHOTOS.length} dummy photos...`);
  const photoIdMap = new Map<string, string>();

  for (const photo of DUMMY_PHOTOS) {
    const existing = await db
      .select({ id: photos.id })
      .from(photos)
      .where(eq(photos.title, photo.title))
      .limit(1);

    if (existing.length > 0) {
      photoIdMap.set(photo.idKey, existing[0].id);
      await db
        .update(photos)
        .set({
          url: photo.url,
          description: photo.description,
          isFavorite: photo.isFavorite,
          visibility: "public",
          aspectRatio: photo.aspectRatio,
          width: photo.width,
          height: photo.height,
          blurData: photo.blurData,
          country: photo.country,
          countryCode: photo.countryCode,
          region: photo.region,
          city: photo.city,
          district: photo.district,
          fullAddress: photo.fullAddress,
          placeFormatted: photo.placeFormatted,
          make: photo.make,
          model: photo.model,
          lensModel: photo.lensModel,
          focalLength: photo.focalLength,
          focalLength35mm: photo.focalLength35mm,
          fNumber: photo.fNumber,
          iso: photo.iso,
          exposureTime: photo.exposureTime,
          exposureCompensation: photo.exposureCompensation,
          latitude: photo.latitude,
          longitude: photo.longitude,
          gpsAltitude: photo.gpsAltitude,
          dateTimeOriginal: photo.dateTimeOriginal,
          updatedAt: new Date(),
        })
        .where(eq(photos.id, existing[0].id));
      console.log(`  [UPDATED] Photo: ${photo.title}`);
    } else {
      const [inserted] = await db
        .insert(photos)
        .values({
          url: photo.url,
          title: photo.title,
          description: photo.description,
          isFavorite: photo.isFavorite,
          visibility: "public",
          aspectRatio: photo.aspectRatio,
          width: photo.width,
          height: photo.height,
          blurData: photo.blurData,
          country: photo.country,
          countryCode: photo.countryCode,
          region: photo.region,
          city: photo.city,
          district: photo.district,
          fullAddress: photo.fullAddress,
          placeFormatted: photo.placeFormatted,
          make: photo.make,
          model: photo.model,
          lensModel: photo.lensModel,
          focalLength: photo.focalLength,
          focalLength35mm: photo.focalLength35mm,
          fNumber: photo.fNumber,
          iso: photo.iso,
          exposureTime: photo.exposureTime,
          exposureCompensation: photo.exposureCompensation,
          latitude: photo.latitude,
          longitude: photo.longitude,
          gpsAltitude: photo.gpsAltitude,
          dateTimeOriginal: photo.dateTimeOriginal,
        })
        .returning();
      photoIdMap.set(photo.idKey, inserted.id);
      console.log(`  [CREATED] Photo: ${photo.title} (${inserted.id})`);
    }
  }

  // 2. Seed City Sets
  console.log(`\n2. Inserting / updating ${DUMMY_CITY_SETS.length} city sets...`);
  for (const cs of DUMMY_CITY_SETS) {
    const coverPhotoId = photoIdMap.get(cs.coverIdKey);
    if (!coverPhotoId) {
      console.warn(`  [WARN] Cover photo not found for city: ${cs.city}`);
      continue;
    }

    const cityPhotosCount = DUMMY_PHOTOS.filter((p) => p.city === cs.city).length;

    const existing = await db
      .select({ id: citySets.id })
      .from(citySets)
      .where(eq(citySets.city, cs.city))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(citySets)
        .set({
          country: cs.country,
          countryCode: cs.countryCode,
          coverPhotoId,
          photoCount: cityPhotosCount,
          description: cs.description,
          updatedAt: new Date(),
        })
        .where(eq(citySets.id, existing[0].id));
      console.log(`  [UPDATED] City Set: ${cs.city} (photos: ${cityPhotosCount})`);
    } else {
      const [inserted] = await db
        .insert(citySets)
        .values({
          country: cs.country,
          countryCode: cs.countryCode,
          city: cs.city,
          coverPhotoId,
          photoCount: cityPhotosCount,
          description: cs.description,
        })
        .returning();
      console.log(`  [CREATED] City Set: ${cs.city} (${inserted.id})`);
    }
  }

  // 3. Seed Posts
  console.log(`\n3. Inserting / updating ${DUMMY_POSTS.length} blog posts...`);
  for (const post of DUMMY_POSTS) {
    const existing = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, post.slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(posts)
        .set({
          title: post.title,
          tags: post.tags,
          coverImage: post.coverImage,
          description: post.description,
          content: post.content,
          readingTimeMinutes: post.readingTimeMinutes,
          visibility: "public",
          updatedAt: new Date(),
        })
        .where(eq(posts.id, existing[0].id));
      console.log(`  [UPDATED] Post: ${post.title} (${post.slug})`);
    } else {
      const [inserted] = await db
        .insert(posts)
        .values({
          slug: post.slug,
          title: post.title,
          tags: post.tags,
          coverImage: post.coverImage,
          description: post.description,
          content: post.content,
          readingTimeMinutes: post.readingTimeMinutes,
          visibility: "public",
        })
        .returning();
      console.log(`  [CREATED] Post: ${post.title} (${inserted.id})`);
    }
  }

  console.log("\n=== ALL DUMMY CONTENT SEEDED SUCCESSFULLY! ===");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
