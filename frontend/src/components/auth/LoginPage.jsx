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
  Shield,
  Layers,
  MapPin,
  BarChart3,
  Warehouse,
  Forklift
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess, initialPortal = 'admin' }) => {
  // 4 distinct portals: 'admin', 'manager', 'driver', 'warehouse'
  const [selectedPortal, setSelectedPortal] = useState(initialPortal);
  const [email, setEmail] = useState(() => {
    if (initialPortal === 'manager') return 'manager@ttcfleet360.com';
    if (initialPortal === 'driver') return 'm.vance@fleet360.ttc.com';
    if (initialPortal === 'warehouse') return 'ethan.cole@fleet360.ttc.com';
    return 'admin@ttcfleet360.com';
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
    if (portal === 'admin') {
      setEmail('admin@ttcfleet360.com');
      setPassword('password123');
    } else if (portal === 'manager') {
      setEmail('manager@ttcfleet360.com');
      setPassword('password123');
    } else if (portal === 'driver') {
      setEmail('m.vance@fleet360.ttc.com');
      setPassword('password123');
    } else if (portal === 'warehouse') {
      setEmail('ethan.cole@fleet360.ttc.com');
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
          portal: 'warehouse',
          staffId: 'WH-DIR-084',
          facilityId: 'WH-CENTRAL-01',
          token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_warehouse_fleet360'
        };
      } else if (selectedPortal === 'driver' || email.includes('vance') || email.includes('driver')) {
        userData = {
          username: 'driver01',
          email: email || 'm.vance@fleet360.ttc.com',
          fullName: 'Marcus Vance',
          role: 'ROLE_DRIVER',
          portal: 'driver',
          driverId: 'D-01',
          vehicleReg: 'TTC-8492-HD',
          token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_driver_fleet360'
        };
      } else if (selectedPortal === 'manager' || email.includes('manager')) {
        userData = {
          username: 'manager01',
          email: email || 'manager@ttcfleet360.com',
          fullName: 'Vikram Malhotra',
          role: 'ROLE_MANAGER',
          portal: 'manager',
          token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_manager_fleet360'
        };
      } else {
        userData = {
          username: 'admin',
          email: email || 'admin@ttcfleet360.com',
          fullName: 'Admin',
          role: 'ROLE_ADMIN',
          portal: 'admin',
          token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_admin_fleet360'
        };
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
        }, 300);
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid credentials. Password must be at least 6 characters.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication error.');
    }
  };

  const getPortalTitle = () => {
    if (selectedPortal === 'admin') return 'Admin Dashboard';
    if (selectedPortal === 'manager') return 'Fleet Manager Dashboard';
    if (selectedPortal === 'warehouse') return 'Warehouse OS';
    return 'Driver Portal';
  };

  const getPortalSubtitle = () => {
    if (selectedPortal === 'admin') return 'Sign in to access Executive Overview, System Control & Subscriptions.';
    if (selectedPortal === 'manager') return 'Sign in to manage 16 Fleet Modules, Live Telemetry & Dispatches.';
    if (selectedPortal === 'warehouse') return 'Sign in to manage Inventory, Goods Receiving, Dispatches & Stock.';
    return 'Sign in to access assigned trips, turn-by-turn navigation & electronic POD.';
  };

  return (
    <div className={`login-page-container ${isDriver || isWarehouse ? 'theme-driver-light' : 'theme-manager-dark'}`}>
      {/* Left Column: Interactive Form */}
      <div className={`login-form-section ${isDriver || isWarehouse ? 'form-light' : 'form-dark'}`}>
        {!isDriver && !isWarehouse && <div className="dark-theme-wave-glow" />}

        <div className="login-form-inner">
          {/* Brand Header */}
          <div className="login-brand-header">
            <div className={`login-logo-box ${isDriver || isWarehouse ? 'logo-box-light' : 'logo-box-dark'}`}>
              <Truck size={22} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div className="login-brand-text">
              <span className={`login-app-name ${isDriver || isWarehouse ? 'text-navy' : 'text-white'}`}>
                TTC FLEET<span className="orange-highlight">360</span>
              </span>
              <span className={`login-app-subtitle ${isDriver || isWarehouse ? 'sub-blue' : 'sub-light-blue'}`}>
                ENTERPRISE LOGISTICS OS
              </span>
            </div>
          </div>

          {/* 4-WAY ROLE / PORTAL SELECTOR */}
          <div
            className={`portal-switcher-pill-box ${isDriver || isWarehouse ? 'box-light' : 'box-dark'}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '3px',
              padding: '3px'
            }}
          >
            {/* 1. Admin */}
            <button
              type="button"
              className="portal-pill-btn"
              onClick={() => handlePortalSwitch('admin')}
              style={{
                background: selectedPortal === 'admin' ? '#FF7A1A' : 'transparent',
                color: selectedPortal === 'admin' ? '#FFFFFF' : isDriver || isWarehouse ? '#475569' : '#94A3B8',
                fontWeight: selectedPortal === 'admin' ? '700' : '600',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                boxShadow: selectedPortal === 'admin' ? '0 2px 8px rgba(255,122,26,0.4)' : 'none'
              }}
            >
              <Shield size={12} />
              <span>Admin</span>
            </button>

            {/* 2. Fleet Manager */}
            <button
              type="button"
              className="portal-pill-btn"
              onClick={() => handlePortalSwitch('manager')}
              style={{
                background: selectedPortal === 'manager' ? '#00a3ff' : 'transparent',
                color: selectedPortal === 'manager' ? '#FFFFFF' : isDriver || isWarehouse ? '#475569' : '#94A3B8',
                fontWeight: selectedPortal === 'manager' ? '700' : '600',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                boxShadow: selectedPortal === 'manager' ? '0 2px 8px rgba(0,163,255,0.4)' : 'none'
              }}
            >
              <Truck size={12} />
              <span>Fleet</span>
            </button>

            {/* 3. Driver */}
            <button
              type="button"
              className="portal-pill-btn"
              onClick={() => handlePortalSwitch('driver')}
              style={{
                background: selectedPortal === 'driver' ? '#10b981' : 'transparent',
                color: selectedPortal === 'driver' ? '#FFFFFF' : isDriver || isWarehouse ? '#475569' : '#94A3B8',
                fontWeight: selectedPortal === 'driver' ? '700' : '600',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                boxShadow: selectedPortal === 'driver' ? '0 2px 8px rgba(16,185,129,0.4)' : 'none'
              }}
            >
              <UserCheck size={12} />
              <span>Driver</span>
            </button>

            {/* 4. Warehouse */}
            <button
              type="button"
              className="portal-pill-btn"
              onClick={() => handlePortalSwitch('warehouse')}
              style={{
                background: selectedPortal === 'warehouse' ? '#a855f7' : 'transparent',
                color: selectedPortal === 'warehouse' ? '#FFFFFF' : isDriver || isWarehouse ? '#475569' : '#94A3B8',
                fontWeight: selectedPortal === 'warehouse' ? '700' : '600',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                boxShadow: selectedPortal === 'warehouse' ? '0 2px 8px rgba(168,85,247,0.4)' : 'none'
              }}
            >
              <Warehouse size={12} />
              <span>WMS</span>
            </button>
          </div>

          {/* Welcome Heading */}
          <div className="login-welcome-wrap">
            <h1 className={`login-welcome-title ${isDriver || isWarehouse ? 'text-navy' : 'text-white'}`}>
              Welcome Back!
            </h1>
            <div className="orange-title-underline" />
            <p className={`login-welcome-subtitle ${isDriver || isWarehouse ? 'sub-light' : 'sub-dark'}`}>
              {getPortalSubtitle()}
            </p>
          </div>

          {/* Error Alert */}
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
              <span>Password recovery link dispatched to {email || 'your email'}.</span>
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
                Email Address
              </label>
              <div className={`login-input-wrap ${isDriver || isWarehouse ? 'wrap-light' : 'wrap-dark'}`}>
                <Mail className="login-input-icon" size={16} color={isDriver || isWarehouse ? '#718096' : '#94A3B8'} />
                <input
                  type="email"
                  className={`login-text-input ${isDriver || isWarehouse ? 'input-light' : 'input-dark'}`}
                  placeholder="Enter email address"
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
                  placeholder="Enter password"
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

            {/* Remember Me & Forgot Password */}
            <div className="login-options-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={isDriver || isWarehouse ? 'text-gray-dark' : 'text-gray-light'}>Remember Me</span>
              </label>
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setForgotPasswordNotice(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Orange Login Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to {getPortalTitle()}</span>
                  <ArrowRight size={17} strokeWidth={2.4} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Helper */}
          <div
            className="demo-credentials-pill"
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: isDriver || isWarehouse ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
              border: '1px dashed rgba(255,122,26,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px'
            }}
          >
            <span style={{ color: isDriver || isWarehouse ? '#64748b' : '#94A3B8' }}>
              Autofill: <strong>{getPortalTitle()}</strong>
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
              onClick={() => handlePortalSwitch(selectedPortal)}
            >
              ⚡ Fill Demo Login
            </button>
          </div>

          {/* Security Information Footer Card */}
          <div className={`login-security-card ${isDriver || isWarehouse ? 'sec-light' : 'sec-dark'}`}>
            <div className={`sec-icon-circle ${isDriver || isWarehouse ? 'icon-circle-green' : 'icon-circle-orange'}`}>
              <ShieldCheck size={18} color={isDriver || isWarehouse ? '#16A36A' : '#FF7A1A'} />
            </div>
            <div className="sec-text-box">
              <div className={`sec-title ${isDriver || isWarehouse ? 'title-light' : 'title-dark'}`}>
                Enterprise Security Protected
              </div>
              <div className={`sec-desc ${isDriver || isWarehouse ? 'desc-light' : 'desc-dark'}`}>
                Role-based access control (RBAC) with JWT session authorization.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Ultra-4K Hero Image */}
      <div className="login-hero-section">
        {selectedPortal === 'warehouse' && (
          <div className="manager-hero-container fade-in">
            <img
              src="/assets/warehouse-manager-login.webp"
              alt="TTC Fleet360 Enterprise Warehouse Operations"
              className="login-hero-img-display"
              style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/manager-hero-4k.jpg';
              }}
            />
            <div className="manager-hero-gradient-overlay" />
            <div className="manager-hero-content">
              <div
                className="login-hero-tag"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  width: 'fit-content',
                  maxWidth: 'fit-content',
                  alignSelf: 'flex-start',
                  background: 'rgba(255, 122, 26, 0.22)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 122, 26, 0.55)',
                  padding: '6px 14px',
                  borderRadius: 24,
                  marginBottom: 12,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Forklift size={15} color="#FF7A1A" strokeWidth={2.4} />
                <span style={{ fontSize: 11.5, fontWeight: 800, color: '#FFB37C', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  WAREHOUSE MANAGEMENT SYSTEM (WMS)
                </span>
              </div>

              <div className="manager-hero-titles">
                <h2 className="manager-hero-h2">
                  Streamline Warehousing.<br />
                  <span className="h2-gradient">Zero-Loss Inventory Control.</span>
                </h2>
                <p className="manager-hero-p">
                  Enterprise cross-dock receiving, real-time bay allocation, and automated dispatch loading.
                </p>
              </div>
              <div className="manager-feature-pills">
                <div className="manager-feature-pill">
                  <span className="pill-dot" /> Multi-Facility Stock Movement
                </div>
                <div className="manager-feature-pill">
                  <span className="pill-dot" /> Cross-Dock Loading & Inspection
                </div>
                <div className="manager-feature-pill">
                  <span className="pill-dot" /> Automated Quarantine & Damage Audits
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedPortal === 'driver' && (
          <img
            key="driver-hero-4k-img"
            src="/assets/driver-hero-4k.jpg"
            alt="TTC Fleet360 Driver Dispatch System 4K"
            className="login-hero-img-display fade-in"
          />
        )}

        {selectedPortal === 'manager' && (
          <div className="manager-hero-container fade-in">
            <img
              src="/assets/manager-hero-4k.jpg"
              alt="TTC Fleet360 Enterprise Fleet Manager 4K"
              className="login-hero-img-display"
            />
            <div className="manager-hero-gradient-overlay" />
            <div className="manager-hero-content">
              <div className="manager-hero-titles">
                <h2 className="manager-hero-h2">
                  Manage Your Fleet.<br />
                  <span className="h2-gradient">Drive High Performance.</span>
                </h2>
                <p className="manager-hero-p">
                  Gain total visibility, streamline operations, and boost efficiency across your entire logistics lifecycle.
                </p>
              </div>
              <div className="manager-feature-pills">
                <div className="manager-feature-pill">
                  <span className="pill-dot" /> Real-time GPS Tracking
                </div>
                <div className="manager-feature-pill">
                  <span className="pill-dot" /> Driver Route Automation
                </div>
                <div className="manager-feature-pill">
                  <span className="pill-dot" /> Predictive Maintenance
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedPortal === 'admin' && (
          <div
            className="login-hero-panel-wrapper fade-in"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              backgroundColor: '#0a1426',
              borderRadius: 'inherit'
            }}
          >
            {/* Single image element: High-quality realistic red logistics truck on highway */}
            <img
              src="/assets/login-red-truck.jpg"
              alt="Realistic Red Logistics Truck on Highway"
              className="login-hero-img-display"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/manager-hero-4k.jpg';
              }}
            />

            {/* Subtle natural lighting overlay at top to guarantee text readability without obscuring truck */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(8, 18, 36, 0.45) 0%, rgba(8, 18, 36, 0.12) 40%, rgba(0, 0, 0, 0) 100%)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />

            {/* Aligned at top-left: Displayed ONLY ONCE, exact text, white, clearly readable, no duplicate elements */}
            <div
              style={{
                position: 'absolute',
                top: 'clamp(28px, 5.5vh, 48px)',
                left: 'clamp(28px, 4.2vw, 48px)',
                maxWidth: '520px',
                zIndex: 2,
                pointerEvents: 'none'
              }}
            >
              <h1
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(22px, 2.5vw, 34px)',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  margin: 0,
                  padding: 0,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}
              >
                Drive your fleet with<br />
                clarity, control, and<br />
                confidence.
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
