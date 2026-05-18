import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────

export type ActivityType =
  | 'youtube_course'
  | 'blog_article'
  | 'side_project'
  | 'new_tech_stack'
  | 'technical_book'
  | 'talk_or_post'
  | 'open_source'
  | 'coding_challenge'
  | 'paid_course'
  | 'pr_review';

export interface ActivityDefinition {
  type: ActivityType;
  label: string;
  description: string;
  basePoints: number;
  emoji: string;
  category: 'course' | 'build' | 'community' | 'content';
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  label: string;
  points: number;
  timestamp: number;
}

export interface GitHubSignals {
  reposScore: number;       // max 10
  starsScore: number;       // max 10
  forksScore: number;       // max 8
  issuesScore: number;      // max 5
  activityScore: number;    // max 10
  prsReviewedScore: number; // max 7
  total: number;            // max 50
}

export interface ScoreBreakdown {
  github: GitHubSignals;
  learning: number;        // max 50
  total: number;           // max 100
  decayFactor: number;     // 0.0 – 1.0
}

export interface DevScoreContextType {
  breakdown: ScoreBreakdown;
  history: ActivityLog[];
  logActivity: (type: ActivityType) => { pointsAwarded: number };
  updateGitHubSignals: (signals: Partial<{ repos: number; stars: number; forks: number; issues: number; commits: number }>) => void;
  clearHistory: () => void;
  rank: Rank;
  nextRank: Rank | null;
  pointsToNextRank: number;
  lastUpdated: number | null;
  isDecaying: boolean;
}

