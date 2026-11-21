import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { WelcomeHeroBanner } from '../dashboard/WelcomeHeroBanner';
import { LiveOperationalFleetPulse } from '../dashboard/LiveOperationalFleetPulse';
import { MiddleRowGrid } from '../dashboard/MiddleRowGrid';
import { BottomRowGrid } from '../dashboard/BottomRowGrid';
import {
  UserManagementView,
  RolePermissionsView,
  BranchManagementView,
  SubscriptionManagementView,
  AuditLogsView
} from './AdminSubViews';

export const AdminDashboard = ({
  currentUser,
  onLogout,
  onSwitchPortal
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="dashboard-layout">
      {/* 1. Left Sidebar matching Screenshot 2 */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={onLogout}
        onSwitchPortal={onSwitchPortal}
      />

      {/* 2. Main Executive Area */}
      <div className="dashboard-main">
        {/* Top bar with search, notification, date and portal switcher */}
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          onLogout={onLogout}
          onSwitchPortal={onSwitchPortal}
        />

        {/* Content Area */}
        <main className="dashboard-content-area">
          {activeTab === 'dashboard' && (
            <>
              {/* Row 1: Welcome Greeting + 4 KPI Cards + 360° Logistics Truck Card */}
              <WelcomeHeroBanner onCardClick={(tab) => setActiveTab(tab)} />

              {/* Row 1.5: Live Operational Fleet Pulse (12 summary cards matching Screenshot 4) */}
              <LiveOperationalFleetPulse onCardClick={(tab) => setActiveTab(tab)} />

              {/* Row 2: Fleet Performance Chart + Branch Distribution + Recent Activities */}
              <MiddleRowGrid onNavigate={(tab) => setActiveTab(tab)} />

              {/* Row 3: Subscription Overview + Upcoming Renewals + Promo Banner */}
              <BottomRowGrid
                onNavigate={(tab) => setActiveTab(tab)}
                onSelectPlan={(plan) => setActiveTab('subscriptions')}
              />
            </>
          )}

          {activeTab === 'users' && <UserManagementView />}
          {activeTab === 'roles' && <RolePermissionsView />}
          {activeTab === 'branches' && <BranchManagementView />}
          {activeTab === 'subscriptions' && <SubscriptionManagementView />}
          {activeTab === 'audit' && <AuditLogsView />}

          {activeTab === 'company' && (
            <div className="module-container">
              <h2 className="module-title">Enterprise Company Profile</h2>
              <p className="module-desc">TTC Fleet360 Logistics Network • Established Fleet Operator • ISO 9001:2015 Certified</p>
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '13px' }}>
                  <div><strong>Legal Entity:</strong> TTC Global Freight & Fleet Solutions Pvt. Ltd.</div>
                  <div><strong>Operating Headquarters:</strong> Hyderabad Central Logistics Park, Telangana</div>
                  <div><strong>Total Fleet Assets:</strong> 120 Commercial Vehicles</div>
                  <div><strong>Active Drivers:</strong> 110 Commercial Pilots (CDL-A certified)</div>
                  <div><strong>Enterprise GSTIN:</strong> 36AAACT8492K1Z9</div>
                  <div><strong>Telematics Server:</strong> Active AWS S3 & Kafka Stream Live</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'configuration' && (
            <div className="module-container">
              <h2 className="module-title">System & Telemetry Configuration</h2>
              <p className="module-desc">Global platform synchronization parameters and telemetry polling intervals.</p>
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>GPS Telemetry Polling Frequency</label>
                    <input className="table-search-input" defaultValue="Every 5 seconds (Real-Time)" style={{ width: '100%', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Speeding Alert Threshold</label>
                    <input className="table-search-input" defaultValue="85 KM/H" style={{ width: '100%', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Electronic POD Certification Security</label>
                    <input className="table-search-input" defaultValue="SHA-256 Tamper-Proof Cryptographic Signature" style={{ width: '100%', color: '#fff' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="module-container">
              <h2 className="module-title">Enterprise Platform Settings</h2>
              <p className="module-desc">Manage system preferences, role notification policies and security defaults.</p>
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#cbd5e1' }}>
                  <label><input type="checkbox" defaultChecked /> Enable automatic driver license expiration reminders (30 days prior)</label>
                  <label><input type="checkbox" defaultChecked /> Require dual-factor biometric authorization for dispatch creation</label>
                  <label><input type="checkbox" defaultChecked /> High-definition 3D truck telemetry rendering on hero banner</label>
                  <label><input type="checkbox" defaultChecked /> Auto-generate electronic billing invoice upon ePOD certification</label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
