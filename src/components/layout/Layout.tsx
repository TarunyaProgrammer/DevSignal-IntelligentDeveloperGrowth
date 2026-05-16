import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const isOraPage = location.pathname === '/ora';

  return (
    <div className="relative min-h-screen bg-bg text-text font-sans overflow-x-hidden">
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 p-4 md:p-10 pb-28 md:pb-16 transition-all duration-500">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {!isOraPage && <Footer />}
        
        <BottomNav />
      </div>
    </div>
  );
}
