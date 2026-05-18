import { describe, it, expect, vi } from 'vitest'

// Mock supabase before importing api
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'test-token' } },
      }),
    },
  },
  getSafeSession: vi.fn().mockResolvedValue({
    access_token: 'test-token',
  }),
}))

describe('API client', () => {
  it('should include authorization header in requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ repos: [] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { fetchRepos } = await import('@/lib/api')
    await fetchRepos()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/repos'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })

  it('should throw on non-ok responses', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Unauthorized' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { fetchRepos } = await import('@/lib/api')
    await expect(fetchRepos()).rejects.toThrow('Unauthorized')
  })
})
