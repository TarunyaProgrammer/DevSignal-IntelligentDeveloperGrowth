import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Resources } from './pages/Resources';
import { LearningPathPage } from './pages/LearningPathPage';
import { SandboxEditor } from './pages/SandboxEditor';
import { RepoEditor } from './pages/RepoEditor';
import { RepoDetail } from './pages/RepoDetail';
import { Profile } from './pages/Profile';
import { DebugChartPage } from './DebugChartPage';
import { NotFound } from './pages/NotFound';
import { CustomCursor } from './components/layout/CustomCursor';
import { OraProvider } from './contexts/OraContext';
import { OraOrb } from './components/ora/OraOrb';
import { OraPage } from './pages/OraPage';

import { useEffect } from 'react';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    const isLandingPage = location.pathname === '/';
    if (isLandingPage) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      // Re-trigger theme logic from context if needed
      // Actually, ThemeProvider will handle it if we just force a class update here based on localStorage
      const savedTheme = localStorage.getItem('vite-ui-theme') || 'system';
      if (savedTheme !== 'system') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(savedTheme);
      } else {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(systemTheme);
      }
    }
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <OraProvider>
            <SearchProvider>
              <CustomCursor />
              <OraOrb />
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<LandingPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/ora" element={<OraPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/repo/:id" element={<RepoDetail />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/learning-path/:courseId" element={<LearningPathPage />} />
                  <Route path="/editor" element={<SandboxEditor />} />
                  <Route path="/editor/:id" element={<RepoEditor />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/debug-chart" element={<DebugChartPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
            </SearchProvider>
          </OraProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
