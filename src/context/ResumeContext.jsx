import React, { createContext, useState, useContext } from 'react';
import { analyzeResume as analyzeResumeApi, fixResumeIssues as fixResumeIssuesApi } from '../api/resumeApi';

// Create the resume context
const ResumeContext = createContext();

// Custom hook to use the resume context
export const useResume = () => {
  return useContext(ResumeContext);
};

// Provider component that makes resume data and functions available to any child component
export const ResumeProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isFixing, setIsFixing] = useState(false);
  const [fixedResult, setFixedResult] = useState(null);
  const [showFixedContent, setShowFixedContent] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    parseRate: true,
    skills: false,
    workExperience: false,
    education: false,
    formatting: false
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    } else {
      setFile(null);
      setFileName('');
      setError('Please select a valid PDF file');
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      setError('Please select a PDF resume file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeResumeApi(file);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fixResumeIssues = async () => {
    if (!result || !file) return;
    
    setIsFixing(true);
    
    try {
      const improved = await fixResumeIssuesApi(file, result);
      setFixedResult(improved);
      setShowFixedContent(true);
    } catch (err) {
      setError(err.message || 'Failed to fix issues. Please try again.');
    } finally {
      setIsFixing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName('');
    setError(null);
    setResult(null);
    setFixedResult(null);
    setShowFixedContent(false);
    setExpandedSections({
      parseRate: true,
      skills: false,
      workExperience: false,
      education: false,
      formatting: false
    });
  };

  // Helper function to determine color based on score
  const getColorClass = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50';
    if (score >= 60) return 'text-blue-500 bg-blue-50';
    if (score >= 40) return 'text-yellow-500 bg-yellow-50';
    return 'text-red-500 bg-red-50';
  };

  // Helper function to get progress bar color based on score
  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const value = {
    file,
    fileName,
    loading,
    error,
    result,
    isFixing,
    fixedResult,
    showFixedContent,
    expandedSections,
    handleFileChange,
    analyzeResume,
    fixResumeIssues,
    handleReset,
    toggleSection,
    getColorClass,
    getProgressBarColor
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};