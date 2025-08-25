import React from 'react';
import { CheckCircle, AlertCircle, BookOpen, Briefcase, GraduationCap, FileText } from 'lucide-react';

const Scoreboard = ({ result, totalIssues }) => {
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

  return (
    <div className="space-y-6">
      {/* Your Score section */}
      <div className="bg-white rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Your Score</h3>
        <div className="flex flex-col items-center justify-center mb-4">
          <div className={`relative w-36 h-36 rounded-full flex items-center justify-center ${getColorClass(result.overall_score)}`}>
            <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold">{result.overall_score}/100</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Issues found */}
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-gray-500">
            <span className="font-semibold">{totalIssues}</span> issues
          </p>
        </div>
        
        {/* Category progress bars */}
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{category.name.toUpperCase()}</span>
                <span className="text-xs font-medium">{Math.round(category.score)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressBarColor(category.score)}`} 
                  style={{ width: `${category.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;