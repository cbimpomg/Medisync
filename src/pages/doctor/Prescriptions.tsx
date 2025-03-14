import { useState } from 'react';
import { Search, Plus, FileText, Pill, Calendar, MoreHorizontal } from 'lucide-react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Mock prescriptions data
const prescriptionsData = [
  {
    id: "PRE001",
    patientName: "Ransford Agyei",
    patientId: "P001",
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times daily",
    duration: "7 days",
    status: "Active",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    notes: "Take with food"
  },
  {
    id: "PRE002",
    patientName: "Emma Johnson",
    patientId: "P002",
    medication: "Metformin",
    dosage: "1000mg",
    frequency: "2 times daily",
    duration: "30 days",
    status: "Active",
    startDate: "2024-03-10",
    endDate: "2024-04-09",
    notes: "Take with meals"
  },
  {
    id: "PRE003",
    patientName: "Michael Chen",
    patientId: "P003",
    medication: "Ibuprofen",
    dosage: "400mg",
    frequency: "As needed",
    duration: "5 days",
    status: "Completed",
    startDate: "2024-03-01",
    endDate: "2024-03-06",
    notes: "For pain relief"
  }
];

const DoctorPrescriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPrescriptions = prescriptionsData.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
              <p className="text-gray-600">Manage patient prescriptions</p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Prescription</DialogTitle>
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
                          {prescriptionsData.map(prescription => (
                            <SelectItem key={prescription.patientId} value={prescription.patientId}>
                              {prescription.patientName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="medication">Medication</Label>
                      <Input id="medication" placeholder="Enter medication name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input id="dosage" placeholder="Enter dosage" />
                    </div>
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Input id="frequency" placeholder="Enter frequency" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (days)</Label>
                      <Input id="duration" type="number" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add any special instructions or notes"
                      className="h-20"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Prescription</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Pill className="h-4 w-4 mr-2" />
                  Active Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {prescriptionsData.filter(p => p.status === 'Active').length}
                </div>
                <p className="text-xs text-gray-500">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-gray-500">Within 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Total Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptionsData.length}</div>
                <p className="text-xs text-gray-500">All time</p>
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
                      placeholder="Search prescriptions..." 
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage & Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>{prescription.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{prescription.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {prescription.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{prescription.medication}</TableCell>
                      <TableCell>
                        <div>
                          <div>{prescription.dosage}</div>
                          <div className="text-sm text-gray-500">{prescription.frequency}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{prescription.startDate}</div>
                          <div className="text-sm text-gray-500">{prescription.duration}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status}
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
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Plus className="h-4 w-4 mr-2" />
                              Renew Prescription
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

export default DoctorPrescriptions; 