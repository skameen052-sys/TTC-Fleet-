import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Filter, Download, Key, Shield, RefreshCw } from 'lucide-react';
import { auditService } from '../services/auditService';

export const AuditLogs = () => {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit', 'login'
  const [logs, setLogs] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [activeTab, searchTerm, moduleFilter, actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      if (activeTab === 'audit') {
        const res = await auditService.getAuditLogs({
          module: moduleFilter || undefined,
          action: actionFilter || undefined,
          search: searchTerm || undefined,
          size: 50,
        });
        if (res && res.data) {
          setLogs(res.data.content || []);
        }
      } else {
        const res = await auditService.getLoginHistory({ size: 50 });
        if (res && res.data) {
          setLoginHistory(res.data.content || []);
        }
      }
    } catch (err) {
      console.error('Failed to load logs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const listToExport = activeTab === 'audit' ? logs : loginHistory;
    if (listToExport.length === 0) return alert('No records to export');

    const headers = Object.keys(listToExport[0]).join(',');
    const rows = listToExport.map((item) =>
      Object.values(item)
        .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fleet360_${activeTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="module-container animate-fade-in">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Audit Logs & Activity Monitoring</h1>
          <p className="module-desc">
            Immutable trace of administrative events, record modifications, security events, and user logins.
          </p>
        </div>

        <div className="module-actions-row">
          <div style={{ display: 'flex', background: '#111726', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: activeTab === 'audit' ? '#f97316' : 'transparent',
                color: activeTab === 'audit' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '12.5px',
              }}
              onClick={() => setActiveTab('audit')}
            >
              Activity Audit Trail
            </button>
            <button
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: activeTab === 'login' ? '#f97316' : 'transparent',
                color: activeTab === 'login' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '12.5px',
              }}
              onClick={() => setActiveTab('login')}
            >
              Login & Session History
            </button>
          </div>

          <button className="btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button className="btn-secondary" onClick={fetchLogs}>
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="fleet-table-card">
        {activeTab === 'audit' && (
          <div className="table-toolbar">
            <div className="table-search-input">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search event details, user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                className="card-select-pill"
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                <option value="">All Modules</option>
                <option value="USERS">Users</option>
                <option value="ROLES">Roles</option>
                <option value="BRANCHES">Branches</option>
                <option value="SUBSCRIPTIONS">Subscriptions</option>
                <option value="SETTINGS">Settings</option>
                <option value="AUTH">Authentication</option>
              </select>

              <select
                className="card-select-pill"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">All Actions</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="LOGIN">LOGIN</option>
                <option value="RENEWAL">RENEWAL</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 1: Audit Activity Table */}
        {activeTab === 'audit' ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User Email</th>
                  <th>Module</th>
                  <th>Action</th>
                  <th>Event Details</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Loading audit events...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      No matching audit events found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '11.5px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{log.userEmail || 'System'}</td>
                      <td>
                        <span
                          style={{
                            background: 'rgba(14, 165, 233, 0.12)',
                            color: '#0ea5e9',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        >
                          {log.module}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: log.action === 'DELETE' ? '#ef4444' : log.action === 'CREATE' ? '#10b981' : '#f97316',
                            fontSize: '12px',
                          }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ color: '#cbd5e1' }}>{log.details}</td>
                      <td style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td>
                        <span className="status-pill status-active">{log.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Tab 2: Login History Table */
          <div style={{ overflowX: 'auto' }}>
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Login Time</th>
                  <th>User Email</th>
                  <th>IP Address</th>
                  <th>Approx Location</th>
                  <th>Client / Browser</th>
                  <th>Session Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Loading login records...
                    </td>
                  </tr>
                ) : loginHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      No login sessions recorded yet.
                    </td>
                  </tr>
                ) : (
                  loginHistory.map((lh) => (
                    <tr key={lh.id}>
                      <td style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                        {new Date(lh.timestamp).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{lh.email}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#cbd5e1' }}>
                        {lh.ipAddress}
                      </td>
                      <td>{lh.location || 'India'}</td>
                      <td style={{ fontSize: '11.5px', color: '#94a3b8', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lh.userAgent}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${lh.status === 'SUCCESS' ? 'status-active' : 'status-inactive'}`}
                        >
                          {lh.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
