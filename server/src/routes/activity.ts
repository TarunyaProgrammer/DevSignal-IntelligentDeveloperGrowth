import { Hono } from 'hono';
import { Octokit } from 'octokit';
import { env as honoEnv } from 'hono/adapter';
import { type SupabaseClient } from '@supabase/supabase-js';

const app = new Hono<{ 
  Bindings: { GITHUB_TOKEN: string }; 
  Variables: { userId: string; githubUsername: string; supabaseAdmin: SupabaseClient };
}>();

app.get('/activity', async (c) => {
  const { GITHUB_TOKEN } = honoEnv(c);
  const supabaseAdmin = c.get('supabaseAdmin');
  const userId = c.get('userId');
  const metadataGithubUsername = c.get('githubUsername');

  if (!GITHUB_TOKEN) {
    return c.json({ error: 'Server GitHub token not configured' }, 500);
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  try {
    // 1. Identify GitHub Username
    let githubUsername = metadataGithubUsername;
    
    // Starting activity fetch

    if (!githubUsername || githubUsername === 'ai-debug-session') {
      // Fallback: Check repositories table
      const { data: repos, error: repoError } = await supabaseAdmin
        .from('repositories')
        .select('name')
        .eq('owner_id', userId)
        .limit(1);

      if (!repoError && repos && repos.length > 0) {
        githubUsername = repos[0].name.split('/')[0];
        // Username found via repository fallback
      }
    }

    if (!githubUsername || githubUsername === 'ai-debug-session') {
      console.warn({ userId }, 'No GitHub username identified for activity fetch');
      return c.json({ activities: [] });
    }

    // 2. Fetch Public Events from GitHub
    // Fetching events from GitHub
    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username: githubUsername,
      per_page: 20
    });

    // GitHub events retrieved

    // 3. Map to ActivityItem format
    const activities = events
      .map(event => {
        let type: 'commit' | 'pr' | 'merge' | 'issue' | 'other' = 'other';
        let title = '';
        let description = '';

        switch (event.type) {
          case 'PushEvent': {
            type = 'commit';
            const payload = event.payload as { commits?: { message?: string }[]; head?: string; ref?: string };
            const commits = payload.commits || [];
            
            if (Array.isArray(commits) && commits.length > 0) {
              title = commits[commits.length - 1].message || 'Updated repository';
            } else if (payload.head) {
              title = `Push: ${payload.head.substring(0, 7)}`;
            } else {
              const branch = payload.ref?.replace('refs/heads/', '') || 'main';
              title = `Pushed to ${branch}`;
            }
            
            description = `Pushed to ${event.repo.name}`;
            break;
          }
          case 'PullRequestEvent': {
            const payload = event.payload as { pull_request?: { title?: string; merged?: boolean }; action?: string };
            const pr = payload.pull_request;
            type = payload.action === 'closed' && pr?.merged ? 'merge' : 'pr';
            title = pr?.title || 'PR Activity';
            description = `${payload.action} PR in ${event.repo.name}`;
            break;
          }
          case 'IssuesEvent': {
            const payload = event.payload as { issue?: { title?: string }; action?: string };
            type = 'issue';
            title = payload.issue?.title || 'Issue Activity';
            description = `${payload.action} issue in ${event.repo.name}`;
            break;
          }
          default:
            return null;
        }

        return {
          id: event.id,
          type,
          title,
          repo: event.repo.name.split('/')[1] || event.repo.name,
          time: formatTimeAgo(new Date(event.created_at || '')),
          description
        };
      })
      .filter(Boolean)
      .slice(0, 4);

    return c.json({ activities });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Activity fetch error', err);
    return c.json({ error: message }, 500);
  }
});

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

export { app as activityRoutes };
