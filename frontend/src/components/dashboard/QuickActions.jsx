import React from 'react';
import {
  PlusCircle,
  UserCheck,
  Fuel,
  Wrench,
  ClipboardCheck,
  MapPin,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const QuickActions = ({
  onAddVehicle,
  onAssignVehicle,
  onAddFuelRecord,
  onScheduleMaintenance,
  onRecordInspection,
  onViewLiveTracking
}) => {
  const actions = [
    {
      id: 'add-vehicle',
      title: 'Add Vehicle',
      desc: 'Register asset & VIN',
      icon: PlusCircle,
      iconColor: '#FF7A1A',
      bgColor: '#FFF0E5',
      action: onAddVehicle
    },
    {
      id: 'assign-vehicle',
      title: 'Assign Vehicle',
      desc: 'Pair driver & route',
      icon: UserCheck,
      iconColor: '#3478F6',
      bgColor: '#EBF3FF',
      action: onAssignVehicle
    },
    {
      id: 'add-fuel',
      title: 'Add Fuel Record',
      desc: 'Log liters, cost & odom',
      icon: Fuel,
      iconColor: '#16A36A',
      bgColor: '#E8F8F0',
      action: onAddFuelRecord
    },
    {
      id: 'schedule-maintenance',
      title: 'Schedule Maintenance',
      desc: 'Service bay work order',
      icon: Wrench,
      iconColor: '#7955E8',
      bgColor: '#F3EEFF',
      action: onScheduleMaintenance
    },
    {
      id: 'record-inspection',
      title: 'Record Inspection',
      desc: 'Pre/post trip checklist',
      icon: ClipboardCheck,
      iconColor: '#FF7A1A',
      bgColor: '#FFF5EB',
      action: onRecordInspection
    },
    {
      id: 'view-tracking',
      title: 'View Live Tracking',
      desc: 'Full-screen GPS radar',
      icon: MapPin,
      iconColor: '#3478F6',
      bgColor: '#EBF3FF',
      action: onViewLiveTracking
    }
  ];

  return (
    <div className="quick-actions-panel">
      {/* Header section with orange sparkles icon */}
      <div className="quick-actions-header">
        <div className="quick-actions-title-wrap">
          <div className="quick-actions-icon-badge">
            <Sparkles size={18} color="#FF7A1A" strokeWidth={2.4} />
          </div>
          <div>
            <h3 className="quick-actions-title">Quick Actions</h3>
            <p className="quick-actions-subtitle">
              Execute essential fleet dispatch and management workflows instantly
            </p>
          </div>
        </div>
      </div>

      {/* 3 columns x 2 rows grid */}
      <div className="quick-actions-grid-3x2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="action-card-item"
              onClick={act.action}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  act.action();
                }
              }}
            >
              <div
                className="action-card-icon-box"
                style={{ backgroundColor: act.bgColor }}
              >
                <Icon size={22} color={act.iconColor} strokeWidth={2.2} />
              </div>

              <div className="action-card-text">
                <span className="action-card-title">{act.title}</span>
                <span className="action-card-desc">{act.desc}</span>
              </div>

              <div className="action-card-chevron">
                <ChevronRight size={18} color="#94A3B8" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
