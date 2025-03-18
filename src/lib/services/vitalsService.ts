import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, orderBy, serverTimestamp, Timestamp, deleteDoc, limit } from 'firebase/firestore';
import { db, collections, User } from '../firebase';

// Vitals interface
export interface VitalSigns {
  id: string;
  patientId: string;
  recordedBy: string; // User ID of the healthcare provider who recorded the vitals
  timestamp: Date;
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  pain: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Vitals Service - Handles all vital signs related operations with Firestore
 */
export const vitalsService = {
  /**
   * Get vital signs for a patient
   * @param patientId - The patient's ID
   * @returns Array of vital signs records
   */
  async getPatientVitals(patientId: string) {
    try {
      const vitalsQuery = query(
        collection(db, collections.vitals),
        where('patientId', '==', patientId),
        orderBy('timestamp', 'desc')
      );

      const vitalsSnapshot = await getDocs(vitalsQuery);
      const vitals: Array<Omit<VitalSigns, 'timestamp'> & {
        id: string;
        patientName: string;
        recordedByName: string;
        timestamp: string;
      }> = [];

      for (const docSnapshot of vitalsSnapshot.docs) {
        const vitalData = docSnapshot.data() as VitalSigns;
        
        // Get the name of the healthcare provider who recorded the vitals
        const providerDoc = await getDoc(doc(db, collections.users, vitalData.recordedBy));
        const providerName = providerDoc.exists() ? (providerDoc.data() as User).displayName : 'Unknown';
        
        // Get the patient's name
        const patientDoc = await getDoc(doc(db, collections.users, vitalData.patientId));
        const patientName = patientDoc.exists() ? (patientDoc.data() as User).displayName : 'Unknown Patient';
        
        vitals.push({
          id: docSnapshot.id,
          ...vitalData,
          patientName,
          recordedByName: providerName,
          timestamp: vitalData.timestamp instanceof Timestamp ? 
            vitalData.timestamp.toDate().toLocaleString() : 
            new Date(vitalData.timestamp).toLocaleString(),
        });
      }

      return vitals;
    } catch (error) {
      console.error('Error getting patient vitals:', error);
      throw error;
    }
  },

  /**
   * Get all vital signs records (for healthcare providers)
   * @param limit - Optional limit on the number of records to return
   * @returns Array of vital signs records
   */
  async getAllVitals(limitCount?: number) {
    try {
      let vitalsQuery;
      
      if (limitCount) {
        vitalsQuery = query(
          collection(db, collections.vitals),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      } else {
        vitalsQuery = query(
          collection(db, collections.vitals),
          orderBy('timestamp', 'desc')
        );
      }

      const vitalsSnapshot = await getDocs(vitalsQuery);
      const vitals: Array<Omit<VitalSigns, 'timestamp'> & {
        id: string;
        patientName: string;
        recordedByName: string;
        timestamp: string;
      }> = [];

      for (const docSnapshot of vitalsSnapshot.docs) {
        const vitalData = docSnapshot.data() as VitalSigns;
        
        // Get the name of the healthcare provider who recorded the vitals
        const providerDoc = await getDoc(doc(db, collections.users, vitalData.recordedBy));
        const providerName = providerDoc.exists() ? (providerDoc.data() as User).displayName : 'Unknown';
        
        // Get the patient's name
        const patientDoc = await getDoc(doc(db, collections.users, vitalData.patientId));
        const patientName = patientDoc.exists() ? (patientDoc.data() as User).displayName : 'Unknown Patient';
        
        vitals.push({
          id: docSnapshot.id,
          ...vitalData,
          patientName,
          recordedByName: providerName,
          timestamp: vitalData.timestamp instanceof Timestamp ? 
            vitalData.timestamp.toDate().toLocaleString() : 
            new Date(vitalData.timestamp).toLocaleString(),
        });
      }

      return vitals;
    } catch (error) {
      console.error('Error getting all vitals:', error);
      throw error;
    }
  },

  /**
   * Get vital signs by status (for monitoring abnormal or critical vitals)
   * @param status - The status to filter by ('Normal', 'Abnormal', 'Critical')
   * @returns Array of vital signs records with the specified status
   */
  async getVitalsByStatus(status: VitalSigns['status']) {
    try {
      const vitalsQuery = query(
        collection(db, collections.vitals),
        where('status', '==', status),
        orderBy('timestamp', 'desc')
      );

      const vitalsSnapshot = await getDocs(vitalsQuery);
      const vitals: Array<Omit<VitalSigns, 'timestamp'> & {
        id: string;
        patientName: string;
        recordedByName: string;
        timestamp: string;
      }> = [];

      for (const docSnapshot of vitalsSnapshot.docs) {
        const vitalData = docSnapshot.data() as VitalSigns;
        
        // Get the name of the healthcare provider who recorded the vitals
        const providerDoc = await getDoc(doc(db, collections.users, vitalData.recordedBy));
        const providerName = providerDoc.exists() ? (providerDoc.data() as User).displayName : 'Unknown';
        
        // Get the patient's name
        const patientDoc = await getDoc(doc(db, collections.users, vitalData.patientId));
        const patientName = patientDoc.exists() ? (patientDoc.data() as User).displayName : 'Unknown Patient';
        
        vitals.push({
          id: docSnapshot.id,
          ...vitalData,
          patientName,
          recordedByName: providerName,
          timestamp: vitalData.timestamp instanceof Timestamp ? 
            vitalData.timestamp.toDate().toLocaleString() : 
            new Date(vitalData.timestamp).toLocaleString(),
        });
      }

      return vitals;
    } catch (error) {
      console.error('Error getting vitals by status:', error);
      throw error;
    }
  },

  /**
   * Get a specific vital signs record by ID
   * @param vitalId - The vital signs record ID
   * @returns The vital signs record or null if not found
   */
  async getVitalById(vitalId: string) {
    try {
      const vitalDoc = await getDoc(doc(db, collections.vitals, vitalId));
      
      if (!vitalDoc.exists()) {
        return null;
      }
      
      const vitalData = vitalDoc.data() as VitalSigns;
      
      // Get the name of the healthcare provider who recorded the vitals
      const providerDoc = await getDoc(doc(db, collections.users, vitalData.recordedBy));
      const providerName = providerDoc.exists() ? (providerDoc.data() as User).displayName : 'Unknown';
      
      // Get the patient's name
      const patientDoc = await getDoc(doc(db, collections.users, vitalData.patientId));
      const patientName = patientDoc.exists() ? (patientDoc.data() as User).displayName : 'Unknown Patient';
      
      return {
        id: vitalDoc.id,
        ...vitalData,
        patientName,
        recordedByName: providerName,
        timestamp: vitalData.timestamp instanceof Timestamp ? 
          vitalData.timestamp.toDate().toLocaleString() : 
          new Date(vitalData.timestamp).toLocaleString(),
      };
    } catch (error) {
      console.error('Error getting vital record:', error);
      throw error;
    }
  },

  /**
   * Record new vital signs
   * @param vitalData - The vital signs data to record
   * @returns The created vital signs record
   */
  async recordVitals(vitalData: Omit<VitalSigns, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Determine status based on vital signs values
      const status = this.determineVitalStatus(vitalData);
      
      const newVital = {
        ...vitalData,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, collections.vitals), newVital);
      
      return {
        id: docRef.id,
        ...newVital,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error recording vitals:', error);
      throw error;
    }
  },

  /**
   * Update an existing vital signs record
   * @param vitalId - The vital signs record ID
   * @param vitalData - The vital signs data to update
   * @returns Promise that resolves when the operation is complete
   */
  async updateVitals(vitalId: string, vitalData: Partial<VitalSigns>) {
    try {
      const vitalRef = doc(db, collections.vitals, vitalId);
      
      // If vital signs values are being updated, recalculate the status
      let status = vitalData.status;
      if (vitalData.temperature || vitalData.heartRate || vitalData.oxygenSaturation || vitalData.bloodPressure) {
        const currentVital = await this.getVitalById(vitalId);
        if (currentVital) {
          const updatedVital = { ...currentVital, ...vitalData };
          status = this.determineVitalStatus(updatedVital);
        }
      }
      
      await updateDoc(vitalRef, {
        ...vitalData,
        status,
        updatedAt: serverTimestamp()
      });
      
      return this.getVitalById(vitalId);
    } catch (error) {
      console.error('Error updating vitals:', error);
      throw error;
    }
  },

  /**
   * Delete a vital signs record
   * @param vitalId - The vital signs record ID
   * @returns Promise that resolves when the operation is complete
   */
  async deleteVitals(vitalId: string) {
    try {
      await deleteDoc(doc(db, collections.vitals, vitalId));
    } catch (error) {
      console.error('Error deleting vitals:', error);
      throw error;
    }
  },

  /**
   * Determine the status of vital signs based on values
   * @param vitalData - The vital signs data
   * @returns The status ('Normal', 'Abnormal', or 'Critical')
   */
  determineVitalStatus(vitalData: Partial<VitalSigns>): VitalSigns['status'] {
    // Parse values
    const temp = vitalData.temperature ? parseFloat(vitalData.temperature) : null;
    const hr = vitalData.heartRate ? parseInt(vitalData.heartRate) : null;
    const o2 = vitalData.oxygenSaturation ? parseInt(vitalData.oxygenSaturation) : null;
    const bp = vitalData.bloodPressure ? vitalData.bloodPressure.split('/').map(val => parseInt(val)) : null;
    const rr = vitalData.respiratoryRate ? parseInt(vitalData.respiratoryRate) : null;
    
    // Check for critical values
    if (
      (temp !== null && (temp >= 39.5 || temp <= 35.0)) ||
      (hr !== null && (hr >= 120 || hr <= 40)) ||
      (o2 !== null && o2 < 90) ||
      (bp !== null && (bp[0] >= 180 || bp[0] <= 90 || bp[1] >= 120 || bp[1] <= 60)) ||
      (rr !== null && (rr >= 30 || rr <= 8))
    ) {
      return 'Critical';
    }
    
    // Check for abnormal values
    if (
      (temp !== null && (temp >= 38.0 || temp <= 36.0)) ||
      (hr !== null && (hr >= 100 || hr <= 60)) ||
      (o2 !== null && o2 < 95) ||
      (bp !== null && (bp[0] >= 140 || bp[0] <= 100 || bp[1] >= 90 || bp[1] <= 65)) ||
      (rr !== null && (rr >= 20 || rr <= 12))
    ) {
      return 'Abnormal';
    }
    
    // Otherwise normal
    return 'Normal';
  }
};