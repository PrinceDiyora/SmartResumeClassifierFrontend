import React, { useState } from 'react';
import { CheckCircle, AlertCircle, BookOpen, Briefcase, GraduationCap, FileText, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import Scoreboard from './Scoreboard';
import SectionScores from './SectionScores';
import SummaryCard from './SummaryCard';
import AccordionSection from './AccordionSection';

const ATSScoreDisplay = ({ result }) => {
  // State for collapsible categories and accordion sections
  const [expandedCategories, setExpandedCategories] = useState({
    content: true,
    sections: true,
    atsEssentials: true,
    tailoring: true
  });
  
  const [expandedSections, setExpandedSections] = useState({
    parseRate: true,
    skills: true,
    workExperience: true,
    education: true,
    formatting: true
  });

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper function to determine color based on score
  const getColorClass = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50';
    if (score >= 60) return 'text-blue-500 bg-blue-50';
    if (score >= 40) return 'text-yellow-500 bg-yellow-50';
    return 'text-red-500 bg-red-50';
  };

  // Helper function to get progress bar color based on score
  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Helper function to get icon for each section
  const getSectionIcon = (section) => {
    switch (section) {
      case 'summary_or_objective':
        return <BookOpen size={18} className="mr-2" />;
      case 'experience':
        return <Briefcase size={18} className="mr-2" />;
      case 'skills':
        return <CheckCircle size={18} className="mr-2" />;
      case 'education':
        return <GraduationCap size={18} className="mr-2" />;
      case 'formatting_and_clarity':
        return <FileText size={18} className="mr-2" />;
      default:
        return null;
    }
  };

  // Format section name for display
  const formatSectionName = (section) => {
    return section
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Group suggestions by section
  const groupedSuggestions = {};
  let totalIssues = 0;
  
  if (result?.improvement_suggestions) {
    // Initialize groups
    groupedSuggestions.Skills = [];
    groupedSuggestions['Work Experience'] = [];
    groupedSuggestions.Education = [];
    groupedSuggestions.Formatting = [];
    
    // Simple keyword-based grouping
    result.improvement_suggestions.forEach(suggestion => {
      totalIssues++;
      const lowerSuggestion = suggestion.toLowerCase();
      if (lowerSuggestion.includes('skill') || lowerSuggestion.includes('technology') || lowerSuggestion.includes('proficiency')) {
        groupedSuggestions.Skills.push(suggestion);
      } else if (lowerSuggestion.includes('experience') || lowerSuggestion.includes('job') || lowerSuggestion.includes('work')) {
        groupedSuggestions['Work Experience'].push(suggestion);
      } else if (lowerSuggestion.includes('education') || lowerSuggestion.includes('degree') || lowerSuggestion.includes('university')) {
        groupedSuggestions.Education.push(suggestion);
      } else {
        groupedSuggestions.Formatting.push(suggestion);
      }
    });
  }

  // Define category data
  const categories = [
    {
      id: 'content',
      name: 'Content',
      score: result?.section_scores?.summary_or_objective || 0,
      items: [
        { name: 'Clear summary', status: (result?.section_scores?.summary_or_objective || 0) > 70 },
        { name: 'Relevant keywords', status: (result?.section_scores?.summary_or_objective || 0) > 60 },
        { name: 'Professional tone', status: (result?.section_scores?.summary_or_objective || 0) > 80 }
      ]
    },
    {
      id: 'sections',
      name: 'Sections',
      score: (result?.section_scores?.experience || 0 + result?.section_scores?.education || 0) / 2,
      items: [
        { name: 'Work experience', status: (result?.section_scores?.experience || 0) > 70 },
        { name: 'Education details', status: (result?.section_scores?.education || 0) > 70 },
        { name: 'Skills section', status: (result?.section_scores?.skills || 0) > 70 }
      ]
    },
    {
      id: 'atsEssentials',
      name: 'ATS Essentials',
      score: result?.section_scores?.formatting_and_clarity || 0,
      items: [
        { name: 'Simple formatting', status: (result?.section_scores?.formatting_and_clarity || 0) > 70 },
        { name: 'Standard headings', status: (result?.section_scores?.formatting_and_clarity || 0) > 60 },
        { name: 'No tables/images', status: (result?.section_scores?.formatting_and_clarity || 0) > 80 }
      ]
    },
    {
      id: 'tailoring',
      name: 'Tailoring',
      score: (result?.section_scores?.skills || 0 + result?.section_scores?.experience || 0) / 2,
      items: [
        { name: 'Job-specific keywords', status: (result?.section_scores?.skills || 0) > 70 },
        { name: 'Relevant achievements', status: (result?.section_scores?.experience || 0) > 70 },
        { name: 'Targeted skills', status: (result?.section_scores?.skills || 0) > 80 }
      ]
    }
  ];

  // Define section data for the right panel
  const sections = [
    {
      id: 'parseRate',
      title: 'ATS Parse Rate',
      icon: <FileText size={20} className="mr-2" />,
      description: 'How well ATS systems can extract information from your resume',
      suggestions: groupedSuggestions.Formatting.filter(s => s.toLowerCase().includes('parse') || s.toLowerCase().includes('format'))
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: <CheckCircle size={20} className="mr-2" />,
      description: 'Technical and soft skills relevant to the job you re applying for',
      suggestions: groupedSuggestions.Skills
    },
    {
      id: 'workExperience',
      title: 'Work Experience',
      icon: <Briefcase size={20} className="mr-2" />,
      description: 'Your professional history and achievements',
      suggestions: groupedSuggestions['Work Experience']
    },
    {
      id: 'education',
      title: 'Education',
      icon: <GraduationCap size={20} className="mr-2" />,
      description: 'Academic qualifications and certifications',
      suggestions: groupedSuggestions.Education
    },
    {
      id: 'formatting',
      title: 'Formatting & Clarity',
      icon: <FileText size={20} className="mr-2" />,
      description: 'Overall document structure and readability',
      suggestions: groupedSuggestions.Formatting.filter(s => !s.toLowerCase().includes('parse'))
    }
  ];

  return (
    <div className="w-full bg-gray-50 rounded-lg">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">ATS Analysis Results</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
            New Upload
          </button>
        </div>
        
        {/* Main content container - responsive layout with sticky left panel */}
        <div className="flex flex-col lg:flex-row gap-6 relative">
          
          {/* Left column - 40% width on large screens with sticky positioning */}
          <div className="w-full lg:w-2/5 space-y-4 sticky top-4 h-[calc(100vh-4rem)] overflow-y-auto pb-4">
            {/* Scoreboard Component */}
            <Scoreboard result={result} totalIssues={totalIssues} />
            
            {/* Section Scores Component */}
            <SectionScores sectionScores={result.section_scores} />
          </div>
          
          {/* Right content panel - 60% width on large screens with scrollable content */}
          <div className="w-full lg:w-3/5 h-[calc(100vh-4rem)] overflow-y-auto pb-4">
            {/* Summary Card Component */}
            <SummaryCard summary={result.analysis_summary} />
            
            {/* Accordion Sections */}
            <div>
              {sections.map(section => (
                <AccordionSection 
                  key={section.id}
                  section={section}
                  isExpanded={expandedSections[section.id]}
                  toggleSection={toggleSection}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreDisplay;