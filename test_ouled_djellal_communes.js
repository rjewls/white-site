// Test script for Ouled Djellal communes with Noest API
const axios = require('axios');

const NOEST_API_URL = 'https://api.noestexpress.com';
const TOKEN = 'your-actual-token-here'; // Replace with your actual Noest API token

// Test data for Ouled Djellal order
const testOrder = {
  name: "Test Customer Ouled Djellal",
  phone: "0551234567",
  wilaya: "Ouled Djellal",
  commune: "Ouled Djellal", // Using the main commune
  address: "Test Address Ouled Djellal",
  product: "Test Product",
  price: 2500,
  quantity: 1,
  weight: 500,
  fragile: false,
  exchange: false,
  stopdesk: false
};

// List of Ouled Djellal communes to test
const communesToTest = [
  'Ouled Djellal',
  'Chaiba',
  'Doucen',
  'Besbes',
  'Ras El Miad',
  'Sidi Khaled'
];

async function testOuledDjellalCommunes() {
  console.log('🧪 Testing Ouled Djellal communes with Noest API...');
  console.log('===================================================');
  
  for (const commune of communesToTest) {
    try {
      const orderData = {
        ...testOrder,
        commune: commune
      };
      
      console.log(`\n📍 Testing: ${commune}`);
      
      const response = await axios.post(`${NOEST_API_URL}/create-order`, orderData, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        console.log(`✅ ${commune}: Valid (Order ID: ${response.data.order_id})`);
      } else {
        console.log(`❌ ${commune}: Failed -`, response.data?.message || 'Unknown error');
      }
      
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || error.response.statusText;
        console.log(`❌ ${commune}: API Error - ${message}`);
      } else {
        console.log(`❌ ${commune}: Network Error -`, error.message);
      }
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 Ouled Djellal commune testing completed!');
}

// Run the test if executed directly
if (require.main === module) {
  testOuledDjellalCommunes().catch(console.error);
}

module.exports = { testOuledDjellalCommunes, communesToTest };
