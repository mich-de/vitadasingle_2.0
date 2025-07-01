@echo off
setlocal enabledelayedexpansion

:: Titoli delle finestre per i processi
set "BACKEND_TITLE=VitaApp Backend"
set "FRONTEND_TITLE=VitaApp Frontend"

:: Directory dei progetti  
set "BACKEND_DIR=%~dp0backend"
set "FRONTEND_DIR=%~dp0frontend"
set "DATA_DIR=%~dp0data"

:menu
cls
echo ==========================================
echo        VitaApp - Pannello di Controllo
echo ==========================================
echo.

:: Controlla lo stato dei servizi
call :check_status
echo Stato attuale:
echo   - Backend:  !BACKEND_STATUS!
echo   - Frontend: !FRONTEND_STATUS!
echo.
echo ==========================================
echo                   MENU
echo ==========================================
echo.
echo [SERVIZI]
echo     1. [+] Avvia Tutto
echo     2. [-] Ferma Tutto  
echo     3. [R] Riavvia Tutto
echo.
echo     4. [+] Avvia Solo Backend
echo     5. [-] Ferma Solo Backend
echo     6. [+] Avvia Solo Frontend
echo     7. [-] Ferma Solo Frontend
echo.
echo [MANUTENZIONE]
echo     8. [C] Pulisci Cache
echo     9. [F] Fix Errori Import
echo    10. [I] Reinstalla Dipendenze
echo    11. [X] Pulizia Completa + Reinstall
echo.
echo [DIAGNOSTICA]
echo    12. [T] Test Sistema
echo    13. [?] Info Progetto
echo.
echo [SISTEMA]
echo    14. [Q] Esci (ferma tutto)
echo.

set /p choice="Scegli un'opzione (1-14): "

if /I "%choice%"=="1" (call :startall & goto menu)
if /I "%choice%"=="2" (call :stopall & goto menu)
if /I "%choice%"=="3" (call :restartall & goto menu)
if /I "%choice%"=="4" (call :startbackend & goto menu)
if /I "%choice%"=="5" (call :stopbackend & goto menu)
if /I "%choice%"=="6" (call :startfrontend & goto menu)
if /I "%choice%"=="7" (call :stopfrontend & goto menu)
if /I "%choice%"=="8" (call :clean_cache & goto menu)
if /I "%choice%"=="9" (call :fix_imports & goto menu)
if /I "%choice%"=="10" (call :reinstall_deps & goto menu)
if /I "%choice%"=="11" (call :deep_clean & goto menu)
if /I "%choice%"=="12" (call :test_system & goto menu)
if /I "%choice%"=="13" (call :project_info & goto menu)
if /I "%choice%"=="14" (goto exit_script)

echo.
echo [ERRORE] Scelta non valida. Riprova.
timeout /t 2 /nobreak >nul
goto menu

REM ==================================================================
REM                      FUNZIONI PRINCIPALI
REM ==================================================================

:startall
echo.
echo === AVVIO COMPLETO ===
call :startbackend
call :startfrontend
echo.
echo [OK] Avvio completato!
timeout /t 3 /nobreak >nul
goto :eof

:stopall  
echo.
echo === ARRESTO COMPLETO ===
call :stopbackend
call :stopfrontend
echo.
echo [OK] Arresto completato!
timeout /t 2 /nobreak >nul
goto :eof

:restartall
echo.
echo === RIAVVIO COMPLETO ===
call :stopall
echo.
echo [INFO] Attesa 3 secondi prima del riavvio...
timeout /t 3 /nobreak >nul
call :startall
goto :eof

REM ==================================================================
REM                    FUNZIONI DI CONTROLLO SERVIZI
REM ==================================================================

:check_status
    set "BACKEND_STATUS=[X] Fermo"
    set "FRONTEND_STATUS=[X] Fermo"
    tasklist /FI "WINDOWTITLE eq %BACKEND_TITLE%" 2>nul | find "node.exe" >nul
    if not errorlevel 1 set "BACKEND_STATUS=[OK] In Esecuzione"
    tasklist /FI "WINDOWTITLE eq %FRONTEND_TITLE%" 2>nul | find "node.exe" >nul  
    if not errorlevel 1 set "FRONTEND_STATUS=[OK] In Esecuzione"
    goto :eof

:startbackend
    echo.
    echo --- Avvio Backend ---
    tasklist /FI "WINDOWTITLE eq %BACKEND_TITLE%" 2>nul | find "node.exe" >nul
    if not errorlevel 1 (
        echo [WARN] Il Backend e' gia' in esecuzione.
    ) else (
        if not exist "%BACKEND_DIR%\server.js" (
            echo [ERROR] File server.js non trovato in %BACKEND_DIR%
        ) else (
            echo Directory: %BACKEND_DIR%
            echo [INFO] Avvio del server Backend...
            start "%BACKEND_TITLE%" /D "%BACKEND_DIR%" cmd /c "node server.js"
            echo [OK] Backend avviato in una nuova finestra.
            echo API disponibili su: http://localhost:4000
        )
    )
    timeout /t 2 /nobreak >nul
    goto :eof

