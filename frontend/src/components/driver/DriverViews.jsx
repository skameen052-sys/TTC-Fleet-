import React, { useState } from 'react';
import {
  Truck,
  Navigation,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PackageCheck,
  PackageX,
  Boxes,
  Fuel,
  ClipboardCheck,
  FileText,
  Bell,
  User,
  ShieldCheck,
  Calendar,
  Phone,
  Camera,
  PenTool,
  Upload,
  ArrowRight,
  ChevronRight,
  Compass,
  AlertCircle
} from 'lucide-react';

/* =========================================================================
   1. MY TRIPS VIEW
   ========================================================================= */
export const MyTripsView = ({ trips = [], onSelectTrip }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredTrips = trips.filter(t => {
    if (filter === 'active' && t.status !== 'In Transit') return false;
    if (filter === 'upcoming' && t.status !== 'Upcoming') return false;
    if (filter === 'completed' && t.status !== 'Completed' && t.status !== 'Cancelled') return false;
    if (search && !t.id.toLowerCase().includes(search.toLowerCase()) && !t.destination.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">My Assigned Trips</h2>
          <p className="subview-subtitle">Review active dispatches, upcoming route bookings, and delivery commitments</p>
        </div>
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({trips.length})</button>
          <button className={`filter-tab ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active (1)</button>
          <button className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>Upcoming (2)</button>
          <button className={`filter-tab ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>History (3)</button>
        </div>
      </div>

      <div className="trips-cards-list">
        {filteredTrips.map(tr => (
          <div key={tr.id} className="trip-card-item">
            <div className="trip-card-top">
              <div className="trip-card-id-col">
                <span className="trip-id-text">{tr.id}</span>
                <span className="trip-order-text">Order: {tr.orderId}</span>
              </div>
              <span className={`status-pill ${tr.status === 'In Transit' ? 'status-ontrip' : tr.status === 'Upcoming' ? 'status-waiting' : tr.status === 'Completed' ? 'status-available' : 'status-outofservice'}`}>
                {tr.status}
              </span>
            </div>

            <div className="trip-route-display">
              <div className="route-point">
                <span className="dot-circle blue" />
                <span className="point-text">{tr.origin}</span>
              </div>
              <div className="route-line-connector" />
              <div className="route-point">
                <span className="dot-circle green" />
                <span className="point-text">{tr.destination}</span>
              </div>
            </div>

            <div className="trip-meta-row">
              <span className="meta-info"><Calendar size={13} /> {tr.date}</span>
              <span className="meta-info"><Compass size={13} /> {tr.distance}</span>
              <span className="meta-info"><Boxes size={13} /> {tr.cargo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   2. ACTIVE TRIP VIEW
   ========================================================================= */
export const ActiveTripView = ({ activeTrip, onAdvanceStage }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Active Dispatch: {activeTrip?.id}</h2>
          <p className="subview-subtitle">Order {activeTrip?.orderId} | Vehicle {activeTrip?.vehicleReg}</p>
        </div>
        <span className="status-pill status-ontrip">
          <span className="pulse-circle" style={{ width: 6, height: 6 }} /> {activeTrip?.status}
        </span>
      </div>

      <div className="content-card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#14213D', marginBottom: 12 }}>Trip Progress Lifecycle</h4>
        <div className="trip-lifecycle-timeline">
          {activeTrip?.stages?.map((stg) => (
            <div key={stg.id} className={`timeline-step-row ${stg.completed ? 'completed' : stg.active ? 'current-active' : 'upcoming'}`}>
              <div className="step-badge-indicator">
                {stg.completed ? <CheckCircle2 size={16} color="#16A36A" /> : stg.active ? <div className="pulse-stage-dot" /> : <span className="step-number">{stg.id}</span>}
              </div>
              <div className="step-text-wrap">
                <span className="step-name">{stg.name}</span>
                <span className="step-timestamp">{stg.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={onAdvanceStage}>
            <span>Advance Trip Stage</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. TRIP HISTORY VIEW
   ========================================================================= */
export const TripHistoryView = ({ trips = [] }) => {
  const historyTrips = trips.filter(t => t.status === 'Completed' || t.status === 'Cancelled');

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Trip History & Past Logs</h2>
          <p className="subview-subtitle">Archived commercial logs, delivery timestamps, and completed route statistics</p>
        </div>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Order ID</th>
              <th>Origin & Destination</th>
              <th>Date</th>
              <th>Distance</th>
              <th>Cargo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {historyTrips.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700, color: '#14213D' }}>{t.id}</td>
                <td>{t.orderId}</td>
                <td>{t.origin} → {t.destination}</td>
                <td>{t.date}</td>
                <td>{t.distance}</td>
                <td>{t.cargo}</td>
                <td>
                  <span className={`status-pill ${t.status === 'Completed' ? 'status-available' : 'status-outofservice'}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   4. MY VEHICLE VIEW
   ========================================================================= */
export const MyVehicleView = ({ vehicle, onReportIssue }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Assigned Commercial Asset: {vehicle?.regNumber}</h2>
          <p className="subview-subtitle">Powertrain specifications, safety inspections, and maintenance schedule</p>
        </div>
        <button className="btn btn-secondary" onClick={onReportIssue}>
          <AlertTriangle size={15} color="#EF5350" /> Report Vehicle Issue
        </button>
      </div>

      <div className="content-card">
        <div className="vehicle-info-card-inner">
          <div className="vehicle-photo-col">
            <img src="/assets/fleet-manager-trucks.jpg" alt="Freightliner Cascadia" className="vehicle-thumb-img" />
            <span className="vehicle-plate-pill">{vehicle?.regNumber}</span>
          </div>

          <div className="vehicle-specs-col">
            <div className="v-spec-row"><span className="v-key">Make & Model:</span><span className="v-val">{vehicle?.make} {vehicle?.model} ({vehicle?.year})</span></div>
            <div className="v-spec-row"><span className="v-key">Category:</span><span className="v-val">{vehicle?.category}</span></div>
            <div className="v-spec-row"><span className="v-key">VIN:</span><span className="v-val">{vehicle?.vin}</span></div>
            <div className="v-spec-row"><span className="v-key">Max Payload:</span><span className="v-val">{vehicle?.maxCapacity}</span></div>
            <div className="v-spec-row"><span className="v-key">Odometer:</span><span className="v-val highlight">{vehicle?.odometerKm?.toLocaleString()} km</span></div>
            <div className="v-spec-row"><span className="v-key">Fuel Level:</span><span className="v-val">{vehicle?.fuelLevel}</span></div>
            <div className="v-spec-row"><span className="v-key">Inspection:</span><span className="v-val" style={{ color: '#16A36A', fontWeight: 700 }}>✓ {vehicle?.inspectionStatus}</span></div>
          </div>
        </div>

        <div className="vehicle-alert-strip" style={{ marginTop: 20 }}>
          <Wrench size={16} color="#7955E8" />
          <span>{vehicle?.maintenanceAlert}</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. ROUTE & NAVIGATION VIEW
   ========================================================================= */
export const RouteNavView = ({ activeTrip, onToggleGps }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Route Navigation & Turn-by-Turn Guidance</h2>
          <p className="subview-subtitle">{activeTrip?.route?.origin} → {activeTrip?.route?.destination}</p>
        </div>
        <button className="btn btn-primary" onClick={onToggleGps}>
          {activeTrip?.route?.isGpsSharing ? 'GPS Active (Broadcasting)' : 'Resume GPS Broadcast'}
        </button>
      </div>

      <div className="content-card">
        <div className="route-stats-ribbon" style={{ marginBottom: 16 }}>
          <div className="route-stat-box"><span className="r-label">Location</span><span className="r-val">{activeTrip?.route?.currentLocation}</span></div>
          <div className="route-stat-box"><span className="r-label">Speed</span><span className="r-val highlight">{activeTrip?.route?.speedKmh} km/h</span></div>
          <div className="route-stat-box"><span className="r-label">Remaining</span><span className="r-val">{activeTrip?.route?.remainingKm} km</span></div>
          <div className="route-stat-box"><span className="r-label">ETA</span><span className="r-val highlight">{activeTrip?.route?.eta}</span></div>
        </div>

        <div className="nav-directions-list">
          <div className="dir-item passed"><span className="dir-mile">Mile 0</span><span>Depart Chicago Central Logistics Depot via I-90 E Ramp</span></div>
          <div className="dir-item passed"><span className="dir-mile">Mile 48</span><span>Continue on I-90 Tollway East past Gary IN</span></div>
          <div className="dir-item current"><span className="dir-mile">Mile 142</span><span>CURRENT: Stay in left lanes on I-90 E near Toledo OH (68 km/h)</span></div>
          <div className="dir-item upcoming"><span className="dir-mile">Mile 218</span><span>Take Exit 172B onto E 55th St towards Cleveland Freight Terminal</span></div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. PICKUP MANAGEMENT VIEW
   ========================================================================= */
export const PickupManagementView = ({ pickup, onConfirmPickup }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Pickup Management</h2>
          <p className="subview-subtitle">Freight loading certification and dock departure procedures</p>
        </div>
        <span className={`status-pill ${pickup?.isConfirmed ? 'status-available' : 'status-waiting'}`}>
          {pickup?.isConfirmed ? '✓ Goods Picked Up' : 'Pending Pickup'}
        </span>
      </div>

      <div className="content-card">
        <div className="pickup-details-list">
          <div className="detail-row"><span className="detail-key">Origin Facility:</span><span className="detail-val">{pickup?.address}</span></div>
          <div className="detail-row"><span className="detail-key">Cargo Manifest:</span><span className="detail-val">{pickup?.goodsDescription}</span></div>
          <div className="detail-row"><span className="detail-key">Quantity:</span><span className="detail-val highlight">{pickup?.packageQuantity}</span></div>
          <div className="detail-row"><span className="detail-key">Dock Supervisor:</span><span className="detail-val">{pickup?.contactName} ({pickup?.contactPhone})</span></div>
          <div className="detail-row"><span className="detail-key">Scheduled Time:</span><span className="detail-val">{pickup?.scheduledTime}</span></div>
          <div className="detail-row"><span className="detail-key">Certified Timestamp:</span><span className="detail-val">{pickup?.pickupTimestamp || 'Awaiting dock release'}</span></div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => alert(`Calling ${pickup?.contactPhone}...`)}>
            <Phone size={14} /> Call Dock Supervisor
          </button>
          <button className="btn btn-primary" onClick={onConfirmPickup} disabled={pickup?.isConfirmed}>
            <CheckCircle2 size={16} /> {pickup?.isConfirmed ? 'Pickup Certified' : 'Confirm Goods Loaded'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. DELIVERY MANAGEMENT VIEW
   ========================================================================= */
export const DeliveryManagementView = ({ delivery, onConfirmDelivery, onOpenPodModal }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Delivery Management & POD Hand-over</h2>
          <p className="subview-subtitle">Consignee arrival verification and digital signature confirmation</p>
        </div>
        <span className={`status-pill ${delivery?.isConfirmed ? 'status-available' : 'status-ontrip'}`}>
          {delivery?.isConfirmed ? '✓ Delivered' : 'In Transit'}
        </span>
      </div>

      <div className="content-card">
        <div className="pickup-details-list">
          <div className="detail-row"><span className="detail-key">Destination Terminal:</span><span className="detail-val">{delivery?.address}</span></div>
          <div className="detail-row"><span className="detail-key">Authorized Receiver:</span><span className="detail-val">{delivery?.receiverName} ({delivery?.receiverPhone})</span></div>
          <div className="detail-row"><span className="detail-key">Expected Arrival:</span><span className="detail-val">{delivery?.expectedTime}</span></div>
          <div className="detail-row"><span className="detail-key">Signature Status:</span><span className="detail-val">{delivery?.signatureCaptured ? '✓ Digital Signature Captured' : 'Pending Receiver'}</span></div>
          <div className="detail-row"><span className="detail-key">POD Bill of Lading:</span><span className="detail-val">{delivery?.podUploaded ? '✓ Stamped Document Uploaded' : 'Pending Upload'}</span></div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={onOpenPodModal}>
            <PenTool size={14} /> Capture Digital Signature & Photo
          </button>
          <button className="btn btn-primary" onClick={onConfirmDelivery} disabled={delivery?.isConfirmed}>
            <CheckCircle2 size={16} /> {delivery?.isConfirmed ? 'Delivery Certified' : 'Confirm Delivery Completion'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   8. SHIPMENT DETAILS VIEW
   ========================================================================= */
export const ShipmentDetailsView = ({ activeTrip }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Assigned Shipment Manifest: {activeTrip?.shipmentId}</h2>
          <p className="subview-subtitle">Commercial Bill of Lading and cargo classification details</p>
        </div>
      </div>

      <div className="content-card">
        <div className="pickup-details-list">
          <div className="detail-row"><span className="detail-key">Shipment ID:</span><span className="detail-val highlight">{activeTrip?.shipmentId}</span></div>
          <div className="detail-row"><span className="detail-key">Order Number:</span><span className="detail-val">{activeTrip?.orderId}</span></div>
          <div className="detail-row"><span className="detail-key">Cargo Classification:</span><span className="detail-val">General Freight / Industrial Hydraulics</span></div>
          <div className="detail-row"><span className="detail-key">Gross Weight:</span><span className="detail-val">14,200 kg (31,305 lbs)</span></div>
          <div className="detail-row"><span className="detail-key">Pallet Count:</span><span className="detail-val">18 Heavy Wooden Euro-Pallets</span></div>
          <div className="detail-row"><span className="detail-key">Special Handling:</span><span className="detail-val">Keep Dry, E-Track Strapping Required</span></div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   9. FUEL RECORDS VIEW
   ========================================================================= */
export const FuelRecordsView = ({ fuelLogs = [], onOpenFuelModal }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Driver Fuel & Trip Expenses</h2>
          <p className="subview-subtitle">Log commercial fuel fills, truck stop pump receipts, and DEF fluid entries</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenFuelModal}>
          <Fuel size={15} /> Add Fuel Entry
        </button>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>Date</th>
              <th>Station / Location</th>
              <th>Liters</th>
              <th>Cost ($)</th>
              <th>Odometer</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {fuelLogs.map(f => (
              <tr key={f.id}>
                <td style={{ fontWeight: 700, color: '#14213D' }}>{f.id}</td>
                <td>{f.date}</td>
                <td>{f.station}</td>
                <td>{f.liters} L</td>
                <td>${f.cost.toFixed(2)}</td>
                <td>{f.odometer?.toLocaleString()} km</td>
                <td><span className="status-pill status-available">{f.receiptStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   10. VEHICLE INSPECTION VIEW
   ========================================================================= */
export const VehicleInspectionView = ({ onReportIssue }) => {
  const [items, setItems] = useState([
    { id: 1, name: 'Tires & Tread Depth (Min 4/32")', pass: true },
    { id: 2, name: 'Air Brakes & Pressure Leakage Check', pass: true },
    { id: 3, name: 'Headlights, Signals & Marker Lamps', pass: true },
    { id: 4, name: 'Engine Oil & Coolant Levels', pass: true },
    { id: 5, name: 'Fifth-Wheel Coupling & Kingpin Lock', pass: true },
    { id: 6, name: 'Wipers, Washers & Windshield Glass', pass: true },
    { id: 7, name: 'Emergency Kit, Triangle & Fire Extinguisher', pass: true }
  ]);

  const toggleItem = (id) => {
    setItems(items.map(it => it.id === id ? { ...it, pass: !it.pass } : it));
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Daily Vehicle Inspection (DVIR)</h2>
          <p className="subview-subtitle">Mandatory DOT Pre-Trip / Post-Trip Driver Vehicle Inspection Report</p>
        </div>
        <button className="btn btn-secondary" onClick={onReportIssue}>
          <AlertTriangle size={15} color="#EF5350" /> Report Issue
        </button>
      </div>

      <div className="content-card">
        <div className="inspection-checklist">
          {items.map(item => (
            <div key={item.id} className="checklist-item-row" onClick={() => toggleItem(item.id)}>
              <span className="checklist-name">{item.name}</span>
              <button className={`checklist-toggle-btn ${item.pass ? 'pass' : 'fail'}`}>
                {item.pass ? '✓ PASS' : '⚠ ATTENTION'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={() => alert('Daily inspection certified and submitted to Fleet Safety.')}>
            <CheckCircle2 size={16} /> Submit Daily Pre-Trip Certification
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   11. DOCUMENTS VIEW
   ========================================================================= */
export const DocumentsView = ({ documents = [] }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Driver & Vehicle Documents</h2>
          <p className="subview-subtitle">Active Commercial Driver License, DOT Medical Card, and Insurance Certificates</p>
        </div>
      </div>

      <div className="documents-cards-grid">
        {documents.map(doc => (
          <div key={doc.id} className="doc-item-card">
            <div className="doc-icon-box">
              <FileText size={24} color="#3478F6" />
            </div>
            <div className="doc-info">
              <span className="doc-title">{doc.name}</span>
              <span className="doc-number">{doc.number}</span>
              <span className="doc-issuer">Issuer: {doc.issuer}</span>
              <div className="doc-bottom-row">
                <span className="doc-expiry">Expires: {doc.expiry}</span>
                <span className="status-pill status-available">{doc.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   12. NOTIFICATIONS VIEW
   ========================================================================= */
export const NotificationsView = ({ notifications = [] }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Driver Notifications & Dispatch Alerts</h2>
          <p className="subview-subtitle">Live bulletin board for route advisories, assignments, and weather alerts</p>
        </div>
      </div>

      <div className="driver-notifications-list content-card">
        {notifications.map(n => (
          <div key={n.id} className={`driver-notif-item ${n.type}`}>
            <div className="notif-icon-bubble">
              {n.type === 'emergency' ? <AlertCircle size={18} color="#EF5350" /> : <Bell size={18} color="#3478F6" />}
            </div>
            <div className="notif-body">
              <div className="notif-title-row">
                <span className="notif-title">{n.title}</span>
                <span className="notif-time">{n.time}</span>
              </div>
              <p className="notif-message">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   13. MY PROFILE VIEW
   ========================================================================= */
export const MyProfileView = ({ driver, onLogout }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Driver Profile & Credentials</h2>
          <p className="subview-subtitle">Driver ID: {driver?.id} | CDL License: {driver?.licenseNumber}</p>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          Sign Out
        </button>
      </div>

      <div className="content-card">
        <div className="profile-header-strip">
          <div className="profile-large-avatar">MV</div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14213D' }}>{driver?.fullName}</h3>
            <p style={{ fontSize: '13.5px', color: '#718096' }}>{driver?.licenseType} | Safety Rating: ★ {driver?.rating}</p>
          </div>
        </div>

        <div className="pickup-details-list" style={{ marginTop: 20 }}>
          <div className="detail-row"><span className="detail-key">Phone:</span><span className="detail-val">{driver?.phone}</span></div>
          <div className="detail-row"><span className="detail-key">Email:</span><span className="detail-val">{driver?.email}</span></div>
          <div className="detail-row"><span className="detail-key">Assigned Vehicle:</span><span className="detail-val highlight">{driver?.assignedVehicleReg}</span></div>
          <div className="detail-row"><span className="detail-key">Experience:</span><span className="detail-val">{driver?.experienceYears} Years Commercial Driving</span></div>
          <div className="detail-row"><span className="detail-key">Safety Score:</span><span className="detail-val" style={{ color: '#16A36A', fontWeight: 700 }}>{driver?.safetyScore}% (Gold Tier)</span></div>
          <div className="detail-row"><span className="detail-key">Lifetime Trips:</span><span className="detail-val">{driver?.tripsCompleted} Completed Runs</span></div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   MODALS FOR QUICK ACTIONS
   ========================================================================= */
export const DriverModals = {
  // 1. Fuel Modal
  FuelModal: ({ isOpen, onClose, onSubmit }) => {
    const [liters, setLiters] = useState('380');
    const [cost, setCost] = useState('475.00');
    const [odometer, setOdometer] = useState('74210');
    const [station, setStation] = useState('Pilot Travel Center #412, Toledo OH');

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">Log Fuel Refill Entry</h4>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Fuel Quantity (Liters)</label>
              <input type="number" className="form-input" value={liters} onChange={e => setLiters(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Total Amount ($)</label>
              <input type="number" step="0.01" className="form-input" value={cost} onChange={e => setCost(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Current Odometer (km)</label>
              <input type="number" className="form-input" value={odometer} onChange={e => setOdometer(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Fuel Station Name & Location</label>
              <input type="text" className="form-input" value={station} onChange={e => setStation(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Fuel Receipt Slip (Photo)</label>
              <div className="receipt-upload-mock">
                <Camera size={20} color="#718096" />
                <span>receipt_pilot_toledo_412.jpg (Attached)</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { onSubmit({ liters, cost, odometer, station }); onClose(); }}>
              Submit Fuel Record
            </button>
          </div>
        </div>
      </div>
    );
  },

  // 2. Report Issue Modal
  ReportIssueModal: ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [severity, setSeverity] = useState('Medium');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title" style={{ color: '#EF5350' }}>Report Vehicle Issue</h4>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Issue Summary</label>
              <input type="text" className="form-input" placeholder="e.g. Low air pressure in right trailer tire" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Severity Level</label>
              <select className="form-select" value={severity} onChange={e => setSeverity(e.target.value)}>
                <option value="Low">Low - Driveable until terminal</option>
                <option value="Medium">Medium - Inspection needed at next bay</option>
                <option value="High">High - Urgent roadside assistance required</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Detailed Notes</label>
              <textarea className="form-textarea" rows={3} placeholder="Describe unusual noises, dash indicator lights, or handling changes..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn" style={{ backgroundColor: '#EF5350', color: 'white' }} onClick={() => { onSubmit({ title, severity, description }); onClose(); }}>
              Submit Issue Ticket
            </button>
          </div>
        </div>
      </div>
    );
  },

  // 3. POD & Signature Modal
  PodModal: ({ isOpen, onClose, onSubmit }) => {
    const [sigName, setSigName] = useState('Sarah Jenkins');

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">Proof of Delivery (POD) & Consignee Signature</h4>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Authorized Receiver Full Name</label>
              <input type="text" className="form-input" value={sigName} onChange={e => setSigName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Receiver Digital Signature</label>
              <div className="signature-pad-box">
                <span className="signature-cursive">{sigName}</span>
                <span className="sig-verify-badge">✓ Digitally Verified via Stylus/Touch</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Signed Bill of Lading (BOL Photo)</label>
              <div className="receipt-upload-mock">
                <Camera size={20} color="#16A36A" />
                <span>bol_stamped_signed_cleveland.jpg (Ready)</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { onSubmit(sigName); onClose(); }}>
              Certify & Complete Delivery
            </button>
          </div>
        </div>
      </div>
    );
  },

  // 4. Contact Manager Modal
  ContactModal: ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">24/7 Logistics Dispatch Central</h4>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: '13.5px', color: '#17243A', marginBottom: 16 }}>
              Direct hotline to Chicago Central Logistics Control Room for corridor routing, dock clearance, or emergency support.
            </p>
            <div className="contact-hotline-item">
              <Phone size={18} color="#16A36A" />
              <div>
                <div style={{ fontWeight: 800, color: '#14213D' }}>Alexandre Mercer (Lead Fleet Manager)</div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Direct: +1 (312) 555-0100</div>
              </div>
              <a href="tel:+13125550100" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', marginLeft: 'auto' }}>Call</a>
            </div>
            <div className="contact-hotline-item" style={{ marginTop: 10 }}>
              <Phone size={18} color="#FF7A1A" />
              <div>
                <div style={{ fontWeight: 800, color: '#14213D' }}>24/7 Roadside & Freight Helpline</div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Toll Free: 1-800-555-FLEET</div>
              </div>
              <a href="tel:18005553533" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', marginLeft: 'auto' }}>Call</a>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }
};
