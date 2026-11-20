import React from 'react';
import { UserCheck, Truck, PlusCircle, CheckCircle2, Clock, MapPin, UserX } from 'lucide-react';

export const VehicleDriverAssignment = ({
  assignments = [],
  vehicles = [],
  drivers = [],
  onOpenAssignModal
}) => {
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const unassignedVehicles = vehicles.filter(v => !v.assignedDriverId && v.status !== 'Under Maintenance');
  const assignedDrivers = drivers.filter(d => d.status === 'On Duty' && d.assignedVehicleReg);
  const availableDrivers = drivers.filter(d => d.status === 'Available');

  return (
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <UserCheck size={18} color="#2563eb" />
            <span>Vehicle & Driver Assignment Hub</span>
          </h2>
          <p className="section-subtitle">Active crew pairings, dispatch routes & resource availability</p>
        </div>

        <button
          className="btn btn-primary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
          onClick={onOpenAssignModal}
        >
          <PlusCircle size={13} /> Assign Vehicle
        </button>
      </div>

      {/* 4 Roster Stat Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Active Assignments</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{assignments.length}</div>
          <div style={{ fontSize: '10.5px', color: '#2563eb' }}>Dispatched corridors</div>
        </div>

        <div style={{ padding: '10px 14px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
          <div style={{ fontSize: '11px', color: '#047857', fontWeight: '600' }}>Available for Assignment</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#065f46' }}>{availableVehicles.length}</div>
          <div style={{ fontSize: '10.5px', color: '#047857' }}>Ready at staging depot</div>
        </div>

        <div style={{ padding: '10px 14px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: '600' }}>Assigned Drivers</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e40af' }}>{assignedDrivers.length}</div>
          <div style={{ fontSize: '10.5px', color: '#1d4ed8' }}>Active CDL operators</div>
        </div>

        <div style={{ padding: '10px 14px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fef08a' }}>
          <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '600' }}>Available Reserve Drivers</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#92400e' }}>{availableDrivers.length}</div>
          <div style={{ fontSize: '10.5px', color: '#b45309' }}>Standby on call</div>
        </div>
      </div>

      {/* Grid: Recently Assigned / Active Trips Table + Available Vehicles for Assignment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>
        {/* Active Assignments Table */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: 10 }}>
            Recently Assigned Vehicles & Active Trips
          </div>

          <div className="table-responsive">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Assigned Driver</th>
                  <th>Route / Corridor</th>
                  <th>Status</th>
                  <th>Expected Return</th>
                </tr>
              </thead>
              <tbody>
                {assignments.slice(0, 5).map((asg) => (
                  <tr key={asg.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{asg.vehicleReg}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{asg.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{asg.driverName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{asg.driverId}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#334155' }}>{asg.routeName}</span>
                    </td>
                    <td>
                      <span className="status-pill status-ontrip">
                        {asg.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {asg.expectedReturn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Vehicles Ready for Assignment */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Available for Next Assignment</span>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>{availableVehicles.length} Standby</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 310, overflowY: 'auto' }}>
            {availableVehicles.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                All operational vehicles are currently assigned.
              </div>
            ) : (
              availableVehicles.map((v) => (
                <div
                  key={v.id}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '12.5px' }}>{v.regNumber}</span>
                      <span style={{ fontSize: '10.5px', backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: '600', padding: '1px 5px', borderRadius: '3px' }}>
                        Ready
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {v.make} {v.model} &bull; {v.category}
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    onClick={onOpenAssignModal}
                  >
                    Assign
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
