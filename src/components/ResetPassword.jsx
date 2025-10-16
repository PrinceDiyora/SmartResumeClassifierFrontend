import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Hash, CheckCircle } from 'lucide-react';
import { resetPasswordWithOtp } from '../api/auth';
import './Homepage.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const presetEmail = location.state?.email || '';

  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPasswordWithOtp({ email, otp, newPassword: password });
      if (res.message?.toLowerCase().includes('success')) {
        setSuccess('Password reset successful. You can sign in now.');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setError(res.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
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
  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    outline: 'none',
    background: '#fff',
    color: 'var(--text-primary)'
  };

  return (
    <div className="homepage">
      <div className="container" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <div style={cardStyle}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Reset password</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Enter the OTP you received and your new password.</p>

            {success && (
              <div style={{ background: 'rgba(72,187,120,0.12)', color: '#2f855a', padding: 12, borderRadius: 10, fontSize: 14, marginBottom: 12, display:'flex', gap:8, alignItems:'center' }}><CheckCircle size={16} /> {success}</div>
            )}
            {error && (
              <div style={{ background: 'rgba(245, 101, 101, 0.1)', color: '#c53030', padding: 12, borderRadius: 10, fontSize: 14, marginBottom: 12 }}>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputWrapperStyle}>
                    <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" readOnly="true"/>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>OTP Code</label>
                  <div style={inputWrapperStyle}>
                    <div style={leftIconStyle}><Hash size={18} /></div>
                    <input type="text" style={inputStyle} value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="6-digit code" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <div style={inputWrapperStyle}>
                    <div style={leftIconStyle}><Lock size={18} /></div>
                    <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <div style={inputWrapperStyle}>
                    <div style={leftIconStyle}><Lock size={18} /></div>
                    <input type="password" style={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-large" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
                {loading ? 'Resetting...' : 'Reset password'}
              </button>
            </form>

            <p style={{ fontSize: 14, textAlign: 'center', color: 'var(--text-muted)', marginTop: 24 }}>
              <Link to="/login" className="feature-link">Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;