import axios from 'axios';

// Test Wilaya 1 (Adrar) communes with Noest API
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

const adrarCommunes = [
  'Adrar',
  'Tamest', 
  'Reggane',
  'Inozghmir',
  'Tsabit',
  'Zaouiet Kounta',
  'Aoulef',
  'Timokten',
  'Tamentit',
  'Fenoughil',
  'Sali',
  'Akabli',
  'O Ahmed Timmi',
  'Sbaa'
];

async function testAdrarCommunes() {
  console.log('🧪 Testing Adrar (Wilaya 1) Communes');
  console.log('====================================');
  
  // Test the main city first
  const testCommune = 'Adrar'; // Main city
  
  const orderData = {
    api_token: API_TOKEN,
    user_guid: GUID,
    reference: `ADRAR-TEST-${Date.now()}`,
    client: 'Test Customer Adrar',
    phone: '0555123456',
    phone_2: '',
    adresse: 'Test Address, Adrar',
    wilaya_id: 1, // Adrar
    commune: testCommune,
    montant: 1800,
    produit: 'Test Product Adrar',
    remarque: `Test order for Adrar commune: ${testCommune}`,
    type_id: 1,
    poids: 1,
    stop_desk: 0,
    station_code: '',
    stock: 0,
    quantite: '1',
    can_open: 0
  };
  
  console.log(`📦 Testing commune: "${testCommune}" (Wilaya 1 - Adrar)`);
  
  try {
    const response = await axios.post(
      'https://app.noest-dz.com/api/public/create/order',
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ SUCCESS! Commune "' + testCommune + '" is valid');
      console.log('📦 Tracking Number:', response.data.tracking);
      console.log('🏢 Regional Hub:', response.data.regional_hub_name);
      
      console.log('\n📋 All extracted communes for Adrar:');
      adrarCommunes.forEach((commune, index) => {
        console.log(`  ${index + 1}. ${commune}`);
      });
      
    } else {
      console.log('❌ Failed for commune "' + testCommune + '"');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ ERROR testing commune "' + testCommune + '":');
    
    if (axios.isAxiosError(error)) {
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
      
      if (error.response?.status === 422) {
        console.log('💡 Validation error - commune might be invalid');
        console.log('Full Response:', JSON.stringify(error.response?.data, null, 2));
      }
    } else {
      console.log('Error:', error.message);
    }
  }
}

testAdrarCommunes();
