import { Hono } from 'hono';
import { type SupabaseClient } from '@supabase/supabase-js';

const app = new Hono<{ 
  Variables: { userId: string; supabaseAdmin: SupabaseClient };
}>();

app.get('/profile/summary', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');

  // AI Debug Mock Data
  if (userId === 'ai-debug-session') {
    return c.json({
      stats: {
        totalStars: 128,
        totalForks: 44,
        totalProjects: 15,
        languages: {
          "React": 12,
          "TypeScript": 10,
          "TailwindCSS": 8,
          "Node.js": 6,
          "Framer Motion": 5,
          "Supabase": 4,
          "PostgreSQL": 3
        }
      },
      persona: {
        title: "The Frontend Alchemist",
        level: 8
      },
      rhythm: {
        type: "Night Owl",
        description: "Your signal peaks in the quiet hours of the night, generating high-velocity code under the moonlight."
      }
    });
  }

  const { data: repos, error } = await supabaseAdmin
    .from('repositories')
    .select('stars, forks, language, updated_at, name')
    .eq('owner_id', userId);

  if (error || !repos) {
    return c.json({ stats: null, persona: null });
  }

  const totalStars = repos.reduce((acc: number, r) => acc + (r.stars || 0), 0);
  const totalForks = repos.reduce((acc: number, r) => acc + (r.forks || 0), 0);
  const totalProjects = repos.length;

  // Aggregate languages
  const languages: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) {
      languages[r.language] = (languages[r.language] || 0) + 1;
    }
  });

  // Calculate Persona
  let persona = "The Code Voyager";
  const topLang = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0];
  
  if (totalStars > 50) persona = "The Star Magnet";
  else if (totalForks > 25) persona = "The Architect of Collaboration";
  else if (topLang === 'TypeScript' || topLang === 'JavaScript') persona = "The Frontend Alchemist";
  else if (topLang === 'Rust' || topLang === 'C++') persona = "The Performance Sage";
  else if (totalProjects > 10) persona = "The Prolific Builder";

  // Simple Rhythm Analysis (Mocked for now, in a real app would use commit times)
  const rhythm = {
    type: "Night Owl",
    description: "Your signal peaks in the quiet hours of the night."
  };

  return c.json({
    stats: {
      totalStars,
      totalForks,
      totalProjects,
      languages
    },
    persona: {
      title: persona,
      level: Math.floor(totalProjects / 2) + 1
    },
    rhythm
  });
});

export { app as profileRoutes };
