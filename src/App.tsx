
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Patient pages
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";

// Doctor pages
import DoctorDashboard from "./pages/doctor/Dashboard";

// Nurse pages
import NurseDashboard from "./pages/nurse/Dashboard";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Patient Routes */}
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<NotFound />} />
            <Route path="/doctor/patients" element={<NotFound />} />
            <Route path="/doctor/prescriptions" element={<NotFound />} />
            <Route path="/doctor/medical-records" element={<NotFound />} />
            <Route path="/doctor/messages" element={<NotFound />} />
            <Route path="/doctor/telehealth" element={<NotFound />} />
            <Route path="/doctor/lab-results" element={<NotFound />} />
            
            {/* Nurse Routes */}
            <Route path="/nurse/dashboard" element={<NurseDashboard />} />
            <Route path="/nurse/patients" element={<NotFound />} />
            <Route path="/nurse/appointments" element={<NotFound />} />
            <Route path="/nurse/vitals" element={<NotFound />} />
            <Route path="/nurse/care-plans" element={<NotFound />} />
            <Route path="/nurse/tasks" element={<NotFound />} />
            <Route path="/nurse/medications" element={<NotFound />} />
            <Route path="/nurse/messages" element={<NotFound />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
