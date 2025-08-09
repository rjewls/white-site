// Simple Node.js test script for Noest API
const axios = require('axios');

// Test with your actual API credentials
const API_TOKEN = 'YOUR_API_TOKEN_HERE';  // Replace with actual token
const GUID = 'YOUR_GUID_HERE';            // Replace with actual GUID

const testOrder = {
    api_token: API_TOKEN,
    user_guid: GUID,
    reference: `TEST-${Date.now()}`,
    client: 'Test Client',
    phone: '0123456789',
    phone_2: '',
    adresse: '123 Test Street',
    wilaya_id: 16, // Alger
    commune: 'Test Commune',
    montant: 2500,
    remarque: 'Test order from integration',
    produit: 'Test Product',
    type_id: 1,
    poids: 1,
    stop_desk: 0,
    station_code: '',
    stock: 0,
    quantite: '1',
    can_open: 0
};

async function testNoestAPI() {
    console.log('Testing Noest API integration...');
    console.log('Request data:', JSON.stringify(testOrder, null, 2));
    
    try {
        const response = await axios.post(
            'https://app.noest-dz.com/api/public/create/order',
            testOrder,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 10000
            }
        );
        
        console.log('✅ SUCCESS! API Response:', response.data);
        
        if (response.data.tracking) {
            console.log('📦 Tracking Number:', response.data.tracking);
        }
        
    } catch (error) {
        console.log('❌ ERROR:');
        
        if (axios.isAxiosError(error)) {
            console.log('Status:', error.response?.status);
            console.log('Response:', error.response?.data);
            console.log('Headers:', error.response?.headers);
        } else {
            console.log('Error:', error.message);
        }
    }
}

console.log('⚠️  Remember to replace API_TOKEN and GUID with your actual credentials!');
console.log('Run: node test_noest_integration.js\n');

testNoestAPI();
