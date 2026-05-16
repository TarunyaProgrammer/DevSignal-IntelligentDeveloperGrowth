import { useContext } from 'react';
import { OraContext } from '@/contexts/OraContext';

export function useOra() {
  const context = useContext(OraContext);
  if (context === undefined) {
    throw new Error('useOra must be used within an OraProvider');
  }
  return context;
}
