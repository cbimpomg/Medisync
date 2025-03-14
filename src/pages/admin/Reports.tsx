import { useState } from 'react';
import { Search, Download, FileText, BarChart, PieChart, Calendar, Filter, MoreHorizontal } from 'lucide-react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock reports data
const reportsData = [
  {
    id: "REP001",
    title: "Monthly Patient Statistics",
    category: "Patient Analytics",
    date: "2024-03-01",
    type: "Statistical",
    format: "PDF",
    size: "2.5 MB",
    status: "Generated",
    department: "All"
  },
  {
    id: "REP002",
    title: "Revenue Analysis Q1 2024",
    category: "Financial",
    date: "2024-03-15",
    type: "Financial",
    format: "Excel",
    size: "1.8 MB",
    status: "Generated",
    department: "Finance"
  },
  {
    id: "REP003",
    title: "Staff Performance Review",
    category: "HR",
    date: "2024-03-10",
    type: "Performance",
    format: "PDF",
    size: "3.2 MB",
    status: "Processing",
    department: "HR"
  }
];

// Report categories with their respective icons
const reportCategories = [
  {
    name: "Patient Analytics",
    icon: PieChart,
    count: 15
  },
  {
    name: "Financial",
    icon: BarChart,
    count: 8
  },
  {
    name: "Performance",
    icon: FileText,
    count: 12
  },
  {
    name: "Operational",
    icon: Calendar,
    count: 10
  }
];

const AdminReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filteredReports = reportsData.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || report.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesDepartment = departmentFilter === 'all' || report.department.toLowerCase() === departmentFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reports Management</h1>
              <p className="text-gray-600">Generate and manage hospital reports</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Custom Report
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {reportCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{category.count}</div>
                  <p className="text-xs text-gray-500">Available reports</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex gap-4">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search reports..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="patient analytics">Patient Analytics</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{report.title}</div>
                      </TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell>{report.department}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.format}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminReports; 