import { useEffect, useState } from 'react';
import type { Theme } from '../types';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Por defecto usar modo claro (sin detección automática del sistema)
    return 'light';
  });

  useEffect(() => {
    // Aplicar el tema al documento
    const root = document.documentElement;
    
    // Remover clases anteriores
    root.classList.remove('light', 'dark');
    
    // Agregar la clase del tema actual
    root.classList.add(theme);
    
    // Establecer color-scheme
    root.style.colorScheme = theme;
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
    
    // Actualizar meta theme-color para PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#1E3A8A');
    }
    
    // Actualizar apple-mobile-web-app-status-bar-style para iOS
    const appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleStatusBar) {
      appleStatusBar.setAttribute('content', theme === 'dark' ? 'black-translucent' : 'default');
    }
  }, [theme]);


  const toggle = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggle };
}
