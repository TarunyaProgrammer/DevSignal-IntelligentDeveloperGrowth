import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  GitPullRequest, AlertCircle,
  Terminal, Star, Zap
} from 'lucide-react';
import { useRepo } from '@/hooks/queries';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/layout/SEO';
import { ContributorGrid } from '@/components/dashboard/ContributorGrid';
import { LanguageStats } from '@/components/dashboard/LanguageStats';
import { useOra } from '@/hooks/useOra';
import { useEffect } from 'react';

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

const COLOR_MAP: Record<string, string> = {
  blue: 'text-primary bg-primary/10 border-primary/20',
  amber: 'text-primary bg-primary/10 border-primary/20',
  teal: 'text-primary bg-primary/10 border-primary/20',
  orange: 'text-primary bg-primary/10 border-primary/20',
  rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  emerald: 'text-primary bg-primary/10 border-primary/20',
  green: 'text-primary bg-primary/10 border-primary/20',
  cyan: 'text-primary bg-primary/10 border-primary/20'
};

function IndustrialMetric({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: React.ElementType, color: string }) {
  const iconStyle = color && COLOR_MAP[color] ? COLOR_MAP[color] : 'text-primary bg-primary/10 border-primary/20';
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-8 flex flex-col justify-between h-full group border-white/5 hover:border-primary/20 transition-all duration-500 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border group-hover:scale-110",
          iconStyle
        )}>
          <Icon size={22} strokeWidth={2} />
        </div>
        <div className="w-12 h-1 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors duration-500" />
      </div>
      <div className="mt-8 space-y-2">
        <p className="text-4xl md:text-5xl font-bold tracking-tighter text-text leading-none group-hover:text-primary transition-colors duration-500">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40">{label}</p>
      </div>
    </motion.div>
  );
}

export function RepoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: repo, isLoading, error } = useRepo(id || '');
  const { setPageContext } = useOra();

  useEffect(() => {
    setPageContext({
      page: 'Repository Detail (Node Intelligence)',
      repoName: repo?.name,
      description: repo?.description,
      language: repo?.language,
      stars: repo?.stars,
      forks: repo?.forks,
      issues: repo?.open_issues
    });
    return () => setPageContext({});
  }, [repo, setPageContext]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-6">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 border-2 border-primary/10 border-t-primary rounded-full shadow-[0_0_30px_-5px_rgba(212,175,55,0.3)]"
        />
        <div className="text-center space-y-3">
          <p className="text-xl font-bold tracking-tight text-primary uppercase tracking-[0.2em]">Synchronizing Intelligence Node</p>
          <p className="text-sm text-primary/40 font-medium">Decoding high-fidelity repository sectors...</p>
        </div>
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 text-white px-6">
        <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]">
          <AlertCircle size={48} strokeWidth={2} />
        </div>
        <div className="text-center space-y-3">
          <p className="text-2xl font-bold tracking-tighter">Connection Terminated</p>
          <p className="text-primary/40 text-sm font-bold uppercase tracking-widest">Error Code: RECON_LOST_IN_ARRAY</p>
        </div>
        <Link to="/dashboard" className="px-10 py-4 bg-primary text-black rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-primary/20 transition-all">
          Reboot Console
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: SMOOTH_EASE }}
      className="relative min-h-screen space-y-12 pb-32 px-4 md:px-0"
    >
      <SEO title={`${repo.name} | Node Intelligence`} description={repo.description || undefined} />
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-60" />
      </div>

      <div className="relative z-10 space-y-12">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 border-b border-white/5 pb-8">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-4 text-xs font-bold text-primary/40 hover:text-primary transition-all uppercase tracking-widest"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-sm">
               <ArrowLeft size={18} />
            </div>
            Return to Matrix
          </button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/editor/${id}`)}
            className="px-8 py-3.5 rounded-2xl bg-primary text-black text-xs font-bold uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-4"
          >
            Open in Editor <Terminal size={18} />
          </motion.button>
        </div>

        {/* Cinematic Header */}
        <section className="relative w-full h-[300px] md:h-[450px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden group shadow-2xl">
          <video 
            src="https://www.pexels.com/download/video/12692028/" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] ease-out grayscale-[0.2]"
          />
          <div className="absolute inset-0 noise-overlay opacity-[0.4] mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-10 md:p-16 space-y-6 z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: SMOOTH_EASE }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] uppercase tracking-[0.3em] font-bold backdrop-blur-md shadow-inner"
            >
              <Terminal size={14} className="fill-primary" />
              Intelligence Layer: <span className="font-serif italic ml-1">{repo.language || 'MULTI_ARRAY'}</span>
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-text leading-[0.9]">
               {repo.name.includes('/') ? repo.name.split('/')[1] : repo.name}
            </h1>
            <p className="text-primary/60 font-medium max-w-2xl text-sm md:text-lg leading-relaxed">
              {repo.description || 'Systemized repository node synchronized for high-fidelity architectural analysis and real-time contribution telemetry.'}
            </p>
          </div>
        </section>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Activity Graph */}
          <div className="lg:col-span-8 space-y-10">
            <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold flex items-center gap-4 text-white tracking-tight uppercase tracking-wider">
                    Temporal <span className="text-primary font-serif italic">Velocity</span>
                  </h3>
                  <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">Real-time signal pulse over 12 months</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                  <Zap size={14} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Stream</span>
                </div>
              </div>
              <div className="relative z-10 min-h-[350px]">
                <ActivityChart data={repo.activity} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <IndustrialMetric label="Node Impact" value={repo.stars} icon={Star} color="amber" />
              <IndustrialMetric label="Branch Logic" value={repo.forks} icon={GitPullRequest} color="teal" />
              <IndustrialMetric label="Logic Faults" value={repo.open_issues} icon={AlertCircle} color="rose" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Languages */}
            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/5">
              <h3 className="text-xl font-bold mb-8 border-b border-white/5 pb-6 flex items-center gap-4 text-white uppercase tracking-wider">
                Neural <span className="text-primary font-serif italic">Composition</span>
              </h3>
              <LanguageStats languages={repo.languages} />
            </div>

            {/* Metadata */}
            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] group relative overflow-hidden border-white/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <h3 className="text-xl font-bold mb-8 border-b border-white/5 pb-6 flex items-center gap-4 text-white uppercase tracking-wider">
                Node <span className="text-primary font-serif italic">Config</span>
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all duration-500">
                  <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Master Node</span>
                  <span className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 font-mono text-xs font-bold text-primary">
                    {repo.default_branch}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all duration-500">
                  <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Last Sync</span>
                  <span className="text-xs font-bold text-white tracking-widest">
                    {repo.last_sync ? new Date(repo.last_sync).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all duration-500">
                  <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Temporal Update</span>
                  <span className="text-xs font-bold text-white tracking-widest">
                    {repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contributors */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: SMOOTH_EASE }}
          className="glass-panel p-10 md:p-16 rounded-[3rem] relative overflow-hidden border-white/5"
        >
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none opacity-40" />
          <h3 className="text-2xl font-bold mb-12 border-b border-white/5 pb-8 flex items-center gap-5 text-white uppercase tracking-wider relative z-10">
             Archival <span className="text-primary font-serif italic">Collective</span>
          </h3>
          <div className="relative z-10">
            <ContributorGrid contributors={repo.contributors} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
