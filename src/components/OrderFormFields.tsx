import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
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
import { OrderFormValues } from "@/types/product";

const t = (key: string) => key; // Simple translation function placeholder

interface OrderFormFieldsProps {
  form: UseFormReturn<OrderFormValues>;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isSubmitting: boolean;
  communes: string[];
  watchWilaya: string;
}

export function OrderFormFields({
  form,
  onSubmit,
  isSubmitting,
  communes,
  watchWilaya,
}: OrderFormFieldsProps) {
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
