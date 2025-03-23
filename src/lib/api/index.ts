import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // Base delay in milliseconds
const MAX_DELAY = 10000; // Maximum delay in milliseconds

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('syncra_token');
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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle connection errors with retry logic
    if (!error.response && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
      const retryRequest = async () => {
        originalRequest._retryCount++;
        if (originalRequest._retryCount <= MAX_RETRIES) {
          // Exponential backoff with jitter
          const delay = Math.min(
            RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1) + Math.random() * 1000,
            MAX_DELAY
          );
          console.log(`Retry attempt ${originalRequest._retryCount} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return api(originalRequest);
        }
        throw new Error('Unable to connect to the server. Please check if the backend server is running and try again.');
      };
      return retryRequest();
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('syncra_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post('/auth/refresh-token', { refreshToken });
        const { token } = response.data;

        localStorage.setItem('syncra_token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('syncra_token');
        localStorage.removeItem('syncra_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; name: string; role: 'admin' | 'doctor' | 'nurse' | 'patient' }) =>
    api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }),
};

// User endpoints
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: { name?: string; email?: string; phone?: string; address?: string }) =>
    api.put('/user/profile', data),
};

// Appointment endpoints
export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (data: { date: string; doctorId: string; patientId: string; reason: string }) =>
    api.post('/appointments', data),
  update: (id: string, data: { date?: string; doctorId?: string; patientId?: string; reason?: string }) =>
    api.put(`/appointments/${id}`, data),
  cancel: (id: string) => api.delete(`/appointments/${id}`),
};

// Medical records endpoints
export const medicalRecordApi = {
  getAll: () => api.get('/medical-records'),
  getById: (id: string) => api.get(`/medical-records/${id}`),
  create: (data: { patientId: string; diagnosis: string; treatment: string; notes?: string; date: string }) =>
    api.post('/medical-records', data),
  update: (id: string, data: { diagnosis?: string; treatment?: string; notes?: string; date?: string }) =>
    api.put(`/medical-records/${id}`, data),
};

// Task endpoints
export const taskApi = {
  getAll: () => api.get('/tasks'),
  getById: (id: string) => api.get(`/tasks/${id}`),
  create: (data: { title: string; patientId: string; assignedTo: string; priority: string; dueDate: string; description: string }) =>
    api.post('/tasks', data),
  update: (id: string, data: { status?: string; notes?: string }) =>
    api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Symptom assessment endpoints
export const symptomApi = {
  submit: (data: { patientId: string; symptoms: string[]; description: string }) =>
    api.post('/symptoms/assess', data),
  getHistory: (patientId: string) => api.get(`/symptoms/history/${patientId}`),
  getById: (id: string) => api.get(`/symptoms/${id}`),
};

// Pharmacy endpoints
export const pharmacyApi = {
  // Medication management
  getMedications: (params?: { search?: string; category?: string; requiresPrescription?: boolean; inStock?: boolean }) =>
    api.get('/pharmacy/medications', { params }),
  getMedicationById: (id: string) => api.get(`/pharmacy/medications/${id}`),
  
  // Order management
  createOrder: (data: { 
    medications: Array<{ medicationId: string; quantity: number }>; 
    prescriptionId?: string;
    paymentMethod: string;
    paymentDetails?: {
      cardNumber?: string;
      expiryDate?: string;
      cvv?: string;
      name?: string;
      reference?: string;
      status?: string;
      amount?: number;
    };
  }) => api.post('/pharmacy/orders', data),
  getPatientOrders: () => api.get('/pharmacy/orders/patient'),
  updateOrderStatus: (orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled') =>
    api.put(`/pharmacy/orders/${orderId}/status`, { status }),
  
  // Prescription verification
  verifyPrescription: (orderId: string, prescriptionId: string) =>
    api.post(`/pharmacy/orders/${orderId}/verify-prescription`, { prescriptionId }),
  
  // Admin operations
  addMedication: (data: { name: string; description: string; price: number; category: string; requiresPrescription: boolean; stock: number }) =>
    api.post('/pharmacy/medications', data),
  updateMedication: (id: string, data: { name?: string; description?: string; price?: number; category?: string; requiresPrescription?: boolean; stock?: number }) =>
    api.put(`/pharmacy/medications/${id}`, data),
  updateStock: (id: string, quantity: number) =>
    api.put(`/pharmacy/medications/${id}/stock`, { quantity })
};