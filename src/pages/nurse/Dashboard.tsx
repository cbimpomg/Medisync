
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Calendar, Users, ClipboardList, Clock, Heart, Pill, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data
const mockTasks = [
  { id: 1, task: "Check vitals for Room 204", priority: "High", time: "9:15 AM", status: "Pending" },
  { id: 2, task: "Medication round", priority: "High", time: "10:00 AM", status: "Pending" },
  { id: 3, task: "Assist Dr. Smith with patient examination", priority: "Medium", time: "11:30 AM", status: "Pending" },
  { id: 4, task: "Update patient charts", priority: "Medium", time: "1:00 PM", status: "Pending" },
  { id: 5, task: "Prepare IV for Room 210", priority: "High", time: "2:15 PM", status: "Pending" }
];

const mockPatients = [
  { id: 1, name: "John Doe", room: "201", status: "Stable", lastChecked: "45 min ago" },
  { id: 2, name: "Sarah Johnson", room: "204", status: "Needs Attention", lastChecked: "10 min ago" },
  { id: 3, name: "Michael Brown", room: "205", status: "Stable", lastChecked: "1 hour ago" },
  { id: 4, name: "Emma Davis", room: "210", status: "Critical", lastChecked: "5 min ago" }
];

const NurseDashboard = () => {
  // Use authenticated user data instead of mock data
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <NurseSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Nurse Dashboard</h1>
            <p className="text-gray-600">Hi, {user?.displayName}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Assigned Patients" 
              value="8" 
              icon={<Users className="h-8 w-8 text-medisync-primary" />} 
            />
            <StatsCard 
              title="Tasks Today" 
              value="15" 
              icon={<ClipboardList className="h-8 w-8 text-medisync-primary" />} 
            />
            <StatsCard 
              title="Upcoming Medications" 
              value="12" 
              icon={<Pill className="h-8 w-8 text-medisync-primary" />} 
            />
            <StatsCard 
              title="Alerts" 
              value="2" 
              icon={<Bell className="h-8 w-8 text-medisync-primary" />} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Today's Tasks</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardDescription>
                  </div>
                  <Button className="bg-medisync-primary hover:bg-medisync-secondary">
                    <Clock className="mr-2 h-4 w-4" />
                    View All Tasks
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`min-w-9 h-9 rounded-full flex items-center justify-center ${
                            task.priority === "High" 
                              ? "bg-red-100 text-red-800" 
                              : task.priority === "Medium" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-green-100 text-green-800"
                          }`}>
                            <ClipboardList className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{task.task}</h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.time} - Priority: {task.priority}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Complete
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
                <CardTitle>Patient Status</CardTitle>
                <CardDescription>Assigned patients overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatients.map((patient) => (
                    <div key={patient.id} className="flex items-start gap-3 p-2 border-b last:border-0">
                      <div className={`min-w-9 h-9 rounded-full flex items-center justify-center mt-1 ${
                        patient.status === "Critical" 
                          ? "bg-red-100 text-red-800" 
                          : patient.status === "Needs Attention" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                      }`}>
                        <Heart className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{patient.name}</h4>
                          <span className="text-xs font-medium rounded-full px-2 py-1 bg-gray-100">
                            Room {patient.room}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className={`text-xs ${
                            patient.status === "Critical" 
                              ? "text-red-600" 
                              : patient.status === "Needs Attention" 
                                ? "text-yellow-600" 
                                : "text-green-600"
                          }`}>
                            {patient.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Last checked: {patient.lastChecked}
                          </span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                            View Details
                          </Button>
                          <Button size="sm" className="text-xs h-7 px-2 bg-medisync-primary hover:bg-medisync-secondary">
                            Record Vitals
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
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

export default NurseDashboard;
