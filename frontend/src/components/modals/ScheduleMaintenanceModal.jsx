import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Wrench, Calendar, AlertCircle } from 'lucide-react';

export const ScheduleMaintenanceModal = ({ isOpen, onClose, vehicles = [], onScheduleMaintenance }) => {
  const [formData, setFormData] = useState({
    vehicleReg: '',
    serviceType: 'Brake Caliper & Pad Replacement',
    description: 'Preventive service overhaul per standard 50,000 km check.',
    status: 'Upcoming',
    scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10),
    cost: '750.00',
    serviceCenter: 'Central Depot Main Service Bay, Chicago IL',
    priority: 'Routine'
  });

  React.useEffect(() => {
    if (vehicles.length > 0 && !formData.vehicleReg) {
      setFormData(prev => ({ ...prev, vehicleReg: vehicles[0].regNumber }));
    }
  }, [vehicles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicleReg || !formData.serviceType) return;
    onScheduleMaintenance(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Vehicle Maintenance Work Order"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <Wrench size={15} /> Book Work Order
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
                {v.regNumber} &mdash; {v.make} {v.model} ({v.status})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Service Type *</label>
            <input
              type="text"
              className="form-input"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Routine">Routine PM</option>
              <option value="Medium">Medium</option>
              <option value="High">High Urgency</option>
              <option value="Critical">Critical Safety Hold</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Scheduled Date *</label>
            <input
              type="date"
              className="form-input"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Cost ($ USD)</label>
            <input
              type="number"
              className="form-input"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Authorized Service Facility</label>
          <input
            type="text"
            className="form-input"
            value={formData.serviceCenter}
            onChange={(e) => setFormData({ ...formData, serviceCenter: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Scope of Work / Notes</label>
          <textarea
            className="form-textarea"
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
