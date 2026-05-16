import { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Terminal, Cpu, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseCard } from '../components/CourseCard';
import { LEARNING_PATHS } from '../data/learningPaths';
import { SEO } from '@/components/layout/SEO';
import { useOra } from '@/hooks/useOra';
import { cn } from '@/lib/utils';

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { setPageContext } = useOra();

  const CATEGORIES = useMemo(() => {
    const unique = Array.from(new Set(LEARNING_PATHS.map((p) => p.category))).sort();
    return ['All', ...unique];
  }, []);
  
  const [progressData, setProgressData] = useState<Record<string, number>>(() => {
    const data: Record<string, number> = {};
    LEARNING_PATHS.forEach(path => {
      const saved = localStorage.getItem(`progress_${path.id}`);
      if (saved) {
        try {
          data[path.id] = JSON.parse(saved).length;
        } catch {
          data[path.id] = 0;
        }
      } else {
        data[path.id] = 0;
      }
    });
    return data;
  });

  useEffect(() => {
    const updateProgress = () => {
      const data: Record<string, number> = {};
      LEARNING_PATHS.forEach(path => {
        const saved = localStorage.getItem(`progress_${path.id}`);
        if (saved) {
          try {
            data[path.id] = JSON.parse(saved).length;
          } catch {
            data[path.id] = 0;
          }
        } else {
          data[path.id] = 0;
        }
      });
      setProgressData(data);
    };

    window.addEventListener('storage', updateProgress);
    window.addEventListener('focus', updateProgress);
    return () => {
      window.removeEventListener('storage', updateProgress);
      window.removeEventListener('focus', updateProgress);
    };
  }, []);

  useEffect(() => {
    setPageContext({
      page: 'Mastery Paths (Resources)',
      searchQuery: searchTerm,
      selectedCategory,
      totalPaths: LEARNING_PATHS.length
    });
    return () => setPageContext({});
  }, [searchTerm, selectedCategory, setPageContext]);

  const filteredPaths = LEARNING_PATHS.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         path.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || path.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: SMOOTH_EASE }}
      className="min-h-screen pb-32 overflow-x-hidden relative px-4 md:px-0"
    >
      <SEO title="Codex Archive" description="Access the high-fidelity intelligence vault of hand-curated engineering paths." />
      
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-60" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[130px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="pt-20 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 mb-16">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: SMOOTH_EASE }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-[0_0_20px_-5px_rgba(222,219,200,0.3)]">
                <BookOpen size={28} strokeWidth={2} />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-text">
                Codex <span className="text-primary font-serif italic">Archive</span>
              </h1>
            </motion.div>
            <p className="text-xs md:text-sm font-bold text-primary/40 uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Sectors of technical excellence • Decrypted
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-[380px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-all duration-500" size={20} />
            <input
              type="text"
              placeholder="Query intelligence modules..."
              className="w-full bg-white/[0.02] border border-white/10 h-14 pl-14 pr-6 text-sm font-bold rounded-2xl text-white placeholder:text-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all shadow-2xl tracking-wide"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-4 overflow-x-auto pb-12 no-scrollbar scroll-smooth">
          {CATEGORIES.map((category) => (
            <motion.button
              key={category}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 border",
                selectedCategory === category
                ? 'bg-primary text-black border-primary shadow-xl shadow-primary/20'
                : 'bg-white/[0.03] text-primary/40 border-white/5 hover:text-primary hover:bg-primary/10 hover:border-primary/20'
              )}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Grid Section */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredPaths.map((path, index) => (
              <motion.div
                key={path.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: SMOOTH_EASE }}
              >
                <CourseCard
                  {...path}
                  duration={`${path.totalHours}h`}
                  lessonsCount={path.levels.length}
                  progress={progressData[path.id] || 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-32 bg-white/[0.01] border border-white/5 border-dashed rounded-[3rem] mt-12">
            <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-8 text-primary/20 border border-primary/10">
              <Search size={36} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3 tracking-tighter">Null Result</h3>
            <p className="text-sm font-medium text-primary/40 max-w-sm mx-auto uppercase tracking-widest">No intelligence match found for this query node.</p>
          </div>
        )}

        {/* Big Premium Stat Block */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: SMOOTH_EASE }}
          className="mt-24 p-1 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent shadow-2xl"
        >
           <div className="bg-black rounded-[2.8rem] border border-white/5 relative overflow-hidden p-10 md:p-16">
              <div className="absolute inset-0 noise-overlay opacity-[0.3] pointer-events-none" />
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <p className="text-5xl md:text-8xl font-bold tracking-tighter text-text">
                        {LEARNING_PATHS.length}<span className="text-primary font-serif italic">+</span>
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-primary/40 uppercase tracking-[0.3em]">
                        <Cpu size={18} className="text-primary" />
                        Neural Pathways
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-5xl md:text-8xl font-bold tracking-tighter text-text">
                        100<span className="text-primary font-serif italic">%</span>
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-primary/40 uppercase tracking-[0.3em]">
                        <Shield size={18} className="text-primary" />
                        Logic Integrity
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center lg:items-end gap-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full md:w-auto px-10 py-5 bg-primary text-black rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-4"
                  >
                    Sync Knowledge
                    <Terminal size={18} strokeWidth={2.5} />
                  </motion.button>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(222,219,200,0.5)]" />
                    Archive Online
                  </div>
                </div>
              </div>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
