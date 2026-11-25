// frontend/src/components/warehouse/WarehouseDashboard.jsx
import React from 'react';
import {
  Warehouse,
  Boxes,
  Layers,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  PackagePlus,
  PackageMinus,
  AlertTriangle,
  Clock,
  Forklift,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Calendar,
  Phone,
  FileText,
  AlertCircle
} from 'lucide-react';

export const WarehouseDashboard = ({
  data,
  metrics,
  onOpenAddInventory,
  onOpenStockIn,
  onOpenStockOut,
  onOpenReceiveShipment,
  onOpenCreateDispatch,
  onOpenTransferStock,
  onOpenReportDamaged,
  onSelectTab,
  onConfirmReceiving,
  onConfirmDispatch
}) => {
  const warehouses = data?.warehouses || [];
  const inventory = data?.inventory || [];
  const incomingGoods = data?.incomingGoods || [];
  const outgoingGoods = data?.outgoingGoods || [];
  const loadingSchedule = data?.loadingSchedule || [];
  const stockMovement = data?.stockMovement || [];
  const alerts = data?.alerts || [];

  const primaryWarehouse = warehouses[0] || {
    name: 'Chicago Central Logistics Hub',
    location: '4820 W 39th St, Chicago, IL',
    totalCapacitySqFt: 150000,
    occupiedPallets: 9840,
    totalCapacityPallets: 12000,
    utilizationRate: 82,
    status: 'Optimal'
  };

  // Inventory breakdown counts
  const availableCount = inventory.filter(i => i.status === 'Available').length;
  const lowStockCount = inventory.filter(i => i.status === 'Low Stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'Out of Stock').length;
  const reservedTotal = inventory.reduce((acc, i) => acc + (i.reserved || 0), 0);
  const totalStock = inventory.reduce((acc, i) => acc + (i.quantityOnHand || 0), 0);

  return (
    <div className="driver-dashboard-view warehouse-dashboard-view">
      {/* ===================================================================
          1. HERO BANNER - WAREHOUSE LOGISTICS THEME
          =================================================================== */}
      <section className="fleet-hero-container warehouse-hero-container" style={{ minHeight: '140px', marginBottom: '14px' }}>
        <div className="hero-content-left" style={{ flex: '1.1', minWidth: 0, zIndex: 3, padding: '16px 22px' }}>
          <div className="hero-badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 122, 26, 0.22)', border: '1px solid rgba(255, 122, 26, 0.5)', padding: '3px 10px', borderRadius: 20, marginBottom: 6, width: 'fit-content' }}>
            <Warehouse size={13} color="#FF7A1A" />
            <span style={{ color: '#FFB37C', fontWeight: '800', fontSize: '11px', letterSpacing: '0.04em' }}>TTC WAREHOUSE OS • ENTERPRISE LOGISTICS</span>
          </div>
          <div className="hero-heading-wrap">
            <h1 className="hero-welcome-title" style={{ fontSize: '20px', lineHeight: 1.15 }}>Welcome back,</h1>
            <h2 className="hero-manager-title" style={{ fontSize: '22px', color: '#FF7A1A', lineHeight: 1.15 }}>Warehouse Manager!</h2>
          </div>
          <p className="hero-description" style={{ fontSize: '12px', marginTop: '4px' }}>
            Optimize storage. Accelerate dispatch. Master inventory operations across all regional distribution hubs.
          </p>
        </div>

        <div className="hero-image-wrap" style={{ flex: '0.9', minWidth: 0 }}>
          <img
            src="/assets/warehouse-manager-login.webp"
            alt="Warehouse Operations"
            className="hero-banner-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          <div className="hero-gradient-overlay" />
        </div>
        <div className="hero-orange-glow-curve" />
      </section>

      {/* ===================================================================
          2. QUICK ACTIONS (7 ACTIONS)
          =================================================================== */}
      <section className="quick-actions-panel">
        <div className="quick-actions-header">
          <div className="quick-actions-title-wrap">
            <div className="quick-actions-icon-badge" style={{ backgroundColor: '#FFF0E5' }}>
              <Sparkles size={18} color="#FF7A1A" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="quick-actions-title">Warehouse Quick Actions</h3>
              <p className="quick-actions-subtitle">
                Execute core receiving, dispatch, stock adjustments, and bay workflows instantly
              </p>
            </div>
          </div>
        </div>

        <div className="driver-quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {/* 1. Add Inventory */}
          <button
            className="driver-action-btn action-card-item"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '12px 14px', width: '100%', textAlign: 'left', borderRadius: 12, border: '1px solid #E5EAF2', background: '#FFFFFF', cursor: 'pointer' }}
            onClick={onOpenAddInventory}
          >
            <div className="driver-btn-icon-box" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBF3FF', flexShrink: 0 }}>
              <Boxes size={20} color="#3478F6" />
            </div>
            <div className="driver-btn-text" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
              <strong className="driver-btn-title" style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#17243A', lineHeight: 1.25 }}>Add Inventory</strong>
              <span className="driver-btn-sub" style={{ display: 'block', fontSize: '11.5px', color: '#718096', lineHeight: 1.25 }}>Register new SKU item</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 'auto' }} />
          </button>

          {/* 2. Record Stock In */}
          <button
            className="driver-action-btn action-card-item"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '12px 14px', width: '100%', textAlign: 'left', borderRadius: 12, border: '1px solid #E5EAF2', background: '#FFFFFF', cursor: 'pointer' }}
            onClick={onOpenStockIn}
          >
            <div className="driver-btn-icon-box" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F8F0', flexShrink: 0 }}>
              <PackagePlus size={20} color="#16A36A" />
            </div>
            <div className="driver-btn-text" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
              <strong className="driver-btn-title" style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#17243A', lineHeight: 1.25 }}>Record Stock In</strong>
              <span className="driver-btn-sub" style={{ display: 'block', fontSize: '11.5px', color: '#718096', lineHeight: 1.25 }}>Add received stock</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 'auto' }} />
          </button>

          {/* 3. Record Stock Out */}
          <button
            className="driver-action-btn action-card-item"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '12px 14px', width: '100%', textAlign: 'left', borderRadius: 12, border: '1px solid #E5EAF2', background: '#FFFFFF', cursor: 'pointer' }}
            onClick={onOpenStockOut}
          >
            <div className="driver-btn-icon-box" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0E5', flexShrink: 0 }}>
              <PackageMinus size={20} color="#FF7A1A" />
            </div>
            <div className="driver-btn-text" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
              <strong className="driver-btn-title" style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#17243A', lineHeight: 1.25 }}>Record Stock Out</strong>
              <span className="driver-btn-sub" style={{ display: 'block', fontSize: '11.5px', color: '#718096', lineHeight: 1.25 }}>Deduct dispatched stock</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 'auto' }} />
          </button>

          {/* 4. Receive Shipment */}
          <button
            className="driver-action-btn action-card-item"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '12px 14px', width: '100%', textAlign: 'left', borderRadius: 12, border: '1px solid #E5EAF2', background: '#FFFFFF', cursor: 'pointer' }}
            onClick={onOpenReceiveShipment}
          >
            <div className="driver-btn-icon-box" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBF3FF', flexShrink: 0 }}>
              <ArrowDownToLine size={20} color="#3478F6" />
            </div>
            <div className="driver-btn-text" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
              <strong className="driver-btn-title" style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#17243A', lineHeight: 1.25 }}>Receive Shipment</strong>
              <span className="driver-btn-sub" style={{ display: 'block', fontSize: '11.5px', color: '#718096', lineHeight: 1.25 }}>Verify incoming BOL</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 'auto' }} />
          </button>

          {/* 5. Create Dispatch */}
          <button
            className="driver-action-btn action-card-item"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '12px 14px', width: '100%', textAlign: 'left', borderRadius: 12, border: '1px solid #E5EAF2', background: '#FFFFFF', cursor: 'pointer' }}
            onClick={onOpenCreateDispatch}
          >
            <div className="driver-btn-icon-box" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5EB', flexShrink: 0 }}>
              <Truck size={20} color="#FF7A1A" />
            </div>
            <div className="driver-btn-text" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
              <strong className="driver-btn-title" style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#17243A', lineHeight: 1.25 }}>Create Dispatch</strong>
              <span className="driver-btn-sub" style={{ display: 'block', fontSize: '11.5px', color: '#718096', lineHeight: 1.25 }}>Schedule outbound load</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 'auto' }} />
          </button>

          {/* 6. Transfer Stock */}
          <button
            className="driver-action-btn action-card-item"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '12px 14px', width: '100%', textAlign: 'left', borderRadius: 12, border: '1px solid #E5EAF2', background: '#FFFFFF', cursor: 'pointer' }}
            onClick={onOpenTransferStock}
          >
            <div className="driver-btn-icon-box" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3EEFF', flexShrink: 0 }}>
              <ArrowLeftRight size={20} color="#7955E8" />
            </div>
            <div className="driver-btn-text" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
              <strong className="driver-btn-title" style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#17243A', lineHeight: 1.25 }}>Transfer Stock</strong>
              <span className="driver-btn-sub" style={{ display: 'block', fontSize: '11.5px', color: '#718096', lineHeight: 1.25 }}>Inter-warehouse transfer</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 'auto' }} />
          </button>

          {/* 7. Report Damaged Goods */}
          <button
            className="driver-action-btn action-card-item"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '12px 14px', width: '100%', textAlign: 'left', borderRadius: 12, border: '1px solid #E5EAF2', background: '#FFFFFF', cursor: 'pointer' }}
            onClick={onOpenReportDamaged}
          >
            <div className="driver-btn-icon-box" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEECEC', flexShrink: 0 }}>
              <AlertTriangle size={20} color="#EF5350" />
            </div>
            <div className="driver-btn-text" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
              <strong className="driver-btn-title" style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#17243A', lineHeight: 1.25 }}>Report Damaged</strong>
              <span className="driver-btn-sub" style={{ display: 'block', fontSize: '11.5px', color: '#718096', lineHeight: 1.25 }}>Quarantine inspection defect</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0, marginLeft: 'auto' }} />
          </button>
        </div>
      </section>

      {/* ===================================================================
          3. NINE (9) SUMMARY KPI CARDS
          =================================================================== */}
      <section className="summary-cards-section">
        <div className="summary-cards-grid driver-kpi-grid warehouse-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
          {/* Card 1: Total Warehouses */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('warehouses')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#EBF3FF' }}>
              <Warehouse size={22} color="#3478F6" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Total Warehouses">Total Warehouses</span>
              <span className="kpi-card-value">{metrics?.totalWarehouses || 6}</span>
              <span className="kpi-sub-text" style={{ color: '#16A36A', fontWeight: 600 }}>
                ✓ All 6 Regional Hubs Online
              </span>
            </div>
          </div>

          {/* Card 2: Total Inventory Items */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('inventory')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#FFF0E5' }}>
              <Boxes size={22} color="#FF7A1A" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Total Inventory Items">Total Inventory Items</span>
              <span className="kpi-card-value">
                {metrics?.totalInventoryItems || 10} <span style={{ fontSize: 13, fontWeight: 500, color: '#718096' }}>SKUs</span>
              </span>
              <span className="kpi-sub-text" title="Across 5 distinct product categories">
                Across 5 distinct product categories
              </span>
            </div>
          </div>

          {/* Card 3: Total Stock Quantity */}
          <div className="kpi-stat-card">
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#E8F8F0' }}>
              <Layers size={22} color="#16A36A" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Total Stock Quantity">Total Stock Quantity</span>
              <span className="kpi-card-value">
                {(metrics?.totalStockQuantity || totalStock).toLocaleString()} <span style={{ fontSize: 13, fontWeight: 500, color: '#718096' }}>Units</span>
              </span>
              <span className="kpi-sub-text" style={{ color: '#16A36A', fontWeight: 600 }}>
                Valuation: $1,420,500
              </span>
            </div>
          </div>

          {/* Card 4: Incoming Shipments */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('incoming-goods')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#EBF3FF' }}>
              <ArrowDownToLine size={22} color="#3478F6" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Incoming Shipments">Incoming Shipments</span>
              <span className="kpi-card-value">
                {metrics?.incomingShipments || 4} <span style={{ fontSize: 13, fontWeight: 500, color: '#718096' }}>Scheduled</span>
              </span>
              <span className="kpi-sub-text" title="Expected today at receiving bays">
                Expected today at receiving bays
              </span>
            </div>
          </div>

          {/* Card 5: Outgoing Shipments */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('outgoing-goods')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#FFF0E5' }}>
              <ArrowUpFromLine size={22} color="#FF7A1A" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Outgoing Shipments">Outgoing Shipments</span>
              <span className="kpi-card-value">
                {metrics?.outgoingShipments || 5} <span style={{ fontSize: 13, fontWeight: 500, color: '#718096' }}>Orders</span>
              </span>
              <span className="kpi-sub-text" title="Fulfillment velocity on schedule">
                Fulfillment velocity on schedule
              </span>
            </div>
          </div>

          {/* Card 6: Pending Receipts */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('receiving-confirmation')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#E8F8F0' }}>
              <Clock size={22} color="#16A36A" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Pending Receipts">Pending Receipts</span>
              <span className="kpi-card-value">
                {metrics?.pendingReceipts || 3} <span style={{ fontSize: 13, fontWeight: 500, color: '#718096' }}>at Gate/Transit</span>
              </span>
              <span className="kpi-sub-text" style={{ color: '#3478F6', fontWeight: 600 }} title="Dock unloader crews assigned">
                Dock unloader crews assigned
              </span>
            </div>
          </div>

          {/* Card 7: Pending Dispatches */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('outgoing-goods')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#FFF5EB' }}>
              <Truck size={22} color="#FF7A1A" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Pending Dispatches">Pending Dispatches</span>
              <span className="kpi-card-value">
                {metrics?.pendingDispatches || 4} <span style={{ fontSize: 13, fontWeight: 500, color: '#718096' }}>Ready at Bay</span>
              </span>
              <span className="kpi-sub-text" style={{ color: '#FF7A1A', fontWeight: 600 }} title="Awaiting driver seal verification">
                Awaiting driver seal verification
              </span>
            </div>
          </div>

          {/* Card 8: Low Stock Items */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('low-stock-alerts')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#FEECEC' }}>
              <AlertTriangle size={22} color="#EF5350" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Low Stock Items">Low Stock Items</span>
              <span className="kpi-card-value" style={{ color: '#EF5350' }}>
                {metrics?.lowStockItems || 2} <span style={{ fontSize: 13, fontWeight: 500, color: '#718096' }}>SKUs Alert</span>
              </span>
              <span className="kpi-sub-text" style={{ color: '#EF5350', fontWeight: 600 }} title="Auto-reorder triggers sent">
                Auto-reorder triggers sent
              </span>
            </div>
          </div>

          {/* Card 9: Damaged Items */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('damaged-goods')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#F3EEFF' }}>
              <AlertCircle size={22} color="#7955E8" />
            </div>
            <div className="kpi-card-info" style={{ minWidth: 0, flex: 1 }}>
              <span className="kpi-card-label" title="Damaged Items">Damaged Items</span>
              <span className="kpi-card-value">
                {metrics?.damagedItems || 5} <span style={{ fontSize: 13, fontWeight: 500, color: '#718096' }}>Quarantine</span>
              </span>
              <span className="kpi-sub-text" title="Isolated in Hazmat Cage Q-01">
                Isolated in Hazmat Cage Q-01
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. WAREHOUSE OVERVIEW & 5. INVENTORY OVERVIEW
          =================================================================== */}
      <div className="dashboard-grid-2col">
        {/* Section 4.B: Warehouse Overview */}
        <div className="content-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <Warehouse size={18} color="#FF7A1A" /> Warehouse Facilities Overview
              </h3>
              <p className="section-subtitle">Real-time capacity utilization, storage density, and bay activity</p>
            </div>
            <span className="status-pill status-available">
              <CheckCircle2 size={13} /> {primaryWarehouse.status}
            </span>
          </div>

          <div style={{ background: '#F8FAFD', border: '1px solid #E5EAF2', borderRadius: 10, padding: 18, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#14213D' }}>{primaryWarehouse.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#3478F6', background: '#EBF3FF', padding: '2px 8px', borderRadius: 12 }}>
                {primaryWarehouse.code || 'CHI-01'}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: '#718096', marginBottom: 14 }}>
              📍 {primaryWarehouse.location} • Manager: <b>{primaryWarehouse.manager || 'Ethan Cole'}</b>
            </div>

            {/* Utilization Bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: '#17243A' }}>Capacity Utilization</span>
                <span style={{ color: '#FF7A1A' }}>{primaryWarehouse.utilizationRate}% ({primaryWarehouse.occupiedPallets?.toLocaleString()} / {primaryWarehouse.totalCapacityPallets?.toLocaleString()} Pallets)</span>
              </div>
              <div style={{ height: 10, backgroundColor: '#E2E8F0', borderRadius: 6, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${primaryWarehouse.utilizationRate}%`,
                    background: primaryWarehouse.utilizationRate > 90 ? 'linear-gradient(90deg, #FF7A1A, #EF5350)' : 'linear-gradient(90deg, #16A36A, #FF7A1A)',
                    borderRadius: 6
                  }}
                />
              </div>
            </div>

            <div className="trip-specs-grid" style={{ marginBottom: 0, padding: '10px 14px' }}>
              <div className="spec-item">
                <span className="spec-label">Total Area</span>
                <span className="spec-value">{primaryWarehouse.totalCapacitySqFt?.toLocaleString()} sq ft</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Available Slots</span>
                <span className="spec-value highlight">{(primaryWarehouse.availablePallets || 2160).toLocaleString()} Pallets</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Active Dock Bays</span>
                <span className="spec-value">12 of 16 Active</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Operating Schedule</span>
                <span className="spec-value">24/7 Monitored</span>
              </div>
            </div>
          </div>

          {/* Quick list of other regional hubs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {warehouses.slice(1, 4).map(w => (
              <div
                key={w.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #E5EAF2',
                  backgroundColor: '#FFFFFF',
                  fontSize: 13
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, color: '#14213D' }}>{w.name}</span>
                  <span style={{ fontSize: 11.5, color: '#718096', marginLeft: 8 }}>({w.code})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: w.utilizationRate > 90 ? '#EF5350' : '#16A36A' }}>
                    {w.utilizationRate}% Utilized
                  </span>
                  <span className={`status-pill ${w.utilizationRate > 90 ? 'status-outofservice' : 'status-available'}`} style={{ fontSize: 11 }}>
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4.C: Inventory Overview */}
        <div className="content-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <Boxes size={18} color="#3478F6" /> Inventory Condition & Stock Status
              </h3>
              <p className="section-subtitle">Real-time SKU availability, reservations, and critical threshold tracking</p>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => onSelectTab('inventory')}>
              View All {inventory.length} SKUs
            </button>
          </div>

          {/* Stock Condition Stat Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            <div style={{ background: '#E8F8F0', border: '1px solid #B8EBD0', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#16A36A' }}>{availableCount}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#16A36A', textTransform: 'uppercase' }}>Healthy Stock</div>
            </div>
            <div style={{ background: '#FFF5E6', border: '1px solid #FDE68A', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#D97706' }}>{lowStockCount}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>Low Stock Alert</div>
            </div>
            <div style={{ background: '#FEECEC', border: '1px solid #FCA5A5', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#EF5350' }}>{outOfStockCount}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#EF5350', textTransform: 'uppercase' }}>Out of Stock</div>
            </div>
          </div>

          {/* Top Inventory Items Table */}
          <div className="table-responsive" style={{ maxHeight: 250, overflowY: 'auto' }}>
            <table className="enterprise-table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>On Hand</th>
                  <th>Available</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 5).map(item => (
                  <tr key={item.sku}>
                    <td style={{ fontWeight: 800, color: '#14213D' }}>{item.sku}</td>
                    <td style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</td>
                    <td><span style={{ fontSize: 11, color: '#718096' }}>{item.category}</span></td>
                    <td style={{ fontWeight: 700 }}>{item.quantityOnHand}</td>
                    <td style={{ fontWeight: 800, color: item.available === 0 ? '#EF5350' : '#16A36A' }}>{item.available}</td>
                    <td>
                      <span className={`status-pill ${item.status === 'Available' ? 'status-available' : item.status === 'Low Stock' ? 'status-waiting' : 'status-outofservice'}`} style={{ fontSize: 10.5, padding: '2px 6px' }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================================================================
          6. INCOMING GOODS & 7. OUTGOING GOODS
          =================================================================== */}
      <div className="dashboard-grid-2col">
        {/* Incoming Goods */}
        <div className="content-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <ArrowDownToLine size={18} color="#16A36A" /> Incoming Goods & Dock Receiving
              </h3>
              <p className="section-subtitle">Supplier shipments arriving today for unload and inspection</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={onOpenReceiveShipment}>
              Receive Shipment
            </button>
          </div>

          <div className="table-responsive" style={{ maxHeight: 280, overflowY: 'auto' }}>
            <table className="enterprise-table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th>Shipment</th>
                  <th>Supplier</th>
                  <th>Bay</th>
                  <th>ETA</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {incomingGoods.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 800, color: '#14213D' }}>{s.shipmentId}</td>
                    <td>
                      <div>{s.supplier}</div>
                      <div style={{ fontSize: 11, color: '#718096' }}>{s.palletCount} Plts • {s.grossWeightKg} kg</div>
                    </td>
                    <td><span style={{ fontWeight: 700, color: '#3478F6' }}>{s.destinationBay}</span></td>
                    <td>{s.expectedDate}</td>
                    <td>
                      <span className={`status-pill ${s.status === 'Received & Stored' ? 'status-available' : s.status === 'Arrived at Gate' ? 'status-ontrip' : 'status-waiting'}`} style={{ fontSize: 11 }}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.status !== 'Received & Stored' ? (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => onConfirmReceiving && onConfirmReceiving(s.id)}
                        >
                          Confirm
                        </button>
                      ) : (
                        <span style={{ color: '#16A36A', fontWeight: 800, fontSize: 11 }}>✓ Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outgoing Goods */}
        <div className="content-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <ArrowUpFromLine size={18} color="#FF7A1A" /> Outgoing Goods & Dispatch Schedule
              </h3>
              <p className="section-subtitle">Staged consignments ready for carrier pickup and seal verification</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={onOpenCreateDispatch}>
              Create Dispatch
            </button>
          </div>

          <div className="table-responsive" style={{ maxHeight: 280, overflowY: 'auto' }}>
            <table className="enterprise-table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Destination</th>
                  <th>Carrier / Driver</th>
                  <th>Staging Bay</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {outgoingGoods.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 800, color: '#14213D' }}>{d.orderId}</td>
                    <td style={{ maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.destination}</td>
                    <td>
                      <div>{d.assignedDriver}</div>
                      <div style={{ fontSize: 11, color: '#718096' }}>{d.carrier}</div>
                    </td>
                    <td><span style={{ fontWeight: 700, color: '#FF7A1A' }}>{d.dockBay}</span></td>
                    <td>
                      <span className={`status-pill ${d.dispatchStatus === 'Dispatched (En Route)' ? 'status-available' : 'status-waiting'}`} style={{ fontSize: 11 }}>
                        {d.dispatchStatus}
                      </span>
                    </td>
                    <td>
                      {d.dispatchStatus !== 'Dispatched (En Route)' ? (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => onConfirmDispatch && onConfirmDispatch(d.id)}
                        >
                          Dispatch
                        </button>
                      ) : (
                        <span style={{ color: '#16A36A', fontWeight: 800, fontSize: 11 }}>✓ En Route</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================================================================
          8. LOADING & UNLOADING DOCK BAY MANAGEMENT
          =================================================================== */}
      <section className="content-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Forklift size={18} color="#3478F6" /> Loading & Unloading Dock Bay Schedules
            </h3>
            <p className="section-subtitle">Real-time apron scheduling, carrier turnaround time, and forklift crew allocation</p>
          </div>
          <span className="status-pill status-available">16 Heavy Commercial Dock Bays Active</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {loadingSchedule.map((bay, idx) => (
            <div
              key={idx}
              style={{
                background: '#F8FAFD',
                border: '1px solid #E5EAF2',
                borderRadius: 10,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: '#14213D' }}>{bay.bay}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: bay.type === 'Loading' ? '#FFF0E5' : '#EBF3FF',
                    color: bay.type === 'Loading' ? '#FF7A1A' : '#3478F6'
                  }}
                >
                  {bay.type}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: '#17243A', fontWeight: 600 }}>{bay.carrier}</div>
              <div style={{ fontSize: 11.5, color: '#718096' }}>Shipment: <b>{bay.shipment}</b></div>
              <div style={{ fontSize: 11.5, color: '#718096' }}>Window: {bay.scheduledTime} ({bay.actualTime})</div>
              <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>👷 {bay.operator}</span>
                <span className={`status-pill ${bay.status === 'Completed' ? 'status-available' : bay.status === 'In Progress' ? 'status-ontrip' : 'status-waiting'}`} style={{ fontSize: 10.5 }}>
                  {bay.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          9. STOCK MOVEMENT AUDIT HISTORY
          =================================================================== */}
      <section className="content-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <ArrowLeftRight size={18} color="#7955E8" /> Live Stock Movement & Audit Log
            </h3>
            <p className="section-subtitle">Real-time ledger of stock in, stock out, inter-warehouse transfers, and quarantine records</p>
          </div>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => onSelectTab('stock-in')}>
            Log Adjustment
          </button>
        </div>

        <div className="table-responsive">
          <table className="enterprise-table" style={{ fontSize: 12.5 }}>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Timestamp</th>
                <th>Type</th>
                <th>SKU</th>
                <th>Item Description</th>
                <th>Qty</th>
                <th>From Location</th>
                <th>To Location</th>
                <th>Operator</th>
              </tr>
            </thead>
            <tbody>
              {stockMovement.map(mov => (
                <tr key={mov.id}>
                  <td style={{ fontWeight: 800, color: '#14213D' }}>{mov.id}</td>
                  <td>{mov.timestamp}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: mov.type === 'Stock In' ? '#E8F8F0' : mov.type === 'Stock Out' ? '#FFF0E5' : mov.type === 'Transfer Out' ? '#F3EEFF' : '#FEECEC',
                        color: mov.type === 'Stock In' ? '#16A36A' : mov.type === 'Stock Out' ? '#FF7A1A' : mov.type === 'Transfer Out' ? '#7955E8' : '#EF5350'
                      }}
                    >
                      {mov.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{mov.sku}</td>
                  <td style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mov.name}</td>
                  <td style={{ fontWeight: 800, color: mov.quantity > 0 ? '#16A36A' : '#EF5350' }}>
                    {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                  </td>
                  <td><span style={{ fontSize: 11.5, color: '#718096' }}>{mov.fromLocation}</span></td>
                  <td><span style={{ fontSize: 11.5, color: '#14213D', fontWeight: 600 }}>{mov.toLocation}</span></td>
                  <td><span style={{ fontSize: 11.5 }}>{mov.operator}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================================
          10. CHARTS & ANALYTICS SECTION (5 CHARTS)
          =================================================================== */}
      <section className="content-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <BarChart3 size={18} color="#FF7A1A" /> Warehouse Analytics & Operational Intelligence
            </h3>
            <p className="section-subtitle">Visual performance trends, storage allocation, and shipment flow metrics</p>
          </div>
          <span className="status-pill status-available">Monthly Reporting Period: Q4 2026</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Chart 1: Inventory Category Distribution (Donut Style SVG) */}
          <div style={{ background: '#F8FAFD', border: '1px solid #E5EAF2', borderRadius: 10, padding: 18 }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
              1. Inventory Category Distribution
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <svg width="140" height="140" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="6" />
                {/* Automotive Parts: 40% */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3478F6" strokeWidth="6" strokeDasharray="40 60" strokeDashoffset="25" />
                {/* Industrial Machinery: 25% */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FF7A1A" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="85" />
                {/* Chemicals & Packaging: 20% */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#16A36A" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="60" />
                {/* Electrical: 15% */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#7955E8" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="40" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5 }}>
                <div><span style={{ display: 'inline-block', width: 10, height: 10, background: '#3478F6', borderRadius: 2, marginRight: 6 }} />Auto Parts (40%)</div>
                <div><span style={{ display: 'inline-block', width: 10, height: 10, background: '#FF7A1A', borderRadius: 2, marginRight: 6 }} />Industrial (25%)</div>
                <div><span style={{ display: 'inline-block', width: 10, height: 10, background: '#16A36A', borderRadius: 2, marginRight: 6 }} />Chemicals (20%)</div>
                <div><span style={{ display: 'inline-block', width: 10, height: 10, background: '#7955E8', borderRadius: 2, marginRight: 6 }} />Electrical (15%)</div>
              </div>
            </div>
          </div>

          {/* Chart 2: Daily Stock Movement (Line/Area Trend SVG) */}
          <div style={{ background: '#F8FAFD', border: '1px solid #E5EAF2', borderRadius: 10, padding: 18 }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
              2. Daily Stock Movement (7 Days)
            </h4>
            <div style={{ height: 130 }}>
              <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0,80 Q 50,40 100,55 T 200,30 T 300,45 L 300,100 L 0,100 Z" fill="url(#stockGrad)" />
                <path d="M 0,80 Q 50,40 100,55 T 200,30 T 300,45" fill="none" stroke="#FF7A1A" strokeWidth="3" />
                <circle cx="100" cy="55" r="4" fill="#FF7A1A" />
                <circle cx="200" cy="30" r="4" fill="#FF7A1A" />
                <circle cx="300" cy="45" r="4" fill="#FF7A1A" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#718096', marginTop: 4 }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
            </div>
          </div>

          {/* Chart 3: Incoming vs Outgoing Shipments (Bar Chart SVG) */}
          <div style={{ background: '#F8FAFD', border: '1px solid #E5EAF2', borderRadius: 10, padding: 18 }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
              3. Incoming vs Outgoing Shipments
            </h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 110, paddingTop: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 34, height: 75, background: '#3478F6', borderRadius: '4px 4px 0 0', margin: '0 auto' }} />
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>Incoming (18)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 34, height: 95, background: '#FF7A1A', borderRadius: '4px 4px 0 0', margin: '0 auto' }} />
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>Outgoing (24)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 34, height: 45, background: '#7955E8', borderRadius: '4px 4px 0 0', margin: '0 auto' }} />
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>Transfers (8)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          11. ALERTS & OPERATIONAL NOTIFICATIONS BULLETIN
          =================================================================== */}
      <section className="content-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <AlertCircle size={18} color="#EF5350" /> Critical Warehouse Alerts & Bulletins
            </h3>
            <p className="section-subtitle">Real-time alerts for low stock triggers, dock bay delays, and safety quarantine logs</p>
          </div>
          <span className="status-pill status-available">{alerts.length} Active Alerts</span>
        </div>

        <div className="driver-notifications-list">
          {alerts.map(a => (
            <div key={a.id} className={`driver-notif-item ${a.severity === 'critical' ? 'emergency' : a.severity === 'warning' ? 'assignment' : 'advisory'}`}>
              <div className="notif-icon-bubble">
                {a.severity === 'critical' ? (
                  <AlertTriangle size={18} color="#EF5350" />
                ) : a.severity === 'warning' ? (
                  <Boxes size={18} color="#FF7A1A" />
                ) : (
                  <CheckCircle2 size={18} color="#16A36A" />
                )}
              </div>
              <div className="notif-body">
                <div className="notif-title-row">
                  <span className="notif-title">{a.title}</span>
                  <span className="notif-time">{a.time}</span>
                </div>
                <p className="notif-message">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
