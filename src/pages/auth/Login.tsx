import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { signIn, error } = auth;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The signIn function in useAuth already handles navigation based on the user's role
      // We don't need to navigate here as it's handled in the useAuth hook
      await signIn(email, password);
      
      // Navigation is handled by the signIn function in useAuth
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Login error:', errorMessage);
      // Show error to the user
      alert(`Login failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 lg:w-2/5 p-8 flex items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/pharmaceutical-exam-treatment-health-white-pharmacy.jpg"
            alt="Pharmaceutical treatment" 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="max-w-md w-full bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg animate-fade-in z-10 relative">
          <div className="flex justify-between mb-6">
            <Link to="/signup">
              <button className="text-medisync-primary font-medium px-4 py-2 rounded-full bg-transparent hover:bg-medisync-accent transition-colors">
                Sign Up
              </button>
            </Link>
            <button className="text-medisync-primary font-medium px-4 py-2 rounded-full bg-medisync-accent">
              Log in
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Account Name</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="medisync-input pr-10"
                  placeholder="youremail@example.com"
                  required
                />
                <span className="absolute right-3 top-3 text-medisync-primary">
                  👤
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select 
                value={userType} 
                onValueChange={setUserType}
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
            
            <Button 
              type="submit" 
              className="w-full bg-medisync-primary hover:bg-medisync-secondary text-white py-3 rounded-lg font-medium"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Don't have an account? <Link to="/signup" className="text-medisync-primary font-medium">Sign up</Link></p>
          </div>
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or login with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="w-5 h-5" />
              <span>Login with Google</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 lg:w-3/5 bg-gray-100 hidden md:block">
        <div className="h-full w-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-medisync-primary/20 to-transparent z-10"></div>
          
          <img 
            src="/images/team-young-specialist-doctors-standing-corridor-hospital.jpg"
            alt="Healthcare professionals" 
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
