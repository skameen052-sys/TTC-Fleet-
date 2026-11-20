import React from 'react';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock, FileWarning, PlusCircle } from 'lucide-react';

export const MaintenanceOverview = ({ maintenanceData, onOpenScheduleModal }) => {
  const {
    dueForServiceCount,
    upcomingMaintenanceCount,
    underRepairCount,
    completedThisMonthCount,
    monthlyExpense,
    records,
    expiringDocuments
  } = maintenanceData;

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Wrench size={18} color="#2563eb" />
            <span>Maintenance & Compliance Health</span>
          </h2>
          <p className="section-subtitle">Work orders, scheduled preventive overhauls & document renewals</p>
        </div>

        <button
          className="btn btn-primary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
          onClick={onOpenScheduleModal}
        >
          <PlusCircle size={13} /> Schedule Service
        </button>
      </div>

      {/* 5 Maintenance KPI Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
        <div style={{ padding: '10px 12px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
          <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '600' }}>Due for Service</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#92400e', marginTop: 2 }}>{dueForServiceCount}</div>
          <div style={{ fontSize: '10.5px', color: '#b45309' }}>Immediate inspection</div>
        </div>

        <div style={{ padding: '10px 12px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: '600' }}>Upcoming Service</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e40af', marginTop: 2 }}>{upcomingMaintenanceCount}</div>
          <div style={{ fontSize: '10.5px', color: '#1d4ed8' }}>Next 14 business days</div>
        </div>

        <div style={{ padding: '10px 12px', backgroundColor: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
          <div style={{ fontSize: '11px', color: '#7e22ce', fontWeight: '600' }}>Under Active Repair</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#6b21a8', marginTop: 2 }}>{underRepairCount}</div>
          <div style={{ fontSize: '10.5px', color: '#7e22ce' }}>In certified service bay</div>
        </div>

        <div style={{ padding: '10px 12px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
          <div style={{ fontSize: '11px', color: '#047857', fontWeight: '600' }}>Completed (MTD)</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#065f46', marginTop: 2 }}>{completedThisMonthCount}</div>
          <div style={{ fontSize: '10.5px', color: '#047857' }}>All checks validated</div>
        </div>

        <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Maintenance Spend</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginTop: 2 }}>
            ${monthlyExpense.toLocaleString()}
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b' }}>Month-to-date total</div>
        </div>
      </div>

      {/* Grid: Active Work Orders + Expiring Vehicle Documents */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Active & Scheduled Work Orders */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: 10 }}>
            Active Work Orders & Upcoming Maintenance
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {records.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{rec.vehicleReg}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '1px 7px',
                        borderRadius: '4px',
                        backgroundColor: rec.status === 'Under Repair' ? '#ede9fe' : rec.status === 'Upcoming' ? '#eff6ff' : '#dcfce7',
                        color: rec.status === 'Under Repair' ? '#7c3aed' : rec.status === 'Upcoming' ? '#2563eb' : '#16a34a'
                      }}
                    >
                      {rec.status}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: rec.priority === 'High' ? '#fee2e2' : '#f1f5f9',
                        color: rec.priority === 'High' ? '#dc2626' : '#64748b'
                      }}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <div style={{ fontWeight: '600', color: '#334155', fontSize: '12.5px' }}>{rec.serviceType}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: 2 }}>
                    {rec.serviceCenter} &bull; Sched: {rec.scheduledDate}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>
                    ${rec.cost.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>WO #{rec.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Insurance & Compliance Documents */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileWarning size={15} color="#d97706" />
            <span>Document & Insurance Expiry Reminders</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {expiringDocuments.map((doc) => (
              <div
                key={doc.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: doc.status === 'Expired' ? '#fef2f2' : '#fffbeb',
                  border: `1px solid ${doc.status === 'Expired' ? '#fecaca' : '#fef08a'}`,
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{doc.vehicleReg}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: doc.status === 'Expired' ? '#dc2626' : '#d97706',
                      color: 'white'
                    }}
                  >
                    {doc.status}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#1e293b' }}>{doc.docType}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: 4 }}>
                  <span>Expiry: {doc.expiryDate}</span>
                  <span style={{ fontWeight: '600', color: doc.status === 'Expired' ? '#dc2626' : '#d97706' }}>
                    {doc.daysRemaining > 0 ? `${doc.daysRemaining} days left` : 'Overdue Renewal'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#475569' }}>
            <strong>DOT & Insurance Policy:</strong> Notifications trigger 30 days prior to certificate expiration. Renewal documents automatically sync to AWS S3 storage.
          </div>
        </div>
      </div>
    </div>
  );
};
