import React, { useState, useEffect } from 'react';
import { Warehouse as WarehouseIcon, Plus, RefreshCw, Box, ArrowDownLeft, ArrowUpRight, MapPin } from 'lucide-react';
import { warehouseService } from '../services/warehouseService';
import { Modal } from '../components/Modal';

export const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('warehouses'); // 'warehouses' | 'inventory' | 'movements'

  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState({
    warehouseCode: 'WH-HYD-01',
    itemCode: '',
    itemName: '',
    category: 'GENERAL_CARGO',
    quantity: 100,
    unit: 'UNITS',
    minThreshold: 20,
    unitPrice: 1200,
    locationAisle: 'Bay-A-01',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [wRes, iRes, mRes] = await Promise.all([
        warehouseService.getWarehouses(),
        warehouseService.getInventory(),
        warehouseService.getMovements(),
      ]);
      if (wRes?.data) setWarehouses(wRes.data);
      if (iRes?.data) setInventory(iRes.data);
      if (mRes?.data) setMovements(mRes.data);
    } catch (err) {
      console.error('Failed to load warehouse data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      if (!itemForm.itemCode) {
        itemForm.itemCode = 'ITM-' + Math.floor(100 + Math.random() * 900);
      }
      await warehouseService.createInventoryItem(itemForm);
      setShowItemModal(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error adding inventory item');
    }
  };

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Warehouse & Inventory Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Regional distribution depots, square footage capacities, pallet inventory, and inward/outward logs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchData} title="Refresh">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary" onClick={() => setShowItemModal(true)}>
            <Plus size={16} />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('warehouses')}
          style={{
            background: activeTab === 'warehouses' ? '#f97316' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'warehouses' ? '#fff' : '#cbd5e1',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 16px',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Warehouses & Depots ({warehouses.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            background: activeTab === 'inventory' ? '#f97316' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'inventory' ? '#fff' : '#cbd5e1',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 16px',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Inventory Stock ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          style={{
            background: activeTab === 'movements' ? '#f97316' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'movements' ? '#fff' : '#cbd5e1',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 16px',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Stock Movements ({movements.length})
        </button>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'warehouses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {warehouses.map((w) => {
            const occPercent = Math.round((w.occupiedCapacitySqFt / w.totalCapacitySqFt) * 100);
            return (
              <div
                key={w.id}
                style={{
                  background: '#111726',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#f97316', fontWeight: '700' }}>{w.warehouseCode}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '2px 0 0' }}>{w.warehouseName}</h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{w.city}, {w.state}</div>
                  </div>
                  <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                    {w.status}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>
                    <span>Occupancy Rate</span>
                    <span style={{ fontWeight: '700', color: occPercent > 80 ? '#f97316' : '#10b981' }}>{occPercent}%</span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${occPercent}%`,
                        background: occPercent > 80 ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'linear-gradient(90deg, #10b981, #38bdf8)',
                        borderRadius: '10px',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '6px' }}>
                    {w.occupiedCapacitySqFt.toLocaleString()} sq ft / {w.totalCapacitySqFt.toLocaleString()} sq ft total
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1' }}>
                  <span>Manager: <strong style={{ color: '#fff' }}>{w.managerName}</strong></span>
                  <span>{w.contactPhone}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 20px' }}>Item Code</th>
                <th style={{ padding: '14px 16px' }}>Item Name</th>
                <th style={{ padding: '14px 16px' }}>Depot</th>
                <th style={{ padding: '14px 16px' }}>Stock Quantity</th>
                <th style={{ padding: '14px 16px' }}>Unit Price</th>
                <th style={{ padding: '14px 16px' }}>Aisle</th>
                <th style={{ padding: '14px 16px' }}>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                  <td style={{ padding: '14px 20px', fontWeight: '700', color: '#f97316' }}>{item.itemCode}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#fff' }}>{item.itemName}</td>
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{item.warehouseCode}</td>
                  <td style={{ padding: '14px 16px', color: '#fff', fontWeight: '700' }}>
                    {item.quantity} {item.unit}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '600' }}>
                    ₹{Number(item.unitPrice || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{item.locationAisle}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      color: item.quantity <= item.minThreshold ? '#ef4444' : '#10b981',
                      fontWeight: '700',
                      fontSize: '11.5px',
                    }}>
                      ● {item.quantity <= item.minThreshold ? 'LOW THRESHOLD' : 'OPTIMAL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'movements' && (
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 20px' }}>Reference #</th>
                <th style={{ padding: '14px 16px' }}>Type</th>
                <th style={{ padding: '14px 16px' }}>Item Name</th>
                <th style={{ padding: '14px 16px' }}>Quantity</th>
                <th style={{ padding: '14px 16px' }}>Depot</th>
                <th style={{ padding: '14px 16px' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                  <td style={{ padding: '14px 20px', fontWeight: '700', color: '#fff' }}>{m.referenceNumber}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      color: m.movementType === 'INWARD' ? '#10b981' : '#f97316',
                      fontWeight: '700', fontSize: '11.5px',
                    }}>
                      {m.movementType === 'INWARD' ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                      {m.movementType}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{m.itemName}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#fff' }}>{m.quantity}</td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{m.warehouseCode}</td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Item Modal */}
      <Modal isOpen={showItemModal} onClose={() => setShowItemModal(false)} title="Add Inventory Item">
        <form onSubmit={handleCreateItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Item Name *</label>
            <input
              type="text"
              className="form-input"
              style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
              value={itemForm.itemName}
              onChange={(e) => setItemForm({ ...itemForm, itemName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Warehouse Depot</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={itemForm.warehouseCode}
                onChange={(e) => setItemForm({ ...itemForm, warehouseCode: e.target.value })}
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.warehouseCode}>{w.warehouseName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Category</label>
              <select
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={itemForm.category}
                onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
              >
                <option value="GENERAL_CARGO">General Cargo</option>
                <option value="PACKAGING">Packaging & Pallets</option>
                <option value="SPARE_PARTS">Vehicle Spare Parts</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Quantity</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={itemForm.quantity}
                onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Unit Price (₹)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#1c263d', borderColor: '#2d3b55', color: '#fff' }}
                value={itemForm.unitPrice}
                onChange={(e) => setItemForm({ ...itemForm, unitPrice: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowItemModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Add to Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
