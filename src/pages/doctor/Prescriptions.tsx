import { useState, useEffect } from 'react';
import { Search, Plus, FileText, Pill, Calendar, MoreHorizontal } from 'lucide-react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { userService } from '@/lib/services/userService';
import { prescriptionService } from '@/lib/services/prescriptionService';
import { useAuth } from '@/hooks/useAuth';

const DoctorPrescriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    frequency: '',
    startDate: '',
    duration: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prescriptionsData, setPrescriptionsData] = useState<Array<{
    id: string;
    patientName: string;
    patientId: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    status: string;
    startDate: string;
    endDate: string;
    notes?: string;
  }>>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const allPatients = await userService.getUsersByRole('patient');
        setPatients(allPatients.map(patient => ({
          id: patient.uid,
          name: patient.displayName || 'Unknown Patient'
        })));
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to load patients. Please try again later.",
          variant: "destructive"
        });
      }
    };

    if (dialogOpen) {
      fetchPatients();
    }
  }, [dialogOpen]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user?.uid) {
        console.log('User ID is not available, cannot fetch prescriptions');
        return;
      }
      
      try {
        setLoading(true);
        // Get current doctor's ID from auth context
        const doctorId = user.uid;
        console.log('Fetching prescriptions for doctor ID:', doctorId);
        
        const prescriptions = await prescriptionService.getDoctorPrescriptions(doctorId);
        console.log('Prescriptions fetched:', prescriptions);
        
        // Transform prescription data to match component's format
        const formattedPrescriptions = prescriptions.map(prescription => ({
          id: prescription.id || '',
          patientName: '', // Will be populated when we fetch patient details
          patientId: prescription.patientId,
          medication: prescription.medications[0]?.name || '',
          dosage: prescription.medications[0]?.dosage || '',
          frequency: prescription.medications[0]?.frequency || '',
          duration: prescription.medications[0]?.duration || '',
          status: prescription.status,
          startDate: prescription.createdAt?.toISOString().split('T')[0] || '',
          endDate: '', // Calculate based on duration
          notes: prescription.medications[0]?.instructions || prescription.notes
        }));

        // Fetch patient names for each prescription
        const prescriptionsWithPatientNames = await Promise.all(
          formattedPrescriptions.map(async (prescription) => {
            try {
              const patient = await userService.getUserById(prescription.patientId);
              return {
                ...prescription,
                patientName: patient?.displayName || 'Unknown Patient'
              };
            } catch (error) {
              console.error('Error fetching patient details:', error);
              return prescription;
            }
          })
        );

        setPrescriptionsData(prescriptionsWithPatientNames);
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

  const filteredPrescriptions = prescriptionsData.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
              <p className="text-gray-600">Manage patient prescriptions</p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Prescription</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient">Patient</Label>
                      <Select 
                        value={formData.patientId} 
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, patientId: value }));
                        }}
                      >                        
                        <SelectTrigger className={!formData.patientId ? 'border-red-500' : ''}>
                          <SelectValue placeholder={loading ? "Loading patients..." : "Select patient"} />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(patient => (
                            <SelectItem key={`patient-${patient.id}`} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="medication">Medication</Label>
                      <Input
                        id="medication"
                        placeholder="Enter medication name"
                        value={formData.medication}
                        onChange={(e) => setFormData(prev => ({ ...prev, medication: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        placeholder="Enter dosage"
                        value={formData.dosage}
                        onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Input
                        id="frequency"
                        placeholder="Enter frequency"
                        value={formData.frequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add any special instructions or notes"
                      className="h-20"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                      disabled={isSubmitting}
                      onClick={async () => {
                        try {
                          if (!formData.patientId || formData.patientId.trim() === '') {
                            toast({
                              title: "Error",
                              description: "Please select a patient from the dropdown",
                              variant: "destructive"
                            });
                            return;
                          }
                          if (!formData.medication || !formData.dosage || !formData.frequency || !formData.duration) {
                            toast({
                              title: "Error",
                              description: "Please fill in all required fields",
                              variant: "destructive"
                            });
                            return;
                          }
                          setIsSubmitting(true);
                          
                          if (!user?.uid) {
                            toast({
                              title: "Error",
                              description: "You must be logged in to create prescriptions",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          const doctorId = user.uid;
                          const prescription = await prescriptionService.createPrescription({
                            patientId: formData.patientId,
                            doctorId,
                            medications: [{
                              name: formData.medication,
                              dosage: formData.dosage,
                              frequency: formData.frequency,
                              duration: formData.duration,
                              instructions: formData.notes
                            }],
                            notes: formData.notes
                          });

                          // Send notification to patient
                          await userService.sendNotification(formData.patientId, {
                            type: 'prescription',
                            title: 'New Prescription',
                            message: `Dr. ${user.displayName || 'Your doctor'} has prescribed you ${formData.medication}`,
                            data: { prescriptionId: prescription.id }
                          });

                          toast({
                            title: "Success",
                            description: "Prescription has been sent to patient successfully!"
                          });
                          setDialogOpen(false);
                          setFormData({
                            patientId: '',
                            medication: '',
                            dosage: '',
                            frequency: '',
                            startDate: '',
                            duration: '',
                            notes: ''
                          });
                          
                          // Refresh prescriptions list
                          const updatedPrescriptions = await prescriptionService.getDoctorPrescriptions(doctorId);
                          // Transform and update state (simplified for brevity)
                          setPrescriptionsData(prev => [
                            ...prev,
                            {
                              id: prescription.id || '',
                              patientName: patients.find(p => p.id === formData.patientId)?.name || 'Unknown Patient',
                              patientId: formData.patientId,
                              medication: formData.medication,
                              dosage: formData.dosage,
                              frequency: formData.frequency,
                              duration: formData.duration,
                              status: 'active',
                              startDate: formData.startDate,
                              endDate: '',
                              notes: formData.notes
                            }
                          ]);
                          
                        } catch (error) {
                          console.error('Error creating prescription:', error);
                          toast({
                            title: "Error",
                            description: "Failed to create prescription. Please try again.",
                            variant: "destructive"
                          });
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Prescription'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Pill className="h-4 w-4 mr-2" />
                  Active Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {prescriptionsData.filter(p => p.status.toLowerCase() === 'active').length}
                </div>
                <p className="text-xs text-gray-500">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-gray-500">Within 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Total Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptionsData.length}</div>
                <p className="text-xs text-gray-500">All time</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex gap-4">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search prescriptions..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage & Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredPrescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <p className="text-gray-500">No prescriptions found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>{prescription.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{prescription.patientName}</div>
                            <div className="text-sm text-gray-500">ID: {prescription.patientId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{prescription.medication}</TableCell>
                        <TableCell>
                          <div>
                            <div>{prescription.dosage}</div>
                            <div className="text-sm text-gray-500">{prescription.frequency}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{prescription.startDate}</div>
                            <div className="text-sm text-gray-500">{prescription.duration}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(prescription.status)}>
                            {prescription.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Plus className="h-4 w-4 mr-2" />
                                Renew Prescription
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
