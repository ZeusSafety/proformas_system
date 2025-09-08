import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { listenForegroundMessages } from './firebase';
import { setupMobileOptimizations } from './utils/mobileUtils';

// Configurar optimizaciones móviles
setupMobileOptimizations();

// Renderizar la aplicación
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Registrar Service Worker con gestión de caché mejorada
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Limpiar cachés antiguas al cargar
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name.includes('app-cache') || 
          name.includes('json-cache') || 
          name.includes('workbox-precache')
        );
        await Promise.all(oldCaches.map(name => caches.delete(name)));
        console.log('Cachés limpiadas:', oldCaches);
      }

      // Construir URL correctamente para GitHub Pages
      const baseUrl = import.meta.env.BASE_URL || '/proformas_system/';
      const swUrl = new URL('firebase-messaging-sw.js', window.location.origin + baseUrl).toString();
      
      const registration = await navigator.serviceWorker.register(swUrl, {
        updateViaCache: 'none' // Nunca cachear el SW
      });
      
      console.log('SW registered: ', registration);
      
      // Forzar actualización si hay un SW en espera
      if (registration.waiting) {
        registration.waiting.postMessage({type: 'SKIP_WAITING'});
      }
      
      // Escuchar cambios en el SW
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nueva versión disponible, preguntar al usuario si desea actualizar
              if (confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  });
}

// Configurar Firebase Messaging
listenForegroundMessages();
