import { useState } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, Plus, Calendar, User, Filter } from 'lucide-react';
import NurseSidebar from '@/components/layout/NurseSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Mock tasks data
const tasksData = [
  {
    id: "T001",
    title: "Administer morning medications",
    patientName: "Ransford Agyei",
    patientId: "P001",
    room: "201",
    priority: "High",
    status: "Pending",
    dueTime: "09:00 AM",
    category: "Medication",
    description: "Administer prescribed morning medications as per schedule",
    assignedBy: "Dr. Sarah Wilson",
    notes: "Patient needs to take medications with food"
  },
  {
    id: "T002",
    title: "Change wound dressing",
    patientName: "Emma Johnson",
    patientId: "P002",
    room: "205",
    priority: "High",
    status: "In Progress",
    dueTime: "10:30 AM",
    category: "Wound Care",
    description: "Change post-operative wound dressing and assess healing",
    assignedBy: "Dr. Michael Chang",
    notes: "Use sterile technique, document wound appearance"
  },
  {
    id: "T003",
    title: "Monitor vital signs",
    patientName: "Michael Chen",
    patientId: "P003",
    room: "210",
    priority: "Medium",
    status: "Completed",
    dueTime: "08:00 AM",
    category: "Monitoring",
    description: "Check and record vital signs",
    assignedBy: "Charge Nurse",
    notes: "Pay special attention to blood pressure readings"
  }
];

const NurseTasks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || task.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
              <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
              <p className="text-gray-600">Manage and track daily nursing tasks</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
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
                          {tasksData.map(task => (
                            <SelectItem key={task.patientId} value={task.patientId}>
                              {task.patientName}
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
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" placeholder="Enter task title" />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="wound-care">Wound Care</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="assessment">Assessment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="dueTime">Due Time</Label>
                      <Input id="dueTime" type="time" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter task description"
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
                    <Button>Create Task</Button>
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
                        placeholder="Search tasks..." 
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
                        <SelectItem value="pending">Pending</SelectItem>
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

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="wound-care">Wound Care</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="assessment">Assessment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {tasksData.filter(t => t.status === 'Pending').length}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600">In Progress</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {tasksData.filter(t => t.status === 'In Progress').length}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-600">High Priority</p>
                        <p className="text-2xl font-bold text-red-700">
                          {tasksData.filter(t => t.priority === 'High').length}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600">Completed</p>
                        <p className="text-2xl font-bold text-green-700">
                          {tasksData.filter(t => t.status === 'Completed').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tasks List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Checkbox id={`task-${task.id}`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{task.title}</h3>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority} Priority
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <User className="h-4 w-4" />
                                {task.patientName} (Room {task.room})
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                Due: {task.dueTime}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Start Task
                          </Button>
                          <Button variant="outline" size="sm">
                            Mark Complete
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-gray-600">
                        <p><span className="font-medium">Description:</span> {task.description}</p>
                        <p className="mt-2"><span className="font-medium">Category:</span> {task.category}</p>
                        <p className="mt-2"><span className="font-medium">Assigned by:</span> {task.assignedBy}</p>
                      </div>

                      {task.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {task.notes}
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

export default NurseTasks; 