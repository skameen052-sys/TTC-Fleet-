import React, { useState, useEffect } from 'react';
import { Compass, RefreshCw, MapPin, Gauge, Fuel, Zap, Truck, CheckCircle2, Play, Pause } from 'lucide-react';
import { trackingService } from '../services/trackingService';

export const GpsTracking = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await trackingService.getLiveTelemetry();
      if (res && res.data) {
        setLocations(res.data);
        if (!selectedVehicle && res.data.length > 0) {
          setSelectedVehicle(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  // Telemetry real-time live jitter simulation (advancing longitude slightly)
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setLocations((prev) =>
        prev.map((loc) => {
          if (loc.engineStatus === 'RUNNING') {
            const jitterLat = (Math.random() - 0.5) * 0.002;
            const jitterLng = (Math.random() - 0.5) * 0.002;
            const updated = {
              ...loc,
              latitude: Number((loc.latitude + jitterLat).toFixed(4)),
              longitude: Number((loc.longitude + jitterLng).toFixed(4)),
              speedKmph: Math.min(85, Math.max(45, Math.round(loc.speedKmph + (Math.random() - 0.5) * 4))),
            };
            if (selectedVehicle && selectedVehicle.vehiclePlate === loc.vehiclePlate) {
              setSelectedVehicle(updated);
            }
            return updated;
          }
          return loc;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isSimulating, selectedVehicle]);

  return (
    <div className="module-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Live GPS Fleet Tracking</h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '4px 0 0' }}>
            Satellite positioning, active telemetry, engine state, and corridor speeds.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-secondary"
            onClick={() => setIsSimulating(!isSimulating)}
            style={{ color: isSimulating ? '#10b981' : '#cbd5e1' }}
          >
            {isSimulating ? <Pause size={15} /> : <Play size={15} />}
            <span>{isSimulating ? 'Live Telemetry Active' : 'Resume Telemetry'}</span>
          </button>
          <button className="btn-secondary" onClick={fetchTelemetry}>
            <RefreshCw size={15} />
            <span>Ping Satellites</span>
          </button>
        </div>
      </div>

      {/* Main GPS Tracking Layout: 2 Columns (Map/Canvas + Vehicle Telemetry Panel) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Interactive Satellite Canvas Simulator */}
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '440px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="#f97316" />
              <span style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>Indian National Highway Fleet Corridor (NH-44 / GQ)</span>
            </div>
            <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '10px', fontWeight: '700' }}>
              ● GPS LOCK ACTIVE (3 SATELLITES)
            </span>
          </div>

          {/* Interactive Map Visual */}
          <div
            style={{
              flex: 1,
              background: 'radial-gradient(ellipse at center, #17233d 0%, #0c1220 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '340px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Grid overlay for map feel */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Highway Route Path Polyline Simulator */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <polyline
                points="100,60 250,140 380,240 520,320"
                fill="none"
                stroke="rgba(249,115,22,0.4)"
                strokeWidth="3"
                strokeDasharray="6,6"
              />
              <polyline
                points="380,240 580,210"
                fill="none"
                stroke="rgba(56,189,248,0.4)"
                strokeWidth="3"
                strokeDasharray="6,6"
              />
            </svg>

            {/* City Waypoints */}
            <div style={{ position: 'absolute', left: '80px', top: '50px', color: '#94a3b8', fontSize: '11px', textAlign: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b', margin: '0 auto 4px' }} />
              Delhi Hub
            </div>
            <div style={{ position: 'absolute', left: '230px', top: '130px', color: '#94a3b8', fontSize: '11px', textAlign: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b', margin: '0 auto 4px' }} />
              Nagpur
            </div>
            <div style={{ position: 'absolute', left: '360px', top: '230px', color: '#f97316', fontSize: '11px', fontWeight: '700', textAlign: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316', margin: '0 auto 4px', boxShadow: '0 0 10px #f97316' }} />
              Hyderabad Central Hub
            </div>
            <div style={{ position: 'absolute', left: '500px', top: '310px', color: '#38bdf8', fontSize: '11px', fontWeight: '700', textAlign: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8', margin: '0 auto 4px', boxShadow: '0 0 10px #38bdf8' }} />
              Bengaluru Depot
            </div>
            <div style={{ position: 'absolute', left: '560px', top: '200px', color: '#cbd5e1', fontSize: '11px', textAlign: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b', margin: '0 auto 4px' }} />
              Chennai Harbour
            </div>

            {/* Live Vehicle Blips on Map */}
            {locations.map((loc, idx) => {
              const isSel = selectedVehicle?.vehiclePlate === loc.vehiclePlate;
              const positions = [
                { left: '420px', top: '260px' }, // Kurnool / Hyd
                { left: '540px', top: '230px' }, // Sriperumbudur
                { left: '490px', top: '300px' }, // Electronic City
              ];
              const pos = positions[idx % positions.length];

              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedVehicle(loc)}
                  style={{
                    position: 'absolute',
                    left: pos.left,
                    top: pos.top,
                    cursor: 'pointer',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}
                  title={`Vehicle ${loc.vehiclePlate} (${loc.speedKmph} km/h)`}
                >
                  <div
                    style={{
                      width: isSel ? '34px' : '26px',
                      height: isSel ? '34px' : '26px',
                      borderRadius: '50%',
                      background: loc.engineStatus === 'RUNNING' ? '#f97316' : '#64748b',
                      border: isSel ? '3px solid #fff' : '2px solid rgba(255,255,255,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: isSel ? '0 0 20px #f97316' : '0 4px 10px rgba(0,0,0,0.5)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Truck size={isSel ? 16 : 13} />
                  </div>
                  <div
                    style={{
                      background: 'rgba(13, 19, 33, 0.9)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10.5px',
                      fontWeight: '700',
                      color: '#fff',
                      marginTop: '4px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {loc.vehiclePlate}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Vehicle Telemetry Card */}
        <div style={{ background: '#111726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Selected Vehicle Telemetry</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              {selectedVehicle?.vehiclePlate || 'Select Vehicle'}
            </div>
            <div style={{ fontSize: '12.5px', color: '#10b981', marginTop: '2px' }}>
              Driver: {selectedVehicle?.driverName || 'Assigned Driver'}
            </div>
          </div>

          {/* Telemetry Metric Widgets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#161f33', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '11px' }}>
                <Gauge size={14} color="#f97316" />
                <span>SPEED</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                {selectedVehicle?.speedKmph || 0} <span style={{ fontSize: '12px', color: '#94a3b8' }}>KM/H</span>
              </div>
            </div>

            <div style={{ background: '#161f33', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '11px' }}>
                <Fuel size={14} color="#10b981" />
                <span>FUEL TANK</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                {selectedVehicle?.fuelLevelPercent || 80}%
              </div>
            </div>
          </div>

          {/* Geographic Coordinates */}
          <div style={{ background: '#161f33', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', marginBottom: '8px' }}>GEOGRAPHIC COORDINATES</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '12.5px', marginBottom: '4px' }}>
              <span>Latitude:</span>
              <span style={{ fontWeight: '700', color: '#fff' }}>{selectedVehicle?.latitude}° N</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '12.5px', marginBottom: '8px' }}>
              <span>Longitude:</span>
              <span style={{ fontWeight: '700', color: '#fff' }}>{selectedVehicle?.longitude}° E</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', fontSize: '11.5px', color: '#94a3b8' }}>
              {selectedVehicle?.currentAddress || 'Locating nearest highway landmark...'}
            </div>
          </div>

          {/* Vehicle List Quick Switch */}
          <div>
            <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', marginBottom: '8px' }}>ALL TRACKED VEHICLES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedVehicle(loc)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: selectedVehicle?.vehiclePlate === loc.vehiclePlate ? 'rgba(249,115,22,0.15)' : '#161f33',
                    border: selectedVehicle?.vehiclePlate === loc.vehiclePlate ? '1px solid #f97316' : '1px solid transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ fontWeight: '700', color: '#fff' }}>{loc.vehiclePlate}</span>
                  <span style={{ color: loc.engineStatus === 'RUNNING' ? '#10b981' : '#94a3b8', fontWeight: '600', fontSize: '11px' }}>
                    ● {loc.engineStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
