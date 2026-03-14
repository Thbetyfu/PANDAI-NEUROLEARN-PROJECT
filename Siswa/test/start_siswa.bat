@echo off
set "BASE_DIR=%~dp0.."
title PANDAI - Integrated Startup (Robust Mode)

echo ============================================================
echo   PANDAI NEUROLEARN - One Click Startup System
echo ============================================================
echo.

echo [0/3] Membersihkan Sesi Sebelumnya (Cleanup)...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM python.exe /T >nul 2>&1

if exist "%BASE_DIR%\Pandai -LMS-Siswa\.next" (
    echo Menghapus cache .next...
    rmdir /S /Q "%BASE_DIR%\Pandai -LMS-Siswa\.next" >nul 2>&1
)

timeout /t 2 /nobreak > nul

echo [1/3] Menyalakan Mesin Neuro-Client (Python)...
start "PANDAI Neuro-Client" /D "%BASE_DIR%\Neuro-Client-Siswa" cmd /c "python main.py"
echo.

echo [2/3] Menyalakan Dashboard LMS (Next.js)...
start "PANDAI LMS" /D "%BASE_DIR%\Pandai -LMS-Siswa" cmd /c "npm run dev"
echo.

echo [3/3] Membuka Dashboard di Browser (http://localhost:3000)...
echo Menunggu server melakukan kompilasi pertama (15 detik)...
echo Sabar ya Pak, sedang menyiapkan mesin pintar...
timeout /t 15 /nobreak > nul
start http://localhost:3000
echo.

echo ============================================================
echo   SEMUA SISTEM TELAH DIPICU DAN BROWSER DIBUKA!
echo ============================================================
timeout /t 3
