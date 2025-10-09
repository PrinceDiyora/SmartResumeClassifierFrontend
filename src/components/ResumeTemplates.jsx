import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createResume } from '../api/resume';
import { getResumeInfo } from '../api/resumeInfo';
import { generateDynamicTemplate } from '../utils/templateGenerator';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

// Template Processing Optimization - Cache and performance utilities
class TemplateCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Limit cache size
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entries
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  generateKey(templateId, resumeData) {
    return `${templateId}_${JSON.stringify(resumeData)}`;
  }
}

// Global template cache instance
const templateCache = new TemplateCache();

// Optimized template processor with caching
const processTemplateOptimized = (templateId, templateContent, resumeData) => {
  if (!resumeData) return templateContent;

  const cacheKey = templateCache.generateKey(templateId, resumeData);
  
  // Check cache first
  if (templateCache.has(cacheKey)) {
    return templateCache.get(cacheKey);
  }

  // Process template
  const processedContent = generateDynamicTemplate(templateContent, resumeData);
  
  // Cache the result
  templateCache.set(cacheKey, processedContent);
  
  return processedContent;
};

// Background processing utility
const useBackgroundTemplateProcessing = (templates, resumeData) => {
  const [processedTemplates, setProcessedTemplates] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const processInBackground = useCallback(async () => {
    if (!resumeData || processingRef.current) return;
    
    processingRef.current = true;
    setIsProcessing(true);
    
    const processed = {};
    const chunkSize = 2; // Process 2 templates at a time
    
    for (let i = 0; i < templates.length; i += chunkSize) {
      const chunk = templates.slice(i, i + chunkSize);
      
      // Process chunk with small delay to keep UI responsive
      await new Promise(resolve => {
        setTimeout(() => {
          chunk.forEach(template => {
            processed[template.id] = processTemplateOptimized(
              template.id,
              template.content,
              resumeData
            );
          });
          resolve();
        }, 50); // 50ms delay between chunks
      });
    }
    
    setProcessedTemplates(processed);
    setIsProcessing(false);
    processingRef.current = false;
  }, [templates, resumeData]);

  useEffect(() => {
    processInBackground();
  }, [processInBackground]);

  return { processedTemplates, isProcessing };
};

