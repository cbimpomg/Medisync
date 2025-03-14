import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import FooterSection from "@/components/home/FooterSection";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-medisync-primary/90 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/">
                <span className="text-white font-bold text-xl">MediSync</span>
              </Link>
            </div>
            <nav className="flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-white/80 font-medium">Home</Link>
              <Link to="/services" className="text-white hover:text-white/80 font-medium">Services</Link>
              <Link to="/contact-us" className="text-white hover:text-white/80 font-medium">Contact Us</Link>
            </nav>
          </div>
        </div>
      </div>
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-medisync-primary mb-6">Our Services</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {/* Service 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <path d="M12 19v3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-medisync-primary">Telemedicine</h3>
              <p className="text-gray-600">Connect with healthcare professionals from the comfort of your home through secure video consultations.</p>
            </div>
            
            {/* Service 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <path d="M8 6h8"></path>
                  <path d="M8 10h8"></path>
                  <path d="M8 14h8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-medisync-primary">Electronic Health Records</h3>
              <p className="text-gray-600">Secure access to your complete medical history, test results, and treatment plans in one place.</p>
            </div>
            
            {/* Service 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                  <path d="M12 3v6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-medisync-primary">Medication Management</h3>
              <p className="text-gray-600">Track prescriptions, get refill reminders, and receive medication interaction alerts to ensure safe usage.</p>
            </div>
            
            {/* Service 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                  <path d="M8 7h6"></path>
                  <path d="M8 11h8"></path>
                  <path d="M8 15h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-medisync-primary">Appointment Scheduling</h3>
              <p className="text-gray-600">Easily book, reschedule, or cancel appointments with doctors and specialists using our intuitive platform.</p>
            </div>
            
            {/* Service 5 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.95 4 6.75v5"></path>
                  <path d="M19.167 4.081a5.458 5.458 0 0 0-3.048 4.647c0 2.092.352 3.13 1.326 4.642 1.741 2.554 2.67 3.662 1.407 6.549"></path>
                  <path d="M11.8 4.6a5.459 5.459 0 0 0 3.139 4.725c1.561.904 2.393 1.464 2.87 2.75"></path>
                  <path d="M13.647 11.525c1.39 2.575.67 4.842-.736 7.392"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-medisync-primary">Lab Results & Imaging</h3>
              <p className="text-gray-600">View your diagnostic test results and medical images with detailed explanations from healthcare providers.</p>
            </div>
            
            {/* Service 6 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 4.6a2 2 0 0 1 1.4-.6h3.8a2 2 0 0 1 2 2v2.4Z"></path>
                  <path d="M12 10v6"></path>
                  <path d="M9 13h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-medisync-primary">Patient Support</h3>
              <p className="text-gray-600">Access 24/7 chat support, educational resources, and community forums to help manage your healthcare journey.</p>
            </div>
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Services; 