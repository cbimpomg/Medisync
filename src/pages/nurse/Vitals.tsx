import { useState, useEffect } from 'react';
import { Search, Activity, Heart, Thermometer, Wind, Plus, History, AlertCircle } from 'lucide-react';
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { patientService } from '@/lib/services/patientService';
import { vitalsService } from '@/lib/services/vitalsService';
import type { VitalSigns } from '@/lib/services/vitalsService';
import type { Patient } from '@/lib/services/patientService';

const NurseVitals = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vitals, setVitals] = useState<Array<VitalSigns & { patientName: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    pain: '',
    notes: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const allPatients = await patientService.getAllPatients();
        setPatients(allPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to load patients. Please try again later.",
          variant: "destructive"
        });
      }
    };

    // Subscribe to vitals updates
    const unsubscribe = vitalsService.subscribeToVitals((updatedVitals) => {
      const formattedVitals = updatedVitals.map(vital => ({
        ...vital,
        timestamp: new Date(vital.timestamp),
        patientName: patients.find(p => p.id === vital.patientId)?.name || 'Unknown Patient'
      }));
      setVitals(formattedVitals);
      setIsLoading(false);
    }, (error) => {
      console.error('Error in vitals subscription:', error);
      toast({
        title: "Error",
        description: "Failed to load vitals. Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
    });

    fetchPatients();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [patients]);

  const filteredVitals = vitals.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'abnormal':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVitalStatus = (vital: string, value: string) => {
    let temp: number;
    let hr: number;
    let o2: number;

    switch (vital) {
      case 'temperature':
        temp = parseFloat(value);
        return temp >= 38.0 ? 'text-red-600' : temp <= 35.0 ? 'text-blue-600' : 'text-green-600';
      case 'heartRate':
        hr = parseInt(value);
        return hr > 100 ? 'text-red-600' : hr < 60 ? 'text-blue-600' : 'text-green-600';
      case 'oxygenSaturation':
        o2 = parseInt(value);
        return o2 < 95 ? 'text-red-600' : 'text-green-600';
      default:
        return 'text-gray-900';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user?.uid) {
      toast({
        title: "Error",
        description: "You must be logged in to record vitals.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.patientId) {
      toast({
        title: "Error",
        description: "Please select a patient.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const vitalData: Omit<VitalSigns, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId: formData.patientId,
        recordedBy: user.uid,
        timestamp: new Date(),
        temperature: formData.temperature,
        bloodPressure: formData.bloodPressure,
        heartRate: formData.heartRate,
        respiratoryRate: formData.respiratoryRate,
        oxygenSaturation: formData.oxygenSaturation,
        pain: formData.pain,
        status: vitalsService.determineVitalStatus({
          temperature: formData.temperature,
          bloodPressure: formData.bloodPressure,
          heartRate: formData.heartRate,
          respiratoryRate: formData.respiratoryRate,
          oxygenSaturation: formData.oxygenSaturation
        }),
        notes: formData.notes
      };

      await vitalsService.recordVitals(vitalData);
      
      toast({
        title: "Success",
        description: "Vitals recorded successfully."
      });

      // Reset form and close dialog
      setFormData({
        patientId: '',
        temperature: '',
        bloodPressure: '',
        heartRate: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        pain: '',
        notes: ''
      });
      setDialogOpen(false);

      // Refresh vitals list
      const updatedVitals = await vitalsService.getAllVitals();
      const formattedVitals = updatedVitals.map(vital => ({
        ...vital,
        timestamp: new Date(vital.timestamp),
        patientName: patients.find(p => p.id === vital.patientId)?.name || 'Unknown Patient'
      }));
      setVitals(formattedVitals);
    } catch (error) {
      console.error('Error recording vitals:', error);
      toast({
        title: "Error",
        description: "Failed to record vitals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <NurseSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <NurseSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Vitals</h1>
              <p className="text-gray-600">Record and monitor patient vital signs</p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-medisync-primary hover:bg-medisync-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Record New Vitals
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Record Patient Vitals</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="patient">Patient</Label>
                    <Select value={formData.patientId} onValueChange={(value) => handleInputChange('patientId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input 
                        id="temperature" 
                        placeholder="e.g., 37.2" 
                        value={formData.temperature}
                        onChange={(e) => handleInputChange('temperature', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodPressure">Blood Pressure</Label>
                      <Input 
                        id="bloodPressure" 
                        placeholder="e.g., 120/80" 
                        value={formData.bloodPressure}
                        onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input 
                        id="heartRate" 
                        placeholder="e.g., 72" 
                        value={formData.heartRate}
                        onChange={(e) => handleInputChange('heartRate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                      <Input 
                        id="respiratoryRate" 
                        placeholder="e.g., 16" 
                        value={formData.respiratoryRate}
                        onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="oxygenSaturation">O2 Saturation (%)</Label>
                      <Input 
                        id="oxygenSaturation" 
                        placeholder="e.g., 98" 
                        value={formData.oxygenSaturation}
                        onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pain">Pain Level (0-10)</Label>
                      <Input 
                        id="pain" 
                        placeholder="e.g., 2" 
                        value={formData.pain}
                        onChange={(e) => handleInputChange('pain', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input 
                      id="notes" 
                      placeholder="Add any relevant notes or observations" 
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Vitals'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
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
                        placeholder="Search vitals..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="abnormal">Abnormal</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-600">Normal</p>
                      <p className="text-2xl font-bold text-green-700">
                        {vitals.filter(v => v.status === 'Normal').length}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-600">Abnormal</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {vitals.filter(v => v.status === 'Abnormal').length}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-red-600">Critical</p>
                      <p className="text-2xl font-bold text-red-700">
                        {vitals.filter(v => v.status === 'Critical').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vitals List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredVitals.map((vital) => (
                  <Card key={vital.id} className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{vital.patientName}</h3>
                            <Badge className={getStatusColor(vital.status)}>
                              {vital.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            Recorded: {vital.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Temperature</span>
                          </div>
                          <p className={`font-medium ${getVitalStatus('temperature', vital.temperature)}`}>
                            {vital.temperature}°C
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Blood Pressure</span>
                          </div>
                          <p className="font-medium text-gray-900">{vital.bloodPressure} mmHg</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Heart Rate</span>
                          </div>
                          <p className={`font-medium ${getVitalStatus('heartRate', vital.heartRate)}`}>
                            {vital.heartRate} bpm
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Respiratory Rate</span>
                          </div>
                          <p className="font-medium text-gray-900">{vital.respiratoryRate} /min</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">O2 Saturation</span>
                          </div>
                          <p className={`font-medium ${getVitalStatus('oxygenSaturation', vital.oxygenSaturation)}`}>
                            {vital.oxygenSaturation}%
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Pain Level</span>
                          </div>
                          <p className="font-medium text-gray-900">{vital.pain}/10</p>
                        </div>
                      </div>

                      {vital.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-500">{vital.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseVitals;