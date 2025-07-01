@echo off
echo ======================================
echo      VitaApp - Avvio Frontend Solo
echo ======================================
echo.

:: Vai alla directory del progetto
cd /d "%~dp0..\frontend"

:: Controlla se le dipendenze sono installate
if not exist "node_modules" (
    echo [ERRORE] Dipendenze non trovate!
    echo Esegui prima: scripts\install.bat
    echo.
    pause
    exit /b 1
)

:: Controlla se package.json esiste
if not exist "package.json" (
    echo [ERRORE] File package.json non trovato!
    echo Assicurati di essere nella directory corretta del progetto.
    echo.
    pause
    exit /b 1
)

echo [INFO] Avvio Frontend Dev Server...
echo [INFO] Porta: 5173 (default Vite)
echo [INFO] URL: http://localhost:5173
echo.
echo [NOTA] Il browser si aprira' automaticamente
echo [NOTA] Per fermare il server, usa Ctrl+C
echo.
echo ======================================
echo.

:: Avvia il dev server
npm run dev