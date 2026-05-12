import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RepoCardProps {
  id: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  lastUpdated?: string;
  url?: string;
}

export function RepoCard({ id, name, description, stars, forks, language, url }: RepoCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      onClick={() => navigate(`/repo/${id}`)}
      whileHover={{ y: -5, scale: 1.01 }}
      className="glass-panel p-6 cursor-pointer flex flex-col justify-between group h-full transition-all duration-500 border-border/10 hover:border-primary/40 hover:shadow-[0_8px_32px_-10px_rgba(166,124,0,0.15)] shadow-sm"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
            <Code size={20} strokeWidth={2} />
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); window.open(url, '_blank'); }}
            className="w-10 h-10 rounded-xl text-primary/40 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center border border-transparent hover:border-primary/20"
            aria-label={`Open ${name} on GitHub`}
          >
            <ExternalLink size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-bold text-text group-hover:text-primary transition-colors leading-tight line-clamp-1" title={name}>
            {name}
          </h4>
          <p className="text-sm text-text-muted/80 line-clamp-2 leading-relaxed font-medium">
            {description || 'No intelligence description provided for this node.'}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-5 text-primary/40 font-bold">
          <div className="flex items-center gap-2 text-xs">
            <Star size={14} className="text-primary fill-primary/20" />
            {stars}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <GitFork size={14} />
            {forks}
          </div>
        </div>
        
        {language && (
          <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest">
            {language}
          </div>
        )}
      </div>
    </motion.div>
  );
}
