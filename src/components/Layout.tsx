import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useOnline } from '../hooks/useOnline';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggle } = useTheme();
  const online = useOnline();

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-950 text-black dark:text-white">
      <header className="sticky top-0 z-10 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            to="/proformas" 
            className="flex items-center gap-2 font-bold text-lg text-[--color-primary] hover:opacity-80 transition-opacity"
          >
            ⚡ Proformas
          </Link>
          <div className="flex items-center gap-3">
            <span 
              className={`text-xs px-2 py-1 rounded-full ${
                online 
                  ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                  : 'bg-red-500/20 text-red-700 dark:text-red-300'
              }`}
            >
              {online ? 'Online' : 'Offline'}
            </span>
            <button 
              onClick={toggle} 
              className="btn p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid gap-6">
          {children}
        </div>
      </main>
      
      <footer className="border-t border-black/10 dark:border-white/10 text-center py-4 text-sm text-gray-600 dark:text-gray-400">
        © 2025 Tu Empresa
      </footer>
    </div>
  );
}
