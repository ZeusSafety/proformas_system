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

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('firebase-messaging-sw.js', import.meta.env.BASE_URL).toString();
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Configurar Firebase Messaging
listenForegroundMessages();
