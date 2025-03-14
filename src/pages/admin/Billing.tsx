import { useState } from 'react';
import { Search, Plus, DollarSign, CreditCard, Receipt, FileText, MoreHorizontal, Download } from 'lucide-react';
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

// Mock billing data
const billingData = [
  {
    id: "INV001",
    patientName: "Ransford Agyei",
    patientId: "P001",
    date: "2024-03-15",
    dueDate: "2024-04-15",
    amount: 1250.00,
    status: "Paid",
    paymentMethod: "Credit Card",
    service: "Consultation",
    insurance: "Blue Cross"
  },
  {
    id: "INV002",
    patientName: "Emma Johnson",
    patientId: "P002",
    date: "2024-03-16",
    dueDate: "2024-04-16",
    amount: 2500.00,
    status: "Pending",
    paymentMethod: "Insurance",
    service: "Surgery",
    insurance: "Aetna"
  },
  {
    id: "INV003",
    patientName: "Michael Chen",
    patientId: "P003",
    date: "2024-03-17",
    dueDate: "2024-04-17",
    amount: 750.00,
    status: "Overdue",
    paymentMethod: "Cash",
    service: "Lab Tests",
    insurance: "United"
  }
];

const AdminBilling = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

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
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Billing Management</h1>
              <p className="text-gray-600">Manage invoices and payments</p>
            </div>

            <Dialog>
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
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {billingData.map(bill => (
                            <SelectItem key={bill.patientId} value={bill.patientId}>
                              {bill.patientName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="service">Service</Label>
                      <Select>
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
                      <Input id="amount" type="number" placeholder="Enter amount" />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="date" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="insurance">Insurance Provider</Label>
                    <Select>
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
                    <Button>Create Invoice</Button>
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
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
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
                <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
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
                <div className="text-2xl font-bold text-red-600">${overdueAmount.toFixed(2)}</div>
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
              <div className="flex justify-between items-center p-4 border-b">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Insurance</TableHead>
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
                      <TableCell>{bill.service}</TableCell>
                      <TableCell>${bill.amount.toFixed(2)}</TableCell>
                      <TableCell>{bill.dueDate}</TableCell>
                      <TableCell>{bill.insurance}</TableCell>
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
                            <DropdownMenuItem>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling; 