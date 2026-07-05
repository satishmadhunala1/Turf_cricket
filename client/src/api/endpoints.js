import API from './axios';

export const authApi = {
  sendOtp: (email) => API.post('/auth/send-otp', { email }),
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  googleLogin: (credential) => API.post('/auth/google', { credential }),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

export const turfApi = {
  getAll: (params) => API.get('/turfs', { params }),
  getFeatured: () => API.get('/turfs/featured'),
  getPopularLocations: () => API.get('/turfs/locations/popular'),
  getById: (id) => API.get(`/turfs/${id}`),
  getBySlug: (slug) => API.get(`/turfs/slug/${slug}`),
  getAvailability: (id, date) => API.get(`/turfs/${id}/availability`, { params: { date } }),
  getNearby: (id) => API.get(`/turfs/${id}/nearby`),
  getReviews: (id, params) => API.get(`/turfs/${id}/reviews`, { params }),
};

export const bookingApi = {
  create: (data) => API.post('/bookings', data),
  getMy: (params) => API.get('/bookings/my', { params }),
  getById: (id) => API.get(`/bookings/${id}`),
  cancel: (id, reason) => API.patch(`/bookings/${id}/cancel`, { reason }),
  confirmPayment: (data) => API.post('/bookings/confirm-payment', data),
  getInvoice: (id) => API.get(`/bookings/${id}/invoice`),
};

export const userApi = {
  getProfile: () => API.get('/users/profile'),
  toggleFavorite: (turfId) => API.post(`/users/favorites/${turfId}`),
  getNotifications: (params) => API.get('/users/notifications', { params }),
  markNotificationsRead: (ids) => API.patch('/users/notifications/read', { ids }),
  getWallet: () => API.get('/users/wallet'),
};

export const reviewApi = {
  create: (turfId, data) => API.post(`/reviews/${turfId}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export const adminApi = {
  getDashboard: () => API.get('/admin/dashboard'),
  getAnalytics: () => API.get('/admin/analytics'),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getBookings: (params) => API.get('/admin/bookings', { params }),
  getPayments: () => API.get('/admin/payments'),
  sendNotification: (data) => API.post('/admin/notifications', data),
};

export const ownerApi = {
  getDashboard: () => API.get('/owner/dashboard'),
  getTurfs: () => API.get('/owner/turfs'),
  getBookings: (params) => API.get('/owner/bookings', { params }),
  updateBooking: (id, data) => API.patch(`/owner/bookings/${id}`, data),
  getRevenue: () => API.get('/owner/revenue'),
  getReviews: () => API.get('/owner/reviews'),
  updateSlots: (id, data) => API.patch(`/owner/turfs/${id}/slots`, data),
};
