// Test script for Khenchela wilaya (40) communes with Noest API
const axios = require('axios');
require('dotenv').config();

const NOEST_API_KEY = process.env.NOEST_API_KEY;
const BASE_URL = 'https://api.noestexpress.com/v1';

const khenchelaCommunes = [
  'Khenchela',
  'Mtoussa',
  'Kais',
  'Baghai',
  'El Hamma',
  'Ain Touila',
  'Taouzianat',
  'Bouhmama',
  'Remila',
  'Cherchar',
  'Babar',
  'Ensigha',
  'Ouled Rechache',
  'El Mahmal',
  'Yabous',
  'Chelia'
];

async function testKhenchelaCommunes() {
  console.log('\n🧪 Testing Khenchela (Wilaya 40) communes with Noest API...\n');
  
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
  const testCommunes = ['Khenchela', 'Baghai', 'El Hamma'];
  
  for (const commune of testCommunes) {
    console.log(`Testing commune: ${commune}`);
    
    const testOrder = {
      firstname: 'Ahmed',
      familyname: 'Test',
      contact: '0551234567',
      wilaya: 'Khenchela',
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

testKhenchelaCommunes();
