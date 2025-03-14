import { useState, useCallback } from 'react';
import { appointmentApi } from '@/lib/api';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: string;
  notes?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
}

export const useAppointments = () => {
  const [state, setState] = useState<AppointmentState>({
    appointments: [],
    isLoading: false,
    error: null,
  });

  const fetchAppointments = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await appointmentApi.getAll();
      setState({
        appointments: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: Error | unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointments',
      }));
    }
  }, []);

  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await appointmentApi.create({
        date: appointmentData.date,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        reason: appointmentData.type // Using type field as reason
      });
      setState(prev => ({
        appointments: [...prev.appointments, response.data],
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (error: Error | unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create appointment',
      }));
      return false;
    }
  }, []);

  const updateAppointment = useCallback(async (id: string, appointmentData: Partial<Appointment>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await appointmentApi.update(id, appointmentData);
      setState(prev => ({
        appointments: prev.appointments.map(apt =>
          apt.id === id ? { ...apt, ...response.data } : apt
        ),
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (error: Error | unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update appointment',
      }));
      return false;
    }
  }, []);

  const cancelAppointment = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await appointmentApi.cancel(id);
      setState(prev => ({
        appointments: prev.appointments.filter(apt => apt.id !== id),
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (error: Error | unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to cancel appointment',
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
  };
};