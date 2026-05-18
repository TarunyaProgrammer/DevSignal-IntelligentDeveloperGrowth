import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { shouldBypassLiveAuth } from '@/lib/env';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(!shouldBypassLiveAuth());
  const [isSandboxFallback, setIsSandboxFallback] = useState(false);

  useEffect(() => {
    if (shouldBypassLiveAuth()) {
      return;
    }

    supabase.auth.getSession()
      .then(({ data: { session: s } }) => {
        setSession(s);
        setUser(s?.user ?? null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err instanceof TypeError || (err instanceof Error && err.message.includes('fetch'))) {
          console.warn('[DevSignal] Supabase is unreachable, dynamically falling back to Sandbox Mode:', err);
          setIsSandboxFallback(true);
        } else {
          console.error('[DevSignal] Initial auth session check failed:', err);
        }
        setIsLoading(false);
      });

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setIsLoading(false);
      });
      return () => {
        subscription?.unsubscribe();
      };
    } catch (err) {
      console.warn('[DevSignal] Auth state subscription failed:', err);
    }
  }, []);

  const signInWithGitHub = async () => {
    if (shouldBypassLiveAuth() || isSandboxFallback) return;
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/ora` },
    });
  };

  const logout = async () => {
    if (shouldBypassLiveAuth() || isSandboxFallback) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const mockUser = {
    id: '594b1a1c-aa94-43c5-9f1f-077948c3455f',
    email: 'tarunya.programmer@gmail.com',
    user_metadata: {
      name: 'Tarunya Programmer',
      full_name: 'Tarunya Programmer',
      user_name: 'TarunyaProgrammer',
      preferred_username: 'TarunyaProgrammer',
      avatar_url: 'https://avatars.githubusercontent.com/u/84562027?v=4'
    }
  } as unknown as User;

  const bypass = shouldBypassLiveAuth() || isSandboxFallback;
  const activeUser = bypass ? mockUser : user;
  const activeSession = bypass ? ({ access_token: 'mock-debug-token', user: mockUser } as unknown as Session) : session;
  const activeIsLoading = bypass ? false : isLoading;
  const activeIsAuthenticated = bypass ? true : !!user;

  return (
    <AuthContext.Provider value={{ 
      user: activeUser, 
      session: activeSession, 
      isLoading: activeIsLoading, 
      isAuthenticated: activeIsAuthenticated, 
      signInWithGitHub, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
