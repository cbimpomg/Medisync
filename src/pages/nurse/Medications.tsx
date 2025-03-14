import { useState } from 'react';
import { Search, Pill, Clock, AlertCircle, Plus, Calendar, User, Filter, CheckCircle2 } from 'lucide-react';
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock medications data
const medicationsData = [
  {
    id: "M001",
    patientName: "Ransford Agyei",
    patientId: "P001",
    room: "201",
    medicationName: "Amoxicillin",
    dosage: "500mg",
    route: "Oral",
    frequency: "Every 8 hours",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    status: "Active",
    nextDue: "10:00 AM",
    priority: "High",
    prescribedBy: "Dr. Sarah Wilson",
    notes: "Take with food. Monitor for allergic reactions."
  },
  {
    id: "M002",
    patientName: "Emma Johnson",
    patientId: "P002",
    room: "205",
    medicationName: "Ibuprofen",
    dosage: "400mg",
    route: "Oral",
    frequency: "Every 6 hours",
    startDate: "2024-03-14",
    endDate: "2024-03-21",
    status: "Active",
    nextDue: "11:30 AM",
    priority: "Medium",
    prescribedBy: "Dr. Michael Chang",
    notes: "For pain management. Check vital signs before administration."
  },
  {
    id: "M003",
    patientName: "Michael Chen",
    patientId: "P003",
    room: "210",
    medicationName: "Insulin",
    dosage: "10 units",
    route: "Subcutaneous",
    frequency: "Before meals",
    startDate: "2024-03-13",
    endDate: "2024-03-20",
    status: "Active",
    nextDue: "12:00 PM",
    priority: "High",
    prescribedBy: "Dr. Lisa Brown",
    notes: "Check blood sugar before administration. Document readings."
  }
];

const NurseMedications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');

  const filteredMedications = medicationsData.filter(med => {
    const matchesSearch = 
      med.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || med.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || med.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesRoute = routeFilter === 'all' || med.route.toLowerCase() === routeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority && matchesRoute;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
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
              <h1 className="text-2xl font-bold text-gray-800">Medications</h1>
              <p className="text-gray-600">Manage and administer patient medications</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Administration
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Record Medication Administration</DialogTitle>
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
                          {medicationsData.map(med => (
                            <SelectItem key={med.patientId} value={med.patientId}>
                              {med.patientName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="medication">Medication</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select medication" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicationsData.map(med => (
                            <SelectItem key={med.id} value={med.id}>
                              {med.medicationName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="administrationTime">Administration Time</Label>
                      <Input id="administrationTime" type="datetime-local" />
                    </div>
                    <div>
                      <Label htmlFor="route">Route</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oral">Oral</SelectItem>
                          <SelectItem value="intravenous">Intravenous</SelectItem>
                          <SelectItem value="intramuscular">Intramuscular</SelectItem>
                          <SelectItem value="subcutaneous">Subcutaneous</SelectItem>
                          <SelectItem value="topical">Topical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add any observations, side effects, or patient response"
                      className="h-20"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Record Administration</Button>
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
                        placeholder="Search medications..." 
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Route</label>
                    <Select value={routeFilter} onValueChange={setRouteFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Routes</SelectItem>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="intravenous">Intravenous</SelectItem>
                        <SelectItem value="intramuscular">Intramuscular</SelectItem>
                        <SelectItem value="subcutaneous">Subcutaneous</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600">Active</p>
                        <p className="text-2xl font-bold text-green-700">
                          {medicationsData.filter(m => m.status === 'Active').length}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-600">Due Today</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {medicationsData.length}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-600">High Priority</p>
                        <p className="text-2xl font-bold text-red-700">
                          {medicationsData.filter(m => m.priority === 'High').length}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600">Total</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {medicationsData.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Medications List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredMedications.map((med) => (
                  <Card key={med.id} className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Pill className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{med.medicationName}</h3>
                              <Badge className={getStatusColor(med.status)}>
                                {med.status}
                              </Badge>
                              <Badge className={getPriorityColor(med.priority)}>
                                {med.priority} Priority
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <User className="h-4 w-4" />
                                {med.patientName} (Room {med.room})
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                Next Due: {med.nextDue}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Administer
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Report Issue
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Dosage:</span> {med.dosage}</p>
                          <p className="mt-1"><span className="font-medium">Route:</span> {med.route}</p>
                          <p className="mt-1"><span className="font-medium">Frequency:</span> {med.frequency}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Start Date:</span> {med.startDate}</p>
                          <p className="mt-1"><span className="font-medium">End Date:</span> {med.endDate}</p>
                          <p className="mt-1"><span className="font-medium">Prescribed By:</span> {med.prescribedBy}</p>
                        </div>
                      </div>

                      {med.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {med.notes}
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

export default NurseMedications; 