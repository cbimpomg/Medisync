import { AppointmentNotification } from './notificationService';

export const pushNotificationService = {
  async requestPermission() {
    try {
      if (!('Notification' in window)) {
        console.error('This browser does not support desktop notification');
        return false;
      }

      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },

  async showNotification(notification: AppointmentNotification) {
    try {
      if (!('Notification' in window)) {
        return;
      }

      if (Notification.permission !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) return;
      }

      const date = notification.date instanceof Date 
        ? notification.date 
        : new Date(notification.date);

      const title = `New Appointment ${notification.status}`;
      const options = {
        body: `${notification.patientName} with Dr. ${notification.doctorName}\nDate: ${date.toLocaleDateString()}\nTime: ${notification.time}\nType: ${notification.type}`,
        icon: '/images/logo.svg',
        tag: notification.appointmentId,
        requireInteraction: true
      };

      new Notification(title, options);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
};