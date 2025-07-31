import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import { compileLatex } from '../api/compile';
import { getResumeById, updateResume } from '../api/resume';
import { useAuth } from '../context/AuthContext';
import { Menu, FileText, Settings, Sun, Moon, Eye, EyeOff, Download, Save, FileDown, ChevronDown, Loader2, Code, FileOutput, ArrowLeft } from 'lucide-react';

const ResumeEditor = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const [resume, setResume] = useState(null);
  const [title, setTitle] = useState('');
  const [latex, setLatex] = useState('');
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [compileFlash, setCompileFlash] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch resume data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await getResumeById(id, token);
        setResume(data);
        setTitle(data.title);
        setLatex(data.content);
        setError(null);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchResume();
    }
  }, [id, token]);

  // Auto-save functionality
  useEffect(() => {
    if (resume && (title !== resume.title || latex !== resume.content)) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      const timeout = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      setSaveTimeout(timeout);
    }
    
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [title, latex]);

  const handleLatexChange = (value) => {
    setLatex(value ?? '');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
    if (!resume) return;
    
    try {
      setSaving(true);
      await updateResume(id, { title, content: latex }, token);
      // Update the local resume state
      setResume({ ...resume, title, content: latex });
    } catch (err) {
      console.error('Error saving resume:', err);
      setError('Failed to save resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCompile = async () => {
    try {
      setCompiling(true);
      setError(null);
      
      // First save any changes
      await handleSave();
      
      // Then compile
      const response = await compileLatex(latex);
      
      // Create a blob URL for the PDF
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      // Flash effect on the preview panel
      setCompileFlash(true);
      setTimeout(() => setCompileFlash(false), 1000);
    } catch (err) {
      console.error('Compilation error:', err);
      setError('Failed to compile LaTeX. Please check your code for errors.');
    } finally {
      setCompiling(false);
    }
  };

  const handleDownloadTex = () => {
    const blob = new Blob([latex], { type: 'text/x-tex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'resume'}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDropdownOpen(false);
  };

  const handleDownloadPdf = () => {
    if (!pdfUrl) return;
    
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${title || 'resume'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading resume...</span>
      </div>
    );
  }

  if (error && !resume) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <div className="mt-4">
            <Link 
              to="/resume-builder"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft size={16} />
              Back to Resume Builder
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
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
          
          <div className="ml-4 flex-1 max-w-md">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Resume Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button
            onClick={handleSave}
            className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg transition hover:bg-indigo-100"
            disabled={saving}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
          
          <button
            onClick={handleCompile}
            className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700 shadow-sm"
            disabled={compiling}
          >
            {compiling ? <Loader2 size={18} className="animate-spin" /> : <FileOutput size={18} />}
            {compiling ? 'Compiling...' : 'Compile PDF'}
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg transition hover:bg-indigo-100"
            >
              <Download size={18} />
              Download
              <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 z-30 py-1 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                <button
                  onClick={handleDownloadTex}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                >
                  <Code size={16} />
                  LaTeX Source (.tex)
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={!pdfUrl}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${pdfUrl ? 'text-gray-700 hover:bg-indigo-50' : 'text-gray-400 cursor-not-allowed'} transition-colors`}
                >
                  <FileDown size={16} />
                  PDF Document (.pdf)
                </button>
              </div>
            )}
          </div>
          
          <Link 
            to="/resume-builder"
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Resume Builder"
          >
            <ArrowLeft size={20} />
          </Link>
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
            <Link to="/resume-builder" className="flex items-center gap-2 p-3 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors">
              <div className="text-indigo-600"><FileText size={18} /></div>
              <span>Resume Builder</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 p-3 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors">
              <div className="text-indigo-600"><Settings size={18} /></div>
              <span>Settings</span>
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

      <div className="flex overflow-hidden flex-col flex-1 lg:flex-row">
        {/* Editor Panel */}
        <main className="flex overflow-y-auto flex-col w-full lg:w-7/12 lg:overflow-hidden">
          <div className="flex-1 p-4 bg-white h-[50vh] lg:h-full border-r">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Code size={18} className="text-indigo-600" />
                LaTeX Editor
              </h2>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Auto-saving</div>
            </div>
            {error && (
              <div className="mb-3 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="h-[calc(100%-2.5rem)] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <MonacoEditor
                height="100%"
                defaultLanguage="latex"
                value={latex}
                onChange={handleLatexChange}
                theme={theme === 'light' ? 'vs' : 'vs-dark'}
                options={{
                  fontSize: 14,
                  fontFamily: 'Fira Mono, monospace',
                  minimap: { enabled: true },
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  cursorBlinking: 'blink',
                  renderLineHighlight: 'all',
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
        </main>

        {/* Preview Panel */}
        <aside className={`w-full lg:w-5/12 bg-gray-50 p-4 flex flex-col transition-all duration-300 ${compileFlash ? 'ring-4 ring-indigo-300' : ''}`}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              PDF Preview
            </h2>
            <button 
              onClick={handleCompile}
              className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-md transition hover:bg-indigo-100"
            >
              {compiling ? <Loader2 size={12} className="animate-spin" /> : <FileOutput size={12} />}
              {compiling ? 'Compiling...' : 'Refresh'}
            </button>
          </div>
          <div className="flex-1 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm min-h-[40vh] lg:min-h-0 p-0 overflow-hidden">
            {compiling ? (
              <div className="text-center text-gray-500 flex flex-col items-center">
                <Loader2 size={32} className="animate-spin text-indigo-500 mb-2" />
                <p>Compiling your PDF...</p>
              </div>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-full rounded-lg"
                style={{ minHeight: 0, minWidth: 0, height: '100%', width: '100%', border: 0 }}
              />
            ) : (
              <div className="text-center text-gray-500 flex flex-col items-center">
                <FileText size={48} className="text-gray-300 mb-2" />
                <p className="font-medium">No PDF preview available</p>
                <p className="text-sm mt-1">Click the Compile button to generate a preview</p>
                <button
                  onClick={handleCompile}
                  className="mt-4 flex gap-2 items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700 shadow-sm"
                >
                  <FileOutput size={16} />
                  Compile PDF
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ResumeEditor;