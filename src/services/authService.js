import api from '../apiClient';

// SIGNUP
export const signup = async (payload) => {
  const res = await api.post('/api/auth/signup', payload);
  return res.data;
};

// LOGIN
export const login = async (payload) => {
  const res = await api.post('/api/auth/login', payload);
  return res.data;
};
