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
      // Specialized fetch for activity with manual commit fallback
      (async () => {
        try {
          const r = await octokit.rest.repos.getCommitActivityStats({ owner, repo: name });
          
          if (r.status === 200 && Array.isArray(r.data) && r.data.length > 0) {
            return r.data;
          }

          // Fallback: Manually compute last 12 weeks of activity from recent commits
          const twelveWeeksAgo = new Date();
          twelveWeeksAgo.setUTCDate(twelveWeeksAgo.getUTCDate() - 84);
          
          const commitsRes = await octokit.rest.repos.listCommits({ 
            owner, 
            repo: name, 
            since: twelveWeeksAgo.toISOString(),
            per_page: 100 
          });

          // Generate empty 12-week array
          const weeks: { total: number; week: number; days: number[] }[] = [];
          const now = new Date();
          now.setUTCHours(0, 0, 0, 0);
          const dayOfWeek = now.getUTCDay();
          now.setUTCDate(now.getUTCDate() - dayOfWeek); // Start of current week
          
          for (let i = 11; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setUTCDate(now.getUTCDate() - (i * 7));
            weeks.push({
              total: 0,
              week: Math.floor(weekStart.getTime() / 1000),
              days: [0, 0, 0, 0, 0, 0, 0]
            });
          }

          // Populate with commits
          commitsRes.data.forEach((commit) => {
            if (!commit.commit.author?.date) return;
            const date = new Date(commit.commit.author.date);
            const time = date.getTime();
            
            const weekObj = weeks.find((w, idx) => {
               const weekStart = w.week * 1000;
               const nextWeekStart = idx < weeks.length - 1 ? weeks[idx+1].week * 1000 : Infinity;
               return time >= weekStart && time < nextWeekStart;
            });

            if (weekObj) {
              weekObj.total += 1;
              const day = date.getUTCDay();
              weekObj.days[day] += 1;
            }
          });

          return weeks;
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
      // If activity is null, keep it null for the frontend to poll. If it's not an array (e.g. {} or undefined), fallback to []
      activity: activity === null ? null : (Array.isArray(activity) ? activity.slice(-12) : []),
      readme: readme || ''
    };

    // Cache the result
    // If activity is null (Computing 202), cache for only 2 seconds so React Query's 5s poll hits GitHub directly.
    const cacheTTL = extendedDetails.activity === null ? 2 : 3600;
    setCache(cacheKey, extendedDetails, cacheTTL);

    return c.json({ repo: { ...repo, ...extendedDetails } });
  } catch (err) {
    console.error({ err }, 'Unexpected crash in parallel fetching logic');
    return c.json({ repo: { ...repo, languages: {}, contributors: [], activity: [], readme: '' } });
  }
});

// GET /api/repos/:id/tree — fetch full file tree structure
app.get('/repos/:id/tree', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');
  const id = c.req.param('id');

  const { data: repo, error } = await supabaseAdmin
    .from('repositories')
    .select('name, default_branch')
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (error || !repo) return c.json({ error: 'Repository not found' }, 404);

  const { GITHUB_TOKEN } = honoEnv(c);
  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  
  const [owner, name] = repo.name.split('/');

  try {
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo: name,
      tree_sha: repo.default_branch || 'main',
      recursive: 'true'
    });

    const filteredTree = treeData.tree.filter((item: any) => {
      const parts = item.path.split('/');
      return !parts.includes('node_modules') &&
             !parts.includes('.git') &&
             !parts.includes('dist') &&
             !parts.includes('build') &&
             !parts.includes('.next') &&
             !parts.includes('.svelte-kit');
    });

    return c.json({ tree: filteredTree });
  } catch (err: unknown) {
    console.error('Failed to fetch tree:', err);
    return c.json({ error: 'Failed to fetch file tree' }, 500);
  }
});

// GET /api/repos/:id/blob/:sha — fetch file content
app.get('/repos/:id/blob/:sha', async (c) => {
  const id = c.req.param('id');
  const sha = c.req.param('sha');
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');

  const { data: repo } = await supabaseAdmin
    .from('repositories')
    .select('name')
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (!repo) return c.json({ error: 'Not found' }, 404);

  const { GITHUB_TOKEN } = honoEnv(c);
  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  const [owner, name] = repo.name.split('/');

  try {
    const { data } = await octokit.rest.git.getBlob({
      owner,
      repo: name,
      file_sha: sha
    });

    // GitHub returns base64
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return c.json({ content });
  } catch {
    return c.json({ error: 'Failed to fetch blob' }, 500);
  }
});

export { app as repoRoutes };
