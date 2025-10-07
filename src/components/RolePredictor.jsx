import React, { useState } from 'react';
import { predictRole } from '../api/analyze';

export default function RolePredictor() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (selected) => {
    const selectedFile = selected?.[0] || selected;
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
      setResult(null);
    } else {
      setFile(null);
      setFileName('');
      setResult(null);
      setError('Please select a valid PDF file');
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a PDF resume');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await predictRole(file);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to predict role');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName('');
    setError(null);
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">Predict Resume Role</span>
        </h1>
        <p className="text-gray-600">Upload your PDF resume to predict the most likely role</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
              id="role-upload"
            />
            <label htmlFor="role-upload" className="cursor-pointer flex flex-col items-center">
              <span className="text-lg font-medium mb-1">Upload your resume</span>
              <span className="text-sm text-gray-500 mb-4">PDF files only</span>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => document.getElementById('role-upload').click()}
              >
                Select File
              </button>
            </label>
          </div>

          {fileName && (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
              <div className="flex items-center">
                <span className="text-sm font-medium">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center bg-red-50 p-3 rounded-md text-red-700">
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!file || loading}
              className={`inline-flex items-center justify-center px-8 py-3 font-medium rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-90 hover:-translate-y-0.5 transition-all ${loading || !file ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Predicting…' : 'Predict Role'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Prediction</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm">Predicted Role</div>
              <div className="text-xl font-semibold">{result.role || '—'}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-sm">Confidence</div>
              <div className="text-xl font-semibold">{result.confidence != null ? `${Math.round(result.confidence * 100)}%` : '—'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