// Smart loading hook for visible templates
const useIntersectionObserver = (options = {}) => {
  const [visibleTemplates, setVisibleTemplates] = useState(new Set());
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const templateId = entry.target.dataset.templateId;
        if (entry.isIntersecting) {
          setVisibleTemplates(prev => new Set([...prev, templateId]));
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '100px',
      ...options
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const observe = useCallback((element, templateId) => {
    if (element && observerRef.current) {
      element.dataset.templateId = templateId;
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element) => {
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  return { visibleTemplates, observe, unobserve };
};

// Smart Template Card Component with lazy loading and caching
const SmartTemplateCard = React.memo(({ 
  template, 
  index, 
  resumeInfo, 
  viewMode, 
  processedTemplates, 
  isProcessing, 
  visibleTemplates, 
  observe, 
  onTemplateSelect 
}) => {
  const cardRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      observe(cardRef.current, template.id);
    }
  }, [observe, template.id]);

  useEffect(() => {
    setIsVisible(visibleTemplates.has(template.id));
  }, [visibleTemplates, template.id]);

  const isTemplateReady = useMemo(() => {
    if (!resumeInfo || viewMode !== 'personalized') return true;
    return processedTemplates[template.id] || !isProcessing;
  }, [resumeInfo, viewMode, processedTemplates, template.id, isProcessing]);

  return (
    <div 
      ref={cardRef}
      className="template-card group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-105 cursor-pointer h-[620px] flex flex-col relative"
    >
      {/* Enhanced Template Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 flex-shrink-0">
        <div className="w-full h-80 flex items-center justify-center p-4">
          {isVisible ? (
            <img 
              src={template.image} 
              alt={`${template.name} Template`} 
              className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Enhanced Template Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg border border-white/20"
                style={{ background: 'var(--primary-gradient)' }}>
            Template {index + 1}
          </span>
        </div>
        
        {/* Processing Indicator */}
        {!isTemplateReady && (
          <div className="absolute top-4 left-4">
            <div className="bg-yellow-100 border border-yellow-300 rounded-full px-3 py-1 flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-2"></div>
              <span className="text-xs text-yellow-700">Processing...</span>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%)' }}>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Template Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300"
                style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {template.name}
            </h3>
            <div className="ml-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            {isTemplateReady && resumeInfo && viewMode === 'personalized' && (
              <div className="ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
            {template.description}
          </p>
        </div>
        
        {/* Simple Action Button */}
        <button
          onClick={() => onTemplateSelect(template)}
          disabled={!isTemplateReady}
          className={`w-full py-3 px-6 text-sm font-semibold rounded-2xl transition-all duration-300 text-white ${
            isTemplateReady 
              ? '' 
              : 'opacity-60 cursor-not-allowed'
          }`}
          style={{ background: isTemplateReady ? 'var(--primary-gradient)' : 'var(--primary-gradient)' }}
        >
          {!isTemplateReady ? 'Processing...' : 
           resumeInfo && viewMode === 'personalized' ? 'Use Personalized Template' : 'Use This Template'}
        </button>
      </div>
      
      {/* Decorative Corner Element */}
      <div className="absolute top-0 left-0 w-16 h-16 rounded-br-3xl"
           style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%)' }}></div>
    </div>
  );
});

SmartTemplateCard.displayName = 'SmartTemplateCard';

const TEMPLATES = [
  {
    id: 'template1',
    name: 'Professional',
    description: 'Clean and professional template suitable for most industries',
    image: '/template-images/temp1.png',
    content: `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\begin{document}

\\section*{ {{name}} }
\\textbf{Email:} {{email}} \\\\
\\textbf{Phone:} {{phone}} \\\\
{{#if linkedin}}\\textbf{LinkedIn:} {{linkedin}}{{/if}}

{{#if summary}}
\\section*{Summary}
{{summary}}
{{/if}}

{{#if educations}}
\\section*{Education}
{{#each educations}}
\\textbf{ {{degree}} }{{#if institution}}, {{institution}}{{/if}} {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{#if grade}}GPA: {{grade}}{{/if}}
{{#if description}}{{description}}{{/if}}

{{/each}}
{{else}}
B.Sc. in Computer Science, University X \\\\
*GPA: 3.8/4.0* \\\\
*Relevant Coursework: Data Structures, Algorithms, Web Development*
{{/if}}

{{#if experiences}}
\\section*{Experience}
{{#each experiences}}
\\subsection*{ {{role}} | {{company}} {{#if startDate}}| {{formatDate startDate}} - {{formatDate endDate}}{{/if}} }
\\begin{itemize}
    \\item {{description}}
\\end{itemize}

{{/each}}
{{else}}
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
{{/if}}

{{#if skills}}
\\section*{Skills}
\\begin{itemize}
    \\item \\textbf{Skills:} {{join skills ", "}}
\\end{itemize}
{{else}}
\\section*{Skills}
\\begin{itemize}
    \\item \\textbf{Programming Languages:} JavaScript, Python, Java, C++
    \\item \\textbf{Frameworks:} React, Node.js, Express
    \\item \\textbf{Tools:} Git, Docker, Webpack
\\end{itemize}
{{/if}}

{{#if projects}}
\\section*{Projects}
{{#each projects}}
\\textbf{ {{title}} }{{#if technologies}} \\hfill \\textit{ {{technologies}} }{{/if}}\\\\
\\begin{itemize}
  \\item {{description}}
\\end{itemize}

{{/each}}
{{/if}}

\\end{document}`
  },
  {
    id: 'template2',
    name: 'Modern',
    description: 'Contemporary design with a clean layout and modern typography',
    image: '/template-images/temp2.png',
    content: `\\documentclass{article}
\\usepackage[margin=0.8in]{geometry}
\\usepackage{enumitem}
\\begin{document}

\\begin{center}
\\textbf{\\Large {{uppercase name}} }\\\\
\\vspace{0.1cm}
{{email}} | {{phone}}{{#if linkedin}} | {{linkedin}}{{/if}}{{#if github}} | {{github}}{{/if}}
\\end{center}
\\vspace{0.2cm}
\\hrule
\\vspace{0.2cm}

{{#if summary}}
\\section*{PROFILE}
{{summary}}
{{/if}}

{{#if educations}}
\\section*{EDUCATION}
{{#each educations}}
\\textbf{ {{degree}} } {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{institution}}{{#if grade}} \\hfill GPA: {{grade}}{{/if}}
{{#if description}}\\\\\\textit{ {{description}} }{{/if}}

{{/each}}
{{else}}
\\section*{EDUCATION}
\\textbf{Master of Science in Computer Engineering} \\hfill 2020 - 2022\\\\
University of Technology \\hfill GPA: 3.9/4.0\\\\
\\textit{Thesis: Advanced Neural Networks for Image Recognition}
{{/if}}

{{#if experiences}}
\\section*{PROFESSIONAL EXPERIENCE}
{{#each experiences}}
\\textbf{ {{role}} } {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{company}}
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item {{description}}
\\end{itemize}

{{/each}}
{{else}}
\\section*{PROFESSIONAL EXPERIENCE}
\\textbf{Senior Software Developer} \\hfill Jan 2023 - Present\\\\
Tech Innovations Inc.
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Led development of cloud-based analytics platform using AWS and React
  \\item Implemented CI/CD pipeline reducing deployment time by 40\\%
  \\item Mentored junior developers and conducted code reviews
\\end{itemize}

\\textbf{Software Engineer} \\hfill Mar 2022 - Dec 2022\\\\
Digital Solutions LLC
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Developed RESTful APIs using Node.js and Express
  \\item Optimized database queries improving performance by 30\\%
  \\item Collaborated with UX team to implement responsive designs
\\end{itemize}
{{/if}}

{{#if skills}}
\\section*{TECHNICAL SKILLS}
\\textbf{Skills:} {{join skills ", "}}\\\\
{{else}}
\\section*{TECHNICAL SKILLS}
\\textbf{Languages:} JavaScript, TypeScript, Python, Java, C++\\\\
\\textbf{Frameworks:} React, Angular, Node.js, Express, Django\\\\
\\textbf{Tools:} Git, Docker, Kubernetes, Jenkins, AWS, Azure
{{/if}}

{{#if projects}}
\\section*{PROJECTS}
{{#each projects}}
\\textbf{ {{title}} }{{#if github}} \\hfill {{github}}{{/if}}\\\\
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item {{description}}
  {{#if technologies}}\\item Technologies: {{technologies}}{{/if}}
\\end{itemize}

{{/each}}
{{else}}
\\section*{PROJECTS}
\\textbf{Intelligent Traffic System} \\hfill github.com/alexj/traffic-system\\\\
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Developed AI-based traffic management system using computer vision
  \\item Reduced average wait time at intersections by 25\\% in simulations
\\end{itemize}
{{/if}}

\\end{document}`
  },
  {
    id: 'template3',
    name: 'Creative',
    description: 'Distinctive design for creative professionals and designers',
    image: '/template-images/temp3.png',
    content: `\\documentclass{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{color}
\\definecolor{accent}{RGB}{70,142,212}
\\begin{document}

\\begin{center}
\\textcolor{accent}{\\Huge {{uppercase name}} }\\\\
\\vspace{0.2cm}
{{#if jobRole}}\\textit{ {{jobRole}} }\\\\{{else}}\\textit{Graphic Designer \\& Illustrator}\\\\{{/if}}
\\vspace{0.1cm}
{{email}} | {{phone}}{{#if website}} | {{website}}{{/if}}
\\end{center}

\\vspace{0.3cm}
\\begin{center}
\\textcolor{accent}{\\rule{0.8\\textwidth}{1pt}}
\\end{center}
\\vspace{0.3cm}

{{#if summary}}
\\section*{\\textcolor{accent}{PROFILE}}
{{summary}}
{{else}}
\\section*{\\textcolor{accent}{PROFILE}}
Creative and detail-oriented graphic designer with 5+ years of experience creating visual concepts that communicate ideas that inspire, inform, and captivate consumers. Proficient in Adobe Creative Suite with a strong portfolio of branding, illustration, and UI/UX design work.
{{/if}}

{{#if experiences}}
\\section*{\\textcolor{accent}{EXPERIENCE}}
{{#each experiences}}
\\textbf{ {{role}} } {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{company}}
\\begin{itemize}[leftmargin=*]
  \\item {{description}}
\\end{itemize}

{{/each}}
{{else}}
\\section*{\\textcolor{accent}{EXPERIENCE}}
\\textbf{Senior Graphic Designer} \\hfill 2021 - Present\\\\
Creative Minds Agency
\\begin{itemize}[leftmargin=*]
  \\item Led rebranding projects for 3 major clients, increasing their brand recognition by 40\\%
  \\item Designed marketing materials for print and digital campaigns
  \\item Collaborated with marketing team to develop cohesive visual strategies
\\end{itemize}

\\textbf{Graphic Designer} \\hfill 2018 - 2021\\\\
Design Solutions Inc.
\\begin{itemize}[leftmargin=*]
  \\item Created illustrations and graphics for websites and mobile applications
  \\item Designed logos and brand identity packages for startups and small businesses
  \\item Produced print materials including brochures, business cards, and posters
\\end{itemize}
{{/if}}

{{#if educations}}
\\section*{\\textcolor{accent}{EDUCATION}}
{{#each educations}}
\\textbf{ {{degree}} } {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{institution}}

{{/each}}
{{else}}
\\section*{\\textcolor{accent}{EDUCATION}}
\\textbf{Bachelor of Fine Arts in Graphic Design} \\hfill 2014 - 2018\\\\
Art Institute of Design
{{/if}}

{{#if skills}}
\\section*{\\textcolor{accent}{SKILLS}}
\\textbf{Skills:} {{join skills ", "}}\\\\
{{else}}
\\section*{\\textcolor{accent}{SKILLS}}
\\textbf{Design:} Typography, Color Theory, Layout Design, Brand Identity, Illustration\\\\
\\textbf{Software:} Adobe Photoshop, Illustrator, InDesign, XD, Figma, Sketch\\\\
\\textbf{Other:} HTML/CSS, UI/UX Design, Photography, Drawing
{{/if}}

{{#if projects}}
\\section*{\\textcolor{accent}{PROJECTS}}
{{#each projects}}
\\textbf{ {{title}} }{{#if technologies}} \\hfill \\textit{ {{technologies}} }{{/if}}\\\\
\\begin{itemize}[leftmargin=*]
  \\item {{description}}
\\end{itemize}

{{/each}}
{{/if}}

\\end{document}`
  },
  {
    id: 'template4',
    name: 'Technical',
    description: 'Optimized for technical roles with focus on skills and projects',
    image: '/template-images/temp4.png',
    content: `\\documentclass{article}
\\usepackage[margin=0.7in]{geometry}
\\usepackage{enumitem}
\\begin{document}

\\begin{center}
\\textbf{\\LARGE {{uppercase name}} }\\\\
\\vspace{0.1cm}
{{email}} | {{phone}}{{#if github}} | {{github}}{{/if}}{{#if linkedin}} | {{linkedin}}{{/if}}
\\end{center}

{{#if summary}}
\\section*{SUMMARY}
{{summary}}
{{else}}
\\section*{SUMMARY}
Software engineer with expertise in full-stack development, distributed systems, and cloud architecture. Passionate about building scalable applications and solving complex technical challenges.
{{/if}}

{{#if skills}}
\\section*{TECHNICAL SKILLS}
\\begin{itemize}[noitemsep]
  \\item \\textbf{Skills:} {{join skills ", "}}
\\end{itemize}
{{else}}
\\section*{TECHNICAL SKILLS}
\\begin{itemize}[noitemsep]
  \\item \\textbf{Languages:} Java, Python, JavaScript, TypeScript, Go, SQL, Rust
  \\item \\textbf{Frameworks:} Spring Boot, React, Angular, Express.js, Django, Flask
  \\item \\textbf{Cloud:} AWS (EC2, S3, Lambda, DynamoDB), Google Cloud, Azure
  \\item \\textbf{DevOps:} Docker, Kubernetes, Jenkins, GitHub Actions, Terraform
  \\item \\textbf{Databases:} PostgreSQL, MongoDB, Redis, Elasticsearch, Cassandra
\\end{itemize}
{{/if}}

{{#if experiences}}
\\section*{PROFESSIONAL EXPERIENCE}
{{#each experiences}}
\\textbf{ {{role}} } {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{company}}
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item {{description}}
\\end{itemize}

{{/each}}
{{else}}
\\section*{PROFESSIONAL EXPERIENCE}
\\textbf{Senior Software Engineer} \\hfill 2021 - Present\\\\
Tech Solutions Inc.
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Architected and implemented microservices-based e-commerce platform handling 10K+ transactions/hour
  \\item Reduced API response time by 60\\% through caching and query optimization
  \\item Led migration from monolith to microservices architecture
  \\item Implemented CI/CD pipeline with automated testing, reducing deployment time from days to hours
\\end{itemize}

\\textbf{Software Engineer} \\hfill 2018 - 2021\\\\
Innovate Systems
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Developed RESTful APIs and backend services for financial data processing
  \\item Implemented real-time data processing pipeline using Kafka and Spark
  \\item Optimized database queries, improving performance by 40\\%
\\end{itemize}
{{/if}}

{{#if projects}}
\\section*{PROJECTS}
{{#each projects}}
\\textbf{ {{title}} }{{#if github}} \\hfill {{github}}{{/if}}\\\\
\\begin{itemize}[noitemsep]
  \\item {{description}}
  {{#if technologies}}\\item Technologies: {{technologies}}{{/if}}
\\end{itemize}

{{/each}}
{{else}}
\\section*{PROJECTS}
\\textbf{Distributed Task Scheduler} \\hfill github.com/mchen/taskscheduler\\\\
\\begin{itemize}[noitemsep]
  \\item Built a distributed task scheduling system using Go and Redis
  \\item Implemented fault tolerance and load balancing features
\\end{itemize}

\\textbf{Real-time Analytics Dashboard} \\hfill github.com/mchen/analytics\\\\
\\begin{itemize}[noitemsep]
  \\item Created a real-time analytics dashboard using React, Node.js, and Socket.IO
  \\item Visualized data streams with D3.js and implemented filtering capabilities
\\end{itemize}
{{/if}}

{{#if educations}}
\\section*{EDUCATION}
{{#each educations}}
\\textbf{ {{degree}} } {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{institution}}{{#if grade}} \\hfill GPA: {{grade}}{{/if}}

{{/each}}
{{else}}
\\section*{EDUCATION}
\\textbf{Master of Science in Computer Science} \\hfill 2016 - 2018\\\\
Tech University \\hfill GPA: 3.95/4.0

\\textbf{Bachelor of Science in Computer Engineering} \\hfill 2012 - 2016\\\\
State University \\hfill GPA: 3.8/4.0
{{/if}}

\\end{document}`
  },
  {
    id: 'template5',
    name: 'Minimal',
    description: 'Clean, minimalist design with focus on content and readability',
    image: '/template-images/temp5.png',
    content: `\\documentclass{article}
\\usepackage[margin=0.9in]{geometry}
\\usepackage{enumitem}
\\begin{document}

\\begin{center}
\\textbf{\\Large {{uppercase name}} }\\\\
\\vspace{0.1cm}
{{email}} | {{phone}}
\\end{center}

{{#if summary}}
\\section*{Summary}
{{summary}}
{{/if}}

{{#if experiences}}
\\section*{Experience}
{{#each experiences}}
\\textbf{ {{role}} } {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{company}}
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item {{description}}
\\end{itemize}

{{/each}}
{{else}}
\\section*{Experience}
\\textbf{Marketing Manager} \\hfill 2020 - Present\\\\
Global Brands Inc.
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Developed and executed marketing strategies across digital and traditional channels
  \\item Managed a team of 5 marketing specialists and a budget of \\$500K
  \\item Increased customer engagement by 35\\% through targeted campaigns
\\end{itemize}

\\textbf{Marketing Specialist} \\hfill 2017 - 2020\\\\
Marketing Solutions Co.
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Created content for social media platforms and email campaigns
  \\item Analyzed marketing metrics and prepared monthly performance reports
  \\item Assisted in planning and executing product launch events
\\end{itemize}
{{/if}}

{{#if educations}}
\\section*{Education}
{{#each educations}}
\\textbf{ {{degree}} } {{#if startDate}}\\hfill {{formatDate startDate}} - {{formatDate endDate}}{{/if}}\\\\
{{institution}}

{{/each}}
{{else}}
\\section*{Education}
\\textbf{Master of Business Administration} \\hfill 2015 - 2017\\\\
Business University

\\textbf{Bachelor of Arts in Marketing} \\hfill 2011 - 2015\\\\
State University
{{/if}}

{{#if skills}}
\\section*{Skills}
\\begin{itemize}[noitemsep]
  \\item {{join skills ", "}}
\\end{itemize}
{{else}}
\\section*{Skills}
\\begin{itemize}[noitemsep]
  \\item Digital Marketing: SEO, SEM, Social Media Marketing, Email Marketing
  \\item Analytics: Google Analytics, HubSpot, Tableau, Excel
  \\item Content Creation: Copywriting, Graphic Design (Adobe Creative Suite)
  \\item Project Management: Asana, Trello, MS Project
\\end{itemize}
{{/if}}

{{#if projects}}
\\section*{Projects}
{{#each projects}}
\\textbf{ {{title}} }{{#if technologies}} \\hfill \\textit{ {{technologies}} }{{/if}}\\\\
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item {{description}}
\\end{itemize}

{{/each}}
{{/if}}

{{#if languages}}
\\section*{Languages}
{{join languages ", "}}
{{else}}
\\section*{Languages}
English (Native), Spanish (Fluent), French (Intermediate)
{{/if}}

\\end{document}`
  }
];

const ResumeTemplates = ({ onTemplateSelect }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('personalized'); // 'personalized' or 'default'
  
  // Optimization hooks
  const { processedTemplates, isProcessing } = useBackgroundTemplateProcessing(TEMPLATES, resumeInfo);
  const { visibleTemplates, observe, unobserve } = useIntersectionObserver();
  
  // Memory management - clear cache when resumeInfo changes
  useEffect(() => {
    return () => {
      // Cleanup cache when component unmounts or resumeInfo changes significantly
      if (resumeInfo) {
        // Only clear cache if we have too many entries
        if (templateCache.cache.size > 30) {
          templateCache.clear();
        }
      }
    };
  }, [resumeInfo]);

  // Function to process template for default view by removing Handlebars and using fallback content
  const processDefaultTemplate = (templateContent) => {
    let processedContent = templateContent;
    
    // Replace basic placeholders with default values
    processedContent = processedContent
      .replace(/\{\{name\}\}/g, 'John Doe')
      .replace(/\{\{email\}\}/g, 'john.doe@email.com')
      .replace(/\{\{phone\}\}/g, '+1 (555) 123-4567')
      .replace(/\{\{uppercase name\}\}/g, 'JOHN DOE')
      .replace(/\{\{linkedin\}\}/g, 'linkedin.com/in/johndoe')
      .replace(/\{\{github\}\}/g, 'github.com/johndoe')
      .replace(/\{\{website\}\}/g, 'johndoe.com')
      .replace(/\{\{jobRole\}\}/g, 'Software Developer');
    
    // Handle conditional sections with {{else}} blocks - keep only the else content
    const conditionalSections = [
      { pattern: /\{\{#if\s+educations\}\}[\s\S]*?\{\{\/each\}\}[\s\S]*?\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g },
      { pattern: /\{\{#if\s+experiences\}\}[\s\S]*?\{\{\/each\}\}[\s\S]*?\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g },
      { pattern: /\{\{#if\s+skills\}\}[\s\S]*?\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g },
      { pattern: /\{\{#if\s+languages\}\}[\s\S]*?\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g },
    ];
    
    conditionalSections.forEach(({ pattern }) => {
      processedContent = processedContent.replace(pattern, '$1');
    });
    
    // Handle conditional sections without {{else}} blocks - remove them entirely
    const conditionalWithoutElse = [
      /\{\{#if\s+summary\}\}[\s\S]*?\{\{\/if\}\}/g,
      /\{\{#if\s+projects\}\}[\s\S]*?\{\{\/if\}\}/g,
      /\{\{#if\s+linkedin\}\}[\s\S]*?\{\{\/if\}\}/g,
      /\{\{#if\s+github\}\}[\s\S]*?\{\{\/if\}\}/g,
      /\{\{#if\s+website\}\}[\s\S]*?\{\{\/if\}\}/g,
    ];
    
    conditionalWithoutElse.forEach(pattern => {
      processedContent = processedContent.replace(pattern, '');
    });
    
    // Remove any remaining handlebars syntax
    processedContent = processedContent.replace(/\{\{[^}]*\}\}/g, '');
    
    // Fix LaTeX syntax issues
    // Remove empty lines that might cause "There's no line here to end" errors
    processedContent = processedContent.replace(/\\\\\s*$/gm, ''); // Remove trailing \\
    processedContent = processedContent.replace(/\\\\\s*\n\s*\\\\/g, '\\\\'); // Remove double \\
    
    // Ensure proper spacing around sections
    processedContent = processedContent.replace(/\\section\*/g, '\n\\section*');
    processedContent = processedContent.replace(/\\subsection\*/g, '\n\\subsection*');
    
    // Clean up multiple consecutive newlines
    processedContent = processedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remove leading/trailing whitespace from lines
    processedContent = processedContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '') // Remove completely empty lines
      .join('\n');
    
    // Add proper spacing between sections
    processedContent = processedContent.replace(/\n(\\section)/g, '\n\n$1');
    processedContent = processedContent.replace(/\n(\\subsection)/g, '\n\n$1');
    
    // Ensure document ends properly
    if (!processedContent.trim().endsWith('\\end{document}')) {
      processedContent = processedContent.trim() + '\n\n\\end{document}';
    }
    
    return processedContent;
  };

  // Fetch user's resume info on component mount
  useEffect(() => {
    const fetchResumeInfo = async () => {
      try {
        const info = await getResumeInfo(token);
        setResumeInfo(info);
      } catch (error) {
        console.log('No resume info found, using default template');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchResumeInfo();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleUseTemplate = async (template) => {
    try {
      let dynamicContent;
      
      if (resumeInfo && viewMode === 'personalized') {
        
        if (processedTemplates[template.id]) {
          
          dynamicContent = processedTemplates[template.id];
        } else {
          
          dynamicContent = processTemplateOptimized(template.id, template.content, resumeInfo);
        }
      } else if (viewMode === 'default') {
        dynamicContent = processDefaultTemplate(template.content);
      } else {
        dynamicContent = template.content;
      }

      // Create a new resume with the selected template
      const newResume = await createResume({
        title: `My ${template.name} Resume`,
        content: dynamicContent
      }, token);
      
      // Navigate to the editor with the new resume ID
      if (newResume && newResume.id) {
        navigate(`/editor/${newResume.id}`);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      // You could add error handling UI here
    }
  };

  if (loading) {
    return (
    <div className="resume-templates min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resume information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-templates min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
               style={{ background: 'var(--primary-gradient)' }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-6"
              style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Choose Your Perfect Resume Template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select from our professionally designed templates to create a standout resume that matches your style and industry
          </p>
          
          {/* Background Processing Status */}
          {isProcessing && resumeInfo && viewMode === 'personalized' && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg inline-block">
              <div className="flex items-center text-blue-700">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Personalizing templates with your resume data...
              </div>
            </div>
          )}

          {/* Template View Mode Toggle */}
          {resumeInfo && (
            <div className="mt-6 flex flex-col items-center space-y-4">
              <div className="flex items-center bg-white rounded-xl p-1 shadow-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('personalized')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    viewMode === 'personalized' ? 'text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={viewMode === 'personalized' ? { background: 'var(--primary-gradient)' } : {}}
                >
                  Personalized Templates
                </button>
                <button
                  onClick={() => setViewMode('default')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    viewMode === 'default' ? 'text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={viewMode === 'default' ? { background: 'var(--primary-gradient)' } : {}}
                >
                  Default Templates
                </button>
              </div>
              
              {/* Status indicator */}
              <div className={`p-3 rounded-lg inline-block ${
                viewMode === 'personalized' 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-blue-100 border border-blue-300'
              }`}>
                <div className={`flex items-center ${
                  viewMode === 'personalized' ? 'text-green-700' : 'text-blue-700'
                }`}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    {viewMode === 'personalized' ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    )}
                  </svg>
                  {viewMode === 'personalized' 
                    ? 'Templates will be personalized with your resume information'
                    : 'Templates will show default placeholder content'
                  }
                </div>
              </div>
            </div>
          )}

          {/* Show message for users without resume info */}
          {!resumeInfo && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg inline-block">
              <div className="flex items-center text-yellow-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Templates will use default content. Save your resume info first for personalization.
              </div>
            </div>
          )}

          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              ATS Optimized
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full mr-2" style={{ background: 'var(--primary-color)' }}></div>
              Professional Design
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full mr-2" style={{ background: 'var(--secondary-color)' }}></div>
              {resumeInfo && viewMode === 'personalized' ? 'Personalized Content' : 'Easy Customization'}
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {TEMPLATES.map((template, index) => (
            <SmartTemplateCard
              key={template.id}
              template={template}
              index={index}
              resumeInfo={resumeInfo}
              viewMode={viewMode}
              processedTemplates={processedTemplates}
              isProcessing={isProcessing}
              visibleTemplates={visibleTemplates}
              observe={observe}
              onTemplateSelect={handleUseTemplate}
            />
          ))}
        </div>

        {/* Enhanced Bottom Section */}
   
      </div>
    </div>
  );
};

export default ResumeTemplates;