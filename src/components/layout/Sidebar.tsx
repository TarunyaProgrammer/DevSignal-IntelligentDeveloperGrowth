import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  BookOpen, 
  Code2, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Console', href: '/dashboard' },
  { icon: BarChart3, label: 'Signals', href: '/analytics' },
  { icon: BookOpen, label: 'Codex', href: '/resources' },
  { icon: Code2, label: 'Logic', href: '/editor' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-bg border-r border-border h-screen sticky top-0 transition-colors duration-200">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          DevSignal
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-text-muted hover:bg-surface-hover hover:text-text"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform duration-200 group-hover:scale-110",
              "group-[.active]:text-primary"
            )} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/40 space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary/60 hover:bg-primary/5 hover:text-primary w-full transition-all group font-bold text-xs uppercase tracking-widest">
          <Settings size={18} className="group-hover:rotate-90 transition-transform duration-700" />
          <span>Config</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 w-full transition-all group font-bold text-xs uppercase tracking-widest">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform duration-500" />
          <span>Terminate</span>
        </button>
      </div>
    </aside>
  );
}
