import { useState, useEffect } from 'react';
import { FileText, Download, Filter, Search, Calendar, User, File, PlusCircle, Heart, Activity, Thermometer } from 'lucide-react';
import { medicalRecordService } from '@/lib/services/medicalRecordService';
import type { MedicalRecord } from '@/lib/services/medicalRecordService';
import { vitalsService } from '@/lib/services/vitalsService';
import type { VitalSigns } from '@/lib/services/vitalsService';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Using MedicalRecord interface from medicalRecordService

interface VitalSign {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'blood_glucose' | 'weight';
  value: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
}

const getTypeIcon = (recordType: string) => {
  switch (recordType) {
    case 'lab':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'imaging':
      return <File className="h-5 w-5 text-purple-500" />;
    case 'visit':
      return <User className="h-5 w-5 text-green-500" />;
    case 'surgical':
      return <Heart className="h-5 w-5 text-red-500" />;
    case 'vaccination':
      return <PlusCircle className="h-5 w-5 text-orange-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};



const getVitalSignIcon = (type: string) => {
  switch (type) {
    case 'blood_pressure':
      return <Activity className="h-5 w-5 text-blue-500" />;
    case 'heart_rate':
      return <Heart className="h-5 w-5 text-red-500" />;
    case 'temperature':
      return <Thermometer className="h-5 w-5 text-orange-500" />;
    default:
      return <Activity className="h-5 w-5 text-gray-500" />;
  }
};



const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);

  useEffect(() => {
    const unsubscribe = medicalRecordService.subscribeToMedicalRecords((records) => {
      setMedicalRecords(records);
      setLoading(false);
    });

    // Fetch vital signs
    const fetchVitalSigns = async () => {
      try {
        const vitals = await vitalsService.getPatientVitals('current-patient-id'); // Replace with actual patient ID
        setVitalSigns(vitals.map(vital => ({
          id: vital.id,
          type: 'heart_rate', // Map the type based on vital data
          value: vital.heartRate,
          date: new Date(vital.timestamp).toISOString(),
          trend: 'stable' // Determine trend based on historical data
        })));
      } catch (err) {
        console.error('Error fetching vital signs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vital signs');
      }
    };

    fetchVitalSigns();
    return () => unsubscribe();
  }, []);

  // Filter records based on search query and filters
  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = 
      record.recordType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || record.recordType === categoryFilter;
    
    const matchesDate = dateFilter === 'all' || (
      dateFilter === 'last30days' && 
      new Date(record.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) || (
      dateFilter === 'last6months' && 
      new Date(record.date) >= new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    );
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Format date string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  function getTypeDisplayName(recordType: string): import("react").ReactNode {
    switch (recordType) {
      case 'lab':
        return 'Lab Results';
      case 'imaging':
        return 'Imaging';
      case 'visit':
        return 'Doctor Visit';
      case 'surgical':
        return 'Surgical Report';
      case 'vaccination':
        return 'Vaccination';
      default:
        return recordType.charAt(0).toUpperCase() + recordType.slice(1);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ 
      backgroundImage: 'url("/images/blur-hospital.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <PatientSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-6 flex-1 overflow-y-auto relative z-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black drop-shadow-lg shadow-black">Medical Records</h1>
            <p className="text-black drop-shadow-md mt-2">Access and manage your complete health information</p>
          </div>
          
          {/* Main Content */}
          <div className="bg-white/85 rounded-xl shadow-xl p-6">
            <Tabs defaultValue="records" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="records">Medical Records</TabsTrigger>
                <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="records">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search medical records..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="lab">Lab Results</SelectItem>
                        <SelectItem value="imaging">Imaging</SelectItem>
                        <SelectItem value="visit">Doctor Visits</SelectItem>
                        <SelectItem value="surgical">Surgical</SelectItem>
                        <SelectItem value="vaccination">Vaccinations</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="last30days">Last 30 Days</SelectItem>
                        <SelectItem value="last6months">Last 6 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Medical Records List */}
                <div className="space-y-4">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map(record => (
                      <Card key={record.id} className="shadow-md">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                              <div className="mt-1">
                                {getTypeIcon(record.recordType)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{record.patientName}</h3>
                                <p className="text-sm text-gray-600 mb-1">{record.provider}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {getTypeDisplayName(record.recordType)}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                    {formatDate(record.date)}
                                  </Badge>
                                  <Badge variant={record.status === 'Normal' ? 'outline' : 'secondary'} 
                                         className={`text-xs ${record.status === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                                record.status === 'Abnormal' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                                'bg-green-50 text-green-700 border-green-200'}`}>
                                    {record.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{record.summary}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="flex-1">
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{record.patientName}</DialogTitle>
                                    <DialogDescription>
                                      {record.provider} - {formatDate(record.date)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="mt-6 space-y-4">
                                    <div>
                                      <h4 className="font-medium text-gray-700 mb-1">Summary</h4>
                                      <p className="text-gray-600">{record.summary}</p>
                                    </div>
                                    
                                    {record.attachments && record.attachments.length > 0 && (
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
                                        <div className="flex gap-2">
                                          {record.attachments.map((attachment, index) => (
                                            <Button key={index} variant="outline" className="flex items-center gap-2">
                                              <Download className="h-4 w-4" />
                                              Download Attachment {index + 1}
                                            </Button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No medical records found
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="vitals">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {vitalSigns.map(vital => (
                    <Card key={vital.id} className="shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full bg-gray-100">
                            {getVitalSignIcon(vital.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{getTypeDisplayName(vital.type)}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-semibold">{vital.value}</span>
                              {vital.trend === 'up' && <span className="text-red-500">↑</span>}
                              {vital.trend === 'down' && <span className="text-green-500">↓</span>}
                              {vital.trend === 'stable' && <span className="text-gray-500">→</span>}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Last Updated: {formatDate(vital.date)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-end mb-6">
                  <Button className="bg-medisync-primary hover:bg-medisync-secondary flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Vital Signs
                  </Button>
                </div>
                
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Vital Signs History</CardTitle>
                    <CardDescription>
                      Track your vital signs over time. Regular monitoring helps identify health trends.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <p>Visualization charts for vital sign trends will appear here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;