import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

export const productsAPI = {
  getAll: (params?: { categoria?: string; warehouse_id?: number; search?: string }) =>
    api.get('/products', { params }),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  getLowStock: (warehouse_id?: number) => 
    api.get('/products/low-stock', { params: { warehouse_id } }),
  getCritical: (warehouse_id?: number) => 
    api.get('/products/critical', { params: { warehouse_id } }),
  checkAlerts: (warehouse_id?: number) => 
    api.get('/products/check-alerts', { params: { warehouse_id } })
};

export const movementsAPI = {
  getAll: (params?: any) => api.get('/movements', { params }),
  getById: (id: number) => api.get(`/movements/${id}`),
  entrada: (data: { product_id: number; cantidad: number; motivo?: string; warehouse_id?: number }) =>
    api.post('/movements/entrada', data),
  salida: (data: { product_id: number; cantidad: number; motivo?: string; warehouse_id?: number }) =>
    api.post('/movements/salida', data),
  ajuste: (data: { product_id: number; cantidad: number; motivo: string; warehouse_id?: number }) =>
    api.post('/movements/ajuste', data),
  getStats: (warehouse_id?: number) => 
    api.get('/movements/stats', { params: { warehouse_id } }),
  getRotation: (warehouse_id?: number, days?: number) => 
    api.get('/movements/rotation', { params: { warehouse_id, days } })
};

export const dashboardAPI = {
  getStats: (warehouse_id?: number) => 
    api.get('/dashboard/stats', { params: { warehouse_id } }),
  getChartData: (warehouse_id?: number) => 
    api.get('/dashboard/chart', { params: { warehouse_id } }),
  getKPIs: (warehouse_id?: number) => 
    api.get('/dashboard/kpis', { params: { warehouse_id } })
};

export const alertsAPI = {
  getAll: (leida?: boolean) => api.get('/alerts', { params: { leida } }),
  getUnread: () => api.get('/alerts/unread'),
  markAsRead: (id: number) => api.put(`/alerts/${id}/read`),
  markAllAsRead: () => api.put('/alerts/read-all'),
  getCount: () => api.get('/alerts/count')
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`)
};

export const warehousesAPI = {
  getAll: () => api.get('/warehouses'),
  getById: (id: number) => api.get(`/warehouses/${id}`),
  create: (data: any) => api.post('/warehouses', data),
  update: (id: number, data: any) => api.put(`/warehouses/${id}`, data)
};

export const logsAPI = {
  getAll: (params?: any) => api.get('/logs', { params }),
  getByEntity: (entidad: string, entidad_id: number) => 
    api.get(`/logs/${entidad}/${entidad_id}`)
};

export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id: number) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post('/suppliers', data),
  update: (id: number, data: any) => api.put(`/suppliers/${id}`, data),
  delete: (id: number) => api.delete(`/suppliers/${id}`)
};

export default api;
