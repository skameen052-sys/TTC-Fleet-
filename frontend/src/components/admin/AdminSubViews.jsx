import React, { useState, useEffect } from 'react';
import { workflowService } from '../../services/workflowService';
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
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Fleet Manager', branch: 'Hyderabad HQ' });

  const [usersList, setUsersList] = useState([
    { id: 'USR-101', name: 'Alexander Mercer', email: 'admin@ttcfleet360.com', role: 'Super Admin', branch: 'Hyderabad HQ', status: 'Active', lastLogin: '2 min ago' },
    { id: 'USR-102', name: 'Vikram Malhotra', email: 'manager@ttcfleet360.com', role: 'Fleet Manager', branch: 'Bengaluru Hub', status: 'Active', lastLogin: '12 min ago' },
    { id: 'USR-103', name: 'Marcus Vance', email: 'm.vance@fleet360.ttc.com', role: 'Commercial Driver', branch: 'Chennai Depot', status: 'Active', lastLogin: 'Just now' },
    { id: 'USR-104', name: 'Rahul Kumar', email: 'rahul.k@ttcfleet360.com', role: 'Dispatcher', branch: 'Hyderabad HQ', status: 'Active', lastLogin: '35 min ago' },
    { id: 'USR-105', name: 'Sarah Jenkins', email: 's.jenkins@fleet360.ttc.com', role: 'Fleet Manager', branch: 'Mumbai Port Hub', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'USR-106', name: 'David Miller', email: 'd.miller@fleet360.ttc.com', role: 'Commercial Driver', branch: 'Delhi NCR Hub', status: 'On Duty', lastLogin: '1 hour ago' },
    { id: 'USR-107', name: 'Priya Sharma', email: 'priya.s@ttcfleet360.com', role: 'Compliance Auditor', branch: 'Hyderabad HQ', status: 'Active', lastLogin: '4 hours ago' }
  ]);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const created = {
      id: `USR-${Math.floor(108 + Math.random() * 900)}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      branch: newUser.branch,
      status: 'Active',
      lastLogin: 'Just now'
    };
    setUsersList([created, ...usersList]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'Fleet Manager', branch: 'Hyderabad HQ' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsersList(usersList.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsersList(usersList.filter(u => u.id !== id));
    }
  };

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
          <p className="module-desc">Centralized access control, user accounts, and credentials for enterprise members.</p>
        </div>
        <div className="module-actions-row">
          <button className="btn-primary" onClick={() => setIsAddUserOpen(true)}>
            <PlusCircle size={15} /> Add New User
          </button>
        </div>
      </div>

      {isAddUserOpen && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-card" style={{ maxWidth: '440px', width: '90%', padding: '24px', background: '#131929', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px' }}>Add New Personnel</h3>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Full Name</label>
                <input required className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Work Email</label>
                <input required type="email" className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Role</label>
                <select className="table-search-input" style={{ width: '100%', marginTop: '4px', background: '#0a1020', color: '#fff' }} value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Commercial Driver">Commercial Driver</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Warehouse Manager">Warehouse Manager</option>
                  <option value="Logistics Manager">Logistics Manager</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Assigned Branch</label>
                <input className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={newUser.branch} onChange={e => setNewUser({ ...newUser, branch: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsAddUserOpen(false)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-card" style={{ maxWidth: '440px', width: '90%', padding: '24px', background: '#131929', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px' }}>Edit User Details</h3>
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Full Name</label>
                <input required className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Role</label>
                <select className="table-search-input" style={{ width: '100%', marginTop: '4px', background: '#0a1020', color: '#fff' }} value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Commercial Driver">Commercial Driver</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Warehouse Manager">Warehouse Manager</option>
                  <option value="Logistics Manager">Logistics Manager</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Branch</label>
                <input className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={editingUser.branch} onChange={e => setEditingUser({ ...editingUser, branch: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditingUser(null)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Update User</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <button onClick={() => setEditingUser(u)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '8px' }} title="Edit User">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteUser(u.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete User">
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
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({ city: '', hubName: '', vehicles: '10', drivers: '8', manager: '' });

  const [branches, setBranches] = useState([
    { city: 'Hyderabad', hubName: 'Central Logistics Hub (HQ)', vehicles: 48, drivers: 42, activeTrips: 18, manager: 'Alexander Mercer', share: '35%' },
    { city: 'Bengaluru', hubName: 'South Freight Distribution Center', vehicles: 36, drivers: 32, activeTrips: 14, manager: 'Vikram Malhotra', share: '30%' },
    { city: 'Chennai', hubName: 'Maritime Port Container Terminal', vehicles: 24, drivers: 20, activeTrips: 8, manager: 'Prakash Rao', share: '20%' },
    { city: 'Mumbai', hubName: 'Western Gateway Hub', vehicles: 12, drivers: 10, activeTrips: 4, manager: 'Sarah Jenkins', share: '10%' },
    { city: 'Delhi NCR', hubName: 'Northern Terminal Logistics Depot', vehicles: 8, drivers: 6, activeTrips: 3, manager: 'Karan Mehra', share: '5%' }
  ]);

  const handleAddBranch = (e) => {
    e.preventDefault();
    if (!newBranch.city || !newBranch.hubName) return;
    const created = {
      city: newBranch.city,
      hubName: newBranch.hubName,
      vehicles: Number(newBranch.vehicles) || 10,
      drivers: Number(newBranch.drivers) || 8,
      activeTrips: 0,
      manager: newBranch.manager || 'Regional Supervisor',
      share: '5%'
    };
    setBranches([...branches, created]);
    setIsAddBranchOpen(false);
    setNewBranch({ city: '', hubName: '', vehicles: '10', drivers: '8', manager: '' });
  };

  return (
    <div className="module-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Branch & Regional Hub Distribution</h2>
          <p className="module-desc">Overview of nationwide distribution depots, vehicle allocations and branch regional performance.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddBranchOpen(true)}>
          <PlusCircle size={15} /> Add New Regional Branch
        </button>
      </div>

      {isAddBranchOpen && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-card" style={{ maxWidth: '440px', width: '90%', padding: '24px', background: '#131929', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px' }}>Register New Regional Hub</h3>
            <form onSubmit={handleAddBranch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>City</label>
                <input required className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={newBranch.city} onChange={e => setNewBranch({ ...newBranch, city: e.target.value })} placeholder="e.g. Pune, Kolkata" />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Hub Name</label>
                <input required className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={newBranch.hubName} onChange={e => setNewBranch({ ...newBranch, hubName: e.target.value })} placeholder="e.g. Western Corridor Depot" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Allocated Vehicles</label>
                  <input type="number" className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={newBranch.vehicles} onChange={e => setNewBranch({ ...newBranch, vehicles: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Assigned Drivers</label>
                  <input type="number" className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={newBranch.drivers} onChange={e => setNewBranch({ ...newBranch, drivers: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Hub Station Manager</label>
                <input className="table-search-input" style={{ width: '100%', marginTop: '4px' }} value={newBranch.manager} onChange={e => setNewBranch({ ...newBranch, manager: e.target.value })} placeholder="Manager Name" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsAddBranchOpen(false)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
  const [wfLogs, setWfLogs] = useState(() => workflowService.getState().auditLogs || []);

  useEffect(() => {
    return workflowService.subscribe((state) => {
      if (state.auditLogs) setWfLogs(state.auditLogs);
    });
  }, []);

  const displayLogs = wfLogs.length > 0 ? wfLogs : [
    { timestamp: '17:04:12', actorUsername: 'admin@ttcfleet360.com', action: 'ADMIN_SESSION_START', details: 'Session authenticated', entityType: 'SYSTEM' },
    { timestamp: '16:58:30', actorUsername: 'manager@ttcfleet360.com', action: 'DISPATCH_VEHICLE_TTC-8492', details: 'Assigned driver Marcus Vance', entityType: 'ALLOCATION' }
  ];

  return (
    <div className="module-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Security & System Audit Trail</h2>
          <p className="module-desc">Immutable audit logs recording real-time operations across Customer, Logistics, Fleet, Driver, Warehouse, and Finance portals.</p>
        </div>
      </div>

      <div className="fleet-table-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 18px' }}>Timestamp</th>
              <th style={{ padding: '12px 18px' }}>Actor Principal</th>
              <th style={{ padding: '12px 18px' }}>Role</th>
              <th style={{ padding: '12px 18px' }}>Action Logged</th>
              <th style={{ padding: '12px 18px' }}>Entity</th>
              <th style={{ padding: '12px 18px' }}>Operational Details</th>
            </tr>
          </thead>
          <tbody>
            {displayLogs.map((l, i) => (
              <tr key={l.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 18px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{l.timestamp || l.time}</td>
                <td style={{ padding: '12px 18px', color: '#fff', fontWeight: 600 }}>{l.actorUsername || l.user}</td>
                <td style={{ padding: '12px 18px', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', fontWeight: 700 }}>{l.actorRole || 'SYSTEM'}</td>
                <td style={{ padding: '12px 18px', color: '#FF9E4A', fontFamily: 'monospace', fontWeight: 600 }}>{l.action}</td>
                <td style={{ padding: '12px 18px', color: '#38bdf8' }}>{l.entityType || 'SYSTEM'}</td>
                <td style={{ padding: '12px 18px', color: '#cbd5e1', fontSize: '12.5px' }}>{l.details || 'Completed successfully'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
