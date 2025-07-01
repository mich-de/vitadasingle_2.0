@echo off
echo ======================================
echo   VitaApp - Risoluzione TailwindCSS
echo ======================================
echo.

:: Vai alla directory frontend
cd /d "%~dp0..\frontend"

echo [DIAGNOSTICA] Verifica versione TailwindCSS attuale...
npm list tailwindcss
echo.

echo [TENTATIVO 1] Ripristino configurazione classica...
echo export default { > postcss.config.js
echo   plugins: { >> postcss.config.js
echo     tailwindcss: {}, >> postcss.config.js
echo     autoprefixer: {}, >> postcss.config.js
echo   }, >> postcss.config.js
echo } >> postcss.config.js
echo [✓] PostCSS config ripristinata
echo.

echo [TENTATIVO 2] Test build con configurazione classica...
npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] SUCCESS! La configurazione classica funziona!
    goto :success
)
echo [✗] Configurazione classica non funziona
echo.

echo [TENTATIVO 3] Aggiornamento a TailwindCSS v3.4.0...
npm install -D tailwindcss@3.4.0 >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] TailwindCSS downgrade a v3.4.0 completato
    npm run build >nul 2>&1
    if %errorlevel% equ 0 (
        echo [✓] SUCCESS! TailwindCSS v3.4.0 funziona!
        goto :success
    )
)
echo [✗] Downgrade non ha risolto
echo.

echo [TENTATIVO 4] Pulizia completa e reinstallazione...
rmdir /s /q node_modules >nul 2>&1
del package-lock.json >nul 2>&1
npm cache clean --force >nul 2>&1

echo [INFO] Reinstallazione dipendenze...
npm install >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Dipendenze reinstallate
    npm run build >nul 2>&1
    if %errorlevel% equ 0 (
        echo [✓] SUCCESS! Pulizia completa ha risolto!
        goto :success
    )
)
echo [✗] Pulizia completa non ha risolto
echo.

echo [TENTATIVO 5] Configurazione minimale di emergenza...
echo /** @type {import('tailwindcss').Config} */ > tailwind.config.js
echo module.exports = { >> tailwind.config.js
echo   content: [\"./src/**/*.{js,jsx,ts,tsx}\", \"./index.html\"], >> tailwind.config.js
echo   theme: { extend: {} }, >> tailwind.config.js
echo   plugins: [], >> tailwind.config.js
echo } >> tailwind.config.js

echo module.exports = { > postcss.config.js
echo   plugins: { >> postcss.config.js
echo     tailwindcss: {}, >> postcss.config.js
echo     autoprefixer: {}, >> postcss.config.js
echo   }, >> postcss.config.js
echo } >> postcss.config.js

npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] SUCCESS! Configurazione minimale funziona!
    goto :success
)

echo.
echo ======================================
echo        TUTTI I TENTATIVI FALLITI
echo ======================================
echo.
echo [AZIONI MANUALI RICHIESTE]
echo 1. Controlla errori specifici con: npm run dev
echo 2. Verifica versioni Node.js e npm
echo 3. Prova ad eliminare manualmente node_modules
echo 4. Consulta documentazione TailwindCSS
echo.
goto :end

:success
echo.
echo ======================================
echo         PROBLEMA RISOLTO! ✓
echo ======================================
echo.
echo [INFO] TailwindCSS ora dovrebbe funzionare correttamente
echo.
echo [PROSSIMI PASSI]
echo 1. Esegui: scripts\\start.bat
echo 2. L'applicazione dovrebbe caricare senza errori
echo 3. Se serve, restaura la configurazione completa gradualmente
echo.

:end
pause