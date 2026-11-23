import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Building2,
  Briefcase,
  CreditCard,
  Sliders,
  FileText,
  Settings,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Download,
  Trash2,
  Edit2,
  ExternalLink,
  MapPin,
  Truck,
  DollarSign
} from 'lucide-react';

// ============================================================================
// 1. USER MANAGEMENT VIEW
// ============================================================================
export const UserManagementView = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const usersList = [
    { id: 'USR-101', name: 'Alexander Mercer', email: 'admin@ttcfleet360.com', role: 'Super Admin', branch: 'Hyderabad HQ', status: 'Active', lastLogin: '2 min ago' },
    { id: 'USR-102', name: 'Vikram Malhotra', email: 'manager@ttcfleet360.com', role: 'Fleet Manager', branch: 'Bengaluru Hub', status: 'Active', lastLogin: '12 min ago' },
    { id: 'USR-103', name: 'Marcus Vance', email: 'm.vance@fleet360.ttc.com', role: 'Commercial Driver', branch: 'Chennai Depot', status: 'Active', lastLogin: 'Just now' },
    { id: 'USR-104', name: 'Rahul Kumar', email: 'rahul.k@ttcfleet360.com', role: 'Dispatcher', branch: 'Hyderabad HQ', status: 'Active', lastLogin: '35 min ago' },
    { id: 'USR-105', name: 'Sarah Jenkins', email: 's.jenkins@fleet360.ttc.com', role: 'Fleet Manager', branch: 'Mumbai Port Hub', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'USR-106', name: 'David Miller', email: 'd.miller@fleet360.ttc.com', role: 'Commercial Driver', branch: 'Delhi NCR Hub', status: 'On Duty', lastLogin: '1 hour ago' },
    { id: 'USR-107', name: 'Priya Sharma', email: 'priya.s@ttcfleet360.com', role: 'Compliance Auditor', branch: 'Hyderabad HQ', status: 'Active', lastLogin: '4 hours ago' }
  ];

  const filtered = usersList.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.branch.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="module-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">User & Personnel Management</h2>
          <p className="module-desc">Centralized access control, user accounts, and credentials for 120 enterprise members.</p>
        </div>
        <div className="module-actions-row">
          <button className="btn-primary">
            <PlusCircle size={15} /> Add New User
          </button>
        </div>
      </div>

      <div className="fleet-table-card">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search user name, email, branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="card-select-pill"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: '6px 12px' }}
            >
              <option value="ALL">All Roles</option>
              <option value="Admin">Super Admins</option>
              <option value="Manager">Fleet Managers</option>
              <option value="Driver">Drivers</option>
              <option value="Dispatcher">Dispatchers</option>
            </select>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 18px' }}>User Details</th>
              <th style={{ padding: '12px 18px' }}>Role</th>
              <th style={{ padding: '12px 18px' }}>Assigned Branch</th>
              <th style={{ padding: '12px 18px' }}>Status</th>
              <th style={{ padding: '12px 18px' }}>Last Activity</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{u.email}</div>
                </td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    padding: '3px 9px',
                    borderRadius: '6px',
                    background: u.role.includes('Admin') ? 'rgba(255,122,26,0.15)' : u.role.includes('Manager') ? 'rgba(0,210,255,0.15)' : 'rgba(16,185,129,0.15)',
                    color: u.role.includes('Admin') ? '#FF7A1A' : u.role.includes('Manager') ? '#00d2ff' : '#10b981'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{u.branch}</td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    color: '#10b981'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{u.lastLogin}</td>
                <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '8px' }}>
                    <Edit2 size={14} />
                  </button>
                  <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 2. ROLE & PERMISSIONS VIEW (RBAC)
