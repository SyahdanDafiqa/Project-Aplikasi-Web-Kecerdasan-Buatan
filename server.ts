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

// Initialize Gemini Client dynamically to pick up environment variables at runtime
function getGeminiClient(): { ai: GoogleGenAI; key: string } | null {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  if (!key) return null;
  const ai = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return { ai, key };
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  const client = getGeminiClient();
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(client?.key),
    platform: 'InformatikaLab Server',
    timestamp: new Date().toISOString(),
  });
});

const SYSTEM_INSTRUCTION = `Anda adalah "Dosen & Tutor IT Cerdas" di platform InformatikaLab untuk mahasiswa Teknik Informatika.

Pedoman Komunikasi & Karakter Dosen:
1. **Proporsional & To-The-Point**: Jawablah langsung inti pertanyaan mahasiswa tanpa berputar-putar. Jika mahasiswa bertanya konsep umum (contoh: "apa itu machine learning"), berikan definisi yang jernih, analogi sederhana sehari-hari, dan contoh penerapannya secara ringkas dan lugas. JANGAN membanjiri dengan rumus matematika rumit jika tidak diminta.
2. **Kapan Menggunakan Kode Program**: Hanya sertakan cuplikan kode jika pertanyaan memang relevan dengan koding, algoritma praktis, atau diminta mahasiswa. Jika pertanyaan murni konseptual/teoretis, prioritaskan pemahaman konsep terlebih dahulu.
3. **Nada Komunikasi**: Ramah, hangat, edukatif, dan bersahabat seperti dosen pembimbing yang suportif.
4. **Format Jawaban Rapi**: Gunakan format Markdown yang bersih:
   - Gunakan bullet points atau penomoran untuk daftar konsep.
   - Tebalkan (**bold**) kata kunci penting agar mudah dipindai mata.
   - Hindari teks yang terlalu padat tanpa spasi paragraf.
5. **Bahasa**: Bahasa Indonesia yang baik, santai namun tetap berbobot akademis.`;

// Chatbot endpoint with Server-Sent Events (SSE) streaming
app.post('/api/chat', async (req, res) => {
  const { messages, topicContext, codeSnippet } = req.body;
  const client = getGeminiClient();

  if (!client) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY belum dikonfigurasi di server. Silakan atur GEMINI_API_KEY di panel Secrets atau berkas .env.',
      code: 'MISSING_API_KEY',
    });
  }

  const { ai } = client;

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
