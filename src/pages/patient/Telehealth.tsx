import { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, MessageSquare, Phone, PhoneOff, FileUp, Settings, Users, X } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  sender: 'patient' | 'doctor';
  content: string;
  timestamp: Date;
}

interface UpcomingAppointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

const Telehealth = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isCalling, setIsCalling] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentAppointment, setCurrentAppointment] = useState<UpcomingAppointment | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [preCallChecks, setPreCallChecks] = useState({
    webcamPermission: false,
    micPermission: false,
    networkStrength: 'good' as 'good' | 'moderate' | 'poor',
  });

  // Mock upcoming appointments data
  const upcomingAppointments: UpcomingAppointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Cardiology',
      doctorImage: '/images/cheerful-ethnic-doctor-with-arms-crossed.jpg',
      date: new Date().toLocaleDateString(),
      time: '2:00 PM',
      status: 'scheduled'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialty: 'Neurology',
      doctorImage: '/images/young-handsome-physician-medical-robe-with-stethoscope.jpg',
      date: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
      time: '10:30 AM',
      status: 'scheduled'
    }
  ];

  // Mock past appointments data
  const pastAppointments = [
    {
      id: '3',
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialty: 'Pediatrics',
      doctorImage: '/images/androgynous-avatar-non-binary-queer-person.jpg',
      date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
      time: '11:00 AM',
      duration: '25 min',
      status: 'completed'
    }
  ];

  // Timer function for call duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (inCall) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [inCall]);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const checkSystemRequirements = () => {
    // Simulate checking webcam and microphone permissions
    setTimeout(() => {
      setPreCallChecks({
        webcamPermission: true,
        micPermission: true,
        networkStrength: 'good',
      });
    }, 1500);
  };

  const startCall = (appointment: UpcomingAppointment) => {
    setCurrentAppointment(appointment);
    setIsCalling(true);
    // Simulate doctor answering after 3 seconds
    setTimeout(() => {
      setIsCalling(false);
      setInCall(true);
      setElapsedTime(0);
      // Add system message
      addSystemMessage(`Call connected with ${appointment.doctorName}`);
    }, 3000);
  };

  const endCall = () => {
    setInCall(false);
    setIsCalling(false);
    addSystemMessage(`Call ended. Duration: ${formatTime(elapsedTime)}`);
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'patient',
      content: messageInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    // Simulate doctor response after 2 seconds
    if (inCall && currentAppointment) {
      setTimeout(() => {
        const doctorResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'doctor',
          content: "I've received your message. Is there anything specific about your symptoms that you'd like to discuss?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, doctorResponse]);
      }, 2000);
    }
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      sender: 'doctor', // Using doctor for system messages
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    addSystemMessage(`Video ${isVideoEnabled ? 'disabled' : 'enabled'}`);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    addSystemMessage(`Microphone ${isAudioEnabled ? 'muted' : 'unmuted'}`);
  };

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ 
        backgroundImage: 'url("/images/blur-hospital.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <PatientSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-6 flex-1 overflow-y-auto relative z-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black drop-shadow-lg shadow-black">Telehealth</h1>
            <p className="text-black drop-shadow-md mt-2">Connect with healthcare professionals through video consultations</p>
          </div>
          
          {/* Main Content */}
          <div className={`bg-white/85 rounded-xl shadow-xl p-6 ${inCall ? 'hidden' : 'block'}`}>
            <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                <TabsTrigger value="past">Past Appointments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="grid gap-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map(appointment => (
                      <Card key={appointment.id} className="shadow-md">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={appointment.doctorImage} alt={appointment.doctorName} />
                                <AvatarFallback>{appointment.doctorName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                                <p className="text-gray-600">{appointment.doctorSpecialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {appointment.date} at {appointment.time}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    Telehealth
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 w-full md:w-auto">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="flex-1 md:flex-auto">
                                    Pre-call Check
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>System Check</DialogTitle>
                                    <DialogDescription>
                                      Verify your camera, microphone, and internet connection before your call.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 mt-4">
                                    <div className="flex items-center justify-between">
                                      <span className="flex items-center gap-2">
                                        <Video className="h-4 w-4" />
                                        <span>Camera Access</span>
                                      </span>
                                      <span className={`text-sm font-medium ${preCallChecks.webcamPermission ? 'text-green-600' : 'text-gray-400'}`}>
                                        {preCallChecks.webcamPermission ? 'Enabled' : 'Not checked'}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="flex items-center gap-2">
                                        <Mic className="h-4 w-4" />
                                        <span>Microphone Access</span>
                                      </span>
                                      <span className={`text-sm font-medium ${preCallChecks.micPermission ? 'text-green-600' : 'text-gray-400'}`}>
                                        {preCallChecks.micPermission ? 'Enabled' : 'Not checked'}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="flex items-center gap-2">
                                        <Settings className="h-4 w-4" />
                                        <span>Network Strength</span>
                                      </span>
                                      <span className={`text-sm font-medium ${
                                        preCallChecks.networkStrength === 'good' ? 'text-green-600' : 
                                        preCallChecks.networkStrength === 'moderate' ? 'text-yellow-600' : 
                                        preCallChecks.networkStrength === 'poor' ? 'text-red-600' : 'text-gray-400'
                                      }`}>
                                        {preCallChecks.networkStrength === 'good' ? 'Good' : 
                                         preCallChecks.networkStrength === 'moderate' ? 'Moderate' : 
                                         preCallChecks.networkStrength === 'poor' ? 'Poor' : 'Not checked'}
                                      </span>
                                    </div>
                                    
                                    <Button className="w-full mt-4 bg-medisync-primary" onClick={checkSystemRequirements}>
                                      Run System Check
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                size="sm" 
                                className="flex-1 md:flex-auto bg-medisync-primary hover:bg-medisync-secondary"
                                onClick={() => startCall(appointment)}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join Call
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No Upcoming Appointments</h3>
                      <p className="text-gray-500 max-w-sm mx-auto mt-2">
                        You don't have any telehealth appointments scheduled. Book an appointment to connect with a doctor.
                      </p>
                      <Button className="mt-4 bg-medisync-primary">
                        Book Appointment
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="grid gap-4">
                  {pastAppointments.length > 0 ? (
                    pastAppointments.map(appointment => (
                      <Card key={appointment.id} className="shadow-md">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={appointment.doctorImage} alt={appointment.doctorName} />
                                <AvatarFallback>{appointment.doctorName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                                <p className="text-gray-600">{appointment.doctorSpecialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                    {appointment.date} at {appointment.time}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                    Duration: {appointment.duration}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 w-full md:w-auto">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 md:flex-auto"
                              >
                                View Summary
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-1 md:flex-auto bg-medisync-primary hover:bg-medisync-secondary"
                              >
                                Book Follow-up
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No Past Telehealth Appointments</h3>
                      <p className="text-gray-500 max-w-sm mx-auto mt-2">
                        You haven't had any telehealth consultations yet.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Calling UI */}
          {isCalling && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={currentAppointment?.doctorImage} alt={currentAppointment?.doctorName} />
                  <AvatarFallback className="bg-medisync-primary text-white text-lg">
                    {currentAppointment?.doctorName[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold text-white mb-2">{currentAppointment?.doctorName}</h2>
                <p className="text-gray-300 mb-8">{currentAppointment?.doctorSpecialty}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-white">Calling...</span>
                </div>
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="rounded-full h-12 w-12 p-0 mt-4"
                  onClick={() => setIsCalling(false)}
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Video Call UI */}
          {inCall && (
            <div className="absolute inset-0 bg-gray-900 z-20 flex flex-col">
              {/* Main video area */}
              <div className="flex-1 relative">
                {/* Doctor's video (main) */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <img 
                    src={currentAppointment?.doctorImage} 
                    alt="Doctor"
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>{formatTime(elapsedTime)}</span>
                  </div>
                </div>
                
                {/* Patient's video (small overlay) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                  {isVideoEnabled ? (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-sm">
                      You (Camera Preview)
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Controls */}
              <div className="h-20 bg-gray-800 flex items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  className={`rounded-full h-12 w-12 ${isAudioEnabled ? 'bg-gray-700' : 'bg-red-500'}`}
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className={`rounded-full h-12 w-12 ${isVideoEnabled ? 'bg-gray-700' : 'bg-red-500'}`}
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="icon"
                  className="rounded-full h-12 w-12 bg-red-500"
                  onClick={endCall}
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className={`rounded-full h-12 w-12 ${isChatOpen ? 'bg-blue-500' : 'bg-gray-700'}`}
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full h-12 w-12 bg-gray-700"
                >
                  <FileUp className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Chat sidebar */}
              {isChatOpen && (
                <div className="absolute right-0 top-0 bottom-20 w-80 bg-white shadow-xl flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium">Chat</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setIsChatOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'patient' 
                              ? 'bg-medisync-primary text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-gray-200">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input 
                        placeholder="Type a message..." 
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                      />
                      <Button type="submit" size="icon" className="bg-medisync-primary">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Telehealth; 