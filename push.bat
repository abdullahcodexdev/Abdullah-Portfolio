@echo off
REM ============================================================
REM  Universal GitHub Push Script
REM  Copy this push.bat into ANY project folder.
REM  Double-click it to commit and push that folder's changes.
REM  (The folder must already be a git repo with a remote set.)
REM ============================================================

title Push to GitHub
cd /d "%~dp0"

echo ============================================================
echo   PUSH TO GITHUB
echo   Project folder: %CD%
echo ============================================================
echo.

REM --- Make sure this folder is a git repository ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo  [!] This folder is NOT a git repository yet.
    echo.
    echo  Set it up ONCE first ^(in this folder^):
    echo      git init -b main
    echo      git remote add origin https://github.com/USER/REPO.git
    echo      git add -A
    echo      git commit -m "first commit"
    echo      git push -u origin main
    echo.
    echo  After that, just double-click this push.bat to update.
    echo.
    pause
    exit /b
)

REM --- Ask for a short message describing the change ---
set "msg="
set /p "msg=Type what you changed (or press Enter for default): "
if "%msg%"=="" set "msg=Update %date% %time%"

echo.
echo --- Staging all changes ---
git add -A

echo --- Saving snapshot (commit) ---
git commit -m "%msg%"

echo --- Uploading to GitHub (push) ---
git push

echo.
echo ============================================================
echo   DONE. If a live site uses this repo, it updates in 1-2 min.
echo ============================================================
echo.
pause
