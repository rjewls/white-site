// Test script to verify Mascara (wilaya 29) communes with Noest API
const axios = require('axios');

const API_BASE_URL = 'https://app.noest-dz.com';
const API_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcC5ub2VzdC1kei5jb20vYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MzY5NDE0NzUsImV4cCI6MTc3MDk0MTQ3NSwibmJmIjoxNzM2OTQxNDc1LCJqdGkiOiI0dGEySDJaZnBOV2Z4Q2RmIiwic3ViIjoiMjQyNCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.QJ6HPqBHNDOJyIwk9Qxh6IhAjHW0hGAJ5z5l9oGEANg';

// Mascara communes extracted from HTML
const mascaraCommunes = [
    'Mascara',
    'Bou Hanifia',
    'Tizi',
    'Hacine',
    'Maoussa',
    'Teghennif',
    'El Hachem',
    'Sidi Kada',
    'Zelmata',
    'Oued El Abtal',
    'Ain Ferah',
    'Ghriss',
    'Froha',
    'Matemore',
    'Makdha',
    'Sidi Boussaid',
    'El Bordj',
    'Ain Fekan',
    'Benian',
    'Khalouia',
    'El Menaouer',
    'Oued Taria',
    'Aouf',
    'Ain Fares',
    'Ain Frass',
    'Sig',
    'Oggaz',
    'Alaimia',
    'Zahana',
    'Mohammadia',
    'Sidi Abdelmoumene',
    'Ferraguig',
    'El Ghomri',
    'Sedjerara',
    'Moctadouz',
    'Bou Henni',
    'Guettena',
    'El Mamounia',
    'El Keurt',
    'Gharrous',
    'Gherdjoum',
    'Chorfa',
    'Ras Ain Amirouche',
    'Nesmot',
    'Sidi Abdeldjebar',
    'Sehailia'
];

async function testCommune(commune) {
  const orderData = {
    wilaya_id: 29,
    commune,
    adresse: 'Test address',
    recipient_name: 'Test Name',
    recipient_phone: '0555123456',
    product: 'Test Product',
    price: 2500,
    quantity: 1,
    note: `Testing Mascara commune: ${commune}`,
    poids: 500
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/api/store_orders`, orderData, {
      headers: {
        'Authorization': API_TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    if (response.status === 201 || response.status === 200) {
      console.log(`✅ ${commune}: SUCCESS`);
      return { commune, success: true, orderId: response.data.order_id };
    } else {
      console.log(`❌ ${commune}: Unexpected status ${response.status}`);
      return { commune, success: false, error: `Status: ${response.status}` };
    }
  } catch (error) {
    if (error.response?.data?.errors?.commune) {
      console.log(`❌ ${commune}: INVALID - ${error.response.data.errors.commune[0]}`);
    } else {
      console.log(`❌ ${commune}: ERROR - ${error.response?.data?.message || error.message}`);
    }
    return { commune, success: false, error: error.response?.data || error.message };
  }
}

async function testAllCommunes() {
  console.log(`Testing ${mascaraCommunes.length} communes for Mascara (wilaya 29)...`);
  console.log('='.repeat(60));

  const results = [];
  let successCount = 0;

  for (const commune of mascaraCommunes) {
    const result = await testCommune(commune);
    results.push(result);
    if (result.success) successCount++;
    
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('='.repeat(60));
  console.log(`SUMMARY: ${successCount}/${mascaraCommunes.length} communes validated`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\nFAILED COMMUNES:');
    failed.forEach(f => console.log(`- ${f.commune}: ${f.error}`));
  } else {
    console.log('\n🎉 All Mascara communes are valid!');
  }

  return results;
}

// Run the test
testAllCommunes().catch(console.error);
