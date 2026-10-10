
@echo off
setlocal
cd /d "%~dp0"
title DoTheDamnWork Setup V2

echo ==========================================
echo     DoTheDamnWork - Python Detection
echo ==========================================
echo.

set "PYTHON_CMD="

REM Case 1: Python Launcher is available
where py >nul 2>&1
if not errorlevel 1 (
    py -3.13 -c "import sys; exit(0 if sys.version_info[:2] == (3,13) else 1)" >nul 2>&1
    if not errorlevel 1 set "PYTHON_CMD=py -3.13"
)

REM Case 2: No usable py - try python directly
if not defined PYTHON_CMD (
    where python >nul 2>&1
    if not errorlevel 1 (
        python -c "import sys; exit(0 if sys.version_info[:2] == (3,13) else 1)" >nul 2>&1
        if not errorlevel 1 set "PYTHON_CMD=python"
    )
)

REM Report result
if not defined PYTHON_CMD (
    echo [NOT FOUND] Python 3.13 is not accessible.
    echo.
    echo This test does not install Python yet.
    echo Next step: add automatic installation.
    pause
    exit /b 1
)

echo [OK] Compatible Python detected.
%PYTHON_CMD% --version
echo.
echo Detection test completed successfully.
pause
exit /b 0