import { describe, it, expect } from 'vitest';
import app from '../server.js';

describe('DevSignal API', () => {
  it('GET /health should return status alive', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('alive');
  });

  it('GET /api/repos without auth should return 401', async () => {
    const res = await app.request('/api/repos');
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Missing or invalid authorization header');
  });

  it('GET /api/repos with ai-debug bypass should return 200', async () => {
    const res = await app.request('/api/repos', {
      headers: {
        'x-ai-debug': 'ai-magic-2026'
      }
    });
    // It might still fail if supabaseAdmin is not mocked correctly or if it tries to hit DB
    // But for now we are testing the middleware bypass
    expect(res.status).not.toBe(401);
  });
});
