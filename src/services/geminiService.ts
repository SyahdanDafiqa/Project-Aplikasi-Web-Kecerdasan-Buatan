import { ChatMessage } from '../types';

export interface ChatRequestOptions {
  messages: { role: 'user' | 'assistant'; content: string }[];
  topicContext?: string;
  codeSnippet?: string;
  onChunk: (chunk: string) => void;
  onError: (error: string) => void;
  onFinish: () => void;
}

// Built-in intelligent answers for offline / fallback mode if API key is not yet set
const FALLBACK_KNOWLEDGE_BASE: Record<string, string> = {
  'big-o': `### Penjelasan Notasi Asimtotik (Big-O)

Notasi **Big-O** adalah standar matematis untuk mengukur batas atas (*worst-case*) dari waktu komputasi atau penggunaan memori saat ukuran input ($n$) membesar menuju tak terhingga.

#### Hierarki Kompleksitas (dari tercepat ke terlambat):
1. **$O(1)$ - Waktu Konstan**: Tidak terpengaruh besarnya data. Contoh: Akses array via indeks \`arr[3]\` atau pencarian pada Hash Map.
2. **$O(\\log n)$ - Logaritmik**: Masalah dipotong separuh setiap iterasi. Contoh: **Binary Search** pada array terurut.
3. **$O(n)$ - Linier**: Jumlah operasi sebanding langsung dengan $n$. Contoh: Loop tunggal mencari nilai tertentu.
4. **$O(n \\log n)$ - Linearithmic**: Kompleksitas optimal algoritma sorting perbandingan seperti **Merge Sort** & **QuickSort** (average-case).
5. **$O(n^2)$ - Kuadratik**: Nested loop dua lapis. Contoh: **Bubble Sort**, **Selection Sort**. Hindari jika $n > 10.000$!
6. **$O(2^n)$ - Eksponensial**: Rekursi Fibonacci naif tanpa memoization.

*Tips Dosen*: Selalu pertimbangkan trade-off antara waktu (*Time Complexity*) dan memori (*Space Complexity*). Sering kali kita bisa mempercepat waktu dari $O(n^2)$ ke $O(n)$ dengan memanfaatkan struktur data seperti Hash Set atau Hash Map!`,

  'handshake': `### Cara Kerja TCP 3-Way Handshake

Sebelum komputer Anda dapat mengirim data HTTP/HTTPS ke server web, protokol TCP wajib membangun koneksi andal (*reliable*) melalui **3-Way Handshake**:

\`\`\`text
Client                                  Server
  |                                        |
  | -------- 1. SYN (Seq = X) -----------> |  (Client: SYN_SENT)
  |                                        |  (Server: SYN_RECEIVED)
  | <------- 2. SYN-ACK (Ack = X+1, Seq = Y) -- | 
  |                                        |  
  | -------- 3. ACK (Ack = Y+1) ---------> |  (Keduanya: ESTABLISHED)
  |                                        |
  | ======= Mulai Transfer Data HTTP ===== |
\`\`\`

#### Mengapa butuh 3 langkah?
- **Langkah 1**: Klien menguji apakah server mendengarkan dan menginisialisasi nomor urut paket awal klien ($X$).
- **Langkah 2**: Server mengakui inisialisasi klien dan mengirimkan nomor urut awal milik server ($Y$).
- **Langkah 3**: Klien mengakui nomor urut server. Kedua belah pihak sekarang tahu bahwa kanal transmisi data dua arah (*full-duplex*) berfungsi sempurna!`,

  'sql-join': `### Panduan Memilih Macam-Macam JOIN pada SQL

Dalam basis data relasional, **JOIN** menggabungkan baris dari dua tabel atau lebih berdasarkan kolom yang saling berelasi:

1. **INNER JOIN**:
   Mengembalikan baris **hanya jika ada kecocokan** di kedua tabel. Jika seorang mahasiswa belum mengambil mata kuliah, namanya tidak akan muncul.
   \`\`\`sql
   SELECT m.nama, k.nama_mk 
   FROM Mahasiswa m
   INNER JOIN Krs k ON m.nim = k.nim;
   \`\`\`

2. **LEFT JOIN (atau LEFT OUTER JOIN)**:
   Mengembalikan **seluruh baris dari tabel kiri (Mahasiswa)**, meskipun di tabel kanan tidak ada kecocokan. Baris yang tidak cocok diisi \`NULL\`. Cocok untuk mencari "Mahasiswa mana saja yang belum mengambil KRS".
   \`\`\`sql
   SELECT m.nama, k.nama_mk 
   FROM Mahasiswa m
   LEFT JOIN Krs k ON m.nim = k.nim
   WHERE k.id_krs IS NULL;
   \`\`\`

3. **FULL OUTER JOIN**:
   Menampilkan semua baris dari kedua tabel, baik yang memiliki relasi maupun yang tidak.`,

  'rest': `### Panduan Desain RESTful API Standar Industri

RESTful API yang bersih menerapkan prinsip-prinsip berikut:
1. **Gunakan Kata Benda Jamak untuk Resource URI**:
   - Baik: \`GET /api/v1/students\`, \`POST /api/v1/students\`
   - Buruk: \`GET /api/v1/getStudents\`, \`POST /api/v1/createNewStudent\`

2. **Gunakan HTTP Method Secara Semantik**:
   - \`GET\`: Mengambil data (harus aman & idempotent).
   - \`POST\`: Membuat resource baru (status 201 Created).
   - \`PUT\`: Memperbarui seluruh field resource secara penuh.
   - \`PATCH\`: Memperbarui sebagian field resource secara parsial.
   - \`DELETE\`: Menghapus resource.

3. **HTTP Status Codes yang Wajib Digunakan**:
   - \`200 OK\`: Request berhasil.
   - \`201 Created\`: Resource baru berhasil disimpan.
   - \`400 Bad Request\`: Validasi input gagal dari sisi client.
   - \`401 Unauthorized\`: Belum login / token tidak valid.
   - \`403 Forbidden\`: Sudah login tapi tidak memiliki izin hak akses (role).
   - \`404 Not Found\`: Resource tidak ditemukan.
   - \`500 Internal Server Error\`: Bug atau crash di server.`,

  'ann': `### Jaringan Saraf Tiruan (Artificial Neural Network)

Jaringan Saraf Tiruan (ANN) terinspirasi dari struktur neuron biologis di otak manusia:

1. **Arsitektur Neuron**:
   - Setiap neuron menerima masukan $x_1, x_2, ...$
   - Masing-masing dikalikan dengan bobot ($w_i$) dan ditambahkan bias ($b$):
     $$z = \\sum (w_i x_i) + b$$
   - Diteruskan ke **Fungsi Aktivasi** non-linier seperti ReLU atau Sigmoid:
     $$a = f(z)$$

2. **Fase Pelatihan (Training)**:
   - **Forward Propagation**: Menghitung prediksi dari input hingga output layer.
   - **Loss Calculation**: Mengukur selisih kesalahan antara prediksi dengan target asli.
   - **Backpropagation**: Menghitung gradien turunan parsial terhadap setiap bobot menggunakan Aturan Rantai (Chain Rule).
   - **Gradient Descent**: Memperbarui bobot berlawanan arah gradien untuk meminimalkan loss.`
};

