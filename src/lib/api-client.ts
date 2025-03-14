import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { PatientProfileUpdateData, AppointmentCreateData, AppointmentUpdateData } from './types';

const BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medisync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem('medisync_refresh_token');
        const response = await apiClient.post('/auth/refresh-token', {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('medisync_token', token);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (error) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('medisync_token');
        localStorage.removeItem('medisync_refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authApi = {
  login: (email: string, password: string, userType: string) =>
    apiClient.post('/auth/login', { email, password, userType }),
  register: (userData: {
    email: string;
    password: string;
    userType: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    phoneNumber?: string;
  }) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
};

export const patientApi = {
  getProfile: () => apiClient.get('/patients/profile'),
  updateProfile: (data: PatientProfileUpdateData) => apiClient.put('/patients/profile', data),
  getAppointments: () => apiClient.get('/patients/appointments'),
  getMedications: () => apiClient.get('/patients/medications'),
};

export const doctorApi = {
  getProfile: () => apiClient.get('/doctors/profile'),
  updateProfile: (data: PatientProfileUpdateData) => apiClient.put('/doctors/profile', data),
  getPatients: () => apiClient.get('/doctors/patients'),
  getSchedule: () => apiClient.get('/doctors/schedule'),
};

export const appointmentApi = {
  create: (data: AppointmentCreateData) => apiClient.post('/appointments', data),
  update: (id: string, data: AppointmentUpdateData) => apiClient.put(`/appointments/${id}`, data),
  cancel: (id: string) => apiClient.delete(`/appointments/${id}`),
  getDetails: (id: string) => apiClient.get(`/appointments/${id}`),
};

export default apiClient;