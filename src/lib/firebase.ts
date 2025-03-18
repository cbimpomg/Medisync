import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJdqlA_cPG8BV1k_jrHLgWG4ROzd0gOEs",
    authDomain: "syncra-health.firebaseapp.com",
    projectId: "syncra-health",
    storageBucket: "syncra-health.firebasestorage.app",
    messagingSenderId: "1098843065499",
    appId: "1:1098843065499:web:f5875c5a18ecac7e214a3e",
    measurementId: "G-30EEFWD3J2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache configuration
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});

// Initialize and export Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);

// Collection references
export const collections = {
    users: 'users',
    doctors: 'doctors',
    nurses: 'nurses',
    patients: 'patients',
    appointments: 'appointments',
    medicalRecords: 'medicalRecords',
    prescriptions: 'prescriptions',
    messages: 'messages',
    vitals: 'vitals',
    carePlans: 'carePlans',
    tasks: 'tasks',
    medications: 'medications',
    reports: 'reports',
    billing: 'billing'
} as const;

// Database schema types
export interface User {
    uid: string;
    email: string;
    role: 'admin' | 'doctor' | 'nurse' | 'patient';
    displayName: string;
    photoURL?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Doctor extends User {
  specialization: string;
  experience: string;
  qualifications: string;
  licenseNumber: string;
  schedule: string;
  patients: number;
  rating: number;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface Patient extends User {
  patientId: string;
  dateOfBirth: Date;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  medicalHistory: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  time: string;
  type: string;
  status: 'Scheduled' | 'Checked In' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  type: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;3
  read: boolean;
  createdAt: Date;
}

// Security rules will be configured in Firebase Console:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Common functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isDoctor() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor';
    }
    
    function isNurse() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'nurse';
    }
    
    function isPatient() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'patient';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || request.auth.uid == userId;
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin() || 
        resource.data.doctorId == request.auth.uid || 
        resource.data.patientId == request.auth.uid;
    }
    
    // Medical records collection
    match /medicalRecords/{recordId} {
      allow read: if isAdmin() || 
        resource.data.doctorId == request.auth.uid || 
        resource.data.patientId == request.auth.uid;
      allow create: if isDoctor();
      allow update: if isDoctor() && resource.data.doctorId == request.auth.uid;
      allow delete: if isAdmin();
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if isAuthenticated() && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
      allow delete: if isAdmin();
    }
  }
}
*/