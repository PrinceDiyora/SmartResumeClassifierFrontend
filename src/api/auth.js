import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export async function login({ email, password }) {
  const response = await axios.post(`${API}/api/auth/login`, { email, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

export async function signup({ email, password, confirmpassword }) {
  const response = await axios.post(`${API}/api/auth/signup`, { email, password, confirmpassword }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
} 

export async function requestPasswordReset(email) {
  const response = await axios.post(`${API}/api/auth/request-reset`, { email }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

export async function resetPasswordWithOtp({ email, otp, newPassword }) {
  const response = await axios.post(`${API}/api/auth/reset-password`, { email, otp, newPassword }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}