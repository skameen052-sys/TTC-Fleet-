import React, { useState } from 'react';
import {
  Truck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  MapPin,
  Layers,
  BarChart3
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess, initialPortal = 'manager' }) => {
  const [selectedPortal, setSelectedPortal] = useState(initialPortal);
  const [email, setEmail] = useState(
    initialPortal === 'driver' ? 'm.vance@fleet360.ttc.com' : 'alex.mercer@fleet360.ttc.com'
  );
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const isDriver = selectedPortal === 'driver';

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
      let driverUser = selectedPortal === 'driver' || email.includes('vance') || email.includes('driver');
      let userData = driverUser
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
            email: email || 'alex.mercer@fleet360.ttc.com',
            fullName: 'Alexandre Mercer',
            role: 'ROLE_FLEET_MANAGER',
            token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_token_fleet360'
          };

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: email.includes('@') ? (driverUser ? 'driver01' : 'fleetmanager') : email,
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
        }, 400);
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
    <div className={`login-page-container ${isDriver ? 'theme-driver-light' : 'theme-manager-dark'}`}>
      {/* ===================================================================
          LEFT SECTION - LOGIN FORM (38% Viewport width)
          =================================================================== */}
      <div className={`login-form-section ${isDriver ? 'form-light' : 'form-dark'}`}>
        {/* Ambient bottom-left glow wave for dark theme */}
        {!isDriver && <div className="dark-theme-wave-glow" />}

        <div className="login-form-inner">
          {/* Logo and Branding Header */}
          <div className="login-brand-header">
            <div className={`login-logo-box ${isDriver ? 'logo-box-light' : 'logo-box-dark'}`}>
              <Truck size={22} color={isDriver ? '#FF7A1A' : '#FFFFFF'} strokeWidth={2.4} />
            </div>
            <div className="login-brand-text">
              <span className={`login-app-name ${isDriver ? 'text-navy' : 'text-white'}`}>
                TTC FLEET<span className="orange-highlight">360</span>
              </span>
              <span className={`login-app-subtitle ${isDriver ? 'sub-blue' : 'sub-light-blue'}`}>
                ENTERPRISE FLEET OS
              </span>
            </div>
          </div>

          {/* Role Portal Switcher Pills */}
          <div className={`portal-switcher-pill-box ${isDriver ? 'box-light' : 'box-dark'}`}>
            <button
              type="button"
              className={`portal-pill-btn ${!isDriver ? 'active-manager' : 'inactive-manager'}`}
              onClick={() => handlePortalSwitch('manager')}
            >
              <Truck size={14} />
              <span>Fleet Manager</span>
            </button>
            <button
              type="button"
              className={`portal-pill-btn ${isDriver ? 'active-driver' : 'inactive-driver'}`}
              onClick={() => handlePortalSwitch('driver')}
            >
              <UserCheck size={14} />
              <span>Driver Portal</span>
            </button>
          </div>

          {/* Welcome Heading */}
          <div className="login-welcome-wrap">
            <h1 className={`login-welcome-title ${isDriver ? 'text-navy' : 'text-white'}`}>
              Welcome Back!
            </h1>
            {/* Orange Underline Accent Bar */}
            <div className="orange-title-underline" />
            <p className={`login-welcome-subtitle ${isDriver ? 'sub-light' : 'sub-dark'}`}>
              {isDriver
                ? 'Sign in to access your Driver Portal & route dispatch.'
                : 'Sign in to manage vehicles, drivers and fleet operations.'}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="login-error-alert">
              <AlertCircle size={15} color="#EF5350" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Forgot Password Alert */}
          {forgotPasswordNotice && (
            <div className="login-info-alert">
              <CheckCircle2 size={15} color="#16A36A" />
              <span>Recovery instructions sent to {email || 'your email'}.</span>
              <button
                type="button"
                className="alert-close-btn"
                onClick={() => setForgotPasswordNotice(false)}
              >
                ×
              </button>
            </div>
          )}

          {/* Login Form */}
          <form className="login-form-element" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="login-field-group">
              <label className={`login-field-label ${isDriver ? 'label-light' : 'label-dark'}`}>
                Email Address
              </label>
              <div className={`login-input-wrap ${isDriver ? 'wrap-light' : 'wrap-dark'}`}>
                <Mail className="login-input-icon" size={16} color={isDriver ? '#718096' : '#94A3B8'} />
                <input
                  type="email"
                  className={`login-text-input ${isDriver ? 'input-light' : 'input-dark'}`}
                  placeholder={isDriver ? 'Enter driver email' : 'alex.mercer@fleet360.ttc.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field-group">
              <label className={`login-field-label ${isDriver ? 'label-light' : 'label-dark'}`}>
                Password
              </label>
              <div className={`login-input-wrap ${isDriver ? 'wrap-light' : 'wrap-dark'}`}>
                <Lock className="login-input-icon" size={16} color={isDriver ? '#718096' : '#94A3B8'} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`login-text-input ${isDriver ? 'input-light' : 'input-dark'}`}
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
                    <EyeOff size={16} color={isDriver ? '#718096' : '#94A3B8'} />
                  ) : (
                    <Eye size={16} color={isDriver ? '#718096' : '#94A3B8'} />
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
                <span className={isDriver ? 'text-sub-light' : 'text-sub-dark'}>Remember Me</span>
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
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>{isDriver ? 'Sign In to Driver Portal' : 'Sign In to Dashboard'}</span>
                  <ArrowRight size={17} strokeWidth={2.4} />
                </>
              )}
            </button>
          </form>

          {/* Quick autofill helper */}
          <div className="demo-credentials-pill" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11.5px' }}>
            <span style={{ color: isDriver ? '#718096' : '#94A3B8' }}>
              {isDriver ? 'Driver Account:' : 'Fleet Manager:'}
            </span>
            <button
              type="button"
              className="demo-autofill-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FF7A1A',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => {
                if (isDriver) {
                  setEmail('m.vance@fleet360.ttc.com');
                  setPassword('password123');
                } else {
                  setEmail('alex.mercer@fleet360.ttc.com');
                  setPassword('password123');
                }
              }}
            >
              {isDriver
                ? 'm.vance@fleet360.ttc.com (Autofill)'
                : 'alex.mercer@fleet360.ttc.com (Autofill)'}
            </button>
          </div>

          {/* Security Information Footer Card */}
          <div className={`login-security-card ${isDriver ? 'sec-light' : 'sec-dark'}`}>
            <div className={`sec-icon-circle ${isDriver ? 'icon-circle-green' : 'icon-circle-orange'}`}>
              <ShieldCheck size={18} color={isDriver ? '#16A36A' : '#FF7A1A'} />
            </div>
            <div className="sec-text-box">
              <div className={`sec-title ${isDriver ? 'title-light' : 'title-dark'}`}>
                Secure Login
              </div>
              <div className={`sec-desc ${isDriver ? 'desc-light' : 'desc-dark'}`}>
                Your fleet operations are protected with enterprise-grade security.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          RIGHT SECTION - ULTRA 4K HERO IMAGE (62% Viewport width)
          Screenshot 3 (Driver 4K) vs Screenshot 4 / Image 2 (Fleet Manager 4K)
          =================================================================== */}
      <div className="login-hero-section">
        {isDriver ? (
          <img
            key="driver-hero-4k-img"
            src="/assets/driver-hero-4k.jpg"
            alt="TTC Fleet360 Driver Dispatch System 4K"
            className="login-hero-img-display fade-in"
          />
        ) : (
          <div className="manager-hero-container fade-in">
            <img
              src="/assets/manager-hero-4k.jpg"
              alt="TTC Fleet360 Enterprise Fleet Manager 4K"
              className="login-hero-img-display"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="manager-hero-gradient-overlay" />

            {/* Crisp 4K Text & Pills matching Screenshot 4 */}
            <div className="manager-hero-content">
              <div className="manager-hero-titles">
                <h2 className="manager-hero-h2">
                  Manage Your Fleet.<br />
                  <span className="orange-highlight-text">Drive Greater Efficiency.</span>
                </h2>
                <p className="manager-hero-p">
                  Monitor vehicles, optimize routes, track deliveries and ensure seamless fleet operations — all in one place.
                </p>
              </div>

              {/* 3 Crisp Vector Feature Pills from Screenshot 4 */}
              <div className="manager-hero-pills-row">
                <div className="manager-feature-pill">
                  <div className="pill-icon-circle">
                    <MapPin size={15} color="#FF7A1A" />
                  </div>
                  <span>Real-Time Fleet Visibility</span>
                </div>

                <div className="manager-feature-pill">
                  <div className="pill-icon-circle">
                    <Layers size={15} color="#FF7A1A" />
                  </div>
                  <span>Driver & Trip Management</span>
                </div>

                <div className="manager-feature-pill">
                  <div className="pill-icon-circle">
                    <BarChart3 size={15} color="#FF7A1A" />
                  </div>
                  <span>Operational Insights & Reports</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
