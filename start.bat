@echo off
REM Library Management System - Quick Start Script for Windows

echo ========================================
echo Library Management System - Quick Start
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo.
echo Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -q -r requirements.txt

REM Run migrations
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Prompt for superuser creation
echo.
set /p CREATE_SUPER="Do you want to create a superuser? (y/n): "
if /i "%CREATE_SUPER%"=="y" (
    python manage.py createsuperuser
)

REM Prompt for sample data
echo.
set /p LOAD_DATA="Do you want to load sample data? (y/n): "
if /i "%LOAD_DATA%"=="y" (
    python load_sample_data.py
)

REM Start Django server
echo.
echo Starting Django server...
start "Django Server" cmd /k python manage.py runserver

cd ..

echo.
echo Setting up Frontend...
cd frontend

REM Install Node dependencies
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
)

REM Create .env.local if not exists
if not exist ".env.local" (
    echo Creating .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
)

REM Start Next.js server
echo.
echo Starting Next.js server...
start "Next.js Server" cmd /k npm run dev

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Application URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   Admin:    http://localhost:8000/admin
echo.
echo Sample Accounts:
echo   Username: student1, Password: password123
echo   Username: staff1, Password: password123
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
