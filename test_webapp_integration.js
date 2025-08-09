import axios from 'axios';
import { noestApiService } from './src/lib/noestApi.js';

// Test the webapp's Noest integration with working data
async function testWebappIntegration() {
    console.log('🧪 Testing Webapp Noest Integration');
    console.log('===================================');
    
    // Test order data that matches what the webapp would send
    const testOrderData = {
        client: 'Ahmed Test Customer',
        phone: '0555123456',
        phone_2: '0123456789',
        adresse: '123 Rue Didouche Mourad, Alger Centre',
        wilaya_id: 16,
        commune: 'Alger Centre', // CONFIRMED WORKING ✅
        montant: 2500,
        remarque: 'Color: Black | Size: Large | Test from webapp',
        produit: 'Test Product from Webapp',
        type_id: 1,
        poids: 1,
        stop_desk: 0,
        station_code: '',
        stock: 0,
        quantite: '1',
        can_open: 0
    };
    
    console.log('📦 Testing with webapp order data...');
    
    try {
        // Test using the webapp's API service
        const result = await noestApiService.createOrder(testOrderData);
        
        if (result.success) {
            console.log('✅ WEBAPP INTEGRATION SUCCESS!');
            console.log('Tracking Number:', result.tracking);
            console.log('Full Response:', JSON.stringify(result.data, null, 2));
        } else {
            console.log('❌ WEBAPP INTEGRATION FAILED:');
            console.log('Error:', result.error);
        }
        
    } catch (error) {
        console.log('💥 Exception during test:', error.message);
    }
}

// Test commune validation
async function testCommuneValidation() {
    console.log('\n🏘️ Testing Commune Validation');
    console.log('==============================');
    
    const { isValidCommune, suggestCommune, getDefaultCommune } = await import('./src/lib/communeMapping.js');
    
    // Test cases
    const testCases = [
        { wilaya: 16, commune: 'Alger Centre' }, // Should be valid
        { wilaya: 16, commune: 'alger centre' }, // Case insensitive test
        { wilaya: 16, commune: 'Invalid Commune' }, // Should suggest alternative
        { wilaya: 1, commune: 'Some Commune' }, // Unknown wilaya
    ];
    
    testCases.forEach(testCase => {
        const isValid = isValidCommune(testCase.wilaya, testCase.commune);
        const suggestion = suggestCommune(testCase.wilaya, testCase.commune);
        const defaultCommune = getDefaultCommune(testCase.wilaya);
        
        console.log(`\nTest: Wilaya ${testCase.wilaya}, Commune "${testCase.commune}"`);
        console.log('  Valid:', isValid);
        console.log('  Suggestion:', suggestion || 'None');
        console.log('  Default:', defaultCommune);
    });
}

// Run tests
testWebappIntegration();
testCommuneValidation();
