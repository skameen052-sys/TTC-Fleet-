import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SubscriptionCards = ({ plans, onSelectPlan }) => {
  const navigate = useNavigate();

  const defaultPlans = [
    {
      id: 1,
      planName: 'Basic',
      monthlyPrice: 999,
      activeUsersFormatted: '1,240',
      isPopular: false,
    },
    {
      id: 2,
      planName: 'Premium',
      monthlyPrice: 2499,
      activeUsersFormatted: '2,850',
      isPopular: true,
    },
    {
      id: 3,
      planName: 'Enterprise',
      monthlyPrice: 4999,
      activeUsersFormatted: '1,120',
      isPopular: false,
    },
  ];

  const list = plans && plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <div className="card-title">
          <Crown size={18} color="#f97316" />
          <span>Subscription Overview</span>
        </div>
        <div
          className="card-action-link"
          onClick={() => navigate('/subscriptions')}
        >
          <span>View Plans</span>
          <ArrowRight size={13} />
        </div>
      </div>

      <div className="sub-plans-row">
        {list.map((p) => {
          const isPopular = p.isPopular || p.planName === 'Premium';
          const price = typeof p.monthlyPrice === 'number' ? p.monthlyPrice : parseInt(p.monthlyPrice || '999');
          const usersText = p.activeUsersFormatted || (p.planName === 'Basic' ? '1,240' : p.planName === 'Premium' ? '2,850' : '1,120');

          return (
            <div
              key={p.id || p.planName}
              className={`plan-tier-card ${isPopular ? 'popular' : ''}`}
            >
              {isPopular && <div className="popular-badge">Most Popular</div>}

              <div>
                <div className="plan-name">{p.planName}</div>
                <div className="plan-price">₹{price.toLocaleString()}<span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>/month</span></div>
                <div className="plan-users">
                  👥 Active Users<br /><strong>{usersText}</strong>
                </div>
              </div>

              <button
                className="choose-plan-btn"
                onClick={() => onSelectPlan ? onSelectPlan(p) : navigate('/subscriptions')}
              >
                Choose Plan
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
