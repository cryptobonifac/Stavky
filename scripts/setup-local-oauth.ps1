# PowerShell script to set up Google OAuth environment variables for local Supabase
# Run this before starting Supabase: supabase start

Write-Host "Setting up Google OAuth for local Supabase..." -ForegroundColor Cyan

# Prompt for Google OAuth credentials
$clientId = Read-Host "Enter your Google OAuth Client ID"
$clientSecret = Read-Host "Enter your Google OAuth Client Secret" -AsSecureString
$clientSecretPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($clientSecret)
)

# Set environment variables
$env:GOOGLE_CLIENT_ID = $clientId
$env:GOOGLE_CLIENT_SECRET = $clientSecretPlain
$env:GOOGLE_REDIRECT_URL = "http://localhost:54321/auth/v1/callback"

Write-Host "`nEnvironment variables set:" -ForegroundColor Green
Write-Host "  GOOGLE_CLIENT_ID: $clientId" -ForegroundColor Gray
Write-Host "  GOOGLE_CLIENT_SECRET: [HIDDEN]" -ForegroundColor Gray
Write-Host "  GOOGLE_REDIRECT_URL: http://localhost:54321/auth/v1/callback" -ForegroundColor Gray

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Make sure Google Console has this redirect URI: http://localhost:54321/auth/v1/callback" -ForegroundColor White
Write-Host "2. Start Supabase: supabase start" -ForegroundColor White
Write-Host "3. Start your app: npm run dev" -ForegroundColor White

Write-Host "`nNote: These environment variables are only set for this PowerShell session." -ForegroundColor Cyan
Write-Host "If you open a new terminal, run this script again or set them manually." -ForegroundColor Cyan

