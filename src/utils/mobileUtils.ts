// Utilidades para mejorar la compatibilidad móvil

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android/.test(navigator.userAgent);
};

export const preventZoom = (): void => {
  if (typeof window === 'undefined') return;
  
  // Prevenir zoom en inputs en iOS
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (isIOS()) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
      }
    });
    
    input.addEventListener('blur', () => {
      if (isIOS()) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        }
      }
    });
  });
};

export const setupMobileOptimizations = (): void => {
  if (typeof window === 'undefined') return;
  
  // Prevenir zoom
  preventZoom();
  
  // Mejorar scroll en móviles
  document.body.style.webkitOverflowScrolling = 'touch';
  
  // Prevenir selección de texto accidental
  if (isMobile()) {
    document.body.style.webkitUserSelect = 'none';
    document.body.style.userSelect = 'none';
    
    // Permitir selección en inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.style.webkitUserSelect = 'text';
      input.style.userSelect = 'text';
    });
  }
  
  // Mejorar rendimiento en dispositivos de gama baja
  if (isAndroid()) {
    document.body.style.willChange = 'transform';
  }
};
