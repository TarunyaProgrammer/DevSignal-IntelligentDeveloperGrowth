import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevScore } from '@/contexts/DevScoreContext';
import { useAnalytics, useRepos } from '@/hooks/queries';
import { ScoreRing } from './ScoreRing';
import { getScoreColor } from './score-utils';
import { DevScoreModal } from './DevScoreModal';

/** Animates a number from 0 → target */
function useCountUp(target: number, duration = 1400) {
  const safeTarget = isNaN(target) || !isFinite(target) ? 0 : target;
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * safeTarget));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [safeTarget, duration]);
  return display;
}

export function DevScoreBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const { breakdown, rank, updateGitHubSignals } = useDevScore();
  const { data: analytics } = useAnalytics();
  const { data: repos } = useRepos();

  // Sync GitHub data into DevScoreContext whenever analytics / repos change
  useEffect(() => {
    if (!analytics && !repos) return;
    updateGitHubSignals({
      repos:   repos?.length ?? 0,
      stars:   analytics?.total_stars ?? 0,
      forks:   analytics?.total_forks ?? 0,
      issues:  analytics?.total_issues ?? 0,
      commits: (analytics?.total_stars ?? 0) * 3, // proxy: real commits not exposed in analytics
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, repos]);

  const safeTotal = isNaN(breakdown.total) || !isFinite(breakdown.total) ? 0 : breakdown.total;
  const animatedScore = useCountUp(safeTotal);
  const scoreColor = getScoreColor(safeTotal);

  return (
    <>
      {/* ── Badge button ── */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex flex-col items-center group"
        title="DevScore — Click to view your productivity breakdown"
        aria-label="Open DevScore panel"
        id="devscore-badge-btn"
      >
        <ScoreRing score={safeTotal} size={44} strokeWidth={4}>
          <span
            className="text-[11px] font-black leading-none"
            style={{ color: scoreColor }}
          >
            {animatedScore}
          </span>
        </ScoreRing>

        {/* Rank label */}
        <span
          className="text-[8px] font-black uppercase tracking-widest mt-0.5 leading-none hidden md:block"
          style={{ color: scoreColor }}
        >
          {rank.icon} {rank.label}
        </span>

        {/* Pulse ring on high score */}
        {safeTotal >= 90 && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 pointer-events-none"
            style={{ borderColor: scoreColor }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Tooltip */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            whileHover={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-bg border border-border rounded-xl px-3 py-2 text-[10px] font-semibold text-text-muted whitespace-nowrap shadow-xl z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          >
            DevScore — Click to view breakdown
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* ── Modal ── */}
      <DevScoreModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
