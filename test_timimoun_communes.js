// Test script for Timimoun communes with Noest API
const axios = require('axios');

const NOEST_API_URL = 'https://api.noestexpress.com';
const TOKEN = 'your-actual-token-here'; // Replace with your actual Noest API token

// Test data for Timimoun order
const testOrder = {
  name: "Test Customer Timimoun",
  phone: "0551234567",
  wilaya: "Timimoun",
  commune: "Timimoun", // Using the main commune
  address: "Test Address Timimoun",
  product: "Test Product",
  price: 2500,
  quantity: 1,
  weight: 500,
  fragile: false,
  exchange: false,
  stopdesk: false
};

// List of Timimoun communes to test
const communesToTest = [
  'Timimoun',
  'Charouine',
  'Ouled Said',
  'Ksar Kaddour',
  'Tinerkouk',
  'Deldoul',
  'Aougrout'
];

async function testTimimounCommunes() {
  console.log('🧪 Testing Timimoun communes with Noest API...');
  console.log('===============================================');
  
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
  
  console.log('\n🏁 Timimoun commune testing completed!');
}

// Run the test if executed directly
if (require.main === module) {
  testTimimounCommunes().catch(console.error);
}

module.exports = { testTimimounCommunes, communesToTest };
