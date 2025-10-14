const API_URL = 'http://localhost:5000/api/resumes';

// Get all resumes for the authenticated user
export async function getUserResumes(token) {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      return [];
    }
    
    const data = await response.json();
    
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
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}

// Create a new resume
export async function createResume(resumeData, token) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resumeData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Create Resume API Error:', response.status, errorData);
      throw new Error(`Failed to create resume: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Create resume response:', data);
    return data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
}

// Update an existing resume
export async function updateResume(id, resumeData, token) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(resumeData)
  });
  return response.json();
}

// Delete a resume
export async function deleteResume(id, token) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}