// frontend/src/components/warehouse/WarehouseViews.jsx
import React, { useState } from 'react';
import {
  Warehouse,
  Boxes,
  PackagePlus,
  PackageMinus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Truck,
  Forklift,
  ArrowLeftRight,
  AlertTriangle,
  FileBarChart2,
  Bell,
  User,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Phone,
  FileText,
  ShieldCheck,
  AlertCircle,
  Tag,
  DollarSign,
  Download,
  Filter,
  Check,
  Eye,
  Plus
} from 'lucide-react';

/* =========================================================================
   1. WAREHOUSE MANAGEMENT VIEW (All Warehouses, Add, Edit)
   ========================================================================= */
export const WarehouseManagementView = ({ warehouses = [], onOpenAddWarehouse }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = warehouses.filter(w => {
    if (filterType !== 'all' && w.type !== filterType) return false;
    if (search && !w.name.toLowerCase().includes(search.toLowerCase()) && !w.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Warehouse Facility Management</h2>
          <p className="subview-subtitle">Manage regional distribution hubs, storage capacity, and dock apron facilities</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={onOpenAddWarehouse}>
            <Plus size={16} /> Add Warehouse Facility
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#FFFFFF', padding: 14, borderRadius: 10, border: '1px solid #E5EAF2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, background: '#F8FAFD', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <Search size={16} color="#718096" />
          <input
            type="text"
            placeholder="Search facility name, code, or address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 13 }}
          />
        </div>
        <div className="filter-tabs">
          <button className={`filter-tab ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All ({warehouses.length})</button>
          <button className={`filter-tab ${filterType === 'Distribution Hub' ? 'active' : ''}`} onClick={() => setFilterType('Distribution Hub')}>Distribution Hubs</button>
          <button className={`filter-tab ${filterType === 'Freight Cross-Dock' ? 'active' : ''}`} onClick={() => setFilterType('Freight Cross-Dock')}>Cross-Docks</button>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {filtered.map(w => (
          <div key={w.id} className="trip-card-item" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#14213D' }}>{w.name}</span>
                <span style={{ background: '#EBF3FF', color: '#3478F6', padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                  {w.code}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#718096', marginBottom: 12 }}>
                📍 {w.location}
              </div>

              {/* Progress Utilization */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  <span>Utilization Rate</span>
                  <span style={{ color: w.utilizationRate > 90 ? '#EF5350' : '#16A36A' }}>{w.utilizationRate}%</span>
                </div>
                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${w.utilizationRate}%`, background: w.utilizationRate > 90 ? '#EF5350' : '#16A36A' }} />
                </div>
              </div>

              <div className="trip-specs-grid" style={{ marginBottom: 0, padding: 10 }}>
                <div className="spec-item">
                  <span className="spec-label">Capacity</span>
                  <span className="spec-value">{w.totalCapacityPallets?.toLocaleString()} Pallets</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Occupied</span>
                  <span className="spec-value highlight">{w.occupiedPallets?.toLocaleString()} Plts</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Dock Bays</span>
                  <span className="spec-value">{w.baysCount} Bays</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Manager</span>
                  <span className="spec-value">{w.manager}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #E5EAF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`status-pill ${w.utilizationRate > 90 ? 'status-outofservice' : 'status-available'}`} style={{ fontSize: 11 }}>
                {w.status}
              </span>
              <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 11.5 }} onClick={() => alert(`Opening configuration for ${w.name}...`)}>
                Edit Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   2. INVENTORY MANAGEMENT VIEW (All Inventory, Add, Stock Details)
   ========================================================================= */
export const InventoryManagementView = ({ inventory = [], onOpenAddInventory }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = inventory.filter(i => {
    if (category !== 'all' && i.category !== category) return false;
    if (search && !i.sku.toLowerCase().includes(search.toLowerCase()) && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Inventory & SKU Master Catalog</h2>
          <p className="subview-subtitle">Live inventory stock levels, storage zone mapping, and automatic reorder thresholds</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenAddInventory}>
          <Plus size={16} /> Add Inventory SKU
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#FFFFFF', padding: 14, borderRadius: 10, border: '1px solid #E5EAF2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, background: '#F8FAFD', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <Search size={16} color="#718096" />
          <input
            type="text"
            placeholder="Search SKU code, item name, supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 13 }}
          />
        </div>
        <select
          className="form-select"
          style={{ width: 220 }}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Automotive Parts">Automotive Parts</option>
          <option value="Industrial Machinery">Industrial Machinery</option>
          <option value="Electrical Components">Electrical Components</option>
          <option value="Packaging Materials">Packaging Materials</option>
          <option value="Chemicals & Lubricants">Chemicals & Lubricants</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>SKU Code</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Zone / Rack</th>
              <th>On Hand</th>
              <th>Reserved</th>
              <th>Available</th>
              <th>Unit Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.sku}>
                <td style={{ fontWeight: 800, color: '#14213D' }}>{item.sku}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: '#718096' }}>Supplier: {item.supplier} • {item.weightKg} kg</div>
                </td>
                <td><span style={{ fontSize: 12, color: '#475569' }}>{item.category}</span></td>
                <td><span style={{ fontWeight: 600, color: '#3478F6' }}>{item.zone}</span></td>
                <td style={{ fontWeight: 700 }}>{item.quantityOnHand}</td>
                <td style={{ color: '#D97706', fontWeight: 600 }}>{item.reserved}</td>
                <td style={{ fontWeight: 800, color: item.available === 0 ? '#EF5350' : '#16A36A' }}>
                  {item.available}
                </td>
                <td>${Number(item.unitCost).toFixed(2)}</td>
                <td>
                  <span className={`status-pill ${item.status === 'Available' ? 'status-available' : item.status === 'Low Stock' ? 'status-waiting' : 'status-outofservice'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 11.5 }} onClick={() => alert(`Details for ${item.sku}:\n${item.name}\nReorder Point: ${item.reorderPoint}\nLast Restocked: ${item.lastRestocked}`)}>
                    Details
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

/* =========================================================================
   3. GOODS RECEIVING VIEW
   ========================================================================= */
export const GoodsReceivingView = ({ incomingGoods = [], onConfirmReceiving }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Goods Receiving & Inbound Cross-Dock</h2>
          <p className="subview-subtitle">Inbound carrier check-in, Bill of Lading verification, and quarantine triage</p>
        </div>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Supplier</th>
              <th>Carrier / Driver</th>
              <th>Pallets</th>
              <th>Gross Weight</th>
              <th>Assigned Bay</th>
              <th>BOL Document</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {incomingGoods.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 800, color: '#14213D' }}>{s.shipmentId}</td>
                <td>{s.supplier}</td>
                <td>
                  <div>{s.carrier}</div>
                  <div style={{ fontSize: 11, color: '#718096' }}>Driver: {s.driverName}</div>
                </td>
                <td style={{ fontWeight: 700 }}>{s.palletCount} Plts</td>
                <td>{s.grossWeightKg?.toLocaleString()} kg</td>
                <td><span style={{ fontWeight: 800, color: '#3478F6' }}>{s.destinationBay}</span></td>
                <td><span style={{ fontSize: 11.5, color: '#7955E8', fontWeight: 600 }}>{s.billOfLading}</span></td>
                <td>
                  <span className={`status-pill ${s.status === 'Received & Stored' ? 'status-available' : s.status === 'Arrived at Gate' ? 'status-ontrip' : 'status-waiting'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  {s.status !== 'Received & Stored' ? (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '5px 12px', fontSize: 12 }}
                      onClick={() => onConfirmReceiving(s.id)}
                    >
                      Verify & Receive
                    </button>
                  ) : (
                    <span style={{ color: '#16A36A', fontWeight: 800, fontSize: 12 }}>✓ Received</span>
                  )}
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
   4. GOODS DISPATCH VIEW
   ========================================================================= */
export const GoodsDispatchView = ({ outgoingGoods = [], onConfirmDispatch, onOpenCreateDispatch }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Goods Dispatch & Outbound Staging</h2>
          <p className="subview-subtitle">Consignment staging, tamper-evident seal auditing, and driver dispatch release</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateDispatch}>
          <Plus size={16} /> Create Dispatch Order
        </button>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Destination Terminal</th>
              <th>Assigned Carrier</th>
              <th>Assigned Driver</th>
              <th>Pallets</th>
              <th>Outbound Bay</th>
              <th>Tamper Seal</th>
              <th>Loading Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {outgoingGoods.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 800, color: '#14213D' }}>{d.orderId}</td>
                <td>{d.destination}</td>
                <td>{d.carrier}</td>
                <td>{d.assignedDriver}</td>
                <td style={{ fontWeight: 700 }}>{d.palletCount} Plts ({d.weightKg?.toLocaleString()} kg)</td>
                <td><span style={{ fontWeight: 800, color: '#FF7A1A' }}>{d.dockBay}</span></td>
                <td><span style={{ fontSize: 11.5, color: '#334155' }}>{d.sealNumber}</span></td>
                <td>
                  <span className={`status-pill ${d.dispatchStatus === 'Dispatched (En Route)' ? 'status-available' : 'status-waiting'}`}>
                    {d.dispatchStatus}
                  </span>
                </td>
                <td>
                  {d.dispatchStatus !== 'Dispatched (En Route)' ? (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '5px 12px', fontSize: 12 }}
                      onClick={() => onConfirmDispatch(d.id)}
                    >
                      Authorize Dispatch
                    </button>
                  ) : (
                    <span style={{ color: '#16A36A', fontWeight: 800, fontSize: 12 }}>✓ Dispatched</span>
                  )}
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
   5. STOCK IN & 6. STOCK OUT VIEWS
   ========================================================================= */
