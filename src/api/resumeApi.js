import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analyze';

// Create axios instance with default config
const resumeApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Analyze a resume PDF file (general analysis)
export const analyzeResume = async (resumeFile) => {
  try {
    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    
    const response = await resumeApi.post('/ats-score', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error.response?.data?.error || error.message || 'Failed to analyze resume';
  }
};

// Analyze a resume PDF file with job description
export const analyzeResumeWithJob = async (resumeFile, jobDescription) => {
  try {
    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    formData.append('jobDescription', jobDescription);
    
    const response = await resumeApi.post('/ats-score', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume with job description:', error);
    throw error.response?.data?.error || error.message || 'Failed to analyze resume';
  }
};

// Fix issues in a resume
export const fixResumeIssues = async (resumeFile, analysisResult) => {
  try {
    // In a real implementation, this would send the resume and analysis to a backend API
    // For now, we'll simulate this with a timeout and return an improved version of the result
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create an improved version of the result
    const improved = {
      ...analysisResult,
      overall_score: 95, // Improved score
      section_scores: {
        ...analysisResult.section_scores,
        skills: Math.min(95, (analysisResult.section_scores?.skills || 0) + 30),
        experience: Math.min(95, (analysisResult.section_scores?.experience || 0) + 25),
        education: Math.min(95, (analysisResult.section_scores?.education || 0) + 20),
        formatting_and_clarity: Math.min(98, (analysisResult.section_scores?.formatting_and_clarity || 0) + 35),
        summary_or_objective: Math.min(90, (analysisResult.section_scores?.summary_or_objective || 0) + 25)
      },
      ats_parse_rate: 100,
      improvement_suggestions: [] // No more suggestions needed
    };
    
    return improved;
  } catch (error) {
    console.error('Error fixing resume issues:', error);
    throw error.response?.data?.error || error.message || 'Failed to fix resume issues';
  }
};

export default resumeApi;