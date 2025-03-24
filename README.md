
# Syncra Health Portal

A comprehensive healthcare management system designed to streamline medical services, enhance patient care, and improve healthcare provider efficiency. The platform facilitates seamless communication between patients, doctors, and nurses while managing appointments, prescriptions, and patient records in real-time.

## System Architecture

### Frontend (Portal)
- **Technology Stack**: React + TypeScript + Vite
- **State Management**: React Context API
- **UI Framework**: Tailwind CSS
- **Real-time Updates**: Firebase Firestore subscriptions
- **Responsive Design**: Optimized for multiple devices

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **API Layer**: Firebase Admin SDK
- **Real-time Sync**: WebSocket-based subscriptions

## Core Services

### Appointment Service

#### Features
- Real-time appointment tracking
- Separate handling for in-person and telehealth appointments
- Automatic status updates
- Availability checking
- Automated notifications

#### Appointment Types
- **In-person**: Traditional clinic visits
- **Telehealth**: Remote video consultations

#### Appointment Status Flow
1. scheduled → in-progress → completed
2. scheduled → cancelled

### Prescription Service

#### Features
- Digital prescription management
- Medication tracking
- Status updates (active/completed/cancelled)
- Historical prescription records

#### Prescription Data Model
```typescript
interface Prescription {
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  status: 'active' | 'completed' | 'cancelled';
}
```

### Patient Service

#### Features
- Patient profile management
- Real-time vitals tracking
- Insurance information handling
- Medical history maintenance

#### Patient Data Model
```typescript
interface Patient {
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSaturation: string;
  };
  status: 'Active' | 'Inactive';
}
```

### Notification Service

#### Types of Notifications
1. **Appointment Notifications**
   - Schedule confirmations
   - Reminders
   - Status updates

2. **Billing Notifications**
   - Payment due
   - Payment received

## Real-time Subscription Patterns

### Appointment Subscriptions
```typescript
subscribeToAppointments(role, userId, callback)
subscribeToTelehealthAppointments(role, userId, callback)
```

### Patient Subscriptions
```typescript
subscribeToPatients(callback)
```

## Security

### Authentication
- Role-based access control (RBAC)
- Secure session management
- Firebase Authentication integration
- Protected routes

### Data Access
- Firestore security rules
- Field-level security
- Data encryption
- Input validation

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git for version control

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file based on `.env.example`
4. Configure Firebase credentials
5. Start development server: `npm run dev`
6. Access the application at `http://localhost:5173`

## Best Practices

### Code Organization
- Services in `src/lib/services`
- Components in `src/components`
- Pages in `src/pages`
- Hooks in `src/hooks`
- Component-based architecture
- Type-safe development with TypeScript

### Error Handling
- Consistent error logging
- User-friendly error messages
- Graceful degradation

### Performance
- Optimized Firebase queries
- Efficient real-time subscriptions
- Lazy loading of components
- Efficient data caching
- Minimized bundle size

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Create pull request

## License

MIT License