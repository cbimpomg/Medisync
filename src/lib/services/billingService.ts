import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { notificationService } from './notificationService';
import { db, collections } from '../firebase';

export enum PaymentStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue'
}

export type PaymentMethod = 'Credit Card' | 'Insurance' | 'Cash';

interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  treatmentId: string;
  treatmentType: string;
  doctorId: string;
  doctorName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  insuranceProvider?: string;
  insuranceCoverage?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Billing Service - Handles all billing-related operations with Firestore
 */
export const billingService = {
  /**
   * Create a new billing record for a treatment
   */
  async createBillingRecord(data: Omit<BillingRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const billingRef = collection(db, collections.billing);
      const docRef = await addDoc(billingRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Send notification to patient
      await notificationService.sendBillingNotification(
        data.patientId,
        data.amount,
        data.dueDate
      );

      return docRef.id;
    } catch (error) {
      console.error('Error creating billing record:', error);
      throw error;
    }
  },

  /**
   * Get all billing records
   */
  async getAllBillingRecords(): Promise<BillingRecord[]> {
    try {
      const billingQuery = query(collection(db, collections.billing));
      const querySnapshot = await getDocs(billingQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<BillingRecord, 'id'>
      }));
    } catch (error) {
      console.error('Error getting billing records:', error);
      throw error;
    }
  },

  /**
   * Get billing records by patient ID
   */
  async getPatientBillingRecords(patientId: string): Promise<BillingRecord[]> {
    try {
      const billingQuery = query(
        collection(db, collections.billing),
        where('patientId', '==', patientId)
      );
      const querySnapshot = await getDocs(billingQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<BillingRecord, 'id'>
      }));
    } catch (error) {
      console.error('Error getting patient billing records:', error);
      throw error;
    }
  },

  /**
   * Get billing record by ID
   */
  async getBillingRecordById(billingId: string): Promise<BillingRecord | null> {
    try {
      const billingDoc = await getDoc(doc(db, collections.billing, billingId));
      if (billingDoc.exists()) {
        return {
          id: billingDoc.id,
          ...billingDoc.data() as Omit<BillingRecord, 'id'>
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting billing record:', error);
      throw error;
    }
  },

  /**
   * Update billing record status
   */
  async updateBillingStatus(billingId: string, status: PaymentStatus): Promise<void> {
    try {
      const billingRef = doc(db, collections.billing, billingId);
      await updateDoc(billingRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating billing status:', error);
      throw error;
    }
  },

  /**
   * Process payment for a billing record
   */
  async processPayment(billingId: string, paymentMethod: PaymentMethod): Promise<void> {
    try {
      const billing = await this.getBillingRecordById(billingId);
      if (!billing) throw new Error('Billing record not found');

      const billingRef = doc(db, collections.billing, billingId);
      await updateDoc(billingRef, {
        status: PaymentStatus.PAID,
        paymentMethod,
        updatedAt: new Date()
      });

      // Send payment confirmation notification
      await notificationService.sendPaymentReceivedNotification(
        billing.patientId,
        billing.amount
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
};