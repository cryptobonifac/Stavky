# Script to set SUPABASE_DB_PASSWORD for current PowerShell session
# Usage: .\tmp\set-db-password.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$Password
)

Write-Host "Setting SUPABASE_DB_PASSWORD..." -ForegroundColor Cyan

if ($Password) {
    $env:SUPABASE_DB_PASSWORD = $Password
    Write-Host "SUCCESS: SUPABASE_DB_PASSWORD has been set for this session." -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run Supabase CLI commands like:" -ForegroundColor Yellow
    Write-Host "  supabase db push" -ForegroundColor White
    Write-Host "  supabase migration up --include-all" -ForegroundColor White
} else {
    Write-Host "ERROR: No password provided." -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\tmp\set-db-password.ps1 -Password 'your-password-here'" -ForegroundColor White
    Write-Host ""
    Write-Host "To get your database password:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://app.supabase.com" -ForegroundColor White
    Write-Host "  2. Select your project (stavky)" -ForegroundColor White
    Write-Host "  3. Go to Settings → Database" -ForegroundColor White
    Write-Host "  4. Find 'Database password' section" -ForegroundColor White
    Write-Host "  5. Copy the password or reset it if needed" -ForegroundColor White
}






