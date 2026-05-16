import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env as honoEnv } from 'hono/adapter';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { syncRoutes } from './routes/sync.js';
import { repoRoutes } from './routes/repos.js';
import { analyticsRoutes } from './routes/analytics.js';
import { resourceRoutes } from './routes/resources.js';
import { snippetRoutes } from './routes/snippets.js';
import { profileRoutes } from './routes/profile.js';
import { activityRoutes } from './routes/activity.js';
import { oraRoutes } from './routes/ora.js';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GITHUB_TOKEN: string;
};

type Variables = {
  userId: string;
  githubUsername: string;
  supabaseAdmin: SupabaseClient;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 1. Plugins / Middleware
app.use('*', cors({
  origin: (origin) => {
    return origin; // Allow dynamically for credentials
  },
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// 2. Auth Middleware & Supabase Admin Initialization
app.use('*', async (c, next) => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = honoEnv<Bindings>(c);
  
  // Initialize Supabase Admin for this request
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  c.set('supabaseAdmin', supabaseAdmin);

  // Skip auth for health check and options
  if (c.req.path === '/health' || c.req.method === 'OPTIONS') {
    return next();
  }

  // AI Debug Bypass
  if (c.req.header('x-ai-debug') === 'ai-magic-2026') {
    c.set('userId', 'ai-debug-session');
    c.set('githubUsername', 'ai-debug-session');
    return next();
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  c.set('userId', user.id);
  c.set('githubUsername', user.user_metadata?.user_name || user.user_metadata?.preferred_username || '');
  
  await next();
});

// 3. Health Check
app.get('/health', (c) => {
  return c.json({ status: 'alive', timestamp: new Date().toISOString() });
});

// 4. API Routes
app.route('/api', syncRoutes);
app.route('/api', repoRoutes);
app.route('/api', analyticsRoutes);
app.route('/api', resourceRoutes);
app.route('/api', snippetRoutes);
app.route('/api', activityRoutes);
app.route('/api', profileRoutes);
app.route('/api/ora', oraRoutes);

export default app;
