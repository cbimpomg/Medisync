import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Key, LogOut, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ open, onOpenChange }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'nurse':
        return 'bg-green-100 text-green-800';
      case 'patient':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrator';
      case 'doctor':
        return 'Doctor';
      case 'nurse':
        return 'Nurse';
      case 'patient':
        return 'Patient';
      default:
        return 'User';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Here you would typically call an API to update the user profile
    // For now, we'll just show a success toast
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/images/placeholder.svg" alt={user?.displayName || 'User'} />
                  <AvatarFallback className={getRoleColor()}>
                    {user?.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full bg-white shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">{user?.displayName || 'User'}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <Badge className={`mt-2 ${getRoleColor()}`}>{getRoleName()}</Badge>
              </div>
            </div>

            <Separator />

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">Personal Information</h4>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-sm font-medium">{user?.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium">{user?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-sm font-medium">{profileData.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium">{profileData.address || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 py-4">
            <h4 className="text-sm font-medium">Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">Receive email notifications</p>
                </div>
                <div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch between light and dark mode</p>
                </div>
                <div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 py-4">
            <h4 className="text-sm font-medium">Account Security</h4>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Two-Factor Authentication
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;