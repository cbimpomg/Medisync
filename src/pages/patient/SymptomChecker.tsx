/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Send, Brain, AlertCircle, Info } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { symptomService, SymptomAssessment, RecommendedAction } from "@/lib/services/symptomService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Recommendation {
  title: string;
  description: string;
  urgency: 'immediate' | 'soon' | 'routine';
  icon: React.ReactNode;
}

const SymptomChecker = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Hello! I\'m MediSync AI Assistant. Please describe any symptoms you\'re experiencing, and I\'ll try to help you understand what might be happening and suggest next steps.',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<SymptomAssessment[]>([]);
  const [currentStep, setCurrentStep] = useState<'initial' | 'gathering' | 'analyzing'>('initial');
  const [symptomDetails, setSymptomDetails] = useState<{
    duration?: string;
    severity?: 'mild' | 'moderate' | 'severe';
    frequency?: 'constant' | 'intermittent' | 'periodic';
  }>({});
  
  // Fetch assessment history when user is loaded
  useEffect(() => {
    if (user) {
      let retryCount = 0;
      const maxRetries = 3;
      const retryDelay = 2000; // Start with 2 seconds

      const fetchAssessmentHistory = async () => {
        try {
          const history = await symptomService.getAssessmentHistory(user.uid);
          setAssessmentHistory(history);
          setIsLoading(false);
        } catch (error: any) {
          console.error('Error fetching assessment history:', error);
          
          // Check if it's a connection error
          if (!error.response && retryCount < maxRetries) {
            retryCount++;
            const delay = retryDelay * Math.pow(2, retryCount - 1); // Exponential backoff
            
            toast({
              title: 'Connection Issue',
              description: `Attempting to reconnect (${retryCount}/${maxRetries})...`,
              variant: 'default'
            });

            // Retry after delay
            setTimeout(fetchAssessmentHistory, delay);
          } else {
            setIsLoading(false);
            toast({
              title: 'Connection Error',
              description: 'Unable to connect to the server. Please check if the backend server is running.',
              variant: 'destructive'
            });
          }
        }
      };
      
      fetchAssessmentHistory();
    }
  }, [user]);

  // Add loading state for better UX during retries
  // const [isLoading, setIsLoading] = useState(true);
  
  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      let aiResponse = '';
      let assessment;
      if (currentStep === 'initial') {
        aiResponse = 'Thank you for describing your symptoms. To better understand your condition, could you tell me how long you\'ve been experiencing these symptoms?';
        setCurrentStep('gathering');
      } else if (currentStep === 'gathering' && !symptomDetails.duration) {
        setSymptomDetails(prev => ({ ...prev, duration: input }));
        aiResponse = 'How would you rate the severity of your symptoms? (mild, moderate, or severe)?';
      } else if (currentStep === 'gathering' && !symptomDetails.severity) {
        setSymptomDetails(prev => ({ ...prev, severity: input.toLowerCase() as 'mild' | 'moderate' | 'severe' }));
        aiResponse = 'Do these symptoms occur constantly, intermittently, or periodically?';
      } else if (currentStep === 'gathering' && !symptomDetails.frequency) {
        setSymptomDetails(prev => ({ ...prev, frequency: input.toLowerCase() as 'constant' | 'intermittent' | 'periodic' }));
        setCurrentStep('analyzing');
        
        // Submit complete symptom assessment
        assessment = await symptomService.submitSymptoms({
          patientId: user.uid,
          symptoms: [userMessage.content],
          description: `Symptoms: ${userMessage.content}\nDuration: ${symptomDetails.duration}\nSeverity: ${symptomDetails.severity}\nFrequency: ${input}`
        });
      } else {
        // Submit symptoms to the backend service
        assessment = await symptomService.submitSymptoms({
          patientId: user.uid,
          symptoms: [input],
          description: input
        });
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: currentStep === 'analyzing' && assessment?.analysis ? 
          (assessment.analysis.possibleConditions || []).map(condition => 
            `${condition.name}: ${condition.description} (Probability: ${condition.probability})`
          ).join('\n\n') + '\n\nRecommendations:\n' + 
          (assessment.analysis.recommendedActions || []).map(action => 
            `- ${action.title}: ${action.description}`
          ).join('\n') :
          aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Convert service recommendations to UI recommendations
      const uiRecommendations: Recommendation[] = (assessment?.analysis?.recommendedActions || []).map(rec => ({
        title: rec.title,
        description: rec.description,
        urgency: rec.urgency,
        icon: rec.urgency === 'immediate' ? 
          <AlertCircle className="h-5 w-5 text-red-500" /> : 
          rec.urgency === 'soon' ? 
            <AlertCircle className="h-5 w-5 text-yellow-500" /> : 
            <Info className="h-5 w-5 text-blue-500" />
      }));
      
      setRecommendations(uiRecommendations);
      
      toast({
        title: "Assessment Complete",
        description: "Your symptoms have been analyzed.",
        variant: "default"
      });
     
    } catch (error: any) {
      console.error('Error processing symptoms:', error);
      
      // Add error message with more specific feedback
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: error.message?.includes('Unable to connect') ?
          "I'm having trouble connecting to the medical analysis service. Please check your internet connection and try again." :
          "I'm sorry, but I encountered an error while analyzing your symptoms. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error.message?.includes('Unable to connect') ?
          "Connection failed. Please check your internet connection." :
          "Failed to process your symptoms. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold text-black drop-shadow-lg shadow-black">AI Symptom Checker</h1>
            <p className="text-black drop-shadow-md mt-2">Describe your symptoms to get AI-powered insights and recommendations</p>
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
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
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
                                      rec.urgency === 'immediate' ? 'bg-red-500' : 
                                      rec.urgency === 'soon' ? 'bg-yellow-500' : 
                                      'bg-blue-500'
                                    }
                                  >
                                    {rec.urgency === 'immediate' ? 'Urgent' : 
                                     rec.urgency === 'soon' ? 'Moderate' : 
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
                
                <TabsContent value="history" className="p-4">
                  <h3 className="font-semibold text-lg mb-3">Previous Assessments</h3>
                  
                  {assessmentHistory.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {assessmentHistory.map((assessment) => (
                        <Card key={assessment.id} className="shadow-sm">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">
                                  {assessment.symptoms?.map(s => s.name).join(', ') || 'No symptoms recorded'}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {assessment.createdAt instanceof Date ? 
                                    `${assessment.createdAt.toLocaleDateString()} at ${assessment.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` :
                                    'Date not available'}
                                </p>
                              </div>
                              <Badge 
                                className={`${assessment?.analysis?.severity === 'high' ? 'bg-red-500' : 
                                assessment?.analysis?.severity === 'medium' ? 'bg-yellow-500' : 
                                assessment?.analysis?.severity === 'low' ? 'bg-blue-500' : 'bg-gray-500'}`}
                              >
                                {assessment?.analysis?.severity === 'high' ? 'Urgent' : 
                                 assessment?.analysis?.severity === 'medium' ? 'Moderate' : 
                                 assessment?.analysis?.severity === 'low' ? 'Low Urgency' : 'None'}
                              </Badge>
                            </div>
                            
                            <Separator className="my-2" />
                            
                            <div className="text-sm">
                              <p className="font-medium">Possible conditions:</p>
                              <ul className="list-disc pl-5 mt-1 text-gray-600 text-xs">
                                {assessment?.analysis?.possibleConditions?.slice(0, 3).map((condition, idx) => (
                                  <li key={idx}>{condition.name}</li>
                                )) || <li>No conditions available</li>}
                                {assessment?.analysis?.possibleConditions?.length > 3 && (
                                  <li>+ {assessment.analysis.possibleConditions.length - 3} more</li>
                                )}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No previous assessments found</p>
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