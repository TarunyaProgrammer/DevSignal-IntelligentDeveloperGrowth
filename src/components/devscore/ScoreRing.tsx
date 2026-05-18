import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getScoreColor, getScoreGlow } from './score-utils';

interface ScoreRingProps {
  score: number;         // 0–100
  size?: number;         // px
  strokeWidth?: number;
  color?: string;
  className?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

export function ScoreRing({
  score,
  size = 64,
  strokeWidth = 5,
  color,
  className,
  animated = true,
  children,
}: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;
  const resolvedColor = color ?? getScoreColor(score);
  const dashRef = useRef<SVGCircleElement>(null);

  // Animate from 0 to offset on mount
  useEffect(() => {
    if (!animated || !dashRef.current) return;
    dashRef.current.style.strokeDashoffset = `${circumference}`;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (dashRef.current) {
          dashRef.current.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
          dashRef.current.style.strokeDashoffset = `${offset}`;
        }
      });
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <motion.div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border opacity-40"
        />
        {/* Progress */}
        <circle
          ref={dashRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : offset}
          style={{
            filter: `drop-shadow(0 0 6px ${getScoreGlow(score)})`,
          }}
        />
      </svg>

      {/* Centre content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}
