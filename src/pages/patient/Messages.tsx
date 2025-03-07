
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    name: "Dr. John Smith",
    avatar: "/lovable-uploads/472d0c98-1c09-465f-8564-2c8c57656629.png",
    role: "doctor",
    lastMessage: "Your test results look good. No concerns.",
    timestamp: "10:42 AM",
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: "Nurse Sarah Williams",
    avatar: "",
    role: "nurse",
    lastMessage: "Your appointment is confirmed for tomorrow at 2 PM.",
    timestamp: "Yesterday",
    unread: 0,
    online: true
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    avatar: "",
    role: "doctor",
    lastMessage: "Please remember to take your medication as prescribed.",
    timestamp: "Tuesday",
    unread: 0,
    online: false
  },
  {
    id: 4,
    name: "Nurse Michael Brown",
    avatar: "",
    role: "nurse",
    lastMessage: "How are you feeling today?",
    timestamp: "Monday",
    unread: 0,
    online: false
  }
];

// Mock messages for a selected conversation
const mockMessages = [
  {
    id: 1,
    senderId: "doctor",
    senderName: "Dr. John Smith",
    content: "Hello! How are you feeling today?",
    timestamp: "10:30 AM",
    read: true
  },
  {
    id: 2,
    senderId: "patient",
    senderName: "You",
    content: "I'm feeling much better, thank you doctor.",
    timestamp: "10:32 AM",
    read: true
  },
  {
    id: 3,
    senderId: "doctor",
    senderName: "Dr. John Smith",
    content: "That's great to hear! Your latest test results look good. I don't see any concerning issues.",
    timestamp: "10:35 AM",
    read: true
  },
  {
    id: 4,
    senderId: "doctor",
    senderName: "Dr. John Smith",
    content: "Do you have any questions about your treatment plan?",
    timestamp: "10:36 AM",
    read: true
  },
  {
    id: 5,
    senderId: "patient",
    senderName: "You",
    content: "Yes, I was wondering if I should continue with the current medication or if there will be any changes?",
    timestamp: "10:38 AM",
    read: true
  },
  {
    id: 6,
    senderId: "doctor",
    senderName: "Dr. John Smith",
    content: "You should continue with the current medication for another two weeks, and then we'll reassess. Your progress is good so far.",
    timestamp: "10:40 AM",
    read: true
  },
  {
    id: 7,
    senderId: "doctor",
    senderName: "Dr. John Smith",
    content: "I'll send you a prescription renewal through the system.",
    timestamp: "10:41 AM",
    read: true
  },
  {
    id: 8,
    senderId: "patient",
    senderName: "You", 
    content: "Thank you, doctor. That's very helpful.",
    timestamp: "10:42 AM",
    read: true
  }
];

const PatientMessages = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  
  const filteredConversations = mockConversations.filter(conversation => 
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg = {
      id: messages.length + 1,
      senderId: "patient",
      senderName: "You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      read: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedConversation.name}.`
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
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
                {filteredConversations.map((conversation) => (
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
                ))}
              </TabsContent>
              
              <TabsContent value="doctors" className="flex-1 overflow-y-auto pt-2">
                {filteredConversations.filter(c => c.role === 'doctor').map((conversation) => (
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
                ))}
              </TabsContent>
              
              <TabsContent value="nurses" className="flex-1 overflow-y-auto pt-2">
                {filteredConversations.filter(c => c.role === 'nurse').map((conversation) => (
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
                ))}
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
                    className={`flex ${message.senderId === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.senderId === 'patient'
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
