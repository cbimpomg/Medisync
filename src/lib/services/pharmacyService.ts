import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, collections } from '../firebase';

export interface Medication {
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
  createdAt?: Date;
  updatedAt?: Date;
}

export const pharmacyService = {
  async getMedications() {
    try {
      const medicationsRef = collection(db, collections.medications);
      const medicationsQuery = query(medicationsRef, orderBy('name'));
      const querySnapshot = await getDocs(medicationsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        expiryDate: doc.data().expiryDate?.toDate()
      })) as Medication[];
    } catch (error) {
      console.error('Error getting medications:', error);
      throw error;
    }
  },

  async getMedicationById(id: string) {
    try {
      const medicationDoc = await getDoc(doc(db, collections.medications, id));
      if (!medicationDoc.exists()) return null;

      const data = medicationDoc.data();
      return {
        id: medicationDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        expiryDate: data.expiryDate?.toDate()
      } as Medication;
    } catch (error) {
      console.error('Error getting medication:', error);
      throw error;
    }
  },

  async createMedication(medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt' | 'inStock'>) {
    try {
      const newMedication = {
        ...medicationData,
        inStock: medicationData.stockQuantity > 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, collections.medications), newMedication);
      return {
        id: docRef.id,
        ...newMedication,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Medication;
    } catch (error) {
      console.error('Error creating medication:', error);
      throw error;
    }
  },

  async updateMedication(id: string, medicationData: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
      const medicationRef = doc(db, collections.medications, id);
      const updateData = {
        ...medicationData,
        inStock: medicationData.stockQuantity ? medicationData.stockQuantity > 0 : undefined,
        updatedAt: serverTimestamp()
      };

      await updateDoc(medicationRef, updateData);
      return this.getMedicationById(id);
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  },

  async deleteMedication(id: string) {
    try {
      await deleteDoc(doc(db, collections.medications, id));
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  },

  async searchMedications(query: string) {
    try {
      const medications = await this.getMedications();
      const searchQuery = query.toLowerCase();
      
      return medications.filter(med => 
        med.name.toLowerCase().includes(searchQuery) ||
        med.generic.toLowerCase().includes(searchQuery) ||
        med.description.toLowerCase().includes(searchQuery)
      );
    } catch (error) {
      console.error('Error searching medications:', error);
      throw error;
    }
  }
};