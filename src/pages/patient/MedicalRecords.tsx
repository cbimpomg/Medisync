import { useState } from 'react';
import { FileText, Download, Filter, Search, Calendar, User, File, PlusCircle, Heart } from 'lucide-react';
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

interface MedicalRecord {
  id: string;
  type: 'lab' | 'imaging' | 'visit' | 'surgical' | 'vaccination';
  title: string;
  provider: string;
  date: string;
  summary: string;
  fileUrl?: string;
  results?: {
    name: string;
    value: string;
    unit?: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
}

interface VitalSign {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'blood_glucose' | 'weight';
  value: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
}

const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  
  // Medical records mock data
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      type: 'lab',
      title: 'Complete Blood Count (CBC)',
      provider: 'MediSync Laboratory',
      date: '2023-10-15',
      summary: 'Routine blood test as part of annual physical examination.',
      fileUrl: '/files/cbc_report.pdf',
      results: [
        { name: 'White Blood Cell Count', value: '7.2', unit: 'K/µL', status: 'normal' },
        { name: 'Red Blood Cell Count', value: '4.8', unit: 'M/µL', status: 'normal' },
        { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', status: 'normal' },
        { name: 'Hematocrit', value: '42.1', unit: '%', status: 'normal' },
        { name: 'Platelet Count', value: '253', unit: 'K/µL', status: 'normal' }
      ]
    },
    {
      id: '2',
      type: 'imaging',
      title: 'Chest X-Ray',
      provider: 'MediSync Radiology Dept',
      date: '2023-09-22',
      summary: 'Chest X-Ray to evaluate right-sided chest pain.',
      fileUrl: '/files/chest_xray.pdf'
    },
    {
      id: '3',
      type: 'visit',
      title: 'Annual Physical Examination',
      provider: 'Dr. Sarah Johnson',
      date: '2023-10-15',
      summary: 'Routine annual physical examination. Overall health is good. Recommended lifestyle changes discussed.'
    },
    {
      id: '4',
      type: 'lab',
      title: 'Lipid Panel',
      provider: 'MediSync Laboratory',
      date: '2023-10-15',
      summary: 'Lipid panel to assess cardiovascular risk factors.',
      results: [
        { name: 'Total Cholesterol', value: '195', unit: 'mg/dL', status: 'normal' },
        { name: 'LDL Cholesterol', value: '131', unit: 'mg/dL', status: 'abnormal' },
        { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', status: 'normal' },
        { name: 'Triglycerides', value: '150', unit: 'mg/dL', status: 'normal' }
      ]
    },
    {
      id: '5',
      type: 'vaccination',
      title: 'Annual Flu Vaccine',
      provider: 'MediSync Clinic',
      date: '2023-09-01',
      summary: 'Annual influenza vaccine administered.'
    },
    {
      id: '6',
      type: 'surgical',
      title: 'Appendectomy',
      provider: 'MediSync Hospital - Dr. Michael Chen',
      date: '2021-03-14',
      summary: 'Laparoscopic appendectomy for acute appendicitis. No complications.'
    }
  ];
  
  // Vital signs mock data
  const vitalSigns: VitalSign[] = [
    { id: '1', type: 'blood_pressure', value: '120/80 mmHg', date: '2023-10-15', trend: 'stable' },
    { id: '2', type: 'heart_rate', value: '72 bpm', date: '2023-10-15', trend: 'down' },
    { id: '3', type: 'temperature', value: '98.6°F', date: '2023-10-15', trend: 'stable' },
    { id: '4', type: 'weight', value: '170 lbs', date: '2023-10-15', trend: 'up' },
    { id: '5', type: 'blood_glucose', value: '95 mg/dL', date: '2023-10-15', trend: 'down' }
  ];
  
  // Get type display name
  const getTypeDisplayName = (type: string) => {
    switch(type) {
      case 'lab': return 'Lab Results';
      case 'imaging': return 'Imaging';
      case 'visit': return 'Doctor Visit';
      case 'surgical': return 'Surgical Procedure';
      case 'vaccination': return 'Vaccination';
      case 'blood_pressure': return 'Blood Pressure';
      case 'heart_rate': return 'Heart Rate';
      case 'temperature': return 'Body Temperature';
      case 'blood_glucose': return 'Blood Glucose';
      case 'weight': return 'Weight';
      default: return type;
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'lab': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'imaging': return <FileText className="h-5 w-5 text-purple-500" />;
      case 'visit': return <User className="h-5 w-5 text-green-500" />;
      case 'surgical': return <FileText className="h-5 w-5 text-red-500" />;
      case 'vaccination': return <FileText className="h-5 w-5 text-orange-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get vital sign icon
  const getVitalSignIcon = (type: string) => {
    switch(type) {
      case 'blood_pressure': return <Heart className="h-5 w-5 text-red-500" />;
      case 'heart_rate': return <Heart className="h-5 w-5 text-red-500" />;
      case 'temperature': return <FileText className="h-5 w-5 text-orange-500" />;
      case 'blood_glucose': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'weight': return <User className="h-5 w-5 text-green-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Filter records based on search query and filters
  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || record.type === categoryFilter;
    
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
                      <Card key={record.id} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                              <div className="mt-1">
                                {getTypeIcon(record.type)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{record.title}</h3>
                                <p className="text-sm text-gray-600 mb-1">{record.provider}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {getTypeDisplayName(record.type)}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                    {formatDate(record.date)}
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
                                    <DialogTitle>{record.title}</DialogTitle>
                                    <DialogDescription>
                                      {record.provider} - {formatDate(record.date)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="mt-6 space-y-4">
                                    <div>
                                      <h4 className="font-medium text-gray-700 mb-1">Summary</h4>
                                      <p className="text-gray-600">{record.summary}</p>
                                    </div>
                                    
                                    {record.results && record.results.length > 0 && (
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Results</h4>
                                        <div className="bg-gray-50 rounded-md border border-gray-200">
                                          <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                              <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                              {record.results.map((result, index) => (
                                                <tr key={index}>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.name}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {result.value} {result.unit}
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                      result.status === 'normal' ? 'bg-green-100 text-green-800' :
                                                      result.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                                                      'bg-red-100 text-red-800'
                                                    }`}>
                                                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                                                    </span>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {record.fileUrl && (
                                      <div className="flex justify-end">
                                        <Button variant="outline" className="flex items-center gap-2">
                                          <Download className="h-4 w-4" />
                                          Download Report
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              {record.fileUrl && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="flex items-center gap-1"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No Records Found</h3>
                      <p className="text-gray-500 max-w-sm mx-auto mt-2">
                        {searchQuery || categoryFilter !== 'all' || dateFilter !== 'all' 
                          ? "No records match your current filters. Try adjusting your search criteria."
                          : "You don't have any medical records yet. Records will appear here after your visits or tests."}
                      </p>
                      {(searchQuery || categoryFilter !== 'all' || dateFilter !== 'all') && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('all');
                            setDateFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
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