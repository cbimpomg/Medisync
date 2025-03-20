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

export const notificationService = {
  async createAppointmentNotification(notification: Omit<AppointmentNotification, 'id' | 'createdAt'>, recipientType: 'doctor' | 'manager' = 'manager', recipientId?: string) {
    try {
      const newNotification = {
        ...notification,
        recipientType,
        recipientId,
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