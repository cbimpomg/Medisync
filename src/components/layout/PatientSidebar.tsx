
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderOpen, 
  Pill, 
  ShoppingBag, 
  MessageCircle, 
  Video,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const PatientSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
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

  return (
    <div className="patient-sidebar w-64 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-medisync-primary text-white flex items-center justify-center">
          <span className="font-bold">{user?.name?.charAt(0) || 'P'}</span>
        </div>
        <div>
          <h3 className="font-medium text-medisync-text">{user?.name || 'Patient'}</h3>
          <p className="text-sm text-gray-500">PatientID: {user?.id || '123'}</p>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "patient-sidebar-item",
              location.pathname === item.path && "active"
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

export default PatientSidebar;
