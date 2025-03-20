import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, collections, Doctor } from '../firebase';

/**
 * Doctor Service - Handles all doctor-related operations with Firestore
 */
export const doctorService = {
  /**
   * Get all active doctors
   * @returns Array of active doctors
   */
  async getAllActiveDoctors(): Promise<(Doctor & {id: string})[]> {
    try {
      const doctorsQuery = query(
        collection(db, collections.users),
        where('role', '==', 'doctor')
      );
      
      const querySnapshot = await getDocs(doctorsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Doctor
      }));
    } catch (error) {
      console.error('Error getting doctors:', error);
      throw error;
    }
  },

  /**
   * Get doctors by specialization
   * @param specialization - The specialization to filter by
   * @returns Array of doctors with the specified specialization
   */
  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    try {
      const doctorsQuery = query(
        collection(db, collections.users),
        where('role', '==', 'doctor'),
        where('specialization', '==', specialization)
      );
      
      const querySnapshot = await getDocs(doctorsQuery);
      return querySnapshot.docs.map(doc => doc.data() as Doctor);
    } catch (error) {
      console.error('Error getting doctors by specialization:', error);
      throw error;
    }
  },

  /**
   * Get a doctor by their ID
   * @param doctorId - The doctor's ID
   * @returns The doctor data or null if not found
   */
  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    try {
      const doctorDoc = await getDoc(doc(db, collections.users, doctorId));
      if (doctorDoc.exists()) {
        const doctorData = doctorDoc.data() as Doctor;
        if (doctorData.role === 'doctor') {
          return doctorData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting doctor:', error);
      throw error;
    }
  }
};