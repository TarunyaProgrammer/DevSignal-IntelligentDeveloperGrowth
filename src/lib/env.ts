export type AppMode = 'mock' | 'offline' | 'production' | 'sandbox';

let runtimeMode: AppMode | null = null;

/**
 * Gets the current application execution mode.
 * 
 * - 'production': Uses real Supabase live endpoints & production Hono APIs.
 * - 'sandbox': Sandbox mode where Supabase is unreachable/offline but backend Hono APIs are accessible with AI bypass.
 * - 'mock' / 'offline': Full local frontend simulation without external backend/Supabase calls.
 */
export function getAppMode(): AppMode {
  // If explicitly overridden via local storage
  if (typeof window !== 'undefined') {
    const forced = localStorage.getItem('devsignal_mode');
    if (forced === 'mock' || forced === 'offline' || forced === 'production' || forced === 'sandbox') {
      return forced as AppMode;
    }
    
    // Check URL query parameters
    const params = new URLSearchParams(window.location.search);
    const queryMode = params.get('mode');
    if (queryMode === 'mock' || queryMode === 'offline' || queryMode === 'production' || queryMode === 'sandbox') {
      localStorage.setItem('devsignal_mode', queryMode);
      return queryMode as AppMode;
    }
  }

  // If in test suite execution
  const globalObj = globalThis as unknown as { process?: { env?: { NODE_ENV?: string } } };
  if (typeof globalObj.process !== 'undefined' && (globalObj.process?.env?.NODE_ENV === 'test' || import.meta.env.MODE === 'test')) {
    return 'mock';
  }

  if (runtimeMode) {
    return runtimeMode;
  }

  // Default to production mode. It will dynamically self-heal/fallback to sandbox if Supabase is unreachable.
  return 'production';
}

export function setRuntimeMode(mode: AppMode) {
  runtimeMode = mode;
}

/**
 * Helper to determine if we should bypass live Supabase auth checks and use mocked identities.
 */
export function shouldBypassLiveAuth(): boolean {
  const mode = getAppMode();
  return mode === 'mock' || mode === 'sandbox' || mode === 'offline';
}
