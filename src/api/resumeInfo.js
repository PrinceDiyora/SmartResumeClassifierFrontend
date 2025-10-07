import axios from 'axios';

const API_URL = 'http://localhost:5000/api/resumeInfo';

export async function saveResumeInfo(resumeData, token) {
  try {
    const response = await axios.post(API_URL, resumeData, {
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
    const response = await axios.get(API_URL, {
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