import { Hono } from 'hono';
import { Octokit } from 'octokit';
import { env as honoEnv } from 'hono/adapter';
import { getCache, setCache } from '../utils/cache.js';

const app = new Hono<{ 
  Bindings: { GITHUB_TOKEN: string }; 
  Variables: { userId: string; supabaseAdmin: any };
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
    const cachedDetails = getCache<any>(cacheKey);
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
      } catch (err: any) {
        console.warn({ err: err.message, status: err.status, label }, `Failed to fetch ${label}`);
        return fallback;
      }
    };

    const [languages, contributors, activity] = await Promise.all([
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
      safeFetch(
        octokit.rest.repos.getCommitActivityStats({ owner, repo: name }).then(r => r.data),
        'activity',
        []
      )
    ]);

    const extendedDetails = {
      languages: languages || {},
      contributors: contributors || [],
      activity: Array.isArray(activity) ? activity.slice(-12) : [],
      readme: ''
    };

    // Cache the result
    setCache(cacheKey, extendedDetails);

    return c.json({ repo: { ...repo, ...extendedDetails } });
  } catch (err) {
    console.error({ err }, 'Unexpected crash in parallel fetching logic');
    return c.json({ repo: { ...repo, languages: {}, contributors: [], activity: [], readme: '' } });
  }
});

export { app as repoRoutes };
