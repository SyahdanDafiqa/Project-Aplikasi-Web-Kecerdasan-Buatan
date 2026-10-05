import { CategoryInfo, CourseModule } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'web-dev',
    name: 'Pemrograman Web',
    shortDesc: 'Frontend modern, backend REST API, arsitektur client-server & keamanan web.',
    color: 'from-blue-500 to-cyan-500',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-900/50',
    icon: 'Globe',
  },
  {
    id: 'dsa',
    name: 'Struktur Data & Algoritma',
    shortDesc: 'Notasi Big-O, struktur data linear & non-linear, rekursi, serta optimasi efisiensi.',
    color: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-900/50',
    icon: 'Binary',
  },
  {
    id: 'database',
    name: 'Basis Data',
    shortDesc: 'Model relasional SQL, normalisasi 1NF-3NF, transaksi ACID, indexing & NoSQL.',
    color: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-900/50',
    icon: 'Database',
  },
  {
    id: 'network',
    name: 'Jaringan Komputer',
    shortDesc: 'Model OSI 7 Layer, TCP/IP, subnetting CIDR, DNS, HTTP/HTTPS, dan routing.',
    color: 'from-purple-500 to-indigo-500',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-900/50',
    icon: 'Network',
  },
  {
    id: 'ai',
    name: 'Kecerdasan Buatan (AI)',
    shortDesc: 'Konsep Machine Learning, Jaringan Saraf Tiruan, Deep Learning, NLP & Etika AI.',
    color: 'from-rose-500 to-pink-500',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-200 dark:border-rose-900/50',
    icon: 'Cpu',
  },
];

