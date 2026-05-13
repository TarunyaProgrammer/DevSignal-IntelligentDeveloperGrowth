import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  ShieldCheck, 
  Clock, 
  Star, 
  GitFork, 
  Share2,
  ExternalLink,
  User,
  Terminal,
  Activity,
  LogOut
} from 'lucide-react';
import { SEO } from '@/components/layout/SEO';

interface ProfileData {
  stats: {
    totalStars: number;
    totalForks: number;
    totalProjects: number;
    languages: Record<string, number>;
  };
  persona: {
    title: string;
    level: number;
  };
  rhythm: {
    type: string;
    description: string;
  };
}

export function Profile() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/profile/summary`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
        />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-text">Loading Identity Profile...</p>
          <p className="text-sm text-text-muted">Fetching verified blocks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-8 pb-32">
      <SEO title="User Profile" description="Verified technical identity and contribution metrics." />
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-muted font-medium">
            <User size={16} />
            <span>Identity Archive</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text">
            User <span className="text-primary">Profile</span>
          </h2>
        </div>
        
        <button 
          onClick={logout}
          className="px-5 py-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl font-medium text-sm hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 shadow-sm"
        >
          <LogOut size={16} />
          Terminate Session
        </button>
      </div>

          {/* Cinematic Identity Header */}
      <section className="relative w-full h-[280px] md:h-[350px] rounded-[2rem] overflow-hidden mb-12 group">
        <video 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.5] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-10 z-10 w-full">
           {/* Avatar */}
           <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl p-1.5 bg-primary/20 backdrop-blur-sm border border-primary/30 shadow-2xl">
                 <img 
                   src={user?.user_metadata.avatar_url} 
                   alt="Profile" 
                   className="w-full h-full rounded-2xl object-cover"
                 />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-bg border border-primary/30 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1.5 shadow-xl whitespace-nowrap">
                 <ShieldCheck size={12} className="fill-primary/20" />
                 VERIFIED ID
              </div>
           </div>

           {/* Info */}
           <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold mb-2">
                  <Terminal size={12} className="fill-primary" />
                  System Identity
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-text">
                  {user?.user_metadata.full_name || user?.user_metadata.user_name}
                </h1>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                 <div className="px-4 py-2 rounded-xl bg-surface/40 backdrop-blur-md border border-primary/10 text-xs font-medium text-text-muted">
                    Class: <span className="text-primary font-bold">{data?.persona.title}</span>
                 </div>
                 <div className="px-4 py-2 rounded-xl bg-surface/40 backdrop-blur-md border border-primary/10 text-xs font-medium text-text-muted">
                    Integrity: <span className="text-primary font-bold">{data?.persona.level ? data.persona.level * 10 : 0}%</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Bento Grid Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Vertical Stack */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 flex flex-col justify-between h-[180px] group overflow-hidden relative">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                <Star size={20} strokeWidth={2} />
              </div>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Impact Array</span>
            </div>
            <div>
              <div className="text-4xl font-semibold tracking-tight text-text leading-none mb-2">{data?.stats.totalStars}</div>
              <p className="text-sm font-medium text-text-muted">Global Stars Received</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between h-[180px] group overflow-hidden relative">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                <GitFork size={20} strokeWidth={2} />
              </div>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Iteration Depth</span>
            </div>
            <div>
              <div className="text-4xl font-semibold tracking-tight text-text leading-none mb-2">{data?.stats.totalForks}</div>
              <p className="text-sm font-medium text-text-muted">Total Forks Parsed</p>
            </div>
          </div>
        </div>

        {/* Center: Language Stack */}
        <div className="lg:col-span-1 glass-panel p-6 relative">
          <h3 className="text-lg font-semibold text-text mb-5 border-b border-border pb-3 flex items-center justify-between">
            Stack Galaxy
            <Terminal size={18} className="text-text-muted" />
          </h3>
          <div className="space-y-3">
            {Object.entries(data?.stats.languages || {}).slice(0, 8).map(([lang, count], i) => (
              <div key={lang} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors group/lang">
                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 rounded-lg bg-bg border border-border flex items-center justify-center text-xs font-medium text-text-muted group-hover/lang:text-primary transition-colors">
                     {i + 1}
                   </div>
                   <span className="font-semibold text-sm text-text">{lang}</span>
                </div>
                <span className="text-xs font-medium text-text-muted">{count} blocks</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rhythm Node */}
        <div className="glass-panel p-6 flex flex-col justify-between h-full group overflow-hidden relative">
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
              <Clock size={20} strokeWidth={2} />
            </div>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Temporal Sync</span>
          </div>

          <div className="text-center space-y-6 py-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-4xl group-hover:shadow-md group-hover:scale-105 transition-all">
              {data?.rhythm.type === "Night Owl" ? "🌙" : "☀️"}
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-text">{data?.rhythm.type}</h3>
              <p className="text-sm text-text-muted leading-relaxed px-4">
                {data?.rhythm.description}
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 h-2 rounded-full overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-1 bg-surface-hover group-hover:bg-primary/60 transition-all duration-300" style={{ transitionDelay: `${i * 30}ms` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="glass-panel p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-r from-surface to-surface-hover">
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="space-y-4 text-center lg:text-left relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
            <Share2 size={14} />
            Broadcast Enabled
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-text leading-tight">
            Identity Compilation Complete
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            Your professional footprint has been successfully parsed and verified across the global developer grid.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
          <button className="px-6 py-3 bg-primary text-bg rounded-xl font-medium text-sm hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 justify-center">
            <Activity size={18} />
            Sync Profile
          </button>
          <button className="px-6 py-3 bg-surface border border-border text-text rounded-xl font-medium text-sm hover:bg-surface-hover transition-all flex items-center gap-2 justify-center">
            <ExternalLink size={18} />
            Public Link
          </button>
        </div>
      </div>

    </div>
  );
}
