// frontend/src/components/warehouse/WarehouseModals.jsx
import React, { useState } from 'react';
import {
  X,
  Boxes,
  PackagePlus,
  PackageMinus,
  Truck,
  Forklift,
  ArrowLeftRight,
  AlertTriangle,
  Warehouse,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Tag,
  DollarSign
} from 'lucide-react';

export const WarehouseModals = {
  // 1. Add Inventory Modal
  AddInventoryModal: ({ isOpen, onClose, onSubmit, warehouses = [] }) => {
    const [sku, setSku] = useState(`SKU-${Date.now().toString().slice(-4)}`);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Automotive Parts');
    const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'WH-CENTRAL-01');
    const [zone, setZone] = useState('Zone A - Bay 04');
    const [quantityOnHand, setQuantityOnHand] = useState('100');
    const [unitCost, setUnitCost] = useState('75.00');
    const [reorderPoint, setReorderPoint] = useState('30');
    const [supplier, setSupplier] = useState('');
    const [weightKg, setWeightKg] = useState('12.5');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        sku,
        name,
        category,
        warehouseId,
        zone,
        quantityOnHand: Number(quantityOnHand),
        unitCost: Number(unitCost),
        reorderPoint: Number(reorderPoint),
        supplier,
        weightKg: Number(weightKg)
      });
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">
              <Boxes size={18} color="#FF7A1A" /> Add New Inventory Item (SKU)
            </h4>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">SKU Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Automotive Parts">Automotive Parts</option>
                    <option value="Industrial Machinery">Industrial Machinery</option>
                    <option value="Electrical Components">Electrical Components</option>
                    <option value="Packaging Materials">Packaging Materials</option>
                    <option value="Chemicals & Lubricants">Chemicals & Lubricants</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Name / Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Heavy Duty Alternator 24V"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Warehouse Facility</label>
                  <select
                    className="form-select"
                    value={warehouseId}
                    onChange={e => setWarehouseId(e.target.value)}
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.id})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Storage Zone / Rack</label>
                  <input
                    type="text"
                    className="form-input"
                    value={zone}
                    onChange={e => setZone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3col">
                <div className="form-group">
                  <label className="form-label">Initial Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={quantityOnHand}
                    onChange={e => setQuantityOnHand(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={unitCost}
                    onChange={e => setUnitCost(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reorder Alert Point</label>
                  <input
                    type="number"
                    className="form-input"
                    value={reorderPoint}
                    onChange={e => setReorderPoint(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Primary Supplier</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Supplier or manufacturer"
                    value={supplier}
                    onChange={e => setSupplier(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Weight (Kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={weightKg}
                    onChange={e => setWeightKg(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Boxes size={16} /> Register Inventory SKU
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },

  // 2. Record Stock In Modal
  StockInModal: ({ isOpen, onClose, onSubmit, inventory = [] }) => {
    const [sku, setSku] = useState(inventory[0]?.sku || '');
    const [quantity, setQuantity] = useState('50');
    const [location, setLocation] = useState('Zone B - Rack 04');
    const [supplier, setSupplier] = useState('OEM Direct Delivery');
    const [reference, setReference] = useState(`BOL-IN-${Date.now().toString().slice(-4)}`);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ sku, quantity: Number(quantity), location, supplier, reference });
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">
              <PackagePlus size={18} color="#16A36A" /> Record Stock In (Receiving Entry)
            </h4>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select SKU / Product</label>
                <select
                  className="form-select"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  required
                >
                  {inventory.map(i => (
                    <option key={i.sku} value={i.sku}>{i.sku} - {i.name} (Current: {i.quantityOnHand})</option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Quantity to Add</label>
                  <input
                    type="number"
                    className="form-input"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Destination Rack / Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Supplier / Shipper Source</label>
                  <input
                    type="text"
                    className="form-input"
                    value={supplier}
                    onChange={e => setSupplier(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">BOL / Po Reference</label>
                  <input
                    type="text"
                    className="form-input"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: '#16A36A' }}>
                <CheckCircle2 size={16} /> Confirm Stock In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },

  // 3. Record Stock Out Modal
  StockOutModal: ({ isOpen, onClose, onSubmit, inventory = [] }) => {
    const [sku, setSku] = useState(inventory[0]?.sku || '');
    const [quantity, setQuantity] = useState('20');
    const [destination, setDestination] = useState('Outbound Dock Bay 08 (Order ORD-4101)');
    const [reason, setReason] = useState('Production Dispatch');
    const [reference, setReference] = useState(`DISP-${Date.now().toString().slice(-4)}`);

    if (!isOpen) return null;

    const selectedItem = inventory.find(i => i.sku === sku);

    const handleSubmit = (e) => {
      e.preventDefault();
      try {
        onSubmit({ sku, quantity: Number(quantity), destination, reason, reference });
        onClose();
      } catch (err) {
        alert(err.message);
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">
              <PackageMinus size={18} color="#FF7A1A" /> Record Stock Out (Dispatch Entry)
            </h4>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select SKU / Product</label>
                <select
                  className="form-select"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  required
                >
                  {inventory.map(i => (
                    <option key={i.sku} value={i.sku}>{i.sku} - {i.name} (Available: {i.available})</option>
                  ))}
                </select>
                {selectedItem && (
                  <span style={{ fontSize: '11.5px', color: '#718096', marginTop: 4, display: 'block' }}>
                    Available: <b style={{ color: '#16A36A' }}>{selectedItem.available}</b> | Reserved: {selectedItem.reserved} | On Hand: {selectedItem.quantityOnHand}
                  </span>
                )}
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Quantity to Remove</label>
                  <input
                    type="number"
                    className="form-input"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    min="1"
                    max={selectedItem?.available || 9999}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dispatch Reason</label>
                  <select
                    className="form-select"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  >
                    <option value="Production Dispatch">Production Dispatch</option>
                    <option value="Customer Shipment">Customer Shipment</option>
                    <option value="Inter-Warehouse Transfer">Inter-Warehouse Transfer</option>
                    <option value="Scrap / Quality Defect">Scrap / Quality Defect</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Destination Bay / Work Order</label>
                <input
                  type="text"
                  className="form-input"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dispatch Reference Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <PackageMinus size={16} /> Authorize Stock Out
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },

  // 4. Receive Shipment Modal
  ReceiveShipmentModal: ({ isOpen, onClose, onConfirm, incomingGoods = [] }) => {
    const [selectedShipmentId, setSelectedShipmentId] = useState(
      incomingGoods.find(s => s.status !== 'Received & Stored')?.id || incomingGoods[0]?.id || ''
    );
    const [inspectionNotes, setInspectionNotes] = useState('Pallets verified against BOL. Zero transit defects detected.');

    if (!isOpen) return null;

    const selected = incomingGoods.find(s => s.id === selectedShipmentId);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (selectedShipmentId) {
        onConfirm(selectedShipmentId);
        onClose();
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">
              <Truck size={18} color="#3478F6" /> Goods Receiving Confirmation
            </h4>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select Incoming Shipment</label>
                <select
                  className="form-select"
                  value={selectedShipmentId}
                  onChange={e => setSelectedShipmentId(e.target.value)}
                  required
                >
                  {incomingGoods.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.shipmentId} - {s.supplier} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              {selected && (
                <div style={{ background: '#F8FAFD', border: '1px solid #E5EAF2', borderRadius: 8, padding: 12, fontSize: 13 }}>
                  <div><b>Supplier:</b> {selected.supplier}</div>
                  <div><b>Carrier:</b> {selected.carrier} ({selected.driverName})</div>
                  <div><b>Pallet Count:</b> {selected.palletCount} Pallets ({selected.grossWeightKg} kg)</div>
                  <div><b>Designated Bay:</b> {selected.destinationBay}</div>
                  <div><b>BOL:</b> {selected.billOfLading}</div>
                </div>
              )}

              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Quality Assurance / Dock Notes</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={inspectionNotes}
                  onChange={e => setInspectionNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: '#16A36A' }}>
                <CheckCircle2 size={16} /> Confirm Goods Received & Stored
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },

  // 5. Create Dispatch Modal
  CreateDispatchModal: ({ isOpen, onClose, onSubmit }) => {
    const [destination, setDestination] = useState('Detroit Automotive Depot (WH-MIDWEST-03)');
    const [carrier, setCarrier] = useState('TTC Fleet Logistics (TTC-8492-HD)');
    const [assignedDriver, setAssignedDriver] = useState('Marcus Vance (D-01)');
    const [palletCount, setPalletCount] = useState('16');
    const [weightKg, setWeightKg] = useState('12400');
    const [stagingBay, setStagingBay] = useState('Staging Area A-2');
    const [dockBay, setDockBay] = useState('Dock Bay 08');
    const [priority, setPriority] = useState('High');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        destination,
        carrier,
        assignedDriver,
        palletCount: Number(palletCount),
        weightKg: Number(weightKg),
        stagingBay,
        dockBay,
        priority
      });
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">
              <Truck size={18} color="#FF7A1A" /> Create Outgoing Dispatch Order
            </h4>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Destination Facility / Customer</label>
                <input
                  type="text"
                  className="form-input"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Carrier & Vehicle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={carrier}
                    onChange={e => setCarrier(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assigned Driver</label>
                  <input
                    type="text"
                    className="form-input"
                    value={assignedDriver}
                    onChange={e => setAssignedDriver(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3col">
                <div className="form-group">
                  <label className="form-label">Pallets</label>
                  <input
                    type="number"
                    className="form-input"
                    value={palletCount}
                    onChange={e => setPalletCount(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (Kg)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={weightKg}
                    onChange={e => setWeightKg(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="Standard">Standard</option>
                    <option value="High">High</option>
                    <option value="Critical / Expedited">Critical / Expedited</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Staging Area</label>
                  <input
                    type="text"
                    className="form-input"
                    value={stagingBay}
                    onChange={e => setStagingBay(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Outbound Dock Bay</label>
                  <input
                    type="text"
                    className="form-input"
                    value={dockBay}
                    onChange={e => setDockBay(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Truck size={16} /> Schedule Dispatch & Print Manifest
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },

  // 6. Transfer Stock Modal
  TransferStockModal: ({ isOpen, onClose, onSubmit, warehouses = [], inventory = [] }) => {
    const [originWarehouse, setOriginWarehouse] = useState(warehouses[0]?.name || 'WH-CENTRAL-01');
    const [destWarehouse, setDestWarehouse] = useState(warehouses[1]?.name || 'WH-EAST-02');
    const [sku, setSku] = useState(inventory[0]?.sku || '');
    const [quantity, setQuantity] = useState('40');
    const [carrier, setCarrier] = useState('TTC Regional Line (TTC-5521)');

    if (!isOpen) return null;

    const selectedItem = inventory.find(i => i.sku === sku);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        originWarehouse,
        destWarehouse,
        sku,
        itemName: selectedItem ? selectedItem.name : sku,
        quantity: Number(quantity),
        carrier
      });
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">
              <ArrowLeftRight size={18} color="#7955E8" /> Inter-Warehouse Stock Transfer
            </h4>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Origin Facility</label>
                  <select
                    className="form-select"
                    value={originWarehouse}
                    onChange={e => setOriginWarehouse(e.target.value)}
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Destination Facility</label>
                  <select
                    className="form-select"
                    value={destWarehouse}
                    onChange={e => setDestWarehouse(e.target.value)}
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Select SKU to Transfer</label>
                <select
                  className="form-select"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  required
                >
                  {inventory.map(i => (
                    <option key={i.sku} value={i.sku}>{i.sku} - {i.name} (Avail: {i.available})</option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Transfer Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assigned Carrier</label>
                  <input
                    type="text"
                    className="form-input"
                    value={carrier}
                    onChange={e => setCarrier(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: '#7955E8' }}>
                <ArrowLeftRight size={16} /> Authorize Inter-Warehouse Transfer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },

  // 7. Report Damaged Goods Modal
  ReportDamagedModal: ({ isOpen, onClose, onSubmit, inventory = [] }) => {
    const [sku, setSku] = useState(inventory[0]?.sku || '');
    const [quantity, setQuantity] = useState('1');
    const [location, setLocation] = useState('Quarantine Cage Q-01');
    const [reason, setReason] = useState('Forklift handling accident during pallet drop');
    const [costImpact, setCostImpact] = useState('350.00');

    if (!isOpen) return null;

    const selectedItem = inventory.find(i => i.sku === sku);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        sku,
        name: selectedItem?.name || sku,
        quantity: Number(quantity),
        location,
        reason,
        costImpact: Number(costImpact)
      });
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title" style={{ color: '#EF5350' }}>
              <AlertTriangle size={18} color="#EF5350" /> Log Damaged Goods Quarantine
            </h4>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Damaged SKU</label>
                <select
                  className="form-select"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  required
                >
                  {inventory.map(i => (
                    <option key={i.sku} value={i.sku}>{i.sku} - {i.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Damaged Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quarantine Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Damage Description & Root Cause</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Loss Impact ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={costImpact}
                  onChange={e => setCostImpact(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn" style={{ background: '#EF5350', color: '#FFFFFF' }}>
                <AlertTriangle size={16} /> Quarantine Damaged Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },

  // 8. Add Warehouse Facility Modal
  AddWarehouseModal: ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [location, setLocation] = useState('');
    const [manager, setManager] = useState('');
    const [totalCapacitySqFt, setTotalCapacitySqFt] = useState('100000');
    const [totalCapacityPallets, setTotalCapacityPallets] = useState('8000');
    const [baysCount, setBaysCount] = useState('10');
    const [type, setType] = useState('Distribution Hub');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        name,
        code,
        location,
        manager,
        totalCapacitySqFt: Number(totalCapacitySqFt),
        totalCapacityPallets: Number(totalCapacityPallets),
        baysCount: Number(baysCount),
        type
      });
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h4 className="modal-title">
              <Warehouse size={18} color="#FF7A1A" /> Add Warehouse Facility
            </h4>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Facility Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dallas Distribution Center"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Facility Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. DFW-01"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address & City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Street, City, State ZIP"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Facility Manager</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Manager Name"
                    value={manager}
                    onChange={e => setManager(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Facility Type</label>
                  <select
                    className="form-select"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="Distribution Hub">Distribution Hub</option>
                    <option value="Freight Cross-Dock">Freight Cross-Dock</option>
                    <option value="Automotive Parts Depot">Automotive Parts Depot</option>
                    <option value="Cold Chain / Pharma">Cold Chain / Pharma</option>
                    <option value="Regional Staging">Regional Staging</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-3col">
                <div className="form-group">
                  <label className="form-label">Total Sq Ft</label>
                  <input
                    type="number"
                    className="form-input"
                    value={totalCapacitySqFt}
                    onChange={e => setTotalCapacitySqFt(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pallet Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={totalCapacityPallets}
                    onChange={e => setTotalCapacityPallets(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dock Bays</label>
                  <input
                    type="number"
                    className="form-input"
                    value={baysCount}
                    onChange={e => setBaysCount(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Warehouse size={16} /> Register Warehouse
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
