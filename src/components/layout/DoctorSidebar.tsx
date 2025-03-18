import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList, 
  Pill, 
  MessageCircle, 
  Video,
  FileText,
  Activity,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import UserProfile from '@/components/UserProfile';

const DoctorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
    { icon: Users, label: 'My Patients', path: '/doctor/patients' },
    { icon: ClipboardList, label: 'Prescriptions', path: '/doctor/prescriptions' },
    { icon: FileText, label: 'Medical Records', path: '/doctor/medical-records' },
    { icon: MessageCircle, label: 'Messages', path: '/doctor/messages' },
    { icon: Video, label: 'Telehealth', path: '/doctor/telehealth' },
    { icon: Activity, label: 'Lab Results', path: '/doctor/lab-results' },
  ];

  const handleLogout = () => {
    // Handle logout without auth
    navigate('/signup');
  };

  return (
    <div className="doctor-sidebar w-64 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <button 
          onClick={() => setProfileOpen(true)} 
          className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center hover:bg-blue-200 transition-colors"
        >
          <span className="font-bold">{user?.displayName?.charAt(0) || 'D'}</span>
        </button>
        <div>
          <h3 className="font-medium text-medisync-text">{user?.displayName || 'Doctor'}</h3>
          <p className="text-sm text-gray-500">Doctor</p>
        </div>
      </div>
      
      <UserProfile open={profileOpen} onOpenChange={setProfileOpen} />
      
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "doctor-sidebar-item flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-medisync-primary hover:bg-opacity-10 hover:text-medisync-primary transition-colors",
              location.pathname === item.path && "bg-medisync-primary bg-opacity-10 text-medisync-primary"
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

export default DoctorSidebar;
