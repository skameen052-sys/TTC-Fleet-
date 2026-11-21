// frontend/src/components/auth/WarehouseLoginPage.jsx
import React, { useState } from 'react';
import {
  Warehouse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Boxes,
  Truck,
  Forklift,
  ArrowLeftRight
} from 'lucide-react';

export const WarehouseLoginPage = ({ onLoginSuccess, onSwitchPortal }) => {
  const [identifier, setIdentifier] = useState('ethan.cole@fleet360.ttc.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier || !password) {
      setErrorMessage('Please enter your company email or Employee ID and password.');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        username: 'warehouse_dir01',
        email: identifier.includes('@') ? identifier : 'ethan.cole@fleet360.ttc.com',
        fullName: 'Ethan Cole',
        role: 'ROLE_WAREHOUSE_MANAGER',
        staffId: 'WH-DIR-084',
        facilityId: 'WH-CENTRAL-01',
        token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_warehouse_fleet360'
      };

      if (password.length >= 6) {
        if (rememberMe) {
          localStorage.setItem('ttc_fleet360_user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('ttc_fleet360_user', JSON.stringify(userData));
        }
        localStorage.setItem('ttc_auth_token', userData.token);

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
      setErrorMessage('Warehouse authentication service temporarily unreachable.');
    }
  };

  return (
    <div className="login-page-container theme-driver-light">
      {/* LEFT SECTION - LOGIN FORM (38% Viewport) */}
      <div className="login-form-pane">
        <div className="login-form-inner">
          {/* Brand Logo Header */}
          <div className="login-brand-header">
            <div className="login-brand-logo-icon" style={{ background: 'linear-gradient(135deg, #FF7A1A, #E0630D)' }}>
              <Warehouse size={28} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div className="login-brand-text">
              <span className="login-brand-name">
                TTC FLEET<span className="orange-accent-text">360</span>
              </span>
              <span className="login-brand-subtitle" style={{ color: '#FF7A1A' }}>
                ENTERPRISE WAREHOUSE OS
              </span>
            </div>
          </div>

          {/* Quick Portal Switcher */}
          {onSwitchPortal && (
            <div className="portal-selector-tabs">
              <button
                type="button"
                className="portal-tab-btn active"
                style={{ backgroundColor: '#FFF0E5', color: '#FF7A1A', borderColor: '#FFD8BA' }}
              >
                <Warehouse size={15} />
                <span>Warehouse Manager</span>
              </button>
              <button
                type="button"
                className="portal-tab-btn"
                onClick={() => onSwitchPortal('driver')}
              >
                <Truck size={15} />
                <span>Driver Portal</span>
              </button>
              <button
                type="button"
                className="portal-tab-btn"
                onClick={() => onSwitchPortal('manager')}
              >
                <ShieldCheck size={15} />
                <span>Fleet Manager</span>
              </button>
            </div>
          )}

          {/* Form Headings */}
          <div className="login-heading-group">
            <h1 className="login-main-heading">Welcome Back!</h1>
            <p className="login-sub-heading">
              Sign in to manage warehouse facilities, inventory, and cross-dock operations.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="login-error-alert" role="alert">
              <AlertCircle size={18} color="#EF5350" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Forgot Password Reset Notice */}
          {forgotPasswordNotice && (
            <div className="login-success-alert">
              <CheckCircle2 size={18} color="#16A36A" />
              <span>
                Warehouse password reset link dispatched to IT Security for <b>{identifier}</b>.
              </span>
            </div>
          )}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email or Employee ID Input */}
            <div className="login-field-group">
              <label className="login-field-label">Email Address or Employee ID</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Mail size={18} color="#718096" />
                </span>
                <input
                  type="text"
                  className="login-input"
                  placeholder="e.g. ethan.cole@fleet360.ttc.com or WH-MGR-084"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Input with Show/Hide */}
            <div className="login-field-group">
              <label className="login-field-label">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <Lock size={18} color="#718096" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input password-input"
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#718096" />
                  ) : (
                    <Eye size={18} color="#718096" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Links */}
            <div className="login-options-row">
              <label className="login-remember-wrap">
                <input
                  type="checkbox"
                  className="login-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="login-remember-text">Remember Me</span>
              </label>

              <button
                type="button"
                className="login-forgot-btn"
                onClick={() => setForgotPasswordNotice(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-loading-wrap">
                  <span className="login-spinner" />
                  <span>Authenticating Warehouse OS...</span>
                </span>
              ) : (
                <>
                  <span>Sign In to Warehouse OS</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Enterprise Security Badge */}
          <div className="login-security-box">
            <div className="security-icon-circle">
              <ShieldCheck size={20} color="#16A36A" />
            </div>
            <div className="security-text-wrap">
              <span className="security-title">Secure Warehouse OS</span>
              <span className="security-desc">
                Your inventory, dock receiving, and dispatch records are protected with enterprise-grade security.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - HERO IMAGE WITH WAREHOUSE LOGISTICS DOCKS */}
      <div className="login-hero-pane">
        <div
          className="login-hero-bg-image"
          style={{ backgroundImage: `url('/assets/manager-login-4k.jpg')` }}
        />
        <div className="login-hero-gradient-overlay" />

        {/* Marketing Content */}
        <div className="login-hero-content">
          <div className="login-hero-tag">
            <Forklift size={16} color="#FF7A1A" />
            <span>WAREHOUSE MANAGEMENT SYSTEM (WMS)</span>
          </div>

          <h2 className="login-hero-title">
            Optimize Storage. <br />
            Accelerate Dispatch. <br />
            <span className="hero-accent-text">Master Inventory.</span>
          </h2>

          <p className="login-hero-description">
            Real-time cross-dock receiving, automated stock replenishment, and multi-facility warehouse operations — all in one unified enterprise platform.
          </p>

          {/* 3 Value Proposition Features */}
          <div className="login-hero-features-grid">
            <div className="hero-feature-pill">
              <div className="feature-icon-box">
                <Boxes size={18} color="#FF7A1A" />
              </div>
              <span>Real-Time Inventory & SKU Control</span>
            </div>

            <div className="hero-feature-pill">
              <div className="feature-icon-box">
                <Forklift size={18} color="#FF7A1A" />
              </div>
              <span>Intelligent Dock & Bay Scheduling</span>
            </div>

            <div className="hero-feature-pill">
              <div className="feature-icon-box">
                <ArrowLeftRight size={18} color="#FF7A1A" />
              </div>
              <span>Seamless Inter-Warehouse Transfers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
