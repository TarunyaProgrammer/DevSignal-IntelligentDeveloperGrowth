import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, Code2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Console', path: '/dashboard' },
  { icon: BarChart3, label: 'Signals', path: '/analytics' },
  { icon: BookOpen, label: 'Codex', path: '/resources' },
  { icon: Code2, label: 'Logic', path: '/editor' },
  { icon: User, label: 'Identity', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  if (location.pathname === '/ora') return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6 transition-all duration-300 md:bottom-8">
      <div className="glass-panel p-2 flex items-center justify-between gap-1 shadow-xl rounded-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all relative group rounded-xl",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-text-muted hover:bg-surface-hover hover:text-text"
              )}
            >
              <item.icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={cn("transition-transform duration-300", !isActive && "group-hover:scale-110", isActive && "scale-110")} 
              />
              <span className={cn(
                "text-[10px] font-medium mt-1.5 transition-all duration-300",
                isActive ? "opacity-100" : "opacity-0 h-0 mt-0 group-hover:opacity-100 group-hover:h-auto group-hover:mt-1.5"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <span className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