export const StockInView = ({ inventory = [], stockMovement = [], onOpenStockIn }) => {
  const stockInHistory = stockMovement.filter(m => m.type === 'Stock In');

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Stock In Operations & Inbound Ledger</h2>
          <p className="subview-subtitle">Record warehouse stock increments, supplier receipts, and pallet replenishment</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenStockIn}>
          <PackagePlus size={16} /> Record Stock In
        </button>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Timestamp</th>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Quantity Added</th>
              <th>Receiving Source</th>
              <th>Putaway Rack</th>
              <th>Operator</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {stockInHistory.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: 800, color: '#14213D' }}>{m.id}</td>
                <td>{m.timestamp}</td>
                <td style={{ fontWeight: 700 }}>{m.sku}</td>
                <td>{m.name}</td>
                <td style={{ color: '#16A36A', fontWeight: 800 }}>+{m.quantity} Units</td>
                <td>{m.fromLocation}</td>
                <td><span style={{ fontWeight: 700, color: '#3478F6' }}>{m.toLocation}</span></td>
                <td>{m.operator}</td>
                <td><span style={{ fontSize: 11.5, color: '#718096' }}>{m.reference}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const StockOutView = ({ inventory = [], stockMovement = [], onOpenStockOut }) => {
  const stockOutHistory = stockMovement.filter(m => m.type === 'Stock Out');

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Stock Out Operations & Dispatch Ledger</h2>
          <p className="subview-subtitle">Record warehouse stock deductions, dispatch staging, and pallet withdrawals</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenStockOut}>
          <PackageMinus size={16} /> Record Stock Out
        </button>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Timestamp</th>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Quantity Deducted</th>
              <th>Origin Storage Rack</th>
              <th>Destination Bay</th>
              <th>Operator</th>
              <th>Order Ref</th>
            </tr>
          </thead>
          <tbody>
            {stockOutHistory.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: 800, color: '#14213D' }}>{m.id}</td>
                <td>{m.timestamp}</td>
                <td style={{ fontWeight: 700 }}>{m.sku}</td>
                <td>{m.name}</td>
                <td style={{ color: '#EF5350', fontWeight: 800 }}>{m.quantity} Units</td>
                <td>{m.fromLocation}</td>
                <td><span style={{ fontWeight: 700, color: '#FF7A1A' }}>{m.toLocation}</span></td>
                <td>{m.operator}</td>
                <td><span style={{ fontSize: 11.5, color: '#718096' }}>{m.reference}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   7. SHIPMENT MANAGEMENT VIEW (Incoming & Outgoing tabs)
   ========================================================================= */
