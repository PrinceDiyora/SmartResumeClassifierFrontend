import React from 'react';
import { useAuth } from '../context/AuthContext';
import { createResume } from '../api/resume';
import { useNavigate } from 'react-router-dom';

const TEMPLATES = [
  {
    id: 'template1',
    name: 'Professional',
    description: 'Clean and professional template suitable for most industries',
    image: '/template-images/temp1.png',
    content: `\\documentclass{article}
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
\\textbf{\\Large ALEX JOHNSON}\\\\
\\vspace{0.1cm}
alex.johnson@email.com | (555) 123-4567 | linkedin.com/in/alexjohnson | github.com/alexj
\\end{center}
\\vspace{0.2cm}
\\hrule
\\vspace{0.2cm}

\\section*{EDUCATION}
\\textbf{Master of Science in Computer Engineering} \\hfill 2020 - 2022\\\\
University of Technology \\hfill GPA: 3.9/4.0\\\\
\\textit{Thesis: Advanced Neural Networks for Image Recognition}

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

\\section*{TECHNICAL SKILLS}
\\textbf{Languages:} JavaScript, TypeScript, Python, Java, C++\\\\
\\textbf{Frameworks:} React, Angular, Node.js, Express, Django\\\\
\\textbf{Tools:} Git, Docker, Kubernetes, Jenkins, AWS, Azure

\\section*{PROJECTS}
\\textbf{Intelligent Traffic System} \\hfill github.com/alexj/traffic-system\\\\
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Developed AI-based traffic management system using computer vision
  \\item Reduced average wait time at intersections by 25\\% in simulations
\\end{itemize}

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
\\textcolor{accent}{\\Huge SARAH PARKER}\\\\
\\vspace{0.2cm}
\\textit{Graphic Designer \\& Illustrator}\\\\
\\vspace{0.1cm}
sarah.parker@email.com | (555) 987-6543 | sarahparkerdesign.com
\\end{center}

\\vspace{0.3cm}
\\begin{center}
\\textcolor{accent}{\\rule{0.8\\textwidth}{1pt}}
\\end{center}
\\vspace{0.3cm}

\\section*{\\textcolor{accent}{PROFILE}}
Creative and detail-oriented graphic designer with 5+ years of experience creating visual concepts that communicate ideas that inspire, inform, and captivate consumers. Proficient in Adobe Creative Suite with a strong portfolio of branding, illustration, and UI/UX design work.

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

\\section*{\\textcolor{accent}{EDUCATION}}
\\textbf{Bachelor of Fine Arts in Graphic Design} \\hfill 2014 - 2018\\\\
Art Institute of Design

\\section*{\\textcolor{accent}{SKILLS}}
\\textbf{Design:} Typography, Color Theory, Layout Design, Brand Identity, Illustration\\\\
\\textbf{Software:} Adobe Photoshop, Illustrator, InDesign, XD, Figma, Sketch\\\\
\\textbf{Other:} HTML/CSS, UI/UX Design, Photography, Drawing

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
\\textbf{\\LARGE MICHAEL CHEN}\\\\
\\vspace{0.1cm}
michael.chen@email.com | (555) 234-5678 | github.com/mchen | linkedin.com/in/michaelchen
\\end{center}

\\section*{SUMMARY}
Software engineer with expertise in full-stack development, distributed systems, and cloud architecture. Passionate about building scalable applications and solving complex technical challenges.

\\section*{TECHNICAL SKILLS}
\\begin{itemize}[noitemsep]
  \\item \\textbf{Languages:} Java, Python, JavaScript, TypeScript, Go, SQL, Rust
  \\item \\textbf{Frameworks:} Spring Boot, React, Angular, Express.js, Django, Flask
  \\item \\textbf{Cloud:} AWS (EC2, S3, Lambda, DynamoDB), Google Cloud, Azure
  \\item \\textbf{DevOps:} Docker, Kubernetes, Jenkins, GitHub Actions, Terraform
  \\item \\textbf{Databases:} PostgreSQL, MongoDB, Redis, Elasticsearch, Cassandra
\\end{itemize}

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

\\section*{EDUCATION}
\\textbf{Master of Science in Computer Science} \\hfill 2016 - 2018\\\\
Tech University \\hfill GPA: 3.95/4.0

\\textbf{Bachelor of Science in Computer Engineering} \\hfill 2012 - 2016\\\\
State University \\hfill GPA: 3.8/4.0

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
\\textbf{\\Large EMMA WILSON}\\\\
\\vspace{0.1cm}
emma.wilson@email.com | (555) 876-5432
\\end{center}

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

\\section*{Education}
\\textbf{Master of Business Administration} \\hfill 2015 - 2017\\\\
Business University

\\textbf{Bachelor of Arts in Marketing} \\hfill 2011 - 2015\\\\
State University

\\section*{Skills}
\\begin{itemize}[noitemsep]
  \\item Digital Marketing: SEO, SEM, Social Media Marketing, Email Marketing
  \\item Analytics: Google Analytics, HubSpot, Tableau, Excel
  \\item Content Creation: Copywriting, Graphic Design (Adobe Creative Suite)
  \\item Project Management: Asana, Trello, MS Project
\\end{itemize}

\\section*{Languages}
English (Native), Spanish (Fluent), French (Intermediate)

\\end{document}`
  }
];

const ResumeTemplates = ({ onTemplateSelect }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

   const handleUseTemplate = async (template) => {
    try {
      // Create a new resume with the selected template
      const newResume = await createResume({
        title: `My ${template.name} Resume`,
        content: template.content
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

  return (
    <div className="resume-templates min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Choose Your Perfect Resume Template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select from our professionally designed templates to create a standout resume that matches your style and industry
          </p>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              ATS Optimized
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Professional Design
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Easy Customization
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {TEMPLATES.map((template, index) => (
            <div 
              key={template.id} 
              className="template-card group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-105 cursor-pointer h-[620px] flex flex-col relative"
            >
              {/* Enhanced Template Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex-shrink-0">
                <div className="w-full h-80 flex items-center justify-center p-4">
                  <img 
                    src={template.image} 
                    alt={`${template.name} Template`} 
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  />
                </div>
                
                {/* Enhanced Template Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border border-white/20">
                    Template {index + 1}
                  </span>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
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
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {template.name}
                    </h3>
                    <div className="ml-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                    {template.description}
                  </p>
                </div>
                
                {/* Simple Action Button */}
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full py-3 px-6 bg-blue-600 text-white text-sm font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-300"
                >
                  Use This Template
                </button>
              </div>
              
              {/* Decorative Corner Element */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-br-3xl"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom Section */}
   
      </div>
    </div>
  );
};

export default ResumeTemplates;