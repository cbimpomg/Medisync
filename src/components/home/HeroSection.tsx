import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-[1000px] flex items-center justify-center bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: 'url("images/cheerful-ethnic-doctor-with-arms-crossed.jpg")' }}>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-medisync-primary/90 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-white font-bold text-xl">MediSync</span>
            </div>
            <nav className="flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-white/80 font-medium">Home</Link>
              <Link to="/services" className="text-white hover:text-white/80 font-medium">Services</Link>
              <Link to="/contact-us" className="text-white hover:text-white/80 font-medium">Contact Us</Link>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10 mt-16 flex justify-center items-center">
        <div className="space-y-8 animate-fade-in backdrop-blur-sm bg-white/10 p-8 rounded-xl shadow-xl border border-white/20 max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            We provide <span className="text-medisync-primary">Services</span><br />
            That You Can <span className="text-medisync-primary">Trust</span>
          </h1>
          <p className="text-lg text-gray-200">
            MediSync is always at your service by providing quality and distinct outcomes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="medisync-btn-primary flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Sign Up
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="medisync-btn-secondary bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/40">
                Read More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