export const ShipmentManagementView = ({ incomingGoods = [], outgoingGoods = [] }) => {
  const [tab, setTab] = useState('incoming');

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Shipment Management</h2>
          <p className="subview-subtitle">Comprehensive tracking for all inbound freight receipts and outbound dispatches</p>
        </div>
        <div className="filter-tabs">
          <button className={`filter-tab ${tab === 'incoming' ? 'active' : ''}`} onClick={() => setTab('incoming')}>
            Inbound Shipments ({incomingGoods.length})
          </button>
          <button className={`filter-tab ${tab === 'outgoing' ? 'active' : ''}`} onClick={() => setTab('outgoing')}>
            Outbound Dispatches ({outgoingGoods.length})
          </button>
        </div>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          {tab === 'incoming' ? (
            <>
              <thead>
                <tr>
                  <th>Shipment</th>
                  <th>Supplier</th>
                  <th>Carrier</th>
                  <th>Pallets</th>
                  <th>ETA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incomingGoods.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 800, color: '#14213D' }}>{s.shipmentId}</td>
                    <td>{s.supplier}</td>
                    <td>{s.carrier} ({s.driverName})</td>
                    <td>{s.palletCount} Plts</td>
                    <td>{s.expectedDate}</td>
                    <td><span className="status-pill status-available">{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Destination</th>
                  <th>Carrier</th>
                  <th>Driver</th>
                  <th>Pallets</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {outgoingGoods.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 800, color: '#14213D' }}>{d.orderId}</td>
                    <td>{d.destination}</td>
                    <td>{d.carrier}</td>
                    <td>{d.assignedDriver}</td>
                    <td>{d.palletCount} Plts</td>
                    <td><span className="status-pill status-available">{d.dispatchStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   8. LOADING & 9. UNLOADING VIEWS
   ========================================================================= */
export const LoadingManagementView = ({ loadingSchedule = [] }) => {
  const loadingOnly = loadingSchedule.filter(b => b.type === 'Loading');

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Outbound Loading Dock Apron</h2>
          <p className="subview-subtitle">Commercial carrier bay queues, pallet loading verification, and forklift operators</p>
        </div>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Dock Bay</th>
              <th>Assigned Carrier</th>
              <th>Order / Shipment</th>
              <th>Scheduled Window</th>
              <th>Progress</th>
              <th>Forklift Crew</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loadingOnly.map((b, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 800, color: '#FF7A1A' }}>{b.bay}</td>
                <td>{b.carrier}</td>
                <td>{b.shipment}</td>
                <td>{b.scheduledTime}</td>
                <td><span style={{ fontWeight: 700 }}>{b.actualTime}</span></td>
                <td>{b.operator}</td>
                <td><span className={`status-pill ${b.status === 'Completed' ? 'status-available' : 'status-waiting'}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const UnloadingManagementView = ({ loadingSchedule = [] }) => {
  const unloadingOnly = loadingSchedule.filter(b => b.type === 'Unloading');

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Inbound Unloading Dock Apron</h2>
          <p className="subview-subtitle">Inbound truck receiving bays, pallet de-consolidation, and QA check-in</p>
        </div>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Dock Bay</th>
              <th>Inbound Carrier</th>
              <th>BOL Shipment</th>
              <th>Scheduled Window</th>
              <th>Progress</th>
              <th>Unloading Crew</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {unloadingOnly.map((b, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 800, color: '#3478F6' }}>{b.bay}</td>
                <td>{b.carrier}</td>
                <td>{b.shipment}</td>
                <td>{b.scheduledTime}</td>
                <td><span style={{ fontWeight: 700 }}>{b.actualTime}</span></td>
                <td>{b.operator}</td>
                <td><span className={`status-pill ${b.status === 'Completed' ? 'status-available' : 'status-waiting'}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   10. STOCK TRANSFERS VIEW
   ========================================================================= */
export const StockTransfersView = ({ stockTransfers = [], onOpenTransferStock }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Warehouse-to-Warehouse Stock Transfers</h2>
          <p className="subview-subtitle">Balance stock levels across regional distribution centers via dedicated line hauls</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenTransferStock}>
          <ArrowLeftRight size={16} /> New Stock Transfer
        </button>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Transfer ID</th>
              <th>Origin Facility</th>
              <th>Destination Facility</th>
              <th>SKU & Item</th>
              <th>Quantity</th>
              <th>Carrier</th>
              <th>ETA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stockTransfers.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 800, color: '#14213D' }}>{t.id}</td>
                <td>{t.originWarehouse}</td>
                <td><b>{t.destWarehouse}</b></td>
                <td>
                  <div>{t.sku}</div>
                  <div style={{ fontSize: 11, color: '#718096' }}>{t.itemName}</div>
                </td>
                <td style={{ fontWeight: 800, color: '#7955E8' }}>{t.quantity} Units</td>
                <td>{t.carrier}</td>
                <td>{t.eta}</td>
                <td>
                  <span className={`status-pill ${t.status === 'Completed' ? 'status-available' : 'status-ontrip'}`}>
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
   11. DAMAGED GOODS VIEW
   ========================================================================= */
export const DamagedGoodsView = ({ damagedGoods = [], onOpenReportDamaged }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Damaged Goods & Hazmat Quarantine</h2>
          <p className="subview-subtitle">Inspection defect containment, RMA supplier return claims, and incident audits</p>
        </div>
        <button className="btn" style={{ background: '#EF5350', color: '#FFFFFF', padding: '10px 18px', borderRadius: 8, fontWeight: 700 }} onClick={onOpenReportDamaged}>
          <AlertTriangle size={16} /> Report Damaged Stock
        </button>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Damaged SKU</th>
              <th>Product Name</th>
              <th>Qty</th>
              <th>Quarantine Location</th>
              <th>Defect / Incident Reason</th>
              <th>Loss Impact</th>
              <th>Action Plan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {damagedGoods.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 800, color: '#EF5350' }}>{d.id}</td>
                <td style={{ fontWeight: 700 }}>{d.sku}</td>
                <td>{d.name}</td>
                <td style={{ fontWeight: 800, color: '#EF5350' }}>{d.quantity}</td>
                <td><span style={{ fontWeight: 700, color: '#14213D' }}>{d.location}</span></td>
                <td style={{ maxWidth: 220 }}>{d.reason}</td>
                <td style={{ fontWeight: 700 }}>${Number(d.costImpact).toFixed(2)}</td>
                <td style={{ fontSize: 11.5, color: '#334155' }}>{d.action}</td>
                <td>
                  <span className="status-pill status-outofservice" style={{ fontSize: 11 }}>
                    {d.status}
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
   12. INVENTORY REPORTS VIEW
   ========================================================================= */
export const InventoryReportsView = ({ inventory = [], warehouses = [] }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Inventory Valuation & Movement Reports</h2>
          <p className="subview-subtitle">Weekly stock velocity, turn-rate metrics, and warehouse space occupancy statements</p>
        </div>
        <button className="btn btn-secondary" onClick={() => alert('Exporting comprehensive WMS audit ledger to CSV / PDF...')}>
          <Download size={16} /> Export Reports (PDF/CSV)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div className="content-card">
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 10 }}>Total Stock Valuation</h3>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#16A36A' }}>$1,420,500.00</div>
          <p style={{ fontSize: 12, color: '#718096', marginTop: 4 }}>Based on FIFO replacement unit cost across all 6 hubs.</p>
        </div>

        <div className="content-card">
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 10 }}>Inventory Turn Velocity</h3>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#3478F6' }}>8.4x / Year</div>
          <p style={{ fontSize: 12, color: '#718096', marginTop: 4 }}>Average days on dock/rack: 14.2 days.</p>
        </div>

        <div className="content-card">
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 10 }}>Fulfillment Accuracy</h3>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#FF7A1A' }}>99.82%</div>
          <p style={{ fontSize: 12, color: '#718096', marginTop: 4 }}>Barcode scanning and RFID cross-dock verification.</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   13. WAREHOUSE NOTIFICATIONS VIEW
   ========================================================================= */
