import React from 'react';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RenewalsList = ({ renewals, onRenew }) => {
  const navigate = useNavigate();

  const defaultRenewals = [
    {
      title: 'Premium Plan',
      company: 'Acme Corp',
      expiryBadge: 'Expires in 7 days',
      badgeColor: 'red',
    },
    {
      title: 'Standard Plan',
      company: 'Tech Solutions',
      expiryBadge: 'Expires in 7 days',
      badgeColor: 'orange',
    },
    {
      title: 'Basic Plan',
      company: 'Logistics Ltd',
      expiryBadge: 'Choose in 10 days',
      badgeColor: 'blue',
    },
  ];

  const list = renewals && renewals.length > 0 ? renewals : defaultRenewals;

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <div className="card-title">
          <CalendarClock size={18} color="#f97316" />
          <span>Upcoming Renewals</span>
        </div>
        <div
          className="card-action-link"
          onClick={() => navigate('/subscriptions')}
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </div>
      </div>

      <div className="renewals-list">
        {list.map((r, idx) => (
          <div key={idx} className="renewal-item">
            <div>
              <div className="renewal-item-title">
                {r.title} - <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{r.company}</span>
              </div>
              <div className="renewal-item-sub">Auto-renewal active</div>
            </div>

            <span
              className={`expiry-badge badge-${r.badgeColor || 'orange'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onRenew && onRenew(r)}
            >
              {r.expiryBadge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
