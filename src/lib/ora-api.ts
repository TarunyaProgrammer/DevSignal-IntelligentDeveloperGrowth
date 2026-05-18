import { getSafeSession } from './supabase';
import { API_URL } from './api';

import { shouldBypassLiveAuth } from './env';

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

export interface OraMessage {
  id: string;
  role: 'user' | 'ora';
  content: string;
  timestamp: string;
}



export const fetchOraChat = async (messages: OraMessage[], pageContext: Record<string, unknown>, profileContext: Record<string, unknown>) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/ora/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, pageContext, profileContext })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const errorMsg = typeof errData.error === 'string' 
      ? errData.error 
      : (JSON.stringify(errData.error || errData) || 'Failed to fetch chat response');
      
    if (res.status === 429 || errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
      console.error("RATE LIMIT DETECTED:", errorMsg);
      throw new Error('RATE_LIMIT');
    }
    
    if (
      res.status === 503 || 
      errorMsg.toLowerCase().includes('503') || 
      errorMsg.toLowerCase().includes('high demand') || 
      errorMsg.toLowerCase().includes('unavailable') || 
      errorMsg.toLowerCase().includes('temporary')
    ) {
      console.error("HIGH DEMAND DETECTED:", errorMsg);
      throw new Error('HIGH_DEMAND');
    }
    
    throw new Error(errorMsg);
  }
  return res.json();
};