export const WarehouseNotificationsView = ({ alerts = [] }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Warehouse Operational Alerts & Bulletins</h2>
          <p className="subview-subtitle">Live bulletin board for low stock thresholds, bay congestion, and dispatch schedules</p>
        </div>
      </div>

      <div className="driver-notifications-list content-card">
        {alerts.map(a => (
          <div key={a.id} className={`driver-notif-item ${a.severity === 'critical' ? 'emergency' : a.severity === 'warning' ? 'assignment' : 'advisory'}`}>
            <div className="notif-icon-bubble">
              {a.severity === 'critical' ? <AlertTriangle size={18} color="#EF5350" /> : <Bell size={18} color="#3478F6" />}
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
    </div>
  );
};

/* =========================================================================
   14. WAREHOUSE PROFILE VIEW
   ========================================================================= */
export const WarehouseProfileView = ({ user, onLogout }) => {
  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Warehouse Director Profile & Credentials</h2>
          <p className="subview-subtitle">Staff ID: WH-DIR-084 • Security Level: Tier-3 Hazmat Certified</p>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          Sign Out
        </button>
      </div>

      <div className="content-card">
        <div className="profile-header-strip">
          <div className="profile-large-avatar" style={{ background: 'linear-gradient(135deg, #3478F6, #14213D)' }}>
            EC
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#14213D' }}>{user?.fullName || 'Ethan Cole'}</h3>
            <p style={{ fontSize: 13.5, color: '#718096' }}>Regional Director of Warehouse Operations • Chicago Hub WH-01</p>
          </div>
        </div>

        <div className="pickup-details-list" style={{ marginTop: 20 }}>
          <div className="detail-row"><span className="detail-key">Corporate Email:</span><span className="detail-val">{user?.email || 'ethan.cole@fleet360.ttc.com'}</span></div>
          <div className="detail-row"><span className="detail-key">Phone Hotline:</span><span className="detail-val">+1 (312) 555-0192 (Direct Extension 402)</span></div>
          <div className="detail-row"><span className="detail-key">Assigned Facility:</span><span className="detail-val highlight">Chicago Central Logistics Hub (WH-CENTRAL-01)</span></div>
          <div className="detail-row"><span className="detail-key">WMS Role Authorization:</span><span className="detail-val" style={{ color: '#16A36A', fontWeight: 700 }}>Full Administrator (Receiving, Dispatch, Quarantine, Reports)</span></div>
          <div className="detail-row"><span className="detail-key">Forklift & Safety License:</span><span className="detail-val">OSHA Certified / Class 1-5 Heavy Industrial</span></div>
        </div>
      </div>
    </div>
  );
};
