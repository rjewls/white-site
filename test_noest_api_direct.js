import axios from 'axios';

// ⚠️ REPLACE THESE WITH YOUR ACTUAL CREDENTIALS FROM NOEST DASHBOARD
const API_TOKEN = 'YOUR_API_TOKEN_HERE';  // Get from https://app.noest-dz.com
const GUID = 'YOUR_GUID_HERE';            // Get from your Noest account

// Static mockup data conforming to Noest API documentation
const testOrderData = {
    // Authentication (required)
    api_token: API_TOKEN,
    user_guid: GUID,
    
    // Order reference (auto-generated)
    reference: `TEST-ORDER-${Date.now()}`,
    
    // Customer Information (required)
    client: 'Ahmed Ben Ali',              // Customer name (max 255 chars)
    phone: '0555123456',                  // Phone number (9-10 digits)
    phone_2: '0123456789',               // Secondary phone (optional)
    
    // Delivery Address (required)
    adresse: '123 Rue de la Liberté, Cité des Martyrs', // Address (max 255 chars)
    wilaya_id: 16,                       // Wilaya ID (1-58, 16 = Alger)
    commune: 'Bab Ezzouar',              // Commune name (max 255 chars)
    
    // Order Details (required)
    montant: 2500,                       // Amount in DZD (numeric)
    produit: 'Smartphone Samsung Galaxy A54', // Product name
    remarque: 'Couleur: Noir | Stockage: 128GB | Livraison rapide demandée', // Optional notes
    
    // Delivery Configuration (required)
    type_id: 1,                          // Delivery type: 1=domicile, 2=stopdesk, 3=???
    poids: 1,                           // Weight in KG (integer)
    stop_desk: 0,                       // 0=home delivery, 1=stopdesk delivery
    station_code: '',                   // Station code (required if stop_desk=1)
    
    // Order Configuration (required)
    stock: 0,                           // Stock flag: 0 or 1
    quantite: '1',                      // Quantity as string
    can_open: 0                         // Can open package: 0 or 1
};

// Alternative test data for Stop Desk delivery
const testStopDeskOrder = {
    api_token: API_TOKEN,
    user_guid: GUID,
    reference: `TEST-STOPDESK-${Date.now()}`,
    
    client: 'Fatima Zohra',
    phone: '0777654321',
    phone_2: '',
    
    adresse: 'Station Noest Alger Centre',
    wilaya_id: 16,
    commune: 'Alger Centre',
    
    montant: 1800,
    produit: 'Montre connectée',
    remarque: 'Couleur: Rose | Retrait en station',
    
    type_id: 2,                         // Stop desk delivery
    poids: 1,
    stop_desk: 1,                       // Stop desk delivery
    station_code: '16E',               // Station code for Alger Centre
    
    stock: 0,
    quantite: '1',
    can_open: 0
};

async function testNoestAPI(orderData, orderType = 'Home Delivery') {
    console.log(`\n🧪 Testing ${orderType} Order Creation`);
    console.log('=' .repeat(50));
    
    // Validate credentials
    if (!orderData.api_token || orderData.api_token === 'YOUR_API_TOKEN_HERE') {
        console.log('❌ ERROR: Please replace API_TOKEN with your actual token');
        console.log('   Get it from: https://app.noest-dz.com/dashboard');
        return;
    }
    
    if (!orderData.user_guid || orderData.user_guid === 'YOUR_GUID_HERE') {
        console.log('❌ ERROR: Please replace GUID with your actual GUID');
        console.log('   Get it from your Noest account settings');
        return;
    }
    
    console.log('📋 Order Data:');
    console.log('Reference:', orderData.reference);
    console.log('Customer:', orderData.client);
    console.log('Phone:', orderData.phone);
    console.log('Address:', orderData.adresse);
    console.log('Wilaya ID:', orderData.wilaya_id);
    console.log('Amount:', orderData.montant, 'DZD');
    console.log('Product:', orderData.produit);
    console.log('Weight:', orderData.poids, 'kg');
    console.log('Delivery Type:', orderData.stop_desk ? 'Stop Desk' : 'Home');
    if (orderData.station_code) {
        console.log('Station Code:', orderData.station_code);
    }
    
    console.log('\n🚀 Making API Request...');
    
    try {
        const response = await axios.post(
            'https://app.noest-dz.com/api/public/create/order',
            orderData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'NoestAPITest/1.0'
                },
                timeout: 15000, // 15 seconds timeout
                validateStatus: function (status) {
                    return status < 600; // Don't throw for any HTTP status
                }
            }
        );
        
        console.log('\n📡 API Response:');
        console.log('Status Code:', response.status);
        console.log('Status Text:', response.statusText);
        
        if (response.status === 200 || response.status === 201) {
            console.log('✅ SUCCESS!');
            console.log('Response Data:', JSON.stringify(response.data, null, 2));
            
            if (response.data.success) {
                console.log('\n🎉 Order Created Successfully!');
                if (response.data.tracking) {
                    console.log('📦 Tracking Number:', response.data.tracking);
                }
                if (response.data.reference) {
                    console.log('🔗 Reference:', response.data.reference);
                }
            } else {
                console.log('\n❌ Order Creation Failed:');
                console.log('Error:', response.data.message || response.data.error || 'Unknown error');
            }
        } else {
            console.log('❌ HTTP ERROR:', response.status);
            console.log('Response Body:', JSON.stringify(response.data, null, 2));
            
            // Common error explanations
            if (response.status === 401) {
                console.log('\n💡 This is an authentication error. Check your API_TOKEN and GUID.');
            } else if (response.status === 422) {
                console.log('\n💡 This is a validation error. Check the required fields.');
            } else if (response.status === 403) {
                console.log('\n💡 Access forbidden. Your account may not have permission.');
            }
        }
        
    } catch (error) {
        console.log('\n❌ Network/Request Error:');
        
        if (error.code === 'ECONNABORTED') {
            console.log('⏱️ Request timed out. The API might be slow or unavailable.');
        } else if (error.code === 'ENOTFOUND') {
            console.log('🌐 DNS resolution failed. Check your internet connection.');
        } else if (axios.isAxiosError(error)) {
            console.log('HTTP Status:', error.response?.status);
            console.log('Error Message:', error.message);
            if (error.response?.data) {
                console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
            }
        } else {
            console.log('Unexpected Error:', error.message);
        }
    }
}

// Main execution
async function runTests() {
    console.log('🧪 NOEST EXPRESS API INTEGRATION TEST');
    console.log('======================================');
    
    if (API_TOKEN === 'YOUR_API_TOKEN_HERE' || GUID === 'YOUR_GUID_HERE') {
        console.log('\n⚠️  SETUP REQUIRED:');
        console.log('1. Go to https://app.noest-dz.com and login');
        console.log('2. Get your API Token from the dashboard');
        console.log('3. Get your GUID from account settings');
        console.log('4. Replace the values at the top of this file');
        console.log('5. Run: node test_noest_api_direct.js');
        return;
    }
    
    // Test 1: Home delivery order
    await testNoestAPI(testOrderData, 'Home Delivery');
    
    // Wait a bit between requests
    console.log('\n⏳ Waiting 2 seconds before next test...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Stop desk order
    await testNoestAPI(testStopDeskOrder, 'Stop Desk');
    
    console.log('\n✨ Tests completed!');
}

// Run the tests
runTests().catch(error => {
    console.log('💥 Test execution failed:', error.message);
});

export { testNoestAPI, testOrderData, testStopDeskOrder };
