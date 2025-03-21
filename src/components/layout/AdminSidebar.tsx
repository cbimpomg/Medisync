import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCog,
  CalendarClock, 
  FileBarChart, 
  CreditCard,
  Settings,
  LogOut,
  User,
  Pill
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import UserProfile from '@/components/UserProfile';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Patients', path: '/admin/patients' },
    { icon: UserCog, label: 'Doctors', path: '/admin/doctors' },
    { icon: CalendarClock, label: 'Appointments', path: '/admin/appointments' },
    { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy' },
    { icon: FileBarChart, label: 'Report', path: '/admin/reports' },
    { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <button 
          onClick={() => setProfileOpen(true)} 
          className="w-10 h-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center hover:bg-red-200 transition-colors"
        >
          <span className="font-bold">{user?.displayName?.charAt(0) || 'A'}</span>
        </button>
        <div>
          <h3 className="font-medium text-medisync-text">{user?.displayName || 'Admin'}</h3>
          <p className="text-sm text-gray-500">Administrator</p>
        </div>
      </div>
      
      <UserProfile open={profileOpen} onOpenChange={setProfileOpen} />
      
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
              location.pathname === item.path 
                ? "bg-medisync-primary text-white hover:bg-medisync-secondary" 
                : "text-gray-700 hover:bg-medisync-accent/50 hover:text-medisync-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => navigate('/signup')}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
