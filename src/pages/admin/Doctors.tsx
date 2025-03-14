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
import { Textarea } from "@/components/ui/textarea";

// Mock doctors data
const doctorsData = [
  {
    id: "D001",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 234-567-8901",
    specialization: "Cardiology",
    experience: "15 years",
    status: "Active",
    joinDate: "2020-01-15",
    schedule: "Mon-Fri",
    patients: 120,
    rating: 4.8,
    qualifications: "MD, FACC",
    licenseNumber: "MED123456"
  },
  {
    id: "D002",
    name: "Dr. Michael Chang",
    email: "michael.chang@example.com",
    phone: "+1 234-567-8902",
    specialization: "Orthopedics",
    experience: "12 years",
    status: "Active",
    joinDate: "2021-03-01",
    schedule: "Mon-Thu",
    patients: 95,
    rating: 4.7,
    qualifications: "MD, FAAOS",
    licenseNumber: "MED789012"
  },
  {
    id: "D003",
    name: "Dr. Lisa Brown",
    email: "lisa.brown@example.com",
    phone: "+1 234-567-8903",
    specialization: "Pediatrics",
    experience: "8 years",
    status: "On Leave",
    joinDate: "2022-06-15",
    schedule: "Tue-Sat",
    patients: 150,
    rating: 4.9,
    qualifications: "MD, FAAP",
    licenseNumber: "MED345678"
  }
];

const AdminDoctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doctor.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSpecialization = specializationFilter === 'all' || doctor.specialization.toLowerCase() === specializationFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
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
              <h1 className="text-2xl font-bold text-gray-800">Doctors Management</h1>
              <p className="text-gray-600">View and manage healthcare providers</p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Doctor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Doctor</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter doctor's full name" />
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
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input id="licenseNumber" placeholder="Enter medical license number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="dermatology">Dermatology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <Input id="experience" placeholder="Years of experience" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="qualifications">Qualifications</Label>
                    <Input id="qualifications" placeholder="Enter qualifications (e.g., MD, FACC)" />
                  </div>

                  <div>
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input id="schedule" placeholder="Working days and hours" />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add any additional information"
                      className="h-20"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Add Doctor</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doctorsData.length}</div>
                <p className="text-xs text-gray-500">+1 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {doctorsData.filter(d => d.status === 'Active').length}
                </div>
                <p className="text-xs text-gray-500">Currently practicing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {doctorsData.reduce((sum, doc) => sum + doc.patients, 0)}
                </div>
                <p className="text-xs text-gray-500">Under care</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(doctorsData.reduce((sum, doc) => sum + doc.rating, 0) / doctorsData.length).toFixed(1)}
                </div>
                <p className="text-xs text-gray-500">Out of 5.0</p>
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
                      placeholder="Search doctors..." 
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
                      <SelectItem value="on leave">On Leave</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.qualifications}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{doctor.specialization}</div>
                          <div className="text-sm text-gray-500">{doctor.experience}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{doctor.email}</div>
                          <div className="text-sm text-gray-500">{doctor.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doctor.status)}>
                          {doctor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{doctor.patients}</TableCell>
                      <TableCell>{doctor.rating}</TableCell>
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

export default AdminDoctors; 