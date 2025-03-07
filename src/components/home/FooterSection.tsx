
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FooterSection = () => {
  return (
    <footer className="bg-medisync-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="text-xl font-bold mb-4">MediSync</h3>
            <p className="text-sm opacity-80 mb-4">
              Making healthcare accessible anytime through technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/" className="block text-sm opacity-80 hover:opacity-100">Home</Link>
              <Link to="/services" className="block text-sm opacity-80 hover:opacity-100">Services</Link>
              <Link to="/contact-us" className="block text-sm opacity-80 hover:opacity-100">Contact Us</Link>
            </nav>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <nav className="space-y-2">
              <Link to="/privacy-policy" className="block text-sm opacity-80 hover:opacity-100">Privacy Policy</Link>
              <Link to="/terms-of-service" className="block text-sm opacity-80 hover:opacity-100">Terms of Service</Link>
              <Link to="/transparency-report" className="block text-sm opacity-80 hover:opacity-100">Transparency Report</Link>
            </nav>
          </div>
        </div>
        
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4">Newsletter</h3>
          <p className="text-sm opacity-80 mb-4">Stay updated with our latest healthcare technology.</p>
          <div className="flex gap-2">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white/10 border-white/10 text-white placeholder:text-white/60"
            />
            <Button className="bg-white text-medisync-primary hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-sm opacity-70">© 2024 MediSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
