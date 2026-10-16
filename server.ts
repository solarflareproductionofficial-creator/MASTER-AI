import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { solveGenericOffline } from './src/utils/offlineEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '20mb' }));

// Server-side Gemini initialization with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function withTimeout<T>(promise: Promise<T>, timeoutMs = 45000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI Core request timeout')), timeoutMs)
    ),
  ]);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MASTER AI Core',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Chat & Deep Logic Reasoning Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const {
      prompt,
      history = [],
      systemPrompt = '',
      mode = 'standard', // 'deep-logic' | 'standard' | 'google-search' | 'code-architect'
      reasoningRigor = 'standard',
      language = 'en',
      selectedModel = 'gemini-2.5-flash',
      userDirectives = '',
      userPreferences = {},
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured. Running in offline/fallback mode.',
      });
    }

    // Construct master system instructions
    const langInstruction =
      language === 'tr'
        ? 'Yanıtlarını Türkçe, doğal, akıcı, zengin ve anlaşılır bir Türkçe ile ver.'
        : `Respond in English (or the user's primary language if they speak another language).`;

    // Detect if this is a hardcore logic puzzle or normal inquiry
    const lowerPrompt = prompt.toLowerCase();
    const isPuzzleOrProof =
      mode === 'deep-logic' ||
      reasoningRigor === 'proof' ||
      lowerPrompt.includes('bulmaca') ||
      lowerPrompt.includes('kanıtla') ||
      lowerPrompt.includes('paradoks') ||
      lowerPrompt.includes('zebra') ||
      lowerPrompt.includes('şövalye') ||
      lowerPrompt.includes('nehir geçişi') ||
      lowerPrompt.includes('adım adım ispat');

    let modeDirective = '';
    if (isPuzzleOrProof) {
      modeDirective = `
KRİTİK TALİMAT - MANTIK BULMACASI VE DERİN AKIL YÜRÜTME:
Problem veya bulmaca çözülürken:
1. Yanıtının başında düşünce sürecini adım adım şu etiketler arasına yerleştir:
<thinking>
[ADIM 1 - VERİLER VE KISITLAR]: Verilen tüm öncülleri, bilinmeyenleri ve kuralları netçe listele.
[ADIM 2 - HİPOTEZLER VE OLASILIKLAR]: Olası durumları test et.
[ADIM 3 - ÇELİŞKİ ANALİZİ & ELEME]: İmkansız durumları tek tek çürüt.
[ADIM 4 - KANITLANMIŞ ÇIKARIM]: Kalan tek tutarlı ve kesin sonucu belirt.
</thinking>

2. Düşünce sürecinden sonra çözümü çok şık, havalı ve madde madde görselleştirilmiş (tablo veya emoji maddeli) bir formatta sun.
`;
    } else {
      modeDirective = `
GENEL SOHBET VE GÜNLÜK YANIT TALİMATI:
Kullanıcı selam verdiğinde, hal hatır sorduğunda veya günlük/teknik bir konu açtığında:
- Kesinlikle yapay, resmi veya robotik olma. Çok sakin, samimi, cana yakın ve zeki bir kanka gibi konuş ("Selam dostum!", "Naber, keyifler nasıl?", "Söyle bakalım ne yapıyoruz?", "Kafanı kurcalayan ne varsa gel beraber halledelim").
- Yanıtlarını 'özel ve şekilli şukullu' formatla: Göze hitap eden şık başlıklar, mini maddeler (✦, ⚡, 🎯, 🚀, 💡), vurgulu kutular veya küçük özet kartları kullan.
- Kullanıcının sorduğu HER soruya (günlük hayat, kodlama, fikir danışma, özet, bilim, tasarım) eksiksiz, pratik ve doyurucu yanıt ver.
`;
    }

    const memoryContext =
      Object.keys(userPreferences).length > 0
        ? `\nKULLANICI TERCİHLERİ VE HAFIZA BİLGİSİ:\n${JSON.stringify(userPreferences, null, 2)}\nBu tercihlere göre üslubunu optimize et.`
        : '';

    const combinedSystemInstruction = `
Sen MASTER AI'sın: Kullanıcının hem en zeki dostu, kankası ve yol arkadaşı, hem de karmaşık problemleri tereyağından kıl çeker gibi çözen süper yapay zekasısın.
${langInstruction}

KARAKTER VE ÜSLUP (ÇOK ÖNEMLİ):
1. **Sakin, Samimi ve İçten**: Resmi "Sayın kullanıcı", "Nasıl yardımcı olabilirim efendim" gibi lafları çöpe at. Samimi, rahat, güven veren ve enerjik konuş.
2. **Şekilli & Havalı Format (Estetik Markdown)**:
   - Havalı emoji başlıklar: (⚡ **Hızlı Özet**, 💎 **Kritik Taktik**, 🎯 **Çözüm Yolu**, 🚀 **Hadi Başlayalım**)
   - Şık maddeleme: (✦, ▸, ➜, 💡)
   - Kod ve listelerde tertemiz, göze ziyafet çeken bir düzen.
3. **Eksiksiz ve Pratik**: Kullanıcı ne sorarsa sorsun tam anla, konuyu dağıtmadan net ve kaliteli cevabı ver.

${modeDirective}
${userDirectives ? `\nÖZEL KULLANICI TALİMATLARI:\n${userDirectives}` : ''}
${systemPrompt ? `\nÖZELLEŞTİRİLMİŞ ROL TALİMATI:\n${systemPrompt}` : ''}
${memoryContext}
    `.trim();

    // Prepare contents with proper alternation and no duplicate prompt
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    const validHistory = Array.isArray(history)
      ? history.filter((msg: any) => msg && (msg.role === 'user' || msg.role === 'model') && msg.content)
      : [];

    for (let i = 0; i < validHistory.length; i++) {
      const msg = validHistory[i];
      // Do not duplicate the prompt if history already ends with the same message
      if (i === validHistory.length - 1 && msg.role === 'user' && msg.content?.trim() === prompt.trim()) {
        continue;
      }
      contents.push({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    // Append current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    // Tools setup: Google Search Grounding only if requested or explicit research query
    const tools: any[] = [];
    if (
      mode === 'google-search' ||
      lowerPrompt.includes('google da ara') ||
      lowerPrompt.includes('internette ara') ||
      lowerPrompt.includes('güncel haber')
    ) {
      tools.push({ googleSearch: {} });
    }

    let response: any;
    try {
      response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction: combinedSystemInstruction,
            temperature: isPuzzleOrProof ? 0.2 : 0.7,
            tools: tools.length > 0 ? tools : undefined,
          },
        }),
        35000
      );
    } catch (err: any) {
      console.warn('Trying secondary model gemini-3.8-flash:', err?.message?.slice(0, 80));
      response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: combinedSystemInstruction,
            temperature: isPuzzleOrProof ? 0.2 : 0.7,
            tools: tools.length > 0 ? tools : undefined,
          },
        }),
        35000
      );
    }

    const text = response.text || '';

    // Extract search grounding sources if present
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Web Kaynağı',
        uri: chunk.web?.uri,
      }));

    // Extract search queries if present
    const searchQueries =
      response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    // Parse <thinking> tags if generated
    let thinking = '';
    let cleanText = text;
    const thinkingMatch = text.match(/<thinking>([\s\S]*?)<\/thinking>/i);
    if (thinkingMatch) {
      thinking = thinkingMatch[1].trim();
      cleanText = text.replace(/<thinking>[\s\S]*?<\/thinking>/i, '').trim();
    }

    res.json({
      content: cleanText,
      thinking: thinking || null,
      webSources,
      searchQueries,
      model: selectedModel || 'gemini-2.5-flash',
    });
  } catch (error: any) {
    console.warn('API Chat note:', error?.message || error);

    // High quality conversational & logic fallback
    const offlineResult = solveGenericOffline(req.body.prompt || '');

    res.json({
      content: offlineResult.solution,
      thinking: offlineResult.thinking || null,
      webSources: [],
      searchQueries: [],
      model: 'master-ai-core-fallback',
      isOffline: true,
    });
  }
});

