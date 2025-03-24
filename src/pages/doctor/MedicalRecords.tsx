import { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText, Calendar, Upload, Download, Eye } from 'lucide-react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { patientService } from '@/lib/services/patientService';
import { MedicalRecord, medicalRecordService } from '@/lib/services/medicalRecordService';
import { useAuth } from '@/hooks/useAuth';



const recordTypes = [
  "Lab Result",
  "Imaging",
  "Clinical Note",
  "Surgical Report",
  "Vaccination",
  "Allergy Test",
  "Physical Exam"
];

const DoctorMedicalRecords = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    const unsubscribe = medicalRecordService.subscribeToMedicalRecords((records) => {
      setMedicalRecords(records);
    });

    return () => unsubscribe();
  }, []);

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || record.recordType === typeFilter;
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'abnormal' && record.status === 'Abnormal') ||
      (selectedTab === 'normal' && record.status === 'Normal');
    return matchesSearch && matchesType && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'abnormal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [formData, setFormData] = useState({
    patientId: '',
    recordType: '',
    category: '',
    summary: '',
    attachments: [] as File[]
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const allPatients = await patientService.getAllPatients();
        setPatients(allPatients.map(patient => ({
          id: patient.id,
          name: patient.name
        })));
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRecord: Omit<MedicalRecord, 'id'> = {
        patientName: patients.find(p => p.id === formData.patientId)?.name || 'Unknown Patient',
        patientId: formData.patientId,
        recordType: formData.recordType,
        category: formData.category,
        date: new Date().toISOString().split('T')[0],
        status: 'Normal',
        provider: user?.displayName || 'Unknown Doctor',
        summary: formData.summary,
        attachments: formData.attachments.map(file => file.name)
      };

      await medicalRecordService.createMedicalRecord(newRecord);
      
      // Reset form
      setFormData({
        patientId: '',
        recordType: '',
        category: '',
        summary: '',
        attachments: []
      });
    } catch (error) {
      console.error('Error creating medical record:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
              <p className="text-gray-600">View and manage patient medical records</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-medisync-primary hover:bg-medisync-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Medical Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient">Patient</Label>
                      <Select
                        value={formData.patientId}
                        onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="recordType">Record Type</Label>
                      <Select
                        value={formData.recordType}
                        onValueChange={(value) => setFormData({ ...formData, recordType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {recordTypes.map(type => (
                            <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Blood Test, X-Ray, etc."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      placeholder="Enter record summary or findings"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Attachments</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">
                        Drag and drop files here, or click to select files
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit">Save Record</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search records..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Record Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {recordTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="all" onValueChange={setSelectedTab}>
                    <TabsList>
                      <TabsTrigger value="all">All Records</TabsTrigger>
                      <TabsTrigger value="normal">Normal</TabsTrigger>
                      <TabsTrigger value="abnormal">Abnormal</TabsTrigger>
                    </TabsList>

                    <div className="mt-6 space-y-4">
                      {filteredRecords.map((record) => (
                        <div 
                          key={record.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{record.patientName}</h3>
                                <span className="text-sm text-gray-500">({record.patientId})</span>
                              </div>
                              <p className="text-sm font-medium mt-1">{record.recordType} - {record.category}</p>
                              <p className="text-sm text-gray-500">
                                {record.date} • {record.provider}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                            {record.attachments.length > 0 && (
                              <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default DoctorMedicalRecords;