import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ActivityDefinition } from '@/contexts/DevScoreContext';

interface ActivityCardProps {
  definition: ActivityDefinition;
  timesLogged: number;
  onLog: () => void;
}

const categoryColors: Record<string, string> = {
  course:    'from-violet-500/10 to-violet-500/5 border-violet-500/20 hover:border-violet-500/40',
  build:     'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
  community: 'from-sky-500/10 to-sky-500/5 border-sky-500/20 hover:border-sky-500/40',
  content:   'from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
};

const categoryBadge: Record<string, string> = {
  course:    'bg-violet-500/15 text-violet-400',
  build:     'bg-emerald-500/15 text-emerald-400',
  community: 'bg-sky-500/15 text-sky-400',
  content:   'bg-amber-500/15 text-amber-400',
};

/** Gets current-log points (with diminishing returns) */
function getEffectivePoints(base: number, times: number) {
  const mult = times === 0 ? 1 : times === 1 ? 0.75 : 0.5;
  return Math.round(base * mult);
}

export function ActivityCard({ definition, timesLogged, onLog }: ActivityCardProps) {
  const [toastKey, setToastKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const effectivePts = getEffectivePoints(definition.basePoints, timesLogged);

  const handleClick = () => {
    onLog();
    setToastKey(k => k + 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative w-full text-left rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 overflow-hidden group',
        categoryColors[definition.category]
      )}
    >
      {/* Emoji + Points row */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl leading-none">{definition.emoji}</span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-text px-2 py-0.5 bg-surface/60 border border-border rounded-full">
            +{effectivePts} pts
          </span>
          {timesLogged > 0 && (
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest', categoryBadge[definition.category])}>
              ×{timesLogged} logged
            </span>
          )}
        </div>
      </div>

      {/* Text */}
      <p className="text-sm font-semibold text-text leading-tight mb-1">{definition.label}</p>
      <p className="text-[11px] text-text-muted leading-snug">{definition.description}</p>

      {/* Diminishing returns warning */}
      {timesLogged >= 2 && (
        <p className="text-[10px] text-amber-500/80 mt-2 font-medium">⚠ Diminishing returns active</p>
      )}

      {/* Click glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/[0.02] transition-opacity pointer-events-none" />

      {/* Floating +Xpts toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key={toastKey}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -28, scale: 1 }}
            exit={{ opacity: 0, y: -48, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-black text-xs font-bold shadow-lg pointer-events-none z-20 whitespace-nowrap"
          >
            +{effectivePts} pts ✨
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
