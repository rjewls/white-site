export interface OrderFormValues {
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  deliveryOption: string;
  address: string;
  quantity: number;
  selectedColor?: string; // Keep for single selection
  selectedColors?: string[]; // Add for multiple selections
  selectedSize?: string; // Keep for single selection
  selectedSizes?: string[]; // Add for multiple selections
}
