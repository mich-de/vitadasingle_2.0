@echo off
echo ======================================
echo       VitaApp - Installazione
echo ======================================
echo.

:: Controlla se Node.js e' installato
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] Node.js non trovato!
    echo Scarica Node.js da: https://nodejs.org/
    pause
    exit /b 1
)

:: Controlla se npm e' installato
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] npm non trovato!
    echo Assicurati che Node.js sia installato correttamente
    pause
    exit /b 1
)

echo [INFO] Node.js e npm trovati correttamente!
echo.

:: Vai alla directory del progetto
cd /d "%~dp0.."

echo [1/4] Installazione dipendenze Backend...
cd backend
if not exist "package.json" (
    echo [ERRORE] File package.json non trovato in /backend
    pause
    exit /b 1
)

npm install
if %errorlevel% neq 0 (
    echo [ERRORE] Installazione backend fallita!
    pause
    exit /b 1
)
echo [✓] Backend dependencies installate!
echo.

echo [2/4] Installazione dipendenze Frontend...
cd ..\frontend
if not exist "package.json" (
    echo [ERRORE] File package.json non trovato in /frontend
    pause
    exit /b 1
)

npm install
if %errorlevel% neq 0 (
    echo [ERRORE] Installazione frontend fallita!
    pause
    exit /b 1
)
echo [✓] Frontend dependencies installate!
echo.

echo [3/4] Verifica installazione...
echo Verifico che tutti i moduli siano installati correttamente...

cd ..\backend
if not exist "node_modules" (
    echo [ERRORE] Moduli backend non installati
    exit /b 1
)

cd ..\frontend
if not exist "node_modules" (
    echo [ERRORE] Moduli frontend non installati
    exit /b 1
)

echo [✓] Verifica completata!
echo.

echo [4/4] Setup completato!
echo.
echo ======================================
echo    Installazione VitaApp Completata!
echo ======================================
echo.
echo Prossimi passi:
echo 1. Esegui: scripts\start.bat
echo 2. Oppure: scripts\start-backend.bat e scripts\start-frontend.bat
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000
echo.
pause