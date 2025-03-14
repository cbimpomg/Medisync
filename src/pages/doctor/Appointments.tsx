import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock appointment data
const appointments = [
  {
    id: 1,
    patientName: "Ransford Agyei",
    patientId: "P001",
    date: "2024-03-20",
    time: "09:00 AM",
    type: "General Checkup",
    status: "Scheduled",
    notes: "Regular health checkup"
  },
  {
    id: 2,
    patientName: "Emma Johnson",
    patientId: "P002",
    date: "2024-03-20",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Completed",
    notes: "Post-surgery follow-up"
  },
  {
    id: 3,
    patientName: "Michael Chen",
    patientId: "P003",
    date: "2024-03-20",
    time: "11:45 AM",
    type: "New Patient",
    status: "Cancelled",
    notes: "Initial consultation"
  }
];

const DoctorAppointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
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
              <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
              <p className="text-gray-600">Manage your patient appointments</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                onClick={() => setView('list')}
              >
                List View
              </Button>
              <Button
                variant={view === 'calendar' ? 'default' : 'outline'}
                onClick={() => setView('calendar')}
              >
                Calendar View
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {view === 'list' ? (
                    <div className="space-y-4">
                      {filteredAppointments.map((appointment) => (
                        <div 
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">{appointment.patientName.charAt(0)}</span>
                            </div>
                            <div>
                              <h3 className="font-medium">{appointment.patientName}</h3>
                              <p className="text-sm text-gray-500">Patient ID: {appointment.patientId}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Clock className="h-4 w-4" />
                                {appointment.time} - {appointment.type}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Calendar view coming soon...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments; 