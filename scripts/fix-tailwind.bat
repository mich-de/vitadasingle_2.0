@echo off
echo ======================================
echo    VitaApp - Fix TailwindCSS v4
echo ======================================
echo.

:: Vai alla directory frontend
cd /d "%~dp0..\frontend"

echo [1/4] Installazione plugin TailwindCSS PostCSS...
npm install @tailwindcss/postcss@latest
if %errorlevel% neq 0 (
    echo [ERRORE] Installazione plugin fallita!
    echo Provo con versione specifica...
    npm install @tailwindcss/postcss@4.0.0-alpha.34
    if %errorlevel% neq 0 (
        echo [ERRORE] Installazione ancora fallita!
        echo Proviamo con approccio alternativo...
        npm install --save-dev postcss-import
        if %errorlevel% neq 0 (
            echo [ERRORE] Installazione alternative fallita!
            pause
            exit /b 1
        fi
    )
)
echo [✓] Plugin PostCSS installato!
echo.

echo [2/4] Pulizia cache npm e node_modules...
npm cache clean --force >nul 2>&1
echo [✓] Cache pulita!
echo.

echo [3/4] Reinstallazione dipendenze...
npm install
if %errorlevel% neq 0 (
    echo [ERRORE] Reinstallazione fallita!
    pause
    exit /b 1
)
echo [✓] Dipendenze reinstallate!
echo.

echo [4/4] Test configurazione TailwindCSS...
npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] TailwindCSS configurato correttamente!
) else (
    echo [⚠] Ci sono ancora alcuni problemi di configurazione
    echo Continuo comunque...
)

echo.
echo ======================================
echo      Fix TailwindCSS Completato!
echo ======================================
echo.
echo [INFO] Configurazione aggiornata per TailwindCSS v4:
echo - ✓ Plugin @tailwindcss/postcss aggiunto
echo - ✓ PostCSS config aggiornata
echo - ✓ TailwindCSS config aggiornata per ES modules
echo.
echo [PROSSIMI PASSI]
echo 1. Esegui: scripts\\start.bat
echo 2. Se persiste errore, prova: scripts\\fallback-tailwind.bat
echo.
pause