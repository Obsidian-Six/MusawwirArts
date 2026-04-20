import axios from 'axios';

const API = axios.create({ baseURL: `${import.meta.env.VITE_BASE_URL}` });

// Interceptor: Only attaches token if it exists in local storage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// PUBLIC ROUTES (No Token Needed)
export const getAllPaintings = () => API.get('/paintings');
// export const getOnePainting = (id) => API.get(`/paintings/${id}`);

// ADMIN ROUTES (Protected by verifyToken on Backend)
export const loginAdmin = (creds) => API.post('/auth/login', creds);
export const uploadNewPainting = (formData) => API.post('/paintings', formData);
export const updatePainting = (id, data) => API.put(`/paintings/${id}`, data);
export const deletePainting = (id) => API.delete(`/paintings/${id}`);