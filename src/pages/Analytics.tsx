import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Shield, Rocket, BarChart2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/queries';
import { SEO } from '@/components/layout/SEO';
import { useOra } from '@/hooks/useOra';


// Memoize random data outside the component
const HEATMAP_DATA = Array.from({ length: 168 }).map(() => ({
  opacity: Math.random() * 0.8 + 0.1,
  level: Math.floor(Math.random() * 10)
}));

export function Analytics() {
  const { data: analytics } = useAnalytics();
  const languages = useMemo(() => analytics?.languages || [], [analytics?.languages]);
  const { setPageContext } = useOra();

  useEffect(() => {
    setPageContext({
      page: 'Technical Evolution (Analytics)',
      totalRepos: analytics?.total_repos,
      totalStars: analytics?.total_stars,
      totalIssues: analytics?.total_issues,
      topLanguages: languages.slice(0, 3).map(l => `${l.name} (${l.percentage}%)`).join(', ')
    });
    return () => setPageContext({});
  }, [analytics, languages, setPageContext]);

  return (
    <div className="relative min-h-screen space-y-8 pb-32">
      <SEO title="Analytics" description="Global mapping of technical evolution and performance arrays." />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-muted font-medium">
            <BarChart2 size={16} />
            <span>Metrics Overview</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text">
            Technical <span className="text-primary">Evolution</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Architecture */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 glass-panel p-6 relative overflow-hidden group"
        >
          <div className="absolute -top-8 -right-8 opacity-[0.03] text-text">
            <Brain size={140} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-text mb-6 pb-3 border-b border-border">
            Skill Distribution
          </h3>
          <div className="space-y-5 relative z-10">
            {(languages.length > 0 ? languages : [
              { name: 'Frontend', percentage: 80 },
              { name: 'Backend', percentage: 65 },
              { name: 'Security', percentage: 57 },
              { name: 'DevOps', percentage: 73 },
              { name: 'AI/ML', percentage: 50 },
            ]).map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-text-muted">
                  <span>{skill.name}</span>
                  <span className="text-primary font-semibold">{skill.percentage}%</span>
                </div>
                <div className="h-2.5 bg-surface-hover rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1, ease: "circOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contribution Heatmap */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-panel p-6 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-text">Contribution Heatmap</h3>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface border border-border">
              <span className="text-xs font-medium text-text-muted">Activity:</span>
              <div className="flex gap-1.5">
                {[0.1, 0.4, 0.7, 1].map(op => (
                  <div key={op} className="w-2.5 h-2.5 rounded-sm bg-primary" style={{ opacity: String(op) }} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-12 sm:grid-cols-[repeat(24,minmax(0,1fr))] gap-1.5 relative z-10">
            {HEATMAP_DATA.map((data, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: data.opacity }}
                transition={{ delay: i * 0.001 }}
                className="aspect-square rounded-sm bg-primary hover:bg-primary-hover hover:opacity-100 transition-all cursor-crosshair hover:scale-125 hover:z-20 shadow-sm"
                title={`Level: ${data.level}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricBox title="Total Repos" value={String(analytics?.total_repos ?? 0)} suffix="Synced" icon={TrendingUp} />
        <MetricBox title="Stars Earned" value={String(analytics?.total_stars ?? 0)} suffix="Verified" icon={Shield} />
        <MetricBox title="Active Issues" value={String(analytics?.total_issues ?? 0)} suffix="Pending" icon={Rocket} />
      </div>
    </div>
  );
}

interface MetricBoxProps {
  title: string;
  value: string;
  suffix: string;
  icon: React.ElementType;
}

function MetricBox({ title, value, suffix, icon: Icon }: MetricBoxProps) {
  return (
    <div className="glass-panel p-6 flex flex-col items-center text-center space-y-4 group">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="space-y-2">
        <h4 className="text-4xl font-semibold tracking-tight leading-none text-text">{value}</h4>
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="text-xs text-text-muted/80 uppercase tracking-wider">{suffix}</p>
        </div>
      </div>
    </div>
  );
}
