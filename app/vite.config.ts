import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'robots.txt'],
      manifest: {
        name: 'Proformas PWA',
        short_name: 'Proformas',
        description: 'Gestión de proformas con soporte offline',
        theme_color: '#1E3A8A',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          // Usa el ícono existente de Vite como placeholder para evitar errores de imagen
          { src: '/vite.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/vite.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
          },
          {
            urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /.*\.(?:json)/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'json-cache' },
          },
        ],
      },
    }),
  ],
})
