import { useState, useEffect } from 'react';
import { Search, Plus, DollarSign, CreditCard, Receipt, FileText, MoreHorizontal, Download } from 'lucide-react';
import { billingService, PaymentMethod, PaymentStatus } from '@/lib/services/billingService';
import { patientService, Patient } from '@/lib/services/patientService';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, collections } from '@/lib/firebase';
import AdminSidebar from '@/components/layout/AdminSidebar';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const AdminBilling = () => {
  const [billingData, setBillingData] = useState([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [records, patientList] = await Promise.all([
          billingService.getAllBillingRecords(),
          patientService.getAllPatients()
        ]);
        setBillingData(records);
        setPatients(patientList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    // Subscribe to real-time updates
    const billingRef = collection(db, collections.billing);
    const unsubscribe = onSnapshot(billingRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          setBillingData(prevData => {
            const updatedData = [...prevData];
            const index = updatedData.findIndex(bill => bill.id === change.doc.id);
            if (index !== -1) {
              updatedData[index] = { id: change.doc.id, ...change.doc.data() };
            }
            return updatedData;
          });
        }
      });
    }, (error) => {
      console.error('Error in real-time update:', error);
    });

    return () => unsubscribe();
  }, []);

  const filteredBilling = billingData.filter(bill => {
    const matchesSearch = 
      bill.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesService = serviceFilter === 'all' || bill.service.toLowerCase() === serviceFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusColor = (status: string) => {
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

  const totalRevenue = billingData.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = billingData
    .filter(bill => bill.status === 'Pending')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const overdueAmount = billingData
    .filter(bill => bill.status === 'Overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Billing Management</h1>
              <p className="text-gray-600">Manage invoices and payments</p>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient">Patient</Label>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="service">Service</Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="lab-tests">Lab Tests</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="insurance">Insurance Provider</Label>
                    <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue-cross">Blue Cross</SelectItem>
                        <SelectItem value="aetna">Aetna</SelectItem>
                        <SelectItem value="united">United</SelectItem>
                        <SelectItem value="none">No Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={async () => {
                      try {
                        const selectedPatientData = patients.find(p => p.id === selectedPatient);
                        if (!selectedPatient || !selectedService || !amount || !dueDate || !selectedInsurance) {
                          toast({
                            title: "Error",
                            description: "Please fill in all required fields",
                            variant: "destructive"
                          });
                          return;
                        }

                        const parsedAmount = parseFloat(amount);
                        if (isNaN(parsedAmount) || parsedAmount <= 0) {
                          toast({
                            title: "Error",
                            description: "Please enter a valid amount",
                            variant: "destructive"
                          });
                          return;
                        }

                        const newBillingData = {
                          patientId: selectedPatient,
                          patientName: selectedPatientData?.name || '',
                          treatmentId: Date.now().toString(),
                          treatmentType: selectedService,
                          doctorId: 'currentDoctorId',
                          doctorName: 'currentDoctorName',
                          date: new Date().toISOString(),
                          dueDate: dueDate,
                          amount: parsedAmount,
                          status: PaymentStatus.PENDING,
                          paymentMethod: 'Credit Card' as PaymentMethod,
                          insuranceProvider: selectedInsurance
                        };
                        await billingService.createBillingRecord(newBillingData);
                        const updatedRecords = await billingService.getAllBillingRecords();
                        setBillingData(updatedRecords);
                        setOpen(false);
                        setSelectedPatient('');
                        setSelectedService('');
                        setAmount('');
                        setDueDate('');
                        setSelectedInsurance('');
                      } catch (error) {
                        console.error('Error creating billing record:', error);
                      }
                    }}>Create Invoice</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₵{totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₵{pendingAmount.toFixed(2)}</div>
                <p className="text-xs text-gray-500">To be collected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Receipt className="h-4 w-4 mr-2" />
                  Overdue Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">₵{overdueAmount.toFixed(2)}</div>
                <p className="text-xs text-gray-500">Past due date</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Total Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{billingData.length}</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="flex gap-4">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search invoices..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="lab tests">Lab Tests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Patient</TableHead>
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
                        <TableCell>
                          <div className="font-medium">{bill.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {bill.patientId}</div>
                        </TableCell>
                        <TableCell>{bill.treatmentType}</TableCell>
                        <TableCell>₵{bill.amount.toFixed(2)}</TableCell>
                        <TableCell>{bill.dueDate}</TableCell>
                        <TableCell>{bill.insuranceProvider}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={async () => {
                                try {
                                  await billingService.processPayment(bill.id, 'Credit Card');
                                  const updatedRecords = await billingService.getAllBillingRecords();
                                  setBillingData(updatedRecords);
                                  toast({
                                    title: "Payment Processed",
                                    description: "Payment has been recorded successfully.",
                                    variant: "default"
                                  });
                                } catch (error) {
                                  console.error('Error processing payment:', error);
                                  toast({
                                    title: "Payment Failed",
                                    description: "There was an error processing the payment. Please try again.",
                                    variant: "destructive"
                                  });
                                }
                              }}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Record Payment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

export default AdminBilling;