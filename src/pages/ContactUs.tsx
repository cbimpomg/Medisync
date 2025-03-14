import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import FooterSection from "@/components/home/FooterSection";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // In a real app, you would send this data to your backend
    setIsSubmitted(true);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-medisync-primary mb-6">Contact Us</h1>
            <p className="text-gray-600 mb-8">
              Have questions about our services or need assistance? 
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-medisync-primary">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-medisync-accent rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Phone</h4>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-medisync-accent rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Email</h4>
                        <p className="text-gray-600">contact@medisync.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-medisync-accent rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medisync-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Address</h4>
                        <p className="text-gray-600">123 Healthcare Blvd<br />Medical District<br />City, State 12345</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-medisync-primary">Office Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between"><span className="text-gray-600">Monday - Friday</span> <span className="font-medium">8:00 AM - 6:00 PM</span></li>
                    <li className="flex justify-between"><span className="text-gray-600">Saturday</span> <span className="font-medium">9:00 AM - 1:00 PM</span></li>
                    <li className="flex justify-between"><span className="text-gray-600">Sunday</span> <span className="font-medium">Closed</span></li>
                  </ul>
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <path d="M22 4 12 14.01l-3-3"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-medisync-primary mb-2">Thank You!</h3>
                      <p className="text-gray-600 mb-6">Your message has been received. We'll get back to you shortly.</p>
                      <Button onClick={() => setIsSubmitted(false)} className="bg-medisync-primary hover:bg-medisync-secondary">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full min-h-[120px]"
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="bg-medisync-primary hover:bg-medisync-secondary w-full md:w-auto">
                        Send Message
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default ContactUs; 