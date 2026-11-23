// frontend/src/components/logistics/LogisticsModals.jsx
import React, { useState } from 'react';
import {
  X,
  PackageCheck,
  Truck,
  Route,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  Car,
  FileCheck,
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react';

export const CreateOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    pickupLocation: 'Chicago Hub (CHI-01)',
    deliveryLocation: '',
    priority: 'Standard',
    itemsCount: 10,
    totalWeightKg: 1500,
    amount: 5400,
    type: 'General Industrial Freight'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.deliveryLocation) {
      alert('Please fill out customer name and delivery location.');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#FFF0E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageCheck size={20} color="#FF7A1A" />
            </div>
            <div>
              <h2 className="modal-title">Create Logistics Customer Order</h2>
              <p className="modal-subtitle">Log new freight transportation consignment into TTC dispatch pipeline</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Customer / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Industrial Solutions"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div>
                <label className="form-label">Customer Contact Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.customerContact}
                  onChange={e => setFormData({ ...formData, customerContact: e.target.value })}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Pickup Location (Origin)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chicago Hub (CHI-01)"
                  value={formData.pickupLocation}
                  onChange={e => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div>
                <label className="form-label">Delivery Destination</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Detroit Automotive Depot"
                  value={formData.deliveryLocation}
                  onChange={e => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="modal-select"
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent / Critical</option>
                </select>
              </div>
              <div>
                <label className="form-label">Total Weight (kg)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalWeightKg}
                  onChange={e => setFormData({ ...formData, totalWeightKg: Number(e.target.value) })}
                  className="modal-input"
                />
              </div>
              <div>
                <label className="form-label">Order Value ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="modal-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Cargo Classification / Item Description</label>
              <input
                type="text"
                placeholder="e.g. Palletized Aerospace Hydraulic Cylinders"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="modal-input"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#FF7A1A' }}>
              Confirm & Book Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CreateShipmentModal = ({ isOpen, onClose, orders = [], vehicles = [], drivers = [], onSubmit }) => {
  const [formData, setFormData] = useState({
    orderId: orders[0]?.id || '',
    customerName: orders[0]?.customerName || '',
    origin: orders[0]?.pickupLocation || 'Chicago Central Logistics',
    destination: orders[0]?.deliveryLocation || 'Detroit Depot',
    assignedVehicleReg: vehicles[0]?.regNumber || 'TTC-8492-HD',
    assignedDriver: drivers[0]?.name || 'Marcus Vance',
    expectedDelivery: '2026-11-26 14:00',
    estimatedDistanceKm: 340
  });

  if (!isOpen) return null;

  const handleOrderChange = (e) => {
    const selected = orders.find(o => o.id === e.target.value);
    if (selected) {
      setFormData({
        ...formData,
        orderId: selected.id,
        customerName: selected.customerName,
        origin: selected.pickupLocation,
        destination: selected.deliveryLocation
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} color="#2563EB" />
            </div>
            <div>
              <h2 className="modal-title">Create Transport Shipment</h2>
              <p className="modal-subtitle">Dispatch consignments with live tracking and vehicle telemetry</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Select Customer Order</label>
              <select value={formData.orderId} onChange={handleOrderChange} className="modal-select">
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.id} - {o.customerName} ({o.pickupLocation} -&gt; {o.deliveryLocation})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Origin Facility</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={e => setFormData({ ...formData, origin: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div>
                <label className="form-label">Destination Facility</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Assign Fleet Vehicle</label>
                <select
                  value={formData.assignedVehicleReg}
                  onChange={e => setFormData({ ...formData, assignedVehicleReg: e.target.value })}
                  className="modal-select"
                >
                  {vehicles.map(v => (
                    <option key={v.regNumber} value={v.regNumber}>
                      {v.regNumber} ({v.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Assign Certified Driver</label>
                <select
                  value={formData.assignedDriver}
                  onChange={e => setFormData({ ...formData, assignedDriver: e.target.value })}
                  className="modal-select"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.licenseClass})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Expected Delivery Date & Time</label>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD HH:mm"
                  value={formData.expectedDelivery}
                  onChange={e => setFormData({ ...formData, expectedDelivery: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div>
                <label className="form-label">Estimated Transit Distance (km)</label>
                <input
                  type="number"
                  value={formData.estimatedDistanceKm}
                  onChange={e => setFormData({ ...formData, estimatedDistanceKm: Number(e.target.value) })}
                  className="modal-input"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#2563EB' }}>
              Confirm & Dispatch Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CreateTripModal = ({ isOpen, onClose, vehicles = [], drivers = [], routes = [], onSubmit }) => {
  const [formData, setFormData] = useState({
    startLocation: 'Chicago Central Logistics (CHI-01)',
    destination: 'Detroit Automotive Depot (DET-03)',
    vehicleReg: vehicles[0]?.regNumber || 'TTC-8492-HD',
    driverName: drivers[0]?.name || 'Marcus Vance',
    routeCode: routes[0]?.id || 'RT-CHI-DET-01',
    totalDistanceKm: 452,
    expectedArrival: '2026-11-25 18:00'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Route size={20} color="#7955E8" />
            </div>
            <div>
              <h2 className="modal-title">Schedule Transportation Trip</h2>
              <p className="modal-subtitle">Define corridor route, vehicle allocation & driver telemetry sync</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Departure Starting Location</label>
                <input
                  type="text"
                  required
                  value={formData.startLocation}
                  onChange={e => setFormData({ ...formData, startLocation: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div>
                <label className="form-label">Trip Destination</label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Assigned Vehicle</label>
                <select
                  value={formData.vehicleReg}
                  onChange={e => setFormData({ ...formData, vehicleReg: e.target.value })}
                  className="modal-select"
                >
                  {vehicles.map(v => (
                    <option key={v.regNumber} value={v.regNumber}>
                      {v.regNumber} ({v.type} • {v.status})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Assigned Driver</label>
                <select
                  value={formData.driverName}
                  onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                  className="modal-select"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.status} • {d.rating}★)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Select Planned Route Corridor</label>
                <select
                  value={formData.routeCode}
                  onChange={e => {
                    const r = routes.find(item => item.id === e.target.value);
                    setFormData({
                      ...formData,
                      routeCode: e.target.value,
                      totalDistanceKm: r?.distanceKm || formData.totalDistanceKm
                    });
                  }}
                  className="modal-select"
                >
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.id}: {r.name} ({r.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Total Distance (km)</label>
                <input
                  type="number"
                  value={formData.totalDistanceKm}
                  onChange={e => setFormData({ ...formData, totalDistanceKm: Number(e.target.value) })}
                  className="modal-input"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#7955E8' }}>
              Confirm & Launch Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ProofOfDeliveryModal = ({ isOpen, onClose, delivery }) => {
  if (!isOpen || !delivery) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#E8F8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={20} color="#16A36A" />
            </div>
            <div>
              <h2 className="modal-title">Proof of Delivery (POD)</h2>
              <p className="modal-subtitle">Consignment #{delivery.id} Verification Record</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
              <div>
                <span style={{ color: '#64748B' }}>Order ID:</span> <strong>{delivery.orderId}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Customer:</span> <strong>{delivery.customerName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Assigned Driver:</span> <strong>{delivery.assignedDriver}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Status:</span>{' '}
                <span className={`status-pill ${delivery.status === 'Delivered' ? 'status-delivered' : 'status-pending'}`}>
                  {delivery.status}
                </span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748B' }}>Delivery Address:</span> <div>{delivery.address}</div>
              </div>
            </div>
          </div>

          {delivery.proofOfDelivery ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Received By:</span>{' '}
                <strong style={{ color: '#14213D' }}>{delivery.proofOfDelivery.receivedBy}</strong>
              </div>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Timestamp:</span>{' '}
                <strong style={{ color: '#14213D' }}>{delivery.proofOfDelivery.signatureTimestamp}</strong>
              </div>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Inspector / Receiving Notes:</span>{' '}
                <div style={{ fontStyle: 'italic', color: '#475569', marginTop: 3 }}>
                  "{delivery.proofOfDelivery.notes}"
                </div>
              </div>

              {/* Electronic Signature Canvas Simulation */}
              <div style={{ marginTop: 6 }}>
                <label className="form-label">Electronic Signature Record</label>
                <div style={{
                  height: 100,
                  backgroundColor: '#FFFFFF',
                  border: '1.5px dashed #CBD5E1',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                  fontFamily: 'cursive',
                  fontSize: 24,
                  fontWeight: 700
                }}>
                  {delivery.proofOfDelivery.receivedBy}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8' }}>
              <AlertTriangle size={32} color="#F59E0B" style={{ marginBottom: 8 }} />
              <div>Proof of Delivery pending driver arrival and customer sign-off.</div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. ASSIGN RESOURCES MODAL (Pair Vehicle & Driver)
   ========================================================================= */
export const AssignResourcesModal = ({ isOpen, onClose, vehicles = [], drivers = [], onSubmit }) => {
  const [vehicleReg, setVehicleReg] = useState(vehicles[0]?.regNo || 'TTC-9041-HD');
  const [driverId, setDriverId] = useState(drivers[0]?.id || 'D-01');
  const [tripRoute, setTripRoute] = useState('Chicago Hub → Detroit Distribution (I-94 E)');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ vehicleReg, driverId, tripRoute });
    onClose();
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Truck size={20} color="#FF7A1A" />
            <div>
              <h3>Resource Allocation: Vehicle & Driver</h3>
              <p>Pair active heavy commercial hauler with certified commercial pilot</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Select Commercial Fleet Hauler</label>
              <select
                className="form-input"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value)}
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.regNo}>
                    {v.regNo} — {v.type} ({v.capacity}) • Status: {v.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Select Certified CDL Driver</label>
              <select
                className="form-input"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id}) • {d.licenseType} • Status: {d.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Dispatched Transportation Route</label>
              <input
                type="text"
                className="form-input"
                value={tripRoute}
                onChange={(e) => setTripRoute(e.target.value)}
                placeholder="e.g. Chicago Hub → Detroit Distribution (I-94 E)"
                required
              />
            </div>

            <div style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: 'rgba(255, 122, 26, 0.08)',
              border: '1px solid rgba(255, 122, 26, 0.25)',
              fontSize: 12,
              color: '#B45309'
            }}>
              <strong>Operational Check:</strong> Ensure driver driving hours (HOS) adhere to DOT compliance standards before assigning long-haul routes.
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#FF7A1A' }}>
              Confirm Resource Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