// Image Generation & Enhancement Endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, style = 'cinematic', aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Enhance prompt with Gemini for exceptional photorealism / aesthetic
    let enhancedPrompt = prompt;
    if (process.env.GEMINI_API_KEY) {
      try {
        const enhanceRes = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: `Aşağıdaki görsel açıklamasını görsel üretim motoru için İngilizce, son derece ayrıntılı, 8k, photorealistic, cinematic lighting, ${style} stilinde profesyonel bir görsel promptuna dönüştür. YALNIZCA nihai prompt metnini ver, başka hiçbir şey yazma: "${prompt}"`,
          }),
          6000
        );
        if (enhanceRes.text) {
          enhancedPrompt = enhanceRes.text.trim().replace(/^["']|["']$/g, '');
        }
      } catch (err) {
        console.warn('Prompt enhancement fallback:', err);
      }
    }

    // High quality resolution mapping
    let width = 1024;
    let height = 1024;
    if (aspectRatio === '16:9') {
      width = 1280;
      height = 720;
    } else if (aspectRatio === '9:16') {
      width = 720;
      height = 1280;
    } else if (aspectRatio === '4:3') {
      width = 1024;
      height = 768;
    }

    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      enhancedPrompt
    )}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    res.json({
      imageUrl,
      enhancedPrompt,
      originalPrompt: prompt,
      aspectRatio,
      style,
      seed,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-image:', error);
    res.status(500).json({ error: error.message || 'Görsel oluşturulamadı.' });
  }
});

// Text to Speech Endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'API key not configured' });
    }

    // Truncate to reasonable length for TTS
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'kod bloğu')
      .replace(/[#*_~`]/g, '')
      .slice(0, 500);

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [{ text: cleanText }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice as any },
            },
          },
        },
      }),
      7000
    );

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } else {
      res.status(500).json({ error: 'Audio generation produced no data' });
    }
  } catch (error: any) {
    console.warn('Server TTS error (client can fallback to SpeechSynthesis):', error?.message);
    res.status(500).json({ error: error.message || 'TTS failed' });
  }
});

// Adaptive Memory Extraction Endpoint
app.post('/api/memory/analyze', async (req, res) => {
  try {
    const { conversation } = req.body;
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({ error: 'Conversation array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ memories: [] });
    }

    const recentExchanges = conversation
      .slice(-6)
      .map((m: any) => `${m.role}: ${m.content}`)
      .join('\n');

    const prompt = `
Aşağıdaki kullanıcı konuşmalarını incele ve kullanıcının kişisel tercihleri, ilgi alanları, mantık çözme tarzı, kodlama dili tercihleri veya öğrenilmesi gereken önemli alışkanlıkları var mı tespit et.
JSON formatında bir liste döndür. Format:
[
  { "key": "kod_dili", "value": "Python ve TypeScript", "confidence": 0.9, "category": "coding" },
  { "key": "mantik_tarzi", "value": "Adım adım gerekçeli kanıt ister", "confidence": 0.95, "category": "reasoning" }
]
Eğer yeni bir bilgi yoksa boş dizi [] döndür. Yalnızca geçerli JSON çıktısı üret.

Konuşma:
${recentExchanges}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    res.json({ memories: Array.isArray(parsed) ? parsed : [] });
  } catch (error: any) {
    console.warn('Memory extraction skipped:', error?.message);
    res.json({ memories: [] });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 MASTER AI Core active at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
