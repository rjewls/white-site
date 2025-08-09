// Test file to verify wilaya and commune mappings are working correctly
import { WILAYA_LIST, getWilayaId, getWilayaName } from './src/lib/wilayaMapping.js';
import { getValidCommunes, isValidCommune, suggestCommune, getDefaultCommune } from './src/lib/communeMapping.js';

console.log('=== TESTING WILAYA AND COMMUNE MAPPINGS ===\n');

// Test 1: Basic wilaya mapping
console.log('1. Testing basic wilaya mapping:');
const testWilaya = 'Alger';
const wilayaId = getWilayaId(testWilaya);
console.log(`"${testWilaya}" -> ID: ${wilayaId}`);
console.log(`ID ${wilayaId} -> Name: "${getWilayaName(wilayaId)}"`);

// Test 2: Commune validation
console.log('\n2. Testing commune validation:');
const testCommunes = ['Alger Centre', 'Constantine', 'Oran', 'InvalidCommune'];
testCommunes.forEach(commune => {
  const valid = isValidCommune(16, commune); // Test with Alger wilaya (ID 16)
  console.log(`"${commune}" in Alger -> Valid: ${valid}`);
});

// Test 3: Commune suggestion
console.log('\n3. Testing commune suggestion:');
const suggestion = suggestCommune(16, 'Alger Center'); // Misspelled
console.log(`Suggestion for "Alger Center" in Alger: "${suggestion}"`);

// Test 4: Default communes
console.log('\n4. Testing default communes:');
[16, 25, 31, 57, 58].forEach(wId => {
  const defaultCommune = getDefaultCommune(wId);
  const wilayaName = getWilayaName(wId);
  console.log(`Default for ${wilayaName} (${wId}): "${defaultCommune}"`);
});

// Test 5: Get valid communes for recent additions
console.log('\n5. Testing recent wilaya additions:');
[57, 58].forEach(wId => {
  const communes = getValidCommunes(wId);
  const wilayaName = getWilayaName(wId);
  console.log(`${wilayaName} (${wId}): ${communes.length} communes`);
  console.log(`First 3: ${communes.slice(0, 3).join(', ')}`);
});

console.log('\n=== ALL TESTS COMPLETED ===');
