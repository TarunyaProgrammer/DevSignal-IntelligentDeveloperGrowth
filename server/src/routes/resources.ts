import { Hono } from 'hono';
import { type SupabaseClient } from '@supabase/supabase-js';

const app = new Hono<{ 
  Variables: { supabaseAdmin: SupabaseClient };
}>();

// GET /api/resources — list all curated resources
app.get('/resources', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');

  const { data, error } = await supabaseAdmin
    .from('resources')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ resources: data });
});

export { app as resourceRoutes };
