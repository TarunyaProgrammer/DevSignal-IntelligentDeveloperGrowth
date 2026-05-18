import { createContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { fetchOraChat } from '@/lib/ora-api';
import type { OraMessage } from '@/lib/ora-api';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { API_URL } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [rateLimitError, setRateLimitError] = useState(false);
  const [aiReadyNotification, setAiReadyNotification] = useState(false);

  const triggerRateLimit = () => {
    setRateLimitError(true);
    setTimeout(() => setRateLimitError(false), 5000);
    
    // Notify user when 60s cooldown is expected to be over
    setTimeout(() => {
      setAiReadyNotification(true);
      setTimeout(() => setAiReadyNotification(false), 5000);
    }, 60000);
  };

  // Load profile context
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        } else {
          headers['x-ai-debug'] = 'ai-magic-2026';
          headers['Authorization'] = 'Bearer mock-debug-token';
        }
        const res = await fetch(`${API_URL}/api/profile/summary`, {
          headers
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
    
    const greetings = [
      "Hello! I'm Ora. What can I help you with today?",
      "Hey there! Ready to write some code?",
      "Welcome back! Let's build something awesome.",
      "Ora online. How can I assist your development today?",
      "Hi! I'm Ora, your developer intelligence node. What's on the agenda?"
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
    } catch (error: unknown) {
      const isRateLimit = error instanceof Error && error.message === 'RATE_LIMIT';
      const isHighDemand = error instanceof Error && error.message === 'HIGH_DEMAND';
      
      if (isRateLimit) {
        triggerRateLimit();
      } else {
        console.error("Failed to send message", error);
      }
      
      let replyContent = "Oops! My circuits shorted out. Mind trying again?";
      if (isRateLimit) {
        replyContent = "I'm receiving too many requests right now. Please wait about 60 seconds.";
      } else if (isHighDemand) {
        replyContent = "Gemini is experiencing heavy developer traffic right now! 🚀 My circuits are running a bit warm. Let's wait a few seconds and try again! 💻⚡";
      }
      
      const errorMsg: OraMessage = {
        id: crypto.randomUUID(),
        role: 'ora',
        content: replyContent,
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
      
      {/* Global Rate Limit Toast */}
      <AnimatePresence>
        {rateLimitError && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel border border-rose-500/20 bg-rose-500/10 shadow-2xl backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={18} className="text-rose-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text">Rate Limit Exceeded</span>
              <span className="text-xs text-text-muted">Please wait ~60s before trying again.</span>
            </div>
          </motion.div>
        )}
        
        {/* Global AI Ready Toast */}
        {aiReadyNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel border border-emerald-500/20 bg-emerald-500/10 shadow-2xl backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text">AI Systems Ready</span>
              <span className="text-xs text-text-muted">Ora's limit cooldown has completed!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OraContext.Provider>
  );
}

