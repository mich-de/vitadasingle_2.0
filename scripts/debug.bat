@echo off
echo ======================================
echo        VitaApp - Informazioni Debug
echo ======================================
echo.

:: Vai alla directory del progetto
cd /d "%~dp0.."

echo [SISTEMA]
echo Sistema Operativo: %OS%
echo Architettura: %PROCESSOR_ARCHITECTURE%
echo User: %USERNAME%
echo.

echo [NODE.JS & NPM]
node --version 2>nul && echo Node.js: OK || echo Node.js: NON INSTALLATO
npm --version 2>nul && echo npm: OK || echo npm: NON INSTALLATO
echo.

echo [PROGETTO]
echo Directory corrente: %CD%
echo.

echo [BACKEND]
cd backend
if exist "package.json" (
    echo package.json: ✓ Trovato
    for /f "tokens=2 delims=:" %%a in ('findstr "name" package.json') do echo Nome: %%a
    for /f "tokens=2 delims=:" %%a in ('findstr "version" package.json') do echo Versione: %%a
) else (
    echo package.json: ✗ NON TROVATO
)

if exist "node_modules" (
    echo node_modules: ✓ Installati
) else (
    echo node_modules: ✗ NON INSTALLATI
)

if exist "server.js" (
    echo server.js: ✓ Trovato
) else (
    echo server.js: ✗ NON TROVATO
)

if exist "events.json" (
    echo events.json: ✓ Trovato
) else (
    echo events.json: ⚠ Non ancora creato (normale al primo avvio)
)
echo.

echo [FRONTEND]
cd ..\frontend
if exist "package.json" (
    echo package.json: ✓ Trovato
    for /f "tokens=2 delims=:" %%a in ('findstr "name" package.json') do echo Nome: %%a
    for /f "tokens=2 delims=:" %%a in ('findstr "version" package.json') do echo Versione: %%a
) else (
    echo package.json: ✗ NON TROVATO
)

if exist "node_modules" (
    echo node_modules: ✓ Installati
) else (
    echo node_modules: ✗ NON INSTALLATI
)

if exist "src\App.tsx" (
    echo App.tsx: ✓ Trovato
) else (
    echo App.tsx: ✗ NON TROVATO
)

if exist "dist" (
    echo dist (build): ✓ Trovato
) else (
    echo dist (build): ⚠ Non ancora generato
)

if exist "vite.config.ts" (
    echo vite.config.ts: ✓ Trovato
) else (
    echo vite.config.ts: ✗ NON TROVATO
)
echo.

echo [PORTE DI RETE]
echo Controllo porte in uso...
netstat -an | findstr ":4000 " >nul && echo Porta 4000 (Backend): IN USO || echo Porta 4000 (Backend): LIBERA
netstat -an | findstr ":5173 " >nul && echo Porta 5173 (Frontend): IN USO || echo Porta 5173 (Frontend): LIBERA
echo.

echo [SCRIPTS DISPONIBILI]
cd ..\scripts
if exist "install.bat" echo ✓ install.bat
if exist "start.bat" echo ✓ start.bat  
if exist "start-backend.bat" echo ✓ start-backend.bat
if exist "start-frontend.bat" echo ✓ start-frontend.bat
if exist "build.bat" echo ✓ build.bat
if exist "debug.bat" echo ✓ debug.bat
echo.

echo [RACCOMANDAZIONI]
if not exist "..\backend\node_modules" (
    echo ⚠ Esegui: scripts\install.bat per installare le dipendenze
)
if not exist "..\frontend\node_modules" (
    echo ⚠ Esegui: scripts\install.bat per installare le dipendenze
)

echo.
echo ======================================
echo          Debug Info Completato
echo ======================================
echo.
pause