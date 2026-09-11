import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth Services
export const sendOtpApi = async (email) => {
  const response = await api.post('/auth/send-otp', { email });
  return response.data;
};

export const verifyOtpApi = async (email, otp) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

// Complaint Services
export const getMyComplaintsApi = async () => {
  const response = await api.get('/complaints/my');
  return response.data;
};

export const createComplaintApi = async (complaintData) => {
  const response = await api.post('/complaints', complaintData);
  return response.data;
};

export const getStatsApi = async () => {
  const response = await api.get('/complaints/stats');
  return response.data;
};

// Admin Complaint Services
export const getAdminStatsApi = async () => {
  const response = await api.get('/complaints/admin/stats');
  return response.data;
};

export const getAdminComplaintsApi = async (params = {}) => {
  const response = await api.get('/complaints/admin/all', { params });
  return response.data;
};

export const updateComplaintAdminApi = async (id, updateData) => {
  const response = await api.put(`/complaints/admin/${id}`, updateData);
  return response.data;
};

export const getAdminAnalyticsApi = async () => {
  const response = await api.get('/complaints/admin/analytics');
  return response.data;
};

// Admin Student Directory Services
export const getStudentsAdminApi = async (params = {}) => {
  const response = await api.get('/users/admin/students', { params });
  return response.data;
};

export const getStudentDetailsAdminApi = async (id) => {
  const response = await api.get(`/users/admin/students/${id}`);
  return response.data;
};

// User Profile Services
export const getProfileApi = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfileApi = async (name) => {
  const response = await api.put('/users/profile', { name });
  return response.data;
};

export default api;
