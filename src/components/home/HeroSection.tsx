
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              We provide <span className="text-medisync-primary">Services</span><br />
              That You Can <span className="text-medisync-primary">Trust</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              MediSync is always at your service by providing quality and distinct outcomes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button className="medisync-btn-primary">
                  Sign Up
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="medisync-btn-secondary">
                  Read More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <img 
              src="public/lovable-uploads/cc36c8af-01ee-4804-8ff1-ac044dba3da2.png" 
              alt="Doctor with stethoscope" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
