@echo off
echo Installazione VitaApp...
echo.

echo Controlla Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERRORE: Node.js non trovato!
    pause
    exit
)

echo.
echo Vai alla directory backend...
cd /d "%~dp0..\backend"
echo Directory corrente: %CD%

if exist package.json (
    echo Installo dipendenze backend...
    npm install
) else (
    echo ERRORE: package.json backend non trovato!
    pause
    exit
)

echo.
echo Vai alla directory frontend...
cd /d "%~dp0..\frontend"
echo Directory corrente: %CD%

if exist package.json (
    echo Installo dipendenze frontend...
    npm install
    echo Installo TailwindCSS v3...
    npm install tailwindcss@3.4.0 --save-dev
) else (
    echo ERRORE: package.json frontend non trovato!
    pause
    exit
)

echo.
echo Installazione completata!
echo Ora puoi eseguire: scripts\start.bat
pause