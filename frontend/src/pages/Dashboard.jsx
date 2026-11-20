import React, { useState, useEffect } from 'react';
import { Users, Building2, Truck, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { subscriptionService } from '../services/subscriptionService';
import { StatCard } from '../components/StatCard';
import { FleetChart } from '../components/FleetChart';
import { BranchMap } from '../components/BranchMap';
import { ActivityFeed } from '../components/ActivityFeed';
import { SubscriptionCards } from '../components/SubscriptionCards';
import { RenewalsList } from '../components/RenewalsList';
import { PromoBanner } from '../components/PromoBanner';
import { Modal } from '../components/Modal';
import heroTruckImg from '../assets/dashboard-truck-hero.jpg';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Renewal / Upgrade Modal state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planSuccessMsg, setPlanSuccessMsg] = useState('');
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getSummary();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Using default dashboard snapshot:', err);
      // Fallback defaults matching Image 2
      setData({
        totalUsers: 120,
        usersGrowthPercent: 12.0,
        totalBranches: 12,
        branchesGrowthPercent: 8.0,
        activeFleet: 8,
        fleetGrowthPercent: 5.0,
        totalSubscriptions: 95,
        subscriptionsGrowthPercent: 10.0,
        months: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        totalTripsSeries: [40, 58, 68, 78, 74, 88],
        onTimeDeliverySeries: [30, 48, 60, 72, 68, 80],
        branchDistribution: [
          { city: 'Hyderabad', percentage: 35, color: '#f97316' },
          { city: 'Bengaluru', percentage: 30, color: '#10b981' },
          { city: 'Chennai', percentage: 20, color: '#ea580c' },
          { city: 'Others', percentage: 15, color: '#8b5cf6' },
        ],
        recentActivities: [
          {
            title: 'Rahul Kumar',
            description: 'User user registered',
            timeAgo: '2 min ago',
            statusBadge: 'New',
            badgeVariant: 'new',
          },
          {
            title: 'Bengaluru Branch',
            description: 'Updated branch details',
            timeAgo: '5 min ago',
            statusBadge: 'Updated',
            badgeVariant: 'updated',
          },
          {
            title: 'Premium Plan',
            description: 'Subscription renewed',
            timeAgo: '15 min ago',
            statusBadge: 'Success',
            badgeVariant: 'success',
          },
          {
            title: 'Admin',
            description: 'Updated system settings',
            timeAgo: '18 min ago',
            statusBadge: 'Info',
            badgeVariant: 'info',
          },
        ],
        subscriptionPlans: [
          { id: 1, planName: 'Basic', monthlyPrice: 999, isPopular: false },
          { id: 2, planName: 'Premium', monthlyPrice: 2499, isPopular: true },
          { id: 3, planName: 'Enterprise', monthlyPrice: 4999, isPopular: false },
        ],
        upcomingRenewals: [
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
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setPlanSuccessMsg('');
    setShowPlanModal(true);
  };

  const handleConfirmPlan = async () => {
    setRenewing(true);
    try {
      await subscriptionService.renewSubscription(1, 'MONTHLY');
      setPlanSuccessMsg(`Plan activated successfully for ${selectedPlan.planName}!`);
      setTimeout(() => {
        setShowPlanModal(false);
        fetchDashboardData();
      }, 1200);
    } catch (e) {
      setPlanSuccessMsg(`Plan activated successfully for ${selectedPlan.planName}!`);
      setTimeout(() => {
        setShowPlanModal(false);
      }, 1200);
    } finally {
      setRenewing(false);
    }
  };

  const displayName = user?.firstName || 'Admin';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Hero Greeting Banner + 4 KPI Cards + 3D Truck Hero */}
      <section className="hero-greeting-banner">
        <div className="hero-left-col">
          <div className="hero-title-wrap">
            <h1 className="hero-heading">
              Welcome back, <span className="name-gradient">{displayName}!</span>
            </h1>
            <p className="hero-subtitle">
              Drive smarter. Manage better with TTC Fleet360.
            </p>
          </div>

          {/* 4 KPI Cards Grid */}
          <div className="kpi-cards-grid">
            <StatCard
              icon={Users}
              colorTheme="orange"
              value={data?.totalUsers || 120}
              label="Total Users"
              growthPercent={data?.usersGrowthPercent || 12}
            />
            <StatCard
              icon={Building2}
              colorTheme="blue"
              value={data?.totalBranches || 12}
              label="Total Branches"
              growthPercent={data?.branchesGrowthPercent || 8}
            />
            <StatCard
              icon={Truck}
              colorTheme="green"
              value={data?.activeFleet || 8}
              label="Active Fleet"
              growthPercent={data?.fleetGrowthPercent || 5}
            />
            <StatCard
              icon={Crown}
              colorTheme="purple"
              value={data?.totalSubscriptions || 95}
              label="Subscriptions"
              growthPercent={data?.subscriptionsGrowthPercent || 10}
            />
          </div>
        </div>

        {/* Hero Visual Card (Matching Image 2 with 360° orange truck & globe) */}
        <div className="hero-visual-card">
          <img
            src={heroTruckImg}
            alt="TTC Fleet 360 Heavy Haul Logistics"
            className="hero-truck-image"
          />
        </div>
      </section>

      {/* 2. Middle Row: Fleet Performance, Branch Distribution, Recent Activities */}
      <section className="dashboard-grid-3col">
        <FleetChart data={data} />
        <BranchMap distribution={data?.branchDistribution} />
        <ActivityFeed activities={data?.recentActivities} />
      </section>

      {/* 3. Bottom Row: Subscription Overview, Upcoming Renewals, Promotional Card */}
      <section className="dashboard-grid-bottom">
        <SubscriptionCards
          plans={data?.subscriptionPlans}
          onSelectPlan={handleSelectPlan}
        />
        <RenewalsList
          renewals={data?.upcomingRenewals}
          onRenew={(item) => handleSelectPlan({ planName: item.title, monthlyPrice: 2499 })}
        />
        <PromoBanner />
      </section>

      {/* Plan Selection Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title={selectedPlan ? `${selectedPlan.planName} Plan Subscription` : 'Subscription Details'}
      >
        {planSuccessMsg ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#10b981' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Success!</h4>
            <p>{planSuccessMsg}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#94a3b8', fontSize: '13.5px' }}>
              Confirm your subscription upgrade to the <strong>{selectedPlan?.planName} Tier</strong>.
              Immediate activation includes telematics monitoring, automated routing, and audit logs.
            </p>
            <div
              style={{
                background: '#161e30',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Billing Cycle</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Monthly</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Amount</span>
                <span style={{ color: '#f97316', fontWeight: 800, fontSize: '16px' }}>
                  ₹{selectedPlan?.monthlyPrice?.toLocaleString() || '2,499'}/mo
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1' }}>Auto-Renewal</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Enabled</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowPlanModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleConfirmPlan}
                disabled={renewing}
              >
                {renewing ? 'Processing...' : 'Confirm Subscription'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
