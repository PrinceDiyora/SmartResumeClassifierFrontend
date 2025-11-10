import axios from 'axios';

const API_URL = 'http://localhost:5000/api/resumes';

// Get all resumes for the authenticated user
export async function getUserResumes(token) {
  try {
    const response = await axios.get(API_URL, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = response.data;
    
    // Ensure we always return an array
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && Array.isArray(data.resumes)) {
      return data.resumes;
    } else {
      console.error('API returned unexpected data format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
}

// Get a specific resume by ID
export async function getResumeById(id, token) {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

// Create a new resume
export async function createResume(resumeData, token) {
  try {
    const response = await axios.post(API_URL, resumeData, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = response.data;
    console.log('Create resume response:', data);
    return data;
  } catch (error) {
    console.error('Error creating resume:', error);
    const msg = error.response?.data?.error || error.message || 'Failed to create resume';
    throw new Error(msg);
  }
}

// Update an existing resume
export async function updateResume(id, resumeData, token) {
  const response = await axios.put(`${API_URL}/${id}`, resumeData, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

// Delete a resume
export async function deleteResume(id, token) {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}