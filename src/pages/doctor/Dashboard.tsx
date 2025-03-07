
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Calendar, Clock, Users, Pill, Activity, MessageSquare } from 'lucide-react';
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
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  
  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Dr. Smith'}</p>
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
              icon={<ClipboardIcon className="h-8 w-8 text-medisync-primary" />} 
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
                      <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            appointment.status === "Checked In" 
                              ? "bg-green-100 text-green-800" 
                              : appointment.status === "Cancelled" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-blue-100 text-blue-800"
                          }`}>
                            {appointment.patient.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{appointment.patient}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time} - {appointment.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === "Checked In" 
                              ? "bg-green-100 text-green-800" 
                              : appointment.status === "Cancelled" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-blue-100 text-blue-800"
                          }`}>
                            {appointment.status}
                          </span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Activity</CardTitle>
                <CardDescription>Updates from your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem 
                    description="Emma Johnson updated her symptoms"
                    time="10 min ago"
                    icon={<Activity className="h-4 w-4 text-medisync-primary" />}
                  />
                  <ActivityItem 
                    description="Lab results for Michael Chen are ready"
                    time="45 min ago"
                    icon={<ClipboardIcon className="h-4 w-4 text-medisync-primary" />}
                  />
                  <ActivityItem 
                    description="New message from Sophia Rodriguez"
                    time="1 hour ago"
                    icon={<MessageSquare className="h-4 w-4 text-medisync-primary" />}
                  />
                  <ActivityItem 
                    description="Prescription refill requested by Noah Williams"
                    time="3 hours ago"
                    icon={<Pill className="h-4 w-4 text-medisync-primary" />}
                  />
                  <ActivityItem 
                    description="Appointment rescheduled by Ransford Agyei"
                    time="Yesterday"
                    icon={<Calendar className="h-4 w-4 text-medisync-primary" />}
                  />
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

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="14" height="14" x="5" y="5" rx="2" />
    <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
    <path d="M8 10h8" />
    <path d="M8 14h4" />
  </svg>
);

interface ActivityItemProps {
  description: string;
  time: string;
  icon: React.ReactNode;
}

const ActivityItem = ({ description, time, icon }: ActivityItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-medisync-primary bg-opacity-10 p-2 rounded-full mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-700">{description}</p>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    </div>
  );
};

export default DoctorDashboard;
