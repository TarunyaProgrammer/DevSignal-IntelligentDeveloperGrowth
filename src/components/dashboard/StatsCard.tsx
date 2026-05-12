import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const COLOR_MAP: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-400/10',
  amber: 'text-primary bg-primary/10',
  teal: 'text-teal-400 bg-teal-400/10',
  orange: 'text-orange-400 bg-orange-400/10',
  rose: 'text-rose-400 bg-rose-400/10',
  emerald: 'text-primary bg-primary/10',
  cyan: 'text-cyan-400 bg-cyan-400/10',
};

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const colorClasses = color && COLOR_MAP[color] ? COLOR_MAP[color] : 'text-primary bg-primary/10';
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-6 flex flex-col justify-between h-full relative overflow-hidden group border-border/10 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", colorClasses, "border border-border/20 group-hover:border-primary/30 shadow-sm")}>
          <Icon size={22} strokeWidth={2} />
        </div>
        {trend && (
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md",
            trend.isPositive ? "bg-primary/10 text-primary" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>

      <div className="mt-8 space-y-2">
        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-4xl font-bold tracking-tighter text-text leading-none group-hover:text-primary transition-colors duration-500">{value}</h4>
        </div>
      </div>
      
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </motion.div>
  );
}
