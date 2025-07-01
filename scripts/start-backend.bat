@echo off
echo ======================================
echo      VitaApp - Avvio Backend Solo
echo ======================================
echo.

:: Vai alla directory del progetto
cd /d "%~dp0..\backend"

:: Controlla se le dipendenze sono installate
if not exist "node_modules" (
    echo [ERRORE] Dipendenze non trovate!
    echo Esegui prima: scripts\install.bat
    echo.
    pause
    exit /b 1
)

:: Controlla se server.js esiste
if not exist "server.js" (
    echo [ERRORE] File server.js non trovato!
    echo Assicurati di essere nella directory corretta del progetto.
    echo.
    pause
    exit /b 1
)

echo [INFO] Avvio Backend Server...
echo [INFO] Porta: 4000
echo [INFO] API: http://localhost:4000/api/events
echo.
echo [NOTA] Per fermare il server, usa Ctrl+C
echo.
echo ======================================
echo.

:: Avvia il server
npm start