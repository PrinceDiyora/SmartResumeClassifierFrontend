import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeBuilderPage from './components/ResumeBuilderPage';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import RolePredictor from './components/RolePredictor';
import ResumeForm from './components/ResumeForm';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/analyzer" element={<ResumeAnalyzer />} />
          <Route path="/role-predictor" element={<RolePredictor />} />
          
          {/* Protected routes */}
          <Route 
            path="/resume-builder" 
            element={
              <ProtectedRoute>
                <ResumeBuilderPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/builder" 
            element={
              <ProtectedRoute>
                <Navigate to="/resume-builder" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editor/:id" 
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resume-form" 
            element={
              <ProtectedRoute>
                <ResumeForm />
              </ProtectedRoute>
            } 
          />
          </Routes>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}