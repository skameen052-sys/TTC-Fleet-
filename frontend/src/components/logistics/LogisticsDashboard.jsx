// frontend/src/components/logistics/LogisticsDashboard.jsx
import React, { useState } from 'react';
import {
  PackageCheck,
  Truck,
  Route,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Boxes,
  CalendarCheck,
  CheckSquare,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  Car,
  UserCheck,
  Compass,
  FileCheck,
  ChevronRight,
  Eye,
  Check,
  X,
  Filter,
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';
import { InteractiveAreaChart, InteractiveBarChart, InteractiveDonutChart } from '../common/Charts';

export const LogisticsDashboard = ({
  data,
  metrics,
  onOpenCreateOrder,
  onOpenCreateShipment,
  onOpenCreateTrip,
  onSelectTab,
  onUpdateOrderStatus,
  onViewPod
}) => {
  const [orderFilter, setOrderFilter] = useState('all'); // all | pending | approved | transit
  const [analyticsFilter, setAnalyticsFilter] = useState('30d');

  const orders = data.orders || [];
  const shipments = data.shipments || [];
  const trips = data.trips || [];
  const vehicles = data.vehicles || [];
  const drivers = data.drivers || [];
  const routes = data.routes || [];
  const pickups = data.pickups || [];
  const deliveries = data.deliveries || [];
  const activities = data.activities || [];
  const alerts = data.alerts || [];
  const analytics = data.analytics || {};

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'pending') return o.status === 'Pending' || o.status === 'Processing';
    if (orderFilter === 'approved') return o.status === 'Approved';
    if (orderFilter === 'transit') return o.status === 'In Transit';
    return true;
  });

  return (
    <div className="logistics-dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Hero Logistics Command Banner */}
      <div
        className="logistics-hero-banner"
        style={{
          background: 'linear-gradient(135deg, #14213D 0%, #1E3155 55%, #253A68 100%)',
          borderRadius: 16,
          padding: '16px 24px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 18px rgba(20, 33, 61, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ maxWidth: '65%', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255, 122, 26, 0.18)', border: '1px solid rgba(255, 122, 26, 0.4)', padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 700, color: '#FF9E4A', marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FF7A1A' }} />
            TTC LOGISTICS COMMAND & FREIGHT DISPATCH OS
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Manage Logistics. <span style={{ color: '#FF7A1A' }}>Deliver Excellence.</span>
          </h1>
          <p style={{ fontSize: 12, color: '#CBD5E1', margin: 0, lineHeight: 1.45 }}>
            Streamline customer orders, shipments, cross-border corridors, and last-mile proof-of-delivery operations from one centralized intermodal platform.
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '4px 12px', borderRadius: 8, fontSize: 11.5 }}>
              <span style={{ color: '#94A3B8' }}>On-Time Delivery: </span>
              <strong style={{ color: '#10B981' }}>98.4%</strong>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '4px 12px', borderRadius: 8, fontSize: 11.5 }}>
              <span style={{ color: '#94A3B8' }}>Active Corridors: </span>
              <strong style={{ color: '#38BDF8' }}>14 Regional Routes</strong>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '6px 14px', borderRadius: 10, fontSize: 12 }}>
              <span style={{ color: '#94A3B8' }}>Dispatch Sync: </span>
              <strong style={{ color: '#FF9E4A' }}>100% Real-time</strong>
            </div>
          </div>
        </div>

        {/* Decorative graphic illustration */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9, zIndex: 1 }}>
          <div style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,122,26,0.2) 0%, rgba(20,33,61,0) 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px dashed rgba(255, 255, 255, 0.15)'
          }}>
            <Truck size={64} color="#FF7A1A" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* 2. 10 Executive Summary Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', margin: 0 }}>
            Operational Summary & Key Metrics
          </h2>
          <span style={{ fontSize: 12, color: '#718096' }}>Live automated aggregation</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14
        }}>
          {/* Card 1: Total Orders */}
          <div className="metric-card" onClick={() => onSelectTab('all-orders')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">Total Orders</span>
              <div className="metric-icon-box" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                <PackageCheck size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.totalOrders}</div>
            <div className="metric-card-sub" style={{ color: '#16A36A' }}>
              <span>↑ +12.4%</span> vs last week
            </div>
          </div>

          {/* Card 2: New Orders */}
          <div className="metric-card" onClick={() => onSelectTab('pending-orders')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">New Orders</span>
              <div className="metric-icon-box" style={{ background: '#FFF5EE', color: '#FF7A1A' }}>
                <Clock size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.newOrders}</div>
            <div className="metric-card-sub" style={{ color: '#FF7A1A' }}>
              Awaiting review
            </div>
          </div>

          {/* Card 3: Pending Orders */}
          <div className="metric-card" onClick={() => onSelectTab('pending-orders')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">Pending Orders</span>
              <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <AlertCircle size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.pendingOrders}</div>
            <div className="metric-card-sub" style={{ color: '#D97706' }}>
              In prep queue
            </div>
          </div>

          {/* Card 4: Approved Orders */}
          <div className="metric-card" onClick={() => onSelectTab('approved-orders')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">Approved Orders</span>
              <div className="metric-icon-box" style={{ background: '#E8F8F0', color: '#16A36A' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.approvedOrders}</div>
            <div className="metric-card-sub" style={{ color: '#16A36A' }}>
              Ready for dispatch
            </div>
          </div>

          {/* Card 5: Total Shipments */}
          <div className="metric-card" onClick={() => onSelectTab('all-shipments')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">Total Shipments</span>
              <div className="metric-icon-box" style={{ background: '#F5F3FF', color: '#7955E8' }}>
                <Boxes size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.totalShipments}</div>
            <div className="metric-card-sub" style={{ color: '#7955E8' }}>
              Active pipeline
            </div>
          </div>

          {/* Card 6: Shipments In Transit */}
          <div className="metric-card" onClick={() => onSelectTab('shipments-in-transit')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">In Transit</span>
              <div className="metric-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                <Truck size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.shipmentsInTransit}</div>
            <div className="metric-card-sub" style={{ color: '#3B82F6' }}>
              On regional highways
            </div>
          </div>

          {/* Card 7: Active Trips */}
          <div className="metric-card" onClick={() => onSelectTab('active-trips')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">Active Trips</span>
              <div className="metric-icon-box" style={{ background: '#E0F2FE', color: '#0284C7' }}>
                <Route size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.activeTrips}</div>
            <div className="metric-card-sub" style={{ color: '#0284C7' }}>
              Cruising telemetry on
            </div>
          </div>

          {/* Card 8: Completed Trips */}
          <div className="metric-card" onClick={() => onSelectTab('completed-trips')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">Completed Trips</span>
              <div className="metric-icon-box" style={{ background: '#DCFCE7', color: '#15803D' }}>
                <CheckSquare size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.completedTrips}</div>
            <div className="metric-card-sub" style={{ color: '#15803D' }}>
              100% verified POD
            </div>
          </div>

          {/* Card 9: Delayed Deliveries */}
          <div className="metric-card" onClick={() => onSelectTab('shipments')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">Delayed Deliveries</span>
              <div className="metric-icon-box" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="metric-card-val" style={{ color: '#DC2626' }}>{metrics.delayedDeliveries}</div>
            <div className="metric-card-sub" style={{ color: '#DC2626' }}>
              Traffic bottlenecks
            </div>
          </div>

          {/* Card 10: Pending Pickups */}
          <div className="metric-card" onClick={() => onSelectTab('pickup-management')} style={{ cursor: 'pointer' }}>
            <div className="metric-card-top">
              <span className="metric-card-label">Pending Pickups</span>
              <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
                <CalendarCheck size={18} />
              </div>
            </div>
            <div className="metric-card-val">{metrics.pendingPickups}</div>
            <div className="metric-card-sub" style={{ color: '#B45309' }}>
              Scheduled for loading
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Section (Section 15) */}
      <div className="content-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Layers size={18} color="#FF7A1A" />
              <span>Logistics Quick Actions</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '4px 0 0 0' }}>Launch freight operations, assign carriers, schedule routes, and track assets</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12
        }}>
          <button
            className="quick-action-card"
            onClick={onOpenCreateOrder}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5EAF2',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#FFF0E5', color: '#FF7A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <PackageCheck size={18} />
            </div>
            <strong style={{ fontSize: 13, color: '#14213D' }}>Create Order</strong>
            <span style={{ fontSize: 11, color: '#718096', marginTop: 3 }}>Book new freight</span>
          </button>

          <button
            className="quick-action-card"
            onClick={onOpenCreateShipment}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5EAF2',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Truck size={18} />
            </div>
            <strong style={{ fontSize: 13, color: '#14213D' }}>Create Shipment</strong>
            <span style={{ fontSize: 11, color: '#718096', marginTop: 3 }}>Dispatch consignment</span>
          </button>

          <button
            className="quick-action-card"
            onClick={onOpenCreateTrip}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5EAF2',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#F5F3FF', color: '#7955E8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Route size={18} />
            </div>
            <strong style={{ fontSize: 13, color: '#14213D' }}>Create Trip</strong>
            <span style={{ fontSize: 11, color: '#718096', marginTop: 3 }}>Schedule transport</span>
          </button>

          <button
            className="quick-action-card"
            onClick={() => onSelectTab('driver-assignment')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5EAF2',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#E8F8F0', color: '#16A36A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <UserCheck size={18} />
            </div>
            <strong style={{ fontSize: 13, color: '#14213D' }}>Assign Driver</strong>
            <span style={{ fontSize: 11, color: '#718096', marginTop: 3 }}>Allocate CDL pilots</span>
          </button>

          <button
            className="quick-action-card"
            onClick={() => onSelectTab('vehicle-assignment')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5EAF2',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Car size={18} />
            </div>
            <strong style={{ fontSize: 13, color: '#14213D' }}>Assign Vehicle</strong>
            <span style={{ fontSize: 11, color: '#718096', marginTop: 3 }}>Check fleet capacity</span>
          </button>

          <button
            className="quick-action-card"
            onClick={() => onSelectTab('route-management')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5EAF2',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Compass size={18} />
            </div>
            <strong style={{ fontSize: 13, color: '#14213D' }}>Plan Route</strong>
            <span style={{ fontSize: 11, color: '#718096', marginTop: 3 }}>Optimize corridors</span>
          </button>

          <button
            className="quick-action-card"
            onClick={() => onSelectTab('gps-tracking')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5EAF2',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <MapPin size={18} />
            </div>
            <strong style={{ fontSize: 13, color: '#14213D' }}>Track Shipment</strong>
            <span style={{ fontSize: 11, color: '#718096', marginTop: 3 }}>Live GPS tracking</span>
          </button>
        </div>
      </div>

      {/* 4. Order Management Table Overview (Section 6) */}
      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>
              <PackageCheck size={18} color="#FF7A1A" />
              <span>Customer Order Pipeline</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '4px 0 0 0' }}>Orders awaiting review, approved freight consignments, and transport assignments</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="filter-tabs">
              <button className={`filter-tab ${orderFilter === 'all' ? 'active' : ''}`} onClick={() => setOrderFilter('all')}>All ({orders.length})</button>
              <button className={`filter-tab ${orderFilter === 'pending' ? 'active' : ''}`} onClick={() => setOrderFilter('pending')}>Pending ({metrics.pendingOrders})</button>
              <button className={`filter-tab ${orderFilter === 'approved' ? 'active' : ''}`} onClick={() => setOrderFilter('approved')}>Approved ({metrics.approvedOrders})</button>
              <button className={`filter-tab ${orderFilter === 'transit' ? 'active' : ''}`} onClick={() => setOrderFilter('transit')}>In Transit ({metrics.shipmentsInTransit})</button>
            </div>
            <button className="btn-primary" onClick={onOpenCreateOrder} style={{ backgroundColor: '#FF7A1A', padding: '6px 12px', fontSize: 12 }}>
              <Plus size={14} /> New Order
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Origin / Pickup</th>
                <th>Destination</th>
                <th>Priority</th>
                <th>Weight (kg)</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 5).map(o => (
                <tr key={o.id}>
                  <td><strong style={{ color: '#14213D' }}>{o.id}</strong></td>
                  <td>
                    <div><strong>{o.customerName}</strong></div>
                    <div style={{ fontSize: 11, color: '#718096' }}>{o.type}</div>
                  </td>
                  <td>{o.pickupLocation}</td>
                  <td>{o.deliveryLocation}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor: o.priority === 'Urgent' ? '#FEE2E2' : o.priority === 'High' ? '#FEF3C7' : '#EFF6FF',
                      color: o.priority === 'Urgent' ? '#DC2626' : o.priority === 'High' ? '#D97706' : '#2563EB'
                    }}>
                      {o.priority}
                    </span>
                  </td>
                  <td>{o.totalWeightKg.toLocaleString()} kg</td>
                  <td><strong>${o.amount.toLocaleString()}</strong></td>
                  <td>
                    <span className={`status-pill status-${o.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {o.status === 'Pending' && (
                        <>
                          <button
                            className="table-action-btn success"
                            title="Approve Order"
                            onClick={() => onUpdateOrderStatus(o.id, 'Approved')}
                          >
                            <Check size={13} />
                          </button>
                          <button
                            className="table-action-btn danger"
                            title="Reject/Cancel Order"
                            onClick={() => onUpdateOrderStatus(o.id, 'Cancelled')}
                          >
                            <X size={13} />
                          </button>
                        </>
                      )}
                      {o.status === 'Approved' && !o.assignedTripId && (
                        <button
                          className="table-action-btn primary"
                          title="Assign Transportation"
                          onClick={onOpenCreateTrip}
                        >
                          <Truck size={13} /> Assign
                        </button>
                      )}
                      <button
                        className="table-action-btn"
                        title="View Details"
                        onClick={() => onSelectTab('all-orders')}
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Two-Column Grid: Shipment Tracking + Active Trips */}
      <div className="dashboard-grid-2col">
        {/* Active Shipments Card */}
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>
                <Boxes size={18} color="#2563EB" />
                <span>Active Consignments & Shipments</span>
              </h2>
              <p className="section-subtitle" style={{ margin: '3px 0 0 0' }}>Real-time highway progress & dispatch milestones</p>
            </div>
            <button className="card-action-link" onClick={() => onSelectTab('all-shipments')}>
              View All ({shipments.length}) <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {shipments.slice(0, 3).map(s => (
              <div key={s.id} style={{ padding: 12, borderRadius: 10, border: '1px solid #E5EAF2', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <strong style={{ fontSize: 13, color: '#14213D' }}>{s.id}</strong>
                    <span style={{ color: '#64748B', fontSize: 12, marginLeft: 8 }}>({s.orderId})</span>
                  </div>
                  <span className={`status-pill status-${s.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {s.status}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' }}>
                  <MapPin size={12} color="#64748B" />
                  <span>{s.origin}</span>
                  <span style={{ color: '#94A3B8' }}>➔</span>
                  <span>{s.destination}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginTop: 8 }}>
                  <span>Vehicle: <strong>{s.assignedVehicleReg}</strong> ({s.assignedDriver})</span>
                  <span><strong>{s.progressPercent}% Completed</strong></span>
                </div>

                <div style={{ width: '100%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${s.progressPercent}%`,
                    height: '100%',
                    backgroundColor: s.status === 'Delayed' ? '#DC2626' : s.status === 'Delivered' ? '#16A36A' : '#2563EB',
                    borderRadius: 3,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled & Active Trips Card */}
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>
                <Route size={18} color="#7955E8" />
                <span>Transportation Trips & Telemetry</span>
              </h2>
              <p className="section-subtitle" style={{ margin: '3px 0 0 0' }}>Active driver dispatches, vehicle speed & fuel status</p>
            </div>
            <button className="card-action-link" onClick={() => onSelectTab('all-trips')}>
              View All ({trips.length}) <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trips.slice(0, 3).map(t => (
              <div key={t.id} style={{ padding: 12, borderRadius: 10, border: '1px solid #E5EAF2', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <strong style={{ fontSize: 13, color: '#14213D' }}>{t.id}</strong>
                    <span style={{ fontSize: 11, background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: 4, marginLeft: 8 }}>
                      {t.routeCode}
                    </span>
                  </div>
                  <span className={`status-pill status-${t.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {t.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 12, margin: '6px 0' }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Driver: </span>
                    <strong>{t.driverName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Vehicle: </span>
                    <strong>{t.vehicleReg}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Distance: </span>
                    <span>{t.totalDistanceKm} km</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Telemetry: </span>
                    <strong style={{ color: t.status === 'Active' ? '#16A36A' : '#64748B' }}>
                      {t.currentSpeedKmh > 0 ? `${t.currentSpeedKmh} km/h` : 'Standby'}
                    </strong>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#64748B', display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #E2E8F0', paddingTop: 6 }}>
                  <span>Departed: {t.departureTime.split(' ')[1] || '08:00'}</span>
                  <span>Est. Arrival: <strong>{t.expectedArrival.split(' ')[1] || '16:00'} ({t.etaHours})</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Charts & Analytics Section (Section 12) */}
      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>
              <BarChart3 size={18} color="#FF7A1A" />
              <span>Logistics Analytics & Transportation Performance</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '4px 0 0 0' }}>Order progression velocity, monthly shipment throughput & carrier delivery success</p>
          </div>

          <div className="filter-tabs">
            <button className={`filter-tab ${analyticsFilter === '7d' ? 'active' : ''}`} onClick={() => setAnalyticsFilter('7d')}>7 Days</button>
            <button className={`filter-tab ${analyticsFilter === '30d' ? 'active' : ''}`} onClick={() => setAnalyticsFilter('30d')}>30 Days</button>
            <button className={`filter-tab ${analyticsFilter === '90d' ? 'active' : ''}`} onClick={() => setAnalyticsFilter('90d')}>Quarter</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Chart 1: Daily Order Trends */}
          <div style={{ padding: 14, borderRadius: 12, border: '1px solid #E5EAF2', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ fontSize: 13, color: '#14213D' }}>Daily Order Volume Trends</strong>
              <span style={{ fontSize: 11, color: '#16A36A', fontWeight: 700 }}>Avg 31 Orders/Day</span>
            </div>
            <InteractiveAreaChart
              data={analytics.dailyOrderTrends || []}
              xKey="label"
              yKey="value"
              height={190}
              color="#FF7A1A"
              unit=" orders"
            />
          </div>

          {/* Chart 2: Monthly Shipments */}
          <div style={{ padding: 14, borderRadius: 12, border: '1px solid #E5EAF2', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ fontSize: 13, color: '#14213D' }}>Monthly Shipment Throughput</strong>
              <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 700 }}>580 Shipments (Nov)</span>
            </div>
            <InteractiveBarChart
              data={analytics.monthlyShipmentTrends || []}
              xKey="label"
              yKey="value"
              height={190}
              color="#2563EB"
              unit=" shp"
            />
          </div>

          {/* Chart 3: Order Status Distribution */}
          <div style={{ padding: 14, borderRadius: 12, border: '1px solid #E5EAF2', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ fontSize: 13, color: '#14213D' }}>Order Status Distribution</strong>
              <span style={{ fontSize: 11, color: '#7955E8', fontWeight: 700 }}>126 Total Tracked</span>
            </div>
            <InteractiveDonutChart
              segments={analytics.orderStatusDistribution || []}
              centerLabel="Orders"
              centerValue="126"
              height={190}
            />
          </div>
        </div>
      </div>

      {/* 7. Two-Column Grid: Recent Activities & Alerts */}
      <div className="dashboard-grid-2col">
        {/* Recent Activities Timeline (Section 13) */}
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>
                <Clock size={18} color="#3478F6" />
                <span>Recent Logistics Activities</span>
              </h2>
              <p className="section-subtitle" style={{ margin: '3px 0 0 0' }}>Real-time chronological events log</p>
            </div>
          </div>

          <div className="activity-timeline" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activities.slice(0, 5).map(act => (
              <div key={act.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: act.status === 'success' ? '#E8F8F0' : act.status === 'warning' ? '#FFF5EE' : '#EFF6FF',
                  color: act.status === 'success' ? '#16A36A' : act.status === 'warning' ? '#FF7A1A' : '#3478F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {act.type === 'order_approved' ? <CheckCircle2 size={16} /> :
                   act.type === 'trip_dispatched' ? <Truck size={16} /> :
                   act.type === 'delivery_confirmed' ? <FileCheck size={16} /> : <AlertTriangle size={16} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 12.5, color: '#14213D' }}>{act.title}</strong>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{act.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{act.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Alerts (Section 14) */}
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>
                <AlertTriangle size={18} color="#FF7A1A" />
                <span>Operational Alerts & Advisories</span>
              </h2>
              <p className="section-subtitle" style={{ margin: '3px 0 0 0' }}>Critical bottlenecks, unassigned cargo & route cautions</p>
            </div>
            <button className="card-action-link" onClick={() => onSelectTab('notifications')}>
              View All ({alerts.length}) <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(alt => (
              <div
                key={alt.id}
                onClick={() => alt.linkTab && onSelectTab(alt.linkTab)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: `1px solid ${alt.severity === 'critical' ? '#FECACA' : alt.severity === 'warning' ? '#FED7AA' : '#BFDBFE'}`,
                  backgroundColor: alt.severity === 'critical' ? '#FEF2F2' : alt.severity === 'warning' ? '#FFF7ED' : '#EFF6FF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <strong style={{ fontSize: 12.5, color: alt.severity === 'critical' ? '#B91C1C' : alt.severity === 'warning' ? '#C2410C' : '#1D4ED8' }}>
                    {alt.title}
                  </strong>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{alt.time}</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>{alt.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
