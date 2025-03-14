import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCog,
  CalendarClock, 
  FileBarChart, 
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Mock user data for now
  const mockUser = {
    name: 'Admin',
    role: 'admin'
  };
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Patients', path: '/admin/patients' },
    { icon: UserCog, label: 'Doctors', path: '/admin/doctors' },
    { icon: CalendarClock, label: 'Appointments', path: '/admin/appointments' },
    { icon: FileBarChart, label: 'Report', path: '/admin/reports' },
    { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-medisync-primary text-white flex items-center justify-center">
          <span className="font-bold">{mockUser.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="font-medium text-medisync-text">{mockUser.name}</h3>
          <p className="text-sm text-gray-500">{mockUser.role === 'admin' ? 'Administrator' : 'Staff'}</p>
        </div>
      </div>
      
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
