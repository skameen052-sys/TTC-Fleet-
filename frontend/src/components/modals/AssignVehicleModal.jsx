import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { UserCheck, AlertCircle, MapPin, Calendar } from 'lucide-react';

export const AssignVehicleModal = ({ isOpen, onClose, vehicles = [], drivers = [], onAssignVehicle }) => {
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available');

  const [vehicleReg, setVehicleReg] = useState('');
  const [driverId, setDriverId] = useState('');
  const [routeName, setRouteName] = useState('Midwest Express Freight Route');
  const [expectedReturn, setExpectedReturn] = useState('Tomorrow 18:00');
  const [error, setError] = useState('');

  // Default selection
  React.useEffect(() => {
    if (availableVehicles.length > 0 && !vehicleReg) {
      setVehicleReg(availableVehicles[0].regNumber);
    }
    if (availableDrivers.length > 0 && !driverId) {
      setDriverId(availableDrivers[0].id);
    }
  }, [availableVehicles, availableDrivers, vehicleReg, driverId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleReg || !driverId) {
      setError('Please select both an available vehicle and an authorized driver.');
      return;
    }
    setError('');
    onAssignVehicle({
      vehicleReg,
      driverId,
      routeName,
      expectedReturn
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Vehicle & Driver Dispatch"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <UserCheck size={15} /> Confirm & Dispatch
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

        <div className="form-group">
          <label className="form-label">Select Available Vehicle Asset *</label>
          {availableVehicles.length === 0 ? (
            <div style={{ padding: '8px 12px', backgroundColor: '#fffbeb', borderRadius: '6px', color: '#b45309', fontSize: '12.5px' }}>
              No available vehicles currently in depot standby.
            </div>
          ) : (
            <select
              className="form-select"
              value={vehicleReg}
              onChange={(e) => setVehicleReg(e.target.value)}
              required
            >
              {availableVehicles.map(v => (
                <option key={v.id} value={v.regNumber}>
                  {v.regNumber} &mdash; {v.make} {v.model} ({v.category})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Assign Certified Driver (CDL) *</label>
          {availableDrivers.length === 0 ? (
            <div style={{ padding: '8px 12px', backgroundColor: '#fffbeb', borderRadius: '6px', color: '#b45309', fontSize: '12.5px' }}>
              No available drivers on standby.
            </div>
          ) : (
            <select
              className="form-select"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
            >
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.licenseNumber}) &mdash; Rating {d.rating}★
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Designated Route Corridor / Destination</label>
          <input
            type="text"
            className="form-input"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="e.g. Chicago Central -> Indianapolis Logistics Park"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Expected Return Date & Time</label>
          <input
            type="text"
            className="form-input"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            placeholder="e.g. 2026-11-21 18:00"
          />
        </div>
      </form>
    </Modal>
  );
};
