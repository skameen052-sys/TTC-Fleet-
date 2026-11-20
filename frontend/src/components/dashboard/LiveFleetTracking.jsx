import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Gauge,
  Clock,
  BatteryCharging,
  Fuel,
  Play,
  Pause,
  Maximize2,
  RefreshCw,
  Phone,
  User,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import L from 'leaflet';

export const LiveFleetTracking = ({ gpsData = [], onSimulateTick }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | On Trip | Available | Under Maintenance
  const [isSimulating, setIsSimulating] = useState(true);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Default selected vehicle on load
  useEffect(() => {
    if (!selectedVehicle && gpsData.length > 0) {
      setSelectedVehicle(gpsData[0]);
    }
  }, [gpsData, selectedVehicle]);

  // Simulation timer
  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        if (onSimulateTick) onSimulateTick();
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isSimulating, onSimulateTick]);

  // Filtered vehicles list
  const filteredVehicles = gpsData.filter(v => {
    const matchesSearch =
      v.vehicleReg.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.destination.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || v.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [41.8781, -85.6298],
          zoom: 7,
          zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet map init warning:', err);
      }
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => {
      try { map.removeLayer(marker); } catch (e) { }
    });
    markersRef.current = {};

    // Add updated markers
    filteredVehicles.forEach(item => {
      const isSelected = selectedVehicle && selectedVehicle.vehicleReg === item.vehicleReg;

      const markerHtml = `
        <div style="
          width: ${isSelected ? '36px' : '28px'};
          height: ${isSelected ? '36px' : '28px'};
          border-radius: 50%;
          background: ${item.status === 'On Trip' ? '#2563eb' : item.status === 'Available' ? '#10b981' : '#8b5cf6'};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          ${item.status === 'On Trip' ? '▶' : '●'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-fleet-pin',
        html: markerHtml,
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 2px;">
          <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${item.vehicleReg}</div>
          <div style="color: #64748b; font-size: 11.5px; margin-bottom: 4px;">Driver: ${item.driverName}</div>
          <div style="display: flex; gap: 8px; font-size: 11px;">
            <span style="color: #2563eb; font-weight: 600;">${item.speedKmh} km/h</span>
            <span>ETA: ${item.eta}</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedVehicle(item);
      });

      markersRef.current[item.vehicleReg] = marker;
    });

  }, [filteredVehicles, selectedVehicle]);

  // Center on selected vehicle
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (mapInstanceRef.current && vehicle.lat && vehicle.lng) {
      mapInstanceRef.current.setView([vehicle.lat, vehicle.lng], 9, { animate: true });
      const marker = markersRef.current[vehicle.vehicleReg];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div className="content-card" style={{ padding: '22px' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <MapPin size={18} color="#2563eb" />
            <span>Live Fleet Tracking & Telemetry</span>
          </h2>
          <p className="section-subtitle">Real-time GPS coordinates, speed radar, route progress & ETA monitoring</p>
        </div>

        {/* Live Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => onSimulateTick && onSimulateTick()}
            title="Force GPS tick"
          >
            <RefreshCw size={13} /> Update Now
          </button>
          <button
            className={`btn ${isSimulating ? 'btn-secondary' : 'btn-primary'}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setIsSimulating(!isSimulating)}
          >
            {isSimulating ? <Pause size={13} /> : <Play size={13} />}
            {isSimulating ? 'Pause Radar' : 'Resume Live'}
          </button>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '11px', fontWeight: '700', color: isSimulating ? '#16a34a' : '#94a3b8', backgroundColor: isSimulating ? '#dcfce7' : '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
            <span className={isSimulating ? 'pulse-dot' : ''} style={{ width: 6, height: 6 }} />
            {isSimulating ? 'FEED ACTIVE' : 'PAUSED'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260 }}>
          <div className="global-search-container" style={{ width: '100%' }}>
            <Search className="search-icon-left" size={14} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by registration, driver or destination..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Status Pill Filters */}
        <div className="filter-tabs">
          {['ALL', 'On Trip', 'Available', 'Under Maintenance'].map((st) => (
            <button
              key={st}
              className={`filter-tab ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'ALL' ? 'All Active' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Details Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
        {/* Interactive Map Box */}
        <div className="map-wrapper" style={{ height: 460 }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Quick Map Overlay Stats */}
          <div className="map-control-overlay">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '12px', fontWeight: '600' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563eb' }} />
                On Trip ({gpsData.filter(g => g.status === 'On Trip').length})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
                Available ({gpsData.filter(g => g.status === 'Available').length})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                Maint. ({gpsData.filter(g => g.status === 'Under Maintenance').length})
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', height: 460, backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {selectedVehicle ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Card Header */}
              <div style={{ padding: '16px 20px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.01em' }}>
                    {selectedVehicle.vehicleReg}
                  </span>
                  <span
                    className={`status-pill ${selectedVehicle.status === 'On Trip'
                      ? 'status-ontrip'
                      : selectedVehicle.status === 'Available'
                        ? 'status-available'
                        : 'status-maintenance'
                      }`}
                  >
                    {selectedVehicle.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {selectedVehicle.category} &bull; GPS ID: {selectedVehicle.id}
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Speed & Heading Gauge */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: '10px 12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Gauge size={12} color="#2563eb" /> Current Speed
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginTop: 2 }}>
                      {selectedVehicle.speedKmh} <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b' }}>km/h</span>
                    </div>
                  </div>

                  <div style={{ padding: '10px 12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} color="#10b981" /> Est. Arrival (ETA)
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginTop: 2 }}>
                      {selectedVehicle.eta}
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div style={{ padding: '12px 14px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                    Route Corridor
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#64748b', marginTop: 4 }} />
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Origin Dispatch</div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{selectedVehicle.origin}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563eb', marginTop: 4 }} />
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Destination Hub</div>
                        <div style={{ fontWeight: '600', color: '#2563eb' }}>{selectedVehicle.destination}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Details */}
                <div style={{ padding: '12px 14px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                    Assigned Operator
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                        <User size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{selectedVehicle.driverName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{selectedVehicle.driverPhone}</div>
                      </div>
                    </div>
                    {selectedVehicle.driverPhone !== 'N/A' && (
                      <a
                        href={`tel:${selectedVehicle.driverPhone}`}
                        style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Call Operator"
                      >
                        <Phone size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Diagnostics & Power */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: '8px 10px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11.5px' }}>
                    <span style={{ color: '#64748b', display: 'block' }}>Energy / Tank:</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{selectedVehicle.fuelOrBattery}</span>
                  </div>
                  <div style={{ padding: '8px 10px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11.5px' }}>
                    <span style={{ color: '#64748b', display: 'block' }}>Odometer:</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{selectedVehicle.odometer}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Timestamp */}
              <div style={{ padding: '10px 20px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                <span>GPS Sync: {selectedVehicle.lastUpdated}</span>
                <span>Lat: {selectedVehicle.lat}, Lng: {selectedVehicle.lng}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '13px' }}>
              Select a vehicle on map or roster
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Quick Roster Selector Carousel */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: 8 }}>
          Live Fleet Quick Selection ({filteredVehicles.length} Units Matching)
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
          {filteredVehicles.map((item) => {
            const isSelected = selectedVehicle && selectedVehicle.vehicleReg === item.vehicleReg;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectVehicle(item)}
                style={{
                  minWidth: '190px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{item.vehicleReg}</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: item.status === 'On Trip' ? '#2563eb' : '#10b981' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.driverName}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginTop: 4, color: '#2563eb', fontWeight: '600' }}>
                  <span>{item.speedKmh > 0 ? `${item.speedKmh} km/h` : 'Parked'}</span>
                  <span>ETA: {item.eta}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
