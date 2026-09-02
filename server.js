import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

app.post('/api/ai/generate-description', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is missing. Add it to your environment or .env file.',
      });
    }

    const payload = req.body || {};
    const title = payload.title || 'عقار سكني في سوريا';
    const category = payload.category || 'houses';
    const city = payload.city || 'دمشق';
    const dealType = payload.dealType || 'sale';
    const price = payload.price || 0;
    const area = payload.area || 0;
    const rooms = payload.bedrooms || '3 غرف نوم';
    const descriptionSeed = payload.description || '';

    const prompt = `
أنت مساعد كتابة إعلانات عقارية احترافية باللغة العربية. اكتب وصفاً جذاباً ومفصلاً للإعلان التالي، في أسلوب تسويقي احترافي وبأسلوب عربي عربي فصيح ومناسب لسوق العقارات في سوريا.

بيانات الإعلان:
- العنوان: ${title}
- القسم: ${category}
- المدينة: ${city}
- نوع الصفقة: ${dealType}
- السعر: ${price} ل.س
- المساحة: ${area} م²
- غرف النوم: ${rooms}
- تفاصيل إضافية: ${descriptionSeed}

الهدف: كتابة وصف طويل ومقنع يبرز الموقع، المميزات، الإيجابيات، والطابع الاحترافي، مع الحفاظ على صياغة عربية طبيعية. لا تستخدم كلمات غامضة. اجعل الوصف مناسباً للإعلان العقاري الحقيقي.

الناتج: فقط النص الوصف بعلامات سطر جديد فقط، لا تضع عنوان أو شروحات إضافية أو قائمة bullets.
    `.trim();

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') ||
      '';

    if (!text.trim()) {
      return res.status(502).json({ error: 'لم يتم إرجاع نص مناسب من Gemini.' });
    }

    res.json({ description: text.trim() });
  } catch (error) {
    console.error('Gemini route error:', error);
    res.status(500).json({
      error: 'فشل في إنشاء الوصف تلقائياً. تأكد من صحة مفتاح Gemini واسم النموذج.',
      details: error instanceof Error ? error.message : 'unknown_error',
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'laqta-ai-server' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LAQTA AI server running on http://localhost:${PORT}`);
});
