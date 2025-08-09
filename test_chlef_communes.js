import axios from 'axios';

// Test Wilaya 2 (Chlef) communes with Noest API
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

const chlefCommunes = [
  'Chlef',
  'Tenes',
  'Benairia',
  'El Karimia',
  'Tadjna',
  'Taougrite',
  'Beni Haoua',
  'Sobha',
  'Harchoun',
  'Ouled Fares',
  'Sidi Akacha',
  'Boukadir',
  'Beni Rached',
  'Talassa',
  'Herenfa',
  'Dahra',
  'Ouled Abbes',
  'Sendjas',
  'Zeboudja',
  'Oued Sly',
  'Abou El Hassen',
  'El Marsa',
  'Chettia',
  'Sidi Abderrahmane',
  'Labiod Medjadja',
  'Oued Fodda',
  'Ouled Ben Abdelkader',
  'Bouzghaia',
  'Ain Merane',
  'Oum Drou'
];

async function testChlefCommunes() {
  console.log('🧪 Testing Chlef (Wilaya 2) Communes');
  console.log('===================================');
  
  // Test the main city first
  const testCommune = 'Chlef'; // Main city
  
  const orderData = {
    api_token: API_TOKEN,
    user_guid: GUID,
    reference: `CHLEF-TEST-${Date.now()}`,
    client: 'Test Customer Chlef',
    phone: '0555123456',
    phone_2: '',
    adresse: 'Test Address, Chlef',
    wilaya_id: 2, // Chlef
    commune: testCommune,
    montant: 1900,
    produit: 'Test Product Chlef',
    remarque: `Test order for Chlef commune: ${testCommune}`,
    type_id: 1,
    poids: 1,
    stop_desk: 0,
    station_code: '',
    stock: 0,
    quantite: '1',
    can_open: 0
  };
  
  console.log(`📦 Testing commune: "${testCommune}" (Wilaya 2 - Chlef)`);
  
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
      console.log('📍 Wilaya Rank:', response.data.wilaya_rank);
      
      console.log('\n📋 All extracted communes for Chlef (' + chlefCommunes.length + ' total):');
      chlefCommunes.forEach((commune, index) => {
        console.log(`  ${String(index + 1).padStart(2, '0')}. ${commune}`);
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
        console.log('💡 Validation error - checking specific issue...');
        console.log('Full Response:', JSON.stringify(error.response?.data, null, 2));
        
        if (error.response?.data?.errors?.commune) {
          console.log('🔍 Commune validation failed - might need different spelling');
        }
      }
    } else {
      console.log('Error:', error.message);
    }
  }
}

testChlefCommunes();
