
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList, 
  Activity, 
  Heart,
  Pill,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const NurseSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
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

  return (
    <div className="nurse-sidebar w-64 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-medisync-primary text-white flex items-center justify-center">
          <span className="font-bold">{user?.name?.charAt(0) || 'N'}</span>
        </div>
        <div>
          <h3 className="font-medium text-medisync-text">{user?.name || 'Nurse'}</h3>
          <p className="text-sm text-gray-500">
            {user?.role === 'nurse' ? 'Nurse' : 'Healthcare Provider'}
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
    </div>
  );
};

export default NurseSidebar;
