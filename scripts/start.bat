@echo off
echo ======================================
echo        VitaApp - Avvio Completo
echo ======================================
echo.

:: Controlla se le dipendenze sono installate
cd /d "%~dp0.."

if not exist "backend\node_modules" (
    echo [ERRORE] Dipendenze backend non trovate!
    echo Esegui prima: scripts\install.bat
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo [ERRORE] Dipendenze frontend non trovate!
    echo Esegui prima: scripts\install.bat
    pause
    exit /b 1
)

echo [INFO] Avvio Backend e Frontend...
echo.

:: Avvia il backend in una nuova finestra
echo [1/2] Avvio Backend Server (Porta 4000)...
start "VitaApp Backend" cmd /k "cd /d "%~dp0..\backend" && npm start"

:: Aspetta un momento per far partire il backend
timeout /t 3 /nobreak >nul

:: Avvia il frontend in una nuova finestra
echo [2/2] Avvio Frontend Dev Server (Porta 5173)...
start "VitaApp Frontend" cmd /k "cd /d "%~dp0..\frontend" && npm run dev"

:: Aspetta un momento e poi apri il browser
echo.
echo [INFO] Attendo che i server si avviino...
timeout /t 8 /nobreak >nul

echo [INFO] Apertura browser...
start "" "http://localhost:5173"

echo.
echo ======================================
echo        VitaApp Avviato con Successo!
echo ======================================
echo.
echo Servizi attivi:
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000/api/events
echo.
echo [NOTA] Due nuove finestre del terminale sono state aperte:
echo - Una per il Backend Server
echo - Una per il Frontend Dev Server
echo.
echo Per fermare i servizi, chiudi le finestre del terminale
echo oppure usa Ctrl+C in ciascuna finestra.
echo.
echo Buon lavoro con VitaApp! 🚀
echo.
pause