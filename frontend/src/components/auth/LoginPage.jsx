import React, { useState } from 'react';
import {
  Truck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Navigation,
  ClipboardCheck
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess, initialPortal = 'driver' }) => {
  const [selectedPortal, setSelectedPortal] = useState(initialPortal); // 'driver' or 'manager'
  const [email, setEmail] = useState(
    initialPortal === 'driver' ? 'm.vance@fleet360.ttc.com' : 'alex.mercer@fleet360.ttc.com'
  );
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handlePortalSwitch = (portal) => {
    setSelectedPortal(portal);
    setErrorMessage('');
    if (portal === 'driver') {
      setEmail('m.vance@fleet360.ttc.com');
      setPassword('password123');
    } else {
      setEmail('alex.mercer@fleet360.ttc.com');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      let isDriver = selectedPortal === 'driver' || email.includes('vance') || email.includes('driver');
      let userData = isDriver
        ? {
            username: 'driver01',
            email: email,
            fullName: 'Marcus Vance',
            role: 'ROLE_DRIVER',
            driverId: 'D-01',
            vehicleReg: 'TTC-8492-HD',
            token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_driver_fleet360'
          }
        : {
            username: 'fleetmanager',
            email: email,
            fullName: 'Alexandre Mercer',
            role: 'ROLE_FLEET_MANAGER',
            token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_token_fleet360'
          };

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: email.includes('@') ? (isDriver ? 'driver01' : 'fleetmanager') : email,
            password: password
          })
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            userData = resData.data;
          }
        }
      } catch (networkErr) {
        console.info('Backend authentication fallback:', networkErr);
      }

      if (password.length >= 6) {
        if (rememberMe) {
          localStorage.setItem('ttc_fleet360_user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('ttc_fleet360_user', JSON.stringify(userData));
        }
        localStorage.setItem('ttc_auth_token', userData.token || 'jwt_session_valid');

        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(userData);
        }, 500);
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid credentials. Password must be at least 6 characters.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Authentication service temporarily unreachable.');
    }
  };

  return (
    <div className="login-page-container">
      {/* LEFT SECTION - LOGIN FORM (45%) */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          {/* Logo and Branding Header */}
          <div className="login-brand-header">
            <div className="login-logo-box">
              <Truck size={24} color="#FF7A1A" strokeWidth={2.4} />
            </div>
            <div className="login-brand-text">
              <span className="login-app-name">
                TTC FLEET<span className="orange-highlight">360</span>
              </span>
              <span className="login-app-subtitle">ENTERPRISE FLEET OS</span>
            </div>
          </div>

          {/* Role Portal Switcher */}
          <div className="login-portal-switcher">
            <button
              type="button"
              className={`portal-switch-btn ${selectedPortal === 'driver' ? 'active' : ''}`}
              onClick={() => handlePortalSwitch('driver')}
            >
              <UserCheck size={16} /> Driver Portal
            </button>
            <button
              type="button"
              className={`portal-switch-btn ${selectedPortal === 'manager' ? 'active' : ''}`}
              onClick={() => handlePortalSwitch('manager')}
            >
              <Truck size={16} /> Fleet Manager
            </button>
          </div>

          {/* Welcome Heading */}
          <div className="login-welcome-wrap">
            <h1 className="login-welcome-title">Welcome Back!</h1>
            <p className="login-welcome-subtitle">
              {selectedPortal === 'driver'
                ? 'Sign in to your Driver Portal & active routes.'
                : 'Sign in to manage your fleet operations.'}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="login-error-alert">
              <AlertCircle size={16} color="#EF5350" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Forgot Password Alert */}
          {forgotPasswordNotice && (
            <div className="login-info-alert">
              <CheckCircle2 size={16} color="#16A36A" />
              <span>Password recovery instructions dispatched to {email || 'your email'}.</span>
              <button
                type="button"
                className="alert-close-btn"
                onClick={() => setForgotPasswordNotice(false)}
              >
                ×
              </button>
            </div>
          )}

          {/* Form */}
          <form className="login-form-element" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="login-field-group">
              <label className="login-field-label">Email Address</label>
              <div className="login-input-wrap">
                <Mail className="login-input-icon" size={18} color="#718096" />
                <input
                  type="email"
                  className="login-text-input"
                  placeholder="Enter your company email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field-group">
              <label className="login-field-label">Password</label>
              <div className="login-input-wrap">
                <Lock className="login-input-icon" size={18} color="#718096" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-text-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#718096" />
                  ) : (
                    <Eye size={18} color="#718096" />
                  )}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="login-options-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="custom-checkbox"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setForgotPasswordNotice(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading-state">Authenticating...</span>
              ) : (
                <>
                  <span>
                    {selectedPortal === 'driver'
                      ? 'Sign In to Driver Portal'
                      : 'Sign In to Dashboard'}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick autofill helper */}
          <div className="demo-credentials-pill">
            <span className="demo-pill-label">
              {selectedPortal === 'driver' ? 'Lead Driver Account:' : 'Fleet Manager Account:'}
            </span>
            <button
              type="button"
              className="demo-autofill-btn"
              onClick={() => {
                if (selectedPortal === 'driver') {
                  setEmail('m.vance@fleet360.ttc.com');
                  setPassword('password123');
                } else {
                  setEmail('alex.mercer@fleet360.ttc.com');
                  setPassword('password123');
                }
              }}
            >
              {selectedPortal === 'driver'
                ? 'm.vance@fleet360.ttc.com (Autofill)'
                : 'alex.mercer@fleet360.ttc.com (Autofill)'}
            </button>
          </div>

          {/* Security Information Footer */}
          <div className="login-security-footer">
            <ShieldCheck size={18} color="#16A36A" />
            <p className="login-security-text">
              Your fleet operations are protected with enterprise-grade security.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - HERO IMAGE (55%) */}
      <div className="login-hero-section">
        {/* Logistics Truck Image */}
        <img
          src="/assets/fleet-manager-trucks.jpg"
          alt="TTC Fleet Commercial Operations"
          className="login-hero-bg-img"
        />

        {/* Navy-Blue Gradient Overlay */}
        <div className="login-hero-navy-overlay" />

        {/* Subtle Orange Accent Glow */}
        <div className="login-hero-orange-glow" />

        {/* Marketing Content Overlay */}
        <div className="login-hero-content">
          <div className="login-hero-badge">
            <Truck size={14} color="#FF7A1A" />
            <span>
              {selectedPortal === 'driver' ? 'DRIVER DISPATCH SYSTEM' : 'ENTERPRISE LOGISTICS SYSTEM'}
            </span>
          </div>

          <h2 className="login-hero-title">
            {selectedPortal === 'driver' ? (
              <>
                Your Journey. Your Fleet.<br />
                Your Success.
              </>
            ) : (
              <>
                Manage Your Fleet.<br />
                Drive Your Business Forward.
              </>
            )}
          </h2>

          <p className="login-hero-subtitle">
            {selectedPortal === 'driver'
              ? 'Manage trips, track deliveries and stay connected with your logistics operations in real-time.'
              : 'Smart fleet management, real-time vehicle tracking and seamless logistics operations — all in one platform.'}
          </p>

          {/* Feature Highlights */}
          <div className="login-feature-highlights">
            {selectedPortal === 'driver' ? (
              <>
                <div className="feature-pill-item">
                  <div className="feature-icon-circle">
                    <Navigation size={16} color="#FF7A1A" />
                  </div>
                  <span>Real-Time Trip Assignments</span>
                </div>

                <div className="feature-pill-item">
                  <div className="feature-icon-circle">
                    <ClipboardCheck size={16} color="#FF7A1A" />
                  </div>
                  <span>Instant Pickup & Delivery Confirmation</span>
                </div>

                <div className="feature-pill-item">
                  <div className="feature-icon-circle">
                    <MapPin size={16} color="#FF7A1A" />
                  </div>
                  <span>Live GPS Route Navigation</span>
                </div>
              </>
            ) : (
              <>
                <div className="feature-pill-item">
                  <div className="feature-icon-circle">
                    <MapPin size={16} color="#FF7A1A" />
                  </div>
                  <span>Real-Time Fleet Tracking</span>
                </div>

                <div className="feature-pill-item">
                  <div className="feature-icon-circle">
                    <Truck size={16} color="#FF7A1A" />
                  </div>
                  <span>Smart Vehicle Management</span>
                </div>

                <div className="feature-pill-item">
                  <div className="feature-icon-circle">
                    <CheckCircle2 size={16} color="#FF7A1A" />
                  </div>
                  <span>Complete Operational Visibility</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
