const axios = require('axios');

// Test Mostaganem communes with Noest API
const testCommunes = [
  'Mostaganem',
  'Sayada',
  'Fornaka',
  'Stidia',
  'Ain Nouissy',
  'Hassi Maameche',
  'Ain Tadles',
  'Sour',
  'Oued El Kheir',
  'Sidi Bellater',
  'Kheiredine',
  'Sidi Ali',
  'Abdelmalek Ramdane',
  'Hadjadj',
  'Nekmaria',
  'Sidi Lakhdar',
  'Achaacha',
  'Khadra',
  'Bouguirat',
  'Sirat',
  'Ain Sidi Cherif',
  'Mesra',
  'Mansourah',
  'Souaflia',
  'Ouled Boughalem',
  'Ouled Maallah',
  'Mezghrane',
  'Ain Boudinar',
  'Tazgait',
  'Safsaf',
  'Touahria',
  'El Hassiane'
];

const API_BASE_URL = 'https://api.noest-express.com';

// Configuration that works for testing
const config = {
  apiKey: 'f7ba0ae9-2a54-4c0f-8f6c-bb21cf6a8b48',
  apiSecret: 'UjsJCJ0jJ2xJdL5ivW6YNuYlTL+Nwq2PgTjDcyGHE0kWCv3kPePUU5kJPWKBPOk1xL3wBpDbMVKSCHhJABDDzg==',
  vendorId: 'NXT-VND-VQ1-FNI-50WZ57',
};

const authHeader = 'Basic ' + Buffer.from(config.apiKey + ':' + config.apiSecret).toString('base64');

async function testCommune(commune) {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/orders`, {
      recipient: {
        name: "Test User",
        phone: "0555123456"
      },
      address: {
        address: "Test Address 123",
        wilaya: "Mostaganem",
        commune: commune
      },
      items: [{
        name: "Test Product",
        quantity: 1,
        price: 1500
      }],
      cod_amount: 1500,
      vendor_id: config.vendorId,
      weight: 500,
      note: "Test order for commune validation"
    }, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ ${commune}: SUCCESS (Order ID: ${response.data.id})`);
    return true;
  } catch (error) {
    console.log(`❌ ${commune}: FAILED - ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testAllCommunes() {
  console.log('🧪 Testing all Mostaganem communes with Noest API...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < testCommunes.length; i++) {
    const commune = testCommunes[i];
    console.log(`Testing ${i + 1}/${testCommunes.length}: ${commune}`);
    
    const success = await testCommune(commune);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 Final Results:`);
  console.log(`✅ Successful: ${successCount}/${testCommunes.length}`);
  console.log(`❌ Failed: ${failCount}/${testCommunes.length}`);
  
  if (failCount === 0) {
    console.log(`\n🎉 All Mostaganem communes are valid with Noest API!`);
  } else {
    console.log(`\n⚠️ Some communes failed validation. Check spelling or contact Noest support.`);
  }
}

testAllCommunes().catch(console.error);