export interface Rank {
  name: string;
  label: string;
  icon: string;
  minScore: number;
  color: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'devscore_v1';
const DECAY_DAYS = 30;
const DECAY_RATE_PER_WEEK = 0.05; // 5% per week after DECAY_DAYS

// eslint-disable-next-line react-refresh/only-export-components
export const ACTIVITY_DEFINITIONS: ActivityDefinition[] = [
  { type: 'youtube_course',   label: 'YouTube Course',          description: 'Completed a full YouTube tutorial series',     basePoints: 5,  emoji: '🎬', category: 'course'    },
  { type: 'blog_article',     label: 'Technical Article',       description: 'Read or wrote a tech blog / docs deep-dive',   basePoints: 2,  emoji: '📚', category: 'content'   },
  { type: 'side_project',     label: 'New Side Project',        description: 'Built and shipped a new side project',         basePoints: 15, emoji: '🛠️', category: 'build'     },
  { type: 'new_tech_stack',   label: 'New Tech Stack',          description: 'Learned and built with an unfamiliar stack',   basePoints: 20, emoji: '🔧', category: 'build'     },
  { type: 'technical_book',   label: 'Technical Book',          description: 'Finished reading a full technical book',       basePoints: 12, emoji: '📖', category: 'course'    },
  { type: 'talk_or_post',     label: 'Talk / Public Post',      description: 'Gave a tech talk or wrote a viral post',       basePoints: 10, emoji: '🎤', category: 'community' },
  { type: 'open_source',      label: 'Open Source Contribution',description: 'Merged a PR into an open-source project',      basePoints: 8,  emoji: '🤝', category: 'community' },
  { type: 'coding_challenge', label: 'Coding Challenge',         description: 'Completed a LeetCode / HackerRank challenge',  basePoints: 6,  emoji: '🏆', category: 'build'     },
  { type: 'paid_course',      label: 'Paid Online Course',      description: 'Finished an Udemy / Coursera / etc. course',   basePoints: 18, emoji: '🎓', category: 'course'    },
  { type: 'pr_review',        label: 'PR Review',               description: 'Reviewed and gave feedback on a pull request', basePoints: 3,  emoji: '👁️', category: 'community' },
];

// eslint-disable-next-line react-refresh/only-export-components
export const RANKS: Rank[] = [
  { name: 'NOVICE',      label: 'Novice',      icon: '🌱', minScore: 0,  color: '#6b7280' },
  { name: 'APPRENTICE',  label: 'Apprentice',  icon: '⚡', minScore: 20, color: '#f59e0b' },
  { name: 'BUILDER',     label: 'Builder',     icon: '🔧', minScore: 40, color: '#10b981' },
  { name: 'ARCHITECT',   label: 'Architect',   icon: '🏗️', minScore: 60, color: '#3b82f6' },
  { name: 'LEGEND',      label: 'Legend',      icon: '🔥', minScore: 80, color: '#f97316' },
  { name: 'MYTHIC',      label: 'Mythic',      icon: '👑', minScore: 95, color: '#D4AF37' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getRank(score: number): Rank {
  return [...RANKS].reverse().find(r => score >= r.minScore) ?? RANKS[0];
}

function getNextRank(score: number): Rank | null {
  return RANKS.find(r => r.minScore > score) ?? null;
}

function calcDecayFactor(lastUpdated: number | null): number {
  if (!lastUpdated) return 1;
  const daysSince = (Date.now() - lastUpdated) / (1000 * 60 * 60 * 24);
  if (daysSince <= DECAY_DAYS) return 1;
  const weeksOver = Math.floor((daysSince - DECAY_DAYS) / 7);
  return Math.max(0.4, 1 - weeksOver * DECAY_RATE_PER_WEEK); // floor at 40%
}

function calcLearningScore(history: ActivityLog[], decayFactor: number): number {
  // Count how many times each type has been logged
  const countMap: Partial<Record<ActivityType, number>> = {};
  let raw = 0;

  for (const log of history) {
    const count = (countMap[log.type] ?? 0) + 1;
    countMap[log.type] = count;
    // Diminishing returns: 100%, 75%, 50% for 1st, 2nd, 3rd+ entries of same type
    const multiplier = count === 1 ? 1 : count === 2 ? 0.75 : 0.5;
    const def = ACTIVITY_DEFINITIONS.find(d => d.type === log.type);
    raw += (def?.basePoints ?? 0) * multiplier;
  }

  return Math.min(50, Math.round(raw * decayFactor));
}

function calcGitHubScore(signals: StoredGitHubSignals): GitHubSignals {
  const reposScore       = Math.min(10, Math.round(((signals.repos       ?? 0) / 20)  * 10));
  const starsScore       = Math.min(10, Math.round(((signals.stars       ?? 0) / 100) * 10));
  const forksScore       = Math.min(8,  Math.round(((signals.forks       ?? 0) / 50)  * 8));
  const issuesScore      = Math.min(5,  Math.round(((signals.issues      ?? 0) / 30)  * 5));
  const activityScore    = Math.min(10, Math.round(((signals.commits     ?? 0) / 200) * 10));
  const prsReviewedScore = Math.min(7,  Math.round(((signals.prsReviewed ?? 0) / 20)  * 7));
  const total = reposScore + starsScore + forksScore + issuesScore + activityScore + prsReviewedScore;
  return { reposScore, starsScore, forksScore, issuesScore, activityScore, prsReviewedScore, total: Math.min(50, total) };
}

// ─── Stored Shape ────────────────────────────────────────────────────────────

interface StoredGitHubSignals {
  repos: number;
  stars: number;
  forks: number;
  issues: number;
  commits: number;
  prsReviewed: number;
}

interface StoredState {
  history: ActivityLog[];
  lastUpdated: number | null;
  github: StoredGitHubSignals;
}

const DEFAULT_STORED: StoredState = {
  history: [],
  lastUpdated: null,
  github: { repos: 0, stars: 0, forks: 0, issues: 0, commits: 0, prsReviewed: 0 },
};

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORED;
    return { ...DEFAULT_STORED, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORED;
  }
}

function saveState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if storage is full
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const DevScoreContext = createContext<DevScoreContextType | undefined>(undefined);

export function DevScoreProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<StoredState>(loadState);

  // Persist on every change
  useEffect(() => {
    saveState(stored);
  }, [stored]);

  const decayFactor = useMemo(() => calcDecayFactor(stored.lastUpdated), [stored.lastUpdated]);
  const githubSignals = useMemo(() => calcGitHubScore(stored.github), [stored.github]);
  const learningScore = useMemo(() => calcLearningScore(stored.history, decayFactor), [stored.history, decayFactor]);

  const breakdown: ScoreBreakdown = useMemo(() => ({
    github: githubSignals,
    learning: learningScore,
    total: Math.min(100, githubSignals.total + learningScore),
    decayFactor,
  }), [githubSignals, learningScore, decayFactor]);

  const rank = useMemo(() => getRank(breakdown.total), [breakdown.total]);
  const nextRank = useMemo(() => getNextRank(breakdown.total), [breakdown.total]);
  const pointsToNextRank = useMemo(() => nextRank ? nextRank.minScore - breakdown.total : 0, [nextRank, breakdown.total]);
  const isDecaying = decayFactor < 1;

  const logActivity = useCallback((type: ActivityType): { pointsAwarded: number } => {
    const def = ACTIVITY_DEFINITIONS.find(d => d.type === type);
    if (!def) return { pointsAwarded: 0 };

    const countSoFar = stored.history.filter(h => h.type === type).length;
    const multiplier = countSoFar === 0 ? 1 : countSoFar === 1 ? 0.75 : 0.5;
    const pointsAwarded = Math.round(def.basePoints * multiplier);

    const newLog: ActivityLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      label: def.label,
      points: pointsAwarded,
      timestamp: Date.now(),
    };

    setStored(prev => ({
      ...prev,
      history: [newLog, ...prev.history],
      lastUpdated: Date.now(),
      // PR reviews also increment the GitHub signal counter directly
      ...(type === 'pr_review' ? {
        github: { ...prev.github, prsReviewed: (prev.github.prsReviewed ?? 0) + 1 }
      } : {}),
    }));

    return { pointsAwarded };
  }, [stored.history]);

  const updateGitHubSignals = useCallback((signals: Partial<StoredGitHubSignals>) => {
    setStored(prev => ({
      ...prev,
      github: { ...prev.github, ...signals },
      lastUpdated: prev.lastUpdated ?? Date.now(),
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setStored(prev => ({ ...prev, history: [], lastUpdated: null }));
  }, []);

  return (
    <DevScoreContext.Provider value={{
      breakdown,
      history: stored.history,
      logActivity,
      updateGitHubSignals,
      clearHistory,
      rank,
      nextRank,
      pointsToNextRank,
      lastUpdated: stored.lastUpdated,
      isDecaying,
    }}>
      {children}
    </DevScoreContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDevScore() {
  const ctx = useContext(DevScoreContext);
  if (!ctx) throw new Error('useDevScore must be used within DevScoreProvider');
  return ctx;
}
