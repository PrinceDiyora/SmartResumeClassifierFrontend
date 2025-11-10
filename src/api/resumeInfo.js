import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export async function saveResumeInfo(resumeData, token) {
  try {
    const response = await axios.post(`${API}/api/resumeInfo`, resumeData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      timeout: 10000, // 10 second timeout
    });

    return response.data; // the saved resume info
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function getResumeInfo(token) {
  try {
    const response = await axios.get(`${API}/api/resumeInfo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      timeout: 10000, // 10 second timeout
    });

    return response.data; // the resume info
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}