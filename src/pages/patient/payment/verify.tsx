import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { paystackService } from '@/lib/services/paystackService';
import { pharmacyApi } from '@/lib/api/index';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Truck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const PaymentVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    orderNumber: string;
    estimatedDelivery: Date;
  } | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = localStorage.getItem('paymentReference');
        if (!reference) {
          throw new Error('Payment reference not found');
        }

        const response = await paystackService.verifyTransaction(reference);

        if (response.status && response.data.status === 'success') {
          const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          const total = parseFloat(localStorage.getItem('orderTotal') || '0');

          // Create order in pharmacy system
          await pharmacyApi.createOrder({
            medications: cartItems.map(item => ({
              medicationId: item.medicationId,
              quantity: item.quantity
            })),
            paymentMethod: 'paystack',
            paymentDetails: {
              reference,
              status: 'completed',
              amount: total
            }
          });

          const orderDetails = {
            items: cartItems,
            total,
            orderNumber: reference,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          };
          
          setOrderDetails(orderDetails);
          setStatus('success');
          toast({
            title: 'Payment Successful',
            description: 'Your order has been confirmed and is being processed.',
          });

          // Clear the payment reference and cart data
          localStorage.removeItem('paymentReference');
          localStorage.removeItem('cartItems');
          localStorage.removeItem('orderTotal');
        } else {
          throw new Error('Payment verification failed');
        }
      } catch (error) {
        setStatus('failed');
        toast({
          title: 'Payment Verification Failed',
          description: error instanceof Error ? error.message : 'There was an error verifying your payment.',
          variant: 'destructive',
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [navigate, toast]);

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="p-6 w-full max-w-md text-center">
        {verifying ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <h2 className="text-xl font-semibold">Verifying Payment</h2>
            <p className="text-muted-foreground">Please wait while we verify your payment...</p>
          </div>
        ) : status === 'success' && orderDetails ? (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-semibold">Order Confirmed!</h2>
            </div>

            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Order #{orderDetails.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">
                  Estimated Delivery: {format(orderDetails.estimatedDelivery, 'MMMM dd, yyyy')}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Order Status</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <span>Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span>Packaging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-gray-400" />
                    <span>Delivery</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Order Details</h3>
                <div className="space-y-2">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₵{orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/patient/pharmacy')}
                className="w-full mt-4"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Payment Failed</h2>
            <p className="text-muted-foreground">There was an error processing your payment.</p>
            <Button
              onClick={() => navigate('/patient/checkout')}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentVerification;