# PowerShell script to load env vars from .env.local and start Supabase
# Usage: .\scripts\start-supabase-with-oauth.ps1

Write-Host "=== Loading Environment Variables and Starting Supabase ===" -ForegroundColor Cyan
Write-Host ""

# Function to parse .env.local file
function Load-EnvFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "Error: .env.local file not found at: $FilePath" -ForegroundColor Red
        Write-Host "Please create .env.local file in the project root." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "Loading environment variables from: $FilePath" -ForegroundColor Gray
    $envVars = @{}
    
    Get-Content $FilePath | ForEach-Object {
        $line = $_.Trim()
        # Skip empty lines and comments
        if ($line -and -not $line.StartsWith('#')) {
            # Split on first '=' sign
            $parts = $line -split '=', 2
            if ($parts.Length -eq 2) {
                $key = $parts[0].Trim()
                $value = $parts[1].Trim()
                # Remove quotes if present
                if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                    $value = $value.Substring(1, $value.Length - 2)
                }
                if ($value.StartsWith("'") -and $value.EndsWith("'")) {
                    $value = $value.Substring(1, $value.Length - 2)
                }
                $envVars[$key] = $value
            }
        }
    }
    
    return $envVars
}

# Load .env.local file from project root
$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot ".env.local"

$envVars = Load-EnvFile -FilePath $envFile

# Required variables for Supabase OAuth
$requiredVars = @(
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
)

# Check for required variables
$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not $envVars.ContainsKey($var) -or [string]::IsNullOrWhiteSpace($envVars[$var])) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "Error: Missing required environment variables in .env.local:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "  - $var" -ForegroundColor Red
    }
    exit 1
}

# Check if Supabase is already running
$supabaseStatus = supabase status 2>&1
if ($supabaseStatus -match "is running") {
    Write-Host "Stopping existing Supabase instance..." -ForegroundColor Yellow
    supabase stop
    Start-Sleep -Seconds 2
}

# Set environment variables for Supabase
# Google OAuth (required)
$env:GOOGLE_CLIENT_ID = $envVars['GOOGLE_CLIENT_ID']
$env:GOOGLE_CLIENT_SECRET = $envVars['GOOGLE_CLIENT_SECRET']
# Override redirect URL to use Supabase's local endpoint
$env:GOOGLE_REDIRECT_URL = "http://localhost:54321/auth/v1/callback"

# Required by config.toml - set defaults if not in .env.local
$env:APP_SITE_URL = if ($envVars.ContainsKey('APP_SITE_URL') -and -not [string]::IsNullOrWhiteSpace($envVars['APP_SITE_URL'])) {
    $envVars['APP_SITE_URL']
} else {
    "http://localhost:3000"
}

$env:AUTH_REDIRECT_URL_LOGIN = if ($envVars.ContainsKey('AUTH_REDIRECT_URL_LOGIN') -and -not [string]::IsNullOrWhiteSpace($envVars['AUTH_REDIRECT_URL_LOGIN'])) {
    $envVars['AUTH_REDIRECT_URL_LOGIN']
} else {
    "http://localhost:3000/login"
}

$env:AUTH_REDIRECT_URL_SIGNUP = if ($envVars.ContainsKey('AUTH_REDIRECT_URL_SIGNUP') -and -not [string]::IsNullOrWhiteSpace($envVars['AUTH_REDIRECT_URL_SIGNUP'])) {
    $envVars['AUTH_REDIRECT_URL_SIGNUP']
} else {
    "http://localhost:3000/signup"
}

$env:AUTH_REDIRECT_URL_CALLBACK = if ($envVars.ContainsKey('AUTH_REDIRECT_URL_CALLBACK') -and -not [string]::IsNullOrWhiteSpace($envVars['AUTH_REDIRECT_URL_CALLBACK'])) {
    $envVars['AUTH_REDIRECT_URL_CALLBACK']
} else {
    "http://localhost:3000/auth/callback"
}

# Optional: Facebook OAuth
if ($envVars.ContainsKey('FACEBOOK_CLIENT_ID') -and -not [string]::IsNullOrWhiteSpace($envVars['FACEBOOK_CLIENT_ID'])) {
    $env:FACEBOOK_CLIENT_ID = $envVars['FACEBOOK_CLIENT_ID']
}
if ($envVars.ContainsKey('FACEBOOK_CLIENT_SECRET') -and -not [string]::IsNullOrWhiteSpace($envVars['FACEBOOK_CLIENT_SECRET'])) {
    $env:FACEBOOK_CLIENT_SECRET = $envVars['FACEBOOK_CLIENT_SECRET']
}
if ($envVars.ContainsKey('FACEBOOK_CLIENT_ID')) {
    $env:FACEBOOK_REDIRECT_URL = "http://localhost:54321/auth/v1/callback"
}

Write-Host ""
Write-Host "Environment variables loaded:" -ForegroundColor Green
Write-Host "  GOOGLE_CLIENT_ID: $($env:GOOGLE_CLIENT_ID)" -ForegroundColor Gray
Write-Host "  GOOGLE_CLIENT_SECRET: [HIDDEN]" -ForegroundColor Gray
Write-Host "  GOOGLE_REDIRECT_URL: $($env:GOOGLE_REDIRECT_URL)" -ForegroundColor Gray
Write-Host "  APP_SITE_URL: $($env:APP_SITE_URL)" -ForegroundColor Gray
Write-Host "  AUTH_REDIRECT_URL_LOGIN: $($env:AUTH_REDIRECT_URL_LOGIN)" -ForegroundColor Gray
Write-Host "  AUTH_REDIRECT_URL_SIGNUP: $($env:AUTH_REDIRECT_URL_SIGNUP)" -ForegroundColor Gray
Write-Host "  AUTH_REDIRECT_URL_CALLBACK: $($env:AUTH_REDIRECT_URL_CALLBACK)" -ForegroundColor Gray
Write-Host ""

# Verify Google Console configuration
Write-Host "IMPORTANT: Make sure Google Console has this redirect URI:" -ForegroundColor Yellow
Write-Host "  http://localhost:54321/auth/v1/callback" -ForegroundColor White
Write-Host ""
Write-Host "This is Supabase's local auth endpoint, NOT your app's callback URL." -ForegroundColor Cyan
Write-Host ""

# Start Supabase with environment variables
Write-Host ""
Write-Host "Starting Supabase..." -ForegroundColor Cyan
supabase start

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host "Supabase is running with Google OAuth configured." -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure your .env.local has:" -ForegroundColor White
Write-Host "   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase status output>" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start your Next.js app: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Note: Keep this terminal open. If you close it, the environment" -ForegroundColor Cyan
Write-Host "      variables will be lost and you'll need to run this script again." -ForegroundColor Cyan

