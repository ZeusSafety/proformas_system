# Guía de Despliegue en GitHub Pages

## Problema Resuelto

El error `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"` se ha solucionado con las siguientes configuraciones:

## Archivos Creados/Modificados

### 1. `.htaccess` (public/.htaccess)
- Configura tipos MIME correctos para archivos JavaScript
- Establece headers apropiados para Service Workers
- Configura redirecciones para SPA (Single Page Application)

### 2. `vite.config.ts`
- Configuración optimizada para GitHub Pages
- Nombres de archivo simplificados
- Target ES2015 para mejor compatibilidad

### 3. `index.html`
- Ruta corregida para el script principal

### 4. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Despliegue automático en cada push a main
- Build optimizado para producción

## Pasos para Desplegar

### Opción 1: Despliegue Automático (Recomendado)

1. **Habilitar GitHub Pages:**
   - Ve a Settings > Pages en tu repositorio
   - Source: "GitHub Actions"

2. **Hacer push de los cambios:**
   ```bash
   git add .
   git commit -m "Fix GitHub Pages MIME type issue"
   git push origin main
   ```

3. **El workflow se ejecutará automáticamente** y desplegará la aplicación.

### Opción 2: Despliegue Manual

1. **Build local:**
   ```bash
   npm run build:gh-pages
   ```

2. **Subir carpeta `dist/` a GitHub Pages:**
   - Ve a Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: "gh-pages" (crear si no existe)
   - Folder: "/ (root)"

3. **Copiar contenido de `dist/` a la rama `gh-pages`**

## Configuración de GitHub Pages

### En Settings > Pages:
- **Source:** GitHub Actions (recomendado) o Deploy from a branch
- **Branch:** main (para Actions) o gh-pages (para branch)
- **Folder:** / (root)

### Verificar que funcione:
- La URL será: `https://tuusuario.github.io/proformas_system/`
- Los archivos JavaScript deben cargar sin errores de MIME type
- El Service Worker debe registrarse correctamente

## Solución de Problemas

### Si persiste el error de MIME type:
1. Verifica que el archivo `.htaccess` esté en la carpeta `public/`
2. Asegúrate de que GitHub Pages esté configurado correctamente
3. Limpia la caché del navegador (Ctrl+F5)

### Si los archivos no se actualizan:
1. Verifica que el build se haya ejecutado correctamente
2. Revisa los logs del workflow en Actions
3. Espera unos minutos para que GitHub Pages actualice

## Archivos Importantes

- `public/.htaccess` - Configuración de tipos MIME
- `vite.config.ts` - Configuración de build
- `.github/workflows/deploy.yml` - Despliegue automático
- `public/_headers` - Headers adicionales (para referencia)

## Notas Técnicas

- GitHub Pages sirve archivos estáticos desde la carpeta `dist/`
- Los tipos MIME se configuran via `.htaccess` (aunque GitHub Pages tiene limitaciones)
- El Service Worker requiere headers específicos para funcionar correctamente
- La configuración de `base: '/proformas_system/'` es crucial para las rutas
