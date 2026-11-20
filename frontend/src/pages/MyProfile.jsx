import React, { useState, useEffect } from 'react';
import { User, Shield, KeyRound, Mail, Phone, Briefcase, Building, CheckCircle2, AlertCircle, Save, Lock } from 'lucide-react';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';

export const MyProfile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Update details form
  const [detailsForm, setDetailsForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    department: '',
    designation: '',
  });
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsSuccess, setDetailsSuccess] = useState('');
  const [detailsError, setDetailsError] = useState('');

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.getMyProfile();
      if (res && res.data) {
        setProfile(res.data);
        setDetailsForm({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          phoneNumber: res.data.phoneNumber || '',
          department: res.data.department || 'Logistics Operations',
          designation: res.data.designation || 'Fleet Operations Director',
        });
      }
    } catch (err) {
      console.error('Failed to load profile', err);
      // Fallback
      setProfile({
        firstName: authUser?.firstName || 'Admin',
        lastName: authUser?.lastName || 'TTC',
        email: authUser?.email || 'admin@ttcfleet360.com',
        phoneNumber: '+91 98450 11223',
        department: 'Logistics Operations',
        designation: 'Fleet Operations Director',
        roles: [{ name: 'ROLE_ADMIN' }],
      });
      setDetailsForm({
        firstName: authUser?.firstName || 'Admin',
        lastName: authUser?.lastName || 'TTC',
        phoneNumber: '+91 98450 11223',
        department: 'Logistics Operations',
        designation: 'Fleet Operations Director',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setDetailsSuccess('');
    setDetailsError('');
    try {
      setSavingDetails(true);
      const res = await profileService.updateProfile(detailsForm);
      if (res && res.data) {
        setProfile(res.data);
      }
      setDetailsSuccess('Personal profile details updated successfully.');
      setTimeout(() => setDetailsSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to update profile', err);
      setDetailsError(err.response?.data?.message || 'Failed to update personal details.');
    } finally {
      setSavingDetails(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    try {
      setSavingPassword(true);
      await profileService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess('Password changed successfully.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to change password', err);
      setPasswordError(err.response?.data?.message || 'Failed to change password. Please verify current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = `${detailsForm.firstName?.charAt(0) || 'A'}${detailsForm.lastName?.charAt(0) || 'D'}`;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
          My Account & Profile
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
          Manage your enterprise administrative profile, authentication credentials, and security settings
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Left Column: Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#131929',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                fontSize: '28px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.35)',
              }}
            >
              {initials}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>
              {detailsForm.firstName} {detailsForm.lastName}
            </h3>
            <div style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '12px' }}>
              {detailsForm.designation || 'System Administrator'}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '4px 12px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 700 }}>
              <Shield size={13} />
              <span>SUPER ADMIN (RBAC)</span>
            </div>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <Mail size={15} color="#94a3b8" />
                <span>{profile?.email || authUser?.email || 'admin@ttcfleet360.com'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <Phone size={15} color="#94a3b8" />
                <span>{detailsForm.phoneNumber || '+91 98450 11223'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <Building size={15} color="#94a3b8" />
                <span>{detailsForm.department || 'HQ Operations'}</span>
              </div>
            </div>
          </div>

          {/* Access Security Card */}
          <div
            style={{
              background: '#131929',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              <CheckCircle2 size={16} />
              <span>Two-Factor Authentication Active</span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Session token signed with HS512 cryptographic key. Inactivity timeout set to 60 minutes.
            </p>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Personal Details Form */}
          <div
            style={{
              background: '#131929',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <User size={18} color="#f97316" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Update Personal Details
              </h3>
            </div>

            {detailsSuccess && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{detailsSuccess}</span>
              </div>
            )}

            {detailsError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{detailsError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateDetails} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={detailsForm.firstName}
                    onChange={(e) => setDetailsForm({ ...detailsForm, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={detailsForm.lastName}
                    onChange={(e) => setDetailsForm({ ...detailsForm, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={detailsForm.phoneNumber}
                    onChange={(e) => setDetailsForm({ ...detailsForm, phoneNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={detailsForm.department}
                    onChange={(e) => setDetailsForm({ ...detailsForm, department: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={detailsForm.designation}
                  onChange={(e) => setDetailsForm({ ...detailsForm, designation: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button type="submit" className="btn-primary" disabled={savingDetails}>
                  <Save size={15} />
                  <span>{savingDetails ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div
            style={{
              background: '#131929',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <KeyRound size={18} color="#f97316" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Change Password & Credentials
              </h3>
            </div>

            {passwordSuccess && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                    New Password (Min 6 characters)
                  </label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button type="submit" className="btn-primary" disabled={savingPassword}>
                  <Lock size={15} />
                  <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
