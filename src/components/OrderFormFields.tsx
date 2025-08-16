import { UseFormReturn } from "react-hook-form";
import { Loader2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useMemo, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { WILAYA_LIST } from "@/lib/wilayaMapping";
import { wilayaDeliveryFees } from "@/lib/deliveryFees";
import { OrderFormValues } from "@/types/product";
import { parseColorEntry, getDisplayColorText, getColorValue } from "@/lib/colorUtils";

const t = (key: string) => key; // Simple translation function placeholder

interface OrderFormFieldsProps {
  form: UseFormReturn<OrderFormValues>;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isSubmitting: boolean;
  communes: string[];
  watchWilaya: string;
  productPrice: number;
  availableColors: string[];
  availableSizes: string[];
}

export function OrderFormFields({
  form,
  onSubmit,
  isSubmitting,
  communes,
  watchWilaya,
  productPrice,
  availableColors,
  availableSizes,
}: OrderFormFieldsProps) {
  const watchDeliveryOption = form.watch("deliveryOption");
  
  // Watch all form fields for validation
  const watchedValues = form.watch();
  
  // Refs for form fields to enable scrolling to them
  const fieldRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Helper: is this basic field missing?
  const isBasicFieldMissing = (field: keyof OrderFormValues) => {
    const value = watchedValues[field];
    return !value || String(value).trim() === '';
  };

  // Helper: is color/size selection missing considering quantity
  const isColorMissing = () => {
    if (availableColors.length === 0) return false;
    const quantity = watchedValues.quantity || 1;
    if (quantity === 1) return !watchedValues.selectedColor;
    const arr = watchedValues.selectedColors || [];
    return Array.from({ length: quantity }).some((_, i) => !arr[i]);
  };

  const isSizeMissing = () => {
    if (availableSizes.length === 0) return false;
    const quantity = watchedValues.quantity || 1;
    if (quantity === 1) return !watchedValues.selectedSize;
    const arr = watchedValues.selectedSizes || [];
    return Array.from({ length: quantity }).some((_, i) => !arr[i]);
  };
  
  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    const requiredFields = ['name', 'phone', 'wilaya', 'commune', 'deliveryOption', 'address'];
    
    // Check basic required fields
    const basicFieldsValid = requiredFields.every(field => {
      const value = watchedValues[field as keyof OrderFormValues];
      return value && String(value).trim() !== '';
    });
    
    if (!basicFieldsValid) return false;
    
    // Check color selection if colors are available
    if (availableColors.length > 0) {
      const quantity = watchedValues.quantity || 1;
      if (quantity === 1) {
        // Single item - check selectedColor
        if (!watchedValues.selectedColor) return false;
      } else {
        // Multiple items - check selectedColors array
        const selectedColors = watchedValues.selectedColors || [];
        for (let i = 0; i < quantity; i++) {
          if (!selectedColors[i]) return false;
        }
      }
    }
    
    // Check size selection if sizes are available
    if (availableSizes.length > 0) {
      const quantity = watchedValues.quantity || 1;
      if (quantity === 1) {
        // Single item - check selectedSize
        if (!watchedValues.selectedSize) return false;
      } else {
        // Multiple items - check selectedSizes array
        const selectedSizes = watchedValues.selectedSizes || [];
        for (let i = 0; i < quantity; i++) {
          if (!selectedSizes[i]) return false;
        }
      }
    }
    
    return true;
  }, [watchedValues, availableColors.length, availableSizes.length]);
  
  // Function to scroll to first empty field and highlight it
  const scrollToFirstEmptyField = () => {
    const requiredFields = ['name', 'phone', 'wilaya', 'commune', 'deliveryOption', 'address'];
    
    // Check basic required fields first
    for (const field of requiredFields) {
      const value = watchedValues[field as keyof OrderFormValues];
      if (!value || String(value).trim() === '') {
        // Find the field element and scroll to it
        const fieldElement = fieldRefs.current[field];
        if (fieldElement) {
          fieldElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          
          // Add visual highlight effect
          fieldElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
          
          // Remove the highlight after 3 seconds
          setTimeout(() => {
            fieldElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
          }, 3000);
          
          // Focus the input if it's focusable
          const input = fieldElement.querySelector('input, select, [role="combobox"]') as HTMLElement;
          if (input && typeof input.focus === 'function') {
            setTimeout(() => input.focus(), 100);
          }
        }
        return; // Stop after finding the first empty field
      }
    }
    
    // Check color selection if colors are available
    if (availableColors.length > 0) {
      const quantity = watchedValues.quantity || 1;
      if (quantity === 1) {
        // Single item - check selectedColor
        if (!watchedValues.selectedColor) {
          const fieldElement = fieldRefs.current['selectedColor'];
          if (fieldElement) {
            fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            fieldElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
            setTimeout(() => {
              fieldElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
            }, 3000);
            const input = fieldElement.querySelector('button[role="combobox"]') as HTMLElement;
            if (input && typeof input.focus === 'function') {
              setTimeout(() => input.focus(), 100);
            }
          }
          return;
        }
      } else {
        // Multiple items - check selectedColors array
        const selectedColors = watchedValues.selectedColors || [];
        for (let i = 0; i < quantity; i++) {
          if (!selectedColors[i]) {
            const fieldElement = fieldRefs.current[`selectedColors.${i}`];
            if (fieldElement) {
              fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
              fieldElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
              setTimeout(() => {
                fieldElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
              }, 3000);
              const input = fieldElement.querySelector('button[role="combobox"]') as HTMLElement;
              if (input && typeof input.focus === 'function') {
                setTimeout(() => input.focus(), 100);
              }
            }
            return;
          }
        }
      }
    }
    
    // Check size selection if sizes are available
    if (availableSizes.length > 0) {
      const quantity = watchedValues.quantity || 1;
      if (quantity === 1) {
        // Single item - check selectedSize
        if (!watchedValues.selectedSize) {
          const fieldElement = fieldRefs.current['selectedSize'];
          if (fieldElement) {
            fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            fieldElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
            setTimeout(() => {
              fieldElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
            }, 3000);
            const input = fieldElement.querySelector('button[role="combobox"]') as HTMLElement;
            if (input && typeof input.focus === 'function') {
              setTimeout(() => input.focus(), 100);
            }
          }
          return;
        }
      } else {
        // Multiple items - check selectedSizes array
        const selectedSizes = watchedValues.selectedSizes || [];
        for (let i = 0; i < quantity; i++) {
          if (!selectedSizes[i]) {
            const fieldElement = fieldRefs.current[`selectedSizes.${i}`];
            if (fieldElement) {
              fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
              fieldElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
              setTimeout(() => {
                fieldElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500', 'ring-opacity-75');
              }, 3000);
              const input = fieldElement.querySelector('button[role="combobox"]') as HTMLElement;
              if (input && typeof input.focus === 'function') {
                setTimeout(() => input.focus(), 100);
              }
            }
            return;
          }
        }
      }
    }
  };

  // Highlight all missing fields with a red ring/border for a short time
  const highlightAllMissingFields = () => {
    const missingKeys: string[] = [];
    const requiredFields = ['name', 'phone', 'wilaya', 'commune', 'deliveryOption', 'address'];
    for (const field of requiredFields) {
      const value = watchedValues[field as keyof OrderFormValues];
      if (!value || String(value).trim() === '') {
        missingKeys.push(field);
      }
    }
    if (availableColors.length > 0) {
      const quantity = watchedValues.quantity || 1;
      if (quantity === 1) {
        if (!watchedValues.selectedColor) missingKeys.push('selectedColor');
      } else {
        const selectedColors = watchedValues.selectedColors || [];
        for (let i = 0; i < quantity; i++) {
          if (!selectedColors[i]) missingKeys.push(`selectedColors.${i}`);
        }
      }
    }
    if (availableSizes.length > 0) {
      const quantity = watchedValues.quantity || 1;
      if (quantity === 1) {
        if (!watchedValues.selectedSize) missingKeys.push('selectedSize');
      } else {
        const selectedSizes = watchedValues.selectedSizes || [];
        for (let i = 0; i < quantity; i++) {
          if (!selectedSizes[i]) missingKeys.push(`selectedSizes.${i}`);
        }
      }
    }
    missingKeys.forEach((key) => {
      const el = fieldRefs.current[key];
      if (el) {
        el.classList.add('ring-2', 'ring-red-500', 'ring-opacity-75');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-red-500', 'ring-opacity-75');
        }, 3000);
      }
    });
  };

  const deliveryFee = useMemo(() => {
    if (!watchWilaya || !watchDeliveryOption) return 0;
    
    const selectedWilaya = WILAYA_LIST.find(w => w.name === watchWilaya);
    if (!selectedWilaya) return 0;
    
    const wilayaCode = selectedWilaya.id;
    const fees = wilayaDeliveryFees.find(f => f.code === wilayaCode);
    
    if (!fees) return 0;
    
    return watchDeliveryOption === "home" ? fees.homeDelivery : fees.stopdeskDelivery;
  }, [watchWilaya, watchDeliveryOption]);

  const totalPrice = useMemo(() => {
    const quantity = form.watch("quantity") || 1;
    const numericQuantity = typeof quantity === 'number' ? quantity : parseInt(String(quantity)) || 1;
    const numericProductPrice = typeof productPrice === 'number' ? productPrice : parseFloat(String(productPrice)) || 0;
    const numericDeliveryFee = typeof deliveryFee === 'number' ? deliveryFee : parseFloat(String(deliveryFee)) || 0;
    
    return (numericProductPrice * numericQuantity) + numericDeliveryFee;
  }, [productPrice, deliveryFee, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem ref={(el) => fieldRefs.current['name'] = el}>
                  <FormLabel className="text-sm font-medium">{t('full_name')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('enter_name')} 
                      {...field} 
                      className={`h-10 text-sm ${isBasicFieldMissing('name') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem ref={(el) => fieldRefs.current['phone'] = el}>
                  <FormLabel className="text-sm font-medium">{t('phone_number')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder={t('enter_phone')}
                      {...field}
                      className={`h-10 text-sm ${isBasicFieldMissing('phone') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 10) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="wilaya"
              render={({ field }) => (
                <FormItem ref={(el) => fieldRefs.current['wilaya'] = el}>
                  <FormLabel className="text-sm font-medium">{t('wilaya')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={`h-10 text-sm ${isBasicFieldMissing('wilaya') ? 'border-red-500 focus:ring-red-500' : ''}`}>
                        <SelectValue placeholder={t('select_wilaya')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WILAYA_LIST.map((wilaya) => (
                        <SelectItem key={wilaya.id} value={wilaya.name}>
                          {wilaya.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="commune"
              render={({ field }) => (
                <FormItem ref={(el) => fieldRefs.current['commune'] = el}>
                  <FormLabel className="text-sm font-medium">{t('commune')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!watchWilaya || communes.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className={`h-10 text-sm ${isBasicFieldMissing('commune') ? 'border-red-500 focus:ring-red-500' : ''}`}>
                        <SelectValue placeholder={t('select_commune')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {communes.map((commune) => (
                        <SelectItem key={commune} value={commune}>
                          {commune}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="deliveryOption"
            render={({ field }) => (
              <FormItem ref={(el) => fieldRefs.current['deliveryOption'] = el}>
                <FormLabel className="text-sm font-medium">{t('delivery_option')}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={!watchWilaya}
                >
                  <FormControl>
                    <SelectTrigger className={`h-10 text-sm ${isBasicFieldMissing('deliveryOption') ? 'border-red-500 focus:ring-red-500' : ''}`}>
                      <SelectValue placeholder={t('select_delivery')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="home">{t('home_delivery')}</SelectItem>
                    <SelectItem value="stopdesk">{t('stopdesk_delivery')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem ref={(el) => fieldRefs.current['address'] = el}>
                <FormLabel className="text-sm font-medium">{t('address')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enter_address')} 
                    {...field} 
                    className={`h-10 text-sm ${isBasicFieldMissing('address') ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Product Options Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {form.watch("quantity") > 1 ? `Colors (Select ${form.watch("quantity")} colors)` : "Color"}
                </Label>
                {form.watch("quantity") > 1 ? (
                  // Multiple color selection for multiple quantities
                  <div className="space-y-2">
                    {Array.from({ length: form.watch("quantity") }, (_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-medium min-w-[60px]">Item {index + 1}:</span>
                        <FormField
                          control={form.control}
                          name={`selectedColors.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1" ref={(el) => fieldRefs.current[`selectedColors.${index}`] = el}>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className={`h-10 ${isColorMissing() ? 'border-red-500 focus:ring-red-500' : ''}`}>
                                    <SelectValue placeholder="Choose color" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableColors.map((color) => (
                                    <SelectItem key={color} value={color}>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className="w-4 h-4 rounded-full border border-border"
                                          style={{ backgroundColor: getColorValue(color) }}
                                        />
                                        <span>{getDisplayColorText(color)}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single color selection for quantity = 1
                  <FormField
                    control={form.control}
                    name="selectedColor"
                    render={({ field }) => (
                      <FormItem ref={(el) => fieldRefs.current['selectedColor'] = el}>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className={`h-12 ${isColorMissing() ? 'border-red-500 focus:ring-red-500' : ''}`}>
                              <SelectValue placeholder="Choose a color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableColors.map((color) => (
                              <SelectItem key={color} value={color}>
                                <div className="flex items-center gap-3">
                                  <span
                                    className="w-5 h-5 rounded-full border border-border"
                                    style={{ backgroundColor: getColorValue(color) }}
                                  />
                                  <span>{getDisplayColorText(color)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {form.watch("quantity") > 1 ? `Sizes (Select ${form.watch("quantity")} sizes)` : "Size"}
                </Label>
                {form.watch("quantity") > 1 ? (
                  // Multiple size selection for multiple quantities
                  <div className="space-y-2">
                    {Array.from({ length: form.watch("quantity") }, (_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-medium min-w-[60px]">Item {index + 1}:</span>
                        <FormField
                          control={form.control}
                          name={`selectedSizes.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1" ref={(el) => fieldRefs.current[`selectedSizes.${index}`] = el}>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className={`h-10 ${isSizeMissing() ? 'border-red-500 focus:ring-red-500' : ''}`}>
                                    <SelectValue placeholder="Choose size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableSizes.map((size) => (
                                    <SelectItem key={size} value={size}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">📏</span>
                                        <span>{size}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single size selection for quantity = 1
                  <FormField
                    control={form.control}
                    name="selectedSize"
                    render={({ field }) => (
                      <FormItem ref={(el) => fieldRefs.current['selectedSize'] = el}>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className={`h-12 ${isSizeMissing() ? 'border-red-500 focus:ring-red-500' : ''}`}>
                              <SelectValue placeholder="Choose a size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">📏</span>
                                  <span>{size}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Quantity Controls */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Quantity (Max 3)</Label>
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            const currentValue = field.value || 1;
                            if (currentValue > 1) {
                              field.onChange(currentValue - 1);
                            }
                          }}
                          disabled={(field.value || 1) <= 1}
                        >
                          <Minus className="h-4 w-4 text-blue-600" />
                        </Button>
                        
                        <span className="text-lg font-semibold text-gray-800 min-w-[40px] text-center">
                          {field.value || 1}
                        </span>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            const currentValue = field.value || 1;
                            if (currentValue < 3) {
                              field.onChange(currentValue + 1);
                            }
                          }}
                          disabled={(field.value || 1) >= 3}
                        >
                          <Plus className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-600">
                Product Price × {form.watch("quantity") || 1}:
              </span>
              <span className="font-medium text-gray-800">
                {(productPrice * (form.watch("quantity") || 1))} DZD
              </span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-600">
                Delivery Fee{watchDeliveryOption ? ` (${watchDeliveryOption === "home" ? "Home" : "Stopdesk"})` : ""}:
              </span>
              <span className={`font-medium ${deliveryFee > 0 ? "text-blue-600" : "text-gray-400 italic"}`}>
                {deliveryFee > 0 ? `${deliveryFee} DZD` : (watchWilaya && watchDeliveryOption ? "0 DZD" : "— Select options —")}
              </span>
            </div>
            <div className="flex justify-between items-center text-base sm:text-lg font-bold border-t pt-2 border-blue-200">
              <span className="text-gray-800">Total Price:</span>
              <span className="text-blue-700">{totalPrice} DZD</span>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 sm:h-10 text-sm font-medium bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={isSubmitting}
          onClick={(e) => {
            if (!isFormValid) {
              e.preventDefault();
              // Scroll to first empty field and highlight it
              scrollToFirstEmptyField();
              highlightAllMissingFields();
              // Trigger form validation to show error messages
              form.trigger();
              return;
            }
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('placing_order')}
            </span>
          ) : !isFormValid ? (
            <span className="flex items-center justify-center">
              <ShoppingCart className="mr-2 h-4 w-4 animate-wiggle" />
              Complete all fields
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t('place_order')}
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
