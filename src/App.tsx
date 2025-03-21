import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";

// Patient pages
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientMessages from "./pages/patient/Messages";
import SymptomChecker from "./pages/patient/SymptomChecker";
import Telehealth from "./pages/patient/Telehealth";
import MedicalRecords from "./pages/patient/MedicalRecords";
import Prescriptions from "./pages/patient/Prescriptions";
import Pharmacy from "./pages/patient/Pharmacy";
import Checkout from "./pages/patient/Checkout";
import PaymentVerification from "./pages/patient/payment/verify";

// Doctor pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorMessages from "./pages/doctor/Messages";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import DoctorMedicalRecords from "./pages/doctor/MedicalRecords";
import DoctorTelehealth from "./pages/doctor/Telehealth";
import DoctorLabResults from "./pages/doctor/LabResults";

// Nurse pages
import NurseDashboard from "./pages/nurse/Dashboard";
import NurseMessages from "./pages/nurse/Messages";
import NurseCarePlans from "./pages/nurse/CarePlans";
import NurseVitals from "./pages/nurse/Vitals";
import NurseAppointments from "./pages/nurse/Appointments";
import NursePatients from "./pages/nurse/Patients";
import NurseTasks from "./pages/nurse/Tasks";
import NurseMedications from "./pages/nurse/Medications";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPatients from "./pages/admin/Patients";
import AdminDoctors from "./pages/admin/Doctors";
import AdminAppointments from "./pages/admin/Appointments";
import AdminReports from "./pages/admin/Reports";
import AdminBilling from "./pages/admin/Billing";
import AdminSettings from "./pages/admin/Settings";
import PharmacyAdmin from "./pages/admin/Pharmacy";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/about" element={<About />} />
              
              {/* Patient Routes */}
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/messages" element={<PatientMessages />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/telehealth" element={<Telehealth />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/patient/checkout" element={<Checkout cartItems={window.history.state?.cartItems || []} />} />
              <Route path="/patient/payment/verify" element={<PaymentVerification />} />
              
              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
              <Route path="/doctor/medical-records" element={<DoctorMedicalRecords />} />
              <Route path="/doctor/messages" element={<DoctorMessages />} />
              <Route path="/doctor/telehealth" element={<DoctorTelehealth />} />
              <Route path="/doctor/lab-results" element={<DoctorLabResults />} />
              
              {/* Nurse Routes */}
              <Route path="/nurse/dashboard" element={<NurseDashboard />} />
              <Route path="/nurse/patients" element={<NursePatients />} />
              <Route path="/nurse/appointments" element={<NurseAppointments />} />
              <Route path="/nurse/vitals" element={<NurseVitals />} />
              <Route path="/nurse/care-plans" element={<NurseCarePlans />} />
              <Route path="/nurse/tasks" element={<NurseTasks />} />
              <Route path="/nurse/medications" element={<NurseMedications />} />
              <Route path="/nurse/messages" element={<NurseMessages />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/patients" element={<AdminPatients />} />
              <Route path="/admin/doctors" element={<AdminDoctors />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/billing" element={<AdminBilling />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/pharmacy" element={<PharmacyAdmin />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
