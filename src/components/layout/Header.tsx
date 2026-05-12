import { Search, LogOut, Terminal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { NotificationsPanel } from '@/components/layout/NotificationsPanel';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Header() {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.user_name || 'User';

  return (
    <header className="h-20 bg-bg/80 backdrop-blur-md border-b border-border px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-4 md:hidden">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black shadow-sm">
            <Terminal size={20} strokeWidth={2.5} />
          </div>
        </div>
        
        <div className="relative w-full max-w-md hidden sm:block group">
          <div className="flex items-center px-4 py-2.5 bg-surface border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
            <Search className="text-text-muted mr-3" size={18} />
            <input 
              type="text" 
              placeholder="Search repositories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none w-full text-text placeholder:text-text-muted/60"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <ThemeToggle />
        <NotificationsPanel />
        
        <div className="h-8 w-px bg-border mx-1 hidden md:block" />
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-text leading-tight">{displayName}</p>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest text-[9px]">Developer</p>
          </div>
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full border border-border object-cover shadow-sm" />
          ) : (
            <div className="w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <button 
          onClick={logout}
          className="p-2.5 rounded-xl border border-border text-text-muted hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all ml-2"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
