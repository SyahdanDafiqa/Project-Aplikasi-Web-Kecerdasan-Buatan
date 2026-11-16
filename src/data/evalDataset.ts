import { EvalTestCase } from '../types';

export const EVAL_DATASET: EvalTestCase[] = [
  {
    id: 'eval-web-1',
    category: 'web-dev',
    categoryLabel: 'Pemrograman Web',
    question: 'Jelaskan praktik desain RESTful API yang benar untuk method HTTP dan status code.',
    topicContext: 'RESTful API & Arsitektur Backend',
    expectedPositive: true,
    expectedConcepts: ['GET', 'POST', 'PUT', 'DELETE', '200', '201', '404'],
    referenceAnswer:
      'RESTful API menggunakan kata benda jamak untuk URI resource, HTTP method semantik seperti GET, POST, PUT, PATCH, dan DELETE, serta HTTP status code standar seperti 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, dan 404 Not Found.',
  },
  {
    id: 'eval-web-2',
    category: 'web-dev',
    categoryLabel: 'Pemrograman Web',
    question: 'Apa perbedaan utama antara status HTTP 401 Unauthorized dan 403 Forbidden pada REST API?',
    topicContext: 'RESTful API & Keamanan Web',
    expectedPositive: true,
    expectedConcepts: ['401', '403', 'token', 'login', 'hak akses', 'role'],
    referenceAnswer:
      'Status 401 Unauthorized menandakan klien belum terautentikasi atau token login tidak valid, sedangkan 403 Forbidden berarti klien sudah login tetapi tidak memiliki izin hak akses atau role untuk resource tersebut.',
  },
  {
    id: 'eval-dsa-1',
    category: 'dsa',
    categoryLabel: 'Struktur Data & Algoritma',
    question: 'Jelaskan hierarki kompleksitas waktu Big-O mulai dari O(1) hingga O(n^2) beserta contohnya.',
    topicContext: 'Analisis Kompleksitas Big-O',
    expectedPositive: true,
    expectedConcepts: ['O(1)', 'O(\\log n)', 'O(n)', 'O(n^2)', 'Binary Search', 'Hash Map'],
    referenceAnswer:
      'Hierarki Big-O mengukur pertumbuhan waktu komputasi saat input membesar: O(1) konstan seperti akses array atau Hash Map, O(log n) logaritmik seperti Binary Search, O(n) linier pada loop tunggal, O(n log n) pada Merge Sort atau QuickSort, dan O(n^2) kuadratik pada Bubble Sort.',
  },
  {
    id: 'eval-dsa-2',
    category: 'dsa',
    categoryLabel: 'Struktur Data & Algoritma',
    question: 'Bagaimana cara mengoptimalkan kompleksitas waktu dari O(n^2) menjadi O(n) saat mencari pasangan data?',
    topicContext: 'Struktur Data Hash Map & Set',
    expectedPositive: true,
    expectedConcepts: ['O(n)', 'Hash Map', 'Hash Set', 'memori', 'trade-off'],
    referenceAnswer:
      'Optimasi dari O(n^2) ke O(n) dilakukan dengan memanfaatkan trade-off antara waktu dan memori menggunakan struktur data Hash Map atau Hash Set untuk pencarian O(1).',
  },
  {
    id: 'eval-db-1',
    category: 'database',
    categoryLabel: 'Basis Data',
    question: 'Kapan kita sebaiknya menggunakan SQL INNER JOIN dibandingkan LEFT JOIN?',
    topicContext: 'SQL JOIN & Relasi Tabel',
    expectedPositive: true,
    expectedConcepts: ['INNER JOIN', 'LEFT JOIN', 'NULL', 'kecocokan', 'tabel kiri'],
    referenceAnswer:
      'INNER JOIN mengembalikan baris hanya jika ada kecocokan di kedua tabel, sedangkan LEFT JOIN mempertahankan seluruh baris dari tabel kiri dan mengisi kolom tabel kanan dengan NULL jika tidak ada kecocokan.',
  },
  {
    id: 'eval-db-2',
    category: 'database',
    categoryLabel: 'Basis Data',
    question: 'Bagaimana query SQL menggunakan LEFT JOIN untuk mencari mahasiswa yang belum mengambil KRS?',
    topicContext: 'Basis Data Relasional & Query',
    expectedPositive: true,
    expectedConcepts: ['LEFT JOIN', 'WHERE', 'IS NULL', 'SELECT', 'FROM'],
    referenceAnswer:
      'Gunakan SELECT dengan LEFT JOIN antara tabel Mahasiswa dan tabel KRS lalu filter baris yang belum berelasi menggunakan klausa WHERE kolom_krs IS NULL.',
  },
  {
    id: 'eval-net-1',
    category: 'network',
    categoryLabel: 'Jaringan Komputer',
    question: 'Jelaskan tahapan proses TCP 3-Way Handshake langkah demi langkah.',
    topicContext: 'Protokol Transport TCP/IP',
    expectedPositive: true,
    expectedConcepts: ['SYN', 'SYN-ACK', 'ACK', 'ESTABLISHED', 'Client', 'Server'],
    referenceAnswer:
      'TCP 3-Way Handshake terdiri dari tiga tahap: Client mengirim SYN dengan sequence number awal, Server membalas dengan SYN-ACK, lalu Client mengirim ACK sehingga koneksi kedua pihak berstatus ESTABLISHED untuk transfer data full-duplex.',
  },
  {
    id: 'eval-net-2',
    category: 'network',
    categoryLabel: 'Jaringan Komputer',
    question: 'Mengapa protokol TCP membutuhkan 3 langkah handshake sebelum mengirim data HTTP?',
    topicContext: 'Koneksi Andal TCP',
    expectedPositive: true,
    expectedConcepts: ['reliable', 'nomor urut', 'full-duplex', 'Server', 'Client'],
    referenceAnswer:
      'Tiga langkah memastikan koneksi andal (reliable) dua arah full-duplex, menguji kesiapan server mendengarkan, serta menyinkronkan nomor urut paket awal antara client dan server.',
  },
  {
    id: 'eval-ai-1',
    category: 'ai',
    categoryLabel: 'Kecerdasan Buatan',
    question: 'Apa itu Machine Learning dan sebutkan 3 cabang utamanya beserta contoh penerapannya.',
    topicContext: 'Pengantar Machine Learning',
    expectedPositive: true,
    expectedConcepts: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Klasifikasi', 'Clustering'],
    referenceAnswer:
      'Machine Learning adalah cabang AI di mana komputer belajar pola dari data tanpa aturan eksplisit. Tiga cabang utamanya adalah Supervised Learning (regresi/klasifikasi), Unsupervised Learning (clustering), dan Reinforcement Learning (agen berbasis reward).',
  },
  {
    id: 'eval-ai-2',
    category: 'ai',
    categoryLabel: 'Kecerdasan Buatan',
    question: 'Jelaskan peran Forward Propagation, Loss, Backpropagation, dan Gradient Descent dalam pelatihan ANN.',
    topicContext: 'Artificial Neural Network',
    expectedPositive: true,
    expectedConcepts: ['Forward Propagation', 'Loss', 'Backpropagation', 'Gradient Descent', 'bobot', 'Chain Rule'],
    referenceAnswer:
      'Pada pelatihan Artificial Neural Network, Forward Propagation menghitung prediksi output, Loss mengukur selisih kesalahan terhadap target, Backpropagation menghitung gradien bobot dengan Chain Rule, dan Gradient Descent memperbarui bobot untuk meminimalkan loss.',
  },
  {
    id: 'eval-neg-1',
    category: 'false-premise',
    categoryLabel: 'Koreksi Premis & Out-of-Scope',
    question: 'Benarkah algoritma Bubble Sort memiliki kompleksitas waktu rata-rata O(1) dan lebih cepat dari Merge Sort?',
    topicContext: 'Validasi Konsep Algoritma',
    expectedPositive: false,
    expectedConcepts: ['O(n^2)', 'salah', 'keliru', 'Merge Sort', 'O(n \\log n)'],
    forbiddenClaims: ['benar, bubble sort O(1)', 'bubble sort lebih cepat dari merge sort'],
    referenceAnswer:
      'Tidak benar. Bubble Sort memiliki kompleksitas waktu rata-rata dan worst-case O(n^2), jauh lebih lambat dibandingkan Merge Sort yang memiliki kompleksitas O(n log n).',
  },
  {
    id: 'eval-neg-2',
    category: 'false-premise',
    categoryLabel: 'Koreksi Premis & Out-of-Scope',
    question: 'Apakah SQL INNER JOIN menampilkan seluruh baris NULL dari tabel kiri meskipun tidak memiliki pasangan?',
    topicContext: 'Validasi Konsep SQL',
    expectedPositive: false,
    expectedConcepts: ['tidak', 'INNER JOIN', 'LEFT JOIN', 'kecocokan', 'NULL'],
    forbiddenClaims: ['ya, inner join menampilkan semua baris null'],
    referenceAnswer:
      'Pernyataan tersebut keliru. INNER JOIN hanya mengembalikan baris yang memiliki kecocokan di kedua tabel. Untuk menampilkan semua baris tabel kiri beserta NULL jika tidak cocok, gunakan LEFT JOIN.',
  },
  {
    id: 'eval-neg-3',
    category: 'false-premise',
    categoryLabel: 'Koreksi Premis & Out-of-Scope',
    question: 'Apakah pada TCP 3-Way Handshake paket pertamanya adalah FIN-ACK dari server ke client?',
    topicContext: 'Validasi Protokol Jaringan',
    expectedPositive: false,
    expectedConcepts: ['SYN', 'Client', 'Server', 'SYN-ACK', 'ACK'],
    forbiddenClaims: ['benar, paket pertama adalah fin-ack'],
    referenceAnswer:
      'Keliru. Paket pertama pada TCP 3-Way Handshake adalah SYN yang dikirim oleh Client ke Server, bukan FIN-ACK.',
  },
  {
    id: 'eval-neg-4',
    category: 'false-premise',
    categoryLabel: 'Koreksi Premis & Out-of-Scope',
    question: 'Tolong buatkan resep masakan rendang daging sapi padang lengkap dengan bumbu dapurnya.',
    topicContext: 'Uji Batas Domain Informatika',
    expectedPositive: false,
    expectedConcepts: ['informatika', 'teknik informatika', 'maaf', 'di luar', 'kuliah'],
    forbiddenClaims: ['santan', 'lengkuas', 'serai', 'daun jeruk'],
    referenceAnswer:
      'Maaf, sebagai Dosen & Tutor Teknik Informatika, saya hanya membantu materi seputar pemrograman, algoritma, basis data, jaringan komputer, dan kecerdasan buatan.',
  },
];
