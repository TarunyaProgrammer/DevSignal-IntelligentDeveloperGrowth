import { Hono } from 'hono';
import { Octokit } from 'octokit';
import { env as honoEnv } from 'hono/adapter';
import { type SupabaseClient } from '@supabase/supabase-js';
import { getCache, setCache } from '../utils/cache.js';

const app = new Hono<{ 
  Bindings: { GITHUB_TOKEN: string }; 
  Variables: { userId: string; supabaseAdmin: SupabaseClient };
}>();

// GET /api/repos — list user's synced repositories
app.get('/repos', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');

  const { data, error } = await supabaseAdmin
    .from('repositories')
    .select('*')
    .eq('owner_id', userId)
    .order('stars', { ascending: false });

  if (error) {
    return c.json({ repos: [], error: error.message });
  }

  return c.json({ repos: data });
});

// GET /api/repos/:id — single repo detail with extended analytics
app.get('/repos/:id', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');
  const id = c.req.param('id');
  const refreshRequested = c.req.query('refresh') === 'true';

  const { data: repo, error } = await supabaseAdmin
    .from('repositories')
    .select('*')
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (error || !repo) {
    console.error({ err: error, repoId: id }, 'Failed to fetch repository from DB');
    return c.json({ error: 'Repository not found' }, 404);
  }

  const cacheKey = `repo_details_${repo.github_id}`;
  
  // Check cache unless refresh is requested
  if (!refreshRequested) {
    const cachedDetails = getCache<Record<string, unknown>>(cacheKey);
    if (cachedDetails) {
      // Serving repo details from cache
      return c.json({ repo: { ...repo, ...cachedDetails } });
    }
  } else {
    // Force refresh requested, bypassing cache
  }

  // Parallel fetching from GitHub
  const { GITHUB_TOKEN } = honoEnv(c);
  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  
  const nameParts = repo.name.split('/');
  const owner = nameParts.length >= 2 ? nameParts[0] : '';
  const name = nameParts.length >= 2 ? nameParts[1] : nameParts[0];

  if (!owner || !name) {
    console.error({ fullName: repo.name }, 'Invalid repository full_name format');
    return c.json({ repo: { ...repo, languages: {}, contributors: [], activity: [], readme: '' } });
  }

  try {
    const safeFetch = async <T,>(promise: Promise<T>, label: string, fallback: T): Promise<T> => {
      try {
        const result = await promise;
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        const status = (err as { status?: number }).status;
        console.warn({ err: message, status, label }, `Failed to fetch ${label}`);
        return fallback;
      }
    };

    const [languages, contributors, activity, readme] = await Promise.all([
      safeFetch(
        octokit.rest.repos.listLanguages({ owner, repo: name }).then(r => r.data),
        'languages',
        {}
      ),
      safeFetch(
        octokit.rest.repos.listContributors({ owner, repo: name, per_page: 20 }).then(r => r.data.map(c => ({
          login: c.login,
          avatar_url: c.avatar_url,
          contributions: c.contributions,
          html_url: c.html_url
        }))),
        'contributors',
        []
      ),
      // Specialized fetch for activity to handle 202 Computing status
      (async () => {
        try {
          const r = await octokit.rest.repos.getCommitActivityStats({ owner, repo: name });
          if (r.status === 202) return null; // Still computing
          return r.data;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          const status = (err as { status?: number }).status;
          console.warn({ err: message, status }, 'Failed to fetch activity');
          return []; // True error or no data
        }
      })(),
      safeFetch(
        octokit.rest.repos.getReadme({ owner, repo: name }).then(r => {
          const content = r.data.content.replace(/\s/g, '');
          return decodeURIComponent(escape(atob(content)));
        }),
        'readme',
        ''
      )
    ]);

    const extendedDetails = {
      languages: languages || {},
      contributors: contributors || [],
      activity: Array.isArray(activity) ? activity.slice(-12) : activity, // activity could be null here
      readme: readme || ''
    };

    // Cache the result
    // If activity is null (Computing 202), cache for a very short time to allow retry
    const cacheTTL = extendedDetails.activity === null ? 30 : 3600;
    setCache(cacheKey, extendedDetails, cacheTTL);

    return c.json({ repo: { ...repo, ...extendedDetails } });
  } catch (err) {
    console.error({ err }, 'Unexpected crash in parallel fetching logic');
    return c.json({ repo: { ...repo, languages: {}, contributors: [], activity: [], readme: '' } });
  }
});

export { app as repoRoutes };
