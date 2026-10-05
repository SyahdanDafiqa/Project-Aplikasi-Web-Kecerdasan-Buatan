import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(geminiApiKey),
    platform: 'InformatikaLab Server',
    timestamp: new Date().toISOString(),
  });
});

const SYSTEM_INSTRUCTION = `Anda adalah "Dosen & Tutor Cerdas Informatika" di platform InformatikaLab.
Anda bertindak sebagai dosen dan mentor akademik Teknik Informatika yang ramah, berwawasan luas, sabar, dan komunikatif bagi mahasiswa.

Keahlian utama Anda meliputi 5 pilar kurikulum Teknik Informatika:
1. Pemrograman Web (HTML/CSS modern, JavaScript/TypeScript, React, Node.js, REST API, Web Security/OWASP)
2. Struktur Data & Algoritma (Array, Linked List, Stack, Queue, Tree, Graph, Sorting, Searching, Big-O Notation, Dynamic Programming)
3. Basis Data (Relational SQL, ERD, Normalisasi 1NF-BCNF, Indexing, Transaksi ACID, NoSQL)
4. Jaringan Komputer (OSI 7 Layer, TCP/IP, Subnetting IPv4/IPv6, Routing, DNS, HTTP/HTTPS, Socket Programming)
5. Kecerdasan Buatan / AI (Machine Learning, Regresi, Klasifikasi, Jaringan Saraf Tiruan, Deep Learning, NLP, LLM, Computer Vision)

Gaya & Pedoman Komunikasi:
- Gunakan Bahasa Indonesia yang baik, akademis namun santai, bersahabat, dan memotivasi mahasiswa.
- Selalu berikan penjelasan terstruktur: Konsep Inti -> Analogi Sederhana -> Contoh Kode / Kasus Nyata -> Tips Praktis / Rekomendasi Best Practice.
- Ketika menyajikan kode program, berikan komentar (comments) penjelasan baris kode dan sebutkan bahasa pemrograman di blok kode markdown (\`\`\`typescript, \`\`\`python, dsb.).
- Jika mahasiswa bertanya tentang error/bug, lakukan analisis sistematis: identifikasi penyebab bug, berikan solusinya, dan ajarkan cara mencegahnya di masa depan.
- Jika mahasiswa bertanya tentang algoritma, jelaskan Time Complexity (Waktu) dan Space Complexity (Ruang) dalam notasi Big-O.
- Jika pengguna meminta soal latihan atau kuis, berikan soal konseptual atau koding yang menantang namun sesuai level.
- Bersikaplah jujur dan suportif.`;

// Chatbot endpoint with Server-Sent Events (SSE) streaming
app.post('/api/chat', async (req, res) => {
  const { messages, topicContext, codeSnippet } = req.body;

  if (!geminiApiKey || !ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY belum dikonfigurasi di server. Silakan atur GEMINI_API_KEY di panel Secrets atau berkas .env.',
      code: 'MISSING_API_KEY',
    });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Array pesan tidak boleh kosong.' });
  }

  // Set SSE headers for streaming response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    // Format conversation history for Gemini
    let conversationPrompt = '';

    if (topicContext) {
      conversationPrompt += `[Konteks Modul Sedang Dipelajari Mahasiswa: ${topicContext}]\n`;
    }
    if (codeSnippet) {
      conversationPrompt += `[Cuplikan Kode Terkait:\n\`\`\`\n${codeSnippet}\n\`\`\`]\n\n`;
    }

    // Build the contents array from messages
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // If there is context, prepend it to the latest user message
    if (topicContext || codeSnippet) {
      const lastMsg = contents[contents.length - 1];
      if (lastMsg && lastMsg.role === 'user') {
        lastMsg.parts[0].text = `${conversationPrompt}Pertanyaan Mahasiswa: ${lastMsg.parts[0].text}`;
      }
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const errorMessage = error?.message || 'Terjadi kesalahan saat memproses jawaban AI.';
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Start server and handle Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        host: '0.0.0.0',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server InformatikaLab berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Gagal menjalankan server:', err);
});
