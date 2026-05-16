import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOra } from '@/contexts/OraContext';
import { Send, X, Trash2, Sparkles, Zap, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function OraChatPanel() {
  const { messages, sendMessage, isOrbOpen, setIsOrbOpen, isStreaming, clearHistory } = useOra();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOrbOpen) scrollToBottom();
  }, [messages, isOrbOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOrbOpen && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -40, scale: 0.9, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[440px] h-[600px] max-h-[70vh] flex flex-col z-50 overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.4)]"
        >
          {/* Animated Header */}
          <div className="relative flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
                <div className="w-10 h-10 rounded-full border border-primary/20 relative overflow-hidden">
                  <img 
                    src="/Ora.jpg" 
                    alt="Ora"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-white flex items-center gap-2">
                  Ora <span className="text-[10px] text-primary/60 border border-primary/20 px-1.5 rounded-full">v2.5</span>
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Neural Core Active</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => { setIsOrbOpen(false); navigate('/ora'); }} 
                className="p-2.5 hover:bg-white/5 rounded-xl text-primary/80 hover:text-primary transition-all" 
                title="Immersive Mode"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                onClick={clearHistory} 
                className="p-2.5 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all" 
                title="Wipe Memory"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setIsOrbOpen(false)} 
                className="p-2.5 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-10">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-full border border-primary/20 p-1 mb-6 overflow-hidden"
                >
                  <img 
                    src="/Ora.jpg" 
                    alt="Ora"
                    className="w-full h-full object-cover rounded-full"
                  />
                </motion.div>
                <h3 className="text-white font-bold text-lg mb-2">Initialize Conversation</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  I am the DevSignal Intelligence Core. Ask me anything about this architecture or your growth path.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-2">
                  <QuickSuggestion icon={Zap} label="Analyze Screen" />
                  <QuickSuggestion icon={Sparkles} label="Optimize Code" />
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id}
                  className={cn("flex w-full", msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn(
                    "max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? 'bg-primary text-black rounded-tr-sm font-medium shadow-[0_10px_20px_rgba(212,175,55,0.2)]' 
                      : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-sm'
                  )}>
                    <div className={cn("prose prose-sm max-w-none", msg.role === 'user' ? 'prose-black' : 'prose-invert')}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {isStreaming && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 border border-white/5 rounded-3xl rounded-tl-sm px-6 py-4 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Premium Input */}
          <div className="p-6 pt-0">
            <form 
              onSubmit={handleSubmit} 
              className="relative flex items-center group/input"
            >
              <div className="absolute -inset-0.5 bg-primary/20 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Synchronize with Ora..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:border-primary/40 transition-all text-white placeholder:text-white/20 relative"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="absolute right-2 p-2.5 bg-primary text-black rounded-xl disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Send size={18} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickSuggestion({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-white/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all">
      <Icon size={12} />
      {label}
    </button>
  );
}
