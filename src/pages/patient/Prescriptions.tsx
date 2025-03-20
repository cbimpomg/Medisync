import { useState } from 'react';
import { Pill, RefreshCw, Clock, AlertCircle, Search, Filter, Calendar, Check, Package, Truck, ShoppingCart } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from '@/hooks/use-toast';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  dateIssued: string;
  expiryDate: string;
  remainingRefills: number;
  totalRefills: number;
  status: 'active' | 'expired' | 'completed';
  instructions: string;
  pillsRemaining?: number;
  totalPills?: number;
  nextRefillDate?: string;
  sideEffects: string[];
  interactions: string[];
}

interface Order {
  id: string;
  date: string;
  medications: {
    name: string;
    quantity: number;
  }[];
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const Prescriptions = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [cartItems, setCartItems] = useState<{id: string, medication: string, quantity: number}[]>([]);
  
  // Prescription mock data
  const prescriptions: Prescription[] = [
    {
      id: '1',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Sarah Johnson',
      dateIssued: '2023-09-15',
      expiryDate: '2024-03-15',
      remainingRefills: 2,
      totalRefills: 3,
      status: 'active',
      instructions: 'Take in the morning with or without food. Avoid taking with potassium supplements.',
      pillsRemaining: 12,
      totalPills: 30,
      nextRefillDate: '2023-11-15',
      sideEffects: ['Dry cough', 'Dizziness', 'Headache', 'Fatigue'],
      interactions: ['Potassium supplements', 'NSAIDs', 'Lithium']
    },
    {
      id: '2',
      medication: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily at bedtime',
      prescribedBy: 'Dr. Sarah Johnson',
      dateIssued: '2023-09-15',
      expiryDate: '2024-03-15',
      remainingRefills: 3,
      totalRefills: 3,
      status: 'active',
      instructions: 'Take at bedtime. Avoid grapefruit juice while taking this medication.',
      pillsRemaining: 25,
      totalPills: 30,
      nextRefillDate: '2023-11-25',
      sideEffects: ['Muscle pain', 'Joint pain', 'Digestive problems', 'Liver enzyme elevation'],
      interactions: ['Grapefruit juice', 'Certain antibiotics', 'Antifungal medications']
    },
    {
      id: '3',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      prescribedBy: 'Dr. Michael Chen',
      dateIssued: '2023-08-01',
      expiryDate: '2023-08-15',
      remainingRefills: 0,
      totalRefills: 0,
      status: 'completed',
      instructions: 'Take until completed, even if symptoms improve. Take with food to reduce stomach upset.',
      sideEffects: ['Diarrhea', 'Stomach upset', 'Rash', 'Nausea'],
      interactions: ['Certain antibiotics', 'Birth control pills', 'Blood thinners']
    },
    {
      id: '4',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily with meals',
      prescribedBy: 'Dr. Emily Rodriguez',
      dateIssued: '2023-06-10',
      expiryDate: '2023-12-10',
      remainingRefills: 0,
      totalRefills: 6,
      status: 'expired',
      instructions: 'Take with meals to reduce stomach upset. Contact doctor if persistent digestive issues occur.',
      sideEffects: ['Stomach upset', 'Diarrhea', 'Nausea', 'Decreased vitamin B12 levels'],
      interactions: ['Alcohol', 'Certain X-ray contrast dyes', 'Diuretics']
    }
  ];
  
  // Order mock data
  const orders: Order[] = [
    {
      id: '1',
      date: '2023-10-20',
      medications: [
        { name: 'Lisinopril 10mg', quantity: 30 },
        { name: 'Atorvastatin 20mg', quantity: 30 }
      ],
      status: 'delivered',
      trackingNumber: 'TRK12345678',
      estimatedDelivery: '2023-10-25'
    },
    {
      id: '2',
      date: '2023-09-15',
      medications: [
        { name: 'Lisinopril 10mg', quantity: 30 },
        { name: 'Atorvastatin 20mg', quantity: 30 }
      ],
      status: 'delivered',
      trackingNumber: 'TRK87654321',
      estimatedDelivery: '2023-09-20'
    }
  ];
  
