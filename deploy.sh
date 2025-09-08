#!/bin/bash

echo "========================================"
echo "    DESPLIEGUE A GITHUB PAGES"
echo "========================================"
echo

echo "[1/4] Limpiando archivos anteriores..."
npm run clean
if [ $? -ne 0 ]; then
    echo "ERROR: Fallo al limpiar archivos"
    exit 1
fi

echo "[2/4] Compilando TypeScript..."
npx tsc -b
if [ $? -ne 0 ]; then
    echo "ERROR: Fallo en la compilación de TypeScript"
    exit 1
fi

echo "[3/4] Construyendo aplicación..."
npx vite build --mode production
if [ $? -ne 0 ]; then
    echo "ERROR: Fallo en el build de Vite"
    exit 1
fi

echo "[4/4] Verificando archivos generados..."
if [ ! -f "dist/index.html" ]; then
    echo "ERROR: No se encontró dist/index.html"
    exit 1
fi

echo
echo "========================================"
echo "    BUILD COMPLETADO EXITOSAMENTE"
echo "========================================"
echo
echo "Archivos listos en la carpeta: dist/"
echo
echo "PRÓXIMOS PASOS:"
echo "1. Sube el contenido de la carpeta 'dist/' a tu repositorio"
echo "2. Ve a Settings > Pages en GitHub"
echo "3. Configura Source como 'Deploy from a branch'"
echo "4. Selecciona la rama 'main' y carpeta '/ (root)'"
echo "5. Espera unos minutos para que se actualice"
echo
echo "URL de tu sitio: https://tuusuario.github.io/proformas_system/"
echo
