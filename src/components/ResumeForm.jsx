import { useState, useEffect } from "react";
import { saveResumeInfo, getResumeInfo } from '../api/resumeInfo';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, FileText, Mail, Phone, Linkedin, Plus, X, Award, Book, Calendar, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Top navigation is replaced locally in this form with a minimal header
import './Homepage.css';

export default function ResumeForm() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingInfo, setIsExistingInfo] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch existing resume info when component loads
  useEffect(() => {
    const fetchExistingResumeInfo = async () => {
      if (!token || loading) return;
      
      try {
        setIsLoading(true);
        const existingInfo = await getResumeInfo(token);
        
        if (existingInfo) {
          setIsExistingInfo(true);
          
          // Populate basic info
          setBasicInfo({
            name: existingInfo.name || "",
            jobRole: existingInfo.jobRole || "",
            summary: existingInfo.summary || "",
            email: existingInfo.email || "",
            phone: existingInfo.phone || "",
            linkedin: existingInfo.linkedin || "",
          });
          
          // Populate skills
          if (existingInfo.skills && existingInfo.skills.length > 0) {
            setSkills(existingInfo.skills.map(skill => skill.name));
          }
          
          // Populate projects
          if (existingInfo.projects && existingInfo.projects.length > 0) {
            setProjects(existingInfo.projects.map(project => ({
              title: project.title || "",
              description: project.description || "",
              technologies: project.technologies || "",
              link: project.link || ""
            })));
          }
          
          // Populate experience
          if (existingInfo.experiences && existingInfo.experiences.length > 0) {
            setExperience(existingInfo.experiences.map(exp => ({
              company: exp.company || "",
              role: exp.role || "",
              startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : "",
              endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : "",
              description: exp.description || ""
            })));
          }
          
          // Populate education
          if (existingInfo.educations && existingInfo.educations.length > 0) {
            setEducation(existingInfo.educations.map(edu => ({
              institution: edu.institution || "",
              degree: edu.degree || "",
              startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : "",
              endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : "",
              grade: edu.grade || ""
            })));
          }
        }
      } catch (error) {
        // If 404, it means no existing info - that's fine
        if (error.response?.status !== 404) {
          console.error('Error fetching resume info:', error);
          setErrorMessage('Failed to load existing resume information.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingResumeInfo();
  }, [token, loading]);
  
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    jobRole: "",
    summary: "",
    email: "",
    phone: "",
    linkedin: "",
  });

  const [skills, setSkills] = useState([""]);
  const [projects, setProjects] = useState([{ title: "", description: "", technologies: "", link: "" }]);
  const [experience, setExperience] = useState([{ company: "", role: "", startDate: "", endDate: "", description: "" }]);
  const [education, setEducation] = useState([{ institution: "", degree: "", startDate: "", endDate: "", grade: "" }]);

  // Section configuration for progress tracking
  const sections = [
    { id: 'basic', label: 'Basic Info', icon: User, required: true },
    { id: 'skills', label: 'Skills', icon: Award, required: true },
    { id: 'projects', label: 'Projects', icon: FileText, required: false },
    { id: 'experience', label: 'Experience', icon: Briefcase, required: false },
    { id: 'education', label: 'Education', icon: Book, required: false }
  ];

  // Validation functions
  const validateBasicInfo = () => {
    const errors = {};
    if (!basicInfo.name.trim()) errors.name = 'Name is required';
    if (!basicInfo.jobRole.trim()) errors.jobRole = 'Job role is required';
    if (!basicInfo.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(basicInfo.email)) errors.email = 'Email is invalid';
    if (!basicInfo.phone.trim()) errors.phone = 'Phone is required';
    return errors;
  };

  const validateSkills = () => {
    const errors = {};
    const validSkills = skills.filter(skill => skill.trim());
    if (validSkills.length === 0) errors.skills = 'At least one skill is required';
    return errors;
  };

  const getSectionCompletion = (sectionId) => {
    switch (sectionId) {
      case 'basic':
        return Object.keys(validateBasicInfo()).length === 0 && basicInfo.name && basicInfo.email;
      case 'skills':
        return skills.some(skill => skill.trim());
      case 'projects':
        return projects.some(project => project.title.trim());
      case 'experience':
        return experience.some(exp => exp.company.trim() && exp.role.trim());
      case 'education':
        return education.some(edu => edu.institution.trim() && edu.degree.trim());
      default:
        return false;
    }
  };

  const getOverallProgress = () => {
    const completedSections = sections.filter(section => getSectionCompletion(section.id)).length;
    return Math.round((completedSections / sections.length) * 100);
  };

  // Handlers
  const handleBasicChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (setter, arr, index, field, value) => {
    const newArr = [...arr];
    newArr[index][field] = value;
    setter(newArr);
  };

  const addArrayItem = (setter, arr, template) => {
    setter([...arr, template]);
  };

  const removeArrayItem = (setter, arr, index) => {
    const newArr = arr.filter((_, i) => i !== index);
    setter(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setValidationErrors({});

    // Validate required sections
    const basicErrors = validateBasicInfo();
    const skillErrors = validateSkills();
    
    if (Object.keys(basicErrors).length > 0 || Object.keys(skillErrors).length > 0) {
      setValidationErrors({ ...basicErrors, ...skillErrors });
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Clean up data before sending
    const cleanedSkills = skills.filter(skill => skill.trim());
    const cleanedProjects = projects.filter(project => project.title.trim());
    const cleanedExperience = experience.filter(exp => exp.company.trim() || exp.role.trim());
    const cleanedEducation = education.filter(edu => edu.institution.trim() || edu.degree.trim());

    const resumeData = { 
      basicInfo, 
      skills: cleanedSkills, 
      projects: cleanedProjects, 
      experience: cleanedExperience, 
      education: cleanedEducation 
    };

    try {
      const data = await saveResumeInfo(resumeData, token);
      console.log('Saved:', data);
      setSuccessMessage(isExistingInfo ? 'Resume information updated successfully!' : 'Resume information saved successfully!');
      setTimeout(() => {
        navigate('/resume-builder');
      }, 2000);
    } catch (err) {
      setErrorMessage('Failed to save resume information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabButton = (section) => {
    const isActive = activeSection === section.id;
    const isCompleted = getSectionCompletion(section.id);
    const Icon = section.icon;
    
    return (
      <button
        key={section.id}
        type="button"
        onClick={() => setActiveSection(section.id)}
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-w-0 ${
          isActive 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105' 
            : isCompleted
            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={18} className="flex-shrink-0" />
          <span className="font-medium truncate">{section.label}</span>
          {section.required && (
            <span className="text-red-500 text-sm flex-shrink-0">*</span>
          )}
        </div>
        {isCompleted && !isActive && (
          <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
        )}
        {isActive && (
          <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
        )}
      </button>
    );
  };

  // Show loading screen while fetching existing data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Resume Information</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Minimal Header with Logo (left) and Back Button (right) */}
      <div className="bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fa-solid fa-rocket"></i>
            </div>
            <span className="logo-text">ResumeCraft AI</span>
          </div>

          <Link to="/resume-builder" className="btn btn-ghost flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="hero-title gradient-text mb-4" style={{fontSize:'2.25rem'}}>
            {isExistingInfo ? 'Update Your Resume Information' : 'Create Your Professional Resume'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {isExistingInfo ? 'Modify your details to keep your resume up to date' : 'Fill in your details to generate a stunning, ATS-friendly resume'}
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-indigo-600">{getOverallProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ background: 'var(--primary-gradient)', width: `${getOverallProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="m-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 rounded-xl flex items-center shadow-sm">
              <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}
          
          {errorMessage && (
            <div className="m-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 rounded-xl flex items-center shadow-sm">
              <AlertCircle className="h-5 w-5 mr-3 text-red-600" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}
          
          {/* Navigation Tabs */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {sections.map(section => renderTabButton(section))}
            </div>
          </div>
      
          {/* Form Content */}
          <form className="p-8" onSubmit={handleSubmit}>
            {/* Basic Info Section */}
            <div className={`transition-all duration-300 ${activeSection === 'basic' ? 'block' : 'hidden'}`}>
              <div className="space-y-6">
            <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                    <User size={24} className="text-white" />
                  </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
                  <p className="text-gray-600">Let's start with your personal details</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="name" 
                      placeholder="John Doe" 
                      value={basicInfo.name} 
                      onChange={handleBasicChange} 
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 ${
                        validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Job Role <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="jobRole" 
                      placeholder="Software Engineer" 
                      value={basicInfo.jobRole} 
                      onChange={handleBasicChange} 
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 ${
                        validationErrors.jobRole ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {validationErrors.jobRole && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.jobRole}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Professional Summary</label>
                  <textarea 
                    name="summary" 
                    placeholder="A brief summary of your professional background and career goals..." 
                    value={basicInfo.summary} 
                    onChange={handleBasicChange} 
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Mail size={16} className="mr-2 text-indigo-500" />
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="email" 
                      type="email"
                      placeholder="john.doe@example.com" 
                      value={basicInfo.email} 
                      onChange={handleBasicChange} 
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 ${
                        validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Phone size={16} className="mr-2 text-indigo-500" />
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="phone" 
                      placeholder="+1 (555) 123-4567" 
                      value={basicInfo.phone} 
                      onChange={handleBasicChange} 
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 ${
                        validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <Linkedin size={16} className="mr-2 text-indigo-500" />
                    LinkedIn Profile
                  </label>
                  <input 
                    name="linkedin" 
                    placeholder="https://linkedin.com/in/johndoe" 
                    value={basicInfo.linkedin} 
                    onChange={handleBasicChange} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className={`transition-all duration-300 ${activeSection === 'skills' ? 'block' : 'hidden'}`}>
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                    <Award size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills & Expertise</h2>
                  <p className="text-gray-600">Showcase your technical and soft skills</p>
                </div>
                
                {validationErrors.skills && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                    <span className="text-red-700 font-medium">{validationErrors.skills}</span>
                  </div>
                )}
                
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="flex-1 relative">
                        <input 
                          value={skill} 
                          onChange={e => {
                            const newSkills = [...skills];
                            newSkills[index] = e.target.value;
                            setSkills(newSkills);
                          }} 
                          placeholder="e.g., JavaScript, Project Management, Data Analysis"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 pr-12"
                        />
                        {skill.trim() && (
                          <CheckCircle size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                        )}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem(setSkills, skills, index)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Remove skill"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button" 
                  onClick={() => addArrayItem(setSkills, skills, "")} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                >
                  <Plus size={18} />
                  Add Another Skill
                </button>
              </div>
            </div>

            {/* Projects Section */}
            <div className={`transition-all duration-300 ${activeSection === 'projects' ? 'block' : 'hidden'}`}>
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mb-4">
                    <FileText size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Projects Portfolio</h2>
                  <p className="text-gray-600">Showcase your best work and achievements</p>
                </div>
                
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Project {index + 1}</h3>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem(setProjects, projects, index)} 
                          className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                          aria-label="Remove project"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Project Title</label>
                          <input 
                            placeholder="E-commerce Website" 
                            value={project.title} 
                            onChange={e => handleArrayChange(setProjects, projects, index, "title", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Technologies Used</label>
                          <input 
                            placeholder="React, Node.js, MongoDB" 
                            value={project.technologies} 
                            onChange={e => handleArrayChange(setProjects, projects, index, "technologies", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <label className="block text-sm font-semibold text-gray-700">Description</label>
                        <textarea 
                          placeholder="Describe the project, your role, and its impact..." 
                          value={project.description} 
                          onChange={e => handleArrayChange(setProjects, projects, index, "description", e.target.value)} 
                          rows="3"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Project Link</label>
                        <input 
                          placeholder="https://github.com/yourusername/project" 
                          value={project.link} 
                          onChange={e => handleArrayChange(setProjects, projects, index, "link", e.target.value)} 
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button" 
                  onClick={() => addArrayItem(setProjects, projects, { title: "", description: "", technologies: "", link: "" })} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <Plus size={18} />
                  Add Another Project
                </button>
              </div>
            </div>

            {/* Experience Section */}
            <div className={`transition-all duration-300 ${activeSection === 'experience' ? 'block' : 'hidden'}`}>
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Work Experience</h2>
                  <p className="text-gray-600">Share your professional journey and achievements</p>
                </div>
                
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-green-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Experience {index + 1}</h3>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem(setExperience, experience, index)} 
                          className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                          aria-label="Remove experience"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Company</label>
                          <input 
                            placeholder="Google" 
                            value={exp.company} 
                            onChange={e => handleArrayChange(setExperience, experience, index, "company", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Job Title</label>
                          <input 
                            placeholder="Senior Software Engineer" 
                            value={exp.role} 
                            onChange={e => handleArrayChange(setExperience, experience, index, "role", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Calendar size={16} className="mr-2 text-green-500" />
                            Start Date
                          </label>
                          <input 
                            type="date" 
                            value={exp.startDate} 
                            onChange={e => handleArrayChange(setExperience, experience, index, "startDate", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Calendar size={16} className="mr-2 text-green-500" />
                            End Date
                          </label>
                          <input 
                            type="date" 
                            value={exp.endDate} 
                            onChange={e => handleArrayChange(setExperience, experience, index, "endDate", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Job Description</label>
                        <textarea 
                          placeholder="Describe your responsibilities, achievements, and the technologies you worked with..." 
                          value={exp.description} 
                          onChange={e => handleArrayChange(setExperience, experience, index, "description", e.target.value)} 
                          rows="3"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 hover:border-gray-300 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button" 
                  onClick={() => addArrayItem(setExperience, experience, { company: "", role: "", startDate: "", endDate: "", description: "" })} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                >
                  <Plus size={18} />
                  Add Another Experience
                </button>
              </div>
            </div>

            {/* Education Section */}
            <div className={`transition-all duration-300 ${activeSection === 'education' ? 'block' : 'hidden'}`}>
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
                    <Book size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Education Background</h2>
                  <p className="text-gray-600">Share your academic achievements and qualifications</p>
                </div>
                
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-orange-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Education {index + 1}</h3>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem(setEducation, education, index)} 
                          className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                          aria-label="Remove education"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Institution</label>
                          <input 
                            placeholder="Stanford University" 
                            value={edu.institution} 
                            onChange={e => handleArrayChange(setEducation, education, index, "institution", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Degree</label>
                          <input 
                            placeholder="Bachelor of Science in Computer Science" 
                            value={edu.degree} 
                            onChange={e => handleArrayChange(setEducation, education, index, "degree", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Calendar size={16} className="mr-2 text-orange-500" />
                            Start Date
                          </label>
                          <input 
                            type="date" 
                            value={edu.startDate} 
                            onChange={e => handleArrayChange(setEducation, education, index, "startDate", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Calendar size={16} className="mr-2 text-orange-500" />
                            End Date
                          </label>
                          <input 
                            type="date" 
                            value={edu.endDate} 
                            onChange={e => handleArrayChange(setEducation, education, index, "endDate", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Grade/GPA</label>
                          <input 
                            placeholder="3.8/4.0" 
                            value={edu.grade} 
                            onChange={e => handleArrayChange(setEducation, education, index, "grade", e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button" 
                  onClick={() => addArrayItem(setEducation, education, { institution: "", degree: "", startDate: "", endDate: "", grade: "" })} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                >
                  <Plus size={18} />
                  Add Another Education
                </button>
              </div>
            </div>

            {/* Submit Button - Always visible */}
            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Link 
                  to="/resume-builder"
                  className="btn btn-ghost w-full sm:w-auto text-center"
                >
                  Cancel
                </Link>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Progress: <span className="font-semibold text-indigo-600">{getOverallProgress()}%</span>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isExistingInfo ? 'Updating Resume...' : 'Saving Resume...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        {isExistingInfo ? 'Update Resume Information' : 'Save Resume Information'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}