import React, { useState, useEffect } from 'react';
import { sendOtpApi, verifyOtpApi } from '../services/api';
import { GraduationCap, Mail, KeyRound, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Shield, Clock, CheckCircle, ShieldCheck, Sun, Moon } from 'lucide-react';

const LoginPage = ({ onLoginSuccess }) => {
  const [roleMode, setRoleMode] = useState('student'); // 'student' | 'admin'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [devOtpCode, setDevOtpCode] = useState(null);

  // Cooldown ticker
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('skillnexis-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skillnexis-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setDevOtpCode(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await sendOtpApi(email, roleMode);
      setSuccessMsg(data.message || 'OTP sent successfully to your email.');
      if (data.devOtp) {
        setDevOtpCode(data.devOtp);
      }
      setStep(2);
      setCooldown(data.cooldownSeconds || 60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp || otp.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtpApi(email, otp);

      // Strict role enforcement check
      if (roleMode === 'admin' && data.user?.role !== 'admin') {
        setError('Access Denied: This account does not have administrator privileges. Please switch to Student Login.');
        setLoading(false);
        return;
      }

      if (roleMode === 'student' && data.user?.role === 'admin') {
        setError('Administrator Account Detected: Please switch to the Admin Portal tab to log in.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Login successful. Welcome!');
      setTimeout(() => {
        onLoginSuccess(data.user, data.token);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const data = await sendOtpApi(email, roleMode);
      setSuccessMsg('A new OTP has been sent to your email.');
      if (data.devOtp) {
        setDevOtpCode(data.devOtp);
      }
      setCooldown(data.cooldownSeconds || 60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Animated Gradient Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="login-card" style={{ position: 'relative' }}>
        {/* Top-Right Theme Toggle (Sun/Moon) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg-subtle)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Water-Ripple Role Switcher */}
        <div className="role-switch-wrapper">
          <div className="role-switch-container">
            <div className={`role-switch-pill ${roleMode}`} />
            <button
              type="button"
              className={`role-switch-btn ${roleMode === 'student' ? 'active' : ''}`}
              onClick={() => {
                setRoleMode('student');
                setError('');
                setSuccessMsg('');
              }}
            >
              <GraduationCap size={16} />
              Student Login
            </button>
            <button
              type="button"
              className={`role-switch-btn ${roleMode === 'admin' ? 'active' : ''}`}
              onClick={() => {
                setRoleMode('admin');
                setError('');
                setSuccessMsg('');
              }}
            >
              <ShieldCheck size={16} />
              Admin Portal
            </button>
          </div>
        </div>

        <div className="login-header" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div className={`logo-badge ${roleMode === 'admin' ? 'admin-theme' : ''}`} style={{ width: '60px', height: '60px', margin: '0 auto 1rem auto' }}>
            {roleMode === 'admin' ? <ShieldCheck size={32} /> : <GraduationCap size={32} />}
          </div>
          <h1 className="login-title" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            {roleMode === 'admin' ? 'Galgotias Admin Portal' : 'Galgotias Student Portal'}
          </h1>
          <p className="login-subtitle" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
            {roleMode === 'admin'
              ? 'Institutional Grievance Governance System'
              : 'Official Student Grievance Portal'}
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="emailInput" style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.45rem', display: 'block' }}>
                {roleMode === 'admin' ? 'Administrator Email' : 'Institutional Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail 
                  size={20} 
                  color="#94a3b8" 
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                />
                <input
                  id="emailInput"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder={roleMode === 'admin' ? 'admin@galgotiacollege.edu' : 'student.id@galgotiacollege.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${roleMode === 'admin' ? 'admin-btn' : ''}`}
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Sending Verification OTP...
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '14px', marginBottom: '1.35rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Sent to: <strong style={{ color: 'var(--text-main)' }}>{email}</strong>
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Change
              </button>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="otpInput">
                Enter 6-Digit OTP Code
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound 
                  size={20} 
                  color="#94a3b8" 
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                />
                <input
                  id="otpInput"
                  type="text"
                  maxLength={6}
                  className="form-input otp-input"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${roleMode === 'admin' ? 'admin-btn' : ''}`}
              style={{ width: '100%', marginTop: '0.85rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Verifying OTP...
                </>
              ) : (
                'Verify OTP & Login'
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || loading}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {devOtpCode && (
          <div className="dev-otp-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
              <Sparkles size={16} color="#d48806" />
              Demo Verification Code Active:
            </div>
            <div>
              Use Code: <strong style={{ fontSize: '1.15rem', letterSpacing: '3px', color: '#0f172a', background: '#ffffff', padding: '3px 10px', borderRadius: '6px', border: '1px solid #ffe58f' }}>{devOtpCode}</strong>
            </div>
            <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>
              (Logged on server terminal. Configure EMAIL_PASS in .env for live SMTP delivery).
            </span>
          </div>
        )}

        {/* Feature Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Shield size={14} color="#3b82f6" /> Encrypted Auth
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={14} color="#6366f1" /> Fast OTP Delivery
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle size={14} color="#10b981" /> Official Portal
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
