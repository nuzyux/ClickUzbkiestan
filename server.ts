import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // 1. Search Grounding / General Smart Feature (gemini-3.5-flash)
  app.post('/api/ai/search', async (req, res) => {
    try {
      const { query } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          toolConfig: { includeServerSideToolInvocations: true }
        }
      });
      res.json({ text: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 2. High Thinking (gemini-3.1-pro-preview + high thinking level)
  app.post('/api/ai/think', async (req, res) => {
    try {
      const { query } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: query,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });
      res.json({ text: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 3. Fast Tasks (gemini-3.1-flash-lite)
  app.post('/api/ai/fast', async (req, res) => {
    try {
      const { query } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: query,
      });
      res.json({ text: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 4. Image Generation (gemini-3.1-flash-image)
  app.post('/api/ai/image', async (req, res) => {
    try {
      const { prompt, aspectRatio = '1:1' } = req.body;
      let mappedRatio = aspectRatio;
      // Map ratios to supported ones if they are not supported
      const supported = ['1:1', '3:4', '4:3', '9:16', '16:9', '1:4', '1:8', '4:1', '8:1'];
      if (!supported.includes(aspectRatio)) {
        if (aspectRatio === '2:3') mappedRatio = '3:4';
        if (aspectRatio === '3:2') mappedRatio = '4:3';
        if (aspectRatio === '21:9') mappedRatio = '4:1';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: mappedRatio,
            imageSize: '1K'
          }
        }
      });
      
      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
          break;
        }
      }
      res.json({ imageUrl });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Export ZIP
  app.get('/api/export', async (req, res) => {
    try {
      const archiverModule = await import('archiver');
      const archiver = archiverModule.default || archiverModule;
      const archive = (archiver as any)('zip', { zlib: { level: 9 } });
      res.attachment('export.zip');
      archive.pipe(res);
      archive.glob('**/*', {
        cwd: process.cwd(),
        ignore: ['node_modules/**', 'dist/**', '.git/**', '.next/**']
      });
      await archive.finalize();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
