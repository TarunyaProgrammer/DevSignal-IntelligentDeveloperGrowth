import { Hono } from 'hono';
import { type SupabaseClient } from '@supabase/supabase-js';
import { Octokit } from 'octokit';
import { z } from 'zod';
import { env as honoEnv } from 'hono/adapter';

const syncBodySchema = z.object({
  github_username: z.string().min(1).optional(),
  org_name: z.string().min(1).optional(),
}).refine(d => d.github_username || d.org_name, {
  message: 'Either github_username or org_name is required',
});

const app = new Hono<{ 
  Bindings: { GITHUB_TOKEN: string }; 
  Variables: { userId: string; supabaseAdmin: SupabaseClient };
}>();

app.post('/sync', async (c) => {
  const body = await c.req.json();
  const parsed = syncBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
  }

  const { github_username, org_name } = parsed.data;
  const { GITHUB_TOKEN } = honoEnv(c);
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');

  if (!GITHUB_TOKEN) {
    return c.json({ error: 'Server GitHub token not configured' }, 500);
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  try {
    let repos;
    if (org_name) {
      const { data } = await octokit.rest.repos.listForOrg({ org: org_name, per_page: 100, type: 'all' });
      repos = data;
    } else {
      const { data } = await octokit.rest.repos.listForUser({ username: github_username!, per_page: 100, sort: 'updated' });
      repos = data;
    }

    const rows = repos.map(repo => ({
      github_id: repo.id,
      owner_id: userId,
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      open_issues: repo.open_issues_count,
      default_branch: repo.default_branch,
      updated_at: repo.updated_at,
      last_sync: new Date().toISOString(),
    }));

    const { error } = await supabaseAdmin
      .from('repositories')
      .upsert(rows, { onConflict: 'github_id' });

    if (error) {
      console.error('Batch upsert failed', error);
      return c.json({ error: 'Database sync failed' }, 500);
    }

    return c.json({ success: true, synced: rows.length, timestamp: new Date().toISOString() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Sync error', err);
    return c.json({ error: message }, 500);
  }
});

app.get('/metrics', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');

  const { data, error } = await supabaseAdmin
    .from('repositories')
    .select('stars, forks, language, open_issues')
    .eq('owner_id', userId);

  if (error) {
    return c.json({ total_repos: 0, total_stars: 0, total_forks: 0, languages: {} });
  }

  const total_repos = data.length;
  const total_stars = data.reduce((s: number, r) => s + (r.stars || 0), 0);
  const total_forks = data.reduce((s: number, r) => s + (r.forks || 0), 0);
  const total_issues = data.reduce((s: number, r) => s + (r.open_issues || 0), 0);
  const languages: Record<string, number> = {};
  for (const r of data) {
    if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
  }

  return c.json({ total_repos, total_stars, total_forks, total_issues, languages, last_updated: new Date().toISOString() });
});

export { app as syncRoutes };