  // Filter prescriptions based on search query and status filter
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.prescribedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate days until refill
  const getDaysUntilRefill = (nextRefillDate?: string) => {
    if (!nextRefillDate) return null;
    
    const today = new Date();
    const refillDate = new Date(nextRefillDate);
    const diffTime = refillDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Handle adding to cart
  const addToCart = (prescription: Prescription) => {
    // Check if already in cart
    const existingItem = cartItems.find(item => item.id === prescription.id);
    
    if (existingItem) {
      toast({
        title: "Already in Cart",
        description: `${prescription.medication} is already in your cart.`,
        variant: "default"
      });
      return;
    }
    
    setCartItems([...cartItems, {
      id: prescription.id,
      medication: `${prescription.medication} ${prescription.dosage}`,
      quantity: 1
    }]);
    
    toast({
      title: "Added to Cart",
      description: `${prescription.medication} has been added to your cart.`,
      variant: "default"
    });
  };
  
  // Handle requesting refill
  const requestRefill = (prescription: Prescription) => {
    toast({
      title: "Refill Requested",
      description: `Your refill request for ${prescription.medication} has been submitted.`,
      variant: "default"
    });
  };
  
  // Get status display data
  const getStatusDisplayData = (status: string) => {
    switch(status) {
      case 'active':
        return { label: 'Active', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'expired':
        return { label: 'Expired', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'completed':
        return { label: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-200' };
      case 'processing':
        return { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'shipped':
        return { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'delivered':
        return { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
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
            <h1 className="text-3xl font-bold text-black drop-shadow-lg shadow-black">Prescriptions</h1>
            <p className="text-black drop-shadow-md mt-2">Manage your medications and request refills</p>
          </div>
          
          {/* Main Content */}
          <div className="bg-white/85 rounded-xl shadow-xl p-6">
            <Tabs defaultValue="current" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="current">Current Medications</TabsTrigger>
                <TabsTrigger value="history">Medication History</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              
              {/* Current Medications Tab */}
              <TabsContent value="current">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search medications..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Show cart if items exist */}
                {cartItems.length > 0 && (
                  <div className="mb-6">
                    <Alert className="bg-blue-50 border-blue-200">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Items in Cart ({cartItems.length})</AlertTitle>
                      <AlertDescription className="text-blue-600">
                        You have {cartItems.length} medications in your cart ready for checkout.
                      </AlertDescription>
                      <div className="mt-3">
                        <Button size="sm" className="bg-medisync-primary hover:bg-medisync-secondary">
                          Proceed to Checkout
                        </Button>
                      </div>
                    </Alert>
                  </div>
                )}
                
                {/* Medications that need refill soon */}
                {filteredPrescriptions.some(p => p.status === 'active' && p.pillsRemaining && p.totalPills && (p.pillsRemaining / p.totalPills) < 0.3) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Medications Needing Refill Soon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPrescriptions
                        .filter(p => p.status === 'active' && p.pillsRemaining && p.totalPills && (p.pillsRemaining / p.totalPills) < 0.3)
                        .map(prescription => (
                          <Card key={prescription.id} className="shadow-md border-l-4 border-l-amber-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{prescription.medication} {prescription.dosage}</h4>
                                  <p className="text-sm text-gray-600">{prescription.frequency}</p>
                                  <div className="mt-2 mb-1 flex items-center gap-2">
                                    <span className="text-xs text-gray-500">{prescription.pillsRemaining} of {prescription.totalPills} remaining</span>
                                    <span className="text-xs text-amber-600">Refill soon</span>
                                  </div>
                                  <Progress 
                                    value={(prescription.pillsRemaining! / prescription.totalPills!) * 100} 
                                    className="h-2 bg-gray-100"
                                  />
                                </div>
                                <Button 
                                  size="sm" 
                                  className="bg-medisync-primary hover:bg-medisync-secondary"
                                  onClick={() => requestRefill(prescription)}
                                >
                                  Request Refill
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {/* All Current Medications */}
                <div className="space-y-4">
                  {filteredPrescriptions.filter(p => p.status === 'active').length > 0 ? (
                    filteredPrescriptions
                      .filter(p => p.status === 'active')
                      .map(prescription => (
                        <Card key={prescription.id} className="shadow-md hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                              <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-blue-50">
                                  <Pill className="h-6 w-6 text-medisync-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{prescription.medication} {prescription.dosage}</h3>
                                  <p className="text-sm text-gray-600 mb-1">{prescription.frequency}</p>
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <Badge variant="outline" className={`text-xs ${getStatusDisplayData(prescription.status).color}`}>
                                      {getStatusDisplayData(prescription.status).label}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                      Prescribed by: {prescription.prescribedBy}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                      Expires: {formatDate(prescription.expiryDate)}
                                    </Badge>
                                  </div>
                                  
                                  {prescription.pillsRemaining !== undefined && prescription.totalPills !== undefined && (
                                    <div className="mt-3 mb-1">
                                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{prescription.pillsRemaining} of {prescription.totalPills} pills remaining</span>
                                        <span>{Math.round((prescription.pillsRemaining / prescription.totalPills) * 100)}%</span>
                                      </div>
                                      <Progress 
                                        value={(prescription.pillsRemaining / prescription.totalPills) * 100} 
                                        className="h-2 bg-gray-100"
                                      />
                                    </div>
                                  )}
                                  
                                  {prescription.nextRefillDate && (
                                    <div className="mt-3 flex items-center gap-2 text-sm">
                                      <Clock className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-600">
                                        Next refill available in {getDaysUntilRefill(prescription.nextRefillDate)} days
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 w-full md:w-auto">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="w-full md:w-auto"
                                      onClick={() => setSelectedPrescription(prescription)}
                                    >
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>{prescription.medication} {prescription.dosage}</DialogTitle>
                                      <DialogDescription>
                                        Prescribed by {prescription.prescribedBy} on {formatDate(prescription.dateIssued)}
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="mt-6 space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-medium text-gray-800 mb-2">Medication Details</h4>
                                          <div className="space-y-2">
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Dosage:</span>
                                              <span className="font-medium">{prescription.dosage}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Frequency:</span>
                                              <span className="font-medium">{prescription.frequency}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Refills:</span>
                                              <span className="font-medium">{prescription.remainingRefills} of {prescription.totalRefills}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Expiry Date:</span>
                                              <span className="font-medium">{formatDate(prescription.expiryDate)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium text-gray-800 mb-2">Instructions</h4>
                                          <p className="text-gray-600">{prescription.instructions}</p>
                                          
                                          {prescription.pillsRemaining !== undefined && prescription.totalPills !== undefined && (
                                            <div className="mt-3 mb-1">
                                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>{prescription.pillsRemaining} of {prescription.totalPills} pills remaining</span>
                                                <span>{Math.round((prescription.pillsRemaining / prescription.totalPills) * 100)}%</span>
                                              </div>
                                              <Progress 
                                                value={(prescription.pillsRemaining / prescription.totalPills) * 100} 
                                                className="h-2 bg-gray-100"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-medium text-gray-800 mb-2">Possible Side Effects</h4>
                                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                                            {prescription.sideEffects.map((effect, index) => (
                                              <li key={index}>{effect}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium text-gray-800 mb-2">Interactions</h4>
                                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                                            {prescription.interactions.map((interaction, index) => (
                                              <li key={index}>{interaction}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div className="flex justify-end gap-3">
                                        <Button 
                                          variant="outline"
                                          onClick={() => addToCart(prescription)}
                                        >
                                          Add to Cart
                                        </Button>
                                        {prescription.remainingRefills > 0 && (
                                          <Button 
                                            className="bg-medisync-primary hover:bg-medisync-secondary"
                                            onClick={() => requestRefill(prescription)}
                                          >
                                            Request Refill
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                {prescription.remainingRefills > 0 ? (
                                  <Button 
                                    size="sm" 
                                    className="bg-medisync-primary hover:bg-medisync-secondary w-full md:w-auto"
                                    onClick={() => addToCart(prescription)}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Refill Now
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full md:w-auto"
                                    disabled
                                  >
                                    No Refills Left
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                      <Pill className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No Active Medications</h3>
                      <p className="text-gray-500 max-w-sm mx-auto mt-2">
                        {searchQuery || statusFilter !== 'all' 
                          ? "No prescriptions match your current filters. Try adjusting your search criteria."
                          : "You don't have any active prescriptions at the moment."}
                      </p>
                      {(searchQuery || statusFilter !== 'all') && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Medication History Tab */}
              <TabsContent value="history">
                <div className="space-y-4">
                  {filteredPrescriptions.filter(p => p.status !== 'active').length > 0 ? (
                    filteredPrescriptions
                      .filter(p => p.status !== 'active')
                      .map(prescription => (
                        <Card key={prescription.id} className="shadow-md">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-gray-100">
                                  <Pill className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{prescription.medication} {prescription.dosage}</h3>
                                  <p className="text-sm text-gray-600 mb-1">{prescription.frequency}</p>
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <Badge variant="outline" className={`text-xs ${getStatusDisplayData(prescription.status).color}`}>
                                      {getStatusDisplayData(prescription.status).label}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                      {formatDate(prescription.dateIssued)} - {formatDate(prescription.expiryDate)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{prescription.instructions}</p>
                                </div>
                              </div>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedPrescription(prescription)}
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{prescription.medication} {prescription.dosage}</DialogTitle>
                                    <DialogDescription>
                                      Prescribed by {prescription.prescribedBy} on {formatDate(prescription.dateIssued)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="mt-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium text-gray-800 mb-2">Medication Details</h4>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Dosage:</span>
                                            <span className="font-medium">{prescription.dosage}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Frequency:</span>
                                            <span className="font-medium">{prescription.frequency}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Refills:</span>
                                            <span className="font-medium">{prescription.remainingRefills} of {prescription.totalRefills}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className="font-medium">{getStatusDisplayData(prescription.status).label}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-medium text-gray-800 mb-2">Instructions</h4>
                                        <p className="text-gray-600">{prescription.instructions}</p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                      <Pill className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No Medication History</h3>
                      <p className="text-gray-500 max-w-sm mx-auto mt-2">
                        You don't have any previous or expired medications in your history.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders">
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <Card key={order.id} className="shadow-md">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">Order #{order.id}</h3>
                                <Badge variant="outline" className={`text-xs ${getStatusDisplayData(order.status).color}`}>
                                  {getStatusDisplayData(order.status).label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">Ordered on {formatDate(order.date)}</p>
                              
                              <div className="space-y-2">
                                {order.medications.map((med, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <Pill className="h-4 w-4 text-medisync-primary" />
                                    <span className="text-gray-700">{med.name} (Qty: {med.quantity})</span>
                                  </div>
                                ))}
                              </div>
                              
                              {order.status === 'shipped' && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                  <Truck className="h-4 w-4 text-blue-500" />
                                  <span>Estimated delivery: {order.estimatedDelivery}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              {order.trackingNumber && (
                                <Button size="sm" variant="outline" className="flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  Track Order
                                </Button>
                              )}
                              
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No Orders</h3>
                      <p className="text-gray-500 max-w-sm mx-auto mt-2">
                        You haven't placed any medication orders yet.
                      </p>
                      <Button className="mt-4 bg-medisync-primary hover:bg-medisync-secondary">
                        Order Medications
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions; 