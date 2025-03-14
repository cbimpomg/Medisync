import { useState } from 'react';
import { Search, Calendar, Clock, User, CheckCircle2, XCircle } from 'lucide-react';
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock appointments data
const appointments = [
  {
    id: "APT001",
    patientName: "Ransford Agyei",
    patientId: "P001",
    type: "Routine Checkup",
    date: "2024-03-20",
    time: "09:00 AM",
    duration: "30 minutes",
    status: "Confirmed",
    room: "203",
    notes: "Regular vital signs check"
  },
  {
    id: "APT002",
    patientName: "Emma Johnson",
    patientId: "P002",
    type: "Medication Administration",
    date: "2024-03-20",
    time: "10:30 AM",
    duration: "15 minutes",
    status: "In Progress",
    room: "205",
    notes: "Antibiotic administration"
  },
  {
    id: "APT003",
    patientName: "Michael Chen",
    patientId: "P003",
    type: "Wound Dressing",
    date: "2024-03-20",
    time: "11:45 AM",
    duration: "45 minutes",
    status: "Pending",
    room: "210",
    notes: "Post-surgical wound care"
  }
];

const appointmentTypes = [
  "All Types",
  "Routine Checkup",
  "Medication Administration",
  "Wound Dressing",
  "Vital Signs",
  "Blood Draw",
  "Physical Therapy"
];

const NurseAppointments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All Types' || appointment.type === typeFilter;
    const matchesTab = selectedTab === 'all' || appointment.status.toLowerCase() === selectedTab.toLowerCase();
    return matchesSearch && matchesType && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <NurseSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
              <p className="text-gray-600">Manage patient appointments and schedules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters and Stats */}
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
                        placeholder="Search appointments..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600">Scheduled</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {appointments.length}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-600">Completed</p>
                      <p className="text-2xl font-bold text-green-700">
                        {appointments.filter(a => a.status === 'Completed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointments List */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="all" onValueChange={setSelectedTab}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                      <TabsTrigger value="in progress">In Progress</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>

                    <div className="mt-6 space-y-4">
                      {filteredAppointments.map((appointment) => (
                        <Card key={appointment.id} className="hover:bg-gray-50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{appointment.patientName}</h3>
                                    <Badge className={getStatusColor(appointment.status)}>
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {appointment.type} • Room {appointment.room}
                                  </p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Calendar className="h-4 w-4" />
                                      {appointment.date}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Clock className="h-4 w-4" />
                                      {appointment.time} ({appointment.duration})
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Complete
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <XCircle className="h-4 w-4" />
                                  Cancel
                                </Button>
                              </div>
                            </div>

                            {appointment.notes && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Notes:</span> {appointment.notes}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseAppointments; 