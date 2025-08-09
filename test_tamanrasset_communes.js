const axios = require('axios');

// Test communes for Wilaya 11 (Tamanrasset)
async function testTamanrassetCommunes() {
  const communes = [
    'Tamanghasset'
  ];

  console.log('Testing communes for Wilaya 11 (Tamanrasset)...\n');
  
  for (const commune of communes) {
    try {
      const response = await axios.post(
        'https://dev.api.noest.io/orders',
        {
          external_ref: `test_${Date.now()}`,
          to_commune: commune,
          to_wilaya: 'Tamanrasset',
          customer_name: 'Test Customer',
          customer_phone: '0123456789',
          items: [
            {
              name: 'Test Item',
              price: 1000,
              quantity: 1
            }
          ],
          total_amount: 1000,
          weight: 1000
        },
        {
          headers: {
            'Authorization': 'Bearer 7b5e2f6f38dd4e20a9c3b8e1c4d9f0a2b6c8e4f7a1b5d3c9e7f2a8b4c6d0e9f1',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log(`✅ ${commune}: SUCCESS (Order ID: ${response.data.id})`);
      
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const communeError = errors?.to_commune?.[0] || '';
        const wilayaError = errors?.to_wilaya?.[0] || '';
        
        if (communeError.includes('invalid') || wilayaError.includes('invalid')) {
          console.log(`❌ ${commune}: INVALID COMMUNE/WILAYA`);
        } else {
          console.log(`⚠️  ${commune}: VALIDATION ERROR - ${JSON.stringify(errors)}`);
        }
      } else {
        console.log(`❌ ${commune}: ERROR - ${error.message}`);
      }
    }
  }
}

testTamanrassetCommunes().catch(console.error);
