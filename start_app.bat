@echo off
title Habit Tracker OS
chcp 65001 >nul
echo ===================================================
echo             HABIT TRACKER OS (React 19)
echo ===================================================
echo 1. Открыть Habit Tracker в браузере (Автономно)
echo 2. Запустить Vite Dev-сервер (localhost:5173)
echo 3. Синхронизировать с Android (Capacitor)
echo ===================================================
set /p choice="Выберите вариант [1-3] (по умолчанию 1): "

if "%choice%"=="2" (
    echo Запуск Dev-сервера...
    npm run dev -- --open
    exit /b
)
if "%choice%"=="3" (
    echo Синхронизация с Android...
    npm run cap:sync
    pause
    exit /b
)

echo Открываю Habit Tracker в браузере...
start "" "%~dp0index.html"
exit /b
