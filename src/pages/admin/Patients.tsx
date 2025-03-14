import { useState } from 'react';
import { Search, Plus, FileEdit, Trash2, MoreHorizontal } from 'lucide-react';
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

// Mock patients data
const patientsData = [
  {
    id: "P001",
    name: "Ransford Agyei",
    email: "ransford@example.com",
    phone: "+1 234-567-8901",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    address: "123 Main St, City",
    registrationDate: "2024-01-15",
    status: "Active",
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC123456789"
  },
  {
    id: "P002",
    name: "Emma Johnson",
    email: "emma@example.com",
    phone: "+1 234-567-8902",
    dateOfBirth: "1985-08-22",
    gender: "Female",
    address: "456 Oak Ave, Town",
    registrationDate: "2024-02-01",
    status: "Active",
    insuranceProvider: "Aetna",
    insuranceNumber: "AE987654321"
  },
  {
    id: "P003",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1 234-567-8903",
    dateOfBirth: "1978-11-30",
    gender: "Male",
    address: "789 Pine Rd, Village",
    registrationDate: "2024-02-15",
    status: "Inactive",
    insuranceProvider: "United",
    insuranceNumber: "UN456789123"
  }
];

const AdminPatients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPatients = patientsData.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patients Management</h1>
              <p className="text-gray-600">View and manage patient records</p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter patient's full name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter full address" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Input id="insuranceProvider" placeholder="Enter insurance provider" />
                    </div>
                    <div>
                      <Label htmlFor="insuranceNumber">Insurance Number</Label>
                      <Input id="insuranceNumber" placeholder="Enter insurance number" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Add Patient</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patientsData.length}</div>
                <p className="text-xs text-gray-500">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patientsData.filter(p => p.status === 'Active').length}
                </div>
                <p className="text-xs text-gray-500">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500">New registrations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Insurance Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95%</div>
                <p className="text-xs text-gray-500">Patients with insurance</p>
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
                      placeholder="Search patients..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.dateOfBirth}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{patient.email}</div>
                          <div className="text-sm text-gray-500">{patient.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{patient.insuranceProvider}</div>
                          <div className="text-sm text-gray-500">{patient.insuranceNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{patient.registrationDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileEdit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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

export default AdminPatients; 