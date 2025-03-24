import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Activity, Heart, ClipboardList } from 'lucide-react';
import { patientService, Patient } from '@/lib/services/patientService';
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";



const NursePatients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = patientService.subscribeToPatients((updatedPatients) => {
      setPatients(updatedPatients);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      (patient.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.status || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = conditionFilter === 'all' || patient.status?.toLowerCase() === conditionFilter.toLowerCase();
    return matchesSearch && matchesCondition;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <NurseSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
              <p className="text-gray-600">Manage and monitor patient care</p>
            </div>
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
                        placeholder="Search patients..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Condition</label>
                    <Select value={conditionFilter} onValueChange={setConditionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-600">Active</p>
                      <p className="text-2xl font-bold text-green-700">
                        {patients.filter(p => p.status?.toLowerCase() === 'active').length}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-red-600">Inactive</p>
                      <p className="text-2xl font-bold text-red-700">
                        {patients.filter(p => p.status?.toLowerCase() === 'inactive').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-lg">{patient.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{patient.name}</h3>
                              <Badge className={getStatusColor(patient.status || 'unknown')}>
                                {patient.status || 'Unknown'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Registered: {patient.registrationDate || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {patient.email} • {patient.phone}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-sm text-gray-500">Next Checkup: {patient.nextCheckup}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Activity className="h-4 w-4" />
                              Vitals
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Heart className="h-4 w-4" />
                              Care Plan
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                              <ClipboardList className="h-4 w-4" />
                              Tasks
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Vitals Summary */}
                      <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-500">Temperature</p>
                          <p className="font-medium">{patient.vitals?.temperature || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Blood Pressure</p>
                          <p className="font-medium">{patient.vitals?.bloodPressure || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Heart Rate</p>
                          <p className="font-medium">{patient.vitals?.heartRate || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">O2 Saturation</p>
                          <p className="font-medium">{patient.vitals?.oxygenSaturation || 'N/A'}</p>
                        </div>
                      </div>
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

export default NursePatients;