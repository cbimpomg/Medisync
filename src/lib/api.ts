import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; name: string; role: 'admin' | 'doctor' | 'nurse' | 'patient' }) => {
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name || !userData.role) {
      return Promise.reject(new Error('All fields are required'));
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return Promise.reject(new Error('Invalid email format'));
    }
    // Validate password length (minimum 8 characters as per backend)
    if (userData.password.length < 8) {
      return Promise.reject(new Error('Password must be at least 8 characters long'));
    }
    // Validate role
    const validRoles = ['admin', 'doctor', 'nurse', 'patient'];
    if (!validRoles.includes(userData.role)) {
      return Promise.reject(new Error('Invalid role selected'));
    }
    return api.post('/auth/register', userData);
  },
  logout: () => api.post('/auth/logout'),
};

// User endpoints
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: { name?: string; email?: string; phone?: string; address?: string }) => api.put('/user/profile', data),
};

// Appointment endpoints
export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (data: { date: string; doctorId: string; patientId: string; reason: string }) => api.post('/appointments', data),
  update: (id: string, data: { date?: string; doctorId?: string; patientId?: string; reason?: string }) => api.put(`/appointments/${id}`, data),
  cancel: (id: string) => api.delete(`/appointments/${id}`),
};

// Medical records endpoints
export const medicalRecordApi = {
  getAll: () => api.get('/medical-records'),
  getById: (id: string) => api.get(`/medical-records/${id}`),
  create: (data: { patientId: string; diagnosis: string; treatment: string; notes?: string; date: string }) => api.post('/medical-records', data),
  update: (id: string, data: { patientId?: string; diagnosis?: string; treatment?: string; notes?: string; date?: string }) => api.put(`/medical-records/${id}`, data),
};