import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Homepage.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await loginApi({ email, password });
      if (result.token) {
        // Use the login function from AuthContext
        login(result.token, email);
        navigate('/resume-builder');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: 'var(--border-radius-xl)',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--border-color)',
    padding: 32,
  };

  const labelStyle = { fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 };
  const inputWrapperStyle = { position: 'relative' };
  const leftIconStyle = { position: 'absolute', inset: '0 auto 0 0', display: 'flex', alignItems: 'center', paddingLeft: 12, color: 'var(--text-muted)', pointerEvents: 'none' };
  const rightButtonStyle = { position: 'absolute', inset: '0 0 0 auto', display: 'flex', alignItems: 'center', paddingRight: 12, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' };
  const inputStyle = {
    width: '100%',
    padding: '12px 44px 12px 40px',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    outline: 'none',
    background: '#fff',
    color: 'var(--text-primary)'
  };

  return (
    <div className="homepage">
      {/* Scoped style to disable sheen effect on buttons for this page */}
      <style>{`.no-sheen.btn::before{ display:none !important; }`}</style>

      <div className="container" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, boxShadow: 'var(--shadow-md)', marginBottom: 12 }}>RC</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>Welcome Back</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Sign in to your ResumeCraft account</p>
            </div>

            {error && (
              <div style={{ background: 'rgba(245, 101, 101, 0.1)', color: '#c53030', padding: 12, borderRadius: 10, fontSize: 14, display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputWrapperStyle}>
                    <div style={leftIconStyle}><Mail size={18} /></div>
                    <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={labelStyle}>Password</label>
                    <Link to="/forgot-password" className="nav-link" style={{ padding: 0 }}>Forgot password?</Link>
                  </div>
                  <div style={inputWrapperStyle}>
                    <div style={leftIconStyle}><Lock size={18} /></div>
                    <input type={showPassword ? 'text' : 'password'} style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                    <button type="button" style={rightButtonStyle} onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-large no-sheen" style={{ width: '100%', justifyContent: 'center', marginTop: 20, opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? (
                  <>Signing in...</>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <p style={{ fontSize: 14, textAlign: 'center', color: 'var(--text-muted)', marginTop: 24 }}>
              Don't have an account?{' '}
              <Link to="/signup" className="feature-link" style={{ marginTop: 0 }}>Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;