:stopbackend
    echo.
    echo --- Arresto Backend ---
    tasklist /FI "WINDOWTITLE eq %BACKEND_TITLE%" 2>nul | find "node.exe" >nul
    if not errorlevel 1 (
        echo [INFO] Trovato processo Backend, arresto in corso...
        taskkill /F /FI "WINDOWTITLE eq %BACKEND_TITLE%" /T >nul 2>&1
        echo [OK] Backend arrestato.
    ) else (
        echo [WARN] Il Backend non risulta in esecuzione.
    )
    timeout /t 1 /nobreak >nul
    goto :eof

:startfrontend
    echo.
    echo --- Avvio Frontend ---
    tasklist /FI "WINDOWTITLE eq %FRONTEND_TITLE%" 2>nul | find "node.exe" >nul
    if not errorlevel 1 (
        echo [WARN] Il Frontend e' gia' in esecuzione.
    ) else (
        if not exist "%FRONTEND_DIR%\package.json" (
            echo [ERROR] File package.json non trovato in %FRONTEND_DIR%
        ) else (
            echo Directory: %FRONTEND_DIR%
            echo [INFO] Avvio del server di sviluppo...
            start "%FRONTEND_TITLE%" /D "%FRONTEND_DIR%" cmd /c "npm run dev"
            echo [OK] Frontend avviato in una nuova finestra.
            echo App disponibile su: http://localhost:5173
        )
    )
    timeout /t 2 /nobreak >nul
    goto :eof

:stopfrontend
    echo.
    echo --- Arresto Frontend ---
    tasklist /FI "WINDOWTITLE eq %FRONTEND_TITLE%" 2>nul | find "node.exe" >nul
    if not errorlevel 1 (
        echo [INFO] Trovato processo Frontend, arresto in corso...
        taskkill /F /FI "WINDOWTITLE eq %FRONTEND_TITLE%" /T >nul 2>&1
        echo [OK] Frontend arrestato.
    ) else (
        echo [WARN] Il Frontend non risulta in esecuzione.
    )
    timeout /t 1 /nobreak >nul
    goto :eof

REM ==================================================================
REM                    FUNZIONI DI MANUTENZIONE
REM ==================================================================

:clean_cache
echo.
echo === PULIZIA CACHE ===
call :stopall
echo.
cd /d "%FRONTEND_DIR%"
echo [INFO] Pulizia cache Vite...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" 2>nul
if exist ".vite" rmdir /s /q ".vite" 2>nul
if exist "dist" rmdir /s /q "dist" 2>nul
if exist ".parcel-cache" rmdir /s /q ".parcel-cache" 2>nul
if exist "node_modules\.tmp" rmdir /s /q "node_modules\.tmp" 2>nul
echo [INFO] Pulizia file temporanei...
del /q /s *.log 2>nul
del /q /s *.tmp 2>nul
echo [OK] Cache pulita!
echo.
echo Premi un tasto per tornare al menu...
pause >nul
goto :eof

:fix_imports
echo.
echo === FIX ERRORI IMPORT ===
call :stopall
echo.
cd /d "%FRONTEND_DIR%"
echo [INFO] Pulizia cache completa...
call :clean_cache_silent
echo.
echo [INFO] Verifica dipendenze...
npm install --silent
echo.
echo [INFO] Verifica configurazione TypeScript...
npx tsc --noEmit --project tsconfig.json
if errorlevel 1 (
    echo [WARN] Trovati errori TypeScript, ma continuo...
) else (
    echo [OK] TypeScript OK!
)
echo.
echo [OK] Fix completato!
echo.
echo Premi un tasto per tornare al menu...
pause >nul
goto :eof

:reinstall_deps
echo.
echo === REINSTALLAZIONE DIPENDENZE ===
call :stopall
echo.
cd /d "%FRONTEND_DIR%"
echo [INFO] Rimozione node_modules...
if exist "node_modules" rmdir /s /q "node_modules" 2>nul
echo [INFO] Rimozione lock files...
if exist "package-lock.json" del "package-lock.json" 2>nul
if exist "yarn.lock" del "yarn.lock" 2>nul
echo.
echo [INFO] Pulizia cache npm...
npm cache clean --force
echo.
echo [INFO] Reinstallazione dipendenze...
npm install
echo.
echo [OK] Dipendenze reinstallate!
echo.
echo Premi un tasto per tornare al menu...
pause >nul
goto :eof

