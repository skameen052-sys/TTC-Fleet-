// frontend/src/components/warehouse/WarehouseViews.jsx
import React, { useState, useEffect } from 'react';
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
  Plus,
  Lock,
  Key,
  Save,
  RefreshCw,
  Sliders,
  Send,
  CheckSquare
} from 'lucide-react';

/* =========================================================================
   1. WAREHOUSE MANAGEMENT VIEW (All Warehouses, Add, Edit)
   ========================================================================= */
export const WarehouseManagementView = ({
  warehouses = [],
  activeSubTab = 'all-warehouses',
  onSelectTab,
  onOpenAddWarehouse
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'all-warehouses');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || 'WH-CENTRAL-01');
  const [editFormData, setEditFormData] = useState({
    name: 'Chicago Central Logistics Hub',
    totalCapacityPallets: 12000,
    occupiedPallets: 9840,
    baysCount: 16,
    manager: 'Ethan Cole',
    status: 'Optimal'
  });
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const handleWarehouseSelect = (id) => {
    setSelectedWarehouseId(id);
    const w = warehouses.find(wh => wh.id === id);
    if (w) {
      setEditFormData({
        name: w.name,
        totalCapacityPallets: w.totalCapacityPallets,
        occupiedPallets: w.occupiedPallets,
        baysCount: w.baysCount,
        manager: w.manager,
        status: w.status
      });
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const filtered = warehouses.filter(w => {
    if (filterType !== 'all' && w.type !== filterType) return false;
    if (search && !w.name.toLowerCase().includes(search.toLowerCase()) && !w.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="driver-subview-container">
      {/* Subview Header with Sub-tabs */}
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Warehouse Facility Management</h2>
          <p className="subview-subtitle">Manage regional distribution hubs, storage capacity, and dock apron facilities</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'all-warehouses' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('all-warehouses')}
          >
            All Warehouses ({warehouses.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'add-warehouse' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('add-warehouse')}
          >
            + Add Warehouse
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'edit-warehouse' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('edit-warehouse')}
          >
            Edit Warehouse
          </button>
        </div>
      </div>

      {showSaveToast && (
        <div className="toast-banner" style={{ marginBottom: 14 }}>
          <CheckCircle2 size={18} color="#16A36A" />
          <span>Facility configuration successfully updated and broadcast to all WMS nodes.</span>
        </div>
      )}

      {/* Sub-tab 1: ALL WAREHOUSES */}
      {currentSubTab === 'all-warehouses' && (
        <>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18, marginTop: 16 }}>
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
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: 11.5 }}
                    onClick={() => {
                      handleWarehouseSelect(w.id);
                      handleSubTabChange('edit-warehouse');
                    }}
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sub-tab 2: ADD WAREHOUSE */}
      {currentSubTab === 'add-warehouse' && (
        <div className="content-card" style={{ maxWidth: 780, margin: '10px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#FFF0E5', padding: 8, borderRadius: 8 }}>
                <Warehouse size={22} color="#FF7A1A" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#14213D' }}>Register New Warehouse Facility</h3>
                <p style={{ fontSize: 12.5, color: '#718096' }}>Add a new regional distribution center or freight terminal to Fleet360 WMS</p>
              </div>
            </div>
            {onOpenAddWarehouse && (
              <button className="btn btn-primary" onClick={onOpenAddWarehouse}>
                <Plus size={16} /> Open Full Modal
              </button>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('New facility registered successfully!'); handleSubTabChange('all-warehouses'); }}>
            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Facility Name</label>
                <input className="form-input" placeholder="e.g. Phoenix Freight Gateway" required />
              </div>
              <div className="form-group">
                <label className="form-label">Facility Code</label>
                <input className="form-input" placeholder="e.g. WH-PHX-07" required />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Physical Address</label>
              <input className="form-input" placeholder="e.g. 2100 S 51st Ave, Phoenix, AZ" required />
            </div>

            <div className="form-grid-3col" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Total Storage (Sq Ft)</label>
                <input className="form-input" type="number" defaultValue="140000" />
              </div>
              <div className="form-group">
                <label className="form-label">Pallet Capacity</label>
                <input className="form-input" type="number" defaultValue="10000" />
              </div>
              <div className="form-group">
                <label className="form-label">Active Dock Bays</label>
                <input className="form-input" type="number" defaultValue="14" />
              </div>
            </div>

            <div className="form-grid-2col" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Facility Director / Manager</label>
                <input className="form-input" placeholder="e.g. Rachel Torres" required />
              </div>
              <div className="form-group">
                <label className="form-label">Operational Type</label>
                <select className="form-select">
                  <option>Distribution Hub</option>
                  <option>Freight Cross-Dock</option>
                  <option>Cold Storage Vault</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => handleSubTabChange('all-warehouses')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Initialize Facility
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab 3: EDIT WAREHOUSE */}
      {currentSubTab === 'edit-warehouse' && (
        <div className="content-card" style={{ maxWidth: 780, margin: '10px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ background: '#EBF3FF', padding: 8, borderRadius: 8 }}>
              <Sliders size={22} color="#3478F6" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#14213D' }}>Edit Facility Configuration</h3>
              <p style={{ fontSize: 12.5, color: '#718096' }}>Modify dock allocations, pallet ceilings, and on-site director contacts</p>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Select Warehouse Facility</label>
            <select
              className="form-select"
              value={selectedWarehouseId}
              onChange={(e) => handleWarehouseSelect(e.target.value)}
            >
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSaveEdit}>
            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Facility Display Name</label>
                <input
                  className="form-input"
                  value={editFormData.name}
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Facility Director</label>
                <input
                  className="form-input"
                  value={editFormData.manager}
                  onChange={e => setEditFormData({ ...editFormData, manager: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-3col" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Total Pallet Capacity</label>
                <input
                  className="form-input"
                  type="number"
                  value={editFormData.totalCapacityPallets}
                  onChange={e => setEditFormData({ ...editFormData, totalCapacityPallets: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Occupied Pallets</label>
                <input
                  className="form-input"
                  type="number"
                  value={editFormData.occupiedPallets}
                  onChange={e => setEditFormData({ ...editFormData, occupiedPallets: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Active Dock Bays</label>
                <input
                  className="form-input"
                  type="number"
                  value={editFormData.baysCount}
                  onChange={e => setEditFormData({ ...editFormData, baysCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Operational Status</label>
              <select
                className="form-select"
                value={editFormData.status}
                onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                <option value="Optimal">Optimal (Normal Dispatch)</option>
                <option value="High Utilization">High Utilization (&gt;85%)</option>
                <option value="Maintenance">Dock Apron Maintenance</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => handleSubTabChange('all-warehouses')}>
                Back to Facilities
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   2. INVENTORY MANAGEMENT VIEW (All Inventory, Add Items, Stock Details)
   ========================================================================= */
export const InventoryManagementView = ({
  inventory = [],
  activeSubTab = 'all-inventory',
  onSelectTab,
  onOpenAddInventory
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'all-inventory');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedSku, setSelectedSku] = useState(inventory[0]?.sku || 'SKU-8021');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const selectedItem = inventory.find(i => i.sku === selectedSku) || inventory[0];

  const filtered = inventory.filter(i => {
    if (category !== 'all' && i.category !== category) return false;
    if (search && !i.sku.toLowerCase().includes(search.toLowerCase()) && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="driver-subview-container">
      {/* Subview Header with Sub-tabs */}
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Inventory & SKU Master Catalog</h2>
          <p className="subview-subtitle">Live inventory stock levels, storage zone mapping, and automatic reorder thresholds</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'all-inventory' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('all-inventory')}
          >
            All Inventory ({inventory.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'add-items' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('add-items')}
          >
            + Add Items
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'stock-details' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('stock-details')}
          >
            Stock Details
          </button>
        </div>
      </div>

      {/* Sub-tab 1: ALL INVENTORY */}
      {currentSubTab === 'all-inventory' && (
        <>
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
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="form-select"
              style={{ width: 190 }}
            >
              <option value="all">All Categories ({inventory.length})</option>
              <option value="Automotive Parts">Automotive Parts</option>
              <option value="Electronics">Electronics</option>
              <option value="Industrial Tools">Industrial Tools</option>
              <option value="Packaging Materials">Packaging Materials</option>
              <option value="Lubricants & Fluids">Lubricants & Fluids</option>
            </select>
          </div>

          <div className="table-responsive content-card" style={{ marginTop: 16 }}>
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
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: 11.5 }}
                        onClick={() => {
                          setSelectedSku(item.sku);
                          handleSubTabChange('stock-details');
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Sub-tab 2: ADD ITEMS */}
      {currentSubTab === 'add-items' && (
        <div className="content-card" style={{ maxWidth: 760, margin: '10px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#EBF3FF', padding: 8, borderRadius: 8 }}>
                <Boxes size={22} color="#3478F6" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#14213D' }}>Add New Inventory SKU</h3>
                <p style={{ fontSize: 12.5, color: '#718096' }}>Register a newly cataloged SKU into primary and secondary storage racks</p>
              </div>
            </div>
            {onOpenAddInventory && (
              <button className="btn btn-primary" onClick={onOpenAddInventory}>
                <Plus size={16} /> Open Full Modal
              </button>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('New SKU cataloged successfully!'); handleSubTabChange('all-inventory'); }}>
            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">SKU Code</label>
                <input className="form-input" defaultValue={`SKU-${Date.now().toString().slice(-4)}`} required />
              </div>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" placeholder="e.g. Heavy Duty Brake Calipers" required />
              </div>
            </div>

            <div className="form-grid-2col" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select">
                  <option>Automotive Parts</option>
                  <option>Electronics</option>
                  <option>Industrial Tools</option>
                  <option>Packaging Materials</option>
                  <option>Lubricants & Fluids</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Storage Zone / Rack</label>
                <input className="form-input" placeholder="e.g. Zone A - Bay 04 - Shelf 2" required />
              </div>
            </div>

            <div className="form-grid-3col" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Initial Quantity</label>
                <input className="form-input" type="number" defaultValue="150" />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Replacement Cost ($)</label>
                <input className="form-input" type="number" step="0.01" defaultValue="85.50" />
              </div>
              <div className="form-group">
                <label className="form-label">Reorder Threshold Point</label>
                <input className="form-input" type="number" defaultValue="30" />
              </div>
            </div>

            <div className="form-grid-2col" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Primary Supplier</label>
                <input className="form-input" placeholder="e.g. Apex Industrial Dynamics" required />
              </div>
              <div className="form-group">
                <label className="form-label">Gross Unit Weight (kg)</label>
                <input className="form-input" type="number" step="0.1" defaultValue="14.2" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => handleSubTabChange('all-inventory')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Catalog SKU
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-tab 3: STOCK DETAILS */}
      {currentSubTab === 'stock-details' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Item Selector Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FFFFFF', padding: 14, borderRadius: 10, border: '1px solid #E5EAF2' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#14213D' }}>Inspect SKU Item:</span>
            <select
              className="form-select"
              value={selectedItem?.sku}
              onChange={e => setSelectedSku(e.target.value)}
              style={{ maxWidth: 380 }}
            >
              {inventory.map(i => (
                <option key={i.sku} value={i.sku}>{i.sku} — {i.name} ({i.available} available)</option>
              ))}
            </select>
            <span className={`status-pill ${selectedItem?.status === 'Available' ? 'status-available' : selectedItem?.status === 'Low Stock' ? 'status-waiting' : 'status-outofservice'}`} style={{ marginLeft: 'auto' }}>
              {selectedItem?.status}
            </span>
          </div>

          {/* Deep Stock Breakdown Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div className="content-card" style={{ borderLeft: '4px solid #3478F6' }}>
              <div style={{ fontSize: 12, color: '#718096', fontWeight: 600 }}>Total Quantity On Hand</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#14213D', marginTop: 4 }}>
                {selectedItem?.quantityOnHand?.toLocaleString()} <span style={{ fontSize: 14, color: '#718096' }}>Units</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#3478F6', marginTop: 4 }}>Physical dock & rack inventory</div>
            </div>

            <div className="content-card" style={{ borderLeft: '4px solid #16A36A' }}>
              <div style={{ fontSize: 12, color: '#718096', fontWeight: 600 }}>Available for Dispatch</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#16A36A', marginTop: 4 }}>
                {selectedItem?.available?.toLocaleString()} <span style={{ fontSize: 14, color: '#718096' }}>Units</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#16A36A', marginTop: 4 }}>Free unallocated stock</div>
            </div>

            <div className="content-card" style={{ borderLeft: '4px solid #D97706' }}>
              <div style={{ fontSize: 12, color: '#718096', fontWeight: 600 }}>Reserved Consignments</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#D97706', marginTop: 4 }}>
                {selectedItem?.reserved?.toLocaleString()} <span style={{ fontSize: 14, color: '#718096' }}>Units</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#D97706', marginTop: 4 }}>Allocated to outbound trucks</div>
            </div>

            <div className="content-card" style={{ borderLeft: '4px solid #7955E8' }}>
              <div style={{ fontSize: 12, color: '#718096', fontWeight: 600 }}>Total Valuation</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#7955E8', marginTop: 4 }}>
                ${(Number(selectedItem?.unitCost || 0) * Number(selectedItem?.quantityOnHand || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 11.5, color: '#7955E8', marginTop: 4 }}>At ${Number(selectedItem?.unitCost).toFixed(2)}/unit</div>
            </div>
          </div>

          {/* Technical Specs & Location Mapping */}
          <div className="content-card">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
              SKU Location & Replenishment Parameters
            </h3>
            <div className="pickup-details-list">
              <div className="detail-row"><span className="detail-key">Product Classification:</span><span className="detail-val">{selectedItem?.category}</span></div>
              <div className="detail-row"><span className="detail-key">Warehouse Location:</span><span className="detail-val highlight">{selectedItem?.warehouseId} — {selectedItem?.zone}</span></div>
              <div className="detail-row"><span className="detail-key">Primary Supplier:</span><span className="detail-val">{selectedItem?.supplier}</span></div>
              <div className="detail-row"><span className="detail-key">Automatic Reorder Trigger:</span><span className="detail-val" style={{ color: '#EF5350', fontWeight: 700 }}>At or below {selectedItem?.reorderPoint} Units</span></div>
              <div className="detail-row"><span className="detail-key">Unit Shipping Weight:</span><span className="detail-val">{selectedItem?.weightKg} kg / unit</span></div>
              <div className="detail-row"><span className="detail-key">Last Replenishment Cycle:</span><span className="detail-val">{selectedItem?.lastRestocked || 'Nov 18, 2026, 04:30 PM'}</span></div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={() => handleSubTabChange('all-inventory')}>
                Back to Master Catalog
              </button>
              <button className="btn btn-secondary" onClick={() => alert(`Printing RFID and Barcode shelf tag for ${selectedItem?.sku}...`)}>
                Print Shelf Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. GOODS RECEIVING VIEW (Incoming Goods, Receiving Confirmation)
   ========================================================================= */
export const GoodsReceivingView = ({
  incomingGoods = [],
  activeSubTab = 'incoming-goods',
  onSelectTab,
  onConfirmReceiving
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'incoming-goods');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const pendingConfirmation = incomingGoods.filter(s => s.status !== 'Received & Stored');

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Goods Receiving & Inbound Cross-Dock</h2>
          <p className="subview-subtitle">Inbound carrier check-in, Bill of Lading verification, and quarantine triage</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'incoming-goods' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('incoming-goods')}
          >
            Incoming Goods ({incomingGoods.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'receiving-confirmation' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('receiving-confirmation')}
          >
            Receiving Confirmation ({pendingConfirmation.length})
          </button>
        </div>
      </div>

      {currentSubTab === 'incoming-goods' ? (
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
      ) : (
        /* Sub-tab 2: RECEIVING CONFIRMATION CHECKLIST */
        <div className="content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <CheckSquare size={20} color="#16A36A" />
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#14213D' }}>Carrier Physical Inspection & Sign-Off</h3>
          </div>
          <p style={{ fontSize: 13, color: '#718096', marginBottom: 18 }}>
            Perform tamper seal verification, gross weight scale matching, and pallet recount before signing off receipt.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {pendingConfirmation.map(s => (
              <div key={s.id} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, background: '#F8FAFD' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#14213D' }}>{s.shipmentId} • {s.supplier}</span>
                    <div style={{ fontSize: 12, color: '#718096' }}>Carrier: {s.carrier} | Driver: {s.driverName} | Dock: {s.destinationBay}</div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      onConfirmReceiving(s.id);
                      alert(`Verified BOL ${s.billOfLading}. Pallets moved to putaway staging.`);
                    }}
                  >
                    Confirm Putaway Sign-Off
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#475569' }}>
                  <span>✓ Pallets: <b>{s.palletCount} Units</b></span>
                  <span>✓ Gross: <b>{s.grossWeightKg?.toLocaleString()} kg</b></span>
                  <span>✓ Tamper Seal: <b>Intact</b></span>
                  <span>✓ Hazmat Status: <b>Standard Dry Freight</b></span>
                </div>
              </div>
            ))}
            {pendingConfirmation.length === 0 && (
              <div style={{ textAlign: 'center', padding: 30, color: '#16A36A', fontWeight: 700 }}>
                ✓ All arriving inbound shipments have been verified and processed into storage bays!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   4. GOODS DISPATCH VIEW (Outgoing Goods, Dispatch Records)
   ========================================================================= */
export const GoodsDispatchView = ({
  outgoingGoods = [],
  activeSubTab = 'outgoing-goods',
  onSelectTab,
  onConfirmDispatch,
  onOpenCreateDispatch
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'outgoing-goods');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const dispatchedHistory = outgoingGoods.filter(d => d.dispatchStatus === 'Dispatched (En Route)');

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Goods Dispatch & Outbound Staging</h2>
          <p className="subview-subtitle">Consignment staging, tamper-evident seal auditing, and driver dispatch release</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'outgoing-goods' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('outgoing-goods')}
          >
            Outgoing Goods ({outgoingGoods.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'dispatch-records' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('dispatch-records')}
          >
            Dispatch Records ({dispatchedHistory.length})
          </button>
          <button className="btn btn-primary" style={{ marginLeft: 8 }} onClick={onOpenCreateDispatch}>
            <Plus size={16} /> Create Dispatch
          </button>
        </div>
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
            {(currentSubTab === 'dispatch-records' ? dispatchedHistory : outgoingGoods).map(d => (
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
export const StockInView = ({
  inventory = [],
  stockMovement = [],
  activeSubTab = 'add-stock',
  onSelectTab,
  onOpenStockIn
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'add-stock');
  const stockInHistory = stockMovement.filter(m => m.type === 'Stock In');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Stock In Operations & Inbound Ledger</h2>
          <p className="subview-subtitle">Record warehouse stock increments, supplier receipts, and pallet replenishment</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'add-stock' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('add-stock')}
          >
            + Add Stock
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'receiving-history' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('receiving-history')}
          >
            Receiving History ({stockInHistory.length})
          </button>
          <button className="btn btn-primary" style={{ marginLeft: 8 }} onClick={onOpenStockIn}>
            <PackagePlus size={16} /> Record Stock In
          </button>
        </div>
      </div>

      {currentSubTab === 'add-stock' ? (
        <div className="content-card" style={{ maxWidth: 740, margin: '10px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ background: '#E8F8F0', padding: 8, borderRadius: 8 }}>
              <PackagePlus size={22} color="#16A36A" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#14213D' }}>Direct Stock Replenishment</h3>
              <p style={{ fontSize: 12.5, color: '#718096' }}>Scan or select SKU to increment physical pallet balance</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Stock incremented successfully!'); handleSubTabChange('receiving-history'); }}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Select SKU Item</label>
              <select className="form-select">
                {inventory.map(i => (
                  <option key={i.sku} value={i.sku}>{i.sku} — {i.name} (Current: {i.quantityOnHand})</option>
                ))}
              </select>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Units Received</label>
                <input className="form-input" type="number" defaultValue="50" min="1" required />
              </div>
              <div className="form-group">
                <label className="form-label">Destination Rack / Bay</label>
                <input className="form-input" defaultValue="Zone A - Bay 04 - Shelf 1" required />
              </div>
            </div>

            <div className="form-grid-2col" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Receiving Source</label>
                <input className="form-input" defaultValue="Supplier Inbound Trailer #TR-994" required />
              </div>
              <div className="form-group">
                <label className="form-label">BOL Reference Number</label>
                <input className="form-input" defaultValue="BOL-2026-9024" required />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button type="submit" className="btn btn-primary">
                Confirm & Post Inbound Entry
              </button>
            </div>
          </form>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export const StockOutView = ({
  inventory = [],
  stockMovement = [],
  activeSubTab = 'remove-stock',
  onSelectTab,
  onOpenStockOut
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'remove-stock');
  const stockOutHistory = stockMovement.filter(m => m.type === 'Stock Out');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Stock Out Operations & Dispatch Ledger</h2>
          <p className="subview-subtitle">Record warehouse stock deductions, dispatch staging, and pallet withdrawals</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'remove-stock' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('remove-stock')}
          >
            - Remove Stock
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'stock-out-history' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('stock-out-history')}
          >
            Stock Out History ({stockOutHistory.length})
          </button>
          <button className="btn btn-primary" style={{ marginLeft: 8 }} onClick={onOpenStockOut}>
            <PackageMinus size={16} /> Record Stock Out
          </button>
        </div>
      </div>

      {currentSubTab === 'remove-stock' ? (
        <div className="content-card" style={{ maxWidth: 740, margin: '10px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ background: '#FFF0E5', padding: 8, borderRadius: 8 }}>
              <PackageMinus size={22} color="#FF7A1A" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#14213D' }}>Stock Withdrawal & Outbound Deduction</h3>
              <p style={{ fontSize: 12.5, color: '#718096' }}>Authorize inventory deduction for shipment orders or transfers</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Stock deducted successfully!'); handleSubTabChange('stock-out-history'); }}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Select SKU Item</label>
              <select className="form-select">
                {inventory.map(i => (
                  <option key={i.sku} value={i.sku}>{i.sku} — {i.name} (Available: {i.available})</option>
                ))}
              </select>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Units to Withdraw</label>
                <input className="form-input" type="number" defaultValue="25" min="1" required />
              </div>
              <div className="form-group">
                <label className="form-label">Deduction Reason</label>
                <select className="form-select">
                  <option>Customer Dispatch Order</option>
                  <option>Inter-Warehouse Transfer</option>
                  <option>Quarantine / Scrapped</option>
                  <option>Cycle Count Adjustment</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2col" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Outbound Staging Bay</label>
                <input className="form-input" defaultValue="Outbound Bay 03" required />
              </div>
              <div className="form-group">
                <label className="form-label">Order Reference / Waybill</label>
                <input className="form-input" defaultValue="ORD-2026-8841" required />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button type="submit" className="btn btn-primary" style={{ background: '#FF7A1A', borderColor: '#FF7A1A' }}>
                Confirm & Post Stock Out Entry
              </button>
            </div>
          </form>
        </div>
      ) : (
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
                  <td style={{ color: '#EF5350', fontWeight: 800 }}>-{m.quantity} Units</td>
                  <td>{m.fromLocation}</td>
                  <td><span style={{ fontWeight: 700, color: '#FF7A1A' }}>{m.toLocation}</span></td>
                  <td>{m.operator}</td>
                  <td><span style={{ fontSize: 11.5, color: '#718096' }}>{m.reference}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   7. SHIPMENT MANAGEMENT VIEW (Incoming & Outgoing tabs)
   ========================================================================= */
export const ShipmentManagementView = ({
  incomingGoods = [],
  outgoingGoods = [],
  activeSubTab = 'incoming-shipments',
  onSelectTab
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'incoming-shipments');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Shipment Management</h2>
          <p className="subview-subtitle">Comprehensive tracking for all inbound freight receipts and outbound dispatches</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'incoming-shipments' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('incoming-shipments')}
          >
            Inbound Shipments ({incomingGoods.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'outgoing-shipments' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('outgoing-shipments')}
          >
            Outbound Shipments ({outgoingGoods.length})
          </button>
        </div>
      </div>

      <div className="table-responsive content-card">
        <table className="enterprise-table">
          {currentSubTab === 'incoming-shipments' ? (
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
export const LoadingManagementView = ({
  loadingSchedule = [],
  activeSubTab = 'loading-schedule',
  onSelectTab
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'loading-schedule');
  const loadingOnly = loadingSchedule.filter(b => b.type === 'Loading');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Outbound Loading Dock Apron</h2>
          <p className="subview-subtitle">Commercial carrier bay queues, pallet loading verification, and forklift operators</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'loading-schedule' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('loading-schedule')}
          >
            Loading Schedule ({loadingOnly.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'loading-confirmation' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('loading-confirmation')}
          >
            Loading Confirmation
          </button>
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
              {currentSubTab === 'loading-confirmation' && <th>Action</th>}
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
                {currentSubTab === 'loading-confirmation' && (
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 11.5 }}
                      onClick={() => alert(`Sign-off confirmed for ${b.bay} carrier ${b.carrier}. Loaded safely.`)}
                    >
                      Sign Off
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const UnloadingManagementView = ({
  loadingSchedule = [],
  activeSubTab = 'unloading-schedule',
  onSelectTab
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'unloading-schedule');
  const unloadingOnly = loadingSchedule.filter(b => b.type === 'Unloading');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Inbound Unloading Dock Apron</h2>
          <p className="subview-subtitle">Inbound truck receiving bays, pallet de-consolidation, and QA check-in</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'unloading-schedule' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('unloading-schedule')}
          >
            Unloading Schedule ({unloadingOnly.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'unloading-confirmation' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('unloading-confirmation')}
          >
            Unloading Confirmation
          </button>
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
              {currentSubTab === 'unloading-confirmation' && <th>Action</th>}
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
                {currentSubTab === 'unloading-confirmation' && (
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 11.5 }}
                      onClick={() => alert(`Unloading QA passed for ${b.bay}. Inventory ready for putaway scan.`)}
                    >
                      Verify Pallets
                    </button>
                  </td>
                )}
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
   11. DAMAGED GOODS VIEW (Damaged Stock, Damage Reports)
   ========================================================================= */
export const DamagedGoodsView = ({
  damagedGoods = [],
  activeSubTab = 'damaged-stock',
  onSelectTab,
  onOpenReportDamaged
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'damaged-stock');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Damaged Goods & Hazmat Quarantine</h2>
          <p className="subview-subtitle">Inspection defect containment, RMA supplier return claims, and incident audits</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'damaged-stock' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('damaged-stock')}
          >
            Damaged Stock ({damagedGoods.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'damage-reports' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('damage-reports')}
          >
            Damage Reports
          </button>
          <button className="btn" style={{ background: '#EF5350', color: '#FFFFFF', padding: '8px 14px', borderRadius: 8, fontWeight: 700, marginLeft: 8 }} onClick={onOpenReportDamaged}>
            <AlertTriangle size={16} /> Report Issue
          </button>
        </div>
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
   12. INVENTORY REPORTS VIEW (Stock Reports, Movement Reports)
   ========================================================================= */
export const InventoryReportsView = ({
  inventory = [],
  warehouses = [],
  activeSubTab = 'stock-reports',
  onSelectTab
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'stock-reports');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Inventory Valuation & Movement Reports</h2>
          <p className="subview-subtitle">Weekly stock velocity, turn-rate metrics, and warehouse space occupancy statements</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'stock-reports' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('stock-reports')}
          >
            Stock Valuation Reports
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'movement-reports' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('movement-reports')}
          >
            Movement & Velocity Reports
          </button>
          <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => alert('Exporting comprehensive WMS audit ledger to CSV / PDF...')}>
            <Download size={16} /> Export (PDF/CSV)
          </button>
        </div>
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
   13. WAREHOUSE NOTIFICATIONS VIEW (All, Low Stock, Pending Dispatch)
   ========================================================================= */
export const WarehouseNotificationsView = ({
  alerts = [],
  activeSubTab = 'all',
  onSelectTab
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'all');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const filteredAlerts = alerts.filter(a => {
    if (currentSubTab === 'low-stock-alerts') return a.title?.toLowerCase().includes('stock') || a.message?.toLowerCase().includes('stock');
    if (currentSubTab === 'pending-dispatch-alerts') return a.title?.toLowerCase().includes('dispatch') || a.message?.toLowerCase().includes('dispatch') || a.title?.toLowerCase().includes('bay');
    return true;
  });

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Warehouse Operational Alerts & Bulletins</h2>
          <p className="subview-subtitle">Live bulletin board for low stock thresholds, bay congestion, and dispatch schedules</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'all' || currentSubTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('all')}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'low-stock-alerts' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('low-stock-alerts')}
          >
            Low Stock Alerts
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'pending-dispatch-alerts' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('pending-dispatch-alerts')}
          >
            Pending Dispatch Alerts
          </button>
        </div>
      </div>

      <div className="driver-notifications-list content-card">
        {filteredAlerts.map(a => (
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
   14. WAREHOUSE PROFILE VIEW (Profile, Change Password)
   ========================================================================= */
export const WarehouseProfileView = ({
  user,
  activeSubTab = 'personal-profile',
  onSelectTab,
  onLogout
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'personal-profile');
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordToast, setPasswordToast] = useState(false);

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert('Error: New password and confirm password do not match.');
      return;
    }
    setPasswordToast(true);
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPasswordToast(false), 3500);
  };

  return (
    <div className="driver-subview-container">
      <div className="subview-header">
        <div>
          <h2 className="subview-title">Warehouse Director Profile & Security</h2>
          <p className="subview-subtitle">Staff ID: WH-DIR-084 • Security Level: Tier-3 Hazmat Certified</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentSubTab === 'personal-profile' || currentSubTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('personal-profile')}
          >
            Profile Overview
          </button>
          <button
            className={`filter-tab ${currentSubTab === 'change-password' ? 'active' : ''}`}
            onClick={() => handleSubTabChange('change-password')}
          >
            Change Password
          </button>
          <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {passwordToast && (
        <div className="toast-banner" style={{ marginBottom: 14 }}>
          <CheckCircle2 size={18} color="#16A36A" />
          <span>Password successfully updated. Security credentials refreshed across all sessions.</span>
        </div>
      )}

      {currentSubTab === 'change-password' ? (
        <div className="content-card" style={{ maxWidth: 640, margin: '10px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 20 }}>
            <div style={{ background: '#FFF0E5', padding: 8, borderRadius: 8 }}>
              <Key size={22} color="#FF7A1A" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#14213D' }}>Change Account Password</h3>
              <p style={{ fontSize: 12.5, color: '#718096' }}>Ensure your password is at least 8 characters with numbers and special symbols</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your current password"
                value={passwordForm.current}
                onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your new secure password"
                value={passwordForm.newPass}
                onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                required
                minLength={8}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm your new secure password"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                required
                minLength={8}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSubTabChange('personal-profile')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      ) : (
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
      )}
    </div>
  );
};
