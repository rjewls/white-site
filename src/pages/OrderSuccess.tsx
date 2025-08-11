import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

const OrderSuccess = () => {
  const location = useLocation() as { state?: { orderId?: string | number; productTitle?: string; quantity?: number; name?: string } };
  const navigate = useNavigate();

  // If navigated directly without state, just show generic message
  const { orderId, productTitle, quantity, name } = location.state || {};

  useEffect(() => {
    // Optional: could fetch order details using orderId if needed
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Card className="bg-white/90 border border-white/40 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-700">
              Order placed successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {name && (
              <p className="text-gray-700">
                Thank you, <span className="font-semibold">{name}</span>.
              </p>
            )}
            <p className="text-gray-700">
              We received your order{productTitle ? ` for "${productTitle}"` : ''}{quantity ? ` (x${quantity})` : ''}.
              Our team will contact you shortly to confirm the details.
            </p>
            {orderId && (
              <p className="text-sm text-gray-500">Reference: #{orderId}</p>
            )}
            <div className="pt-4 flex gap-3 justify-center">
              <Button onClick={() => navigate('/')}>Back to Home</Button>
              <Button variant="outline" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccess;
