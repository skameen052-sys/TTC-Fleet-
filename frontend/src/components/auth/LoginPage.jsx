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
  BarChart3,
  Warehouse,
  Boxes,
  Forklift,
  ArrowLeftRight
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess, initialPortal = 'manager' }) => {
  const [selectedPortal, setSelectedPortal] = useState(initialPortal);
  const [email, setEmail] = useState(() => {
    if (initialPortal === 'driver') return 'm.vance@fleet360.ttc.com';
    if (initialPortal === 'warehouse') return 'ethan.cole@fleet360.ttc.com';
    return 'alex.mercer@fleet360.ttc.com';
  });
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const isDriver = selectedPortal === 'driver';
  const isWarehouse = selectedPortal === 'warehouse';

  const handlePortalSwitch = (portal) => {
    setSelectedPortal(portal);
    setErrorMessage('');
    if (portal === 'driver') {
      setEmail('m.vance@fleet360.ttc.com');
      setPassword('password123');
    } else if (portal === 'warehouse') {
      setEmail('ethan.cole@fleet360.ttc.com');
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
      let userData;
      if (selectedPortal === 'warehouse' || email.includes('ethan') || email.includes('warehouse')) {
        userData = {
          username: 'warehouse_dir01',
          email: email || 'ethan.cole@fleet360.ttc.com',
          fullName: 'Ethan Cole',
          role: 'ROLE_WAREHOUSE_MANAGER',
          staffId: 'WH-DIR-084',
          facilityId: 'WH-CENTRAL-01',
          token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_warehouse_fleet360'
        };
      } else if (selectedPortal === 'driver' || email.includes('vance') || email.includes('driver')) {
        userData = {
          username: 'driver01',
          email: email,
          fullName: 'Marcus Vance',
          role: 'ROLE_DRIVER',
          driverId: 'D-01',
          vehicleReg: 'TTC-8492-HD',
          token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_driver_fleet360'
        };
      } else {
        userData = {
          username: 'fleetmanager',
          email: email || 'alex.mercer@fleet360.ttc.com',
          fullName: 'Alexandre Mercer',
          role: 'ROLE_FLEET_MANAGER',
          token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_token_fleet360'
        };
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: email,
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
    <div className={`login-page-container ${isDriver || isWarehouse ? 'theme-driver-light' : 'theme-manager-dark'}`}>
      {/* ===================================================================
          LEFT SECTION - LOGIN FORM (38% Viewport width)
          =================================================================== */}
      <div className={`login-form-section ${isDriver || isWarehouse ? 'form-light' : 'form-dark'}`}>
        {/* Ambient bottom-left glow wave for dark theme */}
        {!isDriver && !isWarehouse && <div className="dark-theme-wave-glow" />}

        <div className="login-form-inner">
          {/* Logo and Branding Header */}
          <div className="login-brand-header">
            <div className={`login-logo-box ${isDriver || isWarehouse ? 'logo-box-light' : 'logo-box-dark'}`}>
              {isWarehouse ? (
                <Warehouse size={22} color="#FF7A1A" strokeWidth={2.4} />
              ) : (
                <Truck size={22} color={isDriver ? '#FF7A1A' : '#FFFFFF'} strokeWidth={2.4} />
              )}
            </div>
            <div className="login-brand-text">
              <span className={`login-app-name ${isDriver || isWarehouse ? 'text-navy' : 'text-white'}`}>
                TTC FLEET<span className="orange-highlight">360</span>
              </span>
              <span className={`login-app-subtitle ${isDriver || isWarehouse ? 'sub-blue' : 'sub-light-blue'}`}>
                {isWarehouse ? 'ENTERPRISE WAREHOUSE OS' : isDriver ? 'DRIVER PORTAL OS' : 'ENTERPRISE FLEET OS'}
              </span>
            </div>
          </div>

          {/* Role Portal Switcher Pills (3 Portals) */}
          <div className={`portal-switcher-pill-box ${isDriver || isWarehouse ? 'box-light' : 'box-dark'}`} style={{ gap: 4 }}>
            <button
              type="button"
              className={`portal-pill-btn ${selectedPortal === 'manager' ? 'active-manager' : 'inactive-manager'}`}
              onClick={() => handlePortalSwitch('manager')}
            >
              <Truck size={13} />
              <span>Fleet Manager</span>
            </button>
            <button
              type="button"
              className={`portal-pill-btn ${selectedPortal === 'driver' ? 'active-driver' : 'inactive-driver'}`}
              onClick={() => handlePortalSwitch('driver')}
            >
              <UserCheck size={13} />
              <span>Driver Portal</span>
            </button>
            <button
              type="button"
              className={`portal-pill-btn ${selectedPortal === 'warehouse' ? 'active-driver' : 'inactive-driver'}`}
              onClick={() => handlePortalSwitch('warehouse')}
              style={selectedPortal === 'warehouse' ? { backgroundColor: '#FFF0E5', color: '#FF7A1A' } : {}}
            >
              <Warehouse size={13} />
              <span>Warehouse Manager</span>
            </button>
          </div>

          {/* Welcome Heading */}
          <div className="login-welcome-wrap">
            <h1 className={`login-welcome-title ${isDriver || isWarehouse ? 'text-navy' : 'text-white'}`}>
              Welcome Back!
            </h1>
            {/* Orange Underline Accent Bar */}
            <div className="orange-title-underline" />
            <p className={`login-welcome-subtitle ${isDriver || isWarehouse ? 'sub-light' : 'sub-dark'}`}>
              {isWarehouse
                ? 'Sign in to manage warehouse facilities, inventory, and cross-dock operations.'
                : isDriver
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
              <label className={`login-field-label ${isDriver || isWarehouse ? 'label-light' : 'label-dark'}`}>
                {isWarehouse ? 'Email Address or Employee ID' : 'Email Address'}
              </label>
              <div className={`login-input-wrap ${isDriver || isWarehouse ? 'wrap-light' : 'wrap-dark'}`}>
                <Mail className="login-input-icon" size={16} color={isDriver || isWarehouse ? '#718096' : '#94A3B8'} />
                <input
                  type={isWarehouse ? 'text' : 'email'}
                  className={`login-text-input ${isDriver || isWarehouse ? 'input-light' : 'input-dark'}`}
                  placeholder={isWarehouse ? 'ethan.cole@fleet360.ttc.com or WH-MGR-084' : isDriver ? 'Enter driver email' : 'alex.mercer@fleet360.ttc.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field-group">
              <label className={`login-field-label ${isDriver || isWarehouse ? 'label-light' : 'label-dark'}`}>
                Password
              </label>
              <div className={`login-input-wrap ${isDriver || isWarehouse ? 'wrap-light' : 'wrap-dark'}`}>
                <Lock className="login-input-icon" size={16} color={isDriver || isWarehouse ? '#718096' : '#94A3B8'} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`login-text-input ${isDriver || isWarehouse ? 'input-light' : 'input-dark'}`}
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
                    <EyeOff size={16} color={isDriver || isWarehouse ? '#718096' : '#94A3B8'} />
                  ) : (
                    <Eye size={16} color={isDriver || isWarehouse ? '#718096' : '#94A3B8'} />
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
                <span className={isDriver || isWarehouse ? 'text-sub-light' : 'text-sub-dark'}>Remember Me</span>
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
                  <span>
                    {isWarehouse ? 'Sign In to Warehouse OS' : isDriver ? 'Sign In to Driver Portal' : 'Sign In to Dashboard'}
                  </span>
                  <ArrowRight size={17} strokeWidth={2.4} />
                </>
              )}
            </button>
          </form>

          {/* Quick autofill helper */}
          <div className="demo-credentials-pill" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11.5px' }}>
            <span style={{ color: isDriver || isWarehouse ? '#718096' : '#94A3B8' }}>
              {isWarehouse ? 'Warehouse Director:' : isDriver ? 'Driver Account:' : 'Fleet Manager:'}
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
                if (isWarehouse) {
                  setEmail('ethan.cole@fleet360.ttc.com');
                  setPassword('password123');
                } else if (isDriver) {
                  setEmail('m.vance@fleet360.ttc.com');
                  setPassword('password123');
                } else {
                  setEmail('alex.mercer@fleet360.ttc.com');
                  setPassword('password123');
                }
              }}
            >
              {isWarehouse
                ? 'ethan.cole@fleet360.ttc.com (Autofill)'
                : isDriver
                ? 'm.vance@fleet360.ttc.com (Autofill)'
                : 'alex.mercer@fleet360.ttc.com (Autofill)'}
            </button>
          </div>

          {/* Security Information Footer Card */}
          <div className={`login-security-card ${isDriver || isWarehouse ? 'sec-light' : 'sec-dark'}`}>
            <div className={`sec-icon-circle ${isDriver || isWarehouse ? 'icon-circle-green' : 'icon-circle-orange'}`}>
              <ShieldCheck size={18} color={isDriver || isWarehouse ? '#16A36A' : '#FF7A1A'} />
            </div>
            <div className="sec-text-box">
              <div className={`sec-title ${isDriver || isWarehouse ? 'title-light' : 'title-dark'}`}>
                Secure Login
              </div>
              <div className={`sec-desc ${isDriver || isWarehouse ? 'desc-light' : 'desc-dark'}`}>
                {isWarehouse
                  ? 'Your warehouse inventory, cross-dock receiving, and dispatches are protected with enterprise-grade security.'
                  : 'Your fleet operations are protected with enterprise-grade security.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          RIGHT SECTION - ULTRA 4K HERO IMAGE (62% Viewport width)
          =================================================================== */}
      <div className="login-hero-section">
        {isWarehouse ? (
          <div className="manager-hero-container fade-in">
            <img
              src="/assets/warehouse-manager-login.webp"
              alt="TTC Fleet360 Enterprise Warehouse Operations"
              className="login-hero-img-display"
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            />
            {/* Dark gradient overlay for text readability */}
            <div className="manager-hero-gradient-overlay" />

            {/* Warehouse Marketing Content */}
            <div className="manager-hero-content">
              <div className="login-hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 122, 26, 0.25)', border: '1px solid rgba(255, 122, 26, 0.5)', padding: '5px 12px', borderRadius: 20, marginBottom: 14 }}>
                <Forklift size={15} color="#FF7A1A" />
                <span style={{ fontSize: 11.5, fontWeight: 800, color: '#FFB37C', letterSpacing: '0.04em' }}>WAREHOUSE MANAGEMENT SYSTEM (WMS)</span>
              </div>

              <div className="manager-hero-titles">
                <h2 className="manager-hero-h2">
                  Optimize Storage. <br />
                  Accelerate Dispatch. <br />
                  <span className="orange-highlight-text">Master Inventory.</span>
                </h2>
                <p className="manager-hero-p">
                  Real-time cross-dock receiving, automated stock replenishment, and multi-facility warehouse operations — all in one unified enterprise platform.
                </p>
              </div>

              {/* 3 Value Proposition Features */}
              <div className="manager-hero-pills-row">
                <div className="manager-feature-pill">
                  <div className="pill-icon-circle">
                    <Boxes size={15} color="#FF7A1A" />
                  </div>
                  <span>Real-Time Inventory & SKU Control</span>
                </div>

                <div className="manager-feature-pill">
                  <div className="pill-icon-circle">
                    <Forklift size={15} color="#FF7A1A" />
                  </div>
                  <span>Intelligent Dock & Bay Scheduling</span>
                </div>

                <div className="manager-feature-pill">
                  <div className="pill-icon-circle">
                    <ArrowLeftRight size={15} color="#FF7A1A" />
                  </div>
                  <span>Seamless Inter-Warehouse Transfers</span>
                </div>
              </div>
            </div>
          </div>
        ) : isDriver ? (
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

            {/* Crisp 4K Text & Pills */}
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

              {/* 3 Crisp Vector Feature Pills */}
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

