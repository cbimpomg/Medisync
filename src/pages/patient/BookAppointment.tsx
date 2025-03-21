import { useState, useEffect } from 'react';
import { Check, UserRound, ArrowRight, Calendar, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctorService } from '@/lib/services/doctorService';
import { appointmentService } from '@/lib/services/appointmentService';
import { Doctor } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

// Extended Doctor interface for UI
interface DoctorWithUI extends Doctor {
  id: string;
  availableDates: string[];
  availableTimeSlots?: { [date: string]: string[] };
  name: string;
  image: string;
  rating: number;
  specialization: string;
  status: 'Active' | 'Inactive';
  displayName: string;
  photoURL?: string;
}

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'telehealth' | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [doctors, setDoctors] = useState<DoctorWithUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  // Helper function to generate available dates without doctor check
  const generateBasicAvailableDates = () => {
    const dates: string[] = [];
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // Generate dates for the next 30 days
    for (let i = 1; i <= 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };
  
  // Function to check if a doctor is available on a specific date
  const isDoctorAvailableOnDate = (doctorId: string, dateStr: string) => {
    const doctor = doctors.find(doc => doc.id === doctorId);
    if (!doctor || doctor.status !== 'Active') return false;
    return doctor.availableDates.includes(dateStr);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const fetchedDoctors = await doctorService.getAllActiveDoctors();
        const doctorsWithUI = fetchedDoctors.map(doctor => ({
          ...doctor,
          name: doctor.displayName, // Map displayName to name for UI
          image: doctor.photoURL || '/images/placeholder.svg', // Map photoURL to image with fallback
          availableDates: generateBasicAvailableDates(), // Use basic dates without doctor check
          status: 'Active' // Set default status to Active
        }));
        setDoctors(doctorsWithUI as DoctorWithUI[]);


        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);
  
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
  ];
  
  const filteredDoctors = doctors.filter(doctor => doctor.status === 'Active');
  
  const selectedDoctorData = doctors.find(doc => doc.id === selectedDoctor);
  
  // Calendar functions and data
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const isDateAvailable = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Check if date is in the future and within the next 30 days
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
  
    // Check if the selected doctor has this date available
    const dateStr = dateToCheck.toISOString().split('T')[0];
    const isDoctorAvailable = selectedDoctor ? 
      doctors.find(doc => doc.id === selectedDoctor)?.availableDates?.includes(dateStr) : 
      true;
  
    return dateToCheck > today && 
           dateToCheck <= thirtyDaysFromNow && 
           isDoctorAvailable && 
           dateToCheck.getDay() !== 0 && // Exclude Sundays
           dateToCheck.getDay() !== 6;   // Exclude Saturdays
  };
  
  const selectDate = (day: number) => {
    if (!day) return;
    
    const dateObj = new Date(currentYear, currentMonth, day);
    if (!isDateAvailable(day)) {
      toast({
        title: "Invalid Date",
        description: "Please select an available date within the next 30 days (excluding weekends).",
        variant: "destructive"
      });
      return;
    }
    
    const dateStr = dateObj.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };
  
  const handleContinue = () => {
    if (step === 1 && !appointmentType) {
      toast({
        title: "Selection Required",
        description: "Please select how you'd like to meet the specialist",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2 && !selectedDoctor) {
      toast({
        title: "Selection Required",
        description: "Please select a doctor",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 3 && (!selectedDate || !selectedTime)) {
      toast({
        title: "Selection Required",
        description: "Please select both date and time",
        variant: "destructive"
      });
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const confirmAppointment = async () => {
    try {
      if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
        throw new Error("Missing required information for appointment");
      }

      if (!selectedDoctorData || selectedDoctorData.status !== 'Active') {
        throw new Error("Selected doctor is not available");
      }

      setSubmitting(true);
      try {
        const appointmentDate = new Date(selectedDate);
        if (isNaN(appointmentDate.getTime())) {
          throw new Error('Invalid date selected');
        }

        if (!isDoctorAvailableOnDate(selectedDoctor, selectedDate)) {
          throw new Error('Doctor is not available on selected date');
        }

        await appointmentService.createAppointment({
          patientId: user.uid,
          patientName: user.displayName || 'Unknown Patient',
          doctorId: selectedDoctor,
          date: appointmentDate,
          time: selectedTime,
          type: appointmentType || 'in-person',
          status: 'Scheduled',
          notes: ''
        });

        toast({
          title: "Success",
          description: `Your appointment has been scheduled for ${selectedDate} at ${selectedTime}`,
        });

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } catch (error: Error | unknown) {
        console.error('Error creating appointment:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create appointment. Please try again.",
          variant: "destructive"
        });
      } finally {
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to confirm appointment. Please try again.",
        variant: "destructive"
      });
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
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-black drop-shadow-lg shadow-black">Book an Appointment</h1>
          </div>
          
          <div className="mb-8 bg-white/85 rounded-xl shadow-xl p-6">
            <div className="flex justify-center items-center mb-8">
              <div className="flex items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i <= step ? 'bg-medisync-primary text-white' : 'bg-white text-gray-400 border border-gray-200'
                    }`}>
                      {i < step ? <Check className="h-5 w-5" /> : i}
                    </div>
                    {i < 4 && (
                      <div className={`w-16 h-1 ${
                        i < step ? 'bg-medisync-primary' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-center mb-6">How Would You Like To Meet The Specialist?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card 
                    className={`cursor-pointer hover:border-medisync-primary transition-all shadow-md hover:shadow-lg ${
                      appointmentType === 'in-person' ? 'border-2 border-medisync-primary' : ''
                    }`}
                    onClick={() => setAppointmentType('in-person')}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-4 text-medisync-primary">
                        <Calendar className="h-10 w-10" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">In-person Visit</h3>
                      <p className="text-gray-600 text-sm">Visit the clinic for a face to face consultation</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer hover:border-medisync-primary transition-all shadow-md hover:shadow-lg ${
                      appointmentType === 'telehealth' ? 'border-2 border-medisync-primary' : ''
                    }`}
                    onClick={() => setAppointmentType('telehealth')}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-4 text-medisync-primary">
                        <Video className="h-10 w-10" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Telehealth</h3>
                      <p className="text-gray-600 text-sm">Connect with your doctor via video call</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-center mb-6">Select a Specialist</h2>
                

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {loading ? (
                    <div className="col-span-2 py-8 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medisync-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading doctors...</p>
                    </div>
                  ) : filteredDoctors.length === 0 ? (
                    <div className="col-span-2 py-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <UserRound className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">No doctors found</h3>
                      <p className="text-gray-600">
                        No doctors are currently available in the system.
                      </p>
                    </div>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <Card 
                        key={doctor.id}
                        className={`cursor-pointer hover:border-medisync-primary transition-all shadow-md hover:shadow-lg ${
                          selectedDoctor === doctor.id ? 'border-2 border-medisync-primary' : ''
                        }`}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img 
                              src={doctor.image} 
                              alt={doctor.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">{doctor.specialization}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.floor(doctor.rating) ? "#FFD700" : "none"} stroke={i < Math.floor(doctor.rating) ? "#FFD700" : "currentColor"} className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm ml-1">{doctor.rating}</span>
                          </div>
                        </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div> 
              </div>
            )}
            
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-center mb-6">Choose Time And Date</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Calendar view */}
                  <div>
                    <h3 className="font-medium mb-4">Select a date</h3>
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-center mb-4">
                        <button 
                          onClick={handlePrevMonth}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h4 className="font-medium">{monthNames[currentMonth]} {currentYear}</h4>
                        <button 
                          onClick={handleNextMonth}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {weekdays.map(day => (
                          <div key={day} className="text-xs font-medium text-gray-500 py-1">
                            {day}
                          </div>
                        ))}
                        
                        {calendarDays.map((day, i) => (
                          <div key={i}>
                            {day ? (
                              <button 
                                className={`w-full aspect-square rounded-full flex items-center justify-center text-sm
                                  ${isDateAvailable(day) ? 'hover:bg-gray-100 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}
                                  ${selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? 
                                    'bg-medisync-primary text-white' : ''}
                                `}
                                disabled={!isDateAvailable(day)}
                                onClick={() => selectDate(day)}
                              >
                                {day}
                              </button>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500">
                        {selectedDoctorData ? (
                          <p>Available dates for {selectedDoctorData.name} are highlighted</p>
                        ) : (
                          <p>Please select a doctor to see available dates</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Select time <span className="text-gray-400">(30 mins)</span></h3>
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                            selectedTime === time 
                              ? 'bg-medisync-primary text-white border-medisync-primary' 
                              : 'bg-white border-gray-200 hover:border-medisync-primary/50'
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    
                    {selectedDate && selectedDoctorData && (
                      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-2">Appointment Summary</h4>
                        <p className="text-sm text-blue-700">
                          {appointmentType === 'in-person' ? 'In-person visit' : 'Telehealth'} with {selectedDoctorData.name}
                        </p>
                        <p className="text-sm text-blue-700">
                          {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                          {selectedTime ? ` at ${selectedTime}` : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-center mb-6">Appointment Confirmation</h2>
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Appointment Booked Successfully</h3>
                    <p className="text-gray-500 mb-4">Your appointment details have been confirmed</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Appointment Type:</div>
                        <div className="font-medium">{appointmentType === 'in-person' ? 'In-person Visit' : 'Telehealth'}</div>
                        
                        <div className="text-gray-500">Doctor:</div>
                        <div className="font-medium">{selectedDoctorData?.name}</div>
                        
                        <div className="text-gray-500">Specialty:</div>
                        <div className="font-medium">{selectedDoctorData?.specialization}</div>
                        
                        <div className="text-gray-500">Date:</div>
                        <div className="font-medium">{new Date(selectedDate).toLocaleDateString()}</div>
                        
                        <div className="text-gray-500">Time:</div>
                        <div className="font-medium">{selectedTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="bg-medisync-primary hover:bg-medisync-secondary" 
                        onClick={confirmAppointment}
                        disabled={submitting}
                      >
                        {submitting ? 'Confirming...' : 'Go to Dashboard'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {step < 4 && (
              <div className="flex justify-between mt-8 max-w-lg mx-auto">
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                  Back
                </Button>
                <Button className="bg-medisync-primary hover:bg-medisync-secondary" onClick={handleContinue}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
