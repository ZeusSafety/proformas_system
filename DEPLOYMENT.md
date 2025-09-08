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

### 4. Scripts de Despliegue
- `deploy.bat` - Script para Windows
- `deploy.sh` - Script para Linux/Mac

## Pasos para Desplegar

### Método 1: Usando Scripts (Recomendado)

#### En Windows:
```bash
deploy.bat
```

#### En Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Método 2: Manual

1. **Build local:**
   ```bash
   npm run build:gh-pages
   ```

2. **Subir archivos a GitHub:**
   - Copia todo el contenido de la carpeta `dist/` a la raíz de tu repositorio
   - Haz commit y push:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Configurar GitHub Pages:**
   - Ve a Settings > Pages en tu repositorio
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"

## Configuración de GitHub Pages

### En Settings > Pages:
- **Source:** Deploy from a branch
- **Branch:** main
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
2. Asegúrate de que los archivos de `dist/` estén en la raíz del repositorio
3. Espera unos minutos para que GitHub Pages actualice

## Archivos Importantes

- `public/.htaccess` - Configuración de tipos MIME
- `vite.config.ts` - Configuración de build
- `deploy.bat` / `deploy.sh` - Scripts de despliegue
- `public/_headers` - Headers adicionales (para referencia)

## Notas Técnicas

- GitHub Pages sirve archivos estáticos desde la raíz del repositorio
- Los tipos MIME se configuran via `.htaccess` (aunque GitHub Pages tiene limitaciones)
- El Service Worker requiere headers específicos para funcionar correctamente
- La configuración de `base: '/proformas_system/'` es crucial para las rutas
- Los archivos de `dist/` deben copiarse a la raíz del repositorio para el despliegue
