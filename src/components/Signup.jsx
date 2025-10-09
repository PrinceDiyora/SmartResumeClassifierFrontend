import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup as signupApi } from '../api/auth';
import { Eye, EyeOff, Mail, Lock, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
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
    setSuccess(false);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const result = await signupApi({ email, password, confirmpassword: confirmPassword });
      if (result.userId) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Signup failed. Please try again.');
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
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>Create Account</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Join ResumeCraft and build your future</p>
            </div>

            {success && (
              <div style={{ background: 'rgba(72, 187, 120, 0.12)', color: '#2f855a', padding: 12, borderRadius: 10, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Check size={16} />
                <div>
                  <p style={{ fontWeight: 600 }}>Account created successfully!</p>
                  <p style={{ marginTop: 4 }}>Redirecting you to login...</p>
                </div>
              </div>
            )}

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
                    <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" disabled={loading || success} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={inputWrapperStyle}>
                    <div style={leftIconStyle}><Lock size={18} /></div>
                    <input type={showPassword ? 'text' : 'password'} style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" disabled={loading || success} />
                    <button type="button" style={rightButtonStyle} onClick={togglePasswordVisibility} disabled={loading || success}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>Password must be at least 8 characters long</p>
                </div>

                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={inputWrapperStyle}>
                    <div style={leftIconStyle}><Lock size={18} /></div>
                    <input type={showConfirmPassword ? 'text' : 'password'} style={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" disabled={loading || success} />
                    <button type="button" style={rightButtonStyle} onClick={toggleConfirmPasswordVisibility} disabled={loading || success}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading || success} className="btn btn-primary btn-large no-sheen" style={{ width: '100%', justifyContent: 'center', marginTop: 20, opacity: (loading || success) ? 0.9 : 1, cursor: (loading || success) ? 'not-allowed' : 'pointer' }}>
                {loading ? (
                  <>Creating account...</>
                ) : success ? (
                  <>
                    <Check size={18} />
                    Account Created
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <p style={{ fontSize: 14, textAlign: 'center', color: 'var(--text-muted)', marginTop: 24 }}>
              Already have an account?{' '}
              <Link to="/login" className="feature-link" style={{ marginTop: 0 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;