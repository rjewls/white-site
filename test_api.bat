@echo off
echo Testing Noest API with curl...
echo.

REM Test data (replace API_TOKEN with actual token)
curl -X POST "https://app.noest-dz.com/api/public/create/order" ^
     -H "Content-Type: application/json" ^
     -H "Accept: application/json" ^
     -d "{\"API_TOKEN\":\"your_api_token_here\",\"reference\":\"TEST-123\",\"client\":\"Test Client\",\"phone\":\"0123456789\",\"phone_2\":\"\",\"adresse\":\"Test Address\",\"wilaya_id\":16,\"commune\":\"Alger Centre\",\"montant\":2500,\"remarque\":\"Test order\",\"produit\":\"Test Product\",\"type_id\":1,\"poids\":500,\"stop_desk\":0,\"station_code\":\"\",\"stock\":1,\"quantite\":\"1\",\"can_open\":1}"

echo.
echo Test completed. Check the response above.
pause
