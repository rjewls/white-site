import React, { useState, useMemo } from "react";
import { wilayasData, communesData } from "@/lib/locations";
import { stations } from "@/lib/stations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { wilayaDeliveryFees } from "@/lib/deliveryFees";

interface OrderFormProps {
  productId: string;
  productTitle: string;
  productPrice: number;
  onClose: () => void;
}

const deliveryTypes = [
  { value: "home", label: "Home Delivery" },
  { value: "station", label: "Pickup Station" },
];

// Discord webhook URL - configurable via environment variable  
const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1398783921738481745/Bg0f-Qp7ePQxfORlP4SZ5So5C7xxRtmTOWOmEXQmMpdvnTqy9CVxg8Sbn4LcpPYN4EBD";

export const OrderForm: React.FC<OrderFormProps> = ({ productId, productTitle, productPrice, onClose }) => {
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [deliveryType, setDeliveryType] = useState("home");
  const [station, setStation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter communes for selected wilaya
  const communes = useMemo(() => {
    const selectedWilaya = wilayasData.find(w => w.name === wilaya);
    return selectedWilaya ? selectedWilaya.communes : [];
  }, [wilaya]);

  // Calculate delivery fee
  const deliveryFee = useMemo(() => {
    const selectedWilaya = wilayaDeliveryFees.find(w => w.name === wilaya);
    if (!selectedWilaya) return 0;
    return deliveryType === "home" ? selectedWilaya.homeDelivery : selectedWilaya.stopdeskDelivery;
  }, [wilaya, deliveryType]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    const numericProductPrice = typeof productPrice === 'number' ? productPrice : parseFloat(String(productPrice)) || 0;
    const numericDeliveryFee = typeof deliveryFee === 'number' ? deliveryFee : parseFloat(String(deliveryFee)) || 0;
    return numericProductPrice + numericDeliveryFee;
  }, [productPrice, deliveryFee]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const orderData = {
      productId,
      productTitle,
      productPrice,
      wilaya,
      commune,
      deliveryType,
      station,
      name,
      phone,
      address,
      deliveryFee,
      totalPrice,
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [{
            color: 0x3b82f6, // Blue color
            description: "🛍️ **NEW ORDER** 🛍️\n\n" +
                        "📦 **" + orderData.productTitle + "**\n\n" +
                        "👤 " + orderData.name + " | 📱 " + orderData.phone + "\n" +
                        "📍 " + orderData.wilaya + ", " + orderData.commune + "\n" +
                        "🏠 " + orderData.address + "\n\n" +
                        "🚚 " + (orderData.deliveryType === "home" ? "🏠 Home Delivery" : "🏪 Stopdesk Delivery") + "\n\n" +
                        "💰 **TOTAL: " + orderData.totalPrice + " DZD**\n" +
                        orderData.productPrice + " DZD + " + orderData.deliveryFee + " DZD delivery\n\n" +
                        "✅ Pending | ⏰ " + new Date().toLocaleString('en-GB', { 
                          timeZone: 'Africa/Algiers',
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) + " 🌹"
          }]
        }),
      });

      if (response.ok) {
        toast.success("Order sent successfully!");
      } else {
        toast.error("Error sending order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Card className="w-full max-w-md rounded-2xl shadow-lg bg-blue-50 border-2 border-blue-300 ring-1 ring-blue-200">
        <CardContent className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-playfair font-bold text-blue-700 mb-2 text-center">Order: {productTitle}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              required
              placeholder="Your Name"
              className="rounded-lg border-blue-300 focus:border-blue-500 px-3 py-2 bg-white text-blue-700 font-inter"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="tel"
              required
              placeholder="Phone Number"
              className="rounded-lg border-blue-300 focus:border-blue-500 px-3 py-2 bg-white text-blue-700 font-inter"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <select
              required
              className="rounded-lg border-blue-300 focus:border-blue-500 px-3 py-2 bg-white text-blue-700 font-inter"
              value={wilaya}
              onChange={e => { setWilaya(e.target.value); setCommune(""); }}
            >
              <option value="">Select Wilaya</option>
              {wilayasData.map(w => (
                <option key={w.code} value={w.name}>{w.name}</option>
              ))}
            </select>
            <select
              required
              className="rounded-lg border-blue-300 focus:border-blue-500 px-3 py-2 bg-white text-blue-700 font-inter"
              value={commune}
              onChange={e => setCommune(e.target.value)}
              disabled={!wilaya}
            >
              <option value="">Select Commune</option>
              {communes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-2">
              {deliveryTypes.map(dt => (
                <Button
                  key={dt.value}
                  type="button"
                  className={`flex-1 rounded-full font-inter ${deliveryType === dt.value ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"}`}
                  onClick={() => setDeliveryType(dt.value)}
                >
                  {dt.label}
                </Button>
              ))}
            </div>
            {deliveryType === "station" ? (
              <select
                required
                className="rounded-lg border-blue-300 focus:border-blue-500 px-3 py-2 bg-white text-blue-700 font-inter"
                value={station}
                onChange={e => setStation(e.target.value)}
              >
                <option value="">Select Station</option>
                {stations.filter(s => s.station_name.includes(wilaya)).map(s => (
                  <option key={s.station_code} value={s.station_name}>{s.station_name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="Delivery Address"
                className="rounded-lg border-blue-300 focus:border-blue-500 px-3 py-2 bg-white text-blue-700 font-inter"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            )}
            <div className="text-center text-blue-700 font-semibold mt-2">
              Delivery Fee: {deliveryFee} DZD
            </div>
            <div className="text-center text-blue-700 font-semibold">
              Total Price: {totalPrice} DZD
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold py-2 mt-2 shadow-md hover:from-blue-600 hover:to-sky-700 hover:scale-105 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Sending..." : "Place Order"}
            </Button>
            <Button
              type="button"
              className="w-full rounded-full bg-white text-blue-600 border border-blue-300 mt-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
