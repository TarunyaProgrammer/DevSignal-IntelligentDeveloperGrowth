import { motion } from 'framer-motion';
import { useOra } from '@/contexts/OraContext';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles } from 'lucide-react';
import { OraChatPanel } from './OraChatPanel';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function OraOrb() {
  const { isOrbOpen, setIsOrbOpen, isStreaming } = useOra();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/ora' || !isAuthenticated) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center group">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOrbOpen(!isOrbOpen)}
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 overflow-hidden shadow-2xl",
          isOrbOpen ? "bg-black/80 backdrop-blur-3xl border border-primary/40" : "bg-primary border border-primary/50"
        )}
      >
        {/* Internal Glow Logic */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />
        
        {/* Neural Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white rounded-full blur-xl opacity-20"
        />

        {isOrbOpen ? (
          <Sparkles size={28} className="text-primary animate-pulse" />
        ) : (
          <img 
            src="/Ora.jpg" 
            alt="Ora"
            className="w-full h-full object-cover relative z-10"
          />
        )}

        {/* Dynamic Border Rings */}
        {!isOrbOpen && (
          <div className="absolute inset-0">
            <div className={cn(
              "absolute inset-0 rounded-full border-2 border-primary transition-opacity duration-1000",
              isStreaming ? "animate-ping opacity-60" : "animate-pulse opacity-40"
            )} />
            <div className={cn(
              "absolute -inset-2 rounded-full border border-primary/30 transition-opacity duration-1000",
              isStreaming ? "animate-ping opacity-30" : "animate-pulse opacity-20"
            )} style={{ animationDelay: '500ms' }} />
          </div>
        )}
      </motion.button>
      
      <div className="relative w-full">
        <OraChatPanel />
      </div>
    </div>
  );
}
