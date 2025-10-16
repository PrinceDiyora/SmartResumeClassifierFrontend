import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { requestPasswordReset } from '../api/auth';
import './Homepage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await requestPasswordReset(email);
      setMessage(res.message || 'If the email exists, an OTP has been sent');
      // proceed to reset page carrying email
      setTimeout(() => navigate('/reset-password', { state: { email } }), 800);
    } catch (err) {
      setError('Failed to request reset. Please try again.');
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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Forgot password</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Enter your account email to receive an OTP.</p>

            {message && (
              <div style={{ background: 'rgba(72,187,120,0.12)', color: '#2f855a', padding: 12, borderRadius: 10, fontSize: 14, marginBottom: 12 }}>{message}</div>
            )}
            {error && (
              <div style={{ background: 'rgba(245, 101, 101, 0.1)', color: '#c53030', padding: 12, borderRadius: 10, fontSize: 14, marginBottom: 12 }}>{error}</div>
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
              </div>

              <button type="submit" disabled={loading || !email} className="btn btn-primary btn-large" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
                {loading ? 'Sending...' : (<><ArrowRight size={18} /> Send OTP</>)}
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

export default ForgotPassword;


