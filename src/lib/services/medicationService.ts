import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Medication {
  id?: string;
  name: string;
  generic: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  requiresPrescription: boolean;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviews: number;
  dosage: string;
  dosageForm: string;
  manufacturer: string;
  expiryDate: Date;
}

const MEDICATIONS_COLLECTION = 'medications';

export const medicationService = {
  // Add new medication
  addMedication: async (medication: Omit<Medication, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, MEDICATIONS_COLLECTION), medication);
      return { id: docRef.id, ...medication };
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  },

  // Get all medications
  getMedications: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, MEDICATIONS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medication[];
    } catch (error) {
      console.error('Error getting medications:', error);
      throw error;
    }
  },

  // Update medication
  updateMedication: async (id: string, updates: Partial<Medication>) => {
    try {
      const medicationRef = doc(db, MEDICATIONS_COLLECTION, id);
      await updateDoc(medicationRef, updates);
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  },

  // Delete medication
  deleteMedication: async (id: string) => {
    try {
      await deleteDoc(doc(db, MEDICATIONS_COLLECTION, id));
      return id;
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  },

  // Subscribe to medications updates
  subscribeToMedications: (callback: (medications: Medication[]) => void) => {
    const q = collection(db, MEDICATIONS_COLLECTION);
    return onSnapshot(q, (querySnapshot) => {
      const medications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medication[];
      callback(medications);
    });
  },

  // Get medications by category
  getMedicationsByCategory: async (category: string) => {
    try {
      const q = query(
        collection(db, MEDICATIONS_COLLECTION),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medication[];
    } catch (error) {
      console.error('Error getting medications by category:', error);
      throw error;
    }
  }
};