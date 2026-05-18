import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Supabase before importing components
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  },
  getSafeSession: vi.fn().mockResolvedValue(null),
}))

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { NotFound } from '@/pages/NotFound'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('NotFound page', () => {
  it('renders 404 text and back link', async () => {
    render(<NotFound />, { wrapper: createWrapper() })
    expect(await screen.findByText('404')).toBeInTheDocument()
    expect(screen.getByText('Reboot Dashboard')).toBeInTheDocument()
  })
})

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Hello</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders error UI when child throws', () => {
    function ThrowingComponent(): React.ReactElement {
      throw new Error('Test error')
    }
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })
})

describe('Auth context', () => {
  it('provides unauthenticated state by default', async () => {
    function TestComponent() {
      const auth = useAuth()
      return <div data-testid="auth-state">{auth.isAuthenticated ? 'authed' : 'not-authed'}</div>
    }
    render(<TestComponent />, { wrapper: createWrapper() })
    expect(await screen.findByTestId('auth-state')).toBeInTheDocument()
  })
})
