import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Truck, Check, AlertCircle } from 'lucide-react';

export const AddVehicleModal = ({ isOpen, onClose, onAddVehicle }) => {
  const [formData, setFormData] = useState({
    regNumber: '',
    vin: '',
    make: 'Freightliner',
    model: 'Cascadia Evolution',
    year: '2024',
    category: 'Heavy Duty Truck',
    fuelType: 'Diesel',
    mileage: '15000',
    maxPayloadKg: '24000',
    currentLocation: 'Central Depot Bay 6, Chicago IL',
    status: 'Available'
  });

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.regNumber.trim()) {
      setError('Registration plate number is required (e.g. TTC-9012-HD)');
      return;
    }
    setError('');
    onAddVehicle(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Vehicle Asset"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <Truck size={15} /> Save & Register Asset
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#dc2626', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Registration Number *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. TTC-9821-HD"
              value={formData.regNumber}
              onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">VIN (17 characters)</label>
            <input
              type="text"
              className="form-input"
              placeholder="1FUJG6AV9NL..."
              value={formData.vin}
              onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Make</label>
            <input
              type="text"
              className="form-input"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Model</label>
            <input
              type="text"
              className="form-input"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Model Year</label>
            <input
              type="number"
              className="form-input"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Heavy Duty Truck">Heavy Duty Truck</option>
              <option value="Electric Cargo">Electric Cargo</option>
              <option value="Refrigerated Truck">Refrigerated Truck</option>
              <option value="Delivery Cargo Van">Delivery Cargo Van</option>
              <option value="Utility Van">Utility Van</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Powertrain / Fuel</label>
            <select
              className="form-select"
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            >
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric (Zero Emission)</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Hybrid">Hybrid Electric</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Initial Odometer (km)</label>
            <input
              type="number"
              className="form-input"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Max Payload Capacity (kg)</label>
            <input
              type="number"
              className="form-input"
              value={formData.maxPayloadKg}
              onChange={(e) => setFormData({ ...formData, maxPayloadKg: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Initial Assigned Depot Location</label>
          <input
            type="text"
            className="form-input"
            value={formData.currentLocation}
            onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
