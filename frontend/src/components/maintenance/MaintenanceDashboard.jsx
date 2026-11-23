import React, { useState } from 'react';
import {
  Wrench,
  Calendar,
  History,
  AlertTriangle,
  Activity,
  ShieldCheck,
  CheckCircle,
  Clock,
  PlusCircle,
  Filter,
  Search,
  Truck,
  Gauge,
  Thermometer,
  Zap,
  Disc,
  Droplet,
  FileText,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const MaintenanceDashboard = ({
  maintenanceData,
  vehicles = [],
  onScheduleService,
  activeSubTab = 'dashboard',
  onSelectTab
}) => {
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fallback initial data if needed
  const records = maintenanceData?.records || [
    {
      id: 'M-401',
      vehicleReg: 'TTC-1088-UT',
      serviceType: 'Transmission & Differential Flush',
      description: 'Scheduled high-mileage fluid overhaul and torque converter diagnostic.',
      status: 'Under Repair',
      scheduledDate: '2026-11-18',
      completedDate: null,
      cost: '₹14,800',
      serviceCenter: 'TTC Certified Service Shop, Gary IN',
      technician: 'Rajesh Sharma (Master Tech)',
      priority: 'High',
      bay: 'Bay-02'
    },
    {
      id: 'M-402',
      vehicleReg: 'TTC-7203-DV',
      serviceType: 'Brake Caliper & Rotor Replacement',
      description: 'Front axle brake pad wear reached 3mm limit during pre-trip inspection.',
      status: 'Under Repair',
      scheduledDate: '2026-11-19',
      completedDate: null,
      cost: '₹8,200',
      serviceCenter: 'Northside Commercial Fleet Repair, Chicago IL',
      technician: 'Carlos Mendez',
      priority: 'Critical',
      bay: 'Bay-01'
    },
    {
      id: 'M-403',
      vehicleReg: 'TTC-8492-HD',
      serviceType: 'A-Service Preventive Maintenance',
      description: 'Oil, lube, fuel filters, tire rotation, 90-point safety inspection.',
      status: 'Upcoming',
      scheduledDate: '2026-11-24',
      completedDate: null,
      cost: '₹4,500',
      serviceCenter: 'Central Logistics Yard Maintenance Bay, Chicago IL',
      technician: 'Dave Kowalski',
      priority: 'Medium',
      bay: 'Bay-04'
    },
    {
      id: 'M-404',
      vehicleReg: 'TTC-3105-EV',
      serviceType: 'Electric Powertrain Inverter Calibration',
      description: 'High-voltage thermal management diagnostics and firmware update.',
      status: 'Upcoming',
      scheduledDate: '2026-11-26',
      completedDate: null,
      cost: '₹6,400',
      serviceCenter: 'Tesla Commercial Fleet Hub, Naperville IL',
      technician: 'Ananya Roy (EV Specialist)',
      priority: 'Low',
      bay: 'EV Bay'
    },
    {
      id: 'M-405',
      vehicleReg: 'TTC-5520-RF',
      serviceType: 'ThermoKing Refrigeration Unit Compressor Service',
      description: 'Reefer coolant recharge, temperature sensor calibration.',
      status: 'Completed',
      scheduledDate: '2026-11-14',
      completedDate: '2026-11-15',
      cost: '₹8,600',
      serviceCenter: 'ThermoKing Authorized Dealer, Milwaukee WI',
      technician: 'Mike Gallagher',
      priority: 'High',
      bay: 'Reefer Bay'
    }
  ];

  // Driver/sensor repair requests
  const [repairRequests, setRepairRequests] = useState([
    {
      id: 'REQ-101',
      vehicleReg: 'TTC-7203-DV',
      title: 'Front Brake Grinding Noise',
      reportedBy: 'Driver Marcus Vance',
      reportedAt: 'Today, 08:30 AM',
      severity: 'Critical',
      status: 'Assigned',
      assignedTech: 'Carlos Mendez'
    },
    {
      id: 'REQ-102',
      vehicleReg: 'TTC-8493-HD',
      title: 'Trailer Air Line Coupling Leak',
      reportedBy: 'Driver Elena Rostova',
      reportedAt: 'Yesterday, 04:15 PM',
      severity: 'Medium',
      status: 'Pending Review',
      assignedTech: 'Unassigned'
    },
    {
      id: 'REQ-103',
      vehicleReg: 'TTC-3106-EV',
      title: 'Tire Pressure Warning (Rear Right)',
      reportedBy: 'Telematics OBD Sensor',
      reportedAt: 'Today, 09:10 AM',
      severity: 'Low',
      status: 'Under Bay Review',
      assignedTech: 'Dave Kowalski'
    }
  ]);

  // Vehicle Health Diagnostics Data
  const fleetHealth = [
    {
      reg: 'TTC-8492-HD',
      model: 'Freightliner Cascadia Evolution',
      category: 'Heavy Duty Truck',
      odometer: '74,210 km',
      healthScore: 92,
      engineTemp: '88°C (Normal)',
      oilLife: 78,
      brakeWear: 72,
      tirePsi: '105 PSI (Good)',
      batteryHealth: 98,
      status: 'Certified Safe'
    },
    {
      reg: 'TTC-8493-HD',
      model: 'Volvo VNL 860 Globetrotter',
      category: 'Heavy Duty Truck',
      odometer: '41,800 km',
      healthScore: 96,
      engineTemp: '85°C (Normal)',
      oilLife: 88,
      brakeWear: 84,
      tirePsi: '108 PSI (Optimal)',
      batteryHealth: 100,
      status: 'Certified Safe'
    },
    {
      reg: 'TTC-7203-DV',
      model: 'Ford Transit 350 HD',
      category: 'Delivery Van',
      odometer: '88,400 km',
      healthScore: 68,
      engineTemp: '94°C (Elevated)',
      oilLife: 42,
      brakeWear: 28,
      tirePsi: '72 PSI (Low)',
      batteryHealth: 82,
      status: 'Under Repair'
    },
    {
      reg: 'TTC-3105-EV',
      model: 'Tesla Semi 500-Mile',
      category: 'Electric Cargo',
      odometer: '28,400 km',
      healthScore: 99,
      engineTemp: '42°C (Coolant OK)',
      oilLife: 100,
      brakeWear: 94,
      tirePsi: '112 PSI (Optimal)',
      batteryHealth: 99,
      status: 'Certified Safe'
    },
    {
      reg: 'TTC-5520-RF',
      model: 'Isuzu NQR ThermoKing Reefer',
      category: 'Refrigerated Truck',
      odometer: '92,300 km',
      healthScore: 89,
      engineTemp: '87°C (Normal)',
      oilLife: 65,
      brakeWear: 76,
      tirePsi: '95 PSI (Good)',
      batteryHealth: 94,
      status: 'Certified Safe'
    }
  ];

  const handleUpdateReqStatus = (id, newStatus) => {
    setRepairRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // Filtered records
  const filteredRecords = records.filter(r => {
    const matchSearch =
      r.vehicleReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.technician && r.technician.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchPriority = filterPriority === 'ALL' || r.priority === filterPriority;
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchSearch && matchPriority && matchStatus;
  });

  return (
    <div className="maintenance-dashboard-root" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Maintenance Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: '#FBBF24',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.04em'
              }}
            >
              PREDICTIVE MAINTENANCE & ASSET HEALTH
            </span>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>• Certified Workshop Operations</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Maintenance & Service Command Center
          </h1>
          <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
            Automate periodic overhauls, monitor real-time vehicle telematics health, approve driver repair tickets, and maintain 100% regulatory compliance.
          </p>
        </div>

        {onScheduleService && (
          <button
            onClick={onScheduleService}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F59E0B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 22px',
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              flexShrink: 0
            }}
          >
            <PlusCircle size={17} />
            <span>Schedule Service Overhaul</span>
          </button>
        )}
      </div>

      {/* 2. 5 Maintenance KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        {/* Due for Service */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #FDE68A',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AlertTriangle size={22} color="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#B45309', fontWeight: '600' }}>Due for Service</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#92400E', lineHeight: 1.1 }}>
              {maintenanceData?.dueForServiceCount ?? 3}
            </div>
            <div style={{ fontSize: '11px', color: '#B45309', marginTop: '2px' }}>Immediate attention</div>
          </div>
        </div>

        {/* Under Active Repair */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E9D5FF',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#FAF5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Wrench size={22} color="#7E22CE" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#7E22CE', fontWeight: '600' }}>Under Active Repair</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#6B21A8', lineHeight: 1.1 }}>
              {maintenanceData?.underRepairCount ?? 2}
            </div>
            <div style={{ fontSize: '11px', color: '#7E22CE', marginTop: '2px' }}>In certified service bays</div>
          </div>
        </div>

        {/* Upcoming Service */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #BFDBFE',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Calendar size={22} color="#1D4ED8" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: '600' }}>Upcoming Overhauls</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E40AF', lineHeight: 1.1 }}>
              {maintenanceData?.upcomingMaintenanceCount ?? 5}
            </div>
            <div style={{ fontSize: '11px', color: '#1D4ED8', marginTop: '2px' }}>Next 14 business days</div>
          </div>
        </div>

        {/* Completed MTD */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #A7F3D0',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle size={22} color="#047857" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#047857', fontWeight: '600' }}>Completed (MTD)</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#065F46', lineHeight: 1.1 }}>
              {maintenanceData?.completedThisMonthCount ?? 14}
            </div>
            <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>All inspections passed</div>
          </div>
        </div>

        {/* Monthly Expense */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #FED7AA',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#FFF7ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Zap size={22} color="#EA580C" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#EA580C', fontWeight: '600' }}>Monthly Maintenance Outlay</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#C2410C', lineHeight: 1.1 }}>
              {typeof maintenanceData?.monthlyExpense === 'number'
                ? `₹${maintenanceData.monthlyExpense.toLocaleString()}`
                : maintenanceData?.monthlyExpense || '₹42,500'}
            </div>
            <div style={{ fontSize: '11px', color: '#EA580C', marginTop: '2px' }}>Workshop & parts costs</div>
          </div>
        </div>
      </div>

      {/* 3. Subview Navigation Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '12px',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'dashboard', label: 'All Maintenance Overview', icon: Activity },
          { id: 'schedules', label: 'Scheduled Overhauls', icon: Calendar },
          { id: 'history', label: 'Service History', icon: History },
          { id: 'requests', label: 'Driver Repair Requests', icon: AlertTriangle, count: repairRequests.length },
          { id: 'health', label: 'Vehicle Health Diagnostics', icon: Gauge },
          { id: 'compliance', label: 'Compliance & Safety Docs', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = (activeSubTab || 'dashboard') === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                border: isActive ? '1px solid #F59E0B' : '1px solid #E2E8F0',
                backgroundColor: isActive ? '#FEF3C7' : '#FFFFFF',
                color: isActive ? '#92400E' : '#475569',
                fontSize: '12.5px',
                fontWeight: isActive ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={14} color={isActive ? '#D97706' : '#64748B'} />
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  style={{
                    backgroundColor: isActive ? '#D97706' : '#E2E8F0',
                    color: isActive ? '#FFFFFF' : '#475569',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '10.5px'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. MAIN CONTENT AREA BASED ON SUBTAB */}

      {/* TAB A: OVERVIEW & SCHEDULES */}
      {(!activeSubTab || activeSubTab === 'dashboard' || activeSubTab === 'schedules') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Work Orders & Active Schedules Table */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: '0 0 2px 0' }}>
                  Maintenance Work Orders & Service Schedules
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                  Active repairs, bay assignments, and upcoming scheduled overhauls
                </p>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    backgroundColor: '#F8FAFC',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Under Repair">Under Repair</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    backgroundColor: '#F8FAFC',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                    <th style={{ padding: '10px 12px' }}>Order ID</th>
                    <th style={{ padding: '10px 12px' }}>Vehicle Reg</th>
                    <th style={{ padding: '10px 12px' }}>Service Type</th>
                    <th style={{ padding: '10px 12px' }}>Workshop / Bay</th>
                    <th style={{ padding: '10px 12px' }}>Assigned Tech</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px' }}>Est. Cost</th>
                    <th style={{ padding: '10px 12px' }}>Priority</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r, i) => (
                    <tr
                      key={r.id || i}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                      }}
                    >
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#1E293B' }}>{r.id}</td>
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#2563EB' }}>{r.vehicleReg}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: '600', color: '#0F172A' }}>{r.serviceType}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{r.description}</div>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#475569' }}>
                        <div>{r.bay || 'General Staging Bay'}</div>
                        <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{r.serviceCenter}</div>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#0F172A', fontWeight: '500' }}>
                        {r.technician || 'Dave Kowalski'}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#64748B' }}>{r.scheduledDate}</td>
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#047857' }}>{r.cost}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor:
                              r.priority === 'Critical'
                                ? '#FEE2E2'
                                : r.priority === 'High'
                                ? '#FEF3C7'
                                : '#EFF6FF',
                            color:
                              r.priority === 'Critical'
                                ? '#B91C1C'
                                : r.priority === 'High'
                                ? '#B45309'
                                : '#1D4ED8'
                          }}
                        >
                          {r.priority}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor:
                              r.status === 'Completed'
                                ? '#ECFDF5'
                                : r.status === 'Under Repair'
                                ? '#FAF5FF'
                                : '#EFF6FF',
                            color:
                              r.status === 'Completed'
                                ? '#047857'
                                : r.status === 'Under Repair'
                                ? '#7E22CE'
                                : '#1D4ED8'
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two Column Grid: Driver Repair Requests + Vehicle Health Telematics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
            {/* Urgent Driver Repair Requests */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 2px 0' }}>
                    Incoming Repair Requests
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>Driver defect slips & sensor flags</p>
                </div>
                <span
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}
                >
                  3 Active
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {repairRequests.map(req => (
                  <div
                    key={req.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      backgroundColor: req.severity === 'Critical' ? '#FFF5F5' : '#FAFAFA',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A' }}>{req.title}</span>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            padding: '1px 6px',
                            borderRadius: '6px',
                            backgroundColor: req.severity === 'Critical' ? '#EF4444' : '#F59E0B',
                            color: '#FFFFFF'
                          }}
                        >
                          {req.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px' }}>
                        Asset: <strong style={{ color: '#2563EB' }}>{req.vehicleReg}</strong> • {req.reportedBy} ({req.reportedAt})
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                        Technician: {req.assignedTech} • Status: <strong style={{ color: '#7E22CE' }}>{req.status}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {req.status !== 'Assigned' && (
                        <button
                          onClick={() => handleUpdateReqStatus(req.id, 'Assigned')}
                          style={{
                            padding: '6px 10px',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Assign Bay
                        </button>
                      )}
                      {req.status === 'Assigned' && (
                        <button
                          onClick={() => handleUpdateReqStatus(req.id, 'Resolved in Bay')}
                          style={{
                            padding: '6px 10px',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Ready
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Health & Diagnostic Telemetry Radar */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 2px 0' }}>
                    Fleet Vehicle Health Overview
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>Live telematics diagnostic sensors</p>
                </div>
                <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: '700' }}>● All 16 Units Online</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fleetHealth.slice(0, 4).map(v => (
                  <div
                    key={v.reg}
                    style={{
                      border: '1px solid #F1F5F9',
                      borderRadius: '10px',
                      padding: '12px',
                      backgroundColor: '#FAFAFA'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div>
                        <strong style={{ color: '#1E293B', fontSize: '13px' }}>{v.reg}</strong>
                        <span style={{ fontSize: '11.5px', color: '#64748B', marginLeft: '6px' }}>{v.model}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: v.healthScore > 85 ? '#ECFDF5' : '#FEF3C7',
                          color: v.healthScore > 85 ? '#047857' : '#B45309'
                        }}
                      >
                        Health {v.healthScore}%
                      </span>
                    </div>

                    {/* Sensor bars */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '11px', color: '#475569' }}>
                      <div>
                        <div style={{ color: '#94A3B8' }}>Oil Life</div>
                        <strong style={{ color: v.oilLife < 50 ? '#EF4444' : '#0F172A' }}>{v.oilLife}%</strong>
                      </div>
                      <div>
                        <div style={{ color: '#94A3B8' }}>Brake Pad</div>
                        <strong style={{ color: v.brakeWear < 40 ? '#EF4444' : '#0F172A' }}>{v.brakeWear}%</strong>
                      </div>
                      <div>
                        <div style={{ color: '#94A3B8' }}>Engine Temp</div>
                        <strong style={{ color: '#0F172A' }}>{v.engineTemp.split(' ')[0]}</strong>
                      </div>
                      <div>
                        <div style={{ color: '#94A3B8' }}>Battery</div>
                        <strong style={{ color: '#0F172A' }}>{v.batteryHealth}%</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: SERVICE HISTORY */}
      {activeSubTab === 'history' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}
        >
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>
            Historical Service & Maintenance Log
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px 0' }}>
            Archived work orders, parts receipts, invoice breakdowns, and master technician signoffs
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '10px 12px' }}>Order ID</th>
                  <th style={{ padding: '10px 12px' }}>Vehicle</th>
                  <th style={{ padding: '10px 12px' }}>Service Performed</th>
                  <th style={{ padding: '10px 12px' }}>Facility</th>
                  <th style={{ padding: '10px 12px' }}>Lead Technician</th>
                  <th style={{ padding: '10px 12px' }}>Completion Date</th>
                  <th style={{ padding: '10px 12px' }}>Total Invoiced</th>
                  <th style={{ padding: '10px 12px' }}>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id || i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: '700' }}>{r.id}</td>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#2563EB' }}>{r.vehicleReg}</td>
                    <td style={{ padding: '10px 12px' }}>{r.serviceType}</td>
                    <td style={{ padding: '10px 12px', color: '#64748B' }}>{r.serviceCenter}</td>
                    <td style={{ padding: '10px 12px' }}>{r.technician || 'Dave Kowalski'}</td>
                    <td style={{ padding: '10px 12px', color: '#64748B' }}>{r.completedDate || r.scheduledDate}</td>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#047857' }}>{r.cost}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ color: '#059669', fontWeight: '700', fontSize: '11px' }}>✓ Passed Safety</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: VEHICLE HEALTH DETAILS */}
      {activeSubTab === 'health' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {fleetHealth.map(v => (
            <div
              key={v.reg}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{v.reg}</h4>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>{v.model} ({v.category})</span>
                </div>
                <span
                  style={{
                    backgroundColor: v.healthScore > 85 ? '#ECFDF5' : '#FEF3C7',
                    color: v.healthScore > 85 ? '#047857' : '#B45309',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '12px'
                  }}
                >
                  {v.healthScore}% Health
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '12px' }}>
                Odometer: <strong>{v.odometer}</strong> • Status: <strong style={{ color: '#2563EB' }}>{v.status}</strong>
              </div>

              {/* Progress bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Engine & Transmission Health</span>
                    <strong>{v.oilLife}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${v.oilLife}%`, height: '100%', backgroundColor: v.oilLife < 50 ? '#EF4444' : '#10B981' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Brake Friction Material</span>
                    <strong>{v.brakeWear}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${v.brakeWear}%`, height: '100%', backgroundColor: v.brakeWear < 40 ? '#EF4444' : '#3B82F6' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Battery Health / Alternator</span>
                    <strong>{v.batteryHealth}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${v.batteryHealth}%`, height: '100%', backgroundColor: '#10B981' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB D: COMPLIANCE & SAFETY DOCS */}
      {activeSubTab === 'compliance' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}
        >
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>
            Fleet Safety Documents & Statutory Compliance Watchlist
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px 0' }}>
            Pollution Under Control (PUC), annual fitness certificates, state carrier permits, and commercial cargo insurance
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {[
              { reg: 'TTC-8494-HD', doc: 'Commercial Cargo Insurance', days: 12, expiry: 'Dec 05, 2026', status: 'Renewal Pending', alert: true },
              { reg: 'TTC-7203-DV', doc: 'Annual Vehicle Fitness Certificate', days: 18, expiry: 'Dec 11, 2026', status: 'Scheduled for Bay', alert: true },
              { reg: 'TTC-8492-HD', doc: 'PUC Emissions Compliance Certificate', days: 64, expiry: 'Jan 26, 2027', status: 'Valid (Level 1)', alert: false },
              { reg: 'TTC-3105-EV', doc: 'EV High-Voltage Safety Permit', days: 180, expiry: 'May 22, 2027', status: 'Valid (Certified)', alert: false }
            ].map((d, i) => (
              <div
                key={i}
                style={{
                  border: d.alert ? '1px solid #FECACA' : '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '14px',
                  backgroundColor: d.alert ? '#FFF5F5' : '#FAFAFA'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#2563EB', fontSize: '13px' }}>{d.reg}</strong>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      backgroundColor: d.alert ? '#EF4444' : '#10B981',
                      color: '#FFFFFF'
                    }}
                  >
                    {d.status}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#0F172A', marginTop: '6px' }}>
                  {d.doc}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
                  Expires: <strong>{d.expiry}</strong> ({d.days} days remaining)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
