# PowerShell script to activate a user account via API
# Usage: .\activate-user.ps1 <email>
# Example: .\activate-user.ps1 customer5@gmail.com

param(
    [Parameter(Mandatory=$true)]
    [string]$Email
)

$url = "http://localhost:3000/api/users/activate"
$body = @{
    email = $Email
} | ConvertTo-Json

Write-Host "Activating account for: $Email" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ Account activated successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "User Details:" -ForegroundColor Yellow
        Write-Host "  Email: $($response.user.email)"
        Write-Host "  ID: $($response.user.id)"
        Write-Host "  Role: $($response.user.role)"
        Write-Host "  Active until: $($response.user.account_active_until)"
    } else {
        Write-Host "❌ Failed to activate account" -ForegroundColor Red
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



