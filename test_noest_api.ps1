# PowerShell script to test Noest API
# Replace these with your actual credentials
$API_TOKEN = "YOUR_API_TOKEN_HERE"
$GUID = "YOUR_GUID_HERE"

# Test order data
$orderData = @{
    api_token = $API_TOKEN
    user_guid = $GUID
    reference = "TEST-PS-$(Get-Date -Format 'yyyyMMddHHmmss')"
    client = "Test Customer PowerShell"
    phone = "0555123456"
    phone_2 = ""
    adresse = "123 Test Street, Test City"
    wilaya_id = 16
    commune = "Test Commune"
    montant = 2500
    produit = "Test Product PowerShell"
    remarque = "Test order from PowerShell script"
    type_id = 1
    poids = 1
    stop_desk = 0
    station_code = ""
    stock = 0
    quantite = "1"
    can_open = 0
}

Write-Host "🧪 NOEST EXPRESS API TEST (PowerShell)" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check credentials
if ($API_TOKEN -eq "YOUR_API_TOKEN_HERE" -or $GUID -eq "YOUR_GUID_HERE") {
    Write-Host "❌ ERROR: Please replace API_TOKEN and GUID with your actual credentials" -ForegroundColor Red
    Write-Host "   1. Go to https://app.noest-dz.com" -ForegroundColor Yellow
    Write-Host "   2. Get your API Token and GUID" -ForegroundColor Yellow
    Write-Host "   3. Replace the values at the top of this script" -ForegroundColor Yellow
    exit
}

Write-Host "📋 Order Data:" -ForegroundColor Green
Write-Host "Reference: $($orderData.reference)"
Write-Host "Customer: $($orderData.client)"
Write-Host "Phone: $($orderData.phone)"
Write-Host "Amount: $($orderData.montant) DZD"
Write-Host "Product: $($orderData.produit)"

try {
    Write-Host "`n🚀 Making API Request..." -ForegroundColor Yellow
    
    $jsonBody = $orderData | ConvertTo-Json -Depth 10
    
    $headers = @{
        'Content-Type' = 'application/json'
        'Accept' = 'application/json'
        'User-Agent' = 'PowerShell-NoestTest/1.0'
    }
    
    $response = Invoke-RestMethod -Uri "https://app.noest-dz.com/api/public/create/order" `
                                  -Method Post `
                                  -Body $jsonBody `
                                  -Headers $headers `
                                  -TimeoutSec 15
    
    Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    if ($response.success) {
        Write-Host "`n🎉 Order Created Successfully!" -ForegroundColor Green
        if ($response.tracking) {
            Write-Host "📦 Tracking Number: $($response.tracking)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "`n❌ Order Creation Failed:" -ForegroundColor Red
        Write-Host "Error: $($response.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "`n❌ ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "HTTP Status Code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 401) {
            Write-Host "💡 Authentication failed. Check your API_TOKEN and GUID." -ForegroundColor Yellow
        } elseif ($statusCode -eq 422) {
            Write-Host "💡 Validation error. Check the required fields." -ForegroundColor Yellow
        } elseif ($statusCode -eq 403) {
            Write-Host "💡 Access forbidden. Check your account permissions." -ForegroundColor Yellow
        }
    }
}

Write-Host "`n✨ Test completed!" -ForegroundColor Cyan
