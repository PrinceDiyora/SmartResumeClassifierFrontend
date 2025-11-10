import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export async function login({ email, password }) {
  const response = await axios.post(`${API_URL}/login`, { email, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

export async function signup({ email, password, confirmpassword }) {
  const response = await axios.post(`${API_URL}/signup`, { email, password, confirmpassword }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
} 

export async function requestPasswordReset(email) {
  const response = await axios.post(`${API_URL}/request-reset`, { email }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

export async function resetPasswordWithOtp({ email, otp, newPassword }) {
  const response = await axios.post(`${API_URL}/reset-password`, { email, otp, newPassword }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}