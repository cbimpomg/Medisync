import { useState } from 'react';
import { Search, Filter, Plus, FileText, Calendar, MessageSquare } from 'lucide-react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock patient data
const patients = [
  {
    id: "P001",
    name: "Ransford Agyei",
    age: 35,
    gender: "Male",
    lastVisit: "2024-03-15",
    nextAppointment: "2024-03-22",
    condition: "Hypertension",
    status: "Active"
  },
  {
    id: "P002",
    name: "Emma Johnson",
    age: 28,
    gender: "Female",
    lastVisit: "2024-03-10",
    nextAppointment: "2024-04-05",
    condition: "Diabetes Type 2",
    status: "Active"
  },
  {
    id: "P003",
    name: "Michael Chen",
    age: 45,
    gender: "Male",
    lastVisit: "2024-02-28",
    nextAppointment: null,
    condition: "Arthritis",
    status: "Inactive"
  }
];

const DoctorPatients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
              <p className="text-gray-600">Manage and view patient information</p>
            </div>
            
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search patients..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredPatients.map((patient) => (
                      <div 
                        key={patient.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPatient === patient.id 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPatient(patient.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{patient.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{patient.name}</h3>
                            <p className="text-sm text-gray-500">ID: {patient.id}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedPatient ? (
                <Card>
                  <CardContent className="p-6">
                    {(() => {
                      const patient = patients.find(p => p.id === selectedPatient);
                      if (!patient) return null;

                      return (
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-xl">{patient.name.charAt(0)}</span>
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold">{patient.name}</h2>
                                <p className="text-gray-500">Patient ID: {patient.id}</p>
                              </div>
                            </div>
                            <Badge className={patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {patient.status}
                            </Badge>
                          </div>

                          <Tabs defaultValue="overview">
                            <TabsList>
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="medical-history">Medical History</TabsTrigger>
                              <TabsTrigger value="appointments">Appointments</TabsTrigger>
                              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h3 className="font-medium mb-4">Personal Information</h3>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-sm text-gray-500">Age</p>
                                      <p className="font-medium">{patient.age} years</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Gender</p>
                                      <p className="font-medium">{patient.gender}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Current Condition</p>
                                      <p className="font-medium">{patient.condition}</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-medium mb-4">Appointment Information</h3>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-sm text-gray-500">Last Visit</p>
                                      <p className="font-medium">{patient.lastVisit}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Next Appointment</p>
                                      <p className="font-medium">{patient.nextAppointment || 'Not scheduled'}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-3 mt-6">
                                <Button variant="outline" className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  View Medical Records
                                </Button>
                                <Button variant="outline" className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Schedule Appointment
                                </Button>
                                <Button variant="outline" className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  Send Message
                                </Button>
                              </div>
                            </TabsContent>

                            <TabsContent value="medical-history">
                              <div className="py-6">
                                <p className="text-gray-500">Medical history content coming soon...</p>
                              </div>
                            </TabsContent>

                            <TabsContent value="appointments">
                              <div className="py-6">
                                <p className="text-gray-500">Appointments history coming soon...</p>
                              </div>
                            </TabsContent>

                            <TabsContent value="prescriptions">
                              <div className="py-6">
                                <p className="text-gray-500">Prescriptions history coming soon...</p>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Select a patient to view their details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients; 