export async function checkServerStatus(): Promise<{ ok: boolean; hasKey: boolean; message?: string }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return { ok: true, hasKey: Boolean(data.hasGeminiKey) };
    }
  } catch (e) {
    // If backend isn't reached (e.g. running Vite only without express proxy)
  }
  return { ok: false, hasKey: false };
}

export async function sendChatMessageStream(options: ChatRequestOptions): Promise<void> {
  const { messages, topicContext, codeSnippet, onChunk, onError, onFinish } = options;
  const latestMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

  // 1. Try server SSE endpoint first
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        topicContext,
        codeSnippet,
      }),
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') {
            onFinish();
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              onError(parsed.error);
              return;
            }
            if (parsed.text) {
              onChunk(parsed.text);
            }
          } catch {
            // Non-JSON SSE payload
            if (dataStr) onChunk(dataStr);
          }
        }
      }

      onFinish();
      return;
    } else {
      // If server returned error response (e.g., 503 missing API key or 400)
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        // empty
      }

      if (response.status === 503 || errorData.code === 'MISSING_API_KEY') {
        // Provide gentle educational fallback with helpful banner
        simulateSmartFallback(latestMessage, topicContext, onChunk, onFinish);
        return;
      }

      throw new Error(errorData.error || `HTTP ${response.status}: Gagal menghubungi server AI.`);
    }
  } catch (err: any) {
    console.warn('Server streaming failed, attempting local smart tutor fallback:', err);
    // Graceful fallback to avoid leaving user hanging
    simulateSmartFallback(latestMessage, topicContext, onChunk, onFinish);
  }
}

