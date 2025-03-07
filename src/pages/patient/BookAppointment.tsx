
import { useState } from 'react';
import { Check, UserRound, ArrowRight, Calendar, Video } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'telehealth' | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const doctors = [
    {
      id: '1',
      name: 'Dr.John Doe',
      specialty: 'General Physician',
      rating: 4.8,
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '2',
      name: 'Dr.John Doe',
      specialty: 'General Physician',
      rating: 4.5,
      image: 'https://randomuser.me/api/portraits/men/33.jpg'
    },
    {
      id: '3',
      name: 'Dr.John Doe',
      specialty: 'General Physician',
      rating: 4.9,
      image: 'https://randomuser.me/api/portraits/men/34.jpg'
    },
    {
      id: '4',
      name: 'Dr.John Doe',
      specialty: 'General Physician',
      rating: 4.7,
      image: 'https://randomuser.me/api/portraits/men/35.jpg'
    }
  ];
  
  const timeSlots = [
    '9:00am', '10:00am', '11:00am', '12:00pm',
    '1:00pm', '2:00pm', '3:00pm', '4:00pm'
  ];
  
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
  
  const confirmAppointment = () => {
    toast({
      title: "Appointment Confirmed",
      description: `Your appointment has been scheduled for ${selectedDate} at ${selectedTime}`,
    });
    // In a real app, you would save the appointment to the backend here
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <PatientSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
          </div>
          
          <div className="mb-8">
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
                <h2 className="text-xl font-semibold text-center mb-6">How Would Like To Meet The Specialist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card 
                    className={`cursor-pointer hover:border-medisync-primary transition-all ${
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
                    className={`cursor-pointer hover:border-medisync-primary transition-all ${
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
                  {doctors.map((doctor) => (
                    <Card 
                      key={doctor.id}
                      className={`cursor-pointer hover:border-medisync-primary transition-all ${
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
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
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
                  ))}
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-center mb-6">Choose Time And Date</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div>
                    <h3 className="font-medium mb-2">Select date</h3>
                    <input 
                      type="date" 
                      className="medisync-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Select time <span className="text-gray-400">(30 mins)</span></h3>
                    <div className="grid grid-cols-3 gap-2">
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
                  </div>
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-center mb-6">Appointment Confirmed</h2>
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-4">Telehealth</h3>
                    
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img 
                          src="https://randomuser.me/api/portraits/men/32.jpg" 
                          alt="Dr John Doe"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>
                    
                    <p className="font-medium">Dr.John Doe</p>
                    <p className="text-sm text-gray-600 mb-4">General Physician</p>
                    
                    <div className="flex justify-center items-center gap-6 text-sm">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-5 w-5 mb-1 text-medisync-primary" />
                        <span>{selectedDate || 'dd/mm/yy'}</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <Clock className="h-5 w-5 mb-1 text-medisync-primary" />
                        <span>{selectedTime || '9:00am'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            {step > 1 && step < 4 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="px-6"
              >
                Back
              </Button>
            )}
            
            {step < 4 && (
              <Button 
                className="bg-medisync-primary hover:bg-medisync-secondary ml-auto px-6"
                onClick={handleContinue}
              >
                Next
              </Button>
            )}
            
            {step === 4 && (
              <Button 
                className="bg-medisync-primary hover:bg-medisync-secondary mx-auto px-8"
                onClick={confirmAppointment}
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default BookAppointment;
