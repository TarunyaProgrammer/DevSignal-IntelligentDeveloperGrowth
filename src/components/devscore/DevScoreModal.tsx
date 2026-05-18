import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Zap, TrendingUp, GitBranch, BookOpen, Clock, Trash2, ChevronRight, Sparkles
} from 'lucide-react';
import { useDevScore, ACTIVITY_DEFINITIONS, RANKS } from '@/contexts/DevScoreContext';
import { ScoreRing } from './ScoreRing';
import { getScoreColor } from './score-utils';
import { ActivityCard } from './ActivityCard';
import { cn } from '@/lib/utils';

interface DevScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'overview' | 'log' | 'history';

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export function DevScoreModal({ isOpen, onClose }: DevScoreModalProps) {
  const { breakdown, history, logActivity, clearHistory, rank, nextRank, pointsToNextRank, isDecaying } = useDevScore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Count per activity type
  const typeCount = history.reduce<Record<string, number>>((acc, log) => {
    acc[log.type] = (acc[log.type] ?? 0) + 1;
    return acc;
  }, {});

  const scoreColor = getScoreColor(breakdown.total);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview',    icon: <TrendingUp size={14} /> },
    { id: 'log',      label: 'Log Activity', icon: <Sparkles size={14} /> },
    { id: 'history',  label: 'History',      icon: <Clock size={14} /> },
  ];

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-label="DevScore Panel"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-bg border border-border rounded-[2rem] overflow-hidden shadow-2xl relative"
          >
            {/* ── Header ── */}
            <div className="relative px-8 pt-8 pb-6 border-b border-border bg-surface/40">
              {/* Glow blob behind score ring */}
              <div
                className="absolute top-0 right-16 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
                style={{ background: scoreColor }}
              />

              <div className="flex items-start justify-between gap-6 relative z-10">
                {/* Left: rank + score text */}
                <div className="flex items-center gap-6">
                  <ScoreRing score={breakdown.total} size={96} strokeWidth={6} animated>
                    <div className="text-center">
                      <p className="text-xl font-bold text-text leading-none">{breakdown.total}</p>
                      <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">pts</p>
                    </div>
                  </ScoreRing>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{rank.icon}</span>
                      <span className="text-xl font-bold text-text tracking-tight">{rank.label}</span>
                    </div>
                    <p className="text-xs text-text-muted font-medium mb-3">Developer Productivity Score</p>
                    
                    {/* Decay / Active indicator */}
                    <div className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
                      isDecaying
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    )}>
                      <Zap size={10} className={isDecaying ? '' : 'fill-emerald-500'} />
                      {isDecaying ? '📉 Score Decaying' : '⚡ Active Signal'}
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-all mt-1 shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Rank Progress Bar */}
              {nextRank && (
                <div className="mt-5 relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-text-muted font-medium">
                      Progress to <span style={{ color: nextRank.color }}>{nextRank.icon} {nextRank.label}</span>
                    </span>
                    <span className="text-[10px] font-bold text-text-muted">{pointsToNextRank} pts to go</span>
                  </div>
                  <div className="h-1.5 bg-surface border border-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((breakdown.total - rank.minScore) / (nextRank.minScore - rank.minScore)) * 100}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: scoreColor }}
                    />
                  </div>
                </div>
              )}

              {/* All ranks row */}
              <div className="flex gap-2 mt-4 relative z-10">
                {RANKS.map(r => (
                  <div
                    key={r.name}
                    title={`${r.label}: ${r.minScore}+ pts`}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all border',
                      breakdown.total >= r.minScore
                        ? 'bg-primary/10 border-primary/20 text-primary'
                        : 'bg-surface border-border text-text-muted opacity-40'
                    )}
                  >
                    <span>{r.icon}</span>
                    <span className="hidden sm:inline">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex border-b border-border bg-surface/20">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest transition-all',
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-text-muted hover:text-text hover:bg-surface/50'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Content ── */}
            <div className="max-h-[420px] overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 space-y-5"
                  >
                    {/* GitHub Signals */}
                    <div className="glass-panel p-5 space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <GitBranch size={16} className="text-primary" />
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">GitHub Signals</h3>
                        <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {breakdown.github.total}/50 pts
                        </span>
                      </div>
                      {[
                        { label: 'Active Repositories', val: breakdown.github.reposScore,       max: 10 },
                        { label: 'Stars Received',       val: breakdown.github.starsScore,       max: 10 },
                        { label: 'Commit Velocity',      val: breakdown.github.activityScore,    max: 10 },
                        { label: 'Forks Earned',         val: breakdown.github.forksScore,       max: 8  },
                        { label: 'Issues Resolved',      val: breakdown.github.issuesScore,      max: 5  },
                        { label: 'PRs Reviewed',         val: breakdown.github.prsReviewedScore, max: 7 },
                      ].map(({ label, val, max }) => (
                        <div key={label}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs text-text-muted font-medium">{label}</span>
                            <span className="text-xs font-bold text-text">{val}/{max}</span>
                          </div>
                          <div className="h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(val / max) * 100}%` }}
                              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Learning Score */}
                    <div className="glass-panel p-5 space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen size={16} className="text-emerald-500" />
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">Learning Logs</h3>
                        <span className="ml-auto text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {breakdown.learning}/50 pts
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(breakdown.learning / 50) * 100}%` }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        />
                      </div>
                      <p className="text-xs text-text-muted">
                        {history.length === 0
                          ? 'No learning activities logged yet. Switch to "Log Activity" to earn points!'
                          : `${history.length} learning ${history.length === 1 ? 'activity' : 'activities'} logged across ${Object.keys(typeCount).length} categories.`}
                      </p>
                    </div>

                    {/* Insight Banner */}
                    {nextRank && (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
                        <ChevronRight size={18} className="text-primary shrink-0" />
                        <p className="text-xs text-text-muted leading-relaxed">
                          You need <span className="text-primary font-bold">{pointsToNextRank} more points</span> to reach{' '}
                          <span className="font-bold" style={{ color: nextRank.color }}>{nextRank.icon} {nextRank.label}</span>.
                          {history.length === 0 && ' Start logging learning activities!'}
                        </p>
                      </div>
                    )}
                    {isDecaying && (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                        <Zap size={18} className="text-amber-500 shrink-0" />
                        <p className="text-xs text-text-muted leading-relaxed">
                          Your score is <span className="text-amber-500 font-bold">decaying</span>. Log a learning activity to refresh your signal and slow the decay!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* LOG TAB */}
                {activeTab === 'log' && (
                  <motion.div
                    key="log"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                  >
                    <p className="text-xs text-text-muted mb-4 font-medium">
                      Click an activity to log it instantly. Points are added to your score immediately. Same activity logged multiple times earns diminishing returns.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ACTIVITY_DEFINITIONS.map(def => (
                        <ActivityCard
                          key={def.type}
                          definition={def}
                          timesLogged={typeCount[def.type] ?? 0}
                          onLog={() => logActivity(def.type)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                  >
                    {history.length === 0 ? (
                      <div className="py-16 text-center text-text-muted">
                        <BookOpen size={36} className="mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-sm">No activities logged yet.</p>
                        <p className="text-xs mt-1 opacity-70">Head to "Log Activity" to start building your score!</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs text-text-muted font-medium">{history.length} total entries</p>
                          <button
                            onClick={() => { if (confirm('Clear all history? This cannot be undone.')) clearHistory(); }}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500/70 hover:text-rose-500 transition-colors uppercase tracking-widest"
                          >
                            <Trash2 size={12} />
                            Clear
                          </button>
                        </div>
                        <div className="space-y-2">
                          {history.map((log, i) => {
                            const def = ACTIVITY_DEFINITIONS.find(d => d.type === log.type);
                            return (
                              <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="flex items-center gap-4 p-3.5 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors"
                              >
                                <span className="text-xl shrink-0">{def?.emoji ?? '📌'}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-text truncate">{log.label}</p>
                                  <p className="text-[10px] text-text-muted">{formatRelative(log.timestamp)}</p>
                                </div>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                                  +{log.points}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
