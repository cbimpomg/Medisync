
import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from '@/components/layout/AdminSidebar';
import { BarChart, Users, Calendar, Activity, BedDouble, Clock } from 'lucide-react';

const AdminDashboard = () => {
  // Mock user data
  const mockUser = {
    name: 'Admin User'
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {mockUser.name}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard 
              title="Total Patients" 
              value="1,248" 
              trend="+12.5%" 
              icon={<Users className="h-8 w-8 text-medisync-primary" />} 
            />
            <StatsCard 
              title="Appointments Today" 
              value="42" 
              trend="+4.5%" 
              icon={<Calendar className="h-8 w-8 text-medisync-primary" />} 
            />
            <StatsCard 
              title="Revenue" 
              value="$15,840" 
              trend="+8.2%" 
              icon={<Activity className="h-8 w-8 text-medisync-primary" />} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Facility Utilization</CardTitle>
                <CardDescription>Current capacity and usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-medisync-primary" />
                    <span>Inpatient Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-medisync-primary rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-medisync-primary" />
                    <span>Emergency Room</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-medisync-primary rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-medisync-primary" />
                    <span>Operating Rooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-medisync-primary rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Staff distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <BarChart className="h-32 w-32 text-gray-300" />
                  <span className="text-gray-500 ml-4">Department chart will be displayed here</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>System-wide actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Dr. Johnson added a new patient record', 
                  'System maintenance scheduled for tonight at 2 AM', 
                  'Nurse Williams updated patient #1038 vitals', 
                  'New equipment delivery for Radiology department',
                  'Dr. Patel requested lab results for patient #2456'].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0">
                    <div className="w-2 h-2 bg-medisync-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-700">{activity}</p>
                      <span className="text-xs text-gray-500">
                        {index === 0 ? '10 minutes ago' : 
                         index === 1 ? '1 hour ago' : 
                         index === 2 ? '3 hours ago' : 
                         index === 3 ? 'Yesterday, 4:30 PM' : 'Yesterday, 2:15 PM'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, trend, icon }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <span className="inline-block mt-1 text-xs font-medium text-green-500">{trend}</span>
          </div>
          <div className="bg-medisync-primary bg-opacity-10 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
