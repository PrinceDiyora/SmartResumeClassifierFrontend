import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { compileAndSave } from '../api/compile';
import { getResumeById, updateResume } from '../api/resume';
import { getResumeInfo } from '../api/resumeInfo';
import { generateDynamicTemplate } from '../utils/templateGenerator';
import { Menu, FileText, Settings, Sun, Moon, Eye, EyeOff, Maximize2, Download, Save, FileDown, ChevronDown, Loader2, Code, FileOutput } from 'lucide-react';
import { useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  
  const defaultTemplate = `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\begin{document}

\\section*{John Doe}
\\textbf{Email:} john.doe@email.com \\\\
\\textbf{Phone:} (123) 456-7890 \\\\
\\textbf{LinkedIn:} linkedin.com/in/johndoe

\\section*{Education}
B.Sc. in Computer Science, University X \\\\
*GPA: 3.8/4.0* \\\\
*Relevant Coursework: Data Structures, Algorithms, Web Development*

\\section*{Experience}
\\subsection*{Software Engineer Intern | ABC Corp | Summer 2023}
\\begin{itemize}
    \\item Developed and maintained web applications using React and Node.js.
    \\item Collaborated with a team of developers to create new features.
    \\item Wrote unit tests to ensure code quality.
\\end{itemize}

\\subsection*{Web Developer | XYZ Inc | 2022-2023}
\\begin{itemize}
    \\item Designed and developed responsive websites for clients.
    \\item Optimized websites for speed and performance.
\\end{itemize}

\\section*{Skills}
\\begin{itemize}
    \\item \\textbf{Programming Languages:} JavaScript, Python, Java, C++
    \\item \\textbf{Frameworks:} React, Node.js, Express
    \\item \\textbf{Tools:} Git, Docker, Webpack
\\end{itemize}

\\end{document}`;

  const [latex, setLatex] = useState(defaultTemplate);
  const [loading, setLoading] = useState(false);
  const [compileFlash, setCompileFlash] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fetchingResume, setFetchingResume] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [compilationError, setCompilationError] = useState(null);
  const storageKey = id ? `resume-${id}` : 'resume-draft';

  const persistDraft = (nextTitle, nextLatex) => {
    try {
      const draft = { id, title: nextTitle, content: nextLatex, updatedAt: Date.now() };
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch (_) {}
  };

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

  // Load dynamic template for new resumes or fetch existing resume data
  useEffect(() => {
    const loadResumeData = async () => {
      if (id && token) {
        // Existing resume - fetch from server
        setFetchingResume(true);
        const draftJson = localStorage.getItem(storageKey);
        if (draftJson) {
          try {
            const draft = JSON.parse(draftJson);
            setLatex(draft.content ?? latex);
            setResumeTitle(draft.title ?? resumeTitle);
          } catch (_) {}
        }

        try {
          const data = await getResumeById(id, token);
          if (!draftJson) {
            setLatex(data.content);
            setResumeTitle(data.title);
          }
        } catch (err) {
          console.error('Failed to fetch resume:', err);
          alert('Failed to load resume. Redirecting to resume builder.');
          navigate('/resume-builder');
        } finally {
          setFetchingResume(false);
        }
      } else if (!id && token) {
        // New resume - try to load dynamic template
        try {
          const resumeInfo = await getResumeInfo(token);
          if (resumeInfo) {
            const dynamicTemplate = generateDynamicTemplate(defaultTemplate, resumeInfo);
            setLatex(dynamicTemplate);
          }
        } catch (error) {
          console.log('No resume info found, using default template');
          // It's okay if no resume info exists, we'll use the default template
        }
      }
    };

    loadResumeData();
  }, [id, token, navigate, defaultTemplate]);


  const handleCompile = async () => {
    console.log('=== COMPILE STARTED ===');
    setLoading(true);
    setCompileFlash(true);
    setTimeout(() => setCompileFlash(false), 400);
    setPdfUrl(null);
    setCompilationError(null);
    
    try {
      // save draft locally first
      persistDraft(resumeTitle, latex);
      const blob = await compileAndSave({ id, title: resumeTitle, code: latex, token });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Compilation error:', err);
      console.error('Error details:', err.details);
      
      if (err.details && err.details.type === 'compilation') {
        // Show detailed LaTeX compilation error
        console.log('Setting compilation error:', {
          message: err.message,
          stderr: err.details.stderr,
          stdout: err.details.stdout
        });
        setCompilationError({
          message: err.message,
          stderr: err.details.stderr,
          stdout: err.details.stdout
        });
      } else {
        // Show generic error for other types of errors
        console.log('Setting generic error - no detailed error info available');
        setCompilationError({
          message: 'Compilation failed',
          stderr: 'Failed to compile PDF. Please check your LaTeX code for errors.',
          stdout: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLatexChange = (value) => {
    const next = value ?? '';
    setLatex(next);
    // debounce localStorage to avoid excessive writes
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeoutId = setTimeout(() => persistDraft(resumeTitle, next), 500);
    setSaveTimeout(timeoutId);
  };
  
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setResumeTitle(newTitle);
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeoutId = setTimeout(() => persistDraft(newTitle, latex), 500);
    setSaveTimeout(timeoutId);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([latex], { type: 'text/x-tex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDropdownOpen(false);
  };

  const handleDownloadPdf = () => {
    if (!pdfUrl) {
      alert('No compiled PDF available.');
      setIsDropdownOpen(false);
      return;
    }
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsDropdownOpen(false);
  };

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
          {id && (
            <div className="ml-6">
              <input 
                type="text" 
                value={resumeTitle} 
                onChange={handleTitleChange}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Resume Title"
              />
            </div>
          )}
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
            onClick={handleCompile}
            className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700 shadow-sm"
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <FileOutput size={18} />}
            {loading ? 'Compiling...' : 'Compile PDF'}
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
            <Link to="/resume-builder" className="flex items-center gap-2 p-3 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors">
              <div className="text-indigo-600"><FileText size={18} /></div>
              <span>My Resumes</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 p-3 text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors">
              <div className="text-indigo-600"><Settings size={18} /></div>
              <span>Settings</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t">
            <Link to="/resume-builder" className="flex items-center justify-center gap-2 w-full p-2 text-sm font-medium text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700">
              <span>Back to My Resumes</span>
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
            
            {compilationError && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-2">
                      LaTeX Compilation Error
                    </h3>
                    
                    {compilationError.stderr && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-red-700 mb-1">Error Details:</h4>
                        <pre className="text-xs bg-red-100 p-2 rounded border overflow-x-auto max-h-40 text-red-700 whitespace-pre-wrap font-mono">
                          {compilationError.stderr}
                        </pre>
                      </div>
                    )}
                    
                    {compilationError.stdout && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-red-700 mb-1">Additional Output:</h4>
                        <pre className="text-xs bg-red-100 p-2 rounded border overflow-x-auto max-h-32 text-red-700 whitespace-pre-wrap font-mono">
                          {compilationError.stdout}
                        </pre>
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-red-600">
                      <p><strong>Common fixes:</strong></p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Check for unclosed braces: { }</li>
                        <li>Ensure all \begin commands have matching \end commands</li>
                        <li>Remove extra backslashes (\\) at line endings</li>
                        <li>Check for special characters that need escaping</li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => setCompilationError(null)}
                      className="mt-3 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Dismiss Error
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`rounded-lg overflow-hidden border border-gray-200 shadow-sm ${compilationError ? 'h-[calc(100%-15rem)]' : 'h-[calc(100%-2.5rem)]'}`}>
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
            {/* <button 
              onClick={handleCompile}
              className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-md transition hover:bg-indigo-100"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <FileOutput size={12} />}
              {loading ? 'Compiling...' : 'Refresh'}
            </button> */}
          </div>
          <div className="flex-1 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm min-h-[40vh] lg:min-h-0 p-0 overflow-hidden">
            {loading ? (
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
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}