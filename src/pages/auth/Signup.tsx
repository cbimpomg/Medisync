
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'patient',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUserTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(formData);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 lg:w-2/5 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg animate-fade-in">
          <div className="flex justify-between mb-6">
            <button className="text-medisync-primary font-medium px-4 py-2 rounded-full bg-medisync-accent">
              Sign Up
            </button>
            <button className="text-medisync-primary font-medium px-4 py-2 rounded-full bg-transparent hover:bg-medisync-accent transition-colors">
              Log in
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">User Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="medisync-input"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select 
                value={formData.userType} 
                onValueChange={handleUserTypeChange}
              >
                <SelectTrigger className="medisync-input">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin & Managers</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="medisync-input"
                placeholder="youremail@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="medisync-input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-medisync-primary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-medisync-primary hover:bg-medisync-secondary text-white py-3 rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Already have an account? <Link to="/login" className="text-medisync-primary font-medium">Log in</Link></p>
          </div>
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 lg:w-3/5 bg-gray-100 hidden md:block">
        <div className="h-full w-full relative">
          <img 
            src="public/lovable-uploads/472d0c98-1c09-465f-8564-2c8c57656629.png"
            alt="Healthcare professionals" 
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
