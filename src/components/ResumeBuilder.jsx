import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

export default function ResumeBuilder() {
  const [latex, setLatex] = useState(`\\documentclass{article}
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

\\end{document}`);
  const [loading, setLoading] = useState(false);
  const [compileFlash, setCompileFlash] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

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


  const handleCompile = () => {
    setCompileFlash(true);
    setTimeout(() => setCompileFlash(false), 400);
  };

  const handleLatexChange = (value) => {
    setLatex(value ?? '');
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
    alert('PDF download is temporarily disabled.');
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-white">
      <header className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b shadow-sm z-20">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-gray-800">LaTeX Resume Builder</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCompile}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recompile
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Download
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleDownloadTex(); }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  .tex
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleDownloadPdf(); }}
                  className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed hover:bg-gray-100"
                >
                  .pdf
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Editor Panel */}
        <main className="w-full lg:w-7/12 flex flex-col overflow-y-auto lg:overflow-hidden">
          <div className="flex-1 p-2 lg:p-4 bg-white h-[50vh] lg:h-full">
            <MonacoEditor
              height="100%"
              defaultLanguage="latex"
              value={latex}
              onChange={handleLatexChange}
              theme="light"
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
        </main>

        {/* Preview Panel */}
        <aside className={`w-full lg:w-5/12 bg-gray-50 border-t-2 lg:border-t-0 lg:border-l-2 p-4 flex flex-col shadow-inner transition-all duration-300 ${compileFlash ? 'ring-4 ring-green-300' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
          </div>
          <div className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed min-h-[40vh] lg:min-h-0">
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2">PDF compilation is not available.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}