// frontend/src/components/auth/CustomerLoginPage.jsx
import React, { useState } from 'react';
import {
  Truck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building2,
  Boxes,
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';

export const CustomerLoginPage = ({ onLoginSuccess, onSwitchPortal }) => {
  const [email, setEmail] = useState('customer@ttcfleet360.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (password.length < 6) {
        setIsLoading(false);
        setErrorMessage('Invalid credentials. Password must be at least 6 characters.');
        return;
      }

      const customerUser = {
        username: 'customer_nexgen',
        email: email || 'customer@ttcfleet360.com',
        fullName: 'Sarah Jenkins',
        companyName: 'NexGen Industrial Corp',
        role: 'ROLE_CUSTOMER',
        portal: 'customer',
        customerId: 'CUST-8021',
        token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_customer_fleet360'
      };

      if (rememberMe) {
        localStorage.setItem('ttc_fleet360_user', JSON.stringify(customerUser));
      } else {
        sessionStorage.setItem('ttc_fleet360_user', JSON.stringify(customerUser));
      }
      localStorage.setItem('ttc_auth_token', customerUser.token);

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(customerUser);
      }, 300);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication error.');
    }
  };

  return (
    <div className="login-page-container theme-manager-dark" style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#081831' }}>
      {/* Left Column: Form */}
      <div className="login-form-section form-dark" style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', backgroundColor: '#0d1a30' }}>
        <div className="login-form-inner" style={{ maxWidth: '420px', width: '100%' }}>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#FF7A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255, 122, 26, 0.4)'
              }}
            >
              <Truck size={24} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                TTC FLEET<span style={{ color: '#FF7A1A' }}>360</span>
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#079DF2', letterSpacing: '0.06em' }}>
                ENTERPRISE LOGISTICS OS
              </div>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>
              Customer Portal Login
            </h1>
            <div style={{ width: '40px', height: '3px', backgroundColor: '#FF7A1A', borderRadius: '2px', marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
              Welcome back! Sign in to book freight, track active shipments, and manage commercial invoices.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '8px', color: '#FCA5A5', fontSize: '12.5px', marginBottom: '18px' }}>
              <AlertCircle size={16} color="#EF4444" />
              <span>{errorMessage}</span>
            </div>
          )}

          {forgotPasswordNotice && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(7, 157, 242, 0.15)', border: '1px solid rgba(7, 157, 242, 0.3)', padding: '10px 14px', borderRadius: '8px', color: '#7DD3FC', fontSize: '12px', marginBottom: '18px' }}>
              <ShieldCheck size={16} color="#079DF2" />
              <span>Password recovery instructions have been sent to your registered work email.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    fontSize: '13px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="customer@ttcfleet360.com"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    fontSize: '13px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordNotice(true)}
                style={{ background: 'none', border: 'none', color: '#FF7A1A', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#FF7A1A',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 122, 26, 0.4)',
                marginTop: '6px'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Customer Portal'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Switch Portal Footer */}
          {onSwitchPortal && (
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '24px', paddingTop: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Operator or Staff? </span>
              <button
                type="button"
                onClick={() => onSwitchPortal('admin')}
                style={{ background: 'none', border: 'none', color: '#079DF2', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
              >
                Access System Portals →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Hero Visuals */}
      <div
        className="login-hero-section"
        style={{
          flex: '1.2',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          color: '#FFFFFF',
          backgroundColor: '#0a1426'
        }}
      >
        {/* Background Courier Delivery Image */}
        <img
          src="/assets/customer-hero.jpg"
          alt="TTC Fleet360 Customer Delivery Courier"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            opacity: 0.45
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10, 20, 38, 0.72) 0%, rgba(10, 20, 38, 0.82) 50%, rgba(6, 12, 24, 0.95) 100%)',
            backdropFilter: 'blur(1px)'
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(7, 157, 242, 0.25)',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#bae6fd',
              marginBottom: '16px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 14px rgba(7, 157, 242, 0.3)'
            }}
          >
            <Building2 size={16} color="#38bdf8" />
            <span>ENTERPRISE SHIPPER & CUSTOMER PORTAL</span>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: '1.2', margin: '0 0 16px', letterSpacing: '-0.02em', textShadow: '0 2px 14px rgba(0,0,0,0.85)' }}>
            Book Freight Fast.<br />
            <span style={{ background: 'linear-gradient(90deg, #38bdf8, #0ea5e9, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Track Shipments To Your Door.
            </span>
          </h2>

          <p style={{ fontSize: '14.5px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 24px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            A dedicated customer operating portal for commercial shipping partners. Book end-to-end transportation, monitor live vehicle telemetry, download verified e-POD receipts, and automate freight invoice settlements.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                color: '#e2e8f0',
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                backdropFilter: 'blur(6px)'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
              <span>Direct Carrier Dispatch Booking & Instant Order Confirmation</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                color: '#e2e8f0',
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                backdropFilter: 'blur(6px)'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span>Real-Time Satellite GPS Linehaul Telemetry & Milestone HUD</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                color: '#e2e8f0',
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                backdropFilter: 'blur(6px)'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <span>Verified Electronic Proof of Delivery (e-POD) & Settlement Vault</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
