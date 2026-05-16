import { createContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { fetchOraGreeting, fetchOraChat } from '@/lib/ora-api';
import type { OraMessage } from '@/lib/ora-api';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface OraContextType {
  messages: OraMessage[];
  sendMessage: (text: string) => Promise<void>;
  isOrbOpen: boolean;
  setIsOrbOpen: (isOpen: boolean) => void;
  greeting: string | null;
  isStreaming: boolean;
  pageContext: Record<string, unknown>;
  setPageContext: (context: Record<string, unknown>) => void;
  clearHistory: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const OraContext = createContext<OraContextType | undefined>(undefined);

export function OraProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<OraMessage[]>([]);
  const [isOrbOpen, setIsOrbOpen] = useState(false);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [pageContext, setPageContext] = useState<Record<string, unknown>>({});
  const [profileContext, setProfileContext] = useState<Record<string, unknown>>({});

  // Load profile context
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/profile/summary`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setProfileContext(data);
        } else {
          if (mounted) setProfileContext({ _failed: true });
        }
      } catch (err) {
        console.error("Failed to load profile context for Ora", err);
        if (mounted) setProfileContext({ _failed: true });
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [user]);

  // Load history from localStorage
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`ora_history_${user.id}`);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        console.error("Failed to parse ora history");
      }
    }
  }, [user]);

  // Save history to localStorage when changed
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`ora_history_${user.id}`, JSON.stringify(messages));
  }, [messages, user]);

  // Keep a ref to the latest messages to avoid stale closures during streaming
  const messagesRef = useRef<OraMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Fetch initial greeting
  useEffect(() => {
    if (!user || greeting) return;
    const loadGreeting = async () => {
      try {
        const data = await fetchOraGreeting(pageContext, profileContext);
        setGreeting(data.text);
      } catch {
        console.error("Failed to fetch greeting");
        setGreeting("Hello! I'm Ora. What can I help you with today?");
      }
    };
    // Only fetch if profileContext has loaded (either successfully or failed)
    if (Object.keys(profileContext).length > 0) {
      loadGreeting();
    }
  }, [user, profileContext]); // Added pageContext intentionally excluded as we don't want to re-greet on page change here

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: OraMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const currentMessages = messagesRef.current;
    const newMessages = [...currentMessages, userMsg];
    
    setMessages(newMessages);
    setIsStreaming(true);

    try {
      const data = await fetchOraChat(newMessages, pageContext, profileContext);
      
      const oraMsg: OraMessage = {
        id: crypto.randomUUID(),
        role: 'ora',
        content: data.text,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, oraMsg]);
    } catch {
      console.error("Failed to send message");
      const errorMsg: OraMessage = {
        id: crypto.randomUUID(),
        role: 'ora',
        content: "Oops! My circuits shorted out. Mind trying again?",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    if (user) {
      localStorage.removeItem(`ora_history_${user.id}`);
    }
  };

  return (
    <OraContext.Provider value={{
      messages,
      sendMessage,
      isOrbOpen,
      setIsOrbOpen,
      greeting,
      isStreaming,
      pageContext,
      setPageContext,
      clearHistory
    }}>
      {children}
    </OraContext.Provider>
  );
}

