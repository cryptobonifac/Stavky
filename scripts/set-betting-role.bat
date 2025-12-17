@echo off
REM Script to set betting role for a user via API
REM Usage: set-betting-role.bat <email>
REM Example: set-betting-role.bat admin@example.com

if "%1"=="" (
    echo Error: Email address is required
    echo Usage: set-betting-role.bat ^<email^>
    echo Example: set-betting-role.bat admin@example.com
    exit /b 1
)

set EMAIL=%1
set URL=https://stavky.vercel.app//api/users/set-betting-role

echo Setting betting role for: %EMAIL%
echo.

curl -X POST "%URL%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"%EMAIL%\"}"

echo.
echo Done.