export const COURSE_MODULES: CourseModule[] = [
  // ==========================================
  // PEMROGRAMAN WEB
  // ==========================================
  {
    id: 'web-101',
    categoryId: 'web-dev',
    categoryName: 'Pemrograman Web',
    title: 'Fondasi Web Modern: HTML5 Semantik, Modern CSS & Flexbox/Grid',
    slug: 'fondasi-web-modern',
    summary: 'Memahami anatomi dokumen HTML5 semantik untuk aksesibilitas dan SEO, serta layouting responsif dengan CSS Flexbox dan Grid modern.',
    difficulty: 'Dasar',
    estimatedMinutes: 12,
    iconName: 'Layout',
    tags: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Aksesibilitas', 'Responsive'],
    prerequisites: ['Dasar pengoperasian browser dan teks editor'],
    sections: [
      {
        id: 'sec-html5-semantic',
        title: '1. Mengapa HTML Semantik Krusial bagi Mahasiswa IT?',
        content: `Dalam rekayasa web modern, HTML bukan sekadar menampilkan teks di layar, melainkan memberi makna (*semantics*) pada data. Tag semantik seperti \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, dan \`<footer>\` membantu screen reader (A11y/Accessibility) dan search engine bot (SEO) memahami hierarki informasi aplikasi tanpa bergantung pada styling CSS.

Perbedaan mendasar antara tag generik seperti \`<div>\` dan tag semantik:
- \`<div>\` dan \`<span>\` tidak memiliki arti semantik bawaan (hanya wadah visual).
- \`<article>\` mewakili konten mandiri yang dapat didistribusikan ulang (misalnya posting blog, komentar).
- \`<section>\` mengelompokkan konten yang memiliki tema atau heading yang sama.`,
        keyPoints: [
          'Gunakan elemen semantik untuk meningkatkan accessibility (WCAG) dan skor SEO.',
          'Gunakan elemen <button> untuk aksi dan <a> untuk navigasi URL, jangan tertukar.',
          'Hindari "div-soup" (kebiasaan membungkus semua elemen dengan div tanpa alasan semantik).',
        ],
        codeSnippets: [
          {
            language: 'html',
            title: 'Struktur Dokumen Web Semantik Modern',
            code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal Mahasiswa Informatika</title>
</head>
<body>
  <!-- Header Aplikasi -->
  <header class="app-header">
    <div class="logo">InformatikaLab</div>
    <nav aria-label="Navigasi Utama">
      <ul>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#materi">Materi Kuliah</a></li>
      </ul>
    </nav>
  </header>

  <!-- Konten Utama: Hanya ada 1 per halaman -->
  <main id="konten-utama">
    <article class="artikel-materi">
      <h1>Pengenalan Rekayasa Perangkat Lunak</h1>
      <p class="metadata">Dipublikasikan pada: <time datetime="2026-10-05">5 Oktober 2026</time></p>
      <section>
        <h2>Metode Agile vs Waterfall</h2>
        <p>Pendekatan iteratif memungkinkan respons cepat terhadap perubahan kebutuhan pengguna.</p>
      </section>
    </article>
  </main>
</body>
</html>`,
            explanation: 'Elemen <main> menandai konten primer, sementara <time> menyediakan metadata tanggal yang terbaca mesin.',
          },
        ],
      },
      {
        id: 'sec-flex-grid',
        title: '2. Layouting Modern: Flexbox (1D) vs CSS Grid (2D)',
        content: `Aturan umum arsitektur layout CSS:
1. **Flexbox (1 Dimensi)**: Ideal untuk mengatur elemen dalam satu baris (horizontal) ATAU satu kolom (vertikal). Contoh: bar navigasi, grup tombol, alignment ikon dan teks.
2. **CSS Grid (2 Dimensi)**: Dirancang untuk mengelola baris dan kolom secara simultan. Contoh: dashboard card grid, galeri layout kompleks, dan template halaman penuh.`,
        keyPoints: [
          'Flexbox unggul untuk perataan konten (alignment) dan distribusi ruang satu sumbu.',
          'CSS Grid unggul dalam mendefinisikan layout kolom responsif dengan minmax() dan repeat().',
          'Kombinasikan Grid untuk layout makro dan Flexbox untuk komponen mikro.',
        ],
        codeSnippets: [
          {
            language: 'css',
            title: 'Responsif Card Grid dengan CSS Grid Modern (Tanpa Media Queries)',
            code: `/* Auto-fit card grid otomatis responsif */
.cards-container {
  display: grid;
  /* Membuat kolom fleksibel minimal 280px, selebihnya mengisi ruang 1fr */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

/* Flexbox untuk komponen kartu individu */
.card-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 0.75rem;
  padding: 1.25rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}`,
            explanation: 'Penggunaan repeat(auto-fit, minmax(280px, 1fr)) memungkinkan kartu membungkus otomatis sesuai lebar layar ponsel maupun monitor desktop ultrawide.',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-web1',
        question: 'Kapan sebaiknya Anda memilih CSS Grid dibandingkan Flexbox?',
        options: [
          'Ketika hanya ingin meratakan tombol di dalam navbar',
          'Ketika membuat struktur layout dua dimensi yang mengontrol baris dan kolom secara bersamaan',
          'Ketika ingin membuat animasi hover sederhana',
          'Ketika website hanya dibuka di perangkat mobile',
        ],
        correctAnswerIndex: 1,
        explanation: 'CSS Grid dirancang untuk layout dua dimensi (baris dan kolom sekaligus), sedangkan Flexbox berfokus pada distribusi satu dimensi.',
      },
      {
        id: 'q-web2',
        question: 'Apa fungsi utama tag semantik seperti <article> dan <nav> dalam HTML5?',
        options: [
          'Otomatis menambahkan efek visual bayangan dan warna biru',
          'Membantu screen reader dan mesin pencari memahami arti hierarki konten secara struktural',
          'Membuat halaman web otomatis terhubung ke database',
          'Mempercepat kecepatan koneksi internet pengguna',
        ],
        correctAnswerIndex: 1,
        explanation: 'HTML semantik menyediakan metadata struktural untuk aksesibilitas (A11y) dan pengindeksan mesin pencari (SEO).',
      },
    ],
  },

  {
    id: 'web-102',
    categoryId: 'web-dev',
    categoryName: 'Pemrograman Web',
    title: 'JavaScript Modern (ES6+), Asinkronus & Event Loop',
    slug: 'javascript-modern-async-event-loop',
    summary: 'Kupas tuntas arsitektur Single-Threaded JavaScript, Call Stack, Task Queue, Microtask Queue (Promises), dan pola Async/Await.',
    difficulty: 'Menengah',
    estimatedMinutes: 16,
    iconName: 'Code',
    tags: ['JavaScript', 'ES6', 'Promises', 'Async/Await', 'Event Loop', 'Fetch API'],
    prerequisites: ['Sintaks dasar JavaScript (variabel, fungsi, array)'],
    sections: [
      {
        id: 'sec-event-loop',
        title: '1. Mengapa JavaScript Bersifat Single-Threaded & Non-Blocking?',
        content: `JavaScript di lingkungan browser (V8 Engine) dan Node.js hanya memiliki **satu Call Stack**. Artinya, ia hanya dapat mengeksekusi satu baris instruksi dalam satu waktu (*single-threaded*).

Namun, JavaScript dapat menangani operasi lambat seperti I/O jaringan (HTTP request), timer (\`setTimeout\`), dan pembacaan berkas secara *non-blocking* berkat mekanisme **Event Loop**:
1. **Call Stack**: Menjalankan instruksi sinkronus secara LIFO (Last-In-First-Out).
2. **Web APIs / Node APIs**: Menangani timer, fetch network, atau event click di thread latar belakang (background thread pool).
3. **Microtask Queue**: Menampung callback dari Promise (\`.then\`, \`async/await\`, \`queueMicrotask\`). Prioritas TERTINGGI!
4. **Macrotask (Task) Queue**: Menampung callback \`setTimeout\`, \`setInterval\`, \`setImmediate\`.
5. **Event Loop**: Memeriksa apakah Call Stack kosong; jika kosong, ia akan menguras seluruh Microtask Queue terlebih dahulu, baru kemudian mengambil satu Macrotask.`,
        keyPoints: [
          'JavaScript memiliki satu call stack tetapi memanfaatkan thread latar belakang browser untuk I/O.',
          'Microtask (Promise) selalu dieksekusi lebih dulu daripada Macrotask (setTimeout).',
          'Jangan melakukan komputasi berat (CPU-intensive) di main thread agar UI tidak mengalami freeze (jank).',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Urutan Eksekusi Event Loop yang Sering Ditanyakan saat Ujian & Interview',
            code: `console.log("1. Sinkronus: Mulai");

setTimeout(() => {
  console.log("2. Macrotask (setTimeout 0ms)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise 1)");
}).then(() => {
  console.log("4. Microtask (Promise 2 Chained)");
});

queueMicrotask(() => {
  console.log("5. Microtask (queueMicrotask)");
});

console.log("6. Sinkronus: Selesai");

/* Output Urutan Eksekusi:
  1. Sinkronus: Mulai
  6. Sinkronus: Selesai
  3. Microtask (Promise 1)
  5. Microtask (queueMicrotask)
  4. Microtask (Promise 2 Chained)
  2. Macrotask (setTimeout 0ms)
*/`,
            explanation: 'Seluruh kode sinkronus tuntas dieksekusi, lalu Microtask queue dikosongkan seluruhnya, barulah Macrotask (setTimeout) dijalankan.',
          },
        ],
      },
      {
        id: 'sec-async-await-clean',
        title: '2. Pola Asinkronus Bersih dengan Async/Await & Robust Error Handling',
        content: `Sintaks \`async/await\` adalah *syntactic sugar* di atas JavaScript Promise. Pola ini membuat kode asinkronus terlihat sekuensial dan mudah dipahami, sekaligus mempermudah penanganan kegagalan dengan blok \`try...catch\`.`,
        keyPoints: [
          'Fungsi bertanda "async" selalu mengembalikan Promise.',
          'Gunakan Promise.all() untuk menjalankan request paralel independen demi optimasi latensi.',
          'Selalu sertakan blok try...catch dan tangani status HTTP 4xx/5xx yang tidak otomatis melempar exception pada native fetch().',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Pola Pengambilan Data Paralel & Penanganan Error yang Benar',
            code: `interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
}

interface NilaiKuliah {
  mataKuliah: string;
  grade: string;
}

async function getProfileDanNilaiMahasiswa(mhsId: string) {
  try {
    // Menjalankan 2 request HTTP secara PARALEL (bukan serial berurutan)
    const [resProfile, resNilai] = await Promise.all([
      fetch(\`/api/mahasiswa/\${mhsId}\`),
      fetch(\`/api/mahasiswa/\${mhsId}/nilai\`)
    ]);

    // Penting: native fetch TIDAK melempar error pada status 404 atau 500
    if (!resProfile.ok) {
      throw new Error(\`Gagal memuat profil: HTTP \${resProfile.status}\`);
    }
    if (!resNilai.ok) {
      throw new Error(\`Gagal memuat nilai: HTTP \${resNilai.status}\`);
    }

    const dataProfile: Mahasiswa = await resProfile.json();
    const dataNilai: NilaiKuliah[] = await resNilai.json();

    return { profile: dataProfile, nilai: dataNilai };
  } catch (error) {
    console.error("Terjadi kegagalan jaringan atau parsing:", error);
    throw error;
  }
}`,
            explanation: 'Promise.all() memangkas waktu tunggu dari (T1 + T2) menjadi max(T1, T2) karena kedua request berjalan paralel.',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-js1',
        question: 'Manakah yang akan dieksekusi lebih dahulu oleh runtime JavaScript?',
        options: [
          'Callback di dalam setTimeout dengan delay 0 milidetik',
          'Callback di dalam Promise.then() (Microtask)',
          'Callback di dalam setInterval',
          'Keduanya berjalan pada saat bersamaan di thread yang sama',
        ],
        correctAnswerIndex: 1,
        explanation: 'Event loop memprioritaskan Microtask Queue (termasuk Promise.then) sebelum mengambil antrean Macrotask seperti setTimeout.',
      },
    ],
  },

  {
    id: 'web-103',
    categoryId: 'web-dev',
    categoryName: 'Pemrograman Web',
    title: 'Arsitektur REST API & Keamanan Web (OWASP Top 10, CORS, JWT)',
    slug: 'arsitektur-rest-api-keamanan-web',
    summary: 'Prinsip desain RESTful API yang bersih, metode HTTP idempotent, serta proteksi keamanan dari serangan XSS, CSRF, SQL Injection, dan CORS.',
    difficulty: 'Lanjutan',
    estimatedMinutes: 18,
    iconName: 'ShieldCheck',
    tags: ['REST API', 'Express.js', 'JWT', 'CORS', 'XSS', 'CSRF', 'Security'],
    prerequisites: ['JavaScript Modern', 'Konsep Dasar Jaringan HTTP'],
    sections: [
      {
        id: 'sec-rest-principles',
        title: '1. Prinsip Desain RESTful API & Idempotensi',
        content: `REST (Representational State Transfer) adalah gaya arsitektur komunikasi web tanpa status (*stateless*).

Karakteristik penting metode HTTP:
- **GET**: Safe & Idempotent (hanya membaca data tanpa mengubah state server).
- **POST**: Non-idempotent (membuat resource baru; memanggil 2x menghasilkan 2 record).
- **PUT**: Idempotent (menggantikan seluruh resource; memanggil 10x hasilnya tetap sama).
- **PATCH**: Modifikasi parsial pada resource yang sudah ada.
- **DELETE**: Idempotent (menghapus resource; memanggil berulang kali menghasilkan state akhir yang sama: resource terhapus).`,
        keyPoints: [
          'Gunakan kata benda jamak untuk URI (misal: /api/v1/students bukan /api/v1/getStudents).',
          'Gunakan status code HTTP yang presisi: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found).',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Express.js RESTful Route dengan Validasi & Status Code Tepat',
            code: `import express, { Request, Response } from 'express';

const router = express.Router();

// GET /api/v1/courses - Ambil daftar kursus dengan filter pagination
router.get('/courses', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

  // Ambil data dari basis data...
  res.status(200).json({
    success: true,
    page,
    data: []
  });
});

// POST /api/v1/courses - Buat kursus baru (Status 201 Created)
router.post('/courses', async (req: Request, res: Response) => {
  const { title, credits } = req.body;

  if (!title || typeof credits !== 'number') {
    return res.status(400).json({
      success: false,
      error: 'Field "title" (string) dan "credits" (number) wajib diisi.'
    });
  }

  // Simpan kursus ke database...
  res.status(201).json({
    success: true,
    message: 'Mata kuliah berhasil ditambahkan',
    data: { id: 'mk-001', title, credits }
  });
});

export default router;`,
            explanation: 'Gunakan HTTP 201 untuk penambahan resource baru dan validasi input secara ketat sebelum menyentuh database.',
          },
        ],
      },
      {
        id: 'sec-security-owasp',
        title: '2. Tiga Kerentanan Web Teratas & Cara Mitigasinya',
        content: `1. **Cross-Site Scripting (XSS)**:
Penyerang menyuntikkan skrip JavaScript jahat ke halaman web korban.
- *Mitigasi*: Selalu sanitize/escape data sebelum di-render ke DOM, gunakan framework modern seperti React yang otomatis meng-escape teks, dan aktifkan header HTTP \`Content-Security-Policy\` (CSP).

2. **Cross-Site Request Forgery (CSRF)**:
Memaksa pengguna yang sudah terotentikasi untuk mengeksekusi aksi yang tidak diinginkan di aplikasi web.
- *Mitigasi*: Simpan token otentikasi di cookie dengan flag \`SameSite=Strict\` atau \`SameSite=Lax\`, atau gunakan CSRF token header di setiap mutasi state (POST/PUT/DELETE).

3. **CORS (Cross-Origin Resource Sharing)**:
Bukan fitur keamanan untuk melindungi server, melainkan mekanisme browser untuk melindungi pengguna dari request cross-origin yang tidak diizinkan.`,
        keyPoints: [
          'Jangan pernah menyimpan JWT token sensitif di localStorage jika rentan XSS; gunakan HttpOnly Cookie.',
          'Hindari innerHTML atau dangerouslySetInnerHTML tanpa sanitasi ketat menggunakan DOMPurify.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q-sec1',
        question: 'Metode HTTP manakah yang bersifat NON-IDEMPOTENT?',
        options: ['GET', 'PUT', 'DELETE', 'POST'],
        correctAnswerIndex: 3,
        explanation: 'POST bersifat non-idempotent karena jika dikirim berkali-kali dapat menghasilkan resource baru berganda di server.',
      },
    ],
  },

  // ==========================================
  // STRUKTUR DATA & ALGORITMA
  // ==========================================
  {
    id: 'dsa-101',
    categoryId: 'dsa',
    categoryName: 'Struktur Data & Algoritma',
    title: 'Analisis Notasi Asimtotik (Big-O) & Efisiensi Algoritma',
    slug: 'analisis-big-o-kompleksitas',
    summary: 'Fondasi teoretis mengukur performa algoritma berdasarkan pertumbuhan input (n) untuk kompleksitas waktu dan memori.',
    difficulty: 'Dasar',
    estimatedMinutes: 14,
    iconName: 'TrendingUp',
    tags: ['Big-O', 'Algoritma', 'Kompleksitas Waktu', 'Space Complexity', 'Teori Komputasi'],
    sections: [
      {
        id: 'sec-big-o-intro',
        title: '1. Mengapa Kita Butuh Big-O Bukan Stopwatch?',
        content: `Mengukur kecepatan program menggunakan stopwatch (detik/milidetik) tidak akurat untuk ilmu komputer karena sangat dipengaruhi oleh spesifikasi CPU, sistem operasi, bahasa pemrograman, dan beban aplikasi lain saat pengujian.

Notasi Big-O (Asymptotic Notation) mengukur **laju pertumbuhan (growth rate)** kebutuhan komputasi terhadap ukuran input ($n$) saat $n$ menuju tak terhingga ($n \\to \\infty$).

Urutan efisiensi dari yang tercepat ke yang paling lambat:
1. $O(1)$ - Konstan: Waktu eksekusi tidak tergantung besar $n$ (contoh: akses indeks array \`arr[5]\`, hash map lookup).
2. $O(\\log n)$ - Logaritmik: Input berkurang setengah di setiap langkah (contoh: Binary Search).
3. $O(n)$ - Linier: Waktu eksekusi berbanding lurus dengan $n$ (contoh: Single for-loop).
4. $O(n \\log n)$ - Linearithmic: Algoritma pengurutan optimal berbasis pembandingan (contoh: Merge Sort, QuickSort rata-rata).
5. $O(n^2)$ - Kuadratik: Nested loop dua tingkat (contoh: Bubble Sort, Insertion Sort).
6. $O(2^n)$ - Eksponensial: Rekursi ganda tanpa memoization (contoh: Fibonacci naif).
7. $O(n!)$ - Faktorial: Permutasi semua kombinasi (contoh: Brute-force Travelling Salesperson Problem).`,
        keyPoints: [
          'Abaikan konstanta: O(2n + 50) disederhanakan menjadi O(n).',
          'Ambil suku dominan: O(n^2 + 100n + 500) disederhanakan menjadi O(n^2).',
          'Pertimbangkan Worst-Case (Big-O), Average-Case (Theta), dan Best-Case (Omega).',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Perbandingan Praktis Kompleksitas O(1), O(n), dan O(n^2)',
            code: `// 1. O(1) - Akses elemen array secara instan via indeks memori
function getElemenPertama(data: number[]): number | undefined {
  return data[0]; // Operasi konstan terlepas panjang array 10 atau 10.000.000
}

// 2. O(n) - Linear Search: memeriksa satu per satu
function cariNilai(data: number[], target: number): boolean {
  for (let i = 0; i < data.length; i++) {
    if (data[i] === target) return true;
  }
  return false;
}

// 3. O(n^2) - Nested Loop: perbandingan pasangan
function cekAdaDuplikat(data: number[]): boolean {
  const n = data.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (data[i] === data[j]) return true; // Kuadratik! Sangat lambat jika n = 100.000
    }
  }
  return false;
}

// Optimasi cek duplikat menjadi O(n) menggunakan HashSet:
function cekAdaDuplikatCepat(data: number[]): boolean {
  const seen = new Set<number>();
  for (const item of data) {
    if (seen.has(item)) return true; // Set.has() adalah O(1)
    seen.add(item);
  }
  return false; // Kompleksitas Waktu: O(n), Ruang: O(n)
}`,
            explanation: 'Dengan memanfaatkan struktur data HashSet, kita menukar memori (space complexity) untuk memangkas waktu dari O(n^2) menjadi O(n).',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-dsa-bigo1',
        question: 'Sebuah fungsi memiliki dua nested loop yang masing-masing berulang sebanyak n kali. Berapa kompleksitas waktunya?',
        options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
        correctAnswerIndex: 2,
        explanation: 'Loop di dalam loop yang masing-masing berjalan hingga n menghasilkan total n * n operasi, yaitu O(n^2).',
      },
      {
        id: 'q-dsa-bigo2',
        question: 'Berapakah kompleksitas waktu pencarian (search) pada Hash Map ideal dengan fungsi hash yang merata?',
        options: ['O(n)', 'O(n log n)', 'O(1)', 'O(n^2)'],
        correctAnswerIndex: 2,
        explanation: 'Hash map ideal mengkalkulasi alamat indeks memori secara langsung melalui fungsi hash, menghasilkan akses konstan O(1).',
      },
    ],
  },

  {
    id: 'dsa-102',
    categoryId: 'dsa',
    categoryName: 'Struktur Data & Algoritma',
    title: 'Struktur Data Linear: Array, Singly/Doubly Linked List, Stack & Queue',
    slug: 'struktur-data-linear-array-linkedlist-stack-queue',
    summary: 'Mekanisme alokasi memori berurutan vs pointer, implementasi Stack (LIFO), dan Queue (FIFO) beserta use-case nyata dalam sistem operasi.',
    difficulty: 'Dasar',
    estimatedMinutes: 15,
    iconName: 'ListOrdered',
    tags: ['Array', 'Linked List', 'Stack', 'Queue', 'Pointer', 'Memori'],
    sections: [
      {
        id: 'sec-array-vs-linkedlist',
        title: '1. Array Bersebelahan vs Linked List Berbasis Node',
        content: `Perbandingan fundamental di tingkat perangkat keras:
- **Array**: Elemen disimpan di blok memori yang berurutan secara kontigu (*contiguous memory*). Keuntungan utamanya adalah *cache locality* yang tinggi dan akses instan $O(1)$ via indeks \`arr[i]\`. Kekurangannya: penyisipan atau penghapusan di awal/tengah memerlukan pergeseran elemen ($O(n)$).
- **Linked List**: Setiap elemen (*Node*) tersebar bebas di memori heap, dihubungkan oleh pointer penunjuk alamat memori node berikutnya. Keuntungan: penyisipan di kepala ($head$) sangat cepat $O(1)$. Kekurangan: tidak ada akses indeks langsung ($O(n)$ untuk traversal).`,
        keyPoints: [
          'Stack bekerja dengan prinsip LIFO (Last-In-First-Out). Contoh: Undo/Redo di teks editor, Call Stack fungsi.',
          'Queue bekerja dengan prinsip FIFO (First-In-First-Out). Contoh: Antrean print dokumen, Task queue event loop.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Implementasi Singly Linked List Mandiri dalam TypeScript',
            code: `class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(val: T) {
    this.value = val;
  }
}

class LinkedList<T> {
  head: ListNode<T> | null = null;
  size: number = 0;

  // Insert di awal: O(1) waktu
  prepend(value: T): void {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }

  // Traversal print seluruh elemen: O(n) waktu
  print(): void {
    let current = this.head;
    const output: T[] = [];
    while (current !== null) {
      output.push(current.value);
      current = current.next;
    }
    console.log(output.join(" -> "));
  }
}

const list = new LinkedList<string>();
list.prepend("Algoritma");
list.prepend("Struktur Data");
list.print(); // Output: Struktur Data -> Algoritma`,
            explanation: 'Node linked list memiliki properti `value` untuk data dan `next` yang menyimpan referensi ke node berikutnya di heap memori.',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-dsa-linear1',
        question: 'Struktur data manakah yang paling ideal untuk mengimplementasikan fitur "Undo" pada aplikasi pengolah kata?',
        options: ['Queue (FIFO)', 'Stack (LIFO)', 'Binary Search Tree', 'Hash Map'],
        correctAnswerIndex: 1,
        explanation: 'Fitur Undo membutuhkan aksi terakhir yang dilakukan untuk dibatalkan terlebih dahulu, sesuai prinsip Last-In-First-Out (LIFO) milik Stack.',
      },
    ],
  },

  {
    id: 'dsa-103',
    categoryId: 'dsa',
    categoryName: 'Struktur Data & Algoritma',
    title: 'Pohon Biner & Graf: BST, Traversal DFS/BFS & Algoritma Dijkstra',
    slug: 'binary-search-tree-graph-dijkstra',
    summary: 'Pohon Pencarian Biner terurut, teknik penelusuran graf (Depth-First Search & Breadth-First Search), dan pencarian rute terpendek dengan Dijkstra.',
    difficulty: 'Lanjutan',
    estimatedMinutes: 20,
    iconName: 'GitBranch',
    tags: ['Binary Search Tree', 'Graph', 'BFS', 'DFS', 'Dijkstra', 'Routing'],
    sections: [
      {
        id: 'sec-bst-properties',
        title: '1. Pohon Pencarian Biner (Binary Search Tree / BST)',
        content: `Aturan mutlak Binary Search Tree (BST):
Untuk setiap node $N$:
- Semua nilai di sub-pohon kiri $N$ harus lebih kecil dari nilai $N$.
- Semua nilai di sub-pohon kanan $N$ harus lebih besar dari nilai $N$.

Jika pohon seimbang (Balanced, seperti AVL atau Red-Black Tree), operasi pencarian, penyisipan, dan penghapusan bernilai $O(\\log n)$.
Namun jika pohon miring (degenerate/skewed), BST bisa terdegradasi menjadi linked list dengan kompleksitas terburuk $O(n)$.`,
        keyPoints: [
          'In-order traversal pada BST selalu menghasilkan urutan angka yang terurut membesar (ascending).',
          'BFS (Breadth-First Search) menggunakan antrean Queue dan menjamin rute terpendek pada graf tak berbobot.',
          'DFS (Depth-First Search) menggunakan Stack atau rekursi, ideal untuk deteksi siklus dan path-finding.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Algoritma Breadth-First Search (BFS) Menemukan Jarak Terpendek',
            code: `// Graf direpresentasikan sebagai Adjacency List
type Graph = Record<string, string[]>;

function bfsShortestPath(graph: Graph, start: string, target: string): string[] | null {
  // Queue menyimpan [nodeSaatIni, riwayatJalur]
  const queue: [string, string[]][] = [[start, [start]]];
  const visited = new Set<string>([start]);

  while (queue.length > 0) {
    const [current, path] = queue.shift()!;

    if (current === target) {
      return path; // Ditemukan rute terpendek
    }

    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null; // Target tidak terjangkau
}

const petaKampus: Graph = {
  'Gedung A': ['Gedung B', 'Perpustakaan'],
  'Gedung B': ['Gedung A', 'Lab Komputer'],
  'Perpustakaan': ['Gedung A', 'Lab Komputer'],
  'Lab Komputer': ['Gedung B', 'Perpustakaan', 'Kantin'],
  'Kantin': ['Lab Komputer']
};

console.log(bfsShortestPath(petaKampus, 'Gedung A', 'Kantin'));
// Output: ['Gedung A', 'Gedung B', 'Lab Komputer', 'Kantin']`,
            explanation: 'BFS menjelajahi tetangga terdekat lapis demi lapis menggunakan Queue, menjamin path yang pertama kali tiba di target adalah rute terpendek.',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-dsa-bst1',
        question: 'Traversal jenis apakah pada Binary Search Tree yang menghasilkan urutan elemen terurut dari nilai terkecil ke terbesar?',
        options: ['Pre-order traversal', 'In-order traversal', 'Post-order traversal', 'Level-order traversal'],
        correctAnswerIndex: 1,
        explanation: 'In-order traversal mengunjungi (Kiri -> Root -> Kanan), sehingga pada BST selalu mencetak elemen dalam urutan terurut menaik (ascending).',
      },
    ],
  },

  // ==========================================
  // BASIS DATA
  // ==========================================
  {
    id: 'db-101',
    categoryId: 'database',
    categoryName: 'Basis Data',
    title: 'Desain Relasional, Normalisasi (1NF, 2NF, 3NF, BCNF) & ERD',
    slug: 'desain-relasional-normalisasi-erd',
    summary: 'Menghilangkan redundansi data dan anomali pembaruan (update/delete anomaly) melalui normalisasi sistematis dan perancangan relasi ERD.',
    difficulty: 'Dasar',
    estimatedMinutes: 16,
    iconName: 'Table',
    tags: ['Basis Data', 'Normalisasi', '1NF', '2NF', '3NF', 'ERD', 'Foreign Key'],
    sections: [
      {
        id: 'sec-normalisasi-rules',
        title: '1. Mengapa Normalisasi Diperlukan dalam Database Relasional?',
        content: `Tanpa normalisasi, basis data rentan terhadap tiga anomali fatal:
1. **Insertion Anomaly**: Tidak bisa memasukkan informasi baru tanpa memasukkan entitas yang tidak relevan.
2. **Update Anomaly**: Memperbarui satu nilai (misal nama jurusan) harus mengubah ribuan baris, berisiko inkonsistensi.
3. **Deletion Anomaly**: Menghapus satu record mengakibatkan data penting lainnya ikut terhapus permanen secara tidak sengaja.

Tahapan Normalisasi:
- **1NF (Bentuk Normal Pertama)**:
  - Setiap kolom hanya boleh bernilai tunggal (*atomic value*), tidak ada grup perulangan (*repeating groups*) atau array dalam satu kolom.
- **2NF (Bentuk Normal Kedua)**:
  - Sudah memenuhi 1NF.
  - Tidak ada ketergantungan parsial (*partial dependency*): semua atribut non-kunci harus bergantung penuh pada seluruh Primary Key (relevan untuk tabel dengan composite primary key).
- **3NF (Bentuk Normal Ketiga)**:
  - Sudah memenuhi 2NF.
  - Tidak ada ketergantungan transitif (*transitive dependency*): atribut non-kunci tidak boleh bergantung pada atribut non-kunci lainnya (A -> B dan B -> C).`,
        keyPoints: [
          'Atomisitas di 1NF melarang menyimpan "Java, Python, C++" dalam satu kolom string.',
          '2NF memisahkan tabel jika atribut hanya bergantung pada salah satu bagian dari composite key.',
          '3NF mengharuskan atribut yang dapat dihitung atau bergantung pada kolom non-key dipindahkan ke tabel tersendiri.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            title: 'Contoh Transformasi Schema Memenuhi 3NF',
            code: `-- TABEL TIDAK NORMAL (Melanggar 3NF karena total_biaya bergantung pada harga dan jumlah):
-- Transaksi(id_transaksi, id_mahasiswa, nama_mahasiswa, kode_buku, judul_buku, harga_sewa)

-- HASIL DEKOMPOSISI 3NF:
CREATE TABLE Mahasiswa (
  nim VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jurusan VARCHAR(50) NOT NULL
);

CREATE TABLE Buku (
  kode_buku VARCHAR(10) PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  harga_sewa_per_hari DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Peminjaman (
  id_peminjaman SERIAL PRIMARY KEY,
  nim VARCHAR(10) NOT NULL,
  kode_buku VARCHAR(10) NOT NULL,
  tanggal_pinjam DATE NOT NULL,
  durasi_hari INT DEFAULT 7,
  CONSTRAINT fk_peminjaman_mahasiswa FOREIGN KEY (nim) REFERENCES Mahasiswa(nim) ON DELETE CASCADE,
  CONSTRAINT fk_peminjaman_buku FOREIGN KEY (kode_buku) REFERENCES Buku(kode_buku)
);`,
            explanation: 'Dengan 3NF, jika nama mahasiswa berubah, kita cukup mengubah 1 baris di tabel Mahasiswa tanpa menduplikasi data di tabel peminjaman.',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-db-norm1',
        question: 'Sebuah tabel memiliki kolom "hobi" yang berisi teks "Membaca, Futsal, Coding". Bentuk normal apakah yang dilanggar?',
        options: ['1NF (First Normal Form)', '2NF (Second Normal Form)', '3NF (Third Normal Form)', 'BCNF (Boyce-Codd Normal Form)'],
        correctAnswerIndex: 0,
        explanation: '1NF mensyaratkan setiap kolom memiliki nilai tunggal atomik (atomic value), tidak boleh menyimpan multivariat/kumpulan nilai dalam satu sel.',
      },
    ],
  },

  {
    id: 'db-102',
    categoryId: 'database',
    categoryName: 'Basis Data',
    title: 'SQL Lanjutan: Multi-Table Joins, Subquery, Agregasi & Window Functions',
    slug: 'sql-lanjutan-joins-window-functions',
    summary: 'Menguasai manipulasi data tingkat lanjut di PostgreSQL/MySQL: INNER, LEFT, RIGHT, FULL OUTER JOIN, GROUP BY, HAVING, dan Indexing B-Tree.',
    difficulty: 'Menengah',
    estimatedMinutes: 18,
    iconName: 'DatabaseZap',
    tags: ['SQL', 'JOIN', 'Window Functions', 'Agregasi', 'B-Tree', 'Query Optimization'],
    sections: [
      {
        id: 'sec-joins-mastery',
        title: '1. Pembedahan Perilaku Macam-Macam JOIN',
        content: `Relasi tabel dalam SQL:
- **INNER JOIN**: Hanya mengembalikan baris jika terdapat kecocokan (*match*) di KEDUA tabel.
- **LEFT (OUTER) JOIN**: Mengembalikan SEMUA baris dari tabel kiri, serta kolom dari tabel kanan yang cocok (jika tidak cocok, bernilai \`NULL\`).
- **RIGHT JOIN**: Kebalikan dari LEFT JOIN.
- **FULL OUTER JOIN**: Mengembalikan semua data dari kedua tabel, mengisi \`NULL\` jika tidak ada pasangan yang cocok.

Perbedaan Penting: **WHERE vs HAVING**:
- \`WHERE\` menyaring baris individu SEBELUM proses agregasi (\`GROUP BY\`).
- \`HAVING\` menyaring hasil grup SETELAH agregasi dijalankan (misalnya \`HAVING COUNT(*) > 5\`).`,
        keyPoints: [
          'Jangan gunakan WHERE untuk filter kolom dari tabel sebelah kanan pada LEFT JOIN jika tidak ingin query berubah menjadi INNER JOIN secara implisit.',
          'Index B-Tree sangat efektif untuk pencarian sama dengan (=), rentang (BETWEEN, <, >), dan ORDER BY.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            title: 'Query Lanjutan: Agregasi dengan HAVING dan Window Function RANK()',
            code: `-- 1. Menemukan Dosen yang mengajar lebih dari 3 mata kuliah (HAVING)
SELECT 
  d.nidn,
  d.nama_dosen,
  COUNT(m.kode_mk) AS total_mata_kuliah
FROM Dosen d
INNER JOIN MataKuliah m ON d.nidn = m.nidn_pengampu
GROUP BY d.nidn, d.nama_dosen
HAVING COUNT(m.kode_mk) >= 3
ORDER BY total_mata_kuliah DESC;

-- 2. Menggunakan Window Function DENSE_RANK() untuk merangking IPK mahasiswa per jurusan
SELECT 
  nim,
  nama,
  jurusan,
  ipk,
  DENSE_RANK() OVER (
    PARTITION BY jurusan 
    ORDER BY ipk DESC
  ) AS peringkat_jurusan
FROM Mahasiswa;`,
            explanation: 'Window function DENSE_RANK() memberi peringkat mahasiswa di dalam masing-masing jurusan tanpa menghilangkan detail baris individu (tanpa collapse baris seperti GROUP BY).',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-db-sql1',
        question: 'Klausul manakah yang digunakan untuk menyaring data SETELAH fungsi agregasi seperti SUM() atau COUNT() dikelompokkan?',
        options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
        correctAnswerIndex: 1,
        explanation: 'HAVING digunakan khusus untuk memfilter kelompok data setelah GROUP BY, sedangkan WHERE memfilter baris sebelum agregasi.',
      },
    ],
  },

  // ==========================================
  // JARINGAN KOMPUTER
  // ==========================================
  {
    id: 'net-101',
    categoryId: 'network',
    categoryName: 'Jaringan Komputer',
    title: 'Model Referensi OSI 7 Layer vs TCP/IP & Alur Enkapsulasi',
    slug: 'osi-7-layer-tcp-ip-enkapsulasi',
    summary: 'Memahami bagaimana paket data bergerak dari kabel fisik hingga aplikasi: Application, Presentation, Session, Transport, Network, Data Link, Physical.',
    difficulty: 'Dasar',
    estimatedMinutes: 14,
    iconName: 'Layers',
    tags: ['OSI Layer', 'TCP/IP', 'Enkapsulasi', 'Header', 'Router', 'Switch'],
    sections: [
      {
        id: 'sec-osi-layers',
        title: '1. Anatomi Model OSI 7 Layer',
        content: `Model OSI (Open Systems Interconnection) membagi komunikasi jaringan menjadi 7 lapisan modular:
1. **Layer 7 - Application**: Antarmuka aplikasi pengguna akhir (HTTP, DNS, SSH, SMTP).
2. **Layer 6 - Presentation**: Format data, enkripsi, dan kompresi (TLS/SSL, JSON, JPEG).
3. **Layer 5 - Session**: Menjaga sesi koneksi antar aplikasi (RPC, NetBIOS).
4. **Layer 4 - Transport**: Komunikasi end-to-end, segmentasi, flow control (TCP, UDP). Unit data: **Segment**.
5. **Layer 3 - Network**: Pengalamatan logis dan pemilihan rute terbaik (*routing*) lintas jaringan (IP, ICMP). Alat: **Router**. Unit data: **Packet**.
6. **Layer 2 - Data Link**: Pengalamatan fisik (MAC Address) dalam satu jaringan lokal LAN, error detection (Ethernet, Wi-Fi 802.11). Alat: **Switch**. Unit data: **Frame**.
7. **Layer 1 - Physical**: Transmisi sinyal listrik, cahaya, atau gelombang radio mentah (Kabel UTP, Fiber Optic, Hub). Unit data: **Bits**.`,
        keyPoints: [
          'Enkapsulasi: Data -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1).',
          'Switch bekerja di Layer 2 berbasis MAC Address; Router bekerja di Layer 3 berbasis IP Address.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q-net-osi1',
        question: 'Pada layer OSI manakah perangkat Router bekerja untuk menentukan rute pengiriman data?',
        options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
        correctAnswerIndex: 1,
        explanation: 'Router beroperasi pada Layer 3 (Network) karena memeriksa header IP Packet untuk menentukan jalur pengiriman lintas jaringan.',
      },
    ],
  },

  {
    id: 'net-102',
    categoryId: 'network',
    categoryName: 'Jaringan Komputer',
    title: 'Pengalamatan IPv4, Subnetting CIDR & Perhitungan Host',
    slug: 'pengalamatan-ipv4-subnetting-cidr',
    summary: 'Kuasai teknik menghitung Net ID, Broadcast ID, Subnet Mask, dan jumlah host valid menggunakan notasi CIDR (/24, /26, /30).',
    difficulty: 'Menengah',
    estimatedMinutes: 16,
    iconName: 'Server',
    tags: ['IPv4', 'Subnetting', 'CIDR', 'NetID', 'Broadcast', 'VLSM'],
    sections: [
      {
        id: 'sec-subnetting-calc',
        title: '1. Rumus Praktis Subnetting CIDR',
        content: `Alamat IPv4 terdiri dari 32 bit yang dibagi menjadi 4 oktet (masing-masing 8 bit).
Format notasi CIDR (Classless Inter-Domain Routing): \`192.168.1.0/26\`.
Angka \`/26\` berarti 26 bit pertama adalah **Network Prefix**, menyisakan $32 - 26 = 6$ bit untuk **Host bit** ($h$).

Rumus Kunci:
1. **Jumlah Total IP**: $2^h$ (untuk /26: $2^6 = 64$ IP per subnet).
2. **Jumlah Host Valid (Usable)**: $2^h - 2$ (karena 2 IP dicadangkan: IP pertama untuk Network ID, IP terakhir untuk Broadcast ID).
   Maka untuk /26: $64 - 2 = 62$ komputer/device yang bisa diberi IP.
3. **Subnet Mask**: 26 bit '1' bernilai \`255.255.255.192\` (karena oktet terakhir: $128 + 64 = 192$).`,
        keyPoints: [
          'Network ID: Alamat pengenal subnet (tidak boleh dipasang ke device).',
          'Broadcast ID: Alamat pengiriman pesan ke seluruh host di subnet.',
          'Subnet /30 menghasilkan 2 host usable, standar de-facto untuk link point-to-point antar router.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Kalkulator Logika Subnetting dalam TypeScript',
            code: `function hitungSubnetInfo(cidrPrefix: number) {
  if (cidrPrefix < 0 || cidrPrefix > 32) throw new Error("Prefix CIDR harus 0-32");

  const hostBits = 32 - cidrPrefix;
  const totalIP = Math.pow(2, hostBits);
  // Untuk /31 dan /32 terdapat pengecualian RFC khusus, namun secara umum:
  const usableHosts = totalIP >= 2 ? totalIP - 2 : 0;

  return {
    prefix: \`/\${cidrPrefix}\`,
    hostBits,
    totalAlamatIP: totalIP,
    hostDapatDigunakan: usableHosts,
  };
}

console.log(hitungSubnetInfo(24)); 
// Output: { prefix: '/24', totalAlamatIP: 256, hostDapatDigunakan: 254 }

console.log(hitungSubnetInfo(27)); 
// Output: { prefix: '/27', totalAlamatIP: 32, hostDapatDigunakan: 30 }`,
            explanation: 'Fungsi menghitung jumlah alamat IP dan kapasitas komputer yang dapat tersambung berdasarkan panjang prefix bit netmask.',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-net-sub1',
        question: 'Berapa jumlah host valid yang dapat digunakan pada subnet dengan prefix CIDR /28?',
        options: ['16 host', '14 host', '30 host', '62 host'],
        correctAnswerIndex: 1,
        explanation: 'Pada /28, sisa bit host adalah 32 - 28 = 4 bit. Total IP = 2^4 = 16. Host valid = 16 - 2 = 14 host.',
      },
    ],
  },

  {
    id: 'net-103',
    categoryId: 'network',
    categoryName: 'Jaringan Komputer',
    title: 'Protokol Transport: TCP 3-Way Handshake vs UDP & TLS Handshake',
    slug: 'tcp-3-way-handshake-udp-tls',
    summary: 'Mengapa TCP handal dan berorientasi koneksi (*connection-oriented*), sementara UDP cepat dan tanpa garansi (*connectionless*).',
    difficulty: 'Menengah',
    estimatedMinutes: 15,
    iconName: 'Radio',
    tags: ['TCP', 'UDP', '3-Way Handshake', 'SYN-ACK', 'TLS', 'Socket'],
    sections: [
      {
        id: 'sec-tcp-handshake',
        title: '1. Mekanisme TCP 3-Way Handshake',
        content: `Sebelum data apa pun dikirim melalui TCP (seperti request HTTP), client dan server harus membangun sesi koneksi terpercaya melalui 3 langkah:
1. **Langkah 1 (SYN)**: Client mengirim paket TCP dengan flag \`SYN=1\` dan nomor urut acak (*Sequence Number* $X$) ke server. Status client: \`SYN_SENT\`.
2. **Langkah 2 (SYN-ACK)**: Server menerima, merespons dengan flag \`SYN=1\` dan \`ACK=1\`. Server mengonfirmasi penerimaan dengan \`Acknowledgment Number = X + 1\`, serta membangkitkan nomor urut miliknya ($Y$). Status server: \`SYN_RECEIVED\`.
3. **Langkah 3 (ACK)**: Client membalas dengan flag \`ACK=1\` dan \`Acknowledgment Number = Y + 1\`. Status kedua belah pihak: \`ESTABLISHED\`.

Setelah langkah ke-3 ini, transfer data dua arah (*full-duplex*) yang andal siap dimulai!`,
        keyPoints: [
          'TCP menyediakan garansi urutan paket, retransmisi jika paket hilang, dan kontrol kemacetan (congestion control).',
          'UDP tidak melakukan handshake atau retransmisi, menjadikannya sangat cepat dengan overhead rendah untuk Live Streaming, VoIP, dan Game Online Multiplayer.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q-net-tcp1',
        question: 'Urutan flag yang benar pada proses pembentukan koneksi TCP 3-Way Handshake adalah:',
        options: ['SYN -> ACK -> FIN', 'SYN -> SYN-ACK -> ACK', 'ACK -> SYN -> RST', 'SYN-ACK -> SYN -> ACK'],
        correctAnswerIndex: 1,
        explanation: 'Klien mengirim SYN, server membalas dengan SYN-ACK, dan klien menyelesaikan dengan ACK.',
      },
    ],
  },

  // ==========================================
  // KECERDASAN BUATAN (AI)
  // ==========================================
  {
    id: 'ai-101',
    categoryId: 'ai',
    categoryName: 'Kecerdasan Buatan (AI)',
    title: 'Pengantar Paradigma Machine Learning: Supervised, Unsupervised & RL',
    slug: 'pengantar-paradigma-machine-learning',
    summary: 'Pembedahan mendasar algoritma pembelajaran mesin berbasis data berlabel, pengelompokan tanpa label, dan agen berbasis reward.',
    difficulty: 'Dasar',
    estimatedMinutes: 14,
    iconName: 'Brain',
    tags: ['Machine Learning', 'Supervised', 'Unsupervised', 'Reinforcement Learning', 'Dataset'],
    sections: [
      {
        id: 'sec-ml-paradigms',
        title: '1. Tiga Cabang Utama Machine Learning',
        content: `Dalam rekayasa perangkat lunak tradisional: \`Aturan (Rules) + Data = Jawaban\`.
Dalam Machine Learning: \`Data + Jawaban = Aturan (Model Prediktif)\`.

Tiga paradigma pembelajaran:
1. **Supervised Learning (Pembelajaran Terawasi)**:
   Model dilatih dengan data yang memiliki label target ($X \\to y$).
   - *Klasifikasi*: Memprediksi kategori diskret (misal: Email Spam vs Bukan Spam, Diagnosis Tumor Jinak vs Ganas).
   - *Regresi*: Memprediksi angka kontinu (misal: Prediksi harga rumah, estimasi nilai saham).
2. **Unsupervised Learning (Pembelajaran Tak Terawasi)**:
   Data tidak memiliki label ($X$). Model menemukan pola tersembunyi, klaster, atau reduksi dimensi.
   - Contoh: Segmentasi pelanggan (*K-Means Clustering*), deteksi anomali fraud, Principal Component Analysis (PCA).
3. **Reinforcement Learning (Pembelajaran Penguatan)**:
   Agen belajar mengambil keputusan optimal di lingkungan dinamis melalui siklus aksi (*action*), pengamatan status (*state*), dan umpan balik (*reward/penalty*).
   - Contoh: AI bermain catur/Go (AlphaGo), mobil otonom, sistem rekomendasi adaptif.`,
        keyPoints: [
          'Underfitting terjadi ketika model terlalu sederhana sehingga tidak mampu menangkap pola data.',
          'Overfitting terjadi ketika model menghafal data latih hingga gagal generalisasi pada data baru.',
          'Selalu pisahkan dataset menjadi Train Set (70-80%), Validation Set (10%), dan Test Set (10-20%).',
        ],
      },
    ],
    quiz: [
      {
        id: 'q-ai-ml1',
        question: 'Tugas memprediksi harga sewa apartemen dalam satuan rupiah berdasarkan luas tanah dan lokasi termasuk ke dalam:',
        options: ['Supervised Learning - Klasifikasi', 'Supervised Learning - Regresi', 'Unsupervised Learning - K-Means', 'Reinforcement Learning'],
        correctAnswerIndex: 1,
        explanation: 'Harga sewa merupakan nilai angka kontinu dengan data berlabel, sehingga masuk dalam kategori Supervised Learning - Regresi.',
      },
    ],
  },

  {
    id: 'ai-102',
    categoryId: 'ai',
    categoryName: 'Kecerdasan Buatan (AI)',
    title: 'Jaringan Saraf Tiruan (ANN), Fungsi Aktivasi & Backpropagation',
    slug: 'artificial-neural-networks-backpropagation',
    summary: 'Bagaimana neuron komputasional (Perceptron) bekerja, peranan fungsi aktivasi non-linier (ReLU, Sigmoid), dan optimasi Gradient Descent.',
    difficulty: 'Menengah',
    estimatedMinutes: 18,
    iconName: 'Network',
    tags: ['Neural Networks', 'Perceptron', 'Backpropagation', 'Gradient Descent', 'ReLU', 'Loss Function'],
    sections: [
      {
        id: 'sec-ann-mechanism',
        title: '1. Komputasi Forward Pass & Peran Non-Linearitas',
        content: `Satu neuron artifisial menerima input vektor $X = [x_1, x_2, ..., x_n]$, mengalikannya dengan bobot $W = [w_1, w_2, ..., w_n]$, menjumlahkannya dengan bias $b$, lalu meneruskannya ke fungsi aktivasi:

$$z = \\sum (w_i \\cdot x_i) + b$$
$$a = \\sigma(z)$$

Mengapa fungsi aktivasi non-linier (seperti **ReLU**: $f(x) = \\max(0, x)$) wajib digunakan?
Tanpa aktivasi non-linier, sebanyak apa pun lapisan (*hidden layers*) yang Anda tumpuk, seluruh jaringan saraf hanya akan setara dengan sebuah transformasi linear tunggal. Non-linearitas memungkinkan neural network memetakan batasan keputusan (*decision boundary*) yang rumit.`,
        keyPoints: [
          'Loss Function mengukur seberapa jauh tebakan model dari label sebenarnya.',
          'Backpropagation menghitung turunan parsial gradien error terhadap setiap bobot menggunakan aturan rantai kalkulus (Chain Rule).',
          'Gradient Descent memperbarui bobot ke arah yang meminimalkan nilai loss.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Implementasi Sederhana Single Artificial Neuron (Forward Pass)',
            code: `// Implementasi matematis komputasi forward neuron
function neuronForward(
  inputs: number[], 
  weights: number[], 
  bias: number, 
  activation: 'relu' | 'sigmoid'
): number {
  if (inputs.length !== weights.length) {
    throw new Error("Dimensi input dan bobot harus sama!");
  }

  // Dot product: w1*x1 + w2*x2 + ... + wn*xn
  let sum = bias;
  for (let i = 0; i < inputs.length; i++) {
    sum += inputs[i] * weights[i];
  }

  // Terapkan fungsi aktivasi
  if (activation === 'relu') {
    return Math.max(0, sum); // ReLU (Rectified Linear Unit)
  } else {
    return 1 / (1 + Math.exp(-sum)); // Sigmoid (output 0 sampai 1)
  }
}

// Simulasi keputusan kelulusan mahasiswa:
// Input: [Jam Belajar / Hari, Kehadiran %, Jumlah Tugas Selesai]
const fiturMahasiswa = [4.5, 0.95, 10]; 
const bobotModel = [0.8, 0.5, 0.3];
const biasModel = -2.0;

const probabilitasLulus = neuronForward(fiturMahasiswa, bobotModel, biasModel, 'sigmoid');
console.log(\`Probabilitas kelulusan: \${(probabilitasLulus * 100).toFixed(2)}%\`);`,
            explanation: 'Neuron menghitung kombinasi linier bobot dan input, kemudian fungsi sigmoid memetakan hasilnya ke rentang probabilitas 0-100%.',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-ai-ann1',
        question: 'Mengapa fungsi aktivasi non-linier seperti ReLU mutlak diperlukan pada Deep Neural Network?',
        options: [
          'Agar program berjalan tanpa memerlukan memori RAM',
          'Untuk mencegah jaringan saraf hanya setara dengan transformasi linier biasa, sehingga mampu mempelajari pola non-linier kompleks',
          'Agar model otomatis bebas dari bug logika',
          'Hanya sebagai formalitas grafis visualisasi',
        ],
        correctAnswerIndex: 1,
        explanation: 'Fungsi aktivasi non-linier memungkinkan tumpukan hidden layers memetakan relasi data non-linier yang kompleks; tanpanya, multi-layer hanya menghasilkan kombinasi linier.',
      },
    ],
  },

  {
    id: 'ai-103',
    categoryId: 'ai',
    categoryName: 'Kecerdasan Buatan (AI)',
    title: 'Arsitektur Transformer, Model Bahasa Besar (LLM) & Prompt Engineering',
    slug: 'transformer-architecture-llm-prompt-engineering',
    summary: 'Mekanisme Self-Attention ("Attention Is All You Need"), tokenisasi teks, cara kerja model generatif Gemini/GPT, serta teknik Prompt Engineering terstruktur.',
    difficulty: 'Lanjutan',
    estimatedMinutes: 20,
    iconName: 'Sparkles',
    tags: ['Transformer', 'LLM', 'Self-Attention', 'NLP', 'Gemini API', 'Prompt Engineering'],
    sections: [
      {
        id: 'sec-self-attention',
        title: '1. Revolusi Mekanisme Self-Attention',
        content: `Sebelum arsitektur Transformer diperkenalkan pada tahun 2017 oleh tim Google ("Attention Is All You Need"), pemrosesan teks mengandalkan RNN dan LSTM yang memproses kata satu per satu secara sekuensial. Kelemahan RNN: lambat (tidak bisa diparalelkan di GPU) dan mudah lupa konteks kalimat panjang (*vanishing gradient*).

Transformer memecahkan masalah ini dengan **Self-Attention**:
Setiap kata dalam kalimat dikonversi menjadi 3 vektor:
- **Query ($Q$)**: "Apa yang sedang saya cari?"
- **Key ($K$)**: "Informasi apa yang saya miliki?"
- **Value ($V$)**: "Berapa konten aktual saya?"

Rumus Scaled Dot-Product Attention:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

Mekanisme ini memungkinkan model memahami kata "ia" dalam kalimat *"Kucing mengejar tikus karena ia lapar"* merujuk pada "kucing", bukan "tikus", dengan mengukur skor bobot attention antar kata secara simultan.`,
        keyPoints: [
          'LLM adalah model probabilistik prediktor token berikutnya (next-token predictor) yang dilatih dengan skala data sangat masif.',
          'Zero-shot, Few-shot, dan Chain-of-Thought (CoT) adalah pilar utama Prompt Engineering efektif.',
          'RAG (Retrieval-Augmented Generation) menghubungkan LLM dengan database eksternal untuk mengatasi halusinasi.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            title: 'Contoh Pola Prompting Chain-of-Thought (CoT) untuk Analisis Algoritma',
            code: `// Teknik Prompt Engineering: Chain-of-Thought (CoT)
// Meminta model menguraikan langkah penalaran (step-by-step) sebelum menyimpulkan

const systemPrompt = \`
Anda adalah Dosen Penguji Algoritma Teknik Informatika.
Ketika menganalisis sebuah cuplikan kode:
Langkah 1: Identifikasi setiap loop dan percabangan kondisional.
Langkah 2: Hitung jumlah iterasi terhadap ukuran input N (T(N)).
Langkah 3: Tentukan notasi asimtotik Big-O worst-case dan space complexity.
Langkah 4: Berikan rekomendasi jika terdapat potensi optimasi.
\`;

const userPrompt = \`
Analisis kode fungsi berikut:
function findPairs(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[i] + arr[j] === 10) count++;
    }
  }
  return count;
}
\`;`,
            explanation: 'Menyusun prompt dengan instruksi penalaran bertahap (Chain-of-Thought) terbukti secara signifikan menurunkan tingkat kesalahan komputasi model AI.',
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-ai-trans1',
        question: 'Komponen kunci arsitektur Transformer yang memungkinkannya menimbang relasi antar kata dalam satu kalimat secara simultan adalah:',
        options: ['Self-Attention Mechanism', 'K-Means Clustering', 'Convolutional Pooling Layer', 'Decision Tree Pruning'],
        correctAnswerIndex: 0,
        explanation: 'Self-Attention menghitung bobot keterkaitan antara setiap token dengan semua token lain dalam sekuens secara paralel.',
      },
    ],
  },
];
