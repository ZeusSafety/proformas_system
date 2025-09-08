/**
 * Utilidad para desarrollo que fuerza la limpieza de caché
 * Úsala cuando tengas problemas de caché en desarrollo/testing
 */

export async function nukeAllCaches(): Promise<void> {
  console.log('🚨 INICIANDO LIMPIEZA NUCLEAR DE CACHÉ...');
  
  try {
    // 1. Limpiar ALL las cachés del navegador
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('📦 Cachés encontradas:', cacheNames);
      
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log(`🗑️ Caché eliminada: ${cacheName}`);
      }
    }
    
    // 2. Desregistrar TODOS los Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('🔧 Service Workers encontrados:', registrations.length);
      
      for (const registration of registrations) {
        await registration.unregister();
        console.log('🔧 Service Worker desregistrado:', registration.scope);
      }
    }
    
    // 3. Limpiar localStorage y sessionStorage
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('💾 Storage local limpiado');
    } catch (e) {
      console.log('⚠️ No se pudo limpiar storage:', e);
    }
    
    // 4. Limpiar IndexedDB si existe
    if ('indexedDB' in window) {
      try {
        // Intenta limpiar bases de datos comunes de PWA
        const commonDBs = ['firebase-installations-store', 'firebase-messaging-store', 'workbox-expiration'];
        for (const dbName of commonDBs) {
          try {
            indexedDB.deleteDatabase(dbName);
            console.log(`🗃️ IndexedDB eliminada: ${dbName}`);
          } catch (e) {
            // Ignorar errores de DB que no existen
          }
        }
      } catch (e) {
        console.log('⚠️ Error limpiando IndexedDB:', e);
      }
    }
    
    console.log('✅ LIMPIEZA NUCLEAR COMPLETADA');
    console.log('🔄 Recargando página en 2 segundos...');
    
    // 5. Recargar después de un momento
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error durante limpieza nuclear:', error);
    // Como último recurso, recargar sin caché
    window.location.reload();
  }
}

/**
 * Función para mostrar información detallada de caché
 */
export async function debugCacheStatus(): Promise<void> {
  console.log('🔍 DIAGNÓSTICO DE CACHÉ:');
  
  // Service Workers
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`🔧 Service Workers activos: ${registrations.length}`);
    registrations.forEach((reg, i) => {
      console.log(`  ${i + 1}. Scope: ${reg.scope}`);
      console.log(`     State: ${reg.active?.state || 'N/A'}`);
    });
  }
  
  // Cachés
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    console.log(`📦 Cachés encontradas: ${cacheNames.length}`);
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      console.log(`  📁 ${cacheName}: ${keys.length} elementos`);
    }
  }
  
  // Storage
  try {
    console.log(`💾 localStorage: ${Object.keys(localStorage).length} elementos`);
    console.log(`💾 sessionStorage: ${Object.keys(sessionStorage).length} elementos`);
  } catch (e) {
    console.log('⚠️ No se pudo acceder a storage');
  }
  
  console.log('App version:', '1.0.1');
  console.log('Timestamp:', new Date().toISOString());
}
