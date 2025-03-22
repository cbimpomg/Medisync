import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, collections, Doctor } from '../firebase';

type DoctorStatus = 'Active' | 'On Leave' | 'Inactive';

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
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || 'Unknown Doctor',
          status: (data.status || 'Inactive') as DoctorStatus,
          ...data as Doctor
        };
      });
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          uid: doc.id,
          id: doc.id,
          email: data.email || '',
          role: 'doctor',
          displayName: data.displayName || 'Unknown Doctor',
          specialization: data.specialization || '',
          experience: data.experience || '',
          qualifications: data.qualifications || '',
          licenseNumber: data.licenseNumber || '',
          schedule: data.schedule || '',
          patients: data.patients || 0,
          rating: data.rating || 0,
          status: (data.status || 'Inactive') as DoctorStatus,
          createdAt: data.createdAt || new Date(),
          updatedAt: data.updatedAt || new Date()
        } as Doctor;
      });
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
        const data = doctorDoc.data();
        if (data.role === 'doctor') {
          return {
            ...data,
            uid: doctorDoc.id,
            id: doctorDoc.id,
            email: data.email || '',
            role: 'doctor',
            displayName: data.displayName || 'Unknown Doctor',
            specialization: data.specialization || '',
            experience: data.experience || '',
            qualifications: data.qualifications || '',
            licenseNumber: data.licenseNumber || '',
            schedule: data.schedule || '',
            patients: data.patients || 0,
            rating: data.rating || 0,
            status: (data.status || 'Inactive') as DoctorStatus,
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date()
          } as Doctor;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting doctor:', error);
      throw error;
    }
  }
};