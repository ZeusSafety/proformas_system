import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { listenForegroundMessages } from './firebase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('firebase-messaging-sw.js', import.meta.env.BASE_URL).toString()
    navigator.serviceWorker.register(swUrl).catch(console.error)
  })
}

listenForegroundMessages()
