@echo off
REM delete-duplicates.bat
REM Script para eliminar carpetas duplicadas en INSPECTEN
REM Ejecutar desde: C:\Users\coguc\Documents\GitHub\inspecten

echo.
echo ======================================
echo   LIMPIEZA DE CARPETAS DUPLICADAS
echo   PROYECTO: INSPECTEN
echo ======================================
echo.

REM Confirmación de seguridad
echo ADVERTENCIA: Este script eliminara las siguientes carpetas:
echo - inspecten\inspecten\ (estructura duplicada)
echo - app\login\ (si existe)
echo - apps\ (si existe)
echo.
echo Asegurate de haber ejecutado cleanup-inspecten.js primero!
echo.
set /p confirm="Estas seguro que deseas continuar? (S/N): "

if /i "%confirm%" neq "S" (
    echo.
    echo Operacion cancelada.
    pause
    exit /b
)

echo.
echo Iniciando limpieza...
echo.

REM Eliminar carpeta duplicada inspecten/inspecten
if exist "inspecten" (
    echo Eliminando carpeta duplicada: inspecten\inspecten\
    rmdir /s /q "inspecten"
    echo [OK] Carpeta inspecten eliminada
) else (
    echo [INFO] No se encontro carpeta inspecten duplicada
)

REM Eliminar carpeta app/login si existe
if exist "app\login" (
    echo Eliminando carpeta: app\login\
    rmdir /s /q "app\login"
    echo [OK] Carpeta app\login eliminada
) else (
    echo [INFO] No se encontro carpeta app\login
)

REM Eliminar carpeta apps si existe
if exist "apps" (
    echo Eliminando carpeta: apps\
    rmdir /s /q "apps"
    echo [OK] Carpeta apps eliminada
) else (
    echo [INFO] No se encontro carpeta apps
)

REM Eliminar archivos de respaldo innecesarios
if exist "app\page.backup.tsx" (
    del "app\page.backup.tsx"
    echo [OK] Archivo page.backup.tsx eliminado
)

if exist "app\page.backup2.tsx" (
    del "app\page.backup2.tsx"
    echo [OK] Archivo page.backup2.tsx eliminado
)

echo.
echo ======================================
echo   LIMPIEZA COMPLETADA
echo ======================================
echo.
echo Estructura limpia. Ahora ejecuta:
echo   npm run dev
echo.
echo Para verificar que todo funcione correctamente.
echo.
pause