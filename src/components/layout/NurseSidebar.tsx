import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList, 
  Activity, 
  Heart,
  Pill,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NurseSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Mock user data for now
  const mockUser = {
    name: 'Nurse',
    role: 'nurse'
  };
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/nurse/dashboard' },
    { icon: Users, label: 'Patients', path: '/nurse/patients' },
    { icon: Calendar, label: 'Appointments', path: '/nurse/appointments' },
    { icon: Activity, label: 'Vitals', path: '/nurse/vitals' },
    { icon: Heart, label: 'Care Plans', path: '/nurse/care-plans' },
    { icon: ClipboardList, label: 'Tasks', path: '/nurse/tasks' },
    { icon: Pill, label: 'Medications', path: '/nurse/medications' },
    { icon: MessageCircle, label: 'Messages', path: '/nurse/messages' },
  ];

  const handleLogout = () => {
    // Handle logout without auth
    navigate('/signup');
  };

  return (
    <div className="nurse-sidebar w-64 flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-medisync-primary text-white flex items-center justify-center">
          <span className="font-bold">{mockUser.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="font-medium text-medisync-text">{mockUser.name}</h3>
          <p className="text-sm text-gray-500">
            {mockUser.role === 'nurse' ? 'Nurse' : 'Healthcare Provider'}
          </p>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "nurse-sidebar-item flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-medisync-primary hover:bg-opacity-10 hover:text-medisync-primary transition-colors",
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
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default NurseSidebar;
