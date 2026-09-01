import React, { useState, useEffect } from 'react';
import { sendOtpApi, verifyOtpApi } from '../services/api';
import { GraduationCap, Mail, KeyRound, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Shield, Clock, CheckCircle } from 'lucide-react';

const LoginPage = ({ onLoginSuccess }) => {
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
      const data = await sendOtpApi(email);
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
      const data = await sendOtpApi(email);
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

      <div className="login-card">
        {/* Step dots */}
        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : 'inactive'}`}></div>
          <div className={`step-dot ${step === 2 ? 'active' : 'inactive'}`}></div>
        </div>

        <div className="login-header">
          <div className="logo-badge">
            <GraduationCap size={36} />
          </div>
          <h1 className="login-title">Student Grievance Portal</h1>
          <p className="login-subtitle">Raise your concern. Track the resolution in real-time.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label" htmlFor="emailInput">
                Email Address
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
                  placeholder="xyz@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.85rem' }}
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
            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '14px', marginBottom: '1.35rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 500 }}>
                Sent to: <strong style={{ color: '#0f172a' }}>{email}</strong>
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
              className="btn btn-primary"
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
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
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
