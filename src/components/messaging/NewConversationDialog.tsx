import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from '@/lib/services/userService';
import { User } from '@/lib/firebase';
import { toast } from "@/hooks/use-toast";

interface NewConversationDialogProps {
  currentUserRole: 'patient' | 'doctor' | 'nurse' | 'admin';
  currentUserId: string;
  onSelectUser: (userId: string) => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  currentUserRole,
  currentUserId,
  onSelectUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Define which roles the current user can message based on their role
  const getAllowedRoles = (): ('patient' | 'doctor' | 'nurse' | 'admin')[] => {
    switch (currentUserRole) {
      case 'patient':
        return ['doctor', 'nurse'];
      case 'doctor':
        return ['patient', 'nurse', 'admin', 'doctor'];
      case 'nurse':
        return ['patient', 'doctor', 'admin', 'nurse'];
      case 'admin':
        return ['doctor', 'nurse', 'admin', 'patient'];
      default:
        return [];
    }
  };
  
  const allowedRoles = getAllowedRoles();
  
  // Load users when dialog opens
  useEffect(() => {
    if (open && searchTerm === '') {
      loadUsers();
    }
  }, [open]);
  
  // Search users when search term changes
  useEffect(() => {
    if (open) {
      const delaySearch = setTimeout(() => {
        if (searchTerm) {
          searchUsers();
        } else {
          loadUsers();
        }
      }, 300);
      
      return () => clearTimeout(delaySearch);
    }
  }, [searchTerm, open]);
  
  // Load users by allowed roles
  const loadUsers = async () => {
    try {
      setLoading(true);
      const userPromises = allowedRoles.map(role => userService.getUsersByRole(role));
      const usersArrays = await Promise.all(userPromises);
      
      // Flatten arrays and filter out current user
      const allUsers = usersArrays.flat().filter(user => user.uid !== currentUserId);
      
      setUsers(allUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  // Search users by name
  const searchUsers = async () => {
    try {
      setLoading(true);
      const searchResults = await userService.searchUsersByName(searchTerm);
      
      // Filter by allowed roles and exclude current user
      const filteredResults = searchResults.filter(user => 
        allowedRoles.includes(user.role) && user.uid !== currentUserId
      );
      
      setUsers(filteredResults);
      setLoading(false);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  // Handle user selection
  const handleSelectUser = (userId: string) => {
    onSelectUser(userId);
    setOpen(false);
  };
  
  // Get role-specific background color for avatar
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'nurse':
        return 'bg-green-100 text-green-800';
      case 'patient':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <Plus className="h-4 w-4" /> New Conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="relative">
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          
          <Tabs defaultValue="all" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              {allowedRoles.includes('doctor') && (
                <TabsTrigger value="doctors" className="flex-1">Doctors</TabsTrigger>
              )}
              {allowedRoles.includes('nurse') && (
                <TabsTrigger value="nurses" className="flex-1">Nurses</TabsTrigger>
              )}
              {allowedRoles.includes('patient') && (
                <TabsTrigger value="patients" className="flex-1">Patients</TabsTrigger>
              )}
              {allowedRoles.includes('admin') && (
                <TabsTrigger value="admins" className="flex-1">Admins</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="all" className="mt-2 max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No users found</div>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.uid}
                      className="p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                      onClick={() => handleSelectUser(user.uid)}
                    >
                      <Avatar className="h-10 w-10">
                        {user.photoURL ? (
                          <AvatarImage src={user.photoURL} alt={user.displayName} />
                        ) : (
                          <AvatarFallback className={getRoleColor(user.role)}>
                            {user.displayName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {allowedRoles.includes('doctor') && (
              <TabsContent value="doctors" className="mt-2 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading doctors...</div>
                ) : users.filter(u => u.role === 'doctor').length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No doctors found</div>
                ) : (
                  <div className="space-y-2">
                    {users.filter(u => u.role === 'doctor').map((user) => (
                      <div
                        key={user.uid}
                        className="p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                        onClick={() => handleSelectUser(user.uid)}
                      >
                        <Avatar className="h-10 w-10">
                          {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                          ) : (
                            <AvatarFallback className={getRoleColor(user.role)}>
                              {user.displayName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
            
            {allowedRoles.includes('nurse') && (
              <TabsContent value="nurses" className="mt-2 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading nurses...</div>
                ) : users.filter(u => u.role === 'nurse').length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No nurses found</div>
                ) : (
                  <div className="space-y-2">
                    {users.filter(u => u.role === 'nurse').map((user) => (
                      <div
                        key={user.uid}
                        className="p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                        onClick={() => handleSelectUser(user.uid)}
                      >
                        <Avatar className="h-10 w-10">
                          {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                          ) : (
                            <AvatarFallback className={getRoleColor(user.role)}>
                              {user.displayName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
            
            {allowedRoles.includes('patient') && (
              <TabsContent value="patients" className="mt-2 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading patients...</div>
                ) : users.filter(u => u.role === 'patient').length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No patients found</div>
                ) : (
                  <div className="space-y-2">
                    {users.filter(u => u.role === 'patient').map((user) => (
                      <div
                        key={user.uid}
                        className="p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                        onClick={() => handleSelectUser(user.uid)}
                      >
                        <Avatar className="h-10 w-10">
                          {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                          ) : (
                            <AvatarFallback className={getRoleColor(user.role)}>
                              {user.displayName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
            
            {allowedRoles.includes('admin') && (
              <TabsContent value="admins" className="mt-2 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading admins...</div>
                ) : users.filter(u => u.role === 'admin').length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No admins found</div>
                ) : (
                  <div className="space-y-2">
                    {users.filter(u => u.role === 'admin').map((user) => (
                      <div
                        key={user.uid}
                        className="p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                        onClick={() => handleSelectUser(user.uid)}
                      >
                        <Avatar className="h-10 w-10">
                          {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                          ) : (
                            <AvatarFallback className={getRoleColor(user.role)}>
                              {user.displayName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;