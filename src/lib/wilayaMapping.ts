// Extracted wilaya names with exact spelling from Noest API
// Preserving original ID numbers as they appear in the system

export interface WilayaInfo {
  id: number;
  name: string;
}

export const WILAYA_LIST: WilayaInfo[] = [
  { id: 1, name: 'Adrar' },
  { id: 2, name: 'Chlef' },
  { id: 3, name: 'Laghouat' },
  { id: 4, name: 'Oum El Bouaghi' },
  { id: 5, name: 'Batna' },
  { id: 6, name: 'Béjaïa' },
  { id: 7, name: 'Biskra' },
  { id: 8, name: 'Béchar' },
  { id: 9, name: 'Blida' },
  { id: 10, name: 'Bouira' },
  { id: 11, name: 'Tamanrasset' },
  { id: 12, name: 'Tébessa' },
  { id: 13, name: 'Tlemcen' },
  { id: 14, name: 'Tiaret' },
  { id: 15, name: 'Tizi Ouzou' },
  { id: 16, name: 'Alger' },
  { id: 17, name: 'Djelfa' },
  { id: 18, name: 'Jijel' },
  { id: 19, name: 'Sétif' },
  { id: 20, name: 'Saïda' },
  { id: 21, name: 'Skikda' },
  { id: 22, name: 'Sidi Bel Abbès' },
  { id: 23, name: 'Annaba' },
  { id: 24, name: 'Guelma' },
  { id: 25, name: 'Constantine' },
  { id: 26, name: 'Médéa' },
  { id: 27, name: 'Mostaganem' },
  { id: 28, name: 'M\'Sila' },
  { id: 29, name: 'Mascara' },
  { id: 30, name: 'Ouargla' },
  { id: 31, name: 'Oran' },
  { id: 32, name: 'El Bayadh' },
  { id: 33, name: 'Illizi' },
  { id: 34, name: 'Bordj Bou Arreridj' },
  { id: 35, name: 'Boumerdès' },
  { id: 36, name: 'El Tarf' },
  { id: 37, name: 'Tindouf' },
  { id: 38, name: 'Tissemsilt' },
  { id: 39, name: 'El Oued' },
  { id: 40, name: 'Khenchela' },
  { id: 41, name: 'Souk Ahras' },
  { id: 42, name: 'Tipaza' },
  { id: 43, name: 'Mila' },
  { id: 44, name: 'Aïn Defla' },
  { id: 45, name: 'Naâma' },
  { id: 46, name: 'Aïn Témouchent' },
  { id: 47, name: 'Ghardaïa' },
  { id: 48, name: 'Relizane' },
  { id: 49, name: 'Timimoun' },
  { id: 51, name: 'Ouled Djellal' },    // Note: ID 50 is missing
  { id: 52, name: 'Beni Abbes' },
  { id: 53, name: 'In Salah' },
  { id: 55, name: 'Touggourt' },        // Note: ID 54 is missing  
  { id: 57, name: 'El M\'Ghair' },      // Note: ID 56 is missing
  { id: 58, name: 'El Meniaa' }
];

// Create lookup maps for easy access
export const WILAYA_BY_ID: { [id: number]: string } = {};
export const WILAYA_ID_BY_NAME: { [name: string]: number } = {};

WILAYA_LIST.forEach(wilaya => {
  WILAYA_BY_ID[wilaya.id] = wilaya.name;
  WILAYA_ID_BY_NAME[wilaya.name] = wilaya.id;
});

// Helper functions
export const getWilayaName = (id: number): string => {
  return WILAYA_BY_ID[id] || `Unknown Wilaya ${id}`;
};

export const getWilayaId = (name: string): number | null => {
  return WILAYA_ID_BY_NAME[name] || null;
};

export const isValidWilayaId = (id: number): boolean => {
  return id in WILAYA_BY_ID;
};

// Get all valid wilaya IDs (for validation)
export const VALID_WILAYA_IDS = WILAYA_LIST.map(w => w.id);

console.log(`Loaded ${WILAYA_LIST.length} wilayas with IDs: ${VALID_WILAYA_IDS.join(', ')}`);
console.log('Missing IDs: 50, 54, 56 (gaps in the numbering system)');
