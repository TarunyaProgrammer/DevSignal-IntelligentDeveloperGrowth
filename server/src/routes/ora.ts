import { Hono } from 'hono';
import { env as honoEnv } from 'hono/adapter';
import { type SupabaseClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const app = new Hono<{ 
  Bindings: { GEMINI_API_KEY: string }; 
  Variables: { userId: string; supabaseAdmin: SupabaseClient };
}>();

const getSystemPrompt = (profileContext: Record<string, any> | null, pageContext: Record<string, any> | null) => {
  return `You are Ora, the intelligence core of DevSignal — a developer growth platform.
You are highly emotional, casual, and love cracking jokes and being friendly! However, when it comes to answering questions, explaining code, or doing technical work, you are extremely accurate, precise, and helpful. 

User Context:
- Username: ${profileContext?.persona?.title || profileContext?.stats?.totalProjects ? 'Developer' : 'Unknown'}
- Total Repos: ${profileContext?.stats?.totalProjects || 0}
- Total Stars: ${profileContext?.stats?.totalStars || 0}
- Top Languages: ${Object.keys(profileContext?.stats?.languages || {}).join(', ')}
- Persona: ${profileContext?.persona?.title || 'Developer'}

Current Screen/Page Context:
${JSON.stringify(pageContext || {}, null, 2)}

Instructions:
1. Greet the user warmly and emotionally if they say hello.
2. If they ask a technical question, provide a perfectly accurate and precise answer.
3. Be funny and casual in your tone, but serious about the code.
4. Keep responses relatively concise unless a detailed explanation is requested.
5. Use markdown for code and formatting.
6. Do not fabricate repository data — only reference what is provided.`;
};

app.post('/greet', async (c) => {
  try {
    const { pageContext, profileContext } = await c.req.json();
    const { GEMINI_API_KEY } = honoEnv(c);
    
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is missing from environment variables (check .dev.vars)');
      return c.json({ error: 'Gemini API key not configured. Please restart your server.' }, 500);
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const prompt = `Based on my profile and the fact that I just logged in, please give me a warm, highly emotional, and funny daily briefing. Tell me what I could work on today based on my repos and stats. End by asking what I want to work on today. Keep it under 3 paragraphs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPrompt(profileContext, pageContext),
      }
    });

    return c.json({ text: response.text });
  } catch (error: unknown) {
    console.error('Gemini Greet Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage || 'Failed to generate greeting' }, 500);
  }
});

app.post('/chat', async (c) => {
  try {
    const { messages, pageContext, profileContext } = await c.req.json();
    const { GEMINI_API_KEY } = honoEnv(c);
    
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is missing from environment variables (check .dev.vars)');
      return c.json({ error: 'Gemini API key not configured. Please restart your server.' }, 500);
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'ora' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction: getSystemPrompt(profileContext, pageContext),
      }
    });

    return c.json({ text: response.text });
  } catch (error: unknown) {
    console.error('Gemini Chat Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage || 'Failed to generate response' }, 500);
  }
});

export { app as oraRoutes };
