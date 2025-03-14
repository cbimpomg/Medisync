import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
}

const mockDashboardData = {
  nextAppointment: {
    doctor: 'Dr.Sarah Smith',
    specialty: 'General Checkup',
    date: '21st March,2025',
    time: '10:00 am'
  }
};

const PatientDashboard = () => {
  // Mock user data for now
  const mockUser = {
    name: 'Ransford'
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <PatientSidebar />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden relative"
        style={{ 
          backgroundImage: 'url("/images/blur-hospital.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Removed overlay to show the background image at full clarity */}
        
        <div className="p-6 flex-1 overflow-y-auto relative z-10">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg shadow-black">Welcome back, {mockUser.name}</h1>
          </div>
          
          <div className="mb-8 animate-slide-up">
            <Card className="bg-medisync-primary text-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Next Appointment</CardTitle>
                <CardDescription className="text-white/80">
                  {mockDashboardData.nextAppointment.doctor}
                </CardDescription>
                <CardDescription className="text-white/80">
                  {mockDashboardData.nextAppointment.specialty}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{mockDashboardData.nextAppointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{mockDashboardData.nextAppointment.date}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              title="Book Appointment" 
              description="Schedule a visit with your doctor" 
              icon="calendar" 
              link="/book-appointment"
              delay={100}
            />
            
            <ServiceCard 
              title="E-pharmacy" 
              description="Order medications online" 
              icon="pill" 
              link="/pharmacy"
              delay={200}
            />
            
            <ServiceCard 
              title="Medical Records" 
              description="View your health history" 
              icon="file" 
              link="/medical-records"
              delay={300}
            />
            
            <ServiceCard 
              title="Prescriptions" 
              description="Manage your medications" 
              icon="prescription" 
              link="/prescriptions"
              delay={400}
            />
            
            <ServiceCard 
              title="Messages" 
              description="Chat with your healthcare team" 
              icon="message" 
              link="/messages"
              delay={500}
            />
            
            <ServiceCard 
              title="Telehealth" 
              description="Virtual consultation" 
              icon="video" 
              link="/telehealth"
              delay={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  delay?: number;
}

const ServiceCard = ({ title, description, icon, link, delay = 0 }: ServiceCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  let IconComponent;
  
  switch(icon) {
    case 'calendar':
      IconComponent = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-medisync-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>;
      break;
    case 'pill':
      IconComponent = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-medisync-primary"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>;
      break;
    case 'file':
      IconComponent = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-medisync-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
      break;
    case 'prescription':
      IconComponent = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-medisync-primary"><path d="M3 3v18h18"></path><path d="m7 12 4-4 4 4"></path><path d="M7 17h.01"></path><path d="M11 17h.01"></path><path d="M15 17h.01"></path><path d="M19 17h.01"></path></svg>;
      break;
    case 'message':
      IconComponent = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-medisync-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
      break;
    case 'video':
      IconComponent = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-medisync-primary"><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg>;
      break;
    default:
      IconComponent = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-medisync-primary"><circle cx="12" cy="12" r="10"></circle><path d="m16 10-4 4-4-4"></path></svg>;
  }
  
  return (
    <Card className={`dashboard-card hover:border-medisync-primary transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-white/85 shadow-xl hover:shadow-2xl border-2 border-white`}>
      <CardContent className="p-6">
        <div className="mb-4">
          {IconComponent}
        </div>
        <CardTitle className="text-lg mb-2 text-gray-900 font-bold">{title}</CardTitle>
        <CardDescription className="mb-4 text-gray-700 font-medium">{description}</CardDescription>
        <Button className="w-full bg-medisync-primary hover:bg-medisync-secondary font-semibold" asChild>
          <a href={link}>View</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientDashboard;
