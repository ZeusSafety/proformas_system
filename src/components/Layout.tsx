import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useOnline } from '../hooks/useOnline';
import { forceAppUpdate, checkForUpdates } from '../utils/cacheUtils';
import { nukeAllCaches, debugCacheStatus } from '../utils/devCacheBuster';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggle } = useTheme();
  const online = useOnline();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Verificar actualizaciones periódicamente
  useEffect(() => {
    const checkUpdates = async () => {
      if (online) {
        const hasUpdate = await checkForUpdates();
        setUpdateAvailable(hasUpdate);
      }
    };
    
    checkUpdates();
    const interval = setInterval(checkUpdates, 30000); // Verificar cada 30 segundos
    
    return () => clearInterval(interval);
  }, [online]);

  const handleForceUpdate = () => {
    if (confirm('¿Estás seguro de que deseas forzar la actualización? Esto limpiará toda la caché local.')) {
      forceAppUpdate();
    }
  };

  const handleNuclearClean = () => {
    if (confirm('🚨 LIMPIEZA NUCLEAR: Esto eliminará TODA la caché, Service Workers y datos locales. ¿Continuar?')) {
      nukeAllCaches();
    }
  };

  const handleDebugCache = () => {
    debugCacheStatus();
    alert('Revisa la consola del navegador (F12) para ver el diagnóstico completo de caché');
  };

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
            {updateAvailable && (
              <button 
                onClick={handleForceUpdate}
                className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 hover:bg-orange-500/30 transition-colors"
                title="Nueva versión disponible - Click para actualizar"
              >
                🔄 Actualizar
              </button>
            )}
            <button 
              onClick={handleDebugCache}
              className="text-xs px-1 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Diagnosticar estado de caché (F12 → Console)"
            >
              🔍
            </button>
            <button 
              onClick={handleForceUpdate}
              className="text-xs px-1 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Forzar actualización (limpiar caché)"
            >
              🗑️
            </button>
            <button 
              onClick={handleNuclearClean}
              className="text-xs px-1 py-1 rounded hover:bg-red-500/20 dark:hover:bg-red-500/20 transition-colors"
              title="🚨 LIMPIEZA NUCLEAR - Eliminar TODO (usar solo si nada más funciona)"
            >
              💥
            </button>
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
      
      {/* Navegación principal */}
      <nav className="border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link 
              to="/proformas" 
              className="py-4 px-2 border-b-2 border-transparent hover:border-[--color-primary] transition-colors font-medium text-gray-700 dark:text-gray-300 hover:text-[--color-primary]"
            >
              Proformas
            </Link>
            <Link 
              to="/estadisticas" 
              className="py-4 px-2 border-b-2 border-transparent hover:border-[--color-primary] transition-colors font-medium text-gray-700 dark:text-gray-300 hover:text-[--color-primary]"
            >
              Estadísticas
            </Link>
            <Link 
              to="/productos" 
              className="py-4 px-2 border-b-2 border-transparent hover:border-[--color-primary] transition-colors font-medium text-gray-700 dark:text-gray-300 hover:text-[--color-primary]"
            >
              Productos
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid gap-6">
          {children}
        </div>
      </main>
      
      <footer className="border-t border-black/10 dark:border-white/10 text-center py-4 text-sm text-gray-600 dark:text-gray-400">
        © 2025 Business Import Zeus
      </footer>
    </div>
  );
}
