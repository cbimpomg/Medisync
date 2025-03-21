import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { prescriptionService } from '@/lib/services/prescriptionService';
import { Pill, RefreshCw, Clock, AlertCircle, Search, Filter, Calendar, Check, Package, Truck, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  status: 'active' | 'expired' | 'completed' | 'cancelled';
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
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = (prescription: Prescription) => {
    navigate('/pharmacy', {
      state: {
        prescribedMedication: {
          id: prescription.id,
          name: prescription.medication,
          dosage: prescription.dosage,
          quantity: 1
        }
      }
    });
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        const fetchedPrescriptions = await prescriptionService.getPatientPrescriptions(user.uid);
        
        // Transform prescription data to match component's format
        const formattedPrescriptions = fetchedPrescriptions.map(prescription => ({
          id: prescription.id || '',
          medication: prescription.medications[0]?.name || '',
          dosage: prescription.medications[0]?.dosage || '',
          frequency: prescription.medications[0]?.frequency || '',
          prescribedBy: prescription.doctorId,
          dateIssued: prescription.createdAt?.toISOString().split('T')[0] || '',
          expiryDate: '',
          remainingRefills: 0,
          totalRefills: 0,
          status: (prescription.status === 'cancelled' ? 'cancelled' : prescription.status || 'active') as Prescription['status'],
          instructions: prescription.medications[0]?.instructions || '',
          sideEffects: [],
          interactions: []
        }));

        setPrescriptions(formattedPrescriptions);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        toast({
          title: "Error",
          description: "Failed to load prescriptions. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user?.uid]);

  // Filter prescriptions based on search query and status filter
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.prescribedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <PatientSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <PatientSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
            <p className="text-gray-600">View and manage your prescriptions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search prescriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">All Status</SelectItem>
                <SelectItem key="active" value="active">Active</SelectItem>
                <SelectItem key="completed" value="completed">Completed</SelectItem>
                <SelectItem key="expired" value="expired">Expired</SelectItem>
                <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No prescriptions found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You don\'t have any prescriptions yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{prescription.medication}</CardTitle>
                        <CardDescription>{prescription.dosage} - {prescription.frequency}</CardDescription>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          ${prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                          ${prescription.status === 'expired' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${prescription.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}
                      >
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Prescribed: {prescription.dateIssued}
                      </div>
                      {prescription.expiryDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          Expires: {prescription.expiryDate}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refills: {prescription.remainingRefills}/{prescription.totalRefills}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handlePurchase(prescription)}
                      className="w-full"
                      variant="secondary"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase Medication
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Prescriptions;