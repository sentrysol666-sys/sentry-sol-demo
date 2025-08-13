@echo off
:: Sentrysol AML Platform - Development Server Deployment Script
:: Port 8080 Setup for Windows

echo.
echo 🚀 Sentrysol AML Platform - Development Deployment
echo =================================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ NPM is not installed. Please install NPM first.
    pause
    exit /b 1
)

echo ✅ NPM found
npm --version

:: Run the setup script
echo.
echo ℹ️  Running development setup...
call npm run setup

if %errorlevel% neq 0 (
    echo ❌ Setup failed
    pause
    exit /b 1
)

echo ✅ Setup completed successfully

:: Create logs directory
if not exist logs mkdir logs

echo.
echo ℹ️  Starting development server on port 8080...
echo Server will be available at:
echo   Local:    http://localhost:8080
echo   Network:  http://[your-ip]:8080
echo.
echo ℹ️  Press Ctrl+C to stop the server
echo.

:: Start the development server
npm run dev

echo.
echo ℹ️  Development server stopped
pause
