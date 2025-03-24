import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, orderBy, serverTimestamp, Timestamp, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db, collections, Appointment, User } from '../firebase';
import { notificationService } from './notificationService';
import { pushNotificationService } from './pushNotificationService';

/**
 * Appointment Service - Handles all appointment-related operations with Firestore
 */
export const appointmentService = {
  /**
   * Subscribe to appointments updates
   * @param role - The user's role (doctor, nurse, patient)
   * @param userId - The user's ID (optional for nurses)
   * @param onUpdate - Callback function to handle updates
   * @returns Unsubscribe function
   */
  subscribeToAppointments(role: 'doctor' | 'nurse' | 'patient', userId: string | undefined, onUpdate: (appointments: Array<Appointment & { id: string; patientName: string; doctorName: string }>) => void) {
    let appointmentsQuery;
    
    if (role === 'doctor' && userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentsQuery = query(
        collection(db, collections.appointments),
        where('doctorId', '==', userId),
        where('date', '>=', Timestamp.fromDate(today)),
        where('status', 'in', ['scheduled', 'in-progress']),
        where('type', '==', 'in-person'),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      );
    } else if (role === 'patient' && userId) {
      appointmentsQuery = query(
        collection(db, collections.appointments),
        where('patientId', '==', userId),
        orderBy('date', 'asc')
      );
    } else {
      // For nurses, get all appointments (they can see all)
      appointmentsQuery = query(
        collection(db, collections.appointments),
        where('date', '>=', Timestamp.fromDate(new Date())), // Only future appointments
        orderBy('date', 'asc')
      );
    }

    return onSnapshot(appointmentsQuery, async (snapshot) => {
      try {
        const appointments: Array<Appointment & {
          id: string;
          patientName: string;
          doctorName: string;
        }> = [];

        for (const docSnapshot of snapshot.docs) {
          const appointmentData = docSnapshot.data() as Appointment;
          
          // Get patient and doctor details
          const [patientDoc, doctorDoc] = await Promise.all([
            getDoc(doc(db, collections.users, appointmentData.patientId)),
            getDoc(doc(db, collections.users, appointmentData.doctorId))
          ]);
          
          const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
          const doctorData = doctorDoc.exists() ? doctorDoc.data() as User : null;
          
          if (patientData && doctorData) {
            appointments.push({
              id: docSnapshot.id,
              ...appointmentData,
              patientName: patientData.displayName || 'Unknown Patient',
              doctorName: doctorData.displayName || 'Unknown Doctor',
              date: appointmentData.date instanceof Timestamp ? 
                appointmentData.date.toDate() : 
                new Date(appointmentData.date)
            });
          }
        }

        onUpdate(appointments);
      } catch (error) {
        console.error('Error in telehealth appointments subscription:', error);
      }
    }, (error) => {
      console.error('Telehealth subscription error:', error);
    });
  },

  /**
   * Get all appointments for a user (doctor, nurse, or patient)
   * @param userId - The user's ID
   * @param role - The user's role (doctor, nurse, patient)
   * @returns Array of appointments
   */
  async getAppointments(userId: string, role: 'doctor' | 'nurse' | 'patient') {
    try {
      let appointmentsQuery;
      
      if (role === 'doctor') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        appointmentsQuery = query(
          collection(db, collections.appointments),
          where('doctorId', '==', userId),
          where('date', '>=', Timestamp.fromDate(today)),
          where('status', '!=', 'cancelled'),
          where('type', '==', 'in-person'),
          orderBy('date', 'asc'),
          orderBy('time', 'asc')
        );
      } else if (role === 'patient') {
        appointmentsQuery = query(
          collection(db, collections.appointments),
          where('patientId', '==', userId),
          orderBy('date', 'asc')
        );
      } else {
        // For nurses, get all appointments (they can see all)
        appointmentsQuery = query(
          collection(db, collections.appointments),
          orderBy('date', 'asc')
        );
      }

      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointments: Array<Appointment & {
        id: string;
        patientName: string;
        doctorName: string;
      }> = [];

      for (const docSnapshot of appointmentsSnapshot.docs) {
        const appointmentData = docSnapshot.data() as Appointment;
        
        // Get patient and doctor details
        const patientDocRef = doc(db, collections.users, appointmentData.patientId);
        const doctorDocRef = doc(db, collections.users, appointmentData.doctorId);
        const patientDoc = await getDoc(patientDocRef);
        const doctorDoc = await getDoc(doctorDocRef);
        
        const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
        const doctorData = doctorDoc.exists() ? doctorDoc.data() as User : null;
        
        appointments.push({
          id: docSnapshot.id,
          ...appointmentData,
          patientName: patientData?.displayName || 'Unknown Patient',
          doctorName: doctorData?.displayName || 'Unknown Doctor',
          date: appointmentData.date instanceof Timestamp ? 
            appointmentData.date.toDate() : 
            new Date(appointmentData.date)
        });
      }

      return appointments;
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  },

  /**
   * Get appointments for a specific date
   * @param date - The date to get appointments for
   * @param userId - The user's ID (optional, for filtering)
   * @param role - The user's role (optional, for filtering)
   * @returns Array of appointments for the specified date
   */
  /**
   * Get telehealth appointments for a user
   * @param userId - The user's ID
   * @param role - The user's role (doctor, nurse, patient)
   * @returns Array of telehealth appointments
   */
  subscribeToTelehealthAppointments(role: 'doctor' | 'nurse' | 'patient', userId: string | undefined, onUpdate: (appointments: Array<Appointment & { id: string; patientName: string; doctorName: string }>) => void) {
    let appointmentsQuery;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (role === 'doctor' && userId) {
      appointmentsQuery = query(
        collection(db, collections.appointments),
        where('doctorId', '==', userId),
        where('date', '>=', Timestamp.fromDate(today)),
        where('status', 'in', ['scheduled', 'in-progress']),
        where('type', '==', 'telehealth'),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      );
    } else if (role === 'patient' && userId) {
      appointmentsQuery = query(
        collection(db, collections.appointments),
        where('patientId', '==', userId),
        where('type', '==', 'telehealth'),
        where('status', 'in', ['scheduled', 'in-progress']),
        where('date', '>=', Timestamp.fromDate(today)),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      );
    } else if (role === 'nurse') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentsQuery = query(
        collection(db, collections.appointments),
        where('type', '==', 'telehealth'),
        where('date', '>=', Timestamp.fromDate(today)),
        where('status', 'in', ['scheduled', 'in-progress']),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      );
    } else {
      throw new Error('Invalid role or missing userId');
    }

    return onSnapshot(appointmentsQuery, async (snapshot) => {
      try {
        const appointments: Array<Appointment & {
          id: string;
          patientName: string;
          doctorName: string;
        }> = [];

        for (const docSnapshot of snapshot.docs) {
          const appointmentData = docSnapshot.data() as Appointment;
          
          const [patientDoc, doctorDoc] = await Promise.all([
            getDoc(doc(db, collections.users, appointmentData.patientId)),
            getDoc(doc(db, collections.users, appointmentData.doctorId))
          ]);
          
          const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
          const doctorData = doctorDoc.exists() ? doctorDoc.data() as User : null;
          
          if (patientData && doctorData) {
            appointments.push({
              id: docSnapshot.id,
              ...appointmentData,
              patientName: patientData.displayName || 'Unknown Patient',
              doctorName: doctorData.displayName || 'Unknown Doctor',
              date: appointmentData.date instanceof Timestamp ? 
                appointmentData.date.toDate() : 
                new Date(appointmentData.date)
            });
          }
        }

        onUpdate(appointments);
      } catch (error) {
        console.error('Error in telehealth appointments subscription:', error);
      }
    }, (error) => {
      console.error('Telehealth subscription error:', error);
    });

  },

  async getAppointmentsByDate(date: Date, userId?: string, role?: 'doctor' | 'nurse' | 'patient') {
    try {
      // Create date range for the specified date (start of day to end of day)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      let appointmentsQuery;
      
      if (userId && role === 'doctor') {
        appointmentsQuery = query(
          collection(db, collections.appointments),
          where('doctorId', '==', userId),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(endDate)),
          orderBy('date', 'asc')
        );
      } else if (userId && role === 'patient') {
        appointmentsQuery = query(
          collection(db, collections.appointments),
          where('patientId', '==', userId),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(endDate)),
          orderBy('date', 'asc')
        );
      } else {
        // For nurses or when no userId/role provided
        appointmentsQuery = query(
          collection(db, collections.appointments),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(endDate)),
          orderBy('date', 'asc')
        );
      }

      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointments: Array<Appointment & {
        id: string;
        patientName: string;
        doctorName: string;
      }> = [];

      for (const docSnapshot of appointmentsSnapshot.docs) {
        const appointmentData = docSnapshot.data() as Appointment;
        
        // Get patient and doctor details
        const patientDocRef = doc(db, collections.users, appointmentData.patientId);
        const doctorDocRef = doc(db, collections.users, appointmentData.doctorId);
        const patientDoc = await getDoc(patientDocRef);
        const doctorDoc = await getDoc(doctorDocRef);
        
        const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
        const doctorData = doctorDoc.exists() ? doctorDoc.data() as User : null;
        
        appointments.push({
          id: docSnapshot.id,
          ...appointmentData,
          patientName: patientData?.displayName || 'Unknown Patient',
          doctorName: doctorData?.displayName || 'Unknown Doctor',
          date: appointmentData.date instanceof Timestamp ? 
            appointmentData.date.toDate() : 
            new Date(appointmentData.date)
        });
      }

      return appointments;
    } catch (error) {
      console.error('Error getting appointments by date:', error);
      throw error;
    }
  },

  /**
   * Get a specific appointment by ID
   * @param appointmentId - The appointment ID
   * @returns The appointment data or null if not found
   */
  async getAppointmentById(appointmentId: string) {
    try {
      const appointmentDoc = await getDoc(doc(db, collections.appointments, appointmentId));
      
      if (!appointmentDoc.exists()) {
        return null;
      }
      
      const appointmentData = appointmentDoc.data() as Appointment;
      
      // Get patient and doctor details
      const patientDoc = await getDoc(doc(db, collections.users, appointmentData.patientId));
      const doctorDoc = await getDoc(doc(db, collections.users, appointmentData.doctorId));
      
      const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
      const doctorData = doctorDoc.exists() ? doctorDoc.data() as User : null;
      
      return {
        id: appointmentDoc.id,
        ...appointmentData,
        patientName: patientData?.displayName || 'Unknown Patient',
        doctorName: doctorData?.displayName || 'Unknown Doctor',
        date: appointmentData.date instanceof Timestamp ? 
          appointmentData.date.toDate() : 
          new Date(appointmentData.date),
      };
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw error;
    }
  },

  /**
   * Create a new appointment
   * @param appointmentData - The appointment data
   * @returns The created appointment
   */
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Validate required fields
      if (!appointmentData.doctorId || !appointmentData.patientId) {
        throw new Error('Doctor ID and Patient ID are required for appointment creation');
      }

      const newAppointment = {
        ...appointmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, collections.appointments), newAppointment);
      
      // Get patient and doctor details for notification
      const patientDoc = await getDoc(doc(db, collections.users, appointmentData.patientId));
      const doctorDoc = await getDoc(doc(db, collections.users, appointmentData.doctorId));
      
      const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
      const doctorData = doctorDoc.exists() ? doctorDoc.data() as User : null;
      
      // Create notifications for managers and doctors
      const notificationData = {
        appointmentId: docRef.id,
        patientName: patientData?.displayName || 'Unknown Patient',
        doctorName: doctorData?.displayName || 'Unknown Doctor',
        date: appointmentData.date instanceof Timestamp ? appointmentData.date.toDate() : new Date(appointmentData.date),
        time: appointmentData.time,
        type: appointmentData.type,
        status: 'scheduled',
      };

      // Create notification for managers
      const managerNotification = await notificationService.createAppointmentNotification(notificationData, 'manager');
      await pushNotificationService.showNotification(managerNotification);
      
      // Create notification for the doctor
      const doctorNotification = await notificationService.createAppointmentNotification(notificationData, 'doctor', appointmentData.doctorId);
      await pushNotificationService.showNotification(doctorNotification);
      
      return {
        id: docRef.id,
        ...newAppointment,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  /**
   * Update an existing appointment
   * @param appointmentId - The appointment ID
   * @param appointmentData - The appointment data to update
   * @returns Promise that resolves when the operation is complete
   */
  async updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>) {
    try {
      const appointmentRef = doc(db, collections.appointments, appointmentId);
      
      await updateDoc(appointmentRef, {
        ...appointmentData,
        updatedAt: serverTimestamp()
      });
      
      return this.getAppointmentById(appointmentId);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  /**
   * Delete an appointment
   * @param appointmentId - The appointment ID
   * @returns Promise that resolves when the operation is complete
   */
  async deleteAppointment(appointmentId: string) {
    try {
      await deleteDoc(doc(db, collections.appointments, appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  /**
   * Update appointment status
   * @param appointmentId - The appointment ID
   * @param status - The new status
   * @returns The updated appointment
   */
  async updateAppointmentStatus(appointmentId: string, status: Appointment['status']) {
    try {
      return this.updateAppointment(appointmentId, { status });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }
};