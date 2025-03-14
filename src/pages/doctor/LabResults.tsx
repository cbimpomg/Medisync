import { useState } from 'react';
import { Search, Filter, AlertCircle, FileText, Download, Eye, Calendar, ChevronDown } from 'lucide-react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock lab results data
const labResults = [
  {
    id: "LAB001",
    patientName: "Ransford Agyei",
    patientId: "P001",
    testName: "Complete Blood Count",
    category: "Hematology",
    date: "2024-03-15",
    status: "Abnormal",
    orderedBy: "Dr. Sarah Smith",
    results: [
      { name: "WBC", value: "11.5", unit: "K/µL", range: "4.5-11.0", status: "High" },
      { name: "RBC", value: "4.8", unit: "M/µL", range: "4.5-5.5", status: "Normal" },
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.5-17.5", status: "Normal" },
      { name: "Platelets", value: "140", unit: "K/µL", range: "150-450", status: "Low" }
    ]
  },
  {
    id: "LAB002",
    patientName: "Emma Johnson",
    patientId: "P002",
    testName: "Comprehensive Metabolic Panel",
    category: "Chemistry",
    date: "2024-03-10",
    status: "Normal",
    orderedBy: "Dr. James Wilson",
    results: [
      { name: "Glucose", value: "95", unit: "mg/dL", range: "70-100", status: "Normal" },
      { name: "Creatinine", value: "0.9", unit: "mg/dL", range: "0.6-1.2", status: "Normal" },
      { name: "Sodium", value: "140", unit: "mEq/L", range: "135-145", status: "Normal" },
      { name: "Potassium", value: "4.0", unit: "mEq/L", range: "3.5-5.0", status: "Normal" }
    ]
  },
  {
    id: "LAB003",
    patientName: "Michael Chen",
    patientId: "P003",
    testName: "Lipid Panel",
    category: "Chemistry",
    date: "2024-02-28",
    status: "Critical",
    orderedBy: "Dr. Sarah Smith",
    results: [
      { name: "Total Cholesterol", value: "280", unit: "mg/dL", range: "<200", status: "High" },
      { name: "LDL", value: "190", unit: "mg/dL", range: "<100", status: "Critical" },
      { name: "HDL", value: "35", unit: "mg/dL", range: ">40", status: "Low" },
      { name: "Triglycerides", value: "200", unit: "mg/dL", range: "<150", status: "High" }
    ]
  }
];

const categories = [
  "All Categories",
  "Hematology",
  "Chemistry",
  "Microbiology",
  "Immunology",
  "Urinalysis"
];

const DoctorLabResults = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedResult, setSelectedResult] = useState<typeof labResults[0] | null>(null);

  const filteredResults = labResults.filter(result => {
    const matchesSearch = 
      result.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || result.category === categoryFilter;
    const matchesTab = selectedTab === 'all' || result.status.toLowerCase() === selectedTab.toLowerCase();
    return matchesSearch && matchesCategory && matchesTab;
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

  const getValueStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'text-green-600';
      case 'high':
        return 'text-yellow-600';
      case 'low':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600 font-bold';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Lab Results</h1>
              <p className="text-gray-600">View and manage patient laboratory results</p>
            </div>
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
                        placeholder="Search results..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
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
                      <TabsTrigger value="all">All Results</TabsTrigger>
                      <TabsTrigger value="normal">Normal</TabsTrigger>
                      <TabsTrigger value="abnormal">Abnormal</TabsTrigger>
                      <TabsTrigger value="critical">Critical</TabsTrigger>
                    </TabsList>

                    <div className="mt-6 space-y-4">
                      {filteredResults.map((result) => (
                        <Card key={result.id} className="hover:bg-gray-50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                  <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{result.testName}</h3>
                                    <Badge className={getStatusColor(result.status)}>
                                      {result.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {result.patientName} ({result.patientId})
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {result.date} • Ordered by {result.orderedBy}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>Lab Result Details</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                          <h3 className="font-medium">Patient Information</h3>
                                          <p className="text-sm text-gray-500">
                                            Name: {result.patientName}<br />
                                            ID: {result.patientId}
                                          </p>
                                        </div>
                                        <div>
                                          <h3 className="font-medium">Test Information</h3>
                                          <p className="text-sm text-gray-500">
                                            Test: {result.testName}<br />
                                            Category: {result.category}<br />
                                            Date: {result.date}<br />
                                            Ordered by: {result.orderedBy}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Test</TableHead>
                                            <TableHead>Result</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Reference Range</TableHead>
                                            <TableHead>Status</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {result.results.map((item, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{item.name}</TableCell>
                                              <TableCell className="font-medium">{item.value}</TableCell>
                                              <TableCell>{item.unit}</TableCell>
                                              <TableCell>{item.range}</TableCell>
                                              <TableCell className={getValueStatusColor(item.status)}>
                                                {item.status}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>

                                      <div className="flex justify-end mt-6 gap-3">
                                        <Button variant="outline" className="gap-2">
                                          <Download className="h-4 w-4" />
                                          Download Report
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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

export default DoctorLabResults;