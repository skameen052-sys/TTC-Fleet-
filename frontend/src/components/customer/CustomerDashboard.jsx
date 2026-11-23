// frontend/src/components/customer/CustomerDashboard.jsx
import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Navigation,
  FileText,
  CreditCard,
  PlusCircle,
  Search,
  ArrowRight,
  MapPin,
  Eye,
  AlertCircle,
  HelpCircle,
  Calendar,
  Building2,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CustomerDashboard = ({
  data,
  metrics,
  onNavigate,
  onViewOrderDetails,
  onViewInvoice,
  onMakePayment,
  onTrackShipment,
  onViewPod
}) => {
  const [orderFilter, setOrderFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = data.orders || [];
  const shipments = data.shipments || [];
  const invoices = data.invoices || [];
  const payments = data.payments || [];
  const deliveries = data.deliveries || [];

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderFilter === 'All' ? true : o.status === orderFilter;
    const matchesSearch =
      searchTerm === '' ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.pickupLocation && o.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.deliveryLocation && o.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.type && o.type.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Most active shipment
  const activeShipment = shipments.find(s => s.status === 'In Transit') || shipments[0];

  return (
    <div className="dashboard-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Welcome Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #14213D 0%, #1E3A8A 60%, #0F172A 100%)',
          borderRadius: '12px',
          padding: '22px 28px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(20, 33, 61, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ zIndex: 1, maxWidth: '65%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 122, 26, 0.2)', border: '1px solid rgba(255, 122, 26, 0.4)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', color: '#FFB37C', fontWeight: 700, marginBottom: '8px' }}>
            <Building2 size={13} /> {data.profile?.companyName || 'NexGen Industrial Corp'} • Client ID: {data.profile?.id || 'CUST-8021'}
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Customer Operations & Dispatch Command
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' }}>
            Manage commercial freight bookings, monitor linehaul GPS telemetry in real-time, view verified POD certificates, and settle corporate invoices.
          </p>
        </div>

        <div style={{ zIndex: 1, display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('create-order')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FF7A1A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 122, 26, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            <PlusCircle size={16} /> Book Transport
          </button>
          <button
            onClick={() => onNavigate('live-tracking')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Navigation size={15} /> Track Fleet
          </button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS (8 CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {/* Total Orders */}
        <div className="dashboard-card" style={summaryCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Total Orders</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#14213D', marginTop: '4px' }}>
                {metrics.totalOrders}
              </div>
            </div>
            <div style={{ ...iconBadgeStyle, backgroundColor: '#EFF6FF', color: '#079DF2' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#079DF2', fontWeight: 600, marginTop: '8px' }}>
            All-time booked freight
          </div>
        </div>

        {/* Pending Orders */}
        <div className="dashboard-card" style={summaryCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Pending Orders</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
                {metrics.pendingOrders}
              </div>
            </div>
            <div style={{ ...iconBadgeStyle, backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 600, marginTop: '8px' }}>
            Awaiting Admin / LOS review
          </div>
        </div>

        {/* Approved Orders */}
        <div className="dashboard-card" style={summaryCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Approved Orders</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A36A', marginTop: '4px' }}>
                {metrics.approvedOrders}
              </div>
            </div>
            <div style={{ ...iconBadgeStyle, backgroundColor: '#DCFCE7', color: '#16A36A' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 600, marginTop: '8px' }}>
            Ready for vehicle dispatch
          </div>
        </div>

        {/* Active Shipments */}
        <div className="dashboard-card" style={summaryCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Active Shipments</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E3A8A', marginTop: '4px' }}>
                {metrics.activeShipments}
              </div>
            </div>
            <div style={{ ...iconBadgeStyle, backgroundColor: '#DBEAFE', color: '#1E3A8A' }}>
              <Truck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 600, marginTop: '8px' }}>
            Under active linehaul
          </div>
        </div>

        {/* In-Transit Shipments */}
        <div className="dashboard-card" style={summaryCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>In-Transit Shipments</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284C7', marginTop: '4px' }}>
                {metrics.inTransitShipments}
              </div>
            </div>
            <div style={{ ...iconBadgeStyle, backgroundColor: '#E0F2FE', color: '#0284C7' }}>
              <Navigation size={18} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: 600, marginTop: '8px' }}>
            Live on highway corridors
          </div>
        </div>

        {/* Delivered Shipments */}
        <div className="dashboard-card" style={summaryCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Delivered Shipments</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {metrics.deliveredShipments}
              </div>
            </div>
            <div style={{ ...iconBadgeStyle, backgroundColor: '#D1FAE5', color: '#059669' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, marginTop: '8px' }}>
            POD certified & verified
          </div>
        </div>

        {/* Pending Payments */}
        <div className="dashboard-card" style={summaryCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Pending Payments</span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#EA580C', marginTop: '4px' }}>
                ${(metrics.pendingPaymentsTotal || 0).toLocaleString()}
              </div>
            </div>
            <div style={{ ...iconBadgeStyle, backgroundColor: '#FFEDD5', color: '#EA580C' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#C2410C', fontWeight: 600, marginTop: '8px' }}>
            {metrics.pendingPaymentsCount} invoices awaiting payment
          </div>
        </div>

        {/* Total Payments Made */}
        <div className="dashboard-card" style={summaryCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Total Payments</span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#16A36A', marginTop: '4px' }}>
                ${(metrics.totalPaymentsMade || 0).toLocaleString()}
              </div>
            </div>
            <div style={{ ...iconBadgeStyle, backgroundColor: '#DCFCE7', color: '#16A36A' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 600, marginTop: '8px' }}>
            Cleared corporate transfers
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS BAR (6 ACTIONS) */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E5EAF2' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#14213D', marginBottom: '12px' }}>
          Quick Operational Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
          <button onClick={() => onNavigate('create-order')} style={quickActionBtnStyle}>
            <div style={{ ...quickActionIconStyle, backgroundColor: '#FFF0E5', color: '#FF7A1A' }}>
              <PlusCircle size={18} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#14213D' }}>Create New Order</span>
            <span style={{ fontSize: '10.5px', color: '#64748B' }}>Book dedicated freight</span>
          </button>

          <button onClick={() => onNavigate('live-tracking')} style={quickActionBtnStyle}>
            <div style={{ ...quickActionIconStyle, backgroundColor: '#E0F2FE', color: '#079DF2' }}>
              <Navigation size={18} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#14213D' }}>Track Shipment</span>
            <span style={{ fontSize: '10.5px', color: '#64748B' }}>Live GPS telematics</span>
          </button>

          <button onClick={() => onNavigate('orders')} style={quickActionBtnStyle}>
            <div style={{ ...quickActionIconStyle, backgroundColor: '#EFF6FF', color: '#1E40AF' }}>
              <Package size={18} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#14213D' }}>View My Orders</span>
            <span style={{ fontSize: '10.5px', color: '#64748B' }}>All booking records</span>
          </button>

          <button onClick={() => onNavigate('billing')} style={quickActionBtnStyle}>
            <div style={{ ...quickActionIconStyle, backgroundColor: '#F1F5F9', color: '#475569' }}>
              <FileText size={18} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#14213D' }}>Download Invoice</span>
            <span style={{ fontSize: '10.5px', color: '#64748B' }}>PDF accounting vault</span>
          </button>

          <button onClick={() => onNavigate('payments')} style={quickActionBtnStyle}>
            <div style={{ ...quickActionIconStyle, backgroundColor: '#DCFCE7', color: '#16A36A' }}>
              <CreditCard size={18} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#14213D' }}>Make Payment</span>
            <span style={{ fontSize: '10.5px', color: '#64748B' }}>ACH or Fedwire</span>
          </button>

          <button onClick={() => onNavigate('support')} style={quickActionBtnStyle}>
            <div style={{ ...quickActionIconStyle, backgroundColor: '#F3E8FF', color: '#7955E8' }}>
              <HelpCircle size={18} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#14213D' }}>Raise Support</span>
            <span style={{ fontSize: '10.5px', color: '#64748B' }}>Direct dispatcher line</span>
          </button>
        </div>
      </div>

      {/* 4. SPLIT SECTION: LIVE SHIPMENT TRACKING PREVIEW & DELIVERY STATUS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
        {/* Active Linehaul Telemetry Preview */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E5EAF2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#14213D' }}>
                Live In-Transit Freight Telemetry
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Real-time GPS vehicle coordinates for your active shipment
              </div>
            </div>
            {activeShipment && (
              <button
                onClick={() => onTrackShipment && onTrackShipment(activeShipment.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1E40AF',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Full Map <ChevronRight size={13} />
              </button>
            )}
          </div>

          {activeShipment ? (
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Shipment ID</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#14213D' }}>{activeShipment.id}</span>
                  <span style={{ fontSize: '11px', color: '#079DF2', marginLeft: '8px', fontWeight: 600 }}>
                    Order: {activeShipment.orderId}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      backgroundColor: '#E0F2FE',
                      color: '#0284C7',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11.5px',
                      fontWeight: 700
                    }}
                  >
                    ● {activeShipment.status}
                  </span>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                    ETA: {activeShipment.expectedDelivery || '1h 45m'}
                  </div>
                </div>
              </div>

              {/* Progress Milestones */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                  {/* Step 1 */}
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#16A36A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: '11px' }}>
                      <Check size={14} />
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E293B' }}>Dispatched</span>
                  </div>
                  {/* Step 2 */}
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#079DF2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: '11px' }}>
                      <Truck size={14} />
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#079DF2' }}>In Transit</span>
                  </div>
                  {/* Step 3 */}
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: '11px' }}>
                      3
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B' }}>Out for Delivery</span>
                  </div>
                  {/* Step 4 */}
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: '11px' }}>
                      4
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B' }}>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px', backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Assigned Vehicle</span>
                  <strong style={{ color: '#1E293B' }}>{activeShipment.vehicleNumber || 'TTC-8492-HD (Freightliner)'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Commercial Pilot</span>
                  <strong style={{ color: '#1E293B' }}>{activeShipment.driverName || 'Marcus Vance (CDL-A)'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Current Location</span>
                  <strong style={{ color: '#16A36A' }}>I-94 East Mile 88 (Cruising 62 mph)</strong>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
              No active linehaul dispatches currently in transit.
            </div>
          )}
        </div>

        {/* Delivery Overview */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E5EAF2' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#14213D', marginBottom: '4px' }}>
            Delivery Operations Overview
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '14px' }}>
            Status of scheduled and completed shipments
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#16A36A" />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>Successfully Delivered</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#16A36A' }}>{metrics.deliveredShipments}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={16} color="#079DF2" />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>In-Transit Deliveries</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#079DF2' }}>{metrics.inTransitShipments}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#D97706" />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>Scheduled for Tomorrow</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#D97706' }}>2</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#7955E8" />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>e-POD Receipts Ready</span>
              </div>
              <button
                onClick={() => onNavigate('delivery-history')}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#7955E8',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                View PODs →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ORDER OVERVIEW TABLE */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EAF2', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5EAF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#14213D' }}>
              Order Management Overview
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Recent freight transport requests booked under your account
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Status Filter Tabs */}
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '2px', borderRadius: '6px', fontSize: '11.5px' }}>
              {['All', 'Pending', 'Approved', 'In Transit', 'Delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  style={{
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    backgroundColor: orderFilter === status ? '#FF7A1A' : 'transparent',
                    color: orderFilter === status ? '#FFFFFF' : '#475569',
                    fontWeight: orderFilter === status ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '11.5px'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '5px 8px 5px 26px',
                  fontSize: '11.5px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                  width: '160px'
                }}
              />
            </div>

            <button
              onClick={() => onNavigate('create-order')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FF7A1A',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <PlusCircle size={14} /> New Order
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 600 }}>
                <th style={{ padding: '10px 16px' }}>Order ID</th>
                <th style={{ padding: '10px 12px' }}>Order Date</th>
                <th style={{ padding: '10px 12px' }}>Pickup Origin</th>
                <th style={{ padding: '10px 12px' }}>Delivery Destination</th>
                <th style={{ padding: '10px 12px' }}>Goods Category</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 16px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>
                    No orders matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.slice(0, 7).map(order => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#14213D' }}>
                      {order.id}
                    </td>
                    <td style={{ padding: '12px 12px', color: '#64748B' }}>
                      {order.orderDate}
                    </td>
                    <td style={{ padding: '12px 12px', color: '#1E293B', fontWeight: 500 }}>
                      {order.pickupLocation}
                    </td>
                    <td style={{ padding: '12px 12px', color: '#1E293B', fontWeight: 500 }}>
                      {order.deliveryLocation}
                    </td>
                    <td style={{ padding: '12px 12px', color: '#64748B' }}>
                      {order.type || 'Commercial Cargo'} ({order.totalWeightKg || 1000} kg)
                    </td>
                    <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: '#14213D' }}>
                      ${(order.amount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor:
                            order.status === 'Approved'
                              ? '#DCFCE7'
                              : order.status === 'In Transit'
                              ? '#E0F2FE'
                              : order.status === 'Delivered'
                              ? '#D1FAE5'
                              : order.status === 'Cancelled'
                              ? '#FEE2E2'
                              : '#FEF3C7',
                          color:
                            order.status === 'Approved'
                              ? '#166534'
                              : order.status === 'In Transit'
                              ? '#0369A1'
                              : order.status === 'Delivered'
                              ? '#065F46'
                              : order.status === 'Cancelled'
                              ? '#991B1B'
                              : '#92400E'
                        }}
                      >
                        ● {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => onViewOrderDetails && onViewOrderDetails(order)}
                        style={{
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          color: '#1E40AF',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredOrders.length > 7 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #E5EAF2', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
            <button
              onClick={() => onNavigate('orders')}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#FF7A1A',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              View All {filteredOrders.length} Orders in Orders Tab →
            </button>
          </div>
        )}
      </div>

      {/* 6. RECENT ACTIVITIES & BILLING OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Recent Activities */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E5EAF2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#14213D' }}>Recent Dispatch Activities</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Real-time updates on your shipments and accounts</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#079DF2', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>
                  Shipment SHP-8201 crossed Toledo East Interchange
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Freightliner TTC-8492-HD is 85 miles from Detroit Terminal • 25 mins ago
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A36A', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>
                  Transport Order ORD-9102 Approved by Logistics Ops
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Assigned to Carrier Linehaul Bay 4 for tomorrow’s departure • 1 hour ago
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF7A1A', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>
                  Corporate ACH Payment Cleared ($16,038.00)
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Invoice INV-2026-8901 marked as fully settled • 2 days ago
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing & Invoices Preview */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E5EAF2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#14213D' }}>Invoices & Statements</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Corporate accounts payable status</div>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: '#079DF2',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              All Invoices →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {invoices.slice(0, 3).map(inv => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 12px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>{inv.id}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Order: {inv.orderId} • Due: {inv.dueDate}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14213D' }}>
                      ${(inv.total || inv.amount).toLocaleString()}
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: inv.status === 'Paid' ? '#166534' : '#92400E'
                      }}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <button
                    onClick={() => onViewInvoice && onViewInvoice(inv)}
                    style={{
                      border: 'none',
                      backgroundColor: '#EFF6FF',
                      color: '#1E40AF',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const summaryCardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '10px',
  padding: '16px',
  border: '1px solid #E5EAF2',
  boxShadow: '0 1px 3px rgba(20, 33, 61, 0.04)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
};

const iconBadgeStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const quickActionBtnStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #E2E8F0',
  backgroundColor: '#F8FAFC',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.15s ease'
};

const quickActionIconStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px'
};
