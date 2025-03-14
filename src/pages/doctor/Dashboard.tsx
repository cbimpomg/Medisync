
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Calendar, Clock, Users, Pill, Activity, MessageSquare, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for appointments
const mockAppointments = [
  { id: 1, patient: "Ransford Agyei", time: "9:00 AM", type: "General Checkup", status: "Checked In" },
  { id: 2, patient: "Emma Johnson", time: "10:30 AM", type: "Follow-up", status: "Scheduled" },
  { id: 3, patient: "Michael Chen", time: "11:45 AM", type: "New Patient", status: "Scheduled" },
  { id: 4, patient: "Sophia Rodriguez", time: "2:15 PM", type: "Consultation", status: "Cancelled" },
  { id: 5, patient: "Noah Williams", time: "3:30 PM", type: "Follow-up", status: "Scheduled" }
];

const DoctorDashboard = () => {
  // Mock user data for now
  const mockUser = {
    name: 'Dr. Smith',
    id: '123'
  };
  const [date, setDate] = useState(new Date());
  
  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {mockUser.name}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Today's Patients" 
              value="12" 
              icon={<Users className="h-8 w-8 text-medisync-primary" />} 
            />
            <StatsCard 
              title="Pending Reports" 
              value="7" 
              icon={<ClipboardList className="h-8 w-8 text-medisync-primary" />} 
            />
            <StatsCard 
              title="Prescriptions" 
              value="15" 
              icon={<Pill className="h-8 w-8 text-medisync-primary" />} 
            />
            <StatsCard 
              title="New Messages" 
              value="3" 
              icon={<MessageSquare className="h-8 w-8 text-medisync-primary" />} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Today's Appointments</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardDescription>
                  </div>
                  <Button className="bg-medisync-primary hover:bg-medisync-secondary">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Calendar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAppointments.map((appointment) => (
                      <div 
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{appointment.patient.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patient}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {appointment.time} - {appointment.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Your recent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Patient Consultation Completed</p>
                      <p className="text-sm text-gray-500">30 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Pill className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Prescription Updated</p>
                      <p className="text-sm text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Message Received</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, icon }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="bg-medisync-primary bg-opacity-10 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'checked in':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default DoctorDashboard;
