@echo off
echo ======================================
echo       VitaApp - Build Produzione
echo ======================================
echo.

:: Vai alla directory del progetto
cd /d "%~dp0.."

:: Controlla se le dipendenze sono installate
if not exist "frontend\node_modules" (
    echo [ERRORE] Dipendenze frontend non trovate!
    echo Esegui prima: scripts\install.bat
    pause
    exit /b 1
)

echo [1/3] Pulizia build precedenti...
cd frontend
if exist "dist" (
    rmdir /s /q "dist"
    echo [✓] Directory dist pulita
)
echo.

echo [2/3] Compilazione TypeScript...
npm run build
if %errorlevel% neq 0 (
    echo [ERRORE] Build fallita!
    echo Controlla gli errori TypeScript sopra.
    pause
    exit /b 1
)
echo [✓] Compilazione completata!
echo.

echo [3/3] Verifica build...
if exist "dist" (
    echo [✓] Build generata in: frontend\dist\
    
    :: Mostra dimensioni dei file principali
    echo.
    echo [INFO] Dimensioni build:
    dir dist\assets\*.js dist\assets\*.css 2>nul | findstr /i "\.js \.css"
    
    echo.
    echo [INFO] Per testare la build di produzione:
    echo 1. npm run preview (nella directory frontend)
    echo 2. Oppure servi i file da frontend\dist\ con un web server
    
) else (
    echo [ERRORE] Directory dist non creata!
    exit /b 1
)

echo.
echo ======================================
echo      Build di Produzione Completata!
echo ======================================
echo.
echo La build e' pronta in: frontend\dist\
echo.
echo Opzioni di deploy:
echo - Copia contenuto di dist\ su web server
echo - Usa npm run preview per test locale
echo - Deploy su Netlify, Vercel, o servizio simile
echo.
pause