
import React, { useState, useEffect } from 'react';

import PatientSidebar from '@/components/layout/PatientSidebar';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, MessageSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { messageService } from '@/lib/services/messageService';
import { auth } from '@/lib/firebase';
import NewConversationDialog from '@/components/messaging/NewConversationDialog';

const PatientMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName || 'Patient'
        });
        
        // Load conversations when user is authenticated
        loadConversations(currentUser.uid);
      } else {
        setUser(null);
        setConversations([]);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Load conversations
  const loadConversations = async (userId) => {
    try {
      setLoading(true);
      const userConversations = await messageService.getConversations(userId);
      setConversations(userConversations);
      
      // Select the first conversation if available
      if (userConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(userConversations[0]);
        loadMessages(userId, userConversations[0].id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  // Load messages for a conversation
  const loadMessages = async (userId, partnerId) => {
    try {
      const conversationMessages = await messageService.getMessages(userId, partnerId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Effect to load messages when selected conversation changes
  useEffect(() => {
    if (user && selectedConversation) {
      loadMessages(user.id, selectedConversation.id);
     
    }
  }, [selectedConversation, user]);
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !user || !selectedConversation) return;
    
    try {
      // Send message to Firebase
      await messageService.sendMessage(user.id, selectedConversation.id, newMessage);
      
      // Refresh messages
      loadMessages(user.id, selectedConversation.id);
      
      setNewMessage("");
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedConversation.name}.`
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <PatientSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-r bg-white flex flex-col">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
              <p className="text-sm text-gray-600">
                Communicate with your healthcare team
              </p>
              <div className="mt-3 relative">
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-3 flex justify-between">
                <NewConversationDialog 
                  currentUserRole="patient"
                  currentUserId={user?.id || ''}
                  onSelectUser={(userId) => {
                    // Start a new conversation with the selected user
                    if (user) {
                      messageService.sendMessage(user.id, userId, "Hello, I'd like to start a conversation with you.")
                        .then(() => {
                          // Refresh conversations list
                          loadConversations(user.id);
                          toast({
                            title: "Conversation started",
                            description: "Your message has been sent."
                          });
                        })
                        .catch((error) => {
                          toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive"
                          });
                        });
                    }
                  }}
                />
              </div>
              </div>
            
            <Tabs defaultValue="all" className="w-full">
              <div className="px-3 pt-3">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="doctors" className="flex-1">Doctors</TabsTrigger>
                  <TabsTrigger value="nurses" className="flex-1">Nurses</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="flex-1 overflow-y-auto pt-2">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No conversations found</div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 flex items-start gap-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          {conversation.avatar ? (
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          ) : (
                            <AvatarFallback className={conversation.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                              {conversation.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="ml-auto bg-medisync-primary">{conversation.unread}</Badge>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="doctors" className="flex-1 overflow-y-auto pt-2">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : filteredConversations.filter(c => c.role === 'doctor').length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No doctor conversations found</div>
                ) : (
                  filteredConversations.filter(c => c.role === 'doctor').map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 flex items-start gap-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          {conversation.avatar ? (
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          ) : (
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {conversation.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="ml-auto bg-medisync-primary">{conversation.unread}</Badge>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="nurses" className="flex-1 overflow-y-auto pt-2">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : filteredConversations.filter(c => c.role === 'nurse').length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No nurse conversations found</div>
                ) : (
                  filteredConversations.filter(c => c.role === 'nurse').map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 flex items-start gap-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          {conversation.avatar ? (
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          ) : (
                            <AvatarFallback className="bg-green-100 text-green-800">
                              {conversation.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="ml-auto bg-medisync-primary">{conversation.unread}</Badge>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Message Area */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col bg-gray-50">
              {/* Header */}
              <div className="border-b bg-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {selectedConversation.avatar ? (
                      <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                    ) : (
                      <AvatarFallback className={selectedConversation.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                        {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {selectedConversation.online ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                          <span>Online</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
                          <span>Offline</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" title="Call">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Video Call">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" title="More Options">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.senderId === user?.id
                          ? 'bg-medisync-primary text-white'
                          : 'bg-white border'
                      }`}
                    >
                      <div className="text-xs mb-1">
                        {message.senderName} • {message.timestamp}
                      </div>
                      <div>{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input Area */}
              <div className="p-3 bg-white border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" title="Attach file">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    className="flex-1"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-5 w-5 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="mb-4 text-gray-400">
                  <MessageSquare className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMessages;
