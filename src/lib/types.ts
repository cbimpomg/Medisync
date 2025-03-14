export interface PatientProfileUpdateData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface AppointmentCreateData {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  reason: string;
  notes?: string;
}

export interface AppointmentUpdateData {
  date?: string;
  time?: string;
  type?: 'consultation' | 'follow-up' | 'emergency';
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  userType: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}