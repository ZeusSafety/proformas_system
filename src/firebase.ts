import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import type { Messaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'FAKE-API-KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'fake.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'fake-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'fake.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:aaaaaaaaaaaaaaaaaaaaaa',
}

export const firebaseApp = initializeApp(firebaseConfig)

async function getMessagingIfSupported(): Promise<Messaging | null> {
  try {
    const supported = await isSupported()
    if (!supported) return null
    return getMessaging(firebaseApp)
  } catch {
    return null
  }
}

export async function requestFcmToken(): Promise<string | null> {
  const msg = await getMessagingIfSupported()
  if (!msg) {
    console.warn('Firebase Messaging no soportado en este navegador')
    return null
  }
  try {
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined
    const token = await getToken(msg, { vapidKey })
    if (token) console.log('FCM token:', token)
    else console.warn('No se obtuvo token FCM (permiso denegado o SW no disponible)')
    return token || null
  } catch (err) {
    console.error('Error obteniendo token FCM', err)
    return null
  }
}

export async function listenForegroundMessages() {
  const msg = await getMessagingIfSupported()
  if (!msg) return
  onMessage(msg, (payload) => {
    console.log('Mensaje foreground:', payload)
  })
}

