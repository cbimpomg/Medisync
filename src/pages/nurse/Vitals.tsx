import { useState } from 'react';
import { Search, Activity, Heart, Thermometer, Wind, Plus, History, AlertCircle } from 'lucide-react';
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock vitals data
const vitalsData = [
  {
    id: "V001",
    patientName: "Ransford Agyei",
    patientId: "P001",
    room: "201",
    timestamp: "2024-03-20 09:15 AM",
    vitals: {
      temperature: "37.2°C",
      bloodPressure: "120/80",
      heartRate: "72",
      respiratoryRate: "16",
      oxygenSaturation: "98",
      pain: "2/10"
    },
    status: "Normal",
    notes: "Patient comfortable, no complaints"
  },
  {
    id: "V002",
    patientName: "Emma Johnson",
    patientId: "P002",
    room: "205",
    timestamp: "2024-03-20 09:30 AM",
    vitals: {
      temperature: "38.5°C",
      bloodPressure: "135/85",
      heartRate: "95",
      respiratoryRate: "22",
      oxygenSaturation: "94",
      pain: "5/10"
    },
    status: "Abnormal",
    notes: "Patient reports increased pain, fever present"
  },
  {
    id: "V003",
    patientName: "Michael Chen",
    patientId: "P003",
    room: "210",
    timestamp: "2024-03-20 09:45 AM",
    vitals: {
      temperature: "36.8°C",
      bloodPressure: "128/82",
      heartRate: "68",
      respiratoryRate: "18",
      oxygenSaturation: "99",
      pain: "1/10"
    },
    status: "Normal",
    notes: "All vitals within normal range"
  }
];

const NurseVitals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<typeof vitalsData[0] | null>(null);

  const filteredVitals = vitalsData.filter(record => {
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

  return (
    <div className="flex h-screen bg-gray-50">
      <NurseSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Vitals</h1>
              <p className="text-gray-600">Monitor and record patient vital signs</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Record New Vitals
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Record Patient Vitals</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient">Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {vitalsData.map(record => (
                            <SelectItem key={record.patientId} value={record.patientId}>
                              {record.patientName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="room">Room</Label>
                      <Input id="room" placeholder="Enter room number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input id="temperature" placeholder="e.g., 37.2" />
                    </div>
                    <div>
                      <Label htmlFor="bloodPressure">Blood Pressure</Label>
                      <Input id="bloodPressure" placeholder="e.g., 120/80" />
                    </div>
                    <div>
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input id="heartRate" placeholder="e.g., 72" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                      <Input id="respiratoryRate" placeholder="e.g., 16" />
                    </div>
                    <div>
                      <Label htmlFor="oxygenSaturation">O2 Saturation (%)</Label>
                      <Input id="oxygenSaturation" placeholder="e.g., 98" />
                    </div>
                    <div>
                      <Label htmlFor="pain">Pain Level (0-10)</Label>
                      <Input id="pain" placeholder="e.g., 2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" placeholder="Add any relevant notes or observations" />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Vitals</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters and Stats */}
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
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600">Normal</p>
                        <p className="text-2xl font-bold text-green-700">
                          {vitalsData.filter(v => v.status === 'Normal').length}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-600">Abnormal</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {vitalsData.filter(v => v.status === 'Abnormal').length}
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600">Total Records</p>
                      <p className="text-2xl font-bold text-blue-700">{vitalsData.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vitals List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredVitals.map((record) => (
                  <Card key={record.id} className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Activity className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{record.patientName}</h3>
                              <Badge className={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Room {record.room} • Recorded: {record.timestamp}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <History className="h-4 w-4" />
                            History
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Alert
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Temperature</p>
                            <p className={`font-medium ${getVitalStatus('temperature', record.vitals.temperature)}`}>
                              {record.vitals.temperature}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Blood Pressure</p>
                            <p className="font-medium">{record.vitals.bloodPressure}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Heart Rate</p>
                            <p className={`font-medium ${getVitalStatus('heartRate', record.vitals.heartRate)}`}>
                              {record.vitals.heartRate} bpm
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Respiratory Rate</p>
                            <p className="font-medium">{record.vitals.respiratoryRate} /min</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">O2 Saturation</p>
                            <p className={`font-medium ${getVitalStatus('oxygenSaturation', record.vitals.oxygenSaturation)}`}>
                              {record.vitals.oxygenSaturation}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Pain Level</p>
                            <p className="font-medium">{record.vitals.pain}</p>
                          </div>
                        </div>
                      </div>

                      {record.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {record.notes}
                          </p>
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