function simulateSmartFallback(
  query: string,
  topicContext: string | undefined,
  onChunk: (chunk: string) => void,
  onFinish: () => void
) {
  let fallbackAnswer = '';

  if (query.includes('big-o') || query.includes('kompleksitas') || query.includes('asymptotic') || query.includes('algoritma')) {
    fallbackAnswer = FALLBACK_KNOWLEDGE_BASE['big-o'];
  } else if (query.includes('handshake') || query.includes('tcp') || query.includes('udp') || query.includes('jaringan')) {
    fallbackAnswer = FALLBACK_KNOWLEDGE_BASE['handshake'];
  } else if (query.includes('join') || query.includes('sql') || query.includes('database') || query.includes('normalisasi')) {
    fallbackAnswer = FALLBACK_KNOWLEDGE_BASE['sql-join'];
  } else if (query.includes('rest') || query.includes('api') || query.includes('http') || query.includes('web')) {
    fallbackAnswer = FALLBACK_KNOWLEDGE_BASE['rest'];
  } else if (query.includes('neural') || query.includes('ai') || query.includes('ann') || query.includes('machine learning')) {
    fallbackAnswer = FALLBACK_KNOWLEDGE_BASE['ann'];
  } else {
    fallbackAnswer = `Halo mahasiswa Informatika! 👋

Pertanyaan Anda sangat menarik${topicContext ? ` mengenai topik **${topicContext}**` : ''}.

### Penjelasan Dosen:
Dalam studi Teknik Informatika, pemahaman konsep fundamental selalu didasarkan pada 3 pilar:
1. **Representasi Data & Abstraksi**: Bagaimana entitas dunia nyata diubah menjadi struktur data komputasional yang efisien.
2. **Efisiensi Algoritma**: Menghitung kompleksitas waktu dan ruang (Big-O) agar sistem dapat diskalakan (*scalable*).
3. **Arsitektur & Keamanan**: Memastikan kode bersifat *clean*, mudah dirawat (*maintainable*), dan aman dari eksploitasi.

\`\`\`typescript
// Contoh implementasi Clean Code & Strongly Typed dalam TypeScript
interface SolutionContract<T> {
  execute(input: T): Promise<T>;
  validate(input: T): boolean;
}
\`\`\`

> 💡 **Info Konfigurasi API**: Anda dapat menghubungkan Google Gemini API secara langsung dengan mengisi \`GEMINI_API_KEY\` di panel Secrets AI Studio atau berkas \`.env\` untuk mendapatkan respons interaktif real-time tanpa batas!`;
  }

  // Stream out the fallback answer in realistic chunks for smooth UX
  const words = fallbackAnswer.split(' ');
  let idx = 0;

  const interval = setInterval(() => {
    if (idx < words.length) {
      const chunk = (idx === 0 ? '' : ' ') + words[idx];
      onChunk(chunk);
      idx++;
    } else {
      clearInterval(interval);
      onFinish();
    }
  }, 25);
}
