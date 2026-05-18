import { getSafeSession } from './supabase';

import { shouldBypassLiveAuth } from './env';

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname.startsWith('192.168.'));

export const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:3001' : window.location.origin);

async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSafeSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (shouldBypassLiveAuth()) {
    headers['x-ai-debug'] = 'ai-magic-2026';
    headers['Authorization'] = 'Bearer mock-debug-token';
  } else if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers, ...options?.headers } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Repos
export const fetchRepos = () => apiFetch<{ repos: Repository[] }>('/api/repos');
export const fetchRepo = (id: string) => apiFetch<{ repo: Repository }>(`/api/repos/${id}`);

// Sync
export const triggerSync = (body: { github_username?: string; org_name?: string }) =>
  apiFetch<{ success: boolean; synced: number }>('/api/sync', { method: 'POST', body: JSON.stringify(body) });

// Analytics
export const fetchAnalytics = () => apiFetch<Analytics>('/api/analytics');
export const fetchMetrics = () => apiFetch<Metrics>('/api/metrics');

// Resources
export const fetchResources = () => apiFetch<{ resources: Resource[] }>('/api/resources');

// Snippets
export const fetchSnippets = () => apiFetch<{ snippets: Snippet[] }>('/api/snippets');
export const createSnippet = (body: { title: string; code: string; language: string }) =>
  apiFetch<{ snippet: Snippet }>('/api/snippets', { method: 'POST', body: JSON.stringify(body) });
export const updateSnippet = (id: string, body: Partial<{ title: string; code: string; language: string }>) =>
  apiFetch<{ snippet: Snippet }>(`/api/snippets/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const deleteSnippet = (id: string) =>
  apiFetch<void>(`/api/snippets/${id}`, { method: 'DELETE' });

// Activity
export const fetchActivity = () => apiFetch<{ activities: ActivityItem[] }>('/api/activity');

// Types
export interface Repository {
  id: string;
  github_id: number;
  owner_id: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  open_issues: number;
  default_branch: string;
  updated_at: string;
  last_sync: string;
  created_at: string;
  // Extended details
  languages?: Record<string, number>;
  contributors?: {
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
  }[];
  activity?: {
    total: number;
    week: number;
    days: number[];
  }[];
  readme?: string;
}

export interface Analytics {
  total_repos: number;
  total_stars: number;
  total_forks: number;
  total_issues: number;
  languages: { name: string; percentage: number }[];
  last_updated: string;
}

export interface Metrics {
  total_repos: number;
  total_stars: number;
  total_forks: number;
  total_issues: number;
  languages: Record<string, number>;
  last_updated: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'repo' | 'course';
  category: string;
  duration: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  rating: number;
  created_at: string;
}

export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  code: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityItem {
  id: string;
  type: 'commit' | 'pr' | 'merge' | 'issue' | 'other';
  title: string;
  repo: string;
  time: string;
  description: string;
}
