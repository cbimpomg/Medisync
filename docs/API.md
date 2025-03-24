# Syncra Health Portal API Documentation

## Service Interfaces

### Appointment Service

#### Methods

##### `subscribeToAppointments(role, userId, callback)`
- **Purpose**: Real-time subscription to appointment updates
- **Parameters**:
  - `role`: 'doctor' | 'nurse' | 'patient'
  - `userId`: string (optional for nurses)
  - `callback`: Function to handle updates
- **Returns**: Unsubscribe function
- **Usage Example**:
```typescript
const unsubscribe = appointmentService.subscribeToAppointments('doctor', doctorId, (appointments) => {
  console.log('Updated appointments:', appointments);
});
```

##### `getAppointments(userId, role)`
- **Purpose**: Fetch all appointments for a user
- **Parameters**:
  - `userId`: string
  - `role`: 'doctor' | 'nurse' | 'patient'
- **Returns**: Promise<Array<Appointment>>

##### `getAppointmentsByDate(date, userId?, role?)`
- **Purpose**: Get appointments for a specific date
- **Parameters**:
  - `date`: Date
  - `userId`: string (optional)
  - `role`: 'doctor' | 'nurse' | 'patient' (optional)
- **Returns**: Promise<Array<Appointment>>

### Prescription Service

#### Methods

##### `createPrescription(prescriptionData)`
- **Purpose**: Create a new prescription
- **Parameters**:
  - `prescriptionData`: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>
- **Returns**: Promise<Prescription>

##### `getPatientPrescriptions(patientId)`
- **Purpose**: Get all prescriptions for a patient
- **Parameters**:
  - `patientId`: string
- **Returns**: Promise<Array<Prescription>>

### Patient Service

#### Methods

##### `subscribeToPatients(callback)`
- **Purpose**: Real-time subscription to patient updates
- **Parameters**:
  - `callback`: Function to handle updates
- **Returns**: Unsubscribe function

##### `getAllPatients()`
- **Purpose**: Get all patients
- **Returns**: Promise<Array<Patient>>

### Notification Service

#### Methods

##### `createAppointmentNotification(notification, recipientType, recipientId?)`
- **Purpose**: Create appointment-related notification
- **Parameters**:
  - `notification`: AppointmentNotification
  - `recipientType`: 'doctor' | 'manager'
  - `recipientId`: string (required for doctor notifications)
- **Returns**: Promise<AppointmentNotification>

## Data Models

### Appointment
```typescript
interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  date: Date;
  time: string;
  type: 'in-person' | 'telehealth';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Prescription
```typescript
interface Prescription {
  id?: string;
  patientId: string;
  doctorId: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Patient
```typescript
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  registrationDate: string;
  status: 'Active' | 'Inactive';
  insuranceProvider: string;
  insuranceNumber: string;
  nextCheckup?: string;
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSaturation: string;
  };
}
```

### AppointmentNotification
```typescript
interface AppointmentNotification {
  id?: string;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  date: Date;
  time: string;
  type: string;
  status: string;
  createdAt: Date;
  recipientId?: string;
  recipientType?: 'doctor' | 'manager';
  isRead?: boolean;
}
```