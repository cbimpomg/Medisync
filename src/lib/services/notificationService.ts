import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, collections } from '../firebase';

export interface AppointmentNotification {
  id?: string;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  date: Date;
  time: string;
  type: string;
  status: string;
  createdAt: Date;
  recipientId?: string;
  recipientType?: 'doctor' | 'manager';
  isRead?: boolean;
}

export interface BillingNotification {
  id?: string;
  patientId: string;
  amount: number;
  dueDate: string;
  type: 'billing' | 'payment';
  createdAt: Date;
  isRead?: boolean;
}

export const notificationService = {
  async sendBillingNotification(patientId: string, amount: number, dueDate: string) {
    try {
      const newNotification: Omit<BillingNotification, 'id' | 'createdAt'> = {
        patientId,
        amount,
        dueDate,
        type: 'billing',
        isRead: false
      };

      const docRef = await addDoc(collection(db, 'notifications'), {
        ...newNotification,
        createdAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...newNotification,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error sending billing notification:', error);
      throw error;
    }
  },

  async sendPaymentReceivedNotification(patientId: string, amount: number) {
    try {
      const newNotification: Omit<BillingNotification, 'id' | 'createdAt' | 'dueDate'> = {
        patientId,
        amount,
        type: 'payment',
        isRead: false
      };

      const docRef = await addDoc(collection(db, 'notifications'), {
        ...newNotification,
        createdAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...newNotification,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error sending payment received notification:', error);
      throw error;
    }
  },
  async createAppointmentNotification(notification: Omit<AppointmentNotification, 'id' | 'createdAt'>, recipientType: 'doctor' | 'manager' = 'manager', recipientId?: string) {
    try {
      if (recipientType === 'doctor' && !recipientId) {
        throw new Error('recipientId is required for doctor notifications');
      }

      const newNotification = {
        ...notification,
        recipientType,
        recipientId: recipientType === 'doctor' ? recipientId : null,
        isRead: false,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'notifications'), newNotification);
      
      return {
        id: docRef.id,
        ...newNotification,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async getManagerNotifications() {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('recipientType', '==', 'manager'),
        orderBy('createdAt', 'desc')
      );

      const notificationsSnapshot = await getDocs(notificationsQuery);
      return notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppointmentNotification[];
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  async getDoctorNotifications(doctorId: string) {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('recipientType', '==', 'doctor'),
        where('recipientId', '==', doctorId),
        orderBy('createdAt', 'desc')
      );

      const notificationsSnapshot = await getDocs(notificationsQuery);
      return notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppointmentNotification[];
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }
};