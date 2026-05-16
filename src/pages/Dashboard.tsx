import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout, Star, GitFork, Zap, RefreshCcw, AlertCircle, Database } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RepoCard } from '@/components/dashboard/RepoCard';
import { LanguageChart } from '@/components/dashboard/LanguageChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useRepos, useAnalytics, useSync } from '@/hooks/queries';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { useOra } from '@/hooks/useOra';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/layout/SEO';

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export function Dashboard() {
  const { data: repos, isLoading: reposLoading } = useRepos();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const syncMutation = useSync();
  const { user } = useAuth();
  const { searchQuery } = useSearch();
  const [visibleRepos, setVisibleRepos] = useState(6);
  const { setPageContext } = useOra();

  const isLoading = reposLoading || analyticsLoading;

  useEffect(() => {
    setPageContext({
      page: 'Dashboard',
      reposCount: repos?.length || 0,
      totalStars: analytics?.total_stars || 0,
      totalForks: analytics?.total_forks || 0,
      searchQuery
    });
    return () => setPageContext({});
  }, [repos, analytics, searchQuery, setPageContext]);

  const handleSync = () => {
    const username = user?.user_metadata?.user_name;
    if (username) {
      syncMutation.mutate({ github_username: username });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-6">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 border-2 border-primary/10 border-t-primary rounded-full shadow-[0_0_30px_-5px_rgba(222,219,200,0.3)]"
        />
        <div className="text-center space-y-3">
          <p className="text-xl font-bold tracking-tight text-primary uppercase tracking-[0.2em]">Synchronizing Neural Nodes</p>
          <p className="text-sm text-primary/40 font-medium">Parsing high-fidelity repository signals...</p>
        </div>
      </div>
    );
  }

  const repoList = (repos || []).filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const stats = analytics || { total_repos: 0, total_stars: 0, total_forks: 0, total_issues: 0, languages: [] };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: SMOOTH_EASE }}
      className="space-y-12 pb-32 px-4 md:px-0"
    >
      <SEO title="Intelligence Console" description="Decipher your repository velocity nodes." />

      {/* Cinematic Hero */}
      <section className="relative w-full h-[300px] md:h-[450px] rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-2xl">
        <video 
          src="https://www.pexels.com/download/video/7986491/" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-[5000ms]"
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.5] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-4 md:space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: SMOOTH_EASE }}
            className="flex flex-col items-start gap-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] uppercase tracking-[0.3em] font-bold backdrop-blur-md">
              <Zap size={14} className="fill-primary" />
              Intelligence Node Active
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-text leading-[0.9]">
               Systems online, <br />
               <span className="text-primary font-serif italic">{user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.user_name || 'Architect'}</span>
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-text/80 font-medium max-w-xl text-sm md:text-lg leading-relaxed"
          >
            Decoding <span className="text-primary font-bold">{(repos || []).length}</span> repository vectors. 
            Your velocity matrix is reaching optimal performance thresholds.
          </motion.p>
        </div>
      </section>
      
      {/* Header & Sync */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs md:text-sm text-text/60 font-bold uppercase tracking-[0.2em]">
            <Database size={18} className="text-primary/60" />
            <span>Telemetry Overview</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-text">
            Signal <span className="text-primary font-serif italic">Matrix</span>
          </h2>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="px-8 py-4 bg-primary text-black rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:pointer-events-none"
        >
          <RefreshCcw size={18} className={cn("transition-transform", syncMutation.isPending && 'animate-spin')} />
          {syncMutation.isPending ? 'Decrypting...' : 'Initiate Re-Sync'}
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Nodes" value={stats.total_repos} icon={Layout} />
        <StatsCard title="Impact Score" value={stats.total_stars} icon={Star} />
        <StatsCard title="Branch Forks" value={stats.total_forks} icon={GitFork} />
        <StatsCard title="Logic Faults" value={stats.total_issues} icon={Zap} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <h3 className="text-xl font-bold text-text tracking-tight uppercase tracking-wider">Repository Vectors</h3>
            <span className="text-[10px] font-bold text-primary/60 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 tracking-widest">NODES: {repoList.length}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {repoList.length > 0 ? (
              repoList.slice(0, visibleRepos).map((repo) => (
                <RepoCard 
                  key={repo.id} 
                  {...repo}
                />
              ))
            ) : (
              <div className="col-span-full py-24 bg-surface border border-border border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center space-y-6">
                <AlertCircle size={48} className="text-primary/20" />
                <div className="space-y-2">
                  <p className="text-xl font-bold text-text">No vectors detected</p>
                  <p className="text-sm text-primary/40 font-medium">Mathematical match failed for "{searchQuery}"</p>
                </div>
              </div>
            )}
          </div>
          
          {visibleRepos < repoList.length && (
            <button 
              onClick={() => setVisibleRepos(prev => prev + 6)}
              className="w-full py-5 bg-surface border border-border rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] text-primary/60 hover:bg-primary/10 hover:text-primary transition-all duration-500 shadow-sm"
            >
              Expand Matrix
            </button>
          )}
        </div>

        <div className="space-y-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <h3 className="text-xl font-bold text-text tracking-tight uppercase tracking-wider">Syntax Mix</h3>
            </div>
            <LanguageChart languages={analytics?.languages} />
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <h3 className="text-xl font-bold text-text tracking-tight uppercase tracking-wider">Real-time Telemetry</h3>
            </div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
