import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserResumes, deleteResume } from '../api/resume';
import { useAuth } from '../context/AuthContext';
import { FileText, Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Fetch user's resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const data = await getUserResumes(token);
        console.log('API Response:', data);
        
        // The getUserResumes function now always returns an array
        setResumes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setResumes([]);
        setError('Failed to load your resumes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();

  }, [token]);
  
  // Handle edit resume
  const handleEdit = (id) => {
    navigate(`/editor/${id}`);
  };

  // Handle delete resume
  const handleDelete = async (id) => {
    try {
      await deleteResume(id, token);
      // Update the resumes list after deletion
      setResumes(resumes.filter(resume => resume.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError('Failed to delete resume. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading your resumes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
        <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Error</p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="your-resumes mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Resumes</h2>
      
      {!Array.isArray(resumes) || resumes.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No resumes yet</h3>
          <p className="text-gray-500 mb-4">Choose a template above to create your first resume</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(resumes) && resumes.map((resume) => (
            <div 
              key={resume.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all hover:shadow-lg"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{resume.title}</h3>
                    <p className="text-sm text-gray-500">Last updated: {formatDate(resume.updatedAt)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(resume.id)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Edit resume"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(resume.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete resume"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Delete confirmation */}
              {deleteConfirm === resume.id && (
                <div className="p-4 bg-red-50 border-t border-red-100">
                  <p className="text-sm text-red-700 mb-3">Are you sure you want to delete this resume?</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeList;