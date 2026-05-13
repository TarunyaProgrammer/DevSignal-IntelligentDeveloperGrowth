import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorHeaderProps {
  repoName: string;
  repoId: string;
  onBack: () => void;
  isSyncing: boolean;
}

export function EditorHeader({ repoName, repoId, onBack, isSyncing }: EditorHeaderProps) {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-black/40 backdrop-blur-2xl z-50 relative">
      <div className="flex items-center gap-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-4 text-xs font-bold text-primary/40 hover:text-primary transition-all uppercase tracking-widest"
        >
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </div>
          Back
        </button>
        
        <div className="h-10 w-px bg-white/5" />
        
        <div className="space-y-1">
          <h1 className="text-lg font-bold tracking-tighter text-white leading-none uppercase tracking-widest">
            {repoName}
          </h1>
          <div className="flex items-center gap-3">
            <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-mono text-primary font-bold uppercase tracking-widest">
              INTELLIGENCE_NODE
            </div>
            <span className="text-[10px] text-white/20 font-mono">
              SHA-256://{repoId?.substring(0, 16)}...
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className={cn(
          "flex items-center gap-3 px-4 py-2 border rounded-xl backdrop-blur-md transition-all duration-500",
          isSyncing ? "bg-primary/20 border-primary/40" : "bg-primary/5 border-primary/10"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]",
            isSyncing ? "bg-primary animate-ping" : "bg-primary animate-pulse"
          )} />
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
            {isSyncing ? "Cloud Sync Active" : "Neural Connection Stable"}
          </span>
        </div>
      </div>
    </header>
  );
}
