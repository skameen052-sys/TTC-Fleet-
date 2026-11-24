import React, { useState, useEffect } from 'react';
import { workflowService } from '../../services/workflowService';
import {
  Truck,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Layers,
  FileText,
  Wrench,
  UserCheck,
  ClipboardCheck,
  BarChart3,
  Bell,
  User,
  ShieldCheck,
  Calendar,
  Fuel,
  Download,
  AlertTriangle,
  UploadCloud,
  CheckCheck,
  Radio,
  ExternalLink
} from 'lucide-react';

// 2. Vehicle Management View
export const VehicleManagementView = ({ vehicles = [], onAddVehicle }) => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = vehicles.filter(v => {
    const matchCat = filterCategory === 'ALL' || v.category === filterCategory;
    const matchStat = filterStatus === 'ALL' || v.status === filterStatus;
    const matchSearch =
      v.regNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.vin.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="content-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Truck size={18} color="#2563eb" />
              <span>Vehicle Fleet Inventory Management</span>
            </h2>
            <p className="section-subtitle">Real-time status, specifications, odometer & assignments for {vehicles.length} assets</p>
          </div>
          <button className="btn btn-primary" onClick={onAddVehicle}>
            <PlusCircle size={15} /> Add Vehicle Asset
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="global-search-container" style={{ width: 260 }}>
            <Search className="search-icon-left" size={14} />
            <input
              type="text"
              className="search-input"
              placeholder="Search registration, VIN, make..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="form-select" style={{ width: 180 }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            <option value="Heavy Duty Truck">Heavy Duty Truck</option>
            <option value="Electric Cargo">Electric Cargo</option>
            <option value="Refrigerated Truck">Refrigerated Truck</option>
            <option value="Delivery Cargo Van">Delivery Cargo Van</option>
            <option value="Utility Van">Utility Van</option>
          </select>

          <select className="form-select" style={{ width: 170 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Waiting for Assignment">Waiting for Assignment</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Asset Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Fuel / Powertrain</th>
                <th>Odometer</th>
                <th>Assigned Operator</th>
                <th>Current Depot / Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{v.regNumber}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>VIN: {v.vin.substring(0, 10)}...</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{v.year} {v.make} {v.model}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Cap: {(v.maxPayloadKg / 1000).toFixed(1)}t</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', color: '#334155' }}>{v.category}</span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${v.status === 'Available'
                        ? 'status-available'
                        : v.status === 'On Trip'
                          ? 'status-ontrip'
                          : v.status === 'Under Maintenance'
                            ? 'status-maintenance'
                            : v.status === 'Waiting for Assignment'
                              ? 'status-waiting'
                              : 'status-outofservice'
                        }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: v.fuelType === 'Electric' ? '#10b981' : '#1e293b' }}>
                      {v.fuelType}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>
                    {v.mileage.toLocaleString()} km
                  </td>
                  <td>
                    {v.assignedDriverName ? (
                      <span style={{ fontWeight: '600', color: '#2563eb' }}>{v.assignedDriverName}</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>
                    {v.currentLocation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. Vehicle Categories View
export const VehicleCategoriesView = ({ vehicles = [] }) => {
  const categories = [
    { name: 'Heavy Duty Truck', desc: 'Long-haul freight, tractor units & semi-trailers (up to 26t payload)', defaultSpecs: 'Diesel & High Torque' },
    { name: 'Electric Cargo', desc: 'Zero-emission urban freight & battery-electric delivery haulers', defaultSpecs: '100% BEV (500mi range)' },
    { name: 'Refrigerated Truck', desc: 'Cold chain temperature-controlled logistics (-25°C to +15°C)', defaultSpecs: 'ThermoKing Carrier Reefer' },
    { name: 'Delivery Cargo Van', desc: 'Last-mile urban delivery & high-roof commercial parcels', defaultSpecs: 'Turbo Diesel / Gas' },
    { name: 'Utility Van', desc: 'Fleet maintenance service, mobile diagnostics & utility support', defaultSpecs: 'Service body outfitted' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="content-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Layers size={18} color="#2563eb" />
              <span>Fleet Vehicle Categories & Classifications</span>
            </h2>
            <p className="section-subtitle">Vehicle class breakdown, specs, active assignments & capacity</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {categories.map((cat, idx) => {
            const count = vehicles.filter(v => v.category === cat.name).length;
            const onTripCount = vehicles.filter(v => v.category === cat.name && v.status === 'On Trip').length;
            const availableCount = vehicles.filter(v => v.category === cat.name && v.status === 'Available').length;
            return (
              <div key={idx} style={{ padding: '18px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{cat.name}</h3>
                  <span style={{ fontSize: '12px', fontWeight: '700', backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '9999px' }}>
                    {count} Assets
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: 12 }}>{cat.desc}</p>
                <div style={{ display: 'flex', gap: 12, fontSize: '12px', color: '#334155' }}>
                  <span>Dispatched: <strong style={{ color: '#2563eb' }}>{onTripCount}</strong></span>
                  <span>Standby: <strong style={{ color: '#16a34a' }}>{availableCount}</strong></span>
                  <span>Spec: <strong>{cat.defaultSpecs}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 4. Vehicle Allocation View
export const VehicleAllocationView = ({ vehicles = [], assignments = [], onAssignVehicle }) => {
  const [wfState, setWfState] = useState(() => workflowService.getState());

  useEffect(() => {
    return workflowService.subscribe((newState) => setWfState(newState));
  }, []);

  const pendingAllocations = wfState.allocations?.filter(a => a.status === 'Pending') || [];

  const handleQuickConfirm = (req) => {
    const availableVehicle = vehicles.find(v => v.status === 'Available') || { regNumber: 'TTC-8492-HD' };
    workflowService.confirmAllocation(req.requestId, {
      vehicleReg: availableVehicle.regNumber,
      driverId: 'D-01',
      driverName: 'Marcus Vance',
      driverPhone: '+1 (555) 019-2834',
      actor: 'Vikram Malhotra'
    });
    if (onAssignVehicle) {
      onAssignVehicle({
        vehicleReg: availableVehicle.regNumber,
        driverId: 'D-01',
        routeName: req.route,
        expectedReturn: 'Tomorrow 18:00'
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Pending Allocation Requests Inbox */}
      <div className="content-card" style={{ border: pendingAllocations.length > 0 ? '1px solid #fed7aa' : '1px solid #e2e8f0', backgroundColor: pendingAllocations.length > 0 ? '#fffaf5' : '#ffffff' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: pendingAllocations.length > 0 ? '#ea580c' : '#16a34a' }} />
              <span>Pending Allocation Requests (from Logistics Control)</span>
              {pendingAllocations.length > 0 && (
                <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#ea580c', color: '#ffffff', padding: '2px 8px', borderRadius: 12 }}>
                  {pendingAllocations.length} Pending
                </span>
              )}
            </h2>
            <p className="section-subtitle">
              Customer orders authorized by Logistics Manager requiring commercial asset and CDL driver assignment
            </p>
          </div>
        </div>

        {pendingAllocations.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            <CheckCircle2 size={24} color="#16a34a" style={{ margin: '0 auto 6px' }} />
            <div>All allocation requests fulfilled. Fleet resources currently balanced.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pendingAllocations.map(req => (
              <div key={req.requestId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 8, border: '1px solid #fed7aa', backgroundColor: '#ffffff' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, color: '#c2410c', fontSize: '13.5px' }}>{req.requestId}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Shipment: <strong>{req.shipmentId}</strong> | Order: <strong>{req.orderId}</strong></span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    {req.route}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: 2 }}>
                    Asset Type: <strong style={{ color: '#0f172a' }}>{req.requestedVehicleType}</strong> &bull; Capacity: <strong style={{ color: '#0f172a' }}>{req.requiredCapacityKg} kg</strong>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ea580c', borderColor: '#ea580c', padding: '8px 16px', fontSize: '12.5px', fontWeight: 700 }}
                  onClick={() => handleQuickConfirm(req)}
                >
                  <UserCheck size={14} /> Allocate Vehicle & Driver
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Vehicle Allocation Board */}
      <div className="content-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span>Vehicle Allocation & Dispatch Board</span>
            </h2>
            <p className="section-subtitle">Active freight corridor allocations, schedules and return expectations</p>
          </div>
          <button className="btn btn-primary" onClick={onAssignVehicle}>
            <PlusCircle size={15} /> Allocate Vehicle
          </button>
        </div>

        <div className="table-responsive">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Allocation ID</th>
                <th>Vehicle Asset</th>
                <th>Assigned Operator</th>
                <th>Route Corridor</th>
                <th>Assigned Date</th>
                <th>Expected Return</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(asg => (
                <tr key={asg.id}>
                  <td style={{ fontWeight: '700', color: '#2563eb' }}>{asg.id}</td>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>{asg.vehicleReg}</td>
                  <td style={{ fontWeight: '600', color: '#1e293b' }}>{asg.driverName}</td>
                  <td>{asg.routeName}</td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>{asg.assignedDate}</td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>{asg.expectedReturn}</td>
                  <td><span className="status-pill status-ontrip">{asg.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 5. Vehicle Availability View
export const VehicleAvailabilityView = ({ vehicles = [], onAssignVehicle }) => {
  const available = vehicles.filter(v => v.status === 'Available');
  const waiting = vehicles.filter(v => v.status === 'Waiting for Assignment');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="content-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <CheckCircle2 size={18} color="#16a34a" />
              <span>Vehicle Availability & Depot Standby</span>
            </h2>
            <p className="section-subtitle">{available.length} vehicles ready for immediate assignment & dispatch</p>
          </div>
          <button className="btn btn-primary" onClick={onAssignVehicle}>
            <UserCheck size={15} /> Assign Ready Vehicle
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {available.map(v => (
            <div key={v.id} style={{ padding: '16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>{v.regNumber}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                  READY
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{v.make} {v.model}</div>
              <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>{v.category} &bull; {v.fuelType}</div>
              <div style={{ fontSize: '11.5px', color: '#059669', marginBottom: 12 }}>Bay: {v.currentLocation}</div>
              <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={onAssignVehicle}>
                Dispatch Asset
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. Vehicle Documents View
export const VehicleDocumentsView = ({ maintenanceData }) => {
  const docs = [
    { id: 'DOC-101', vehicle: 'TTC-8492-HD', type: 'Commercial Vehicle Registration', exp: '2027-04-15', status: 'Valid', s3Key: 's3://ttc-fleet360-vault/docs/V101_reg.pdf' },
    { id: 'DOC-102', vehicle: 'TTC-8493-HD', type: 'Commercial Liability & Cargo Policy', exp: '2027-03-20', status: 'Valid', s3Key: 's3://ttc-fleet360-vault/docs/V102_ins.pdf' },
    { id: 'DOC-201', vehicle: 'TTC-8494-HD', type: 'Commercial Cargo Insurance', exp: '2026-12-05', status: 'Expiring Soon', s3Key: 's3://ttc-fleet360-vault/docs/V110_ins.pdf' },
    { id: 'DOC-202', vehicle: 'TTC-7202-DV', type: 'Annual DOT Safety Inspection', exp: '2026-12-12', status: 'Expiring Soon', s3Key: 's3://ttc-fleet360-vault/docs/V108_dot.pdf' },
    { id: 'DOC-203', vehicle: 'TTC-1089-UT', type: 'Emission Compliance Certificate', exp: '2026-11-10', status: 'Expired', s3Key: 's3://ttc-fleet360-vault/docs/V114_emis.pdf' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="content-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <FileText size={18} color="#2563eb" />
              <span>Vehicle Documents & Compliance Vault</span>
            </h2>
            <p className="section-subtitle">AWS S3 Cloud Storage synchronized document certificates, insurance policies & DOT compliance</p>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Document Upload: Integrated with AWS S3 SDK (software.amazon.awssdk:s3). Upload dialog.')}>
            <UploadCloud size={15} /> Upload Certificate to S3
          </button>
        </div>

        <div className="table-responsive">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Vehicle</th>
                <th>Document Type</th>
                <th>Expiration Date</th>
                <th>Compliance Status</th>
                <th>Storage Provider</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {docs.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>{d.id}</td>
                  <td style={{ fontWeight: '700', color: '#2563eb' }}>{d.vehicle}</td>
                  <td style={{ fontWeight: '600', color: '#1e293b' }}>{d.type}</td>
                  <td>{d.exp}</td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: d.status === 'Valid' ? '#dcfce7' : d.status === 'Expiring Soon' ? '#fef08a' : '#fee2e2',
                        color: d.status === 'Valid' ? '#16a34a' : d.status === 'Expiring Soon' ? '#b45309' : '#dc2626'
                      }}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                      AWS S3 Encrypted
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => alert(`Fetching encrypted copy from ${d.s3Key}`)}>
                      <ExternalLink size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 10. Driver Assignment View
export const DriverAssignmentView = ({ drivers = [], onOpenAssignModal }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <UserCheck size={18} color="#2563eb" />
            <span>Driver Roster & Commercial Operator Management</span>
          </h2>
          <p className="section-subtitle">{drivers.length} registered commercial CDL drivers with safety scores and vehicle assignments</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenAssignModal}>
          <UserCheck size={15} /> Assign Operator
        </button>
      </div>

      <div className="table-responsive">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Operator Name</th>
              <th>License (CDL)</th>
              <th>Duty Status</th>
              <th>Safety Score</th>
              <th>Operator Rating</th>
              <th>Assigned Vehicle</th>
              <th>Trips Completed</th>
              <th>Contact Phone</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.id}>
                <td>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{d.fullName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{d.email}</div>
                </td>
                <td style={{ fontWeight: '600', color: '#334155' }}>{d.licenseNumber}</td>
                <td>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: d.status === 'On Duty' ? '#dbeafe' : d.status === 'Available' ? '#dcfce7' : '#f1f5f9',
                      color: d.status === 'On Duty' ? '#1d4ed8' : d.status === 'Available' ? '#16a34a' : '#64748b'
                    }}
                  >
                    {d.status}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: '700', color: '#059669' }}>{d.safetyScore}/100</span>
                </td>
                <td>
                  <span style={{ fontWeight: '700', color: '#d97706' }}>{d.rating} ★</span>
                </td>
                <td>
                  {d.assignedVehicleReg ? (
                    <span style={{ fontWeight: '700', color: '#2563eb' }}>{d.assignedVehicleReg}</span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>Standby / Ready</span>
                  )}
                </td>
                <td style={{ fontWeight: '600' }}>{d.tripsCompleted}</td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{d.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// 11. Vehicle Inspection View
export const VehicleInspectionView = ({ inspections = [], onRecordInspection }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <ClipboardCheck size={18} color="#2563eb" />
            <span>Vehicle Pre & Post-Trip Inspection Log</span>
          </h2>
          <p className="section-subtitle">DOT regulatory compliance, tire depth, brake thickness and mechanical checklists</p>
        </div>
        <button className="btn btn-primary" onClick={onRecordInspection}>
          <ClipboardCheck size={15} /> Record Inspection
        </button>
      </div>

      <div className="table-responsive">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Inspection ID</th>
              <th>Vehicle</th>
              <th>Certified Inspector</th>
              <th>Date & Time</th>
              <th>Odometer</th>
              <th>Tires & Brakes</th>
              <th>Overall Result</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map(ins => (
              <tr key={ins.id}>
                <td style={{ fontWeight: '700', color: '#2563eb' }}>{ins.id}</td>
                <td style={{ fontWeight: '700', color: '#0f172a' }}>{ins.vehicleReg}</td>
                <td style={{ fontWeight: '600', color: '#1e293b' }}>{ins.inspectorName}</td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{ins.inspectionDate}</td>
                <td>{ins.odometerKm.toLocaleString()} km</td>
                <td style={{ fontSize: '12px' }}>
                  <div>Tires: {ins.tiresStatus}</div>
                  <div>Brakes: {ins.brakesStatus}</div>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: ins.overallStatus === 'Passed' ? '#dcfce7' : '#fee2e2',
                      color: ins.overallStatus === 'Passed' ? '#16a34a' : '#dc2626'
                    }}
                  >
                    {ins.overallStatus}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: '#475569', maxWidth: 240 }}>{ins.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// 12. Fleet Reports View
export const FleetReportsView = ({ analytics, fuelStats, maintenanceData }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <BarChart3 size={18} color="#2563eb" />
            <span>Executive Fleet Performance Reports</span>
          </h2>
          <p className="section-subtitle">Financial audit logs, utilization ratios and regulatory dispatch statements</p>
        </div>
        <button className="btn btn-secondary" onClick={() => alert('Generating full audit statement CSV & PDF...')}>
          <Download size={14} /> Download All Reports (ZIP)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
          <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: 4 }}>Monthly OPEX Financial Audit</h4>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: 12 }}>Fuel, preventive maintenance and insurance statements.</p>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: '12px' }} onClick={() => alert('Exporting OPEX Statement...')}>
            <Download size={13} /> Export CSV
          </button>
        </div>

        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
          <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: 4 }}>DOT Compliance & Safety Audit</h4>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: 12 }}>Vehicle inspections, CDL safety ratings and maintenance work orders.</p>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: '12px' }} onClick={() => alert('Exporting DOT Report...')}>
            <Download size={13} /> Export PDF
          </button>
        </div>

        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
          <h4 style={{ fontWeight: '700', color: '#0f172a', marginBottom: 4 }}>Carbon & Green Fleet Transition</h4>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: 12 }}>Electric vehicle deployment, diesel offset and sustainability metrics.</p>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: '12px' }} onClick={() => alert('Exporting Green Fleet Summary...')}>
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>
    </div>
  </div>
);

// 13. Notifications View
export const NotificationsView = ({ notifications = [], onMarkRead, onMarkAllRead }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Bell size={18} color="#2563eb" />
            <span>Fleet Alert & Notification Center</span>
          </h2>
          <p className="section-subtitle">Real-time system warnings, geofence breaches, inspection tags and document renewals</p>
        </div>
        <button className="btn btn-secondary" onClick={onMarkAllRead}>
          <CheckCheck size={14} /> Mark All as Read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            style={{
              padding: '16px 20px',
              borderRadius: '8px',
              border: `1px solid ${n.type === 'critical' ? '#fecaca' : n.type === 'warning' ? '#fef08a' : '#e2e8f0'}`,
              backgroundColor: n.read ? '#fafbfc' : n.type === 'critical' ? '#fff5f5' : n.type === 'warning' ? '#fffdf0' : '#f0f7ff',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: n.type === 'critical' ? '#dc2626' : n.type === 'warning' ? '#d97706' : '#2563eb',
                    color: 'white'
                  }}
                >
                  {n.type.toUpperCase()}
                </span>
                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13.5px' }}>{n.title}</span>
                {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2563eb' }} />}
              </div>
              <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{n.message}</p>
            </div>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 14. My Profile View
export const MyProfileView = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div className="content-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <User size={18} color="#2563eb" />
            <span>Fleet Manager Profile & System Security</span>
          </h2>
          <p className="section-subtitle">Authenticated session, credentials, JWT RBAC role and enterprise cluster configuration</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: 14 }}>Manager Identity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '13px' }}>
            <div><strong>Full Name:</strong> Alexandre Mercer</div>
            <div><strong>Role:</strong> Lead Fleet Dispatch & Logistics Operations Manager</div>
            <div><strong>Email:</strong> alex.mercer@fleet360.ttc.com</div>
            <div><strong>Department:</strong> North American Freight Logistics</div>
            <div><strong>Station:</strong> Chicago Central Depot Terminal Bay #1</div>
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: 14 }}>Security & Tech Stack Architecture</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12.5px', color: '#334155' }}>
            <div><strong>Authentication:</strong> JWT (Stateless Bearer Token, RS256)</div>
            <div><strong>Authorization:</strong> Spring Security RBAC (ROLE_FLEET_MANAGER)</div>
            <div><strong>Backend API:</strong> Java 17 &bull; Spring Boot 3 &bull; Spring Data JPA</div>
            <div><strong>Database:</strong> PostgreSQL &bull; Flyway Migrations</div>
            <div><strong>Caching Layer:</strong> Redis Sentinel (Distributed Cache)</div>
            <div><strong>Document Vault:</strong> AWS S3 (KMS Server-Side Encryption)</div>
            <div><strong>Infrastructure:</strong> Dockerized &bull; CI/CD Automated Pipelines</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
