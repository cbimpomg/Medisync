import { useState } from 'react';
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
  LogOut,
  User,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import UserProfile from '@/components/UserProfile';

const PatientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Book Appointment', path: '/book-appointment' },
    { icon: FolderOpen, label: 'Medical Records', path: '/medical-records' },
    { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
    { icon: ShoppingBag, label: 'E-Pharmacy', path: '/pharmacy' },
    { icon: MessageCircle, label: 'Message', path: '/messages' },
    { icon: Video, label: 'Telehealth', path: '/telehealth' },
    { icon: Brain, label: 'AI Symptom Checker', path: '/symptom-checker' },
    { icon: Receipt, label: 'Billing', path: '/billing' },
  ];

  const handleLogout = () => {
    // Use the logout function from useAuth
    navigate('/signup');
  };

  return (
    <div className="patient-sidebar w-64 flex flex-col h-full bg-white/90 shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <button 
          onClick={() => setProfileOpen(true)} 
          className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center hover:bg-purple-200 transition-colors"
        >
          <span className="font-bold">{user?.displayName?.charAt(0) || 'P'}</span>
        </button>
        <div>
          <h3 className="font-medium text-gray-800">{user?.displayName || 'Patient'}</h3>
          <p className="text-sm text-gray-500">Patient</p>
        </div>
      </div>
      
      <UserProfile open={profileOpen} onOpenChange={setProfileOpen} />
      
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "patient-sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-medisync-accent/50 hover:text-medisync-primary",
              location.pathname === item.path && "bg-medisync-primary text-white font-medium"
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
