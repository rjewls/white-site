@echo off
echo Testing Noest API with properly formatted data...
echo.

REM Test data with correct format from proven working method
curl -X POST "https://app.noest-dz.com/api/public/create/order" ^
     -H "Content-Type: application/json" ^
     -H "Accept: application/json" ^
     -d ^"^{^\"api_token^\"^:^\"your_api_token_here^\"^,^\"user_guid^\"^:^\"your_user_guid_here^\"^,^\"reference^\"^:^\"TEST-123^\"^,^\"client^\"^:^\"Ahmed Benali^\"^,^\"phone^\"^:^\"0551234567^\"^,^\"phone_2^\"^:^\"^\"^,^\"adresse^\"^:^\"Rue Didouche Mourad, Alger Centre^\"^,^\"wilaya_id^\"^:16^,^\"commune^\"^:^\"Alger Centre^\"^,^\"montant^\"^:2500.00^,^\"remarque^\"^:^\"Test order^\"^,^\"produit^\"^:^\"Test Product^\"^,^\"type_id^\"^:1^,^\"poids^\"^:1^,^\"stop_desk^\"^:0^,^\"station_code^\"^:^\"^\"^,^\"stock^\"^:1^,^\"quantite^\"^:^\"1^\"^,^\"can_open^\"^:1^}^"

echo.
echo Test completed. Check the response above.
echo If you see a 401 error, your account might be suspended.
echo If you see a 422 error, check the field validation requirements.
pause
