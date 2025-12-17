# Script to update .env.local with local Supabase credentials
# Run this after starting local Supabase: supabase start

Write-Host "Updating .env.local with local Supabase credentials..." -ForegroundColor Cyan

# Get local Supabase status
$statusOutput = supabase status --output json 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Supabase is not running. Please run 'supabase start' first." -ForegroundColor Red
    exit 1
}

# Extract JSON from output (find the JSON object)
$jsonStart = $statusOutput.IndexOf('{')
$jsonEnd = $statusOutput.LastIndexOf('}') + 1
if ($jsonStart -eq -1 -or $jsonEnd -eq 0) {
    Write-Host "ERROR: Could not find JSON in Supabase status output." -ForegroundColor Red
    exit 1
}

$jsonContent = $statusOutput.Substring($jsonStart, $jsonEnd - $jsonStart)

# Parse JSON output
try {
    $status = $jsonContent | ConvertFrom-Json
} catch {
    Write-Host "ERROR: Failed to parse Supabase status JSON." -ForegroundColor Red
    Write-Host "JSON content: $jsonContent" -ForegroundColor Gray
    exit 1
}

# Update .env.local
$envFile = ".env.local"
$envContent = @"
# Local Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="$($status.API_URL)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="$($status.ANON_KEY)"
SUPABASE_SERVICE_ROLE_KEY="$($status.SERVICE_ROLE_KEY)"

# Note: This file is gitignored. Do not commit these values.
"@

# Write to .env.local
Set-Content -Path $envFile -Value $envContent -Force

Write-Host "SUCCESS: Updated .env.local with local Supabase credentials:" -ForegroundColor Green
Write-Host "   NEXT_PUBLIC_SUPABASE_URL=$($status.API_URL)" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY=$($status.ANON_KEY.Substring(0, 50))..." -ForegroundColor Gray
Write-Host "   SUPABASE_SERVICE_ROLE_KEY=$($status.SERVICE_ROLE_KEY.Substring(0, 50))..." -ForegroundColor Gray
Write-Host ""
Write-Host "IMPORTANT: Restart your Next.js dev server for changes to take effect!" -ForegroundColor Yellow
