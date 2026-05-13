import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ActivityChartProps {
  data?: {
    total: number;
    week: number;
    days: number[];
  }[] | null;
}

export function ActivityChart({ data }: ActivityChartProps) {
  // data is undefined when still fetching from API
  // data is null when the API returns 202 (Accepted/Computing)
  // data is [] when the API returned no results or is empty
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (data === null) {
      // If it stays null for 20 seconds, we assume GitHub is stuck
      timeout = setTimeout(() => setIsTimedOut(true), 20000);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTimedOut(false);
    }
    return () => clearTimeout(timeout);
  }, [data]);

  if (data === undefined || (data === null && !isTimedOut)) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-text-muted space-y-4 rounded-2xl bg-surface-hover/30 border border-border border-dashed">
        <div className="flex gap-2.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ height: [12, 32, 12] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: "easeInOut" }}
              className="w-3 rounded-full bg-primary/60"
            />
          ))}
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest animate-pulse text-primary">
          {data === null ? "GitHub is computing activity stats..." : "Syncing Activity Pulse..."}
        </p>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0 || isTimedOut) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-text-muted space-y-4 rounded-2xl bg-surface-hover/30 border border-border border-dashed group">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-2"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40">Signal Void Detected</p>
          <p className="text-xs font-medium text-text-muted px-12">No commit activity vectors found in the last 12 months. This repository node may be dormant or restricted.</p>
        </motion.div>
      </div>
    );
  }

  const maxCommits = Math.max(...data.map(w => w.total), 1);
  const width = 800;
  const height = 140;
  const padding = 10;

  // Generate points for the sparkline
  const points = data.map((week, i) => {
    // Prevent division by zero if there's only one data point
    const denominator = data.length > 1 ? data.length - 1 : 1;
    const x = (i / denominator) * (width - 2 * padding) + padding;
    const y = height - (week.total / maxCommits) * (height - 2 * padding) - padding;
    return { x, y, total: week.total };
  });

  // Calculate a smooth bezier curve path instead of harsh straight lines
  const linePath = points.reduce((path, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpX2 = p.x - (p.x - prev.x) / 2;
    return `${path} C ${cpX1} ${prev.y}, ${cpX2} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="relative group rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full z-10 shadow-sm border border-primary/20">
        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
        Pulse: Active
      </div>

      <div className="p-4 relative">
        {/* Soft glow behind the chart */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="relative w-full h-56">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
          {/* Defs for gradient fill */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Area Fill - Gradient */}
          <motion.path
            d={areaPath}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Sparkline Path - Smooth Curve with Glow */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          </svg>

          {/* HTML Hover Dots to maintain perfect circle aspect ratio */}
          {points.map((p, i) => (
            <div
              key={i}
              className="absolute w-[9px] h-[9px] rounded-full bg-surface border-[2px] border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(212,175,55,0.6)] pointer-events-none"
              style={{
                left: `${(p.x / width) * 100}%`,
                top: `${(p.y / height) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}
            />
          ))}
        </div>

        <div className="flex justify-between mt-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-text-muted border-t border-border pt-4">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-border" /> T-12 WEEKS</span>
          <span className="flex items-center gap-2">CURRENT SIGNAL <span className="w-2 h-2 rounded-full bg-primary" /></span>
        </div>
      </div>
    </div>
  );
}
