import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { wilayasData } from "@/lib/locations";
import { wilayaDeliveryFees } from "@/lib/deliveryFees";
import { OrderFormValues } from "@/types/product";

const t = (key: string) => key; // Simple translation function placeholder

interface OrderFormFieldsProps {
  form: UseFormReturn<OrderFormValues>;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isSubmitting: boolean;
  communes: string[];
  watchWilaya: string;
  productPrice: number;
  availableColors: string[];
}

export function OrderFormFields({
  form,
  onSubmit,
  isSubmitting,
  communes,
  watchWilaya,
  productPrice,
  availableColors,
}: OrderFormFieldsProps) {
  const watchDeliveryOption = form.watch("deliveryOption");

  // Calculate delivery fee based on selected wilaya and delivery type
  const deliveryFee = useMemo(() => {
    if (!watchWilaya || !watchDeliveryOption) return 0;
    
    const selectedWilaya = wilayaDeliveryFees.find(w => w.name === watchWilaya);
    if (!selectedWilaya) return 0;
    
    return watchDeliveryOption === "home" ? selectedWilaya.homeDelivery : selectedWilaya.stopdeskDelivery;
  }, [watchWilaya, watchDeliveryOption]);

  // Calculate total price
  const watchQuantity = form.watch("quantity");
  const totalPrice = useMemo(() => {
    return (productPrice * watchQuantity) + deliveryFee;
  }, [productPrice, deliveryFee, watchQuantity]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit event triggered");
    const values = form.getValues();
    console.log("Form values before submission:", values);
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('full_name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enter_name')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('phone_number')}</FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  placeholder={t('enter_phone')}
                  {...field}
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
            <FormItem>
              <FormLabel>{t('wilaya')}</FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_wilaya')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wilayasData.map((wilaya) => (
                    <SelectItem key={wilaya.code} value={wilaya.name}>
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
            <FormItem>
              <FormLabel>{t('commune')}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={!watchWilaya || communes.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
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
        
        <FormField
          control={form.control}
          name="deliveryOption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('delivery_option')}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={!watchWilaya}
              >
                <FormControl>
                  <SelectTrigger>
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
            <FormItem>
              <FormLabel>{t('address')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enter_address')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity (Max 6)</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {availableColors.length > 0 && (
          <FormField
            control={form.control}
            name="selectedColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Color</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                          <span className="capitalize">{color}</span>
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

        {/* Price Summary - Always visible */}
        <div className="space-y-2 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Product Price ({watchQuantity}x {productPrice} DZD):</span>
            <span className="font-medium">{productPrice * watchQuantity} DZD</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Delivery Fee{watchDeliveryOption ? ` (${watchDeliveryOption === "home" ? "Home Delivery" : "Stopdesk Delivery"})` : ""}:
            </span>
            <span className={`font-medium ${deliveryFee > 0 ? "text-pink-600" : "text-gray-400 italic"}`}>
              {deliveryFee > 0 ? `${deliveryFee} DZD` : (watchWilaya && watchDeliveryOption ? "0 DZD" : "— Select options above —")}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-2 border-pink-200">
            <span className="text-gray-800">Total Price:</span>
            <span className="text-pink-700">{totalPrice} DZD</span>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('placing_order')}
            </span>
          ) : (
            t('place_order')
          )}
        </Button>
      </form>
    </Form>
  );
}
