@echo off
echo ========================================
echo    DESPLIEGUE A GITHUB PAGES
echo ========================================
echo.

echo [1/4] Limpiando archivos anteriores...
call npm run clean
if errorlevel 1 (
    echo ERROR: Fallo al limpiar archivos
    pause
    exit /b 1
)

echo [2/4] Compilando TypeScript...
call npx tsc -b
if errorlevel 1 (
    echo ERROR: Fallo en la compilación de TypeScript
    pause
    exit /b 1
)

echo [3/4] Construyendo aplicación...
call npx vite build --mode production
if errorlevel 1 (
    echo ERROR: Fallo en el build de Vite
    pause
    exit /b 1
)

echo [4/4] Verificando archivos generados...
if not exist "dist\index.html" (
    echo ERROR: No se encontró dist\index.html
    pause
    exit /b 1
)

echo.
echo ========================================
echo    BUILD COMPLETADO EXITOSAMENTE
echo ========================================
echo.
echo Archivos listos en la carpeta: dist/
echo.
echo PRÓXIMOS PASOS:
echo 1. Sube el contenido de la carpeta 'dist/' a tu repositorio
echo 2. Ve a Settings ^> Pages en GitHub
echo 3. Configura Source como "Deploy from a branch"
echo 4. Selecciona la rama "main" y carpeta "/ (root)"
echo 5. Espera unos minutos para que se actualice
echo.
echo URL de tu sitio: https://tuusuario.github.io/proformas_system/
echo.
pause
