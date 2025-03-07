
import { 
  Users, 
  MessageCircle, 
  CalendarClock, 
  FileText, 
  CreditCard, 
  LayoutGrid 
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Secure access control for patients, doctors, and administrators'
  },
  {
    icon: MessageCircle,
    title: 'Real-Time Messaging & Notifications',
    description: 'Stay connected with your healthcare providers through instant messaging'
  },
  {
    icon: CalendarClock,
    title: 'Automated Appointment Scheduling',
    description: 'Easily book and manage appointments with your preferred specialists'
  },
  {
    icon: FileText,
    title: 'Electronic Health Records (EHR) Management',
    description: 'Access your medical history and health records securely anytime'
  },
  {
    icon: CreditCard,
    title: 'Billing & Payment Processing',
    description: 'Hassle-free payment options for your healthcare services'
  },
  {
    icon: LayoutGrid,
    title: 'Manager Dashboard',
    description: 'Comprehensive dashboards for healthcare administrators'
  }
];

const FeaturesSection = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">We Are Always Ready To Help You</h2>
          <h3 className="text-2xl font-semibold">Manage Your Hospital</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card group animate-slide-up" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-white/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
