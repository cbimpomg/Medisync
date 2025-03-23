import { useState, useEffect } from 'react';
import { Search, Download, CreditCard, Receipt } from 'lucide-react';
import { billingService } from '@/lib/services/billingService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PatientSidebar from '@/components/layout/PatientSidebar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/lib/services/billingService';
import { Select, SelectTrigger } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const PatientBilling = () => {
  const { user } = useAuth();
  const [billingData, setBillingData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('Credit Card');

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setIsLoading(true);
        if (!user?.uid) {
          setError('User not authenticated');
          return;
        }
        const records = await billingService.getPatientBillingRecords(user.uid);
        setBillingData(records);
        setError(null);
      } catch (error) {
        console.error('Error fetching billing records:', error);
        setError('Failed to load billing records');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBillingData();
  }, [user?.uid]);

  const filteredBilling = billingData.filter(bill =>
    bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.treatmentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <PatientSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Invoices</h1>
            <p className="text-gray-600">View and manage your billing history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Receipt className="h-4 w-4 mr-2" />
                Total Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₵{billingData
                  .filter(bill => bill.status === 'Pending')
                  .reduce((sum, bill) => sum + bill.amount, 0)
                  .toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">Outstanding balance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Last Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₵{billingData
                  .filter(bill => bill.status === 'Paid')
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.amount.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-gray-500">Most recent payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Receipt className="h-4 w-4 mr-2" />
                Total Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billingData.length}</div>
              <p className="text-xs text-gray-500">All time</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search invoices..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBilling.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.id}</TableCell>
                      <TableCell>{bill.treatmentType}</TableCell>
                      <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                      <TableCell>₵{bill.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Invoice Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Invoice ID</p>
                                  <p className="text-sm text-gray-500">{bill.id}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Date</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(bill.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Service</p>
                                <p className="text-sm text-gray-500">{bill.treatmentType}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Amount</p>
                                  <p className="text-sm text-gray-500">₵{bill.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Status</p>
                                  <Badge className={getStatusColor(bill.status)}>
                                    {bill.status}
                                  </Badge>
                                </div>
                              </div>
                              {bill.status === 'Pending' && (
                                <>
                                  <Select value={selectedPaymentMethod} onValueChange={(value: string) => setSelectedPaymentMethod(value as PaymentMethod)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                                      <SelectItem value="Insurance">Insurance</SelectItem>
                                      <SelectItem value="Cash">Cash</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button 
                                    className="w-full" 
                                    disabled={isProcessingPayment}
                                    onClick={async () => {
                                      setIsProcessingPayment(true);
                                      try {
                                        await billingService.processPayment(bill.id, selectedPaymentMethod);
                                        const updatedRecords = await billingService.getPatientBillingRecords(user.uid);
                                        setBillingData(updatedRecords);
                                        toast({
                                          title: "Payment Successful",
                                          description: "Your payment has been processed successfully.",
                                          variant: "default"
                                        });
                                      } catch (error) {
                                        console.error('Payment processing error:', error);
                                        toast({
                                          title: "Payment Failed",
                                          description: "There was an error processing your payment. Please try again.",
                                          variant: "destructive"
                                        });
                                      } finally {
                                        setIsProcessingPayment(false);
                                      }
                                    }}>
                                    Pay Now
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                // Implement download logic
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientBilling;