import { doc, getDoc, collection, query, where, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, collections } from '../firebase';

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  recordType: string;
  category: string;
  date: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  provider: string;
  summary: string;
  attachments: string[];
}

/**
 * Medical Record Service - Handles all medical record-related operations with Firestore
 */
export const medicalRecordService = {
  /**
   * Subscribe to medical records updates
   * @param callback - Function to call when medical records data updates
   * @returns Unsubscribe function
   */
  subscribeToMedicalRecords(callback: (records: MedicalRecord[]) => void) {
    try {
      const recordsQuery = query(
        collection(db, collections.medicalRecords)
      );
      
      return onSnapshot(recordsQuery, (snapshot) => {
        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<MedicalRecord, 'id'>
        }));
        callback(records);
      });
    } catch (error) {
      console.error('Error subscribing to medical records:', error);
      throw error;
    }
  },

  /**
   * Get a single medical record by ID
   * @param recordId - The ID of the medical record
   * @returns Promise resolving to the medical record
   */
  async getMedicalRecord(recordId: string): Promise<MedicalRecord | null> {
    try {
      const recordDoc = await getDoc(doc(db, collections.medicalRecords, recordId));
      if (!recordDoc.exists()) return null;
      
      return {
        id: recordDoc.id,
        ...recordDoc.data() as Omit<MedicalRecord, 'id'>
      };
    } catch (error) {
      console.error('Error getting medical record:', error);
      throw error;
    }
  },

  /**
   * Get medical records for a specific patient
   * @param patientId - The ID of the patient
   * @returns Promise resolving to an array of medical records
   */
  async getPatientMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    try {
      const recordsQuery = query(
        collection(db, collections.medicalRecords),
        where('patientId', '==', patientId)
      );
      
      const snapshot = await getDocs(recordsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<MedicalRecord, 'id'>
      }));
    } catch (error) {
      console.error('Error getting patient medical records:', error);
      throw error;
    }
  },

  /**
   * Create a new medical record
   * @param record - The medical record data to create
   * @returns Promise resolving to the created medical record
   */
  async createMedicalRecord(record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
    try {
      const docRef = await addDoc(collection(db, collections.medicalRecords), record);
      return {
        id: docRef.id,
        ...record
      };
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  },

  /**
   * Update an existing medical record
   * @param recordId - The ID of the medical record to update
   * @param updates - The updates to apply to the medical record
   * @returns Promise resolving when the update is complete
   */
  async updateMedicalRecord(recordId: string, updates: Partial<MedicalRecord>): Promise<void> {
    try {
      await updateDoc(doc(db, collections.medicalRecords, recordId), updates);
    } catch (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }
  },

  /**
   * Delete a medical record
   * @param recordId - The ID of the medical record to delete
   * @returns Promise resolving when the deletion is complete
   */
  async deleteMedicalRecord(recordId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collections.medicalRecords, recordId));
    } catch (error) {
      console.error('Error deleting medical record:', error);
      throw error;
    }
  }
};