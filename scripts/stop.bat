@echo off
echo ======================================
echo       VitaApp - Stop Tutti i Servizi
echo ======================================
echo.

echo [INFO] Ricerca processi VitaApp in esecuzione...
echo.

:: Ferma tutti i processi Node.js che potrebbero essere VitaApp
echo [1/3] Ricerca processi Node.js...
tasklist | findstr "node.exe" >nul
if %errorlevel% equ 0 (
    echo Processi Node.js trovati:
    tasklist | findstr "node.exe"
    echo.
    
    choice /c YN /m "Vuoi terminare TUTTI i processi Node.js? (Y/N)"
    if errorlevel 2 goto :skip_node
    if errorlevel 1 (
        echo Terminando processi Node.js...
        taskkill /f /im node.exe >nul 2>&1
        echo [✓] Processi Node.js terminati
    )
    :skip_node
) else (
    echo [✓] Nessun processo Node.js trovato
)
echo.

:: Controlla processi cmd specifici di VitaApp
echo [2/3] Ricerca finestre VitaApp...
tasklist /v | findstr "VitaApp" >nul
if %errorlevel% equ 0 (
    echo Finestre VitaApp trovate, chiusura in corso...
    for /f "tokens=2" %%i in ('tasklist /v ^| findstr "VitaApp"') do (
        taskkill /f /pid %%i >nul 2>&1
    )
    echo [✓] Finestre VitaApp chiuse
) else (
    echo [✓] Nessuna finestra VitaApp trovata
)
echo.

:: Verifica che le porte siano liberate
echo [3/3] Controllo porte di rete...
timeout /t 2 /nobreak >nul

netstat -an | findstr ":4000 " >nul
if %errorlevel% equ 0 (
    echo [⚠] Porta 4000 ancora in uso
) else (
    echo [✓] Porta 4000 libera
)

netstat -an | findstr ":5173 " >nul
if %errorlevel% equ 0 (
    echo [⚠] Porta 5173 ancora in uso
) else (
    echo [✓] Porta 5173 libera
)

echo.
echo ======================================
echo           Cleanup Completato
echo ======================================
echo.
echo [INFO] Se le porte sono ancora occupate:
echo 1. Riavvia il computer
echo 2. Oppure usa: netstat -ano | findstr ":4000"
echo    per trovare il PID e terminarlo manualmente
echo.
echo [INFO] Ora puoi riavviare VitaApp con: scripts\start.bat
echo.
pause