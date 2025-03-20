import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { pharmacyApi } from '@/lib/api/index';
import { paystackService } from '@/lib/services/paystackService';
import { useAuth } from '@/hooks/useAuth';

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

interface CheckoutProps {
  cartItems: Array<{
    medicationId: string;
    quantity: number;
    name: string;
    price: number;
  }>;
  prescriptionId?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems: propCartItems, prescriptionId }) => {
  const location = useLocation();
  const cartItems = location?.state?.cartItems || propCartItems || [];
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!user?.email) {
        throw new Error('User email is required for payment');
      }

      // Initialize Paystack transaction
      const amountInPesewas = Math.round(total * 100); // Convert to pesewas (Ghanaian currency)
      const reference = `ORDER_${Date.now()}`;
      
      const paystackResponse = await paystackService.initializeTransaction({
        reference,
        amount: amountInPesewas,
        email: user.email,
        currency: 'GHS',
        callback_url: `${window.location.origin}/patient/payment/verify`,
        metadata: {
          prescriptionId,
          cartItems: cartItems.map(item => ({
            medicationId: item.medicationId,
            quantity: item.quantity
          }))
        }
      });

      if (paystackResponse.status && paystackResponse.data.authorization_url) {
        // Store reference and order details for verification
        localStorage.setItem('paymentReference', reference);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('orderTotal', total.toString());
        setPaymentReference(reference);
        
        // Redirect to Paystack payment page
        window.location.href = paystackResponse.data.authorization_url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error: Error | unknown) {
      toast({
        title: 'Payment initialization failed',
        description: error instanceof Error ? error.message : 'There was an error initializing your payment. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.medicationId} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₵{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="mb-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paystack" id="paystack" />
                  <Label htmlFor="paystack">Pay with Paystack</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={paymentDetails.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={16}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={paymentDetails.expiryDate}
                        onChange={handleInputChange}
                        required
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handleInputChange}
                        required
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay ₵${total.toFixed(2)}`}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;