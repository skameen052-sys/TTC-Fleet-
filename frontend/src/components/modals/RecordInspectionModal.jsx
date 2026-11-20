import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ClipboardCheck, CheckCircle2, XCircle } from 'lucide-react';

export const RecordInspectionModal = ({ isOpen, onClose, vehicles = [], onRecordInspection }) => {
  const [formData, setFormData] = useState({
    vehicleReg: '',
    inspectorName: 'Lead Inspector Alex Mercer',
    odometerKm: '74500',
    tiresStatus: 'Pass (8/32")',
    brakesStatus: 'Pass (12mm)',
    lightsStatus: 'Pass',
    fluidsStatus: 'Pass',
    overallStatus: 'Passed',
    notes: 'Full multi-point pre-trip checklist completed and passed.'
  });

  React.useEffect(() => {
    if (vehicles.length > 0 && !formData.vehicleReg) {
      setFormData(prev => ({ ...prev, vehicleReg: vehicles[0].regNumber }));
    }
  }, [vehicles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicleReg) return;
    onRecordInspection(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Vehicle Pre/Post-Trip Inspection"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <ClipboardCheck size={15} /> Save & Certify Inspection
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
                {v.regNumber} &mdash; {v.make} {v.model}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Certified Inspector Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.inspectorName}
              onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Odometer (km) *</label>
            <input
              type="number"
              className="form-input"
              value={formData.odometerKm}
              onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })}
              required
            />
          </div>
        </div>

        {/* 4 Safety Check Items */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', backgroundColor: '#f8fafc' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', marginBottom: 10 }}>
            Mandatory Safety & Mechanical Checkpoints
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11.5px' }}>1. Tires & Tread Depth</label>
              <select
                className="form-select"
                value={formData.tiresStatus}
                onChange={(e) => setFormData({ ...formData, tiresStatus: e.target.value })}
              >
                <option value="Pass (8/32&quot;)">Pass (Good 8/32")</option>
                <option value="Pass (5/32&quot;)">Pass (Adequate 5/32")</option>
                <option value="Fail (< 4/32&quot;)">Fail (Tread Depth Low)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11.5px' }}>2. Brake Calipers & Pads</label>
              <select
                className="form-select"
                value={formData.brakesStatus}
                onChange={(e) => setFormData({ ...formData, brakesStatus: e.target.value })}
              >
                <option value="Pass (12mm)">Pass (Optimal 12mm)</option>
                <option value="Pass (7mm)">Pass (Acceptable 7mm)</option>
                <option value="Fail (< 3mm)">Fail (Under 3mm Limit)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11.5px' }}>3. Headlights & Indicators</label>
              <select
                className="form-select"
                value={formData.lightsStatus}
                onChange={(e) => setFormData({ ...formData, lightsStatus: e.target.value })}
              >
                <option value="Pass">Pass (All Lamps Operational)</option>
                <option value="Fail">Fail (Bulb / Wiring Fault)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11.5px' }}>4. Fluid Levels & Pressure</label>
              <select
                className="form-select"
                value={formData.fluidsStatus}
                onChange={(e) => setFormData({ ...formData, fluidsStatus: e.target.value })}
              >
                <option value="Pass">Pass (Oil, Coolant, Brake)</option>
                <option value="Fail">Fail (Leak / Low Level)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Overall Inspection Verdict</label>
          <select
            className="form-select"
            value={formData.overallStatus}
            onChange={(e) => setFormData({ ...formData, overallStatus: e.target.value })}
          >
            <option value="Passed">Passed (Approved for Service)</option>
            <option value="Action Required">Action Required (Tag out)</option>
            <option value="Out of Service">Out of Service (Critical Fail)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Inspector Observations</label>
          <textarea
            className="form-textarea"
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
