import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FooterSection from "@/components/home/FooterSection";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
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
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-medisync-secondary to-medisync-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">About MediSync</h1>
            <p className="text-xl opacity-90">Transforming healthcare through innovation, compassion, and excellence.</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-medisync-primary mb-8">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p>
                  MediSync was founded in 2018 with a simple yet powerful vision: to make healthcare more accessible, efficient, and personalized for everyone. 
                  What began as a small team of healthcare professionals and technology experts has grown into a comprehensive health platform serving thousands 
                  of patients, doctors, and healthcare facilities nationwide.
                </p>
                <p>
                  Our journey started when our founders, experienced healthcare providers themselves, recognized the frustrations and inefficiencies in the traditional 
                  healthcare system. They saw how disconnected healthcare services were causing delays in treatment, miscommunication between providers, 
                  and unnecessary stress for patients.
                </p>
                <p>
                  This inspired the creation of MediSync – a platform designed to synchronize all aspects of healthcare delivery and improve the overall patient experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission and Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-medisync-primary mb-8">Our Mission & Values</h2>
              
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-lg text-gray-600">
                  To empower patients and healthcare providers with innovative technology that creates more connected, 
                  efficient, and personalized healthcare experiences.
                </p>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Our Core Values</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                      <path d="M8.5 8.5a1 1 0 0 0 1 1"></path>
                      <path d="M16 19a2 2 0 0 1-2-2"></path>
                      <path d="M9 19a2 2 0 0 0 2-2"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Patient-Centered Care</h4>
                  <p className="text-gray-600">
                    We place patients at the center of everything we do, ensuring that our solutions address their 
                    needs and improve their healthcare journey.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m15 9-6 6"></path>
                      <path d="m9 9 6 6"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h4>
                  <p className="text-gray-600">
                    We continuously pursue innovative solutions that challenge the status quo and push the boundaries 
                    of what's possible in healthcare technology.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Transparency</h4>
                  <p className="text-gray-600">
                    We believe in being open and honest in all our interactions, providing clear information and 
                    maintaining the highest standards of integrity.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-medisync-accent rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8a2.83 2.83 0 0 0-3.17 3.17 2.83 2.83 0 0 0 3.17 3.17 2.83 2.83 0 0 0 3.17-3.17A2.83 2.83 0 0 0 12 8"></path>
                      <path d="m16 8-2.2-2.2M8 8l2.2-2.2M8 16l2.2 2.2M16 16l-2.2 2.2"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Collaboration</h4>
                  <p className="text-gray-600">
                    We foster collaboration between patients, providers, and technology to create integrated 
                    healthcare solutions that benefit everyone involved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-medisync-primary mb-8">Our Leadership Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Team Member 1 */}
                <div className="text-center">
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <img
                      src="/images/young-handsome-physician-medical-robe-with-stethoscope.jpg"
                      alt="Dr. James Wilson - Chief Medical Officer"
                      className="w-full h-64 object-cover object-center"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Dr. James Wilson</h3>
                  <p className="text-medisync-primary font-medium">Chief Medical Officer</p>
                </div>
                
                {/* Team Member 2 */}
                <div className="text-center">
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <img
                      src="/images/androgynous-avatar-non-binary-queer-person.jpg"
                      alt="Alex Chen - CEO & Co-Founder"
                      className="w-full h-64 object-cover object-center"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Alex Chen</h3>
                  <p className="text-medisync-primary font-medium">CEO & Co-Founder</p>
                </div>
                
                {/* Team Member 3 */}
                <div className="text-center">
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <img
                      src="/images/cheerful-ethnic-doctor-with-arms-crossed.jpg"
                      alt="Dr. Sarah Martinez - Chief Innovation Officer"
                      className="w-full h-64 object-cover object-center"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Dr. Sarah Martinez</h3>
                  <p className="text-medisync-primary font-medium">Chief Innovation Officer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-medisync-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Us in Transforming Healthcare</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Experience the future of healthcare with MediSync's innovative platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-medisync-primary hover:bg-gray-100">
                  Sign Up Today
                </Button>
              </Link>
              <Link to="/contact-us">
                <Button size="lg" variant="outline" className="border-white text-medisync-primary hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default About; 