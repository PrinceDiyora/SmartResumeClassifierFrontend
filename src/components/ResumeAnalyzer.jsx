import React from 'react';
import { Upload, AlertCircle, CheckCircle, X, FileText, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export default function ResumeAnalyzer() {
  const { 
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
  } = useResume();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await analyzeResume();
  };
  
  const handleFixIssues = async () => {
    await fixResumeIssues();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">Resume Analyzer</span>
        </h1>
        <p className="text-gray-600">
          Upload your resume to get AI-powered analysis and improvement suggestions
        </p>
      </div>

      {!result && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <Upload size={48} className="text-gray-400 mb-4" />
                <span className="text-lg font-medium mb-1">Upload your resume</span>
                <span className="text-sm text-gray-500 mb-4">PDF files only</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => document.getElementById('resume-upload').click()}
                >
                  Select File
                </button>
              </label>
            </div>

            {fileName && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-blue-500 mr-2" />
                  <span className="text-sm font-medium">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFileName('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center bg-red-50 p-3 rounded-md text-red-700">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!file || loading}
                className={`inline-flex items-center justify-center px-8 py-3 font-medium rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-90 hover:-translate-y-0.5 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {result && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel - Score Overview */}
          <div className="w-full md:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-center">Your Score</h3>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={showFixedContent ? (fixedResult?.overall_score >= 80 ? '#10B981' : 
                             fixedResult?.overall_score >= 60 ? '#3B82F6' : 
                             fixedResult?.overall_score >= 40 ? '#F59E0B' : '#EF4444') :
                             (result?.overall_score >= 80 ? '#10B981' : 
                             result?.overall_score >= 60 ? '#3B82F6' : 
                             result?.overall_score >= 40 ? '#F59E0B' : '#EF4444')}
                      strokeWidth="3"
                      strokeDasharray={`${showFixedContent ? (fixedResult?.overall_score || 0) : (result?.overall_score || 0)}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{showFixedContent ? (fixedResult?.overall_score || 0) : (result?.overall_score || 0)}</span>
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                    {showFixedContent ? 0 : (result?.improvement_suggestions?.length || 0)} Issues
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span className="font-medium">CONTENT</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(result?.section_scores?.summary_or_objective || 0)}`}>
                      {result?.section_scores?.summary_or_objective || 0}%
                    </span>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium">SECTION</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass((result?.section_scores?.experience || 0 + result?.section_scores?.education || 0) / 2)}`}>
                      {Math.round((result?.section_scores?.experience || 0 + result?.section_scores?.education || 0) / 2)}%
                    </span>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="font-medium">ATS ESSENTIALS</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(result?.section_scores?.formatting_and_clarity || 0)}`}>
                      {result?.section_scores?.formatting_and_clarity || 0}%
                    </span>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span className="font-medium">TAILORING</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(result?.section_scores?.skills || 0)}`}>
                      {result?.section_scores?.skills || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              {/* <button 
                onClick={handleFixIssues}
                disabled={isFixing || showFixedContent || !result?.improvement_suggestions?.length}
                className={`w-full inline-flex items-center justify-center py-3 px-4 font-medium rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-90 transition-all ${isFixing || showFixedContent ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isFixing ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Fixing Issues...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">Fix All Issues Instantly</span>
                    <Sparkles size={16} />
                  </>
                )}
              </button> */}
            </div>
          </div>

          {/* Right Panel - Detailed Analysis */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Analyze Another Resume
                </button>
              </div>
              
              <div className="p-6">
                  {/* ATS Parse Rate Section */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
                    <div 
                      className="p-4 border-b flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection('parseRate')}
                    >
                      <div className="flex items-center">
                        <FileText size={18} className="mr-2 text-gray-600" />
                        <h3 className="font-bold">ATS PARSE RATE</h3>
                      </div>
                      {expandedSections.parseRate ? (
                        <ChevronUp size={20} className="text-gray-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                      )}
                    </div>
                    
                    {expandedSections.parseRate && (
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="mb-2"><span className="font-medium">An Applicant Tracking System</span> commonly referred to as <span className="font-medium">ATS</span> is a system used by employers and recruiters to quickly scan a large number of job applications.</p>
                          <p>A high parse rate of your resume ensures that the ATS can read your resume, experience, and skills. This increases the chance of getting your resume seen by recruiters.</p>
                        </div>
                        
                        <div className="mt-6 mb-2">
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${showFixedContent ? (fixedResult?.ats_parse_rate || 0) : (result?.ats_parse_rate || 0)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center mt-6">
                          <div className="text-center">
                            <CheckCircle size={32} className="mx-auto mb-2 text-emerald-500" />
                            <p className="text-lg font-bold">Great!</p>
                            <p className="text-gray-600">We parsed {showFixedContent ? (fixedResult?.ats_parse_rate || 0) : (result?.ats_parse_rate || 0)}% of your resume successfully using an industry-leading ATS.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Skills Section */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
                    <div 
                      className="p-4 border-b flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection('skills')}
                    >
                      <div className="flex items-center">
                        <CheckCircle size={18} className="mr-2 text-gray-600" />
                        <h3 className="font-bold">SKILLS</h3>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {result?.improvement_suggestions?.filter(s => 
                            s.toLowerCase().includes('skill') || 
                            s.toLowerCase().includes('technology') || 
                            s.toLowerCase().includes('proficiency')
                          ).length || 0} issues
                        </span>
                        {expandedSections.skills ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </div>
                    </div>
                    
                    {expandedSections.skills && (
                      <div className="p-4">
                        <p className="text-gray-600 mb-4">Skills that match the job description increase your chances of getting past ATS filters and impressing recruiters.</p>
                        
                        <div className="space-y-3">
                          {result?.improvement_suggestions
                            ?.filter(s => 
                              s.toLowerCase().includes('skill') || 
                              s.toLowerCase().includes('technology') || 
                              s.toLowerCase().includes('proficiency')
                            )
                            .map((suggestion, index) => (
                              <div key={index} className="flex items-start p-3 border border-red-100 rounded-lg bg-red-50">
                                <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-gray-800">{suggestion}</p>
                                </div>
                              </div>
                            ))
                          }
                          
                          {(result?.improvement_suggestions?.filter(s => 
                            s.toLowerCase().includes('skill') || 
                            s.toLowerCase().includes('technology') || 
                            s.toLowerCase().includes('proficiency')
                          ).length === 0) && (
                            <div className="flex items-start p-3 border border-green-100 rounded-lg bg-green-50">
                              <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-800">No issues found with your skills section.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Work Experience Section */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
                    <div 
                      className="p-4 border-b flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection('workExperience')}
                    >
                      <div className="flex items-center">
                        <FileText size={18} className="mr-2 text-gray-600" />
                        <h3 className="font-bold">WORK EXPERIENCE</h3>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {showFixedContent ? 0 : (result?.improvement_suggestions?.filter(s => 
                            s.toLowerCase().includes('experience') || 
                            s.toLowerCase().includes('job') || 
                            s.toLowerCase().includes('work') || 
                            s.toLowerCase().includes('position') || 
                            s.toLowerCase().includes('role')
                          ).length || 0)} issues
                        </span>
                        {expandedSections.workExperience ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </div>
                    </div>
                    
                    {expandedSections.workExperience && (
                      <div className="p-4">
                        <p className="text-gray-600 mb-4">Your work experience should highlight achievements and responsibilities relevant to the job you're applying for.</p>
                        
                        <div className="space-y-3">
                          {!showFixedContent && result?.improvement_suggestions
                            ?.filter(s => 
                              s.toLowerCase().includes('experience') || 
                              s.toLowerCase().includes('job') || 
                              s.toLowerCase().includes('work') || 
                              s.toLowerCase().includes('position') || 
                              s.toLowerCase().includes('role')
                            )
                            .map((suggestion, index) => (
                              <div key={index} className="flex items-start p-3 border border-red-100 rounded-lg bg-red-50">
                                <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-gray-800">{suggestion}</p>
                                </div>
                              </div>
                            ))
                          }
                          
                          {(showFixedContent || (result?.improvement_suggestions?.filter(s => 
                            s.toLowerCase().includes('experience') || 
                            s.toLowerCase().includes('job') || 
                            s.toLowerCase().includes('work') || 
                            s.toLowerCase().includes('position') || 
                            s.toLowerCase().includes('role')
                          ).length === 0)) && (
                            <div className="flex items-start p-3 border border-green-100 rounded-lg bg-green-50">
                              <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-800">No issues found with your work experience section.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Education Section */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
                    <div 
                      className="p-4 border-b flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection('education')}
                    >
                      <div className="flex items-center">
                        <FileText size={18} className="mr-2 text-gray-600" />
                        <h3 className="font-bold">EDUCATION</h3>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {showFixedContent ? 0 : (result?.improvement_suggestions?.filter(s => 
                            s.toLowerCase().includes('education') || 
                            s.toLowerCase().includes('degree') || 
                            s.toLowerCase().includes('university') || 
                            s.toLowerCase().includes('college') || 
                            s.toLowerCase().includes('school')
                          ).length || 0)} issues
                        </span>
                        {expandedSections.education ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </div>
                    </div>
                    
                    {expandedSections.education && (
                      <div className="p-4">
                        <p className="text-gray-600 mb-4">Your education section should be clear, concise, and highlight relevant academic achievements.</p>
                        
                        <div className="space-y-3">
                          {!showFixedContent && result?.improvement_suggestions
                            ?.filter(s => 
                              s.toLowerCase().includes('education') || 
                              s.toLowerCase().includes('degree') || 
                              s.toLowerCase().includes('university') || 
                              s.toLowerCase().includes('college') || 
                              s.toLowerCase().includes('school')
                            )
                            .map((suggestion, index) => (
                              <div key={index} className="flex items-start p-3 border border-red-100 rounded-lg bg-red-50">
                                <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-gray-800">{suggestion}</p>
                                </div>
                              </div>
                            ))
                          }
                          
                          {(showFixedContent || (result?.improvement_suggestions?.filter(s => 
                            s.toLowerCase().includes('education') || 
                            s.toLowerCase().includes('degree') || 
                            s.toLowerCase().includes('university') || 
                            s.toLowerCase().includes('college') || 
                            s.toLowerCase().includes('school')
                          ).length === 0)) && (
                            <div className="flex items-start p-3 border border-green-100 rounded-lg bg-green-50">
                              <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-800">No issues found with your education section.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Formatting & Clarity Section */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
                    <div 
                      className="p-4 border-b flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection('formatting')}
                    >
                      <div className="flex items-center">
                        <FileText size={18} className="mr-2 text-gray-600" />
                        <h3 className="font-bold">FORMATTING & CLARITY</h3>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {showFixedContent ? 0 : (result?.improvement_suggestions?.filter(s => 
                            s.toLowerCase().includes('format') || 
                            s.toLowerCase().includes('layout') || 
                            s.toLowerCase().includes('structure') || 
                            s.toLowerCase().includes('clarity') || 
                            s.toLowerCase().includes('spelling') || 
                            s.toLowerCase().includes('grammar')
                          ).length || 0)} issues
                        </span>
                        {expandedSections.formatting ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </div>
                    </div>
                    
                    {expandedSections.formatting && (
                      <div className="p-4">
                        <p className="text-gray-600 mb-4">Clear formatting ensures your resume is easy to read by both ATS systems and human recruiters.</p>
                        
                        <div className="space-y-3">
                          {!showFixedContent && result?.improvement_suggestions
                            ?.filter(s => 
                              s.toLowerCase().includes('format') || 
                              s.toLowerCase().includes('layout') || 
                              s.toLowerCase().includes('structure') || 
                              s.toLowerCase().includes('clarity') || 
                              s.toLowerCase().includes('spelling') || 
                              s.toLowerCase().includes('grammar')
                            )
                            .map((suggestion, index) => (
                              <div key={index} className="flex items-start p-3 border border-red-100 rounded-lg bg-red-50">
                                <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-gray-800">{suggestion}</p>
                                </div>
                              </div>
                            ))
                          }
                          
                          {(showFixedContent || (result?.improvement_suggestions?.filter(s => 
                            s.toLowerCase().includes('format') || 
                            s.toLowerCase().includes('layout') || 
                            s.toLowerCase().includes('structure') || 
                            s.toLowerCase().includes('clarity') || 
                            s.toLowerCase().includes('spelling') || 
                            s.toLowerCase().includes('grammar')
                          ).length === 0)) && (
                            <div className="flex items-start p-3 border border-green-100 rounded-lg bg-green-50">
                              <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-800">No issues found with your formatting and clarity.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );                
}