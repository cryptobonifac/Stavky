# PowerShell script to set betting role for a user via API
# Usage: .\set-betting-role.ps1 <email>
# Example: .\set-betting-role.ps1 admin@example.com

param(
    [Parameter(Mandatory=$true)]
    [string]$Email
)

$url = "http://localhost:3000/api/users/set-betting-role"
$body = @{
    email = $Email
} | ConvertTo-Json

Write-Host "Setting betting role for: $Email" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ Betting role set successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "User Details:" -ForegroundColor Yellow
        Write-Host "  Email: $($response.user.email)"
        Write-Host "  ID: $($response.user.id)"
        Write-Host "  Role: $($response.user.role)" -ForegroundColor Green
        Write-Host "  Active until: $($response.user.account_active_until)"
    } else {
        Write-Host "❌ Failed to set betting role" -ForegroundColor Red
        Write-Host $response | ConvertTo-Json -Depth 5
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }
}

Write-Host ""
Write-Host "Done."



