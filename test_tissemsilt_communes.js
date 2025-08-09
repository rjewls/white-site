// Test script for Tissemsilt wilaya (38) communes with Noest API
const axios = require('axios');
require('dotenv').config();

const NOEST_API_KEY = process.env.NOEST_API_KEY;
const BASE_URL = 'https://api.noestexpress.com/v1';

const tissemsiltCommunes = [
  'Tissemsilt',
  'Bordj Bou Naama',
  'Theniet El Had',
  'Lazharia',
  'Beni Chaib',
  'Lardjem',
  'Melaab',
  'Sidi Lantri',
  'Bordj El Emir Abdelkader',
  'Layoune',
  'Khemisti',
  'Ouled Bessem',
  'Ammari',
  'Youssoufia',
  'Sidi Boutouchent',
  'Larbaa',
  'Maasem',
  'Sidi Abed',
  'Tamalaht',
  'Sidi Slimane',
  'Boucaid',
  'Beni Lahcene'
];

async function testTissemsiltCommunes() {
  console.log('\n🧪 Testing Tissemsilt (Wilaya 38) communes with Noest API...\n');
  
  if (!NOEST_API_KEY) {
    console.error('❌ NOEST_API_KEY not found in environment variables');
    return;
  }
  
  const headers = {
    'Authorization': `Bearer ${NOEST_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Test just a few key communes to verify they work
  const testCommunes = ['Tissemsilt', 'Theniet El Had', 'Khemisti'];
  
  for (const commune of testCommunes) {
    console.log(`Testing commune: ${commune}`);
    
    const testOrder = {
      firstname: 'Ahmed',
      familyname: 'Test',
      contact: '0551234567',
      wilaya: 'Tissemsilt',
      commune: commune,
      product_list: 'Test Product x1',
      price: 2500,
      shipping: 500,
      total_price: 3000,
      is_stopdesk: false,
      do_insurance: true,
      is_fragile: false
    };

    try {
      const response = await axios.post(`${BASE_URL}/create`, testOrder, { headers });
      console.log(`✅ ${commune}: SUCCESS - Order ID: ${response.data.tracking}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
      console.log(`❌ ${commune}: FAILED`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}\n`);
      } else {
        console.log(`   Error: ${error.message}\n`);
      }
    }
  }
}

testTissemsiltCommunes();
