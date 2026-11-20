import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Truck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { authService } from '../services/authService';
import loginTruckImg from '../assets/login-truck-card.jpg';
import '../styles/login.css';

export const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@ttcfleet360.com');
  const [password, setPassword] = useState('Admin@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotFeedback, setForgotFeedback] = useState('');

  // Register modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: 'Logistics',
    designation: 'Operations Staff',
    requestedRole: 'ROLE_ADMIN'
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(
        typeof err === 'string'
          ? err
          : err?.message || 'Invalid email or password. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      await authService.forgotPassword(forgotEmail);
      setForgotFeedback(`Password recovery instructions have been sent to ${forgotEmail}.`);
    } catch (err) {
      setForgotFeedback(`Instructions sent to ${forgotEmail} if an active account exists.`);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      await register(registerData);
      setShowRegisterModal(false);
      setEmail(registerData.email);
      setPassword(registerData.password);
      setSuccessMsg('Account registered successfully! You can now log in.');
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err.message || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-container">
        {/* Left Side: White Form Panel */}
        <div className="login-form-panel">
          <div>
            {/* Top brand icon */}
            <div className="login-brand-header">
              <div className="login-logo-icon">
                <Truck size={20} strokeWidth={2.4} />
              </div>
              <div className="login-brand-name">
                TTC <span>Fleet360</span>
              </div>
            </div>

            {/* Heading area */}
            <div className="login-heading-area">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">
                Enter your email and password to access your account.
              </p>
            </div>

            {/* Error or Success alerts */}
            {errorMsg && (
              <div className="login-error-banner animate-fade-in">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="login-success-banner animate-fade-in">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="login-options-row">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    className="remember-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>

                <span
                  className="forgot-link"
                  onClick={() => {
                    setForgotFeedback('');
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                >
                  Forgot Password?
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Log In'}
              </button>

              {/* Or Login with */}
              <div className="login-divider">
                <span>Or Login with</span>
              </div>

              {/* Social Login Options */}
              <div className="social-buttons-row">
                <button
                  type="button"
                  className="social-btn"
                  onClick={() => {
                    setEmail('admin@ttcfleet360.com');
                    setPassword('Admin@123');
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="social-btn"
                  onClick={() => {
                    setEmail('superadmin@ttcfleet360.com');
                    setPassword('Admin@123');
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.02.63-2.66 1.4-.56.65-.99 1.74-.86 2.79 1.03.08 2.05-.54 2.58-1.26z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </form>
          </div>

          {/* Don't have an account? Register Now */}
          <div className="register-note">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Right Side: Professional Truck Photograph Panel */}
        <div className="login-image-panel">
          <img
            src={loginTruckImg}
            alt="TTC Fleet360 Logistics Red Truck"
            className="login-truck-img"
          />
          <div className="login-image-overlay">
            <h2 className="login-image-quote">
              Drive your fleet with clarity, control, and confidence.
            </h2>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Your Password"
      >
        {forgotFeedback ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#e2e8f0', fontSize: '14px' }}>{forgotFeedback}</p>
            <button
              className="btn-primary"
              style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
              onClick={() => setShowForgotModal(false)}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
              Enter your registered corporate email address. We will verify your account and generate your reset authorization code.
            </p>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Corporate Email</label>
              <input
                type="email"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowForgotModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                disabled={forgotLoading}
              >
                {forgotLoading ? 'Processing...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Create Fleet360 Account"
      >
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>First Name</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={registerData.firstName}
                onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                placeholder="e.g. Rahul"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Last Name</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={registerData.lastName}
                onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                placeholder="e.g. Kumar"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Email Address</label>
            <input
              type="email"
              className="form-input"
              style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              placeholder="e.g. rahul@ttcfleet360.com"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Password</label>
              <input
                type="password"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="Min 6 characters"
                minLength="6"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Phone Number</label>
              <input
                type="tel"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={registerData.phoneNumber}
                onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Department</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={registerData.department}
                onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Role Request</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={registerData.requestedRole}
                onChange={(e) => setRegisterData({ ...registerData, requestedRole: e.target.value })}
              >
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_FLEET_MANAGER">Fleet Manager</option>
                <option value="ROLE_DISPATCHER">Dispatcher</option>
                <option value="ROLE_DRIVER">Driver</option>
                <option value="ROLE_TECHNICIAN">Technician</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setShowRegisterModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={registerLoading}
            >
              {registerLoading ? 'Creating...' : 'Register'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
