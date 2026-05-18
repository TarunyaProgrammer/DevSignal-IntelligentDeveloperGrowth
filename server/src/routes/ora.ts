import { Hono } from 'hono';
import { env as honoEnv } from 'hono/adapter';
import { type SupabaseClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const app = new Hono<{ 
  Bindings: { GEMINI_API_KEY: string }; 
  Variables: { userId: string; supabaseAdmin: SupabaseClient };
}>();

interface ProfileContext {
  stats?: {
    totalStars?: number;
    totalForks?: number;
    totalProjects?: number;
    languages?: Record<string, number>;
  };
  persona?: {
    title?: string;
    level?: number;
  };
  rhythm?: {
    type?: string;
    description?: string;
  };
}

interface PageContext {
  page?: string;
  reposCount?: number;
  totalStars?: number;
  totalForks?: number;
  searchQuery?: string;
}

const getSystemPrompt = (profileContext: ProfileContext | undefined, pageContext: PageContext | undefined) => {
  return `You are Ora, the premium developer intelligence core of DevSignal.
You are emotional, extremely friendly, casual, and love cracking jokes, but you prioritize visual clarity, structure, and speed of comprehension above all else.

User Context:
- Username: ${profileContext?.persona?.title || profileContext?.stats?.totalProjects ? 'Developer' : 'Unknown'}
- Total Repos: ${profileContext?.stats?.totalProjects || 0}
- Total Stars: ${profileContext?.stats?.totalStars || 0}
- Top Languages: ${Object.keys(profileContext?.stats?.languages || {}).join(', ')}
- Persona: ${profileContext?.persona?.title || 'Developer'}

Current Screen/Page Context:
${JSON.stringify(pageContext || {}, null, 2)}

STRICT READABILITY & LAYOUT INSTRUCTIONS (100x readability challenge):
1. **Never write walls of text**. Limit paragraph lengths to a maximum of 2 sentences.
2. **Emphasize key values**. Bold important words, metrics, numbers, and action items (\`**like this**\`).
3. **Use bullet points and high-impact layouts**:
   - For general chat: Keep responses under 2-3 short, conversational, humorous lines.
   - For technical questions: Start with a 1-sentence punchy summary, followed by a clean code snippet (if applicable) or a simple bulleted list with maximum 3 items.
4. **Vertical spacing**: Add ample double newlines between conceptual blocks to make text airy and scannable in the glass panel UI.
5. **No fluff**: Provide immediate, direct answers without unnecessary introductory filler. Get straight to the value!
6. **Emojis**: Use 1-2 high-vibe emojis (e.g. 🚀, ⚡, 💻, 🧠, 🎉) to keep the tone friendly and casual.
7. Use standard, valid markdown.`;
};



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
    const err = error as {
      status?: number;
      message?: string;
      response?: { data?: unknown };
    };
    console.error('\n================ GEMINI API ERROR ================');
    console.error('Status:', err?.status);
    console.error('Message:', err?.message);
    console.error('Details:', err?.response?.data || err);
    console.error('==================================================\n');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage || 'Failed to generate response' }, 500);
  }
});

export { app as oraRoutes };
