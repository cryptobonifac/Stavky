# Script to start Supabase with Google OAuth credentials loaded from .env.local
# Usage: .\scripts\start-supabase-with-oauth.ps1

Write-Host "Loading Google OAuth credentials from .env.local..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create .env.local with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET" -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env.local
$envContent = Get-Content ".env.local"
foreach ($line in $envContent) {
    # Skip comments and empty lines
    if ($line -match '^\s*#' -or $line -match '^\s*$') {
        continue
    }
    
    # Parse KEY=VALUE format
    if ($line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Remove quotes if present
        if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") {
            $value = $matches[1]
        }
        
        # Set environment variable
        if ($key -eq "GOOGLE_CLIENT_ID" -or $key -eq "GOOGLE_CLIENT_SECRET") {
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  [OK] Loaded $key" -ForegroundColor Green
        }
    }
}

# Verify variables are set
if (-not $env:GOOGLE_CLIENT_ID) {
    Write-Host "ERROR: GOOGLE_CLIENT_ID not found in .env.local!" -ForegroundColor Red
    exit 1
}

if (-not $env:GOOGLE_CLIENT_SECRET) {
    Write-Host "ERROR: GOOGLE_CLIENT_SECRET not found in .env.local!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Google OAuth credentials loaded successfully!" -ForegroundColor Green
Write-Host ""

# Check if Supabase is already running
$statusOutput = supabase status 2>&1 | Out-String
if ($statusOutput -match "is running") {
    Write-Host "Supabase is already running. Restarting with new credentials..." -ForegroundColor Yellow
    Write-Host ""
    supabase stop
    Start-Sleep -Seconds 2
}

# Start Supabase
Write-Host "Starting Supabase..." -ForegroundColor Cyan
supabase start

# Check for warnings
$statusOutput = supabase status 2>&1 | Out-String
if ($statusOutput -match "WARN.*GOOGLE_CLIENT") {
    Write-Host ""
    Write-Host "WARNING: Google OAuth environment variables may not be set correctly!" -ForegroundColor Yellow
    Write-Host "Check the Supabase status output above." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✅ Supabase started successfully with Google OAuth!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify in Google Cloud Console that redirect URI is set to:" -ForegroundColor Gray
Write-Host "     http://localhost:54321/auth/v1/callback" -ForegroundColor White
Write-Host "  2. Test Google OAuth sign-in in your app" -ForegroundColor Gray
