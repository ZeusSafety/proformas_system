// Constantes de la aplicación

export const APP_CONFIG = {
  name: 'Proformas PWA',
  version: '1.0.0',
  baseUrl: import.meta.env.BASE_URL || '/',
} as const;

export const COLORS = {
  primary: '#1E3A8A',
  black: '#000000',
  white: '#FFFFFF',
  accent: '#FACC15',
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const STORAGE_KEYS = {
  auth: 'auth',
  theme: 'theme',
  fcmToken: 'fcmToken',
} as const;

export const API_ENDPOINTS = {
  proformas: 'data/proformas.json',
  productos: 'data/productos.json',
  pedidos: 'data/pedidos.json',
} as const;

export const NOTIFICATION_PERMISSIONS = {
  granted: 'granted',
  denied: 'denied',
  default: 'default',
} as const;
