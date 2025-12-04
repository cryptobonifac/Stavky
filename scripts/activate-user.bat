@echo off
REM Script to activate a user account via API
REM Usage: activate-user.bat <email>
REM Example: activate-user.bat customer5@gmail.com

if "%1"=="" (
    echo Error: Email address is required
    echo Usage: activate-user.bat ^<email^>
    echo Example: activate-user.bat customer5@gmail.com
    exit /b 1
)

set EMAIL=%1
set URL=http://localhost:3000/api/users/activate

echo Activating account for: %EMAIL%
echo.

curl -X POST "%URL%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"%EMAIL%\"}"

echo.
echo Done.
