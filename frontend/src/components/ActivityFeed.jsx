import React from 'react';
import { Clock, ArrowRight, User, Building, CreditCard, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ActivityFeed = ({ activities }) => {
  const navigate = useNavigate();

  const defaultActivities = [
    {
      title: 'Rahul Kumar',
      description: 'User user registered',
      timeAgo: '2 min ago',
      statusBadge: 'New',
      badgeVariant: 'new',
      icon: User,
    },
    {
      title: 'Bengaluru Branch',
      description: 'Updated branch details',
      timeAgo: '5 min ago',
      statusBadge: 'Updated',
      badgeVariant: 'updated',
      icon: Building,
    },
    {
      title: 'Premium Plan',
      description: 'Subscription renewed',
      timeAgo: '15 min ago',
      statusBadge: 'Success',
      badgeVariant: 'success',
      icon: CreditCard,
    },
    {
      title: 'Admin',
      description: 'Updated system settings',
      timeAgo: '18 min ago',
      statusBadge: 'Info',
      badgeVariant: 'info',
      icon: Settings,
    },
  ];

  const list = activities && activities.length > 0 ? activities : defaultActivities;

  const getIconForTitle = (title) => {
    if (title.toLowerCase().includes('branch')) return Building;
    if (title.toLowerCase().includes('plan')) return CreditCard;
    if (title.toLowerCase().includes('admin')) return Settings;
    return User;
  };

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <div className="card-title">
          <Clock size={18} color="#f97316" />
          <span>Recent Activities</span>
        </div>
        <div
          className="card-action-link"
          onClick={() => navigate('/audit-logs')}
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </div>
      </div>

      <div className="activity-list">
        {list.map((item, idx) => {
          const Icon = item.icon || getIconForTitle(item.title);
          return (
            <div key={idx} className="activity-item">
              <div className="activity-left">
                <div className="activity-icon">
                  <Icon size={14} />
                </div>
                <div>
                  <div className="activity-title">{item.title}</div>
                  <div className="activity-sub">
                    {item.description} • {item.timeAgo}
                  </div>
                </div>
              </div>

              <span className={`activity-badge badge-${item.badgeVariant || 'info'}`}>
                {item.statusBadge}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