:deep_clean
echo.
echo === PULIZIA COMPLETA + REINSTALL ===
echo.
echo [ATTENZIONE] Questa operazione:
echo     - Fermera' tutti i servizi
echo     - Cancellera' tutte le cache
echo     - Reinstallera' tutte le dipendenze
echo     - Puo' richiedere diversi minuti
echo.
set /p confirm="Sei sicuro? (S/N): "
if /i not "%confirm%"=="S" (
    echo [INFO] Operazione annullata.
    timeout /t 2 /nobreak >nul
    goto :eof
)
echo.
echo [INFO] Inizio pulizia completa...
call :stopall
call :clean_cache_silent
call :reinstall_deps_silent
echo.
echo [OK] Pulizia completa terminata!
echo.
echo Premi un tasto per tornare al menu...
pause >nul
goto :eof

:clean_cache_silent
cd /d "%FRONTEND_DIR%"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" 2>nul
if exist ".vite" rmdir /s /q ".vite" 2>nul
if exist "dist" rmdir /s /q "dist" 2>nul
if exist ".parcel-cache" rmdir /s /q ".parcel-cache" 2>nul
if exist "node_modules\.tmp" rmdir /s /q "node_modules\.tmp" 2>nul
del /q /s *.log 2>nul
del /q /s *.tmp 2>nul
goto :eof

:reinstall_deps_silent
cd /d "%FRONTEND_DIR%"
if exist "node_modules" rmdir /s /q "node_modules" 2>nul
if exist "package-lock.json" del "package-lock.json" 2>nul
if exist "yarn.lock" del "yarn.lock" 2>nul
npm cache clean --force >nul 2>&1
npm install --silent
goto :eof

REM ==================================================================
REM                    FUNZIONI DI DIAGNOSTICA
REM ==================================================================

:test_system
echo.
echo === TEST SISTEMA ===
echo.

echo Test 1: Verifica struttura progetto...
if not exist "%DATA_DIR%" (
    echo [ERROR] Cartella data non trovata!
) else (
    echo [OK] Cartella data trovata
    for %%f in ("%DATA_DIR%\*.json") do echo    - %%~nxf
)
echo.

echo Test 2: Verifica backend...
if not exist "%BACKEND_DIR%\server.js" (
    echo [ERROR] File server.js non trovato!
) else (
    echo [OK] Backend configurato correttamente
)
echo.

echo Test 3: Verifica frontend...
if not exist "%FRONTEND_DIR%\src\pages\Deadlines.tsx" (
    echo [ERROR] Pagine frontend mancanti!
) else (
    echo [OK] Frontend configurato correttamente
)
echo.
echo Test 4: Verifica dipendenze...
cd /d "%FRONTEND_DIR%"
if not exist "node_modules" (
    echo [WARN] Node_modules non installati
) else (
    echo [OK] Dipendenze installate
)
echo.

echo Test 5: Test connessione API...
curl -s http://localhost:4000/api/scadenze >nul 2>&1
if errorlevel 1 (
    echo [WARN] Server non raggiungibile (normale se spento)
) else (
    echo [OK] API endpoints raggiungibili
)
echo.

echo Test 6: Verifica configurazione TypeScript...
cd /d "%FRONTEND_DIR%"
npx tsc --noEmit --project tsconfig.json >nul 2>&1
if errorlevel 1 (
    echo [WARN] Problemi di configurazione TypeScript
) else (
    echo [OK] Configurazione TypeScript OK
)
echo.

echo [OK] Test completati!
echo.
echo Premi un tasto per tornare al menu...
pause >nul
goto :eof

:project_info
echo.
echo === INFORMAZIONI PROGETTO ===
echo.
echo Directory Progetto: %~dp0
echo Directory Backend:  %BACKEND_DIR%
echo Directory Frontend: %FRONTEND_DIR%
echo Directory Data:     %DATA_DIR%
echo.
echo URL di sviluppo:
echo    - Frontend: http://localhost:5173
echo    - Backend:  http://localhost:4000
echo    - API:      http://localhost:4000/api
echo.
echo Struttura Progetto:
echo    +-- backend/     (Server Express.js)
echo    +-- frontend/    (App React + TypeScript + Vite)
echo    +-- data/        (File JSON per dati)
echo    +-- scripts/     (Script di utilita')
echo    +-- control.bat  (Questo pannello di controllo)
echo.
echo Tecnologie utilizzate:
echo    - Frontend: React 18 + TypeScript + Vite + Tailwind CSS
echo    - Backend:  Node.js + Express.js
echo    - Storage:  File JSON (data/)
echo    - Types:    Struttura modulare organizzata
echo.

cd /d "%FRONTEND_DIR%"
if exist "package.json" (
    echo Versione App:
    findstr "\"version\"" package.json
)
echo.

echo Premi un tasto per tornare al menu...
pause >nul
goto :eof

REM ==================================================================
REM                        FUNZIONI DI USCITA
REM ==================================================================

:exit_script
echo.
echo === CHIUSURA PANNELLO DI CONTROLLO ===
echo.
echo [INFO] Arresto di tutti i servizi...
call :stopall
echo.
echo Arrivederci!
echo.
timeout /t 2 /nobreak >nul
exit /b 0
