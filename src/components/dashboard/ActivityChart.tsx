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
  const isLoading = data === undefined || data === null;
  const isEmpty = Array.isArray(data) && data.length === 0;

  if (isLoading) {
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

  if (isEmpty) {
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

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56"
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

          {/* Hover Dots instead of vertical bars */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-surface stroke-primary stroke-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          ))}
        </svg>

        <div className="flex justify-between mt-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-text-muted border-t border-border pt-4">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-border" /> T-12 WEEKS</span>
          <span className="flex items-center gap-2">CURRENT SIGNAL <span className="w-2 h-2 rounded-full bg-primary" /></span>
        </div>
      </div>
    </div>
  );
}
