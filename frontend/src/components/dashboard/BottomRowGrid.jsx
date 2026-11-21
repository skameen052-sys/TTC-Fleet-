import React from 'react';
import {
  Crown,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  Truck
} from 'lucide-react';

export const BottomRowGrid = ({ onNavigate, onSelectPlan }) => {
  return (
    <div className="dashboard-grid-bottom">
      {/* 1. Subscription Overview Card */}
      <div className="dashboard-card">
        <div className="card-header-row">
          <div className="card-title">
            <Crown size={16} color="#f97316" />
            <span>Subscription Overview</span>
          </div>
          <div
            className="card-action-link"
            onClick={() => onNavigate && onNavigate('subscriptions')}
          >
            <span>View Plans</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="sub-plans-row">
          {/* Basic Plan */}
          <div className="plan-tier-card">
            <div>
              <div className="plan-name">Basic</div>
              <div className="plan-price">₹999<span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>/month</span></div>
              <div className="plan-users">
                <span style={{ color: '#cbd5e1' }}>👤 Active Users: </span>
                <strong style={{ color: '#fff' }}>1,240</strong>
              </div>
            </div>
            <button
              className="choose-plan-btn"
              onClick={() => onSelectPlan && onSelectPlan('Basic')}
            >
              Choose Plan
            </button>
          </div>

          {/* Premium Plan (Most Popular) */}
          <div className="plan-tier-card popular">
            <div className="popular-badge">Most Popular</div>
            <div>
              <div className="plan-name" style={{ color: '#f59e0b' }}>Premium</div>
              <div className="plan-price" style={{ color: '#fbbf24' }}>₹2,499<span style={{ fontSize: '11px', color: '#fde68a', fontWeight: 500 }}>/month</span></div>
              <div className="plan-users">
                <span style={{ color: '#cbd5e1' }}>👤 Active Users: </span>
                <strong style={{ color: '#fff' }}>2,850</strong>
              </div>
            </div>
            <button
              className="choose-plan-btn"
              onClick={() => onSelectPlan && onSelectPlan('Premium')}
            >
              Choose Plan
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="plan-tier-card">
            <div>
              <div className="plan-name">Enterprise</div>
              <div className="plan-price">₹4,999<span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>/month</span></div>
              <div className="plan-users">
                <span style={{ color: '#cbd5e1' }}>👤 Active Users: </span>
                <strong style={{ color: '#fff' }}>1,120</strong>
              </div>
            </div>
            <button
              className="choose-plan-btn"
              onClick={() => onSelectPlan && onSelectPlan('Enterprise')}
            >
              Choose Plan
            </button>
          </div>
        </div>
      </div>

      {/* 2. Upcoming Renewals Card */}
      <div className="dashboard-card">
        <div className="card-header-row">
          <div className="card-title">
            <Calendar size={16} color="#f97316" />
            <span>Upcoming Renewals</span>
          </div>
          <div
            className="card-action-link"
            onClick={() => onNavigate && onNavigate('subscriptions')}
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </div>
        </div>

        <div className="renewals-list">
          {/* Acme Corp */}
          <div className="renewal-item">
            <div>
              <div className="renewal-item-title">Premium Plan - Acme Corp</div>
              <div className="renewal-item-sub">Fleet: 42 Vehicles • Auto-Renew On</div>
            </div>
            <span className="expiry-badge badge-red">Expires in 7 days</span>
          </div>

          {/* Tech Solutions */}
          <div className="renewal-item">
            <div>
              <div className="renewal-item-title">Standard Plan - Tech Solutions</div>
              <div className="renewal-item-sub">Fleet: 18 Vehicles • Invoice Pending</div>
            </div>
            <span className="expiry-badge badge-orange">Expires in 7 days</span>
          </div>

          {/* Logistics Ltd */}
          <div className="renewal-item">
            <div>
              <div className="renewal-item-title">Basic Plan - Logistics Ltd</div>
              <div className="renewal-item-sub">Fleet: 8 Delivery Vans</div>
            </div>
            <span className="expiry-badge badge-blue">Choose in 10 days</span>
          </div>
        </div>
      </div>

      {/* 3. Promotional Truck Card matching Screenshot 2 */}
      <div className="promo-truck-card">
        <img
          src="/assets/dashboard-truck-hero.jpg"
          alt="TTC Fleet360 Productivity"
          className="promo-truck-bg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/fleet-manager-trucks.jpg';
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="promo-badge-tag">TTC Fleet360</div>
          <div className="promo-main-heading">
            Efficient Fleet.<br />Greater Productivity.
          </div>
          <div className="promo-body-text">
            Manage your logistics operations with ease and security.
          </div>
          <button
            className="promo-action-btn"
            onClick={() => onNavigate && onNavigate('configuration')}
          >
            <span>Explore Features</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
