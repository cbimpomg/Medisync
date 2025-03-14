import { useState } from 'react';
import { Send, Brain, AlertCircle, Info } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Recommendation {
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

const SymptomChecker = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m MediSync AI Assistant. Please describe any symptoms you\'re experiencing, and I\'ll try to help you understand what might be happening and suggest next steps.',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      // Example response based on symptoms mentioned
      let responseContent = '';
      let newRecommendations: Recommendation[] = [];
      
      if (input.toLowerCase().includes('headache') || input.toLowerCase().includes('head pain')) {
        responseContent = "Based on your description of headache, there are several possible causes including tension, migraines, dehydration, or stress. Without additional symptoms, it's likely not serious, but consistent or severe headaches should be evaluated.";
        newRecommendations = [
          {
            title: 'Rest and Hydration',
            description: 'Drink plenty of water and rest in a quiet, dark room.',
            urgency: 'low',
            icon: <Info className="h-5 w-5 text-blue-500" />
          },
          {
            title: 'Over-the-counter Pain Relief',
            description: 'Consider taking acetaminophen or ibuprofen if appropriate for you.',
            urgency: 'low',
            icon: <Info className="h-5 w-5 text-blue-500" />
          }
        ];
      } else if (input.toLowerCase().includes('fever') || input.toLowerCase().includes('temperature')) {
        responseContent = "Fever is often a sign that your body is fighting an infection. Common causes include viral infections like the flu, bacterial infections, or inflammatory conditions.";
        newRecommendations = [
          {
            title: 'Monitor Temperature',
            description: 'Keep track of your temperature readings and how long the fever persists.',
            urgency: 'medium',
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
          },
          {
            title: 'Consult Healthcare Provider',
            description: 'If fever persists over 3 days or exceeds 103°F (39.4°C), contact your doctor.',
            urgency: 'medium',
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
          }
        ];
      } else if (input.toLowerCase().includes('chest pain') || input.toLowerCase().includes('heart')) {
        responseContent = "Chest pain can be caused by various conditions ranging from muscle strain to serious cardiac issues. It should be taken seriously, especially if accompanied by shortness of breath, sweating, or pain radiating to the arm or jaw.";
        newRecommendations = [
          {
            title: 'Seek Immediate Medical Attention',
            description: 'Chest pain, especially with shortness of breath or radiating pain, requires immediate medical care.',
            urgency: 'high',
            icon: <AlertCircle className="h-5 w-5 text-red-500" />
          }
        ];
      } else {
        responseContent = "Thank you for sharing your symptoms. While I can provide general information, a proper diagnosis requires a healthcare professional. Based on what you've told me, I recommend monitoring your symptoms and considering a consultation with your doctor if they persist or worsen.";
        newRecommendations = [
          {
            title: 'Monitor Symptoms',
            description: 'Keep track of your symptoms, including when they occur and what makes them better or worse.',
            urgency: 'low',
            icon: <Info className="h-5 w-5 text-blue-500" />
          },
          {
            title: 'Consider Consultation',
            description: 'If symptoms persist for more than a few days, consider scheduling an appointment with your doctor.',
            urgency: 'medium',
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
          }
        ];
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setRecommendations(newRecommendations);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        {/* Main Content */}
        <div className="p-6 flex-1 overflow-y-auto relative z-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg shadow-black">AI Symptom Checker</h1>
            <p className="text-white drop-shadow-md mt-2">Describe your symptoms to get AI-powered insights and recommendations</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Section */}
            <div className="lg:col-span-2">
              <Card className="bg-white/85 shadow-xl h-[calc(100vh-220px)] flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/images/ai-avatar.png" alt="AI" />
                      <AvatarFallback className="bg-medisync-primary text-white">AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>MediSync AI Assistant</CardTitle>
                      <CardDescription>Powered by advanced medical knowledge</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto py-4 px-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user' 
                              ? 'bg-medisync-primary text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-sm text-gray-500">MediSync AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Describe your symptoms..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="resize-none"
                      rows={2}
                    />
                    <Button 
                      className="bg-medisync-primary hover:bg-medisync-secondary" 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <p>This is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.</p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Recommendations & Info Section */}
            <div>
              <Tabs defaultValue="recommendations" className="bg-white/85 shadow-xl rounded-lg">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="info">About</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recommendations" className="p-4">
                  <h3 className="font-semibold text-lg mb-3">Based on your symptoms</h3>
                  
                  {recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <Card key={index} className="shadow-sm">
                          <CardContent className="p-3">
                            <div className="flex gap-3 items-start">
                              <div className="mt-1">{rec.icon}</div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{rec.title}</h4>
                                  <Badge 
                                    className={
                                      rec.urgency === 'high' ? 'bg-red-500' : 
                                      rec.urgency === 'medium' ? 'bg-yellow-500' : 
                                      'bg-blue-500'
                                    }
                                  >
                                    {rec.urgency === 'high' ? 'Urgent' : 
                                     rec.urgency === 'medium' ? 'Moderate' : 
                                     'Low Urgency'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{rec.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Brain className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      <p>Describe your symptoms to get personalized recommendations</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="info" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">About this tool</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        The AI Symptom Checker uses advanced natural language processing to help understand your symptoms and provide general health information.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold">Important Disclaimer</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        This tool is for informational purposes only and is not a qualified medical opinion. It does not provide medical advice, diagnosis or treatment.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">When to seek medical help</h3>
                      <ul className="text-sm text-gray-600 mt-1 list-disc pl-5 space-y-1">
                        <li>Severe or sudden onset symptoms</li>
                        <li>Difficulty breathing or chest pain</li>
                        <li>Severe headache or confusion</li>
                        <li>Uncontrolled bleeding</li>
                        <li>Severe allergic reactions</li>
                        <li>Persistent high fever</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Card className="bg-white/85 shadow-xl mt-4">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Emergency Warning</h3>
                      <p className="text-sm text-gray-700">
                        If you're experiencing a medical emergency, call emergency services (911) immediately or go to your nearest emergency room.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker; 