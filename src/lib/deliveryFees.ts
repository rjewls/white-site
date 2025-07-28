import { supabase } from "@/lib/supabaseClient";

export interface DeliveryFee {
  code: number;
  name: string;
  homeDelivery: number;
  stopdeskDelivery: number;
}

export const wilayaDeliveryFees: DeliveryFee[] = [
  { code: 1, name: "Adrar", homeDelivery: 1300, stopdeskDelivery: 600 },
  { code: 2, name: "Chlef", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 3, name: "Laghouat", homeDelivery: 850, stopdeskDelivery: 450 },
  { code: 4, name: "Oum El Bouaghi", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 5, name: "Batna", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 6, name: "Béjaïa", homeDelivery: 700, stopdeskDelivery: 250 },
  { code: 7, name: "Biskra", homeDelivery: 800, stopdeskDelivery: 400 },
  { code: 8, name: "Béchar", homeDelivery: 1000, stopdeskDelivery: 500 },
  { code: 9, name: "Blida", homeDelivery: 450, stopdeskDelivery: 250 },
  { code: 10, name: "Bouira", homeDelivery: 600, stopdeskDelivery: 250 },
  { code: 11, name: "Tamanrasset", homeDelivery: 1700, stopdeskDelivery: 800 },
  { code: 12, name: "Tébessa", homeDelivery: 750, stopdeskDelivery: 300 },
  { code: 13, name: "Tlemcen", homeDelivery: 700, stopdeskDelivery: 350 },
  { code: 14, name: "Tiaret", homeDelivery: 700, stopdeskDelivery: 350 },
  { code: 15, name: "Tizi Ouzou", homeDelivery: 600, stopdeskDelivery: 250 },
  { code: 16, name: "Algiers", homeDelivery: 400, stopdeskDelivery: 200 },
  { code: 17, name: "Djelfa", homeDelivery: 850, stopdeskDelivery: 400 },
  { code: 18, name: "Jijel", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 19, name: "Sétif", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 20, name: "Saïda", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 21, name: "Skikda", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 22, name: "Sidi Bel Abbès", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 23, name: "Annaba", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 24, name: "Guelma", homeDelivery: 750, stopdeskDelivery: 300 },
  { code: 25, name: "Constantine", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 26, name: "Médéa", homeDelivery: 650, stopdeskDelivery: 250 },
  { code: 27, name: "Mostaganem", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 28, name: "M'Sila", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 29, name: "Mascara", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 30, name: "Ouargla", homeDelivery: 900, stopdeskDelivery: 450 },
  { code: 31, name: "Oran", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 32, name: "El Bayadh", homeDelivery: 1000, stopdeskDelivery: 400 },
  { code: 33, name: "Illizi", homeDelivery: 1900, stopdeskDelivery: 1000 },
  { code: 34, name: "Bordj Bou Arréridj", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 35, name: "Boumerdès", homeDelivery: 450, stopdeskDelivery: 250 },
  { code: 36, name: "El Tarf", homeDelivery: 750, stopdeskDelivery: 300 },
  { code: 37, name: "Tindouf", homeDelivery: 1400, stopdeskDelivery: 700 },
  { code: 38, name: "Tissemsilt", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 39, name: "El Oued", homeDelivery: 1000, stopdeskDelivery: 450 },
  { code: 40, name: "Khenchela", homeDelivery: 750, stopdeskDelivery: 300 },
  { code: 41, name: "Souk Ahras", homeDelivery: 750, stopdeskDelivery: 300 },
  { code: 42, name: "Tipaza", homeDelivery: 500, stopdeskDelivery: 250 },
  { code: 43, name: "Mila", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 44, name: "Aïn Defla", homeDelivery: 700, stopdeskDelivery: 250 },
  { code: 45, name: "Naâma", homeDelivery: 1000, stopdeskDelivery: 500 },
  { code: 46, name: "Aïn Témouchent", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 47, name: "Ghardaïa", homeDelivery: 850, stopdeskDelivery: 450 },
  { code: 48, name: "Relizane", homeDelivery: 700, stopdeskDelivery: 300 },
  { code: 49, name: "Timimoun", homeDelivery: 1400, stopdeskDelivery: 600 },
  { code: 51, name: "Ouled Djellal", homeDelivery: 800, stopdeskDelivery: 400 },
  { code: 52, name: "Beni Abbes", homeDelivery: 1100, stopdeskDelivery: 400 },
  { code: 53, name: "In Salah", homeDelivery: 1700, stopdeskDelivery: 1000 },
  { code: 55, name: "Touggourt", homeDelivery: 900, stopdeskDelivery: 450 },
  { code: 57, name: "El M'Ghair", homeDelivery: 1000, stopdeskDelivery: 500 },
  { code: 58, name: "El Meniaa", homeDelivery: 900, stopdeskDelivery: 450 },
];

// Function to get delivery fee
export const getDeliveryFee = async (wilayaName: string, deliveryOption: string): Promise<number> => {
  const { data, error } = await supabase
    .from('delivery_fees')
    .select('*')
    .eq('wilaya_name', wilayaName)
    .single();

  if (error || !data) return 0;
  
  return deliveryOption === "home" ? data.home_delivery : data.stopdesk_delivery;
};

// Function to get all delivery fees
export const getAllDeliveryFees = async (): Promise<DeliveryFee[]> => {
  const { data, error } = await supabase
    .from('delivery_fees')
    .select('*')
    .order('wilaya_code');

  if (error) return [];
  return data as DeliveryFee[];
};
