import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderOpen, 
  Pill, 
  ShoppingBag, 
  MessageCircle, 
  Video,
  Brain,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from "@/components/ui/button";

const PatientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Mock user data for now
  const mockUser = {
    name: 'Patient',
    id: '123'
  };
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Book Appointment', path: '/book-appointment' },
    { icon: FolderOpen, label: 'Medical Records', path: '/medical-records' },
    { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
    { icon: ShoppingBag, label: 'E-Pharmacy', path: '/pharmacy' },
    { icon: MessageCircle, label: 'Message', path: '/messages' },
    { icon: Video, label: 'Telehealth', path: '/telehealth' },
    { icon: Brain, label: 'AI Symptom Checker', path: '/symptom-checker' },
  ];

  const handleLogout = () => {
    // Handle logout without auth
    navigate('/signup');
  };

  return (
    <div className="patient-sidebar w-64 flex flex-col h-full bg-white/90 shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <span className="font-bold">{mockUser.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{mockUser.name}</h3>
          <p className="text-sm text-gray-500">PatientID: {mockUser.id}</p>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "patient-sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors",
              location.pathname === item.path && "bg-blue-100 text-blue-600 font-medium"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default PatientSidebar;
