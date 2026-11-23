import React, { useState } from 'react';
import {
  CreditCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
  Receipt,
  PieChart,
  Truck
} from 'lucide-react';

export const BillingLoginPage = ({ onLoginSuccess, onSwitchPortal }) => {
  const [email, setEmail] = useState('finance@ttcfleet360.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both work email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate backend authentication check
      await new Promise((resolve) => setTimeout(resolve, 600));

      const financeUser = {
        username: 'fin_controller01',
        email: email,
        fullName: 'Devin Vance',
        title: 'Chief Financial Controller',
        role: 'ROLE_FINANCE_MANAGER',
        portal: 'billing',
        staffId: 'FIN-CFO-891',
        department: 'Corporate Accounts & Treasury',
        token: 'eyJhbGciOiJIUzUxMiJ9.simulated_jwt_billing_finance_fleet360'
      };

      if (onLoginSuccess) {
        onLoginSuccess(financeUser);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('finance@ttcfleet360.com');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#090d16',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(9, 13, 22, 0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          right: '10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, rgba(9, 13, 22, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          background: '#0f172a',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        {/* Left Side: Form */}
        <div style={{ padding: '44px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Logo Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                }}
              >
                <CreditCard size={20} color="#ffffff" strokeWidth={2.4} />
              </div>
              <div>
                <div style={{ fontSize: '19px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                  TTC Fleet<span style={{ color: '#38bdf8' }}>360</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.4px' }}>
                  FINANCE & ACCOUNTS OS
                </div>
              </div>
            </div>

            {/* Portal Title */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 6px 0', letterSpacing: '-0.4px' }}>
                Billing & Finance Manager
              </h1>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Sign in to manage freight billing, customer receivables, GST tax filings, and profit & loss ledger.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '12.5px',
                  marginBottom: '20px'
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Work Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="#64748b"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="finance@ttcfleet360.com"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '11px 12px 11px 38px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="#64748b"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '11px 40px 11px 38px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
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
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#2563eb' }}
                  />
                  Remember my session
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordNotice(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: 0
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {forgotPasswordNotice && (
                <div style={{ fontSize: '11.5px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '8px 10px', borderRadius: '6px' }}>
                  Password reset link sent to registered financial officer email.
                </div>
              )}

              {/* Secure Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  transition: 'opacity 0.2s ease',
                  marginTop: '4px'
                }}
              >
                {isLoading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>Sign In to Finance OS</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Demo Pill & Footer */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Demo Credentials:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                style={{
                  background: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#38bdf8',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ⚡ Fill Demo Finance Login
              </button>
            </div>

            {onSwitchPortal && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: '#64748b' }}>
                <span>Switch to:</span>
                <button
                  type="button"
                  onClick={() => onSwitchPortal('admin')}
                  style={{ background: 'none', border: 'none', color: '#FF7A1A', cursor: 'pointer', padding: 0 }}
                >
                  Admin
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onSwitchPortal('manager')}
                  style={{ background: 'none', border: 'none', color: '#00d2ff', cursor: 'pointer', padding: 0 }}
                >
                  Fleet Manager
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onSwitchPortal('customer')}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0 }}
                >
                  Customer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Showcase Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            padding: '40px 36px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                padding: '4px 10px',
                borderRadius: '20px',
                color: '#38bdf8',
                fontSize: '11px',
                fontWeight: 700,
                marginBottom: '20px'
              }}
            >
              <ShieldCheck size={13} />
              <span>FINANCIAL INTELLIGENCE CLOUD</span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 12px 0', lineHeight: 1.3 }}>
              Comprehensive Cashflow, Freight Invoicing & GST Tax Governance
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Automated reconciliation of freight bills, driver allowances, toll fees, vehicle OEM maintenance, and customer accounts receivable.
            </p>

            {/* Feature Cards List */}
            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={16} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Automated e-Invoicing</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Instant GST-compliant tax invoices with QR & IRN</div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={16} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Real-time Cashflow Audit</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Live reconciliation of RTGS, NEFT, ACH & Gateway receipts</div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart size={16} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>Profit & Loss Telemetry</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Route-level and vehicle-level operating margins</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#64748b',
              marginTop: '20px'
            }}
          >
            <ShieldCheck size={14} color="#10b981" />
            <span>256-bit Encrypted Banking & Financial Ledger Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
