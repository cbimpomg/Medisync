
import { Phone, Mail } from 'lucide-react';

const ContactSection = () => {
  return (
    <div className="bg-medisync-primary py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Reach us out on</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-white">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5" />
            <p>+233 256852953</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5" />
            <p>medisync@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
