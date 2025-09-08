import { useEffect, useState } from 'react';

export function useOnline() {
  const [online, setOnline] = useState<boolean>(() => {
    // Verificar estado inicial
    return navigator.onLine;
  });

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    // Agregar listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}
