/* global self */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: self?.ENV_FIREBASE_API_KEY || 'FAKE-API-KEY',
  authDomain: self?.ENV_FIREBASE_AUTH_DOMAIN || 'fake.firebaseapp.com',
  projectId: self?.ENV_FIREBASE_PROJECT_ID || 'fake-project',
  storageBucket: self?.ENV_FIREBASE_STORAGE_BUCKET || 'fake.appspot.com',
  messagingSenderId: self?.ENV_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: self?.ENV_FIREBASE_APP_ID || '1:000000000000:web:aaaaaaaaaaaaaaaaaaaaaa',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Notificación'
  const body = payload.notification?.body || 'Tienes un mensaje nuevo.'
  const icon = '/icons/icon-192.png'
  self.registration.showNotification(title, { body, icon })
})