// ============================================================================
export const RolePermissionsView = () => {
  const roles = [
    { role: 'Super Admin', desc: 'Full root access to all modules, subscriptions, billing, users & system parameters', members: 4, color: '#f97316' },
    { role: 'Fleet Operations Manager', desc: 'Manage vehicle allocations, dispatch trips, maintenance tickets, drivers and fuel audits', members: 18, color: '#00d2ff' },
    { role: 'Commercial Driver', desc: 'Mobile driver app access, trip milestones, ePOD delivery certification, fuel logging', members: 86, color: '#10b981' },
    { role: 'Logistics Dispatcher', desc: 'Live GPS vehicle telemetry monitoring, route re-optimization and customer dispatches', members: 12, color: '#a855f7' }
  ];

  const permissions = [
    { module: 'User & Credentials Management', admin: true, manager: false, driver: false, dispatcher: false },
    { module: 'Subscription & Billing Invoices', admin: true, manager: false, driver: false, dispatcher: false },
    { module: 'Vehicle Assets Registration', admin: true, manager: true, driver: false, dispatcher: false },
    { module: 'Dispatch Trips & Allocation', admin: true, manager: true, driver: false, dispatcher: true },
    { module: 'Live GPS Fleet Telemetry', admin: true, manager: true, driver: true, dispatcher: true },
    { module: 'Maintenance & Work Orders', admin: true, manager: true, driver: false, dispatcher: false },
    { module: 'Driver Electronic POD Certification', admin: true, manager: true, driver: true, dispatcher: false }
  ];

  return (
    <div className="module-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Role-Based Access Control (RBAC)</h2>
          <p className="module-desc">Enforce granular security policies across enterprise administrative and operational roles.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {roles.map(r => (
          <div key={r.role} className="dashboard-card" style={{ borderLeft: `4px solid ${r.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{r.role}</div>
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '10px', color: '#cbd5e1' }}>
                {r.members} Users
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <div className="fleet-table-card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, color: '#fff' }}>
          Role Permission Privilege Matrix
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 18px' }}>Enterprise Module</th>
              <th style={{ padding: '12px 18px', textAlign: 'center' }}>Super Admin</th>
              <th style={{ padding: '12px 18px', textAlign: 'center' }}>Fleet Manager</th>
              <th style={{ padding: '12px 18px', textAlign: 'center' }}>Driver</th>
              <th style={{ padding: '12px 18px', textAlign: 'center' }}>Dispatcher</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px', color: '#fff', fontWeight: 500 }}>{p.module}</td>
                <td style={{ padding: '12px 18px', textAlign: 'center' }}>{p.admin ? '✅ Full Access' : '❌'}</td>
                <td style={{ padding: '12px 18px', textAlign: 'center' }}>{p.manager ? '✅ Operations' : '❌ Restricted'}</td>
                <td style={{ padding: '12px 18px', textAlign: 'center' }}>{p.driver ? '✅ App Only' : '❌'}</td>
                <td style={{ padding: '12px 18px', textAlign: 'center' }}>{p.dispatcher ? '✅ Telemetry' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 3. BRANCH MANAGEMENT VIEW
// ============================================================================
export const BranchManagementView = () => {
  const branches = [
    { city: 'Hyderabad', hubName: 'Central Logistics Hub (HQ)', vehicles: 48, drivers: 42, activeTrips: 18, manager: 'Alexander Mercer', share: '35%' },
    { city: 'Bengaluru', hubName: 'South Freight Distribution Center', vehicles: 36, drivers: 32, activeTrips: 14, manager: 'Vikram Malhotra', share: '30%' },
    { city: 'Chennai', hubName: 'Maritime Port Container Terminal', vehicles: 24, drivers: 20, activeTrips: 8, manager: 'Prakash Rao', share: '20%' },
    { city: 'Mumbai', hubName: 'Western Gateway Hub', vehicles: 12, drivers: 10, activeTrips: 4, manager: 'Sarah Jenkins', share: '10%' },
    { city: 'Delhi NCR', hubName: 'Northern Terminal Logistics Depot', vehicles: 8, drivers: 6, activeTrips: 3, manager: 'Karan Mehra', share: '5%' }
  ];

  return (
    <div className="module-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Branch & Regional Hub Distribution</h2>
          <p className="module-desc">Overview of 12 nationwide distribution depots, vehicle allocations and branch regional performance.</p>
        </div>
        <button className="btn-primary">
          <PlusCircle size={15} /> Add New Regional Branch
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        {branches.map(b => (
          <div key={b.city} className="dashboard-card" style={{ gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#f97316" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{b.city}</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#f97316', background: 'rgba(249,115,22,0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                {b.share} Volume
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{b.hubName}</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{b.vehicles}</div>
                <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Vehicles</div>
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{b.drivers}</div>
                <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Drivers</div>
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#10b981' }}>{b.activeTrips}</div>
                <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Active Trips</div>
              </div>
            </div>

            <div style={{ fontSize: '11.5px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
              <span>Regional Director:</span>
              <strong style={{ color: '#fff' }}>{b.manager}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 4. SUBSCRIPTION MANAGEMENT VIEW
// ============================================================================
export const SubscriptionManagementView = () => {
  return (
    <div className="module-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Subscription & Licensing Management</h2>
          <p className="module-desc">Active commercial plans, recurring billing schedules, and enterprise licensing.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div className="dashboard-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Basic Fleet</div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: '#f97316', margin: '12px 0' }}>₹999<span style={{ fontSize: '14px', color: '#94a3b8' }}>/mo</span></div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>For regional operators up to 10 vehicles</div>
          <div style={{ textAlign: 'left', fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>✔ Real-time GPS Tracking</div>
            <div>✔ Basic Fuel Auditing</div>
            <div>✔ Standard Driver Mobile App</div>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: '24px', textAlign: 'center', border: '2px solid #f59e0b', background: '#141c2e' }}>
          <span style={{ background: '#f59e0b', color: '#000', fontSize: '11px', fontWeight: 800, padding: '3px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>Most Popular</span>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', marginTop: '8px' }}>Premium Logistics</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#fbbf24', margin: '12px 0' }}>₹2,499<span style={{ fontSize: '14px', color: '#94a3b8' }}>/mo</span></div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>For expanding fleets up to 50 assets</div>
          <div style={{ textAlign: 'left', fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>✔ Everything in Basic</div>
            <div>✔ Automated Route Optimization</div>
            <div>✔ Electronic POD Certification</div>
            <div>✔ Work Order Maintenance Automation</div>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Enterprise 360</div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: '#00d2ff', margin: '12px 0' }}>₹4,999<span style={{ fontSize: '14px', color: '#94a3b8' }}>/mo</span></div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>Unlimited nationwide multi-branch operations</div>
          <div style={{ textAlign: 'left', fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>✔ Unlimited Vehicles & Telemetry</div>
            <div>✔ Full REST API & ERP Integrations</div>
            <div>✔ Dedicated SLA & 24/7 Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. AUDIT LOGS & SETTINGS VIEWS
// ============================================================================
export const AuditLogsView = () => {
  const logs = [
    { time: '17:04:12', user: 'admin@ttcfleet360.com', action: 'ADMIN_SESSION_START', ip: '192.168.1.104', status: 'SUCCESS' },
    { time: '16:58:30', user: 'manager@ttcfleet360.com', action: 'DISPATCH_VEHICLE_TTC-8492', ip: '192.168.1.118', status: 'SUCCESS' },
    { time: '16:42:15', user: 'm.vance@fleet360.ttc.com', action: 'DRIVER_CONFIRM_PICKUP', ip: '10.0.4.52', status: 'SUCCESS' },
    { time: '16:15:00', user: 'system_scheduler', action: 'GPS_TELEMETRY_SYNC', ip: 'internal', status: 'SUCCESS' },
    { time: '15:30:22', user: 'alexander.m', action: 'UPDATE_BRANCH_CONFIG', ip: '192.168.1.104', status: 'SUCCESS' }
  ];

  return (
    <div className="module-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Security & System Audit Trail</h2>
          <p className="module-desc">Immutable audit logs recording authentication events, dispatch authorizations, and system changes.</p>
        </div>
      </div>

      <div className="fleet-table-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 18px' }}>Timestamp</th>
              <th style={{ padding: '12px 18px' }}>Principal User</th>
              <th style={{ padding: '12px 18px' }}>Action Logged</th>
              <th style={{ padding: '12px 18px' }}>IP / Source</th>
              <th style={{ padding: '12px 18px' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px', color: '#94a3b8' }}>{l.time}</td>
                <td style={{ padding: '12px 18px', color: '#fff', fontWeight: 600 }}>{l.user}</td>
                <td style={{ padding: '12px 18px', color: '#FF9E4A', fontFamily: 'monospace' }}>{l.action}</td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1' }}>{l.ip}</td>
                <td style={{ padding: '12px 18px', color: '#10b981', fontWeight: 700 }}>{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
