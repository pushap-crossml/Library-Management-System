import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${API_URL.replace('/api', '')}/api/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/* =========================
   AUTH API
========================= */
export const authAPI = {
  login: (username: string, password: string) =>
    axios.post(`${API_URL.replace('/api', '')}/api/token/`, {
      username,
      password,
    }),

  register: (userData: any) =>
    axios.post(`${API_URL}/register/`, userData),

  getCurrentUser: () => api.get('/users/me/'),

  updateProfile: (data: any) =>
    api.put('/users/update_profile/', data),
};

/* =========================
   BOOKS API
========================= */
export const booksAPI = {
  getAll: (params?: any) => api.get('/books/', { params }),
  getById: (id: number) => api.get(`/books/${id}/`),
  create: (data: any) => api.post('/books/', data),
  update: (id: number, data: any) => api.put(`/books/${id}/`, data),
  delete: (id: number) => api.delete(`/books/${id}/`),
  addCopy: (id: number) => api.post(`/books/${id}/add_copy/`),
  removeCopy: (id: number) => api.post(`/books/${id}/remove_copy/`),
};

/* =========================
   CATEGORIES API
========================= */
export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  getById: (id: number) => api.get(`/categories/${id}/`),
  create: (data: any) => api.post('/categories/', data),
  update: (id: number, data: any) => api.put(`/categories/${id}/`, data),
  delete: (id: number) => api.delete(`/categories/${id}/`),
};

/* =========================
   AUTHORS API
========================= */
export const authorsAPI = {
  getAll: () => api.get('/authors/'),
  getById: (id: number) => api.get(`/authors/${id}/`),
  create: (data: any) => api.post('/authors/', data),
  update: (id: number, data: any) => api.put(`/authors/${id}/`, data),
  delete: (id: number) => api.delete(`/authors/${id}/`),
};

/* =========================
   PUBLISHERS API
========================= */
export const publishersAPI = {
  getAll: () => api.get('/publishers/'),
  getById: (id: number) => api.get(`/publishers/${id}/`),
  create: (data: any) => api.post('/publishers/', data),
  update: (id: number, data: any) => api.put(`/publishers/${id}/`, data),
  delete: (id: number) => api.delete(`/publishers/${id}/`),
};

/* =========================
   ISSUES API
========================= */
export const issuesAPI = {
  getAll: (params?: any) => api.get('/issues/', { params }),
  getById: (id: number) => api.get(`/issues/${id}/`),
  create: (data: any) => api.post('/issues/', data),
  returnBook: (id: number) => api.post(`/issues/${id}/return_book/`),
  renew: (id: number, days: number) =>
    api.post(`/issues/${id}/renew/`, { days }),
  getMyIssues: () => api.get('/issues/my_issues/'),
};

/* =========================
   ✅ RESERVATIONS API (FIXED)
========================= */
export const reservationAPI = {
  // create reservation (used by book detail & form)
  reserveBook: (bookId: number | string) =>
    api.post('/reservations/', { book: bookId }),

  // get logged-in user's reservations
  myReservations: () =>
    api.get('/reservations/my_reservations/'),

  // admin / generic
  getAll: (params?: any) =>
    api.get('/reservations/', { params }),

  getById: (id: number) =>
    api.get(`/reservations/${id}/`),

  cancel: (id: number) =>
    api.post(`/reservations/${id}/cancel/`),
};

/* =========================
   DASHBOARD API
========================= */
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats/'),
};

/* =========================
   USERS API
========================= */
export const usersAPI = {
  getAll: (params?: any) => api.get('/users/', { params }),
  getById: (id: number) => api.get(`/users/${id}/`),
  update: (id: number, data: any) => api.put(`/users/${id}/`, data),
  delete: (id: number) => api.delete(`/users/${id}/`),
};


