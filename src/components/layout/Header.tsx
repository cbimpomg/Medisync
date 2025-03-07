
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-medisync-primary">MediSync</Link>
      
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/notifications" className="relative">
              <Bell className="h-6 w-6 text-gray-600 hover:text-medisync-primary transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-medisync-primary text-white flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-500">{user?.email || ""}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <Link to="/login">
                <Button variant="outline" className="rounded-full">
                  Login
                </Button>
              </Link>
            )}
            
            {location.pathname !== "/signup" && (
              <Link to="/signup">
                <Button className="bg-medisync-primary hover:bg-medisync-secondary text-white rounded-full">
                  Sign Up
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
