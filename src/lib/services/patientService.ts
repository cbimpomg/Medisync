import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db, collections } from '../firebase';

export interface Patient {
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

/**
 * Patient Service - Handles all patient-related operations with Firestore
 */
export const patientService = {
  /**
   * Subscribe to patients updates
   * @param callback - Function to call when patients data updates
   * @returns Unsubscribe function
   */
  subscribeToPatients(callback: (patients: Patient[]) => void) {
    try {
      const patientsQuery = query(
        collection(db, collections.users),
        where('role', '==', 'patient')
      );
      
      return onSnapshot(patientsQuery, (snapshot) => {
        const patients = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.displayName || 'Unknown Patient',
            ...data as Omit<Patient, 'id'>
          };
        });
        callback(patients);
      }, (error) => {
        console.error('Error subscribing to patients:', error);
      });
    } catch (error) {
      console.error('Error setting up patient subscription:', error);
      throw error;
    }
  },
  /**
   * Get all patients
   * @returns Array of patients
   */
  async getAllPatients(): Promise<Patient[]> {
    try {
      const patientsQuery = query(
        collection(db, collections.users),
        where('role', '==', 'patient')
      );
      
      const querySnapshot = await getDocs(patientsQuery);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || 'Unknown Patient',
          ...data as Omit<Patient, 'id'>,
          vitals: data.vitals || {
            temperature: 'N/A',
            bloodPressure: 'N/A',
            heartRate: 'N/A',
            oxygenSaturation: 'N/A'
          }
        };
      });
    } catch (error) {
      console.error('Error getting patients:', error);
      throw error;
    }
  },

  /**
   * Get patient by ID
   * @param patientId - The patient's ID
   * @returns Patient data or null if not found
   */
  async getPatientById(patientId: string): Promise<Patient | null> {
    try {
      const patientDoc = await getDoc(doc(db, collections.users, patientId));
      if (patientDoc.exists()) {
        return {
          id: patientDoc.id,
          ...patientDoc.data() as Omit<Patient, 'id'>
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting patient:', error);
      throw error;
    }
  },

  /**
   * Get patients by status
   * @param status - The status to filter by
   * @returns Array of patients with the specified status
   */
  async getPatientsByStatus(status: 'Active' | 'Inactive'): Promise<Patient[]> {
    try {
      const patientsQuery = query(
        collection(db, collections.users),
        where('role', '==', 'patient'),
        where('status', '==', status)
      );
      
      const querySnapshot = await getDocs(patientsQuery);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || 'Unknown Patient',
          ...data as Omit<Patient, 'id'>,
          vitals: data.vitals || {
            temperature: 'N/A',
            bloodPressure: 'N/A',
            heartRate: 'N/A',
            oxygenSaturation: 'N/A'
          }
        };
      });
    } catch (error) {
      console.error('Error getting patients by status:', error);
      throw error;
    }
  }
};