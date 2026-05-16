import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, GitFork, ArrowRight, Bot, Star, Sparkles, Command } from 'lucide-react';
import { useOra } from '@/contexts/OraContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SEO } from '@/components/layout/SEO';
import { cn } from '@/lib/utils';

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export function OraPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { greeting, messages, sendMessage, isStreaming, setPageContext } = useOra();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageContext({ page: 'Ora Home Greeting' });
  }, [setPageContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, greeting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden selection:bg-primary/30">
      <SEO title="Ora | Intelligence Core" description="Your personal developer mentor." />

      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <video 
          src="/OraBg.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 min-h-screen flex flex-col items-center pt-20 pb-40 px-4 max-w-5xl mx-auto"
      >
        {/* Navigation / Exit Immersive Mode */}
        <div className="absolute top-8 left-4 md:left-8 z-50">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: SMOOTH_EASE }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-white/60 hover:text-white hover:border-primary/40 transition-all group"
          >
            <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
          </motion.button>
        </div>

        {/* Floating Ora Core */}
        <div className="flex flex-col items-center justify-center text-center space-y-12 mb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: SMOOTH_EASE }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-32 h-32 rounded-full border border-primary/30 flex items-center justify-center bg-black/40 backdrop-blur-3xl relative overflow-hidden group shadow-[0_0_40px_rgba(212,175,55,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/10 group-hover:opacity-100 transition-opacity" />
              <img 
                src="/Ora.jpg" 
                alt="Ora"
                className="w-full h-full object-cover relative z-10 scale-110"
              />
              
              {/* Internal spinning rings */}
              <div className="absolute inset-2 border border-primary/10 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border border-primary/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </motion.div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: SMOOTH_EASE }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] uppercase tracking-[0.4em] font-bold backdrop-blur-md"
            >
              <Sparkles size={14} className="fill-primary" />
              Neural Engine Active
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: SMOOTH_EASE }}
              className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]"
            >
              Welcome back, <br />
              <span className="text-primary font-serif italic">{user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.user_name || 'Architect'}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed min-h-[120px] px-6">
                {greeting ? (
                  <div className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown>{greeting}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4 pt-4">
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }}/>
                      ))}
                    </div>
                    <span className="text-sm uppercase tracking-[0.2em] opacity-40 font-bold">Parsing user velocity...</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cinematic Quick Actions */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: SMOOTH_EASE }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-32"
        >
          <ActionButton 
            icon={Layout} 
            label="Command Center" 
            sub="View Dashboard" 
            onClick={() => navigate('/dashboard')} 
          />
          <ActionButton 
            icon={Star} 
            label="Mastery Paths" 
            sub="Continue Learning" 
            onClick={() => navigate('/resources')} 
          />
          <ActionButton 
            icon={GitFork} 
            label="Logic Matrix" 
            sub="Deep Analytics" 
            onClick={() => navigate('/analytics')} 
          />
        </motion.div>

        {/* Premium Chat Thread */}
        <div className="w-full space-y-12 mb-40">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={msg.id}
                className={cn("flex w-full group", msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div className={cn(
                  "max-w-[90%] md:max-w-[75%] px-8 py-6 rounded-[2rem] shadow-2xl transition-all duration-500",
                  msg.role === 'user' 
                    ? 'bg-primary text-black rounded-tr-sm font-medium' 
                    : 'glass-panel border-white/5 text-white/90 rounded-tl-sm hover:border-primary/20'
                )}>
                  <div className="flex items-center gap-3 mb-3 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                    {msg.role === 'user' ? (
                      <><Command size={12} /> User Node</>
                    ) : (
                      <><Bot size={12} /> Intelligence Node</>
                    )}
                  </div>
                  <div className={cn("text-lg leading-relaxed prose prose-lg max-w-none", msg.role === 'user' ? 'prose-black' : 'prose-invert')}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isStreaming && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="glass-panel border-white/5 rounded-[2rem] rounded-tl-sm px-8 py-8 flex items-center gap-3">
                 {[0, 1, 2].map((i) => (
                   <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                 ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* The Float Input - High Fidelity */}
        <div className="fixed bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none flex justify-center z-50">
          <motion.form 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1.2, duration: 1, ease: SMOOTH_EASE }}
            onSubmit={handleSubmit} 
            className="w-full max-w-4xl relative pointer-events-auto group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-[2.5rem] blur opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 group-focus-within:border-primary/40 shadow-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ora anything..."
                className="w-full bg-transparent pl-10 pr-24 py-7 text-xl focus:outline-none text-white placeholder:text-white/20 font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="absolute right-4 p-5 bg-primary text-black rounded-[2rem] disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] group/btn"
              >
                <ArrowRight size={24} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, sub, onClick }: { icon: React.ElementType, label: string, sub: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="glass-panel group relative overflow-hidden p-8 flex flex-col items-start gap-4 hover:border-primary/40 transition-all duration-500 text-left"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={80} />
      </div>
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
        <Icon size={24} />
      </div>
      <div className="space-y-1 relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{label}</p>
        <p className="text-xl font-bold text-white tracking-tight">{sub}</p>
      </div>
    </button>
  );
}
