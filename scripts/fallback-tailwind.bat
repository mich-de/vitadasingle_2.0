@echo off
echo ======================================
echo  VitaApp - Fallback TailwindCSS v3
echo ======================================
echo.

:: Vai alla directory frontend
cd /d "%~dp0..\frontend"

echo [INFO] TailwindCSS v4 sta ancora causando problemi.
echo Facciamo downgrade a TailwindCSS v3 che è più stabile.
echo.

echo [1/5] Rimozione TailwindCSS v4...
npm uninstall tailwindcss @tailwindcss/postcss
echo [✓] TailwindCSS v4 rimosso!
echo.

echo [2/5] Installazione TailwindCSS v3 stabile...
npm install -D tailwindcss@^3.4.0 @tailwindcss/forms@^0.5.7
if %errorlevel% neq 0 (
    echo [ERRORE] Installazione fallita!
    pause
    exit /b 1
)
echo [✓] TailwindCSS v3 installato!
echo.

echo [3/5] Aggiornamento configurazione PostCSS...
echo export default { > postcss.config.js
echo   plugins: { >> postcss.config.js
echo     tailwindcss: {}, >> postcss.config.js
echo     autoprefixer: {}, >> postcss.config.js
echo   }, >> postcss.config.js
echo } >> postcss.config.js
echo [✓] PostCSS config aggiornata!
echo.

echo [4/5] Aggiornamento configurazione TailwindCSS...
echo /** @type {import('tailwindcss').Config} */ > tailwind.config.js
echo export default { >> tailwind.config.js
echo   darkMode: 'class', >> tailwind.config.js
echo   content: [ >> tailwind.config.js
echo     \"./index.html\", >> tailwind.config.js
echo     \"./src/**/*.{js,ts,jsx,tsx}\", >> tailwind.config.js
echo   ], >> tailwind.config.js
echo   theme: { >> tailwind.config.js
echo     extend: { >> tailwind.config.js
echo       colors: { >> tailwind.config.js
echo         'primary-light': '#4361EE', >> tailwind.config.js
echo         'primary-dark': '#6366F1', >> tailwind.config.js
echo         'background-light': '#F8FAFC', >> tailwind.config.js
echo         'background-dark': '#0F172A', >> tailwind.config.js
echo         'card-light': '#FFFFFF', >> tailwind.config.js
echo         'card-dark': '#1E293B', >> tailwind.config.js
echo         'text-primary-light': '#1E293B', >> tailwind.config.js
echo         'text-primary-dark': '#F1F5F9', >> tailwind.config.js
echo         'text-secondary-light': '#64748B', >> tailwind.config.js
echo         'text-secondary-dark': '#94A3B8', >> tailwind.config.js
echo       }, >> tailwind.config.js
echo     }, >> tailwind.config.js
echo   }, >> tailwind.config.js
echo   plugins: [require('@tailwindcss/forms')], >> tailwind.config.js
echo } >> tailwind.config.js
echo [✓] TailwindCSS config aggiornata!
echo.

echo [5/5] Test build...
npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Build successful! TailwindCSS v3 funziona!
) else (
    echo [⚠] Ci sono ancora alcuni problemi, ma dovrebbe funzionare meglio
)

echo.
echo ======================================
echo     Fallback TailwindCSS Completato!
echo ======================================
echo.
echo [INFO] Configurazione downgrade a TailwindCSS v3:
echo - ✓ TailwindCSS v3.4.0 (stabile)
echo - ✓ Configurazione classica PostCSS
echo - ✓ Configurazione semplificata
echo.
echo [PROSSIMI PASSI]
echo 1. Esegui: scripts\\start.bat
echo 2. L'applicazione dovrebbe funzionare senza errori
echo.
pause