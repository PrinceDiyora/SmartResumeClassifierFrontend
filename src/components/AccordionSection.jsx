import React from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, AlertTriangle, Repeat, Hash } from 'lucide-react';

const AccordionSection = ({ section, isExpanded, toggleSection }) => {
  // Helper function to determine the icon based on issue type
  const getIssueIcon = (suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('spelling') || lowerSuggestion.includes('typo') || lowerSuggestion.includes('mistake')) {
      return <AlertTriangle size={16} className="mr-2 text-red-500 mt-1 flex-shrink-0" />;
    } else if (lowerSuggestion.includes('repeat') || lowerSuggestion.includes('frequently')) {
      return <Repeat size={16} className="mr-2 text-amber-500 mt-1 flex-shrink-0" />;
    } else if (lowerSuggestion.includes('quantif') || lowerSuggestion.includes('achievement') || lowerSuggestion.includes('number')) {
      return <Hash size={16} className="mr-2 text-blue-500 mt-1 flex-shrink-0" />;
    } else {
      return <AlertCircle size={16} className="mr-2 text-amber-500 mt-1 flex-shrink-0" />;
    }
  };

  // Helper function to get improvement hint based on issue type
  const getImprovementHint = (suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('spelling') || lowerSuggestion.includes('typo') || lowerSuggestion.includes('mistake')) {
      return "Fix spelling errors to maintain professionalism and avoid being filtered out by ATS.";
    } else if (lowerSuggestion.includes('repeat') || lowerSuggestion.includes('frequently')) {
      return "Use synonyms to avoid repetition and demonstrate a diverse vocabulary.";
    } else if (lowerSuggestion.includes('quantif') || lowerSuggestion.includes('achievement') || lowerSuggestion.includes('number')) {
      return "Add specific numbers and metrics to quantify your achievements and make them more impactful.";
    } else {
      return "Consider addressing this issue to improve your ATS score.";
    }
  };

  // Helper function to get background color based on issue type
  const getIssueBackground = (suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('spelling') || lowerSuggestion.includes('typo') || lowerSuggestion.includes('mistake')) {
      return "bg-red-50";
    } else if (lowerSuggestion.includes('repeat') || lowerSuggestion.includes('frequently')) {
      return "bg-amber-50";
    } else if (lowerSuggestion.includes('quantif') || lowerSuggestion.includes('achievement') || lowerSuggestion.includes('number')) {
      return "bg-blue-50";
    } else {
      return "bg-amber-50";
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden mb-4 border border-gray-200 shadow-sm">
      {/* Section header with toggle */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleSection(section.id)}
      >
        <div className="flex items-center">
          {section.icon}
          <h3 className="font-medium">{section.title}</h3>
          {section.suggestions && section.suggestions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
              {section.suggestions.length} {section.suggestions.length === 1 ? 'issue' : 'issues'}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {/* Collapsible content */}
      {isExpanded && (
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4">{section.description}</p>
          
          {section.suggestions && section.suggestions.length > 0 ? (
            <div>
              <h4 className="font-medium text-gray-700 text-sm mb-2">Issues Found:</h4>
              <ul className="space-y-3">
                {section.suggestions.map((suggestion, index) => {
                  const issueIcon = getIssueIcon(suggestion);
                  const improvementHint = getImprovementHint(suggestion);
                  const bgColor = getIssueBackground(suggestion);
                  
                  return (
                    <li key={index} className={`flex items-start ${bgColor} p-3 rounded-md`}>
                      {issueIcon}
                      <div>
                        <p className="text-gray-700 text-sm">{suggestion}</p>
                        <p className="text-xs text-gray-500 mt-1">Improvement hint: {improvementHint}</p>
                        
                        {/* Example section for quantifiable achievements */}
                        {suggestion.toLowerCase().includes('quantif') && (
                          <div className="mt-2 border-t border-gray-200 pt-2">
                            <p className="text-xs font-medium text-gray-700">Examples that quantify impact:</p>
                            <div className="mt-1 text-xs">
                              <p className="text-green-600 mb-1">✓ Achieved 40% product revenue growth in three months by planning and launching four new key features.</p>
                              <p className="text-green-600 mb-1">✓ Improved state test pass rates from 78% to 87% in two years.</p>
                              <p className="text-red-600">✗ Created a conducive learning environment.</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Example section for word repetition */}
                        {suggestion.toLowerCase().includes('repeat') && (
                          <div className="mt-2 border-t border-gray-200 pt-2">
                            <p className="text-xs font-medium text-gray-700">Try replacing with:</p>
                            <div className="mt-1 text-xs grid grid-cols-2 gap-1">
                              <p className="text-blue-600">facilitated</p>
                              <p className="text-blue-600">permitted</p>
                              <p className="text-blue-600">executed</p>
                              <p className="text-blue-600">applied</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="flex items-center text-emerald-500 bg-emerald-50 p-3 rounded-md">
              <CheckCircle size={16} className="mr-2" />
              <span className="text-sm">No issues found in this section</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;