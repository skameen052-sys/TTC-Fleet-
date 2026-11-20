import React from 'react';
import {
  Truck,
  Activity,
  CheckCircle2,
  Navigation,
  Wrench,
  AlertTriangle,
  Users,
  UserCheck
} from 'lucide-react';

export const SummaryCards = ({ metrics, onCardClick }) => {
  const cards = [
    {
      id: 'total-vehicles',
      title: 'Total Vehicles',
      value: metrics?.totalVehicles ?? 120,
      icon: Truck,
      iconColor: '#3478F6',
      bgColor: '#EBF3FF',
      filterTarget: 'vehicles'
    },
    {
      id: 'active-vehicles',
      title: 'Active Vehicles',
      value: metrics?.activeVehicles ?? 95,
      icon: Activity,
      iconColor: '#16A36A',
      bgColor: '#E8F8F0',
      filterTarget: 'vehicles'
    },
    {
      id: 'available-vehicles',
      title: 'Available Vehicles',
      value: metrics?.availableVehicles ?? 21,
      icon: CheckCircle2,
      iconColor: '#16A36A',
      bgColor: '#E8F8F0',
      filterTarget: 'availability'
    },
    {
      id: 'on-trip-vehicles',
      title: 'Vehicles On Trip',
      value: metrics?.vehiclesOnTrip ?? 74,
      icon: Navigation,
      iconColor: '#3478F6',
      bgColor: '#EBF3FF',
      filterTarget: 'tracking'
    },
    {
      id: 'under-maintenance',
      title: 'Under Maintenance',
      value: metrics?.vehiclesUnderMaintenance ?? 4,
      icon: Wrench,
      iconColor: '#7955E8',
      bgColor: '#F3EEFF',
      filterTarget: 'maintenance'
    },
    {
      id: 'inactive-vehicles',
      title: 'Inactive Vehicles',
      value: metrics?.inactiveVehicles ?? 0,
      icon: AlertTriangle,
      iconColor: '#EF5350',
      bgColor: '#FEECEC',
      filterTarget: 'vehicles'
    },
    {
      id: 'total-drivers',
      title: 'Total Drivers',
      value: metrics?.totalDrivers ?? 110,
      icon: Users,
      iconColor: '#FF7A1A',
      bgColor: '#FFF0E5',
      filterTarget: 'driver-assignment'
    },
    {
      id: 'available-drivers',
      title: 'Available Drivers',
      value: metrics?.availableDrivers ?? 26,
      icon: UserCheck,
      iconColor: '#16A36A',
      bgColor: '#E8F8F0',
      filterTarget: 'driver-assignment'
    }
  ];

  return (
    <div className="summary-cards-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="kpi-stat-card"
            onClick={() => onCardClick && onCardClick(card.filterTarget)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCardClick && onCardClick(card.filterTarget);
              }
            }}
          >
            <div
              className="kpi-card-icon-box"
              style={{ backgroundColor: card.bgColor }}
            >
              <Icon size={26} color={card.iconColor} strokeWidth={2.2} />
            </div>

            <div className="kpi-card-info">
              <span className="kpi-card-label">{card.title}</span>
              <span className="kpi-card-value">{card.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
