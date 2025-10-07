import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getResumeInfo } from '../api/resumeInfo';
import ResumeTemplates from './ResumeTemplates';
import ResumeList from './ResumeList';
import { Menu, FileText, User, LogOut, Plus, Edit3 } from 'lucide-react';

const ResumeBuilderPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasResumeInfo, setHasResumeInfo] = useState(false);
  const [loadingResumeInfo, setLoadingResumeInfo] = useState(true);
  const { isAuthenticated, currentUser, logout, token } = useAuth();

  // Check if user has existing resume info
  useEffect(() => {
    const checkResumeInfo = async () => {
      if (!token) {
        setLoadingResumeInfo(false);
        return;
      }
      
      try {
        const resumeInfo = await getResumeInfo(token);
        setHasResumeInfo(!!resumeInfo);
      } catch (error) {
        // If 404, user doesn't have resume info yet
        setHasResumeInfo(false);
      } finally {
        setLoadingResumeInfo(false);
      }
    };

    checkResumeInfo();
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex z-20 justify-between items-center px-6 py-3 bg-white border-b shadow-sm">
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
              <FileText size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">ResumeCraft AI</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="relative group">
              <button className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                <User size={20} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{currentUser?.email}</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
                <FileText size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">ResumeCraft AI</span>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link to="/" className="flex items-center gap-2 p-3 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors">
              <div className="text-indigo-600"><FileText size={18} /></div>
              <span>Home</span>
            </Link>
            <Link to="/resume-builder" className="flex items-center gap-2 p-3 text-indigo-700 bg-indigo-50 rounded-lg transition-colors">
              <div className="text-indigo-600"><FileText size={18} /></div>
              <span>Resume Builder</span>
            </Link>
            <Link to="/resume-form" className="flex items-center gap-2 p-3 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors">
              <div className="text-indigo-600"><Edit3 size={18} /></div>
              <span>Create Resume Info</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t">
            <Link to="/" className="flex items-center justify-center gap-2 w-full p-2 text-sm font-medium text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700">
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Builder</h1>
              <p className="text-gray-600">Choose from professional templates or manage your existing resumes</p>
            </div>
            <Link 
              to="/resume-form" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 hover:transform hover:scale-105 font-semibold"
            >
              {loadingResumeInfo ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : hasResumeInfo ? (
                <>
                  <Edit3 size={20} />
                  Edit Resume Info
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Create Resume Info
                </>
              )}
            </Link>
          </div>
        </div>
        
        {/* Resume Templates Section */}
        <section className="mb-12">
          <ResumeTemplates />
        </section>
        
        {/* Your Resumes Section */}
        <section>
          <ResumeList />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; 2023 ResumeCraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ResumeBuilderPage;