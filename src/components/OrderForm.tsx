import React, { useState, useMemo } from "react";
import { wilayasData, communesData } from "@/lib/locations";
import { stations } from "@/lib/stations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

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

const webhookUrl = "https://discord.com/api/webhooks/1398783921738481745/Bg0f-Qp7ePQxfORlP4SZ5So5C7xxRtmTOWOmEXQmMpdvnTqy9CVxg8Sbn4LcpPYN4EBD";

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
    // ...
  }, [wilaya]);

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
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
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
      <Card className="w-full max-w-md rounded-2xl shadow-lg bg-pink-50 border-2 border-pink-200">
        <CardContent className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-playfair font-bold text-pink-700 mb-2 text-center">Order: {productTitle}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              required
              placeholder="Your Name"
              className="rounded-lg border-pink-300 focus:border-pink-500 px-3 py-2 bg-white text-pink-700 font-inter"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="tel"
              required
              placeholder="Phone Number"
              className="rounded-lg border-pink-300 focus:border-pink-500 px-3 py-2 bg-white text-pink-700 font-inter"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <select
              required
              className="rounded-lg border-pink-300 focus:border-pink-500 px-3 py-2 bg-white text-pink-700 font-inter"
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
              className="rounded-lg border-pink-300 focus:border-pink-500 px-3 py-2 bg-white text-pink-700 font-inter"
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
                  className={`flex-1 rounded-full font-inter ${deliveryType === dt.value ? "bg-pink-400 text-white" : "bg-pink-100 text-pink-700"}`}
                  onClick={() => setDeliveryType(dt.value)}
                >
                  {dt.label}
                </Button>
              ))}
            </div>
            {deliveryType === "station" ? (
              <select
                required
                className="rounded-lg border-pink-300 focus:border-pink-500 px-3 py-2 bg-white text-pink-700 font-inter"
                value={station}
                onChange={e => setStation(e.target.value)}
              >
                <option value="">Select Station</option>
                {wilayaStations.map(s => (
                  <option key={s.station_code} value={s.station_name}>{s.station_name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="Delivery Address"
                className="rounded-lg border-pink-300 focus:border-pink-500 px-3 py-2 bg-white text-pink-700 font-inter"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            )}
            <div className="text-center text-pink-700 font-semibold mt-2">
              Delivery Fee: {getDeliveryFee()} DZD
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold py-2 mt-2 shadow-md hover:scale-105 transition-transform"
              disabled={loading}
            >
              {loading ? "Sending..." : "Place Order"}
            </Button>
            <Button
              type="button"
              className="w-full rounded-full bg-white text-pink-600 border border-pink-300 mt-1"
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
