import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  ExternalLink, 
  Clock, 
  Trophy, 
  Play, 
  Book, 
  Code2, 
  Layout,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEARNING_PATHS } from '../data/learningPaths';
import { useOra } from '@/hooks/useOra';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/layout/SEO';

const getIcon = (type: string) => {
  switch (type) {
    case 'video': return <Play size={18} strokeWidth={2.5} />;
    case 'docs': return <Book size={18} strokeWidth={2.5} />;
    case 'course': return <Layout size={18} strokeWidth={2.5} />;
    case 'project': return <Code2 size={18} strokeWidth={2.5} />;
    default: return <ExternalLink size={18} strokeWidth={2.5} />;
  }
};

export function LearningPathPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const path = LEARNING_PATHS.find(p => p.id === courseId);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    if (path) {
      const saved = localStorage.getItem(`progress_${path.id}`);
      if (saved) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCompletedLevels(JSON.parse(saved));
        } catch {
          setCompletedLevels([]);
        }
      }
    }
  }, [path]);

  const { setPageContext } = useOra();

  useEffect(() => {
    if (path) {
      setPageContext({
        page: 'Learning Path Sector',
        courseId: path.id,
        courseTitle: path.title,
        description: path.tagline,
        totalHours: path.totalHours,
        modules: path.levels.map(l => l.title).join(', ')
      });
    }
    return () => {
      // Clear context when leaving the page
      setPageContext({});
    };
  }, [path, setPageContext]);

  if (!path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-bg text-text">
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shadow-inner">
           <Zap size={40} strokeWidth={2} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Archive Lost</h2>
          <p className="text-text-muted font-medium">Error 404: Knowledge Sector Null</p>
        </div>
        <button 
          onClick={() => navigate('/resources')} 
          className="px-8 py-3 bg-surface border border-border text-text rounded-xl font-medium hover:bg-surface-hover transition-all mt-4"
        >
           Return to Archive
        </button>
      </div>
    );
  }

  const toggleLevel = (level: number) => {
    const newCompleted = completedLevels.includes(level)
      ? completedLevels.filter(l => l !== level)
      : [...completedLevels, level];
    
    setCompletedLevels(newCompleted);
    localStorage.setItem(`progress_${path.id}`, JSON.stringify(newCompleted));
    window.dispatchEvent(new Event('storage'));
  };

  const progress = (completedLevels.length / path.levels.length) * 100;
  const PathIcon = path.icon;

  return (
    <div className="min-h-screen pb-32">
      <SEO title={`${path.title} | Technical Archive`} description={path.tagline} />

      {/* Header Overlay */}
      <div className="relative mb-12 max-w-6xl mx-auto pt-6 px-6">
        <div className="glass-panel p-8 md:p-12 relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <button 
            onClick={() => navigate('/resources')}
            className="group mb-8 flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text transition-colors relative z-10"
          >
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:bg-surface-hover transition-all">
               <ArrowLeft size={16} strokeWidth={2} />
            </div>
            BACK TO ARCHIVE
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
                    <PathIcon size={32} strokeWidth={2} />
                 </div>
                 <div className="space-y-1.5">
                    <span className="inline-block px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-primary uppercase tracking-wider">
                      Sector: {path.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-text leading-tight">{path.title}</h1>
                 </div>
              </div>
              <p className="text-base md:text-lg font-medium text-text-muted leading-relaxed">
                {path.tagline}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl min-w-[280px] space-y-5 bg-surface-hover/50 border border-border/50">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Sync Progress</span>
                  <span className="text-3xl font-semibold text-primary">{Math.round(progress)}%</span>
               </div>
               <div className="h-2.5 w-full bg-surface rounded-full overflow-hidden border border-border/50 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(222,219,200,0.5)]"
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
               </div>
               <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                     <Clock size={14} className="text-text-muted" />
                     <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{path.totalHours}H EST</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Trophy size={14} className="text-text-muted" />
                     <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{completedLevels.length}/{path.levels.length} VERIFIED</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Roadmap */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-8 relative pt-6">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-border hidden md:block rounded-full" />
          
          {path.levels.map((level, index) => {
            const isCompleted = completedLevels.includes(level.level);

            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "relative flex flex-col md:flex-row items-center gap-6 md:gap-12 group/node",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Node Center */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                   <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md",
                      isCompleted 
                        ? "bg-primary text-black border-none shadow-primary/30" 
                        : "bg-surface border-2 border-border text-text group-hover/node:border-primary/50"
                   )}>
                      {isCompleted ? (
                        <CheckCircle size={20} strokeWidth={3} />
                      ) : (
                        <span className="text-sm font-semibold">{level.level.toString().padStart(2, '0')}</span>
                      )}
                   </div>
                </div>

                <div className="w-full md:w-1/2">
                   <div className={cn(
                     "glass-panel p-6 md:p-8 rounded-3xl transition-all duration-500 relative overflow-hidden group/card hover:shadow-lg",
                     isCompleted ? "bg-surface-hover/50 border-border opacity-70" : "hover:-translate-y-1"
                   )}>
                      <div className="flex items-center justify-between mb-5">
                         <div className={cn(
                           "w-12 h-12 rounded-xl flex items-center justify-center transition-colors", 
                           isCompleted ? "bg-primary text-black shadow-md shadow-primary/20" : "bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-black"
                         )}>
                            {getIcon(level.type)}
                         </div>
                         <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Stage {level.level.toString().padStart(2, '0')}</span>
                      </div>

                      <div className="space-y-3 mb-6">
                         <h3 className={cn(
                           "text-xl font-semibold tracking-tight",
                           isCompleted ? "text-text-muted line-through decoration-text-muted/50" : "text-text"
                         )}>
                           {level.title}
                         </h3>
                         <p className="text-sm font-medium text-text-muted leading-relaxed">
                           {level.description}
                         </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                         <a 
                           href={level.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-surface border border-border flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-text hover:bg-surface-hover transition-all"
                         >
                           Access Module <ExternalLink size={14} />
                         </a>
                         <button 
                           onClick={() => toggleLevel(level.level)}
                           className={cn(
                             "w-full sm:w-auto px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all duration-500",
                             isCompleted 
                               ? "bg-surface border border-border text-text-muted hover:text-text" 
                               : "bg-primary text-black hover:bg-primary-hover shadow-md shadow-primary/20"
                           )}
                           aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                         >
                            {isCompleted ? "Revert" : "Verify"}
                         </button>
                      </div>
                   </div>
                </div>

                <div className="w-1/2 hidden md:block" />
              </motion.div>
            );
          })}
        </div>

        {/* Completion Milestone */}
        <AnimatePresence>
          {completedLevels.length === path.levels.length && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mt-20 relative"
            >
              {/* Outer glass card */}
              <div className="glass-panel rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 pointer-events-none" />

                {/* Top status bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-hover/50">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(222,219,200,0.8)] animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-text">Status: Verified</span>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Log ID: {path.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                {/* Body */}
                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center relative z-10">
                  {/* Trophy seal */}
                  <motion.div 
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative mx-auto md:mx-0"
                  >
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-primary text-black flex items-center justify-center shadow-xl shadow-primary/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                      <Trophy size={48} strokeWidth={2} className="relative z-10" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-surface border border-border text-text text-xs font-bold uppercase tracking-widest shadow-md whitespace-nowrap">
                      100% Complete
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="text-center md:text-left space-y-6">
                    <div className="space-y-3">
                      <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                        Achievement Unlocked
                      </span>
                      <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-text leading-tight">
                        Sector <span className="text-primary">Mastered.</span>
                      </h2>
                      <p className="text-sm font-medium text-text-muted">
                        All Intelligence Nodes Synchronized successfully.
                      </p>
                    </div>

                    {/* Stat row */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                      <div className="space-y-1">
                        <div className="text-2xl md:text-3xl font-semibold tracking-tight text-text">{path.levels.length}</div>
                        <div className="text-xs font-medium uppercase tracking-wider text-text-muted">Stages</div>
                      </div>
                      <div className="space-y-1 border-x border-border px-4">
                        <div className="text-2xl md:text-3xl font-semibold tracking-tight text-text">{path.totalHours}h</div>
                        <div className="text-xs font-medium uppercase tracking-wider text-text-muted">Logged</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">A+</div>
                        <div className="text-xs font-medium uppercase tracking-wider text-text-muted">Grade</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button 
                        onClick={() => navigate('/resources')} 
                        className="flex-1 px-8 py-4 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        Next Archive <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={() => { setCompletedLevels([]); localStorage.removeItem(`progress_${path.id}`); window.dispatchEvent(new Event('storage')); }}
                        className="px-6 py-4 rounded-xl bg-surface border border-border text-text font-semibold text-sm hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all flex items-center justify-center"
                      >
                        Reset Progress
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
