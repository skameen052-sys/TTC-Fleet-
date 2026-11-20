import React, { useState, useEffect } from 'react';
import { Briefcase, UploadCloud, Save, Check, Globe, Phone, Mail, Building, FileText, CheckCircle2 } from 'lucide-react';
import { companyService } from '../services/companyService';

export const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    brandTagline: '',
    registrationNumber: '',
    taxIdentifier: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    addressStreet: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    logoS3Url: '',
    operatingCurrency: 'INR',
    primaryTimezone: 'Asia/Kolkata',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await companyService.getProfile();
      if (res && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Failed to load company profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, val) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await companyService.updateProfile(profile);
      if (res && res.data) {
        setProfile(res.data);
      }
      setSuccessMsg('Company profile information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await companyService.uploadLogo(file);
      if (res && res.data?.logoUrl) {
        setProfile((prev) => ({ ...prev, logoS3Url: res.data.logoUrl }));
        setSuccessMsg('Company logo uploaded to AWS S3 storage successfully!');
      }
    } catch (err) {
      alert('Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="module-container animate-fade-in">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Company Profile Management</h1>
          <p className="module-desc">
            Maintain corporate identification, tax and compliance records, enterprise branding, and AWS S3 assets.
          </p>
        </div>

        <div className="module-actions-row">
          <button
            className="btn-primary"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="login-success-banner animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          {/* Main Profile Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* General Info Card */}
            <div className="fleet-table-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={18} color="#f97316" />
                <span>Enterprise Identity</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Brand Tagline</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.brandTagline || ''}
                    onChange={(e) => handleInputChange('brandTagline', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Corporate Email</label>
                  <input
                    type="email"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.contactEmail || ''}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Corporate Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.contactPhone || ''}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '14px' }}>
                <label className="form-label" style={{ color: '#cbd5e1' }}>Website URL</label>
                <input
                  type="url"
                  className="form-input"
                  style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                  value={profile.websiteUrl || ''}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                />
              </div>
            </div>

            {/* Business Registration and Tax Details */}
            <div className="fleet-table-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#0ea5e9" />
                <span>Business Registration & Tax Details</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Registration Number (CIN)</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.registrationNumber || ''}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Tax Identifier (GSTIN)</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.taxIdentifier || ''}
                    onChange={(e) => handleInputChange('taxIdentifier', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '14px' }}>
                <label className="form-label" style={{ color: '#cbd5e1' }}>Registered Address</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                  value={profile.addressStreet || ''}
                  onChange={(e) => handleInputChange('addressStreet', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>City</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>State</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Postal Code</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                    value={profile.postalCode || ''}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AWS S3 Logo Uploader & Localization */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Logo Card */}
            <div className="fleet-table-card" style={{ padding: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
                Company Brand Logo
              </h3>

              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '16px',
                  background: '#1a2236',
                  border: '2px dashed rgba(255,255,255,0.15)',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {profile.logoS3Url ? (
                  <img
                    src={profile.logoS3Url}
                    alt="Company Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ color: '#f97316', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Briefcase size={32} />
                    <span style={{ fontSize: '10px', marginTop: '4px', color: '#94a3b8' }}>No Logo</span>
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  id="logo-upload-input"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <label
                  htmlFor="logo-upload-input"
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <UploadCloud size={16} />
                  <span>{uploadingLogo ? 'Uploading to S3...' : 'Upload to AWS S3'}</span>
                </label>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
                PNG, JPG or SVG up to 10MB
              </div>
            </div>

            {/* Localization Settings */}
            <div className="fleet-table-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
                Operations Localization
              </h3>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ color: '#cbd5e1' }}>Default Currency</label>
                <select
                  className="form-input"
                  style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                  value={profile.operatingCurrency || 'INR'}
                  onChange={(e) => handleInputChange('operatingCurrency', e.target.value)}
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="AED">AED (د.إ) - UAE Dirham</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1' }}>Primary Timezone</label>
                <select
                  className="form-input"
                  style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                  value={profile.primaryTimezone || 'Asia/Kolkata'}
                  onChange={(e) => handleInputChange('primaryTimezone', e.target.value)}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
