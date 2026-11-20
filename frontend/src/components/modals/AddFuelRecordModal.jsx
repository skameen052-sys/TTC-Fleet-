import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Fuel, DollarSign, Gauge, AlertCircle } from 'lucide-react';

export const AddFuelRecordModal = ({ isOpen, onClose, vehicles = [], onAddFuelRecord }) => {
  const [formData, setFormData] = useState({
    vehicleReg: '',
    date: new Date().toISOString().substring(0, 10),
    liters: '350',
    cost: '437.50',
    odometer: '74500',
    station: 'Pilot Travel Center #412, Toledo OH',
    fullTank: true
  });

  React.useEffect(() => {
    if (vehicles.length > 0 && !formData.vehicleReg) {
      setFormData(prev => ({ ...prev, vehicleReg: vehicles[0].regNumber }));
    }
  }, [vehicles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicleReg || !formData.liters || !formData.cost) {
      return;
    }
    onAddFuelRecord(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Fuel & Energy Record"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <Fuel size={15} /> Save Fuel Log
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="form-group">
          <label className="form-label">Vehicle Registration Number *</label>
          <select
            className="form-select"
            value={formData.vehicleReg}
            onChange={(e) => setFormData({ ...formData, vehicleReg: e.target.value })}
            required
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.regNumber}>
                {v.regNumber} &mdash; {v.make} {v.model} ({v.fuelType})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Fuel Volume (Liters) *</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={formData.liters}
              onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Cost ($ USD) *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Odometer Reading (km) *</label>
            <input
              type="number"
              className="form-input"
              value={formData.odometer}
              onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Transaction Date *</label>
            <input
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Fuel Station / Depot Provider</label>
          <input
            type="text"
            className="form-input"
            value={formData.station}
            onChange={(e) => setFormData({ ...formData, station: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <input
            type="checkbox"
            id="fullTankCheckbox"
            checked={formData.fullTank}
            onChange={(e) => setFormData({ ...formData, fullTank: e.target.checked })}
          />
          <label htmlFor="fullTankCheckbox" style={{ fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
            Filled to full capacity (Calculates mileage accuracy)
          </label>
        </div>
      </form>
    </Modal>
  );
};
