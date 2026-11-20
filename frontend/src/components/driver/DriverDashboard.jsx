import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  PackageCheck,
  PackageX,
  Boxes,
  Fuel,
  Wrench,
  FileText,
  AlertTriangle,
  Phone,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Radio,
  Camera,
  PenTool,
  Upload,
  Sparkles,
  Calendar,
  Compass,
  AlertCircle,
  Bell
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Map Markers
const createPulseIcon = (color = '#FF7A1A') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid #FFFFFF;
        box-shadow: 0 0 0 4px ${color}40, 0 4px 10px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const DriverDashboard = ({
  driverData,
  onAdvanceStage,
  onConfirmPickup,
  onConfirmDelivery,
  onCancelTrip,
  onToggleGpsSharing,
  onOpenFuelModal,
  onOpenIssueModal,
  onOpenPodModal,
  onOpenContactModal,
  onSelectTab
}) => {
  const driver = driverData?.driver;
  const metrics = driverData?.metrics;
  const activeTrip = driverData?.activeTrip;
  const vehicle = driverData?.vehicle;
  const fuelLogs = driverData?.fuelLogs || [];
  const notifications = driverData?.driverNotifications || [];

  const [signatureName, setSignatureName] = useState('');
  const [podPhotoUploaded, setPodPhotoUploaded] = useState(false);
  const [failedReason, setFailedReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Map route polyline points (Chicago -> Toledo -> Cleveland)
  const routePolyline = [
    activeTrip?.route?.pickupCoords || [41.8781, -87.6298],
    activeTrip?.route?.currentCoords || [41.6528, -83.5379],
    activeTrip?.route?.destCoords || [41.4993, -81.6944]
  ];

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      const currentPos = activeTrip?.route?.currentCoords || [41.6528, -83.5379];
      const pickupCoords = activeTrip?.route?.pickupCoords || [41.8781, -87.6298];
      const destCoords = activeTrip?.route?.destCoords || [41.4993, -81.6944];

      const map = L.map(mapContainerRef.current, {
        center: currentPos,
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Pickup Marker
      L.marker(pickupCoords, { icon: createPulseIcon('#3478F6') })
        .addTo(map)
        .bindPopup(`<b>Pickup Origin:</b><br />${activeTrip?.pickup?.address || 'Origin Depot'}`);

      // Current Vehicle Marker
      L.marker(currentPos, { icon: createPulseIcon('#FF7A1A') })
        .addTo(map)
        .bindPopup(`<b>Current Location:</b> ${activeTrip?.vehicleReg || 'TTC-8492-HD'}<br />Speed: ${activeTrip?.route?.speedKmh || 68} km/h<br />ETA: ${activeTrip?.route?.eta || '1h 45m'}`);

      // Destination Marker
      L.marker(destCoords, { icon: createPulseIcon('#16A36A') })
        .addTo(map)
        .bindPopup(`<b>Destination Terminal:</b><br />${activeTrip?.delivery?.address || 'Terminal Bay'}`);

      // Route Polyline
      L.polyline([pickupCoords, currentPos, destCoords], {
        color: '#3478F6',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch (mapErr) {
      console.warn('Driver Leaflet map initialization safely caught:', mapErr);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (cleanupErr) {
        console.warn('Driver Leaflet cleanup warning:', cleanupErr);
      }
    };
  }, [activeTrip]);

  const currentStageIndex = (activeTrip && typeof activeTrip.currentStageIndex === 'number') ? activeTrip.currentStageIndex : 0;
  const currentStage = activeTrip?.stages?.[currentStageIndex] || { id: 1, name: 'Assigned', time: '06:00 AM' };
  const nextStage = activeTrip?.stages?.[currentStageIndex + 1] || null;

  return (
    <div className="driver-dashboard-view">
      {/* ===================================================================
          1. SUMMARY CARDS (7 KPI METRICS)
          =================================================================== */}
      <section className="driver-section">
        <div className="summary-cards-grid driver-kpi-grid">
          {/* Card 1: Total Assigned Trips */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('my-trips')}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#EBF3FF' }}>
              <Navigation size={26} color="#3478F6" strokeWidth={2.2} />
            </div>
            <div className="kpi-card-info">
              <span className="kpi-card-label">Total Assigned Trips</span>
              <span className="kpi-card-value">{metrics?.totalAssignedTrips || 18}</span>
            </div>
          </div>

          {/* Card 2: Today's Trips */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('my-trips')}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#FFF0E5' }}>
              <Clock size={26} color="#FF7A1A" strokeWidth={2.2} />
            </div>
            <div className="kpi-card-info">
              <span className="kpi-card-label">Today's Trips</span>
              <span className="kpi-card-value">{metrics?.todayTrips || 1}</span>
            </div>
          </div>

          {/* Card 3: Active Trips */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('active-trip')}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#E8F8F0' }}>
              <Truck size={26} color="#16A36A" strokeWidth={2.2} />
            </div>
            <div className="kpi-card-info">
              <span className="kpi-card-label">Active Trips</span>
              <span className="kpi-card-value">{metrics?.activeTrips || 1}</span>
            </div>
          </div>

          {/* Card 4: Upcoming Trips */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('my-trips')}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#F3EEFF' }}>
              <Calendar size={26} color="#7955E8" strokeWidth={2.2} />
            </div>
            <div className="kpi-card-info">
              <span className="kpi-card-label">Upcoming Trips</span>
              <span className="kpi-card-value">{metrics?.upcomingTrips || 3}</span>
            </div>
          </div>

          {/* Card 5: Completed Trips */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('trip-history')}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#E8F8F0' }}>
              <CheckCircle2 size={26} color="#16A36A" strokeWidth={2.2} />
            </div>
            <div className="kpi-card-info">
              <span className="kpi-card-label">Completed Trips</span>
              <span className="kpi-card-value">{metrics?.completedTrips || 482}</span>
            </div>
          </div>

          {/* Card 6: Pending Deliveries */}
          <div className="kpi-stat-card" onClick={() => onSelectTab('delivery')}>
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#FFF5EB' }}>
              <PackageX size={26} color="#FF7A1A" strokeWidth={2.2} />
            </div>
            <div className="kpi-card-info">
              <span className="kpi-card-label">Pending Deliveries</span>
              <span className="kpi-card-value">{metrics?.pendingDeliveries || 1}</span>
            </div>
          </div>

          {/* Card 7: Total Distance Travelled */}
          <div className="kpi-stat-card">
            <div className="kpi-card-icon-box" style={{ backgroundColor: '#EBF3FF' }}>
              <Compass size={26} color="#3478F6" strokeWidth={2.2} />
            </div>
            <div className="kpi-card-info">
              <span className="kpi-card-label">Total Distance Travelled</span>
              <span className="kpi-card-value" style={{ fontSize: '20px' }}>
                {metrics?.totalDistanceTravelled || '124,580 km'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          10. QUICK ACTIONS (8 ACTIONS)
          =================================================================== */}
      <section className="quick-actions-panel">
        <div className="quick-actions-header">
          <div className="quick-actions-title-wrap">
            <div className="quick-actions-icon-badge">
              <Sparkles size={18} color="#FF7A1A" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="quick-actions-title">Driver Quick Actions</h3>
              <p className="quick-actions-subtitle">
                Essential dispatch, route tracking, and delivery workflows for active assignment
              </p>
            </div>
          </div>
        </div>

        <div className="driver-quick-actions-grid">
          {/* 1. Accept Trip */}
          <button
            className="driver-action-btn"
            onClick={() => {
              if (activeTrip?.currentStageIndex < 1) onAdvanceStage();
              else alert('Current trip #TRIP-5082 is already Accepted and In Transit.');
            }}
          >
            <div className="driver-btn-icon-box" style={{ backgroundColor: '#E8F8F0' }}>
              <CheckCircle2 size={20} color="#16A36A" />
            </div>
            <div className="driver-btn-text">
              <span className="driver-btn-title">Accept Trip</span>
              <span className="driver-btn-sub">Acknowledge dispatch</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </button>

          {/* 2. Start Trip */}
          <button
            className="driver-action-btn"
            onClick={() => {
              if (activeTrip?.currentStageIndex < 4) onAdvanceStage();
              else alert('Trip started. Odometer recorded at Chicago Central Depot.');
            }}
          >
            <div className="driver-btn-icon-box" style={{ backgroundColor: '#FFF0E5' }}>
              <Truck size={20} color="#FF7A1A" />
            </div>
            <div className="driver-btn-text">
              <span className="driver-btn-title">Start Trip</span>
              <span className="driver-btn-sub">Depart pickup depot</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </button>

          {/* 3. Open Navigation */}
          <button
            className="driver-action-btn"
            onClick={() => onSelectTab('route-nav')}
          >
            <div className="driver-btn-icon-box" style={{ backgroundColor: '#EBF3FF' }}>
              <Navigation size={20} color="#3478F6" />
            </div>
            <div className="driver-btn-text">
              <span className="driver-btn-title">Open Navigation</span>
              <span className="driver-btn-sub">Turn-by-turn radar</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </button>

          {/* 4. Update Pickup Status */}
          <button
            className="driver-action-btn"
            onClick={() => onSelectTab('pickup')}
          >
            <div className="driver-btn-icon-box" style={{ backgroundColor: '#E8F8F0' }}>
              <PackageCheck size={20} color="#16A36A" />
            </div>
            <div className="driver-btn-text">
              <span className="driver-btn-title">Update Pickup</span>
              <span className="driver-btn-sub">Confirm goods loading</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </button>

          {/* 5. Update Delivery Status */}
          <button
            className="driver-action-btn"
            onClick={() => onSelectTab('delivery')}
          >
            <div className="driver-btn-icon-box" style={{ backgroundColor: '#FFF5EB' }}>
              <PackageX size={20} color="#FF7A1A" />
            </div>
            <div className="driver-btn-text">
              <span className="driver-btn-title">Update Delivery</span>
              <span className="driver-btn-sub">Destination check-in</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </button>

          {/* 6. Upload Delivery Proof */}
          <button
            className="driver-action-btn"
            onClick={onOpenPodModal}
          >
            <div className="driver-btn-icon-box" style={{ backgroundColor: '#F3EEFF' }}>
              <Camera size={20} color="#7955E8" />
            </div>
            <div className="driver-btn-text">
              <span className="driver-btn-title">Upload POD Proof</span>
              <span className="driver-btn-sub">Capture photos & sign</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </button>

          {/* 7. Report Vehicle Issue */}
          <button
            className="driver-action-btn"
            onClick={onOpenIssueModal}
          >
            <div className="driver-btn-icon-box" style={{ backgroundColor: '#FEECEC' }}>
              <AlertTriangle size={20} color="#EF5350" />
            </div>
            <div className="driver-btn-text">
              <span className="driver-btn-title">Report Issue</span>
              <span className="driver-btn-sub">Mechanical or tire alert</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </button>

          {/* 8. Contact Logistics Manager */}
          <button
            className="driver-action-btn"
            onClick={onOpenContactModal}
          >
            <div className="driver-btn-icon-box" style={{ backgroundColor: '#EBF3FF' }}>
              <Phone size={20} color="#3478F6" />
            </div>
            <div className="driver-btn-text">
              <span className="driver-btn-title">Contact Manager</span>
              <span className="driver-btn-sub">24/7 Dispatch Central</span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </button>
        </div>
      </section>

      {/* ===================================================================
          2. CURRENT TRIP INFORMATION & 3. TRIP STATUS MANAGEMENT
          =================================================================== */}
      <div className="dashboard-grid-2col">
        {/* Section 2: Current Trip Information Card */}
        <div className="content-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <Navigation size={18} color="#FF7A1A" /> Current Trip Information
              </h3>
              <p className="section-subtitle">Active dispatch assignment and customer routing specifications</p>
            </div>
            <span className="status-pill status-ontrip">
              <span className="pulse-circle" style={{ width: 6, height: 6 }} /> {activeTrip?.status || 'In Transit'}
            </span>
          </div>

          <div className="trip-specs-grid">
            <div className="spec-item">
              <span className="spec-label">Trip ID</span>
              <span className="spec-value highlight">{activeTrip?.id || 'TRIP-5082'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Order ID</span>
              <span className="spec-value">{activeTrip?.orderId || 'ORD-9821'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Shipment ID</span>
              <span className="spec-value">{activeTrip?.shipmentId || 'SHP-7740'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Vehicle Registration</span>
              <span className="spec-value">{activeTrip?.vehicleReg || 'TTC-8492-HD'}</span>
            </div>
          </div>

          {/* Locations */}
          <div className="trip-locations-box">
            <div className="location-row">
              <div className="loc-dot start" />
              <div className="loc-info">
                <span className="loc-title">Pickup Origin (Dock Bay 4)</span>
                <span className="loc-address">{activeTrip?.pickup?.address}</span>
                <span className="loc-time">Scheduled: {activeTrip?.pickup?.scheduledTime}</span>
              </div>
            </div>

            <div className="loc-divider" />

            <div className="location-row">
              <div className="loc-dot end" />
              <div className="loc-info">
                <span className="loc-title">Destination Terminal (Bay 12)</span>
                <span className="loc-address">{activeTrip?.delivery?.address}</span>
                <span className="loc-time">Expected Arrival: {activeTrip?.delivery?.expectedTime}</span>
              </div>
            </div>
          </div>

          {/* Customer / Dock Contacts */}
          <div className="trip-contacts-strip">
            <div className="contact-col">
              <span className="contact-role">Pickup Supervisor</span>
              <span className="contact-name">{activeTrip?.pickup?.contactName}</span>
              <a href={`tel:${activeTrip?.pickup?.contactPhone}`} className="contact-phone-link">
                <Phone size={12} /> {activeTrip?.pickup?.contactPhone}
              </a>
            </div>
            <div className="contact-col">
              <span className="contact-role">Delivery Receiver</span>
              <span className="contact-name">{activeTrip?.delivery?.receiverName}</span>
              <a href={`tel:${activeTrip?.delivery?.receiverPhone}`} className="contact-phone-link">
                <Phone size={12} /> {activeTrip?.delivery?.receiverPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Section 3: Trip Status Lifecycle Management */}
        <div className="content-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <Clock size={18} color="#FF7A1A" /> Trip Lifecycle & Status Updates
              </h3>
              <p className="section-subtitle">Authorize sequential progression without skipping mandatory safety checkpoints</p>
            </div>
            <span className="stage-step-counter">
              Stage {(activeTrip?.currentStageIndex || 0) + 1} of 9
            </span>
          </div>

          {/* 9-Stage Timeline */}
          <div className="trip-lifecycle-timeline">
            {activeTrip?.stages?.map((stg, idx) => {
              const isCompleted = stg.completed;
              const isActive = stg.active || idx === (activeTrip?.currentStageIndex ?? 0);
              const isUpcoming = !isCompleted && !isActive;

              return (
                <div
                  key={stg.id}
                  className={`timeline-step-row ${
                    isCompleted ? 'completed' : isActive ? 'current-active' : 'upcoming'
                  }`}
                >
                  <div className="step-badge-indicator">
                    {isCompleted ? (
                      <CheckCircle2 size={16} color="#16A36A" />
                    ) : isActive ? (
                      <div className="pulse-stage-dot" />
                    ) : (
                      <span className="step-number">{stg.id}</span>
                    )}
                  </div>

                  <div className="step-text-wrap">
                    <span className="step-name">{stg.name}</span>
                    <span className="step-timestamp">
                      {isCompleted ? `Recorded at ${stg.time}` : isActive ? stg.time : 'Pending'}
                    </span>
                  </div>

                  {isActive && (
                    <span className="current-badge-pill">CURRENT STAGE</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Advance Stage Control */}
          <div className="stage-control-action-bar">
            {nextStage ? (
              <button
                className="btn btn-primary advance-stage-btn"
                onClick={onAdvanceStage}
              >
                <span>Advance to: {nextStage.name}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="trip-completed-banner">
                <CheckCircle2 size={18} color="#16A36A" />
                <span>Trip #TRIP-5082 Completed & Dispatched into Audit Archive.</span>
              </div>
            )}

            {/* Trip Cancellation Workflow */}
            <button
              className="cancel-trip-btn"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Trip
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
          4. ROUTE & GPS TRACKING INTERACTIVE SECTION
          =================================================================== */}
      <section className="content-card route-tracking-card" id="route-navigation-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <MapPin size={18} color="#FF7A1A" /> Route & Live GPS Radar Navigation
            </h3>
            <p className="section-subtitle">
              Commercial turn-by-turn route line with GNSS speed, corridor telemetry, and ETA calculation
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className={`gps-sharing-toggle-btn ${activeTrip?.route?.isGpsSharing ? 'active' : ''}`}
              onClick={onToggleGpsSharing}
            >
              <Radio size={14} color={activeTrip?.route?.isGpsSharing ? '#16A36A' : '#718096'} />
              <span>{activeTrip?.route?.isGpsSharing ? 'GPS Broadcast: Online' : 'GPS Broadcast: Paused'}</span>
            </button>
            <span className="gps-accuracy-pill">{activeTrip?.route?.gpsStatus}</span>
          </div>
        </div>

        {/* Route Stats Ribbon */}
        <div className="route-stats-ribbon">
          <div className="route-stat-box">
            <span className="r-label">Current Vehicle Location</span>
            <span className="r-val">{activeTrip?.route?.currentLocation}</span>
          </div>
          <div className="route-stat-box">
            <span className="r-label">Live Telemetry Speed</span>
            <span className="r-val highlight">{activeTrip?.route?.speedKmh || 68} km/h</span>
          </div>
          <div className="route-stat-box">
            <span className="r-label">Remaining Distance</span>
            <span className="r-val">{activeTrip?.route?.remainingKm || 184} km / {activeTrip?.route?.totalDistanceKm || 552} km</span>
          </div>
          <div className="route-stat-box">
            <span className="r-label">Estimated Time of Arrival (ETA)</span>
            <span className="r-val highlight">{activeTrip?.route?.eta || '1h 45m'}</span>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="driver-map-wrapper">
          <div ref={mapContainerRef} style={{ width: '100%', height: '380px', borderRadius: '8px' }} />
        </div>
      </section>

      {/* ===================================================================
          5. PICKUP MANAGEMENT & 6. DELIVERY MANAGEMENT
          =================================================================== */}
      <div className="dashboard-grid-2col">
        {/* Section 5: Pickup Management */}
        <div className="content-card" id="pickup-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <PackageCheck size={18} color="#16A36A" /> Pickup Management
              </h3>
              <p className="section-subtitle">Freight collection, container loading, and dock departure verification</p>
            </div>
            {activeTrip?.pickup?.isConfirmed ? (
              <span className="status-pill status-available">
                <CheckCircle2 size={13} /> Goods Loaded
              </span>
            ) : (
              <span className="status-pill status-waiting">Pending Pickup</span>
            )}
          </div>

          <div className="pickup-details-list">
            <div className="detail-row">
              <span className="detail-key">Pickup Terminal:</span>
              <span className="detail-val">{activeTrip?.pickup?.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Cargo Manifest:</span>
              <span className="detail-val">{activeTrip?.pickup?.goodsDescription}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Package Count:</span>
              <span className="detail-val highlight">{activeTrip?.pickup?.packageQuantity}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Dock Supervisor:</span>
              <span className="detail-val">{activeTrip?.pickup?.contactName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Certified Timestamp:</span>
              <span className="detail-val">{activeTrip?.pickup?.pickupTimestamp || 'Not yet certified'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pickup-action-row">
            <button
              className="btn btn-secondary"
              onClick={() => alert(`Dialing dock master ${activeTrip?.pickup?.contactPhone}...`)}
            >
              <Phone size={14} /> Call Dock
            </button>
            <button
              className="btn btn-primary"
              onClick={onConfirmPickup}
              disabled={activeTrip?.pickup?.isConfirmed}
            >
              <CheckCircle2 size={16} />
              <span>{activeTrip?.pickup?.isConfirmed ? 'Pickup Confirmed' : 'Confirm Goods Picked Up'}</span>
            </button>
          </div>
        </div>

        {/* Section 6: Delivery Management */}
        <div className="content-card" id="delivery-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <PackageX size={18} color="#FF7A1A" /> Delivery Management & Proof of Delivery
              </h3>
              <p className="section-subtitle">Receiver hand-over, digital signature capture, and delivery certification</p>
            </div>
            {activeTrip?.delivery?.isConfirmed ? (
              <span className="status-pill status-available">
                <CheckCircle2 size={13} /> Delivered
              </span>
            ) : (
              <span className="status-pill status-ontrip">In Transit to Receiver</span>
            )}
          </div>

          <div className="pickup-details-list">
            <div className="detail-row">
              <span className="detail-key">Delivery Destination:</span>
              <span className="detail-val">{activeTrip?.delivery?.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Authorized Receiver:</span>
              <span className="detail-val">{activeTrip?.delivery?.receiverName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Digital Signature:</span>
              <span className="detail-val">
                {activeTrip?.delivery?.signatureCaptured ? '✓ Digital Signature Captured' : 'Awaiting Receiver'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Proof of Delivery (POD):</span>
              <span className="detail-val">
                {activeTrip?.delivery?.podUploaded ? '✓ Bill of Lading Stamped & Uploaded' : 'Awaiting POD photo'}
              </span>
            </div>
          </div>

          {/* Delivery Hand-over Action Controls */}
          <div className="delivery-action-panel">
            <button
              className="btn btn-secondary"
              onClick={onOpenPodModal}
            >
              <PenTool size={14} /> Capture Signature & POD
            </button>

            <button
              className="btn btn-primary"
              onClick={() => onConfirmDelivery()}
              disabled={activeTrip?.delivery?.isConfirmed}
            >
              <CheckCircle2 size={16} />
              <span>{activeTrip?.delivery?.isConfirmed ? 'Delivery Certified' : 'Confirm Goods Delivered'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
          7. VEHICLE INFORMATION & 8. FUEL & TRIP EXPENSES
          =================================================================== */}
      <div className="dashboard-grid-2col">
        {/* Section 7: Vehicle Information (My Vehicle) */}
        <div className="content-card" id="my-vehicle-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <Truck size={18} color="#3478F6" /> My Vehicle Details
              </h3>
              <p className="section-subtitle">Commercial powertrain telemetry, payload limits, and safety status</p>
            </div>
            <span className="status-pill status-available">
              <ShieldCheck size={13} /> {vehicle?.inspectionStatus || 'Certified Safe'}
            </span>
          </div>

          <div className="vehicle-info-card-inner">
            <div className="vehicle-photo-col">
              <img
                src="/assets/fleet-manager-trucks.jpg"
                alt="Freightliner Cascadia"
                className="vehicle-thumb-img"
              />
              <span className="vehicle-plate-pill">{vehicle?.regNumber || 'TTC-8492-HD'}</span>
            </div>

            <div className="vehicle-specs-col">
              <div className="v-spec-row">
                <span className="v-key">Make & Model:</span>
                <span className="v-val">{vehicle?.make} {vehicle?.model} ({vehicle?.year})</span>
              </div>
              <div className="v-spec-row">
                <span className="v-key">Category:</span>
                <span className="v-val">{vehicle?.category}</span>
              </div>
              <div className="v-spec-row">
                <span className="v-key">Max Payload:</span>
                <span className="v-val">{vehicle?.maxCapacity}</span>
              </div>
              <div className="v-spec-row">
                <span className="v-key">Current Odometer:</span>
                <span className="v-val highlight">{vehicle?.odometerKm?.toLocaleString()} km</span>
              </div>
              <div className="v-spec-row">
                <span className="v-key">Fuel Level:</span>
                <span className="v-val">{vehicle?.fuelLevel}</span>
              </div>
            </div>
          </div>

          {/* Maintenance Notice */}
          <div className="vehicle-alert-strip">
            <Wrench size={16} color="#7955E8" />
            <span>{vehicle?.maintenanceAlert}</span>
            <button
              className="report-issue-inline-btn"
              onClick={onOpenIssueModal}
            >
              Report Issue
            </button>
          </div>
        </div>

        {/* Section 8: Fuel & Trip Expenses */}
        <div className="content-card" id="fuel-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <Fuel size={18} color="#16A36A" /> Fuel & Trip Expenses
              </h3>
              <p className="section-subtitle">Record fuel refills, commercial truck-stop expenses, and receipt slips</p>
            </div>
            <button
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={onOpenFuelModal}
            >
              <Fuel size={14} /> Add Fuel Entry
            </button>
          </div>

          {/* Fuel Stats */}
          <div className="fuel-quick-summary">
            <div className="fuel-stat-item">
              <span className="f-label">Recent Refills</span>
              <span className="f-val">{fuelLogs.length} Records</span>
            </div>
            <div className="fuel-stat-item">
              <span className="f-label">Total Refueled</span>
              <span className="f-val">775 Liters</span>
            </div>
            <div className="fuel-stat-item">
              <span className="f-label">Total Expense</span>
              <span className="f-val highlight">$968.75</span>
            </div>
          </div>

          {/* Recent Refills Table */}
          <div className="table-responsive" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            <table className="enterprise-table" style={{ fontSize: '12.5px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Station</th>
                  <th>Liters</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map(fl => (
                  <tr key={fl.id}>
                    <td>{fl.date}</td>
                    <td>{fl.station}</td>
                    <td>{fl.liters} L</td>
                    <td>${Number(fl?.cost || 0).toFixed(2)}</td>
                    <td>
                      <span className="status-pill status-available" style={{ fontSize: '11px', padding: '2px 6px' }}>
                        {fl.receiptStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================================================================
          9. NOTIFICATIONS & ALERTS
          =================================================================== */}
      <section className="content-card" id="driver-notifications-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Bell size={18} color="#FF7A1A" /> Driver Notifications & Operational Alerts
            </h3>
            <p className="section-subtitle">Real-time route dispatches, customer instructions, and emergency weather alerts</p>
          </div>
          <span className="status-pill status-available">{notifications.length} Active Bulletins</span>
        </div>

        <div className="driver-notifications-list">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`driver-notif-item ${n.type}`}
            >
              <div className="notif-icon-bubble">
                {n.type === 'emergency' ? (
                  <AlertCircle size={18} color="#EF5350" />
                ) : n.type === 'assignment' ? (
                  <Navigation size={18} color="#3478F6" />
                ) : (
                  <CheckCircle2 size={18} color="#16A36A" />
                )}
              </div>

              <div className="notif-body">
                <div className="notif-title-row">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p className="notif-message">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cancel Trip Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h4 className="modal-title" style={{ color: '#EF5350' }}>Cancel Trip #TRIP-5082</h4>
              <button className="modal-close-btn" onClick={() => setShowCancelModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13.5px', color: '#17243A' }}>
                Please select a mandatory operational reason for trip cancellation. This will be transmitted immediately to dispatch central.
              </p>
              <div className="form-group">
                <label className="form-label">Cancellation Reason</label>
                <select
                  className="form-select"
                  value={failedReason}
                  onChange={(e) => setFailedReason(e.target.value)}
                >
                  <option value="">Select reason...</option>
                  <option value="Severe Weather / Blizzard Route Closure">Severe Weather / Blizzard Route Closure</option>
                  <option value="Mechanical Breakdown (Towing Required)">Mechanical Breakdown (Towing Required)</option>
                  <option value="Shipper Dock Cancellation">Shipper Dock Cancellation</option>
                  <option value="Hours of Service (HOS) Exceeded">Hours of Service (HOS) Exceeded</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Keep Trip Active</button>
              <button
                className="btn"
                style={{ backgroundColor: '#EF5350', color: 'white' }}
                disabled={!failedReason}
                onClick={() => {
                  onCancelTrip(failedReason);
                  setShowCancelModal(false);
                }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
