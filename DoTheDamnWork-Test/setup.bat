
@echo off
setlocal
cd /d "%~dp0"

title DoTheDamnWork Setup

echo ==========================================
echo        DoTheDamnWork Setup
echo ==========================================
echo.

REM 1. Check requirements file
if not exist "requirements.txt" (
    echo [ERROR] requirements.txt not found.
    goto :fail
)

REM 2. Find Python 3.13
set "PYTHON_CMD="

py -3.13 --version >nul 2>&1
if not errorlevel 1 set "PYTHON_CMD=py -3.13"

if not defined PYTHON_CMD (
    echo [ERROR] Python 3.13 was not found.
    echo Please install Python 3.13 and try again.
    goto :fail
)

echo [OK] Python 3.13 found.
%PYTHON_CMD% --version
echo.

REM 3. Create virtual environment if needed
if exist ".venv\Scripts\python.exe" (
    echo [INFO] Existing .venv found.
) else (
    echo [INFO] Creating virtual environment...
    %PYTHON_CMD% -m venv .venv
    if errorlevel 1 goto :fail
)

REM 4. Install dependencies
echo.
echo [INFO] Installing dependencies...
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto :fail

REM 5. Verify imports
echo.
echo [INFO] Verifying packages...
".venv\Scripts\python.exe" -c "import cv2, torch, ultralytics, serial; print('OpenCV:', cv2.__version__); print('PyTorch:', torch.__version__); print('Ultralytics:', ultralytics.__version__); print('PySerial:', serial.__version__)"
if errorlevel 1 goto :fail

REM 6. Check dependencies
".venv\Scripts\python.exe" -m pip check
if errorlevel 1 goto :fail

echo.
echo ==========================================
echo Setup completed successfully!
echo Run your project using .venv Python.
echo ==========================================
pause
exit /b 0

:fail
echo.
echo [ERROR] Setup failed.
echo Review the messages above before retrying.
pause
exit /b 1