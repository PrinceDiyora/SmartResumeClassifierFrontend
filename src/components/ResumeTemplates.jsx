import React from 'react';
import { useAuth } from '../context/AuthContext';
import { createResume } from '../api/resume';
import { useNavigate } from 'react-router-dom';

const TEMPLATES = [
  {
    id: 'template1',
    name: 'Professional',
    description: 'Clean and professional template suitable for most industries',
    image: 'https://placehold.co/300x400/e2e8f0/1e293b?text=Professional+Template',
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
    image: 'https://placehold.co/300x400/e2e8f0/1e293b?text=Modern+Template',
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
    image: 'https://placehold.co/300x400/e2e8f0/1e293b?text=Creative+Template',
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
    image: 'https://placehold.co/300x400/e2e8f0/1e293b?text=Technical+Template',
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
    image: 'https://placehold.co/300x400/e2e8f0/1e293b?text=Minimal+Template',
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
    <div className="resume-templates">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resume Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {TEMPLATES.map((template) => (
          <div 
            key={template.id} 
            className="template-card bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all hover:shadow-lg"
          >
            <div className="aspect-w-3 aspect-h-4 bg-gray-100">
              <img 
                src={template.image} 
                alt={`${template.name} Template`} 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">{template.description}</p>
              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplates;