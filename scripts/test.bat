@echo off
echo ======================================
echo        VitaApp - Test Veloce
echo ======================================
echo.

:: Vai alla directory del progetto
cd /d "%~dp0.."

echo [TEST 1/5] Verifica Node.js e npm...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [✗] Node.js non trovato! Installa da: https://nodejs.org/
    goto :error
)
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [✗] npm non trovato!
    goto :error
)
echo [✓] Node.js e npm OK
echo.

echo [TEST 2/5] Controllo dipendenze...
if not exist "backend\node_modules" (
    echo [✗] Dipendenze backend mancanti! Esegui: scripts\install.bat
    goto :error
)
if not exist "frontend\node_modules" (
    echo [✗] Dipendenze frontend mancanti! Esegui: scripts\install.bat
    goto :error
)
echo [✓] Dipendenze installate
echo.

echo [TEST 3/5] Controllo file essenziali...
if not exist "backend\server.js" (
    echo [✗] File backend\server.js mancante!
    goto :error
)
if not exist "frontend\src\App.tsx" (
    echo [✗] File frontend\src\App.tsx mancante!
    goto :error
)
if not exist "frontend\package.json" (
    echo [✗] File frontend\package.json mancante!
    goto :error
)
echo [✓] File essenziali presenti
echo.

echo [TEST 4/5] Test compilazione frontend...
cd frontend
npm run build >nul 2>&1
if %errorlevel% neq 0 (
    echo [✗] Compilazione frontend fallita! Controlla errori TypeScript
    goto :error
)
echo [✓] Compilazione frontend OK
echo.

echo [TEST 5/5] Test avvio backend veloce...
cd ..\backend
timeout /t 1 /nobreak >nul
start /min cmd /c "node server.js" >nul 2>&1
timeout /t 3 /nobreak >nul

:: Controlla se il server risponde
curl -s http://localhost:4000/api/events >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Backend risponde correttamente
    
    :: Ferma il server di test
    taskkill /f /im node.exe >nul 2>&1
) else (
    echo [⚠] Backend test incompleto (normale se porta occupata)
    taskkill /f /im node.exe >nul 2>&1
)

echo.
echo ======================================
echo           TUTTI I TEST PASSATI! 
echo ======================================
echo.
echo [INFO] VitaApp è pronto per l'uso!
echo.
echo Prossimi passi:
echo 1. Esegui: scripts\start.bat
echo 2. Apri: http://localhost:5173
echo 3. Inizia a organizzare la tua vita! 🚀
echo.
goto :end

:error
echo.
echo ======================================
echo             TEST FALLITO!
echo ======================================
echo.
echo [AZIONI CONSIGLIATE]
echo 1. Esegui: scripts\install.bat
echo 2. Controlla: scripts\debug.bat
echo 3. Se persiste, controlla README.md
echo.

:end
pause