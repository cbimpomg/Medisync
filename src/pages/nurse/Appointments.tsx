import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, CheckCircle2, XCircle } from 'lucide-react';
import { appointmentService } from '@/lib/services/appointmentService';
import { Appointment as AppointmentType } from '@/lib/firebase';
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExtendedAppointment extends AppointmentType {
  id: string;
  patientName: string;
  doctorName: string;
  room?: string;
  duration?: string;
}

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
  const [appointments, setAppointments] = useState<ExtendedAppointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      // Subscribe to appointments updates
      const unsubscribe = appointmentService.subscribeToAppointments('nurse', undefined, (updatedAppointments) => {
        setAppointments(updatedAppointments);
        setIsLoading(false);
      });

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    } catch (err) {
      console.error('Error subscribing to appointments:', err);
      setError('Failed to load appointments. Please try again later.');
      setIsLoading(false);
    }
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <NurseSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <NurseSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

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
                                    {appointment.type} • Room {appointment.room || 'TBD'}
                                  </p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(appointment.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Clock className="h-4 w-4" />
                                      {appointment.time} ({appointment.duration || '30 min'})
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