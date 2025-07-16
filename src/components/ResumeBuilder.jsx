import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

const TEMPLATES = [
  { name: 'Classic', value: 'classic', latex: `\\documentclass{article}\n\\begin{document}\n\\section*{John Doe}\n\\textbf{Email:} john.doe@email.com \\ \n\\textbf{Phone:} (123) 456-7890 \\ \n\\textbf{LinkedIn:} linkedin.com/in/johndoe\n\n\\section*{Education}\nB.Sc. in Computer Science, University X (2018-2022)\n\n\\section*{Experience}\nSoftware Engineer, Company Y (2022-Present)\n- Developed awesome things.\n\n\\end{document}` },
  { name: 'Modern', value: 'modern', latex: `\\documentclass{moderncv}\n\\moderncvstyle{banking}\n\\moderncvcolor{blue}\n\\name{John}{Doe}\n\\email{john.doe@email.com}\n\\phone[mobile]{123-456-7890}\n\\social[linkedin]{johndoe}\n\\begin{document}\n\\makecvtitle\n\\section{Education}\nB.Sc. in Computer Science, University X (2018-2022)\n\\section{Experience}\nSoftware Engineer, Company Y (2022-Present)\n\\end{document}` },
  { name: 'Academic', value: 'academic', latex: `\\documentclass[11pt]{article}\n\\usepackage{geometry}\n\\geometry{margin=1in}\n\\begin{document}\n\\begin{center}\n{\\LARGE John Doe}\\\\\nEmail: john.doe@email.com \\ Phone: (123) 456-7890 \\ LinkedIn: linkedin.com/in/johndoe\n\\end{center}\n\\section*{Education}\nB.Sc. in Computer Science, University X (2018-2022)\n\\section*{Experience}\nSoftware Engineer, Company Y (2022-Present)\n\\end{document}` },
];

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].value);
  const [latex, setLatex] = useState(TEMPLATES[0].latex);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [compileFlash, setCompileFlash] = useState(false);
  const fileInputRef = useRef();
  const previewRef = useRef();

  // Update LaTeX when template changes
  useEffect(() => {
    const tpl = TEMPLATES.find(t => t.value === selectedTemplate);
    if (tpl) setLatex(tpl.latex);
  }, [selectedTemplate]);

  // Compile button: flash the preview pane
  const handleCompile = () => {
    setCompileFlash(true);
    setTimeout(() => setCompileFlash(false), 400);
  };

  const handleTemplateSelect = (value) => setSelectedTemplate(value);

  const handleLatexChange = (value) => {
    setLatex(value ?? '');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setLatex(evt.target.result);
    reader.readAsText(file);
  };

  // Download PDF is disabled for now
  const handleDownload = () => {
    alert('PDF download is temporarily disabled.');
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <header className="flex sticky top-0 z-10 justify-between items-center px-8 py-4 bg-white border-b shadow-sm">
        <div className="flex gap-2 items-center">
          <span className="text-2xl font-bold text-blue-600">LaTeX Resume Builder</span>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleCompile}
            className="flex gap-2 items-center px-5 py-2 font-medium text-white bg-green-600 rounded-lg shadow transition hover:bg-green-700"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 00-3.182 0l-7.193 7.193a2.25 2.25 0 000 3.182l3.182 3.182a2.25 2.25 0 003.182 0l7.193-7.193a2.25 2.25 0 000-3.182l-3.182-3.182z" />
            </svg>
            Compile
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex overflow-hidden flex-1">
        {/* Sidebar */}
        <aside className="flex overflow-y-auto flex-col gap-2 px-4 py-6 w-56 bg-white border-r shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Templates</h2>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.value}
              onClick={() => handleTemplateSelect(tpl.value)}
              className={`w-full text-left px-4 py-2 rounded-lg mb-1 font-medium transition border
                ${selectedTemplate === tpl.value
                  ? 'bg-blue-100 border-blue-500 text-blue-700 shadow'
                  : 'bg-gray-50 border-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              {tpl.name}
            </button>
          ))}
        </aside>

        {/* Editor + Preview */}
        <main className="flex overflow-hidden flex-1">
          {/* LaTeX Editor */}
          <section className="flex flex-col flex-1 gap-2 p-6 min-w-0">
            <label className="mb-2 font-semibold text-gray-700">LaTeX Editor</label>
            <div className="relative flex-1">
              <MonacoEditor
                height="70vh"
                defaultLanguage="latex"
                value={latex}
                onChange={handleLatexChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: 'Fira Mono, monospace',
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  cursorBlinking: 'blink',
                  renderLineHighlight: 'all',
                  automaticLayout: true,
                  scrollbar: { vertical: 'auto', horizontal: 'auto' },
                }}
              />
            </div>
          </section>

          {/* PDF Preview */}
          <section className={`w-[420px] min-w-[280px] max-w-[600px] bg-white border-l shadow-lg flex flex-col p-4 overflow-auto resize-x transition ${compileFlash ? 'ring-4 ring-green-300' : ''}`} ref={previewRef}>
            <div className="mb-2 font-semibold text-gray-700">PDF Preview</div>
            <div className="flex flex-1 justify-center items-center bg-gray-100 rounded-lg border border-dashed">
              <span className="text-gray-400">PDF compilation is not available in frontend-only mode.</span>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Import and PDF Disabled Buttons */}
      <div className="flex fixed right-6 bottom-6 z-50 flex-row gap-3">
        <button
          onClick={() => fileInputRef.current.click()}
          className="px-6 py-3 font-medium text-white bg-gray-700 rounded-full shadow-lg transition hover:bg-gray-900"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' }}
        >
          Import .tex
        </button>
        <button
          onClick={handleDownload}
          className="px-5 py-3 font-semibold text-white bg-blue-500 rounded-full border border-blue-600 shadow-lg cursor-not-allowed"
          disabled
          style={{ minWidth: 110 }}
        >
          PDF Disabled
        </button>
      </div>
      <input
        type="file"
        accept=".tex"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
} 