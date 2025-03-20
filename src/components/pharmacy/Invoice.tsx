import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Printer } from 'lucide-react';

interface InvoiceProps {
  orderDetails: {
    reference: string;
    date: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    paymentStatus: 'success' | 'pending' | 'failed';
    deliveryStatus?: 'processing' | 'shipped' | 'delivered';
    trackingNumber?: string;
  };
  onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ orderDetails, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Order Invoice</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="print:hidden"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="print:hidden"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Order Reference</h3>
              <p className="text-sm text-gray-500">{orderDetails.reference}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold">Date</h3>
              <p className="text-sm text-gray-500">{orderDetails.date}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Item</th>
                  <th className="pb-2 text-center">Quantity</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orderDetails.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">₵{item.price.toFixed(2)}</td>
                    <td className="py-2 text-right">₵{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-4 text-right font-semibold">Total</td>
                  <td className="pt-4 text-right font-semibold">₵{orderDetails.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <h3 className="font-semibold">Payment Status</h3>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                orderDetails.paymentStatus === 'success' ? 'bg-green-100 text-green-800' :
                orderDetails.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}
              </div>
            </div>

            {orderDetails.deliveryStatus && (
              <div className="text-right">
                <h3 className="font-semibold">Delivery Status</h3>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">{orderDetails.deliveryStatus.charAt(0).toUpperCase() + orderDetails.deliveryStatus.slice(1)}</span>
                </div>
                {orderDetails.trackingNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    Tracking: {orderDetails.trackingNumber}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Invoice;