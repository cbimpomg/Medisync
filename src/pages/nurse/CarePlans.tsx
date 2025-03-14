import { useState } from 'react';
import { Search, ClipboardList, Calendar, CheckCircle2, AlertCircle, Plus, History, User } from 'lucide-react';
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

// Mock care plans data
const carePlansData = [
  {
    id: "CP001",
    patientName: "Ransford Agyei",
    patientId: "P001",
    room: "201",
    diagnosis: "Post-operative care",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    status: "In Progress",
    progress: 65,
    priority: "High",
    goals: [
      { id: 1, description: "Pain management", status: "Completed" },
      { id: 2, description: "Wound care", status: "In Progress" },
      { id: 3, description: "Early mobilization", status: "Pending" }
    ],
    interventions: [
      "Regular pain assessment every 4 hours",
      "Daily wound dressing changes",
      "Physical therapy sessions twice daily"
    ],
    notes: "Patient showing good progress with mobility exercises"
  },
  {
    id: "CP002",
    patientName: "Emma Johnson",
    patientId: "P002",
    room: "205",
    diagnosis: "Pneumonia",
    startDate: "2024-03-14",
    endDate: "2024-03-21",
    status: "Active",
    progress: 40,
    priority: "High",
    goals: [
      { id: 1, description: "Improve respiratory function", status: "In Progress" },
      { id: 2, description: "Fever management", status: "In Progress" },
      { id: 3, description: "Maintain hydration", status: "Completed" }
    ],
    interventions: [
      "Oxygen therapy as needed",
      "Respiratory exercises every 2 hours",
      "Monitor fluid intake and output"
    ],
    notes: "Respiratory status improving with current interventions"
  },
  {
    id: "CP003",
    patientName: "Michael Chen",
    patientId: "P003",
    room: "210",
    diagnosis: "Diabetes Management",
    startDate: "2024-03-13",
    endDate: "2024-03-20",
    status: "Active",
    progress: 80,
    priority: "Medium",
    goals: [
      { id: 1, description: "Blood sugar control", status: "In Progress" },
      { id: 2, description: "Dietary compliance", status: "Completed" },
      { id: 3, description: "Foot care education", status: "Completed" }
    ],
    interventions: [
      "Blood glucose monitoring QID",
      "Diabetic diet adherence",
      "Daily foot examination"
    ],
    notes: "Patient demonstrating good understanding of diabetes management"
  }
];

const NurseCarePlans = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredCarePlans = carePlansData.filter(plan => {
    const matchesSearch = 
      plan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || plan.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-2xl font-bold text-gray-800">Care Plans</h1>
              <p className="text-gray-600">Manage and monitor patient care plans</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Care Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Care Plan</DialogTitle>
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
                          {carePlansData.map(plan => (
                            <SelectItem key={plan.patientId} value={plan.patientId}>
                              {plan.patientName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Input id="diagnosis" placeholder="Enter primary diagnosis" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goals">Goals</Label>
                    <Textarea 
                      id="goals" 
                      placeholder="Enter care plan goals (one per line)"
                      className="h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interventions">Interventions</Label>
                    <Textarea 
                      id="interventions" 
                      placeholder="Enter planned interventions (one per line)"
                      className="h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add any additional notes or instructions"
                      className="h-20"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Plan</Button>
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
                        placeholder="Search care plans..." 
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
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600">Active</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {carePlansData.filter(p => p.status === 'Active').length}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-600">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {carePlansData.filter(p => p.status === 'In Progress').length}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-600">High Priority</p>
                        <p className="text-2xl font-bold text-red-700">
                          {carePlansData.filter(p => p.priority === 'High').length}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600">Completed</p>
                        <p className="text-2xl font-bold text-green-700">
                          {carePlansData.filter(p => p.status === 'Completed').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Care Plans List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredCarePlans.map((plan) => (
                  <Card key={plan.id} className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{plan.patientName}</h3>
                              <Badge className={getStatusColor(plan.status)}>
                                {plan.status}
                              </Badge>
                              <Badge className={getPriorityColor(plan.priority)}>
                                {plan.priority} Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Room {plan.room} • {plan.diagnosis}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                {plan.startDate} to {plan.endDate}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <History className="h-4 w-4" />
                            History
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Update
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-500">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Goals</h4>
                          <ul className="space-y-2">
                            {plan.goals.map(goal => (
                              <li key={goal.id} className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className={getStatusColor(goal.status)}>
                                  {goal.status}
                                </Badge>
                                {goal.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Interventions</h4>
                          <ul className="space-y-2">
                            {plan.interventions.map((intervention, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                {intervention}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {plan.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {plan.notes}
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

export default NurseCarePlans; 