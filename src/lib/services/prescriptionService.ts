import { collection, query, where, getDocs, addDoc, doc, getDoc, orderBy, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, collections } from '../firebase';

export interface Prescription {
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

/**
 * Prescription Service - Handles all prescription-related operations with Firestore
 */
export const prescriptionService = {
  /**
   * Create a new prescription
   * @param prescriptionData - The prescription data
   * @returns The created prescription
   */
  async createPrescription(prescriptionData: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Prescription> {
    try {
      const newPrescription = {
        ...prescriptionData,
        status: 'active' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, collections.prescriptions), newPrescription);
      
      return {
        id: docRef.id,
        ...newPrescription,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },

  /**
   * Get prescriptions for a specific patient
   * @param patientId - The patient's ID
   * @returns Array of prescriptions
   */
  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    try {
      const prescriptionsQuery = query(
        collection(db, collections.prescriptions),
        where('patientId', '==', patientId),
        orderBy('createdAt', 'desc')
      );

      const prescriptionsSnapshot = await getDocs(prescriptionsQuery);
      return prescriptionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Prescription[];
    } catch (error) {
      console.error('Error getting patient prescriptions:', error);
      throw error;
    }
  },

  /**
   * Get prescriptions created by a specific doctor
   * @param doctorId - The doctor's ID
   * @returns Array of prescriptions
   */
  async getDoctorPrescriptions(doctorId: string): Promise<Prescription[]> {
    try {
      if (!doctorId) {
        console.error('getDoctorPrescriptions called with invalid doctorId');
        throw new Error('Doctor ID is required to fetch prescriptions');
      }

      console.log('getDoctorPrescriptions called with doctorId:', doctorId);
      
      const prescriptionsQuery = query(
        collection(db, collections.prescriptions),
        where('doctorId', '==', doctorId),
        orderBy('createdAt', 'desc')
      );

      console.log('Executing Firestore query for prescriptions');
      const prescriptionsSnapshot = await getDocs(prescriptionsQuery);
      console.log('Query completed, documents found:', prescriptionsSnapshot.size);
      
      if (prescriptionsSnapshot.size === 0) {
        console.log('No prescriptions found for doctor:', doctorId);
      }
      
      return prescriptionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Prescription[];
    } catch (error) {
      console.error('Error getting doctor prescriptions:', error);
      throw error;
    }
  },

  /**
   * Get a specific prescription by ID
   * @param prescriptionId - The prescription ID
   * @returns The prescription data or null if not found
   */
  async getPrescriptionById(prescriptionId: string): Promise<Prescription | null> {
    try {
      const prescriptionDoc = await getDoc(doc(db, collections.prescriptions, prescriptionId));
      
      if (!prescriptionDoc.exists()) {
        return null;
      }
      
      const data = prescriptionDoc.data();
      return {
        id: prescriptionDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as Prescription;
    } catch (error) {
      console.error('Error getting prescription:', error);
      throw error;
    }
  },

  /**
   * Update prescription status
   * @param prescriptionId - The prescription ID
   * @param status - The new status
   * @returns The updated prescription
   */
  async updatePrescriptionStatus(
    prescriptionId: string,
    status: Prescription['status']
  ): Promise<Prescription | null> {
    try {
      const prescriptionRef = doc(db, collections.prescriptions, prescriptionId);
      const prescriptionDoc = await getDoc(prescriptionRef);
      
      if (!prescriptionDoc.exists()) {
        return null;
      }
      
      await updateDoc(prescriptionRef, {
        status,
        updatedAt: serverTimestamp()
      });
      
      return this.getPrescriptionById(prescriptionId);
    } catch (error) {
      console.error('Error updating prescription status:', error);
      throw error;
    }
  }
};