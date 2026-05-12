import { Hono } from 'hono';
import { type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

const createSnippetSchema = z.object({
  title: z.string().min(1).max(200),
  code: z.string().min(1),
  language: z.string().min(1),
});

const updateSnippetSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  code: z.string().min(1).optional(),
  language: z.string().min(1).optional(),
});

const app = new Hono<{ 
  Variables: { userId: string; supabaseAdmin: SupabaseClient };
}>();

// GET /api/snippets — list user's saved snippets
app.get('/snippets', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');

  const { data, error } = await supabaseAdmin
    .from('snippets')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) return c.json({ snippets: [] });
  return c.json({ snippets: data });
});

// POST /api/snippets — save a new snippet
app.post('/snippets', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');
  const body = await c.req.json();
  
  const parsed = createSnippetSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('snippets')
    .insert({ ...parsed.data, user_id: userId })
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ snippet: data }, 201);
});

// PATCH /api/snippets/:id — update a snippet
app.patch('/snippets/:id', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');
  const id = c.req.param('id');
  const body = await c.req.json();

  const parsed = updateSnippetSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('snippets')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Snippet not found' }, 404);
  }

  return c.json({ snippet: data });
});

// DELETE /api/snippets/:id — delete a snippet
app.delete('/snippets/:id', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');
  const id = c.req.param('id');

  const { error } = await supabaseAdmin
    .from('snippets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.body(null, 204);
});

export { app as snippetRoutes };
