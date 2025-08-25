import React from 'react';

const SummaryCard = ({ summary }) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-3">Resume Summary</h3>
      <div className="p-4 bg-gray-50 rounded-md">
        <p className="text-gray-700 text-sm">{summary}</p>
      </div>
    </div>
  );
};

export default SummaryCard;