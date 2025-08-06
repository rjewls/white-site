// Test Noest API endpoint directly
const testData = {
  API_TOKEN: "your_api_token_here", // Replace with actual token
  reference: "TEST-ORDER-123",
  client: "Test Client",
  phone: "0123456789",
  phone_2: "",
  adresse: "Test Address 123",
  wilaya_id: 16,
  commune: "Alger Centre",
  montant: 2500,
  remarque: "Test order",
  produit: "Test Product",
  type_id: 1,
  poids: 500,
  stop_desk: 0,
  station_code: "",
  stock: 1,
  quantite: "1",
  can_open: 1
};

console.log('Test data:', testData);

fetch('https://app.noest-dz.com/api/public/create/order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Error:', error);
});
