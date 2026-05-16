import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

export interface OraMessage {
  id: string;
  role: 'user' | 'ora';
  content: string;
  timestamp: string;
}

export const fetchOraGreeting = async (pageContext: Record<string, unknown>, profileContext: Record<string, unknown>) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/ora/greet`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ pageContext, profileContext })
  });
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch greeting');
  }
  return res.json();
};

export const fetchOraChat = async (messages: OraMessage[], pageContext: Record<string, unknown>, profileContext: Record<string, unknown>) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/ora/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, pageContext, profileContext })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch chat response');
  }
  return res.json();
};
