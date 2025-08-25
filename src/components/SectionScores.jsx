import React from 'react';
import { BookOpen, Briefcase, CheckCircle, GraduationCap, FileText } from 'lucide-react';

const SectionScores = ({ sectionScores }) => {
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

  return (
    <div className="bg-white rounded-lg p-6">
      <h4 className="text-lg font-semibold mb-4">Section Scores</h4>
      <div className="space-y-3">
        {sectionScores && Object.entries(sectionScores).map(([section, score]) => (
          <div key={section} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {getSectionIcon(section)}
                <span className="text-sm">{formatSectionName(section)}</span>
              </div>
              <span className="text-xs font-medium">{score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressBarColor(score)}`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionScores;