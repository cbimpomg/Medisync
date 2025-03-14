import { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, MessageSquare, Share, Phone, FileText, X, Calendar, Clock, Users } from 'lucide-react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock upcoming consultations
const upcomingConsultations = [
  {
    id: "VC002",
    patientName: "Emma Johnson",
    patientId: "P002",
    scheduledTime: "11:30 AM",
    duration: "30 minutes",
    reason: "Follow-up consultation",
    status: "Scheduled"
  },
  {
    id: "VC003",
    patientName: "Michael Chen",
    patientId: "P003",
    scheduledTime: "2:00 PM",
    duration: "45 minutes",
    reason: "Initial consultation",
    status: "Scheduled"
  },
  {
    id: "VC004",
    patientName: "Sarah Williams",
    patientId: "P004",
    scheduledTime: "3:30 PM",
    duration: "30 minutes",
    reason: "Medication review",
    status: "Scheduled"
  }
];

// Mock consultation data for active call
const currentConsultation = {
  id: "VC001",
  patientName: "Ransford Agyei",
  patientId: "P001",
  startTime: "10:00 AM",
  duration: "30 minutes",
  reason: "Follow-up consultation",
  status: "In Progress"
};

// Mock chat messages
const initialMessages = [
  {
    id: 1,
    sender: "Dr. Sarah Smith",
    content: "Hello Mr. Agyei, how are you feeling today?",
    timestamp: "10:00 AM",
    type: "doctor"
  },
  {
    id: 2,
    sender: "Ransford Agyei",
    content: "Hi Dr. Smith, I'm feeling much better. The new medication has helped reduce the pain.",
    timestamp: "10:01 AM",
    type: "patient"
  }
];

const DoctorTelehealth = () => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [activeCall, setActiveCall] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "Dr. Sarah Smith",
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "doctor"
        }
      ]);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!activeCall) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DoctorSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Telehealth</h1>
                <p className="text-gray-600">Manage virtual consultations</p>
              </div>
              
              <Button className="bg-blue-500 hover:bg-blue-600 gap-2">
                <Video className="h-4 w-4" />
                Start New Consultation
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Overview */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Today's Consultations</p>
                        <p className="text-2xl font-bold">{upcomingConsultations.length + 1}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Consultation</p>
                        <p className="text-2xl font-bold">{upcomingConsultations[0].scheduledTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Active Consultation</p>
                        <Badge className={getStatusColor('in progress')}>In Progress</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Consultation */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Current Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Video className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{currentConsultation.patientName}</h3>
                        <p className="text-sm text-gray-500">
                          Started at {currentConsultation.startTime} • {currentConsultation.duration}
                        </p>
                        <p className="text-sm text-gray-500">{currentConsultation.reason}</p>
                      </div>
                    </div>
                    <Button onClick={() => setActiveCall(true)} className="gap-2">
                      <Video className="h-4 w-4" />
                      Join Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Consultations */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Upcoming Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation) => (
                      <div 
                        key={consultation.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{consultation.patientName}</h3>
                            <p className="text-sm text-gray-500">
                              Scheduled for {consultation.scheduledTime} • {consultation.duration}
                            </p>
                            <p className="text-sm text-gray-500">{consultation.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(consultation.status)}>
                            {consultation.status}
                          </Badge>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800">Telehealth Consultation</h1>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {currentConsultation.status}
                </Badge>
              </div>
              <p className="text-gray-600">
                With {currentConsultation.patientName} • Started at {currentConsultation.startTime}
              </p>
            </div>
            
            <Button variant="destructive" className="gap-2" onClick={() => setActiveCall(false)}>
              <Phone className="h-4 w-4" />
              End Call
            </Button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main video area */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <Card className="flex-1">
                <CardContent className="p-6 h-full">
                  <div className="relative h-full bg-gray-900 rounded-lg flex items-center justify-center">
                    {/* Main video stream placeholder */}
                    <div className="text-white text-center">
                      <Video className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-gray-400">Video stream will appear here</p>
                    </div>
                    
                    {/* Doctor's video preview */}
                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="h-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>

                    {/* Video controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                      <Button
                        variant={videoEnabled ? "outline" : "destructive"}
                        size="icon"
                        onClick={() => setVideoEnabled(!videoEnabled)}
                      >
                        {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant={audioEnabled ? "outline" : "destructive"}
                        size="icon"
                        onClick={() => setAudioEnabled(!audioEnabled)}
                      >
                        {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant={showChat ? "secondary" : "outline"}
                        size="icon"
                        onClick={() => setShowChat(!showChat)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consultation notes */}
              <Card className={showNotes ? "flex-1" : "hidden"}>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle>Consultation Notes</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowNotes(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type your consultation notes here..."
                    className="min-h-[200px]"
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <Button>Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side panel */}
            <div className={`lg:col-span-1 ${showChat ? '' : 'hidden lg:block'}`}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="chat">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="info">Info</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chat" className="mt-4">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex flex-col ${
                                message.type === 'doctor' ? 'items-end' : 'items-start'
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.type === 'doctor'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="mt-4 flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage}>Send</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="info" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-sm text-gray-500">Patient ID</h3>
                          <p>{currentConsultation.patientId}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-gray-500">Consultation Type</h3>
                          <p>{currentConsultation.reason}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-gray-500">Duration</h3>
                          <p>{currentConsultation.duration}</p>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setShowNotes(!showNotes)}
                        >
                          <FileText className="h-4 w-4" />
                          {showNotes ? 'Hide Notes' : 'Show Notes'}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorTelehealth; 