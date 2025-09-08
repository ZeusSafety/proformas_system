/**
 * Utilidades para gestión de caché en PWA
 */

/**
 * Limpia todas las cachés de la aplicación
 */
export async function clearAllCaches(): Promise<void> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      console.log('Cachés encontradas:', cacheNames);
      
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('Todas las cachés han sido limpiadas');
    } catch (error) {
      console.error('Error al limpiar cachés:', error);
    }
  }
}

/**
 * Limpia cachés específicas por patrón
 */
export async function clearCachesByPattern(patterns: string[]): Promise<void> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      const cachesToDelete = cacheNames.filter(name => 
        patterns.some(pattern => name.includes(pattern))
      );
      
      await Promise.all(cachesToDelete.map(name => caches.delete(name)));
      console.log('Cachés limpiadas:', cachesToDelete);
    } catch (error) {
      console.error('Error al limpiar cachés específicas:', error);
    }
  }
}

/**
 * Fuerza la actualización de la aplicación
 */
export async function forceAppUpdate(): Promise<void> {
  try {
    // Limpiar todas las cachés
    await clearAllCaches();
    
    // Desregistrar todos los service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
      console.log('Service Workers desregistrados');
    }
    
    // Recargar la página
    window.location.reload();
  } catch (error) {
    console.error('Error al forzar actualización:', error);
    // Como fallback, solo recargar
    window.location.reload();
  }
}

/**
 * Verifica si hay actualizaciones disponibles
 */
export async function checkForUpdates(): Promise<boolean> {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return !!registration.waiting;
      }
    } catch (error) {
      console.error('Error al verificar actualizaciones:', error);
    }
  }
  return false;
}

/**
 * Obtiene información sobre las cachés actuales
 */
export async function getCacheInfo(): Promise<{name: string, size: number}[]> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return { name, size: keys.length };
        })
      );
      return cacheInfo;
    } catch (error) {
      console.error('Error al obtener información de cachés:', error);
      return [];
    }
  }
  return [];
}
