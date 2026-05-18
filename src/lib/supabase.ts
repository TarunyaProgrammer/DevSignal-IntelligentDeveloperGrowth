import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[DevSignal] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

import { shouldBypassLiveAuth, setRuntimeMode } from './env';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export async function getSafeSession() {
  if (shouldBypassLiveAuth()) {
    // Gracefully return a standard mocked session token for offline sandbox / mock mode
    return {
      access_token: 'mock-debug-token',
      user: {
        id: '594b1a1c-aa94-43c5-9f1f-077948c3455f',
        email: 'tarunya.programmer@gmail.com',
        user_metadata: {
          name: 'Tarunya Programmer',
          full_name: 'Tarunya Programmer',
          user_name: 'TarunyaProgrammer',
          preferred_username: 'TarunyaProgrammer',
          avatar_url: 'https://avatars.githubusercontent.com/u/84562027?v=4'
        }
      }
    } as unknown as Session;
  }

  try {
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  } catch (err) {
    if (err instanceof TypeError || (err instanceof Error && err.message.includes('fetch'))) {
      console.warn('[DevSignal] Supabase is unreachable, dynamically falling back to Sandbox Mode:', err);
      setRuntimeMode('sandbox');
      return {
        access_token: 'mock-debug-token',
        user: {
          id: '594b1a1c-aa94-43c5-9f1f-077948c3455f',
          email: 'tarunya.programmer@gmail.com',
          user_metadata: {
            name: 'Tarunya Programmer',
            full_name: 'Tarunya Programmer',
            user_name: 'TarunyaProgrammer',
            preferred_username: 'TarunyaProgrammer',
            avatar_url: 'https://avatars.githubusercontent.com/u/84562027?v=4'
          }
        }
      } as unknown as Session;
    } else {
      console.error('[DevSignal] Supabase getSession failed:', err);
    }
    return null;
  }
}
