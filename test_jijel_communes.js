// Test Jijel (Wilaya 18) communes with Noest API
import axios from 'axios';

// Using working credentials
const API_TOKEN = 'T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI';
const GUID = 'QWJYXWLP';

const jijelCommunes = [
  'Jijel',
  'El Aouana',
  'Ziamma Mansouriah',
  'Taher',
  'Emir Abdelkader',
  'Chekfa',
  'El Milia',
  'Sidi Maarouf',
  'Settara',
  'El Ancer',
  'Sidi Abdelaziz',
  'Kaous',
  'Djmila',
  'El Kennar Nouchfi',
  'Kemir Oued Adjoul',
  'Texena',
  'Djemaa Beni Habibi'
];

async function testJijelCommunes() {
  console.log('🏖️ Testing Jijel (Wilaya 18) communes with Noest API');
  console.log('===================================================');
  console.log(`Total communes to test: ${jijelCommunes.length}\n`);
  
  let successCount = 0;
  let failureCount = 0;
  const results = [];
  
  for (let i = 0; i < jijelCommunes.length; i++) {
    const commune = jijelCommunes[i];
    console.log(`[${i + 1}/${jijelCommunes.length}] Testing: ${commune}`);
    
    const orderData = {
      api_token: API_TOKEN,
      user_guid: GUID,
      reference: `JIJEL-TEST-${Date.now()}-${i}`,
      client: `Test Customer ${commune}`,
      phone: '0555123456',
      phone_2: '',
      adresse: `123 Coastal Road, ${commune}`,
      wilaya_id: 18,
      commune: commune,
      montant: 2200,
      produit: `Test Product for ${commune}`,
      remarque: `Test order for ${commune}, Jijel`,
      type_id: 1,
      poids: 1,
      stop_desk: 0,
      station_code: '',
      stock: 0,
      quantite: '1',
      can_open: 0
    };
    
    try {
      const response = await axios.post(
        'https://app.noest-dz.com/api/public/create/order',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );
      
      if (response.data.success) {
        console.log(`   ✅ SUCCESS - Order ID: ${response.data.order_id}`);
        successCount++;
        results.push({ commune, status: 'SUCCESS', orderId: response.data.order_id });
      } else {
        console.log(`   ❌ FAILED - ${response.data.message || 'Unknown error'}`);
        failureCount++;
        results.push({ commune, status: 'FAILED', message: response.data.message });
      }
      
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        console.log(`   ❌ API ERROR - ${errorMessage}`);
      } else {
        errorMessage = error.message;
        console.log(`   ❌ NETWORK ERROR - ${errorMessage}`);
      }
      failureCount++;
      results.push({ commune, status: 'ERROR', message: errorMessage });
    }
    
    // Small delay between requests to avoid overwhelming the API
    if (i < jijelCommunes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULTS FOR JIJEL (WILAYA 18)');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${jijelCommunes.length} communes`);
  console.log(`❌ Failed: ${failureCount}/${jijelCommunes.length} communes`);
  console.log(`📈 Success Rate: ${((successCount / jijelCommunes.length) * 100).toFixed(1)}%`);
  
  if (failureCount > 0) {
    console.log('\n❌ Failed communes:');
    results
      .filter(r => r.status !== 'SUCCESS')
      .forEach(r => {
        console.log(`   - ${r.commune}: ${r.message}`);
      });
  }
  
  console.log('\n✅ All valid communes for Jijel (Wilaya 18):');
  results
    .filter(r => r.status === 'SUCCESS')
    .forEach(r => {
      console.log(`   - ${r.commune}`);
    });
}

// Run the test
testJijelCommunes().catch(console.error);
