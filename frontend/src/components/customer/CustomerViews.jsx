// frontend/src/components/customer/CustomerViews.jsx
import React, { useState } from 'react';
import {
  Package,
  PlusCircle,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  RotateCcw,
  Bell,
  HelpCircle,
  User,
  Search,
  Eye,
  Download,
  Printer,
  ChevronRight,
  Shield,
  Building,
  Navigation,
  Send,
  Check,
  Building2,
  Lock,
  Phone,
  Mail
} from 'lucide-react';

// ============================================================================
// 1. CREATE TRANSPORTATION ORDER VIEW (Booking Form)
// ============================================================================
export const CreateOrderView = ({ onCreateOrder, onCancel, profile }) => {
  const [formData, setFormData] = useState({
    pickupLocation: 'Chicago Hub (CHI-01) - Gate 4B, 4200 S Pulaski Rd',
    deliveryLocation: 'Detroit Automotive Depot (DET-03) - Bay 12 South',
    pickupDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    goodsCategory: 'Industrial Automation Machinery',
    goodsDescription: 'CNC Servo Drives & Heavy Assembly Tooling',
    packageCount: '8',
    totalWeightKg: '3400',
    dimensions: '4 Pallets (48x40x60 in each)',
    priority: 'Urgent',
    specialInstructions: 'Refrigerated air ride suspension required. Do not double stack pallets.',
    contactPersonName: profile?.name || 'Sarah Jenkins',
    contactPersonPhone: profile?.phone || '+1 (312) 555-8912',
    contactPersonEmail: profile?.email || 'customer@ttcfleet360.com'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pickupLocation || !formData.deliveryLocation || !formData.packageCount || !formData.totalWeightKg) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = onCreateOrder(formData);
      setIsSubmitting(false);
      setSuccessOrder(created);
    }, 600);
  };

  if (successOrder) {
    return (
      <div className="dashboard-content" style={{ padding: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #BBF7D0', padding: '36px 24px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Check size={32} color="#16A36A" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#14213D', margin: '0 0 8px' }}>
            Transportation Order Placed!
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>
            Your booking has been registered with reference <strong style={{ color: '#FF7A1A' }}>{successOrder.id}</strong>. It is now routed to the Operations & Dispatch queue for carrier vehicle allocation.
          </p>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'left', fontSize: '13px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#64748B' }}>Order ID:</span>
              <strong style={{ color: '#14213D' }}>{successOrder.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#64748B' }}>Route:</span>
              <strong style={{ color: '#14213D' }}>{successOrder.pickupLocation} → {successOrder.deliveryLocation}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#64748B' }}>Estimated Fare:</span>
              <strong style={{ color: '#16A36A' }}>${(successOrder.amount || 0).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Status:</span>
              <strong style={{ color: '#D97706' }}>● Pending Operations Approval</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setSuccessOrder(null)}
              style={{
                backgroundColor: '#FF7A1A',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Book Another Order
            </button>
            <button
              onClick={onCancel}
              style={{
                backgroundColor: '#F1F5F9',
                color: '#334155',
                border: '1px solid #CBD5E1',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Return to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        {/* Form Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2', backgroundColor: '#14213D', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlusCircle size={22} color="#FF7A1A" />
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Create Transportation Order</h2>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                Book dedicated commercial freight and assign carrier transport via TTC Linehaul Network.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section 1: Route & Timing */}
          <div>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#14213D', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#079DF2" /> 1. Route & Schedule
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Pickup Address & Dock *</label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Delivery Address & Bay *</label>
                <input
                  type="text"
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Scheduled Pickup Date *</label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Expected Delivery Date *</label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Goods & Cargo Specifications */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#14213D', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Package size={16} color="#FF7A1A" /> 2. Cargo & Packaging Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Goods Category *</label>
                <select
                  value={formData.goodsCategory}
                  onChange={(e) => setFormData({ ...formData, goodsCategory: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Industrial Automation Machinery">Industrial Machinery</option>
                  <option value="Automotive Sub-Assemblies">Automotive Components</option>
                  <option value="High-Value Electronics">Electronics & Microchips</option>
                  <option value="Precision Cold-Chain Reagents">Pharmaceutical / Cold Chain</option>
                  <option value="Commercial Packaged Goods">Consumer Packaged Goods</option>
                  <option value="Structural Steel & Construction">Construction Materials</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Number of Packages *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.packageCount}
                  onChange={(e) => setFormData({ ...formData, packageCount: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Total Weight (kg) *</label>
                <input
                  type="number"
                  min="10"
                  value={formData.totalWeightKg}
                  onChange={(e) => setFormData({ ...formData, totalWeightKg: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Package Dimensions (L x W x H)</label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. 4 Pallets (48x40x60 in)"
                />
              </div>
              <div>
                <label style={labelStyle}>Priority Tier</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Standard">Standard Linehaul (48-72h)</option>
                  <option value="Urgent">Urgent Dedicated Express (24-36h)</option>
                  <option value="Critical Line-Down">Critical Line-Down Same-Day Expedite</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Cargo Description</label>
              <input
                type="text"
                value={formData.goodsDescription}
                onChange={(e) => setFormData({ ...formData, goodsDescription: e.target.value })}
                style={inputStyle}
                placeholder="Specific description of freight"
              />
            </div>
          </div>

          {/* Section 3: Handling & Contact Person */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#14213D', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="#16A36A" /> 3. Handling & Site Contact
            </h3>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Special Handling Instructions</label>
              <textarea
                rows={2}
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Forklift required, fragile equipment, liftgate needed, temperature control..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Contact Person Name *</label>
                <input
                  type="text"
                  value={formData.contactPersonName}
                  onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Contact Phone *</label>
                <input
                  type="text"
                  value={formData.contactPersonPhone}
                  onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Contact Email *</label>
                <input
                  type="email"
                  value={formData.contactPersonEmail}
                  onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ borderTop: '1px solid #E5EAF2', paddingTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                backgroundColor: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: '#FF7A1A',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 122, 26, 0.35)'
              }}
            >
              {isSubmitting ? 'Submitting Booking...' : 'Submit Transportation Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 2. MY ORDERS VIEW
// ============================================================================
export const MyOrdersView = ({ orders, onViewDetails, onCancelOrder, onCreateNewOrder }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    const matchesFilter = filter === 'All' ? true : o.status === filter;
    const matchesSearch =
      search === '' ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.pickupLocation && o.pickupLocation.toLowerCase().includes(search.toLowerCase())) ||
      (o.deliveryLocation && o.deliveryLocation.toLowerCase().includes(search.toLowerCase())) ||
      (o.type && o.type.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>My Orders</h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
              Complete history of commercial transportation orders and dispatch approvals
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '6px' }}>
              {['All', 'Pending', 'Approved', 'In Transit', 'Delivered', 'Cancelled'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: filter === s ? '#FF7A1A' : 'transparent',
                    color: filter === s ? '#FFFFFF' : '#475569',
                    fontWeight: filter === s ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '6px 10px 6px 30px', fontSize: '12px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }}
              />
            </div>

            <button
              onClick={onCreateNewOrder}
              style={{
                backgroundColor: '#FF7A1A',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <PlusCircle size={15} /> Book Freight
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '12px 18px' }}>Order ID</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Origin</th>
                <th style={{ padding: '12px 14px' }}>Destination</th>
                <th style={{ padding: '12px 14px' }}>Cargo / Weight</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#14213D' }}>{order.id}</td>
                    <td style={{ padding: '14px 14px', color: '#64748B' }}>{order.orderDate}</td>
                    <td style={{ padding: '14px 14px', color: '#1E293B', fontWeight: 500 }}>{order.pickupLocation}</td>
                    <td style={{ padding: '14px 14px', color: '#1E293B', fontWeight: 500 }}>{order.deliveryLocation}</td>
                    <td style={{ padding: '14px 14px', color: '#64748B' }}>
                      {order.type} ({order.totalWeightKg || 1000} kg)
                    </td>
                    <td style={{ padding: '14px 14px', textAlign: 'right', fontWeight: 700, color: '#14213D' }}>
                      ${(order.amount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor:
                            order.status === 'Approved' ? '#DCFCE7' :
                            order.status === 'In Transit' ? '#E0F2FE' :
                            order.status === 'Delivered' ? '#D1FAE5' :
                            order.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7',
                          color:
                            order.status === 'Approved' ? '#166534' :
                            order.status === 'In Transit' ? '#0369A1' :
                            order.status === 'Delivered' ? '#065F46' :
                            order.status === 'Cancelled' ? '#991B1B' : '#92400E'
                        }}
                      >
                        ● {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => onViewDetails(order)}
                          style={{
                            backgroundColor: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            color: '#1E40AF',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Details
                        </button>
                        {order.status === 'Pending' && onCancelOrder && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Cancel order ${order.id}?`)) onCancelOrder(order.id);
                            }}
                            style={{
                              backgroundColor: '#FEE2E2',
                              border: '1px solid #FECACA',
                              color: '#EF4444',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. MY SHIPMENTS VIEW
// ============================================================================
export const MyShipmentsView = ({ shipments, onTrackShipment }) => {
  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>My Shipments</h2>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
            Consignments actively assigned to carrier vehicles and traveling across linehaul networks
          </p>
        </div>

        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {shipments.map(s => (
            <div
              key={s.id}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Shipment ID</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#14213D' }}>{s.id}</div>
                </div>
                <span
                  style={{
                    backgroundColor: s.status === 'In Transit' ? '#E0F2FE' : '#D1FAE5',
                    color: s.status === 'In Transit' ? '#0369A1' : '#065F46',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '12px'
                  }}
                >
                  ● {s.status}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#1E293B', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Origin:</strong> {s.origin || 'Chicago Hub (CHI-01)'}</div>
                <div><strong>Destination:</strong> {s.destination || 'Detroit Depot'}</div>
                <div><strong>Assigned Vehicle:</strong> {s.vehicleNumber || 'Freightliner TTC-8492-HD'}</div>
                <div><strong>CDL Driver:</strong> {s.driverName || 'Marcus Vance'}</div>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Order Ref: {s.orderId}</span>
                <button
                  onClick={() => onTrackShipment(s.id)}
                  style={{
                    backgroundColor: '#079DF2',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Navigation size={13} /> Live GPS Tracking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. LIVE TRACKING VIEW
// ============================================================================
export const LiveTrackingView = ({ shipments, initialShipmentId }) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState(initialShipmentId || shipments[0]?.id || 'SHP-8201');
  const target = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Live GPS Telemetry & Shipment Tracking</h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
              Real-time satellite GPS tracking with speed, coordinates, and delivery timeline
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Select Shipment:</span>
            <select
              value={selectedShipmentId}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
              style={{ ...inputStyle, width: '180px', padding: '6px 10px' }}
            >
              {shipments.map(s => (
                <option key={s.id} value={s.id}>{s.id} ({s.status})</option>
              ))}
            </select>
          </div>
        </div>

        {target ? (
          <div style={{ padding: '24px' }}>
            {/* Map Simulation Container */}
            <div
              style={{
                height: '340px',
                backgroundColor: '#0F172A',
                borderRadius: '10px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                marginBottom: '20px',
                backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            >
              {/* Simulated Highway Route */}
              <div
                style={{
                  position: 'absolute',
                  width: '70%',
                  height: '4px',
                  backgroundColor: '#079DF2',
                  borderRadius: '2px',
                  boxShadow: '0 0 12px #079DF2'
                }}
              />

              {/* Truck Icon on Route */}
              <div
                style={{
                  position: 'absolute',
                  left: '60%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#FF7A1A',
                  color: '#FFFFFF',
                  padding: '8px',
                  borderRadius: '50%',
                  boxShadow: '0 0 16px rgba(255, 122, 26, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
              >
                <Truck size={20} />
              </div>

              {/* Origin Marker */}
              <div style={{ position: 'absolute', left: '15%', color: '#94A3B8', fontSize: '11px', textAlign: 'center' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#16A36A', borderRadius: '50%', margin: '0 auto 4px' }} />
                <span>Chicago Hub (CHI-01)</span>
              </div>

              {/* Destination Marker */}
              <div style={{ position: 'absolute', right: '15%', color: '#94A3B8', fontSize: '11px', textAlign: 'center' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#EF4444', borderRadius: '50%', margin: '0 auto 4px' }} />
                <span>Detroit Depot (Bay 12)</span>
              </div>

              {/* Live Overlay HUD */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: 800, color: '#079DF2', fontSize: '13px' }}>
                  FLEET SATELLITE TELEMETRY
                </div>
                <div style={{ marginTop: '4px' }}>Cruising Speed: <strong style={{ color: '#10B981' }}>62 mph</strong></div>
                <div>Coordinates: 41.5868° N, 84.1402° W</div>
                <div>Distance Remaining: <strong>84 miles</strong></div>
                <div>Estimated Arrival: <strong style={{ color: '#FFB37C' }}>Today, 04:30 PM EST</strong></div>
              </div>
            </div>

            {/* Vehicle & Consignment Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12.5px' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Shipment Reference</span>
                <strong style={{ color: '#14213D', fontSize: '14px' }}>{target.id}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Vehicle Number</span>
                <strong style={{ color: '#1E293B' }}>{target.vehicleNumber || 'TTC-8492-HD (Freightliner)'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Certified Driver</span>
                <strong style={{ color: '#1E293B' }}>{target.driverName || 'Marcus Vance (CDL-A)'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Trip Status</span>
                <strong style={{ color: '#0369A1' }}>● {target.status}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>No shipment selected.</div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 5. DELIVERY HISTORY VIEW
// ============================================================================
export const DeliveryHistoryView = ({ onViewPod }) => {
  const history = [
    {
      id: 'DEL-9901',
      orderId: 'ORD-9082',
      shipmentId: 'SHP-8105',
      destination: 'Detroit Automotive Depot, Bay 12 South',
      deliveredDate: '2026-11-21 16:42 EST',
      receivedBy: 'Robert Martinez (Receiving Master)',
      driver: 'Marcus Vance',
      status: 'Verified e-POD'
    },
    {
      id: 'DEL-9902',
      orderId: 'ORD-9074',
      shipmentId: 'SHP-8094',
      destination: 'Cleveland Regional Terminal, Gate 2',
      deliveredDate: '2026-11-18 11:20 EST',
      receivedBy: 'David Miller (Warehouse Supervisor)',
      driver: 'Elena Rostova',
      status: 'Verified e-POD'
    }
  ];

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Delivery History & Proof of Delivery (POD)</h2>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
            Archived verified drop-offs, recipient dock signatures, and photographic proof of delivery
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '12px 18px' }}>Delivery ID</th>
              <th style={{ padding: '12px 14px' }}>Order Ref</th>
              <th style={{ padding: '12px 14px' }}>Destination Dock</th>
              <th style={{ padding: '12px 14px' }}>Delivered Time</th>
              <th style={{ padding: '12px 14px' }}>Recipient Name</th>
              <th style={{ padding: '12px 18px', textAlign: 'center' }}>Proof of Delivery</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#14213D' }}>{item.id}</td>
                <td style={{ padding: '14px 14px', color: '#079DF2', fontWeight: 600 }}>{item.orderId}</td>
                <td style={{ padding: '14px 14px', color: '#1E293B' }}>{item.destination}</td>
                <td style={{ padding: '14px 14px', color: '#64748B' }}>{item.deliveredDate}</td>
                <td style={{ padding: '14px 14px', color: '#1E293B', fontWeight: 600 }}>{item.receivedBy}</td>
                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  <button
                    onClick={() => onViewPod && onViewPod(item)}
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      border: '1px solid #BBF7D0',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View e-POD Certificate
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
// 6. PICKUP & DELIVERY ADDRESSES VIEW
// ============================================================================
export const PickupDeliveryView = ({ profile, onSaveAddress }) => {
  const [addresses, setAddresses] = useState(profile?.shippingAddresses || []);
  const [newLabel, setNewLabel] = useState('');
  const [newDock, setNewDock] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newContact, setNewContact] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLabel || !newAddress) return;
    const addr = {
      label: newLabel,
      dock: newDock,
      address: newAddress,
      contact: newContact
    };
    onSaveAddress(addr);
    setAddresses([...addresses, { id: `ADDR-${Date.now()}`, ...addr }]);
    setNewLabel('');
    setNewDock('');
    setNewAddress('');
    setNewContact('');
    setIsAdding(false);
  };

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Pickup & Delivery Address Book</h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
              Manage shipping facilities, regional terminals, and dock gate specifications
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            style={{
              backgroundColor: '#FF7A1A',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isAdding ? 'Close Form' : '+ Add Facility Address'}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} style={{ padding: '20px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Facility Label *</label>
                <input type="text" placeholder="e.g. South Bend Plant" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Dock / Gate</label>
                <input type="text" placeholder="e.g. Bay 4 East" value={newDock} onChange={(e) => setNewDock(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Full Address *</label>
                <input type="text" placeholder="Street, City, State, Zip" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Site Contact Person</label>
                <input type="text" placeholder="Name & Phone" value={newContact} onChange={(e) => setNewContact(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <button type="submit" style={{ backgroundColor: '#16A36A', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Save Address
            </button>
          </form>
        )}

        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {addresses.map((a, i) => (
            <div key={a.id || i} style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '14px', color: '#14213D' }}>{a.label}</strong>
                {a.isDefault && (
                  <span style={{ fontSize: '10.5px', fontWeight: 800, backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '10px' }}>
                    Primary
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: '4px' }}>{a.address}</div>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>Dock: <strong>{a.dock || 'Standard Receiving Bay'}</strong></div>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>Contact: {a.contact || 'Site Dispatcher'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. BILLING & INVOICES VIEW
// ============================================================================
export const BillingInvoicesView = ({ invoices, onViewInvoice, onMakePayment }) => {
  const [filter, setFilter] = useState('All');

  const filtered = invoices.filter(i => filter === 'All' ? true : i.status === filter);

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Billing & Invoices</h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
              Corporate freight statements, automated ledger receipts, and downloadable tax invoices
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Paid', 'Pending'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: filter === s ? 700 : 500,
                  backgroundColor: filter === s ? '#FF7A1A' : '#F1F5F9',
                  color: filter === s ? '#fff' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '12px 18px' }}>Invoice ID</th>
              <th style={{ padding: '12px 14px' }}>Order Ref</th>
              <th style={{ padding: '12px 14px' }}>Invoice Date</th>
              <th style={{ padding: '12px 14px' }}>Due Date</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Total Amount</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 18px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#14213D' }}>{inv.id}</td>
                <td style={{ padding: '14px 14px', color: '#079DF2', fontWeight: 600 }}>{inv.orderId}</td>
                <td style={{ padding: '14px 14px', color: '#64748B' }}>{inv.date}</td>
                <td style={{ padding: '14px 14px', color: '#64748B' }}>{inv.dueDate}</td>
                <td style={{ padding: '14px 14px', textAlign: 'right', fontWeight: 800, color: '#14213D' }}>
                  ${(inv.total || inv.amount).toLocaleString()}
                </td>
                <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: inv.status === 'Paid' ? '#DCFCE7' : '#FEF3C7',
                      color: inv.status === 'Paid' ? '#166534' : '#92400E'
                    }}
                  >
                    ● {inv.status}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => onViewInvoice(inv)}
                      style={{
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        color: '#1E40AF',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      View Invoice
                    </button>
                    {inv.status !== 'Paid' && (
                      <button
                        onClick={() => onMakePayment(inv)}
                        style={{
                          backgroundColor: '#16A36A',
                          border: 'none',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Pay
                      </button>
                    )}
                  </div>
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
// 8. PAYMENT MANAGEMENT VIEW
// ============================================================================
export const PaymentManagementView = ({ payments }) => {
  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Payment History & Transactions</h2>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
            Confirmed corporate clearing settlements and remittance references
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '12px 18px' }}>Transaction ID</th>
              <th style={{ padding: '12px 14px' }}>Invoice Settled</th>
              <th style={{ padding: '12px 14px' }}>Settled Date</th>
              <th style={{ padding: '12px 14px' }}>Payment Method</th>
              <th style={{ padding: '12px 14px' }}>Account Reference</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount Paid</th>
              <th style={{ padding: '12px 18px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#14213D' }}>{p.id}</td>
                <td style={{ padding: '14px 14px', color: '#079DF2', fontWeight: 600 }}>{p.invoiceId}</td>
                <td style={{ padding: '14px 14px', color: '#64748B' }}>{p.date}</td>
                <td style={{ padding: '14px 14px', color: '#1E293B' }}>{p.method}</td>
                <td style={{ padding: '14px 14px', color: '#64748B' }}>{p.account}</td>
                <td style={{ padding: '14px 14px', textAlign: 'right', fontWeight: 800, color: '#16A36A' }}>
                  ${p.amount.toLocaleString()}
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                    ✔ {p.status}
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

// ============================================================================
// 9. REFUND REQUESTS VIEW
// ============================================================================
export const RefundRequestsView = ({ refunds, onRequestRefund }) => {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId || !amount || !reason) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onRequestRefund({ orderId, amount, reason });
      setIsSubmitting(false);
      setOrderId('');
      setAmount('');
      setReason('');
      alert('Refund request submitted to claims review.');
    }, 600);
  };

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Submit Refund or Demurrage Claim</h2>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
            Request credit adjustments for carrier delays, delivery variances, or route demurrage
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 2fr auto', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={labelStyle}>Order ID *</label>
            <input type="text" placeholder="e.g. ORD-9101" value={orderId} onChange={(e) => setOrderId(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Claim Amount ($) *</label>
            <input type="number" placeholder="500" value={amount} onChange={(e) => setAmount(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Claim Reason *</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} style={inputStyle} required>
              <option value="">Select reason...</option>
              <option value="Dock Gate Delay Demurrage">Dock Gate Delay Demurrage</option>
              <option value="Damaged Packaging on Arrival">Packaging Damage Variance</option>
              <option value="Delivery Schedule Breach">Delivery Schedule SLA Breach</option>
              <option value="Billing Calculation Adjustment">Billing Rate Adjustment</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Notes / Reference</label>
            <input type="text" placeholder="Additional details..." style={inputStyle} />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: '#FF7A1A',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5EAF2', fontWeight: 700, color: '#14213D' }}>
          Logged Refund Requests & Status
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '12px 18px' }}>Claim ID</th>
              <th style={{ padding: '12px 14px' }}>Order Ref</th>
              <th style={{ padding: '12px 14px' }}>Claim Date</th>
              <th style={{ padding: '12px 14px' }}>Reason</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 18px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#14213D' }}>{r.id}</td>
                <td style={{ padding: '14px 14px', color: '#079DF2', fontWeight: 600 }}>{r.orderId}</td>
                <td style={{ padding: '14px 14px', color: '#64748B' }}>{r.date}</td>
                <td style={{ padding: '14px 14px', color: '#1E293B' }}>{r.reason}</td>
                <td style={{ padding: '14px 14px', textAlign: 'right', fontWeight: 800, color: '#14213D' }}>${r.amount}</td>
                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: r.status === 'Approved' ? '#DCFCE7' : '#FEF3C7',
                      color: r.status === 'Approved' ? '#166534' : '#92400E'
                    }}
                  >
                    ● {r.status}
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

// ============================================================================
// 10. NOTIFICATIONS VIEW
// ============================================================================
export const NotificationsView = ({ notifications, onMarkRead, onMarkAllRead }) => {
  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5EAF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Notifications Center</h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
              Order approvals, transit alerts, invoice releases, and linehaul milestone updates
            </p>
          </div>
          <button
            onClick={onMarkAllRead}
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#1E40AF',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Mark All Read
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #F1F5F9',
                backgroundColor: n.unread ? '#F0F9FF' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {n.unread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF7A1A' }} />}
                  <strong style={{ fontSize: '13.5px', color: '#14213D' }}>{n.title}</strong>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748B' }}>{n.message}</p>
              </div>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 11. SUPPORT & COMPLAINTS VIEW
// ============================================================================
export const SupportComplaintsView = ({ tickets, onCreateTicket }) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Dispatch & Telemetry');
  const [priority, setPriority] = useState('Normal');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!subject || !description) return;
    onCreateTicket({ subject, category, priority, description });
    setSubject('');
    setDescription('');
    alert('Ticket submitted to Customer Success.');
  };

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        {/* Active Tickets List */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', padding: '20px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Support Tickets & Dispatch Chat</h2>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748B' }}>
            Direct real-time communication channel with Logistics Control Center
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tickets.map(t => (
              <div key={t.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#079DF2', fontWeight: 700 }}>{t.id} • {t.category}</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>{t.subject}</div>
                  </div>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: t.status === 'Resolved' ? '#DCFCE7' : '#FEF3C7',
                      color: t.status === 'Resolved' ? '#166534' : '#92400E'
                    }}
                  >
                    ● {t.status}
                  </span>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#475569' }}>{t.description}</p>
                {t.responses?.map((r, ri) => (
                  <div key={ri} style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11.5px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#079DF2', fontWeight: 700, marginBottom: '2px' }}>
                      <span>{r.sender}</span>
                      <span style={{ color: '#94A3B8', fontWeight: 500 }}>{r.time}</span>
                    </div>
                    <div style={{ color: '#1E293B' }}>{r.text}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Raise Ticket Form */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', padding: '20px' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800, color: '#14213D' }}>Raise Support Request</h3>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748B' }}>
            Submit an inquiry to carrier operations
          </p>

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Subject *</label>
              <input type="text" placeholder="Brief subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                <option value="Dispatch & Telemetry">Dispatch & Telemetry</option>
                <option value="Delivery Delay">Delivery Delay Inquiry</option>
                <option value="Damaged Cargo Claim">Damaged Cargo Claim</option>
                <option value="Billing & Accounting">Billing & Accounting</option>
                <option value="Dock Gate Clearance">Dock Gate Clearance</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical Line-Down">Critical Line-Down</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea rows={4} placeholder="Detailed notes..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} required />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#FF7A1A',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 12. MY PROFILE VIEW
// ============================================================================
export const MyProfileView = ({ profile, onUpdateProfile }) => {
  const [name, setName] = useState(profile?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(profile?.email || 'customer@ttcfleet360.com');
  const [phone, setPhone] = useState(profile?.phone || '+1 (312) 555-8912');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleSaveInfo = (e) => {
    e.preventDefault();
    onUpdateProfile({ name, email, phone });
    alert('Personal information updated successfully.');
  };

  const handleChangePw = (e) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      alert('Please fill in password fields.');
      return;
    }
    if (newPw !== confirmPw) {
      alert('New passwords do not match.');
      return;
    }
    alert('Password changed successfully.');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div className="dashboard-content" style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Account Details */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', padding: '20px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: '#14213D' }}>My Profile & Company Details</h2>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748B' }}>Corporate shipper profile credentials</p>

          <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Company Name</label>
              <input type="text" value={profile?.companyName || 'NexGen Industrial Corp'} disabled style={{ ...inputStyle, backgroundColor: '#F1F5F9' }} />
            </div>
            <div>
              <label style={labelStyle}>Customer ID</label>
              <input type="text" value={profile?.id || 'CUST-8021'} disabled style={{ ...inputStyle, backgroundColor: '#F1F5F9' }} />
            </div>
            <div>
              <label style={labelStyle}>Contact Person Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Work Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} required />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#14213D',
                color: '#FFFFFF',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Save Details
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', padding: '20px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: '#14213D' }}>Security & Password</h2>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748B' }}>Update login credentials</p>

          <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Current Password *</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>New Password *</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password *</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} style={inputStyle} required />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#FF7A1A',
                color: '#FFFFFF',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Common Styles
const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '4px'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '12.5px',
  borderRadius: '6px',
  border: '1px solid #CBD5E1',
  outline: 'none',
  color: '#1E293B',
  backgroundColor: '#FFFFFF',
  boxSizing: 'border-box'